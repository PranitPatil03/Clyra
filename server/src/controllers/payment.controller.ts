import { Request, Response } from "express";
import Stripe from "stripe";
import { MongoClient, ObjectId } from "mongodb";
import { sendPremiumConfirmationEmail } from "../services/email.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia",
});

// Connect to the same MongoDB that better-auth uses
const mongoClient = new MongoClient(process.env.MONGODB_URI as string);
const db = mongoClient.db();

// better-auth session.user uses `id` (string), MongoDB stores `_id` as ObjectId
const getUserId = (user: any): string => user.id || String(user._id);

// Find user in better-auth's user collection
// _id is stored as ObjectId, so we must convert the string ID
async function findAuthUser(userId: string) {
  try {
    return await db.collection("user").findOne({ _id: new ObjectId(userId) });
  } catch (err) {
    // Fallback: try by email if ObjectId conversion fails
    console.error("findAuthUser error for userId:", userId, err);
    return null;
  }
}

// Update user in better-auth's user collection
async function updateAuthUser(userId: string, update: Record<string, any>) {
  return db.collection("user").updateOne(
    { _id: new ObjectId(userId) },
    { $set: update }
  );
}

export const createCheckoutSession = async (req: Request, res: Response) => {
  const user = req.user as any;
  const userId = getUserId(user);

  try {
    // Check if user already has a Stripe customer ID
    const dbUser = await findAuthUser(userId);
    let customerId = dbUser?.stripeCustomerId;

    if (!customerId) {
      // Create a Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });
      customerId = customer.id;
      await updateAuthUser(userId, { stripeCustomerId: customerId });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "ContractAI Pro",
              description: "Full access to all AI contract analysis features",
            },
            unit_amount: 2000, // $20
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard/settings`,
      client_reference_id: userId,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("createCheckoutSession error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  console.log("Webhook event:", event.type);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      const subscriptionId = session.subscription as string;

      if (userId) {
        const result = await updateAuthUser(userId, {
          isPremium: true,
          premiumSince: new Date(),
          stripeSubscriptionId: subscriptionId,
          stripeCustomerId: session.customer as string,
        });
        console.log(`Webhook: User ${userId} upgraded to premium. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

        // Send confirmation email
        try {
          const user = await findAuthUser(userId);
          if (user?.email) {
            await sendPremiumConfirmationEmail(user.email, user.name || "User");
          }
        } catch (emailErr) {
          console.error("Failed to send premium email:", emailErr);
        }
      }
      break;
    }

    case "customer.subscription.deleted":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Find user by stripeCustomerId
      const user = await db.collection("user").findOne({ stripeCustomerId: customerId });

      if (user) {
        const isActive = subscription.status === "active" || subscription.status === "trialing";
        const uid = String(user._id);
        await updateAuthUser(uid, {
          isPremium: isActive,
          ...(!isActive && { premiumEndedAt: new Date() }),
        });
        console.log(`Webhook: User ${uid} subscription ${subscription.status} → isPremium: ${isActive}`);
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const user = await db.collection("user").findOne({ stripeCustomerId: customerId });
      if (user) {
        console.log(`Webhook: Payment failed for user ${user._id}`);
      }
      break;
    }
  }

  res.json({ received: true });
};

export const getPremiumStatus = async (req: Request, res: Response) => {
  const user = req.user as any;
  const userId = getUserId(user);

  try {
    const dbUser = await findAuthUser(userId);
    console.log(`getPremiumStatus: userId=${userId}, found=${!!dbUser}, dbIsPremium=${dbUser?.isPremium}`);

    // If the database says they aren't premium, but they have a stripe customer ID,
    // let's double check Stripe directly. This fixes issues where webhooks are missed/unconfigured.
    if (dbUser && !dbUser.isPremium && dbUser.stripeCustomerId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: dbUser.stripeCustomerId,
        status: "all",
        limit: 1,
      });

      if (
        subscriptions.data.length > 0 &&
        (subscriptions.data[0].status === "active" ||
          subscriptions.data[0].status === "trialing")
      ) {
        // They actually do have an active subscription! Update the DB to reflect this.
        const subscription = subscriptions.data[0];
        await updateAuthUser(userId, {
          isPremium: true,
          premiumSince: new Date(subscription.start_date * 1000),
          stripeSubscriptionId: subscription.id,
        });
        dbUser.isPremium = true;
        dbUser.premiumSince = new Date(subscription.start_date * 1000);
        console.log(`Dynamically verified active subscription for user ${userId} via Stripe API.`);
      }
    }

    if (dbUser?.isPremium) {
      res.json({
        status: "active",
        plan: "pro",
        since: dbUser.premiumSince,
      });
    } else {
      res.json({ status: "inactive", plan: "free" });
    }
  } catch (error) {
    console.error("Error checking premium status:", error);
    res.json({ status: "inactive", plan: "free" });
  }
};
