"use client";

import { api } from "@/lib/api";
import stripePromise from "@/lib/stripe";
import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Basic",
    description: "For individuals reviewing personal contracts.",
    price: "Free",
    period: "/forever",
    buttonText: "Get started",
    highlight: false,
    features: [
      "Upload PDF contracts",
      "AI contract type detection",
      "5 risks with severity levels",
      "5 opportunities with impact levels",
      "Brief contract summary",
      "Overall favorability score",
    ],
    action: "register",
  },
  {
    name: "Pro",
    description: "For professionals who need deeper contract insights.",
    price: "$20",
    period: "/month",
    buttonText: "Upgrade to Pro",
    highlight: true,
    features: [
      "10+ risks & opportunities",
      "Detailed contract summary",
      "Improvement recommendations",
      "Key clauses identification",
      "Legal compliance assessment",
      "Negotiation points",
      "Compensation breakdown",
      "Termination & IP analysis",
    ],
    action: "upgrade",
  },
];

export function PricingSection() {
  const handleUpgrade = async () => {
    try {
      const response = await api.get("/payments/create-checkout-session");
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({
        sessionId: response.data.sessionId,
      });
    } catch (error) {
      toast.error("Please login first to upgrade");
    }
  };

  const freeFeatures = [
    "Upload PDF contracts",
    "AI contract type detection",
    "5 risks with severity levels",
    "5 opportunities with impact levels",
    "Brief contract summary",
    "Overall favorability score",
  ];

  const proFeatures = [
    "Unlimited PDF uploads",
    "10+ detailed risks & opportunities",
    "Comprehensive contract summary",
    "Improvement & negotiation points",
    "Key clauses & legal compliance assessment",
    "Compensation & IP breakdown",
    "Export reports (PDF/Word)",
    "Priority analysis processing",
  ];

  return (
    <section id="pricing" className="w-full py-16 md:py-16 bg-[#f8fafc] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[30vw] h-[30vw] bg-indigo-200/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40vw] h-[40vw] bg-rose-100/30 rounded-full blur-[100px]" />
      </div>

      <div className="container max-w-5xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-6">
            Simple, transparent <span className="font-light bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">pricing</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Choose the plan that fits your contract analysis needs. Upgrade anytime for deeper insights.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
          {/* Free Plan */}
          <div className="relative rounded-xl border-none shadow-[0_2px_10px_rgba(0,0,0,0.04)] bg-white/80 backdrop-blur-sm p-8 md:p-10 flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 md:scale-95 origin-center md:origin-right">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
              <p className="text-sm text-gray-500">For individuals reviewing occasional personal contracts.</p>
            </div>

            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-6xl font-light text-gray-900 tracking-tight">$0</span>
              <span className="text-base text-gray-400 font-medium">/forever</span>
            </div>

            <Button
              className="w-full py-6 rounded-xl text-base font-medium transition-all bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm hover:shadow"
              onClick={() => (window.location.href = "/register")}
            >
              Get Started for Free
            </Button>

            <div className="mt-10 flex-grow">
              <p className="text-sm font-semibold text-gray-900 mb-4 tracking-wide uppercase">Included features:</p>
              <ul className="space-y-4">
                {freeFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="mt-1 p-0.5 rounded-full bg-emerald-100 text-emerald-600">
                      <Check className="size-3" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-xl border-none flex flex-col transition-all duration-300 transform shadow-[0_2px_10px_rgba(0,0,0,0.08)] bg-white p-8 md:p-10">
            {/* <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border-none whitespace-nowrap tracking-wide uppercase z-20">
              Most Popular
            </div> */}

            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-[50px] -mr-10 -mt-10 opacity-50 pointer-events-none" />

            <div className="mb-6 relative z-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <p className="text-sm text-gray-500">For professionals needing comprehensive legal assurance.</p>
            </div>

            <div className="mb-8 flex items-baseline gap-1 relative z-10">
              <span className="text-6xl font-light text-gray-900 tracking-tight">$20</span>
              <span className="text-base text-gray-400 font-medium">/month</span>
            </div>

            <Button
              className="w-full flex h-12 items-center justify-center rounded-xl text-base font-medium transition-all duration-200 relative z-10 bg-gradient-to-b from-orange-400 to-orange-600 border border-orange-600 shadow-[0_4px_14px_rgba(234,88,12,0.4)] hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(234,88,12,0.6)] text-white"
              onClick={handleUpgrade}
            >
              Upgrade to Pro
            </Button>

            <div className="mt-10 flex-grow relative z-10">
              <p className="text-sm font-semibold text-gray-900 mb-4 tracking-wide uppercase">Everything in basic, plus:</p>
              <ul className="space-y-4">
                {proFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="mt-1 p-0.5 rounded-full bg-orange-100 text-orange-600">
                      <Check className="size-3" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-gray-900 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
