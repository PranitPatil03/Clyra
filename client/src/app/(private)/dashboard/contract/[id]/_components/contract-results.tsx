"use client";

import ContractAnalysisResults from "@/components/analysis/contract-analysis-results";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSubscription } from "@/hooks/use-subscription";
import { ContractAnalysis } from "@/interfaces/contract.interface";
import { api } from "@/lib/api";
import stripePromise from "@/lib/stripe";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface IContractResultsProps {
  contractId: string;
}

export default function ContractResults({ contractId }: IContractResultsProps) {
  const { user } = useCurrentUser();
  const [analysisResults, setAnalysisResults] = useState<ContractAnalysis>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const {
    subscriptionStatus,
    isSubscriptionLoading,
    setLoading: setSubLoading,
  } = useSubscription();

  useEffect(() => {
    if (user) {
      fetchAnalysisResults(contractId);
    }
  }, [user]);

  const fetchAnalysisResults = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/contracts/contract/${id}`);
      setAnalysisResults(response.data);
      setError(false);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const isActive = subscriptionStatus?.status === "active";

  const handleUpgrade = async () => {
    setSubLoading(true);
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
        setSubLoading(false);
      }
    } else {
      toast.error("You are already a premium member");
    }
  };

  if (error) {
    return notFound();
  }

  if (loading || !analysisResults) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading analysis...</span>
      </div>
    );
  }

  return (
    <ContractAnalysisResults
      contractId={contractId}
      analysisResults={analysisResults}
      isActive={isActive}
      onUpgrade={handleUpgrade}
    />
  );
}
