"use client";

import { ContractAnalysis } from "@/interfaces/contract.interface";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useSubscription } from "@/hooks/use-subscription";
import stripePromise from "@/lib/stripe";
import {
  AlertTriangle,
  ArrowUpRight,
  FileText,
  Loader2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Reuse the same parser as dashboard
function parseContractType(raw: any): string {
  if (!raw) return "Unknown";
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null) {
        return (
          parsed.contract_type ||
          parsed.contractType ||
          parsed.type ||
          Object.values(parsed)[0] ||
          "Unknown"
        );
      }
      return String(parsed);
    } catch {
      return raw.replace(/^["']|["']$/g, "").trim();
    }
  }
  if (typeof raw === "object") {
    return (
      raw.contract_type ||
      raw.contractType ||
      raw.type ||
      Object.values(raw)[0] ||
      "Unknown"
    );
  }
  return String(raw);
}

function getScoreColor(score: number) {
  if (score >= 75)
    return { bg: "bg-emerald-50", text: "text-emerald-700", label: "Good" };
  if (score >= 50)
    return { bg: "bg-amber-50", text: "text-amber-700", label: "Fair" };
  return { bg: "bg-red-50", text: "text-red-700", label: "At Risk" };
}

export default function ContractResultsPage() {
  const {
    data: contracts,
    isLoading,
    isError,
  } = useQuery<ContractAnalysis[]>({
    queryKey: ["user-contracts"],
    queryFn: async () => {
      const response = await api.get("/contracts/user-contracts");
      return response.data;
    },
  });

  const {
    subscriptionStatus,
    isSubscriptionLoading,
    setLoading,
  } = useSubscription();

  const isActive = subscriptionStatus?.status === "active";

  const handleUpgrade = async () => {
    setLoading(true);
    if (!isActive) {
      try {
        const response = await api.get("/payments/create-checkout-session");
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({
          sessionId: response.data.sessionId,
        });
      } catch (error) {
        toast.error("Please try again or login to your account");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("You are already a premium member");
    }
  };

  if (isLoading || isSubscriptionLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-gray-400" />
        <span className="ml-3 text-sm text-gray-500">Loading results...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-red-500">
          Failed to load results. Please try again.
        </p>
      </div>
    );
  }

  const analyzedContracts = contracts || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-gray-900">
          Analysis Results
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          View detailed AI analysis for all your contracts
        </p>
      </div>

      {analyzedContracts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="size-14 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
            <FileText className="size-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            No results yet
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Upload and analyze a contract to see results here
          </p>
          <Link href="/dashboard">
            <button className="cursor-pointer text-white font-medium rounded-xl transition-all duration-200 bg-gradient-to-b from-orange-400 to-orange-600 border border-orange-600 shadow-[0_4px_14px_rgba(234,88,12,0.4)] inline-flex h-9 px-5 items-center justify-center text-xs hover:scale-[1.02]">
              <Sparkles className="size-3.5 mr-1.5" />
              Go to Dashboard
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analyzedContracts.map((contract) => {
            const type = parseContractType(contract.contractType);
            const score = contract.overallScore ?? 0;
            const scoreInfo = getScoreColor(score);
            const hasHighRisk = contract.risks?.some(
              (r) => r.severity === "high"
            );
            const date = new Date(contract.createdAt);
            const riskCount = contract.risks?.length || 0;
            const oppCount = contract.opportunities?.length || 0;

            return (
              <Link
                key={contract._id}
                href={`/dashboard/contract/${contract._id}`}
                className="group block"
              >
                <div className="rounded-xl border border-gray-200 bg-white hover:border-orange-300 hover:shadow-md transition-all duration-200 overflow-hidden">
                  {/* Top bar with score indicator */}
                  <div
                    className={cn(
                      "h-1",
                      score >= 75
                        ? "bg-emerald-400"
                        : score >= 50
                          ? "bg-amber-400"
                          : "bg-red-400"
                    )}
                  />

                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                          <FileText className="size-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                            {type}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {date.toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <ArrowUpRight className="size-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
                    </div>

                    {/* Summary */}
                    {contract.summary && (
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
                        {contract.summary}
                      </p>
                    )}

                    {/* Stats row */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border",
                            scoreInfo.bg,
                            scoreInfo.text
                          )}
                        >
                          {Math.round(score)}/100 · {scoreInfo.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                          <AlertTriangle className="size-3" />
                          {riskCount}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                          <TrendingUp className="size-3" />
                          {oppCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
