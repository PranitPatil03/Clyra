"use client";

import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { PricingSection } from "@/components/pricing-section";
import { useCurrentUser } from "@/hooks/use-current-user";
import { api } from "@/lib/api";
import stripePromise from "@/lib/stripe";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  // Show a loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f8fafc]">
        <Loader2 className="size-6 animate-spin text-gray-400" />
      </div>
    );
  }

  // If user is logged in, don't render landing page (redirect is in progress)
  if (user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f8fafc]">
        <Loader2 className="size-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <HeroSection />
      <PricingSection />
    </>
  );
}
