"use client";

import { api } from "@/lib/api";
import { queryClient } from "@/providers/tanstack/react-query-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error || !token) {
      router.replace("/login?error=" + (error || "no_token"));
      return;
    }

    // Exchange the token for a cookie via AJAX (works cross-origin)
    api.post("/auth/set-session", { token })
      .then(() => {
        queryClient.clear();
        router.replace("/dashboard");
      })
      .catch((err) => {
        console.error("Failed to set session:", err);
        router.replace("/login?error=session_failed");
      });
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-6 animate-spin text-gray-400" />
        <p className="text-sm text-gray-400">Signing you in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-[#f8fafc]">
          <Loader2 className="size-6 animate-spin text-gray-400" />
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
