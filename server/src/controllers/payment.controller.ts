import { Request, Response } from "express";
import Stripe from "stripe";
import User from "../models/user.model";
import { sendPremiumConfirmationEmail } from "../services/email.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const getUserId = (user: any): string => String(user._id);

export const createCheckoutSession = async (req: Request, res: Response) => {
  const user = req.user as any;
  const userId = getUserId(user);

  try {
    const dbUser = await User.findById(userId);
    if (!dbUser) {
      return res.status(404).json({ error: "User not found" });
    }

    let customerId = dbUser.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });
      customerId = customer.id;
      dbUser.stripeCustomerId = customerId;
      await dbUser.save();
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
            unit_amount: 2000,
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
        const result = await User.findByIdAndUpdate(userId, {
          isPremium: true,
          premiumSince: new Date(),
          stripeSubscriptionId: subscriptionId,
          stripeCustomerId: session.customer as string,
        });
        console.log(`Webhook: User ${userId} upgraded to premium. Updated: ${!!result}`);

        try {
          const user = await User.findById(userId);
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

      const user = await User.findOne({ stripeCustomerId: customerId });

      if (user) {
        const isActive = subscription.status === "active" || subscription.status === "trialing";
        user.isPremium = isActive;
        if (!isActive) {
          user.premiumEndedAt = new Date();
        }
        await user.save();
        console.log(`Webhook: User ${user._id} subscription ${subscription.status} → isPremium: ${isActive}`);
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const user = await User.findOne({ stripeCustomerId: customerId });
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
    const dbUser = await User.findById(userId);

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
        const subscription = subscriptions.data[0];
        dbUser.isPremium = true;
        dbUser.premiumSince = new Date(subscription.start_date * 1000);
        dbUser.stripeSubscriptionId = subscription.id;
        await dbUser.save();
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
