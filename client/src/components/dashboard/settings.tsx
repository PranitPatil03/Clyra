"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useSubscription } from "@/hooks/use-subscription";
import { api } from "@/lib/api";
import stripePromise from "@/lib/stripe";
import { toast } from "sonner";
import {
  CheckCircle2,
  Crown,
  Loader2,
  Mail,
  Shield,
  Sparkles,
  User,
} from "lucide-react";

export default function Settings() {
  const {
    subscriptionStatus,
    isSubscriptionLoading,
    setLoading,
  } = useSubscription();
  const { user } = useCurrentUser();

  if (!subscriptionStatus || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const isActive = subscriptionStatus.status === "active";

  const handleUpgrade = async () => {
    setLoading(true);
    if (!isActive) {
      try {
        const response = await api.get("/payments/create-checkout-session");
        const stripe = await stripePromise;
        if (!stripe) {
          toast.error("Stripe failed to load. Please refresh and try again.");
          return;
        }
        const result = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId,
        });
        if (result.error) {
          toast.error(result.error.message || "Payment redirect failed");
        }
      } catch (error: any) {
        console.error("Stripe upgrade error:", error);
        toast.error(
          error?.message || "Please try again or login to your account"
        );
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("You are already on the Pro plan");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-gray-900">
          Settings
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage your account and subscription
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            {user?.image ? (
              <img
                src={user.image}
                alt={user?.name || "User"}
                className="size-14 rounded-full object-cover border-2 border-gray-100"
              />
            ) : (
              <div className="size-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-lg font-semibold">
                {(user?.name || user?.displayName || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {user?.displayName || user?.name || "User"}
              </h2>
              <p className="text-sm text-gray-400">{user?.email}</p>
              {isActive && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-orange-50 text-orange-600 border border-orange-200">
                  <Crown className="size-3" />
                  PRO
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <User className="size-4 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">Full Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {user?.displayName || user?.name || "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <Mail className="size-4 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">Email Address</p>
                <p className="text-sm font-medium text-gray-900">
                  {user?.email || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      {isActive ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Shield className="size-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Pro Plan
                </h3>
                <p className="text-xs text-gray-400">
                  $20/month · Active subscription
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                "Unlimited contract analyses",
                "Full risk & opportunity reports",
                "Key clauses & recommendations",
                "Legal compliance assessment",
                "Priority AI processing",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-emerald-200/60">
              <p className="text-xs text-gray-400">
                You have full access to all Pro features. Manage your
                subscription through Stripe.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-white to-orange-50/30 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Crown className="size-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Upgrade to Pro
                </h3>
                <p className="text-xs text-gray-400">
                  Unlock all features with a monthly plan
                </p>
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold text-gray-900">$20</span>
              <span className="text-sm text-gray-400">/month</span>
            </div>

            <div className="space-y-2 mb-5">
              {[
                "Unlimited contract analyses",
                "Full risk & opportunity reports",
                "Key clauses & recommendations",
                "Legal compliance assessment",
                "Priority AI processing",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-orange-500 shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleUpgrade}
              className="w-full cursor-pointer text-white font-medium rounded-xl transition-all duration-200 bg-gradient-to-b from-orange-400 to-orange-600 border border-orange-600 shadow-[0_4px_14px_rgba(234,88,12,0.4)] h-11 flex items-center justify-center text-sm hover:scale-[1.01] hover:shadow-[0_6px_20px_rgba(234,88,12,0.6)]"
            >
              <Sparkles className="size-4 mr-2" />
              Subscribe to Pro — $20/mo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
