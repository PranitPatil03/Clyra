"use client";

import { useState } from "react";
import { CheckCircle2, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { UploadModal } from "@/components/modals/upload-modal";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

export default function PaymentSuccess() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Invalidate subscription status so it refetches fresh from DB
  queryClient.invalidateQueries({ queryKey: ["subscriptionStatus"] });

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                damping: 15,
                stiffness: 200,
                delay: 0.2,
              }}
              className="size-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5"
            >
              <CheckCircle2 className="size-8 text-emerald-600" />
            </motion.div>

            <h1 className="text-xl font-semibold text-gray-900 mb-1">
              Welcome to Pro!
            </h1>
            <p className="text-sm text-gray-400 mb-6">
              Your subscription is now active — $20/month
            </p>

            {/* Features unlocked */}
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 mb-6 text-left">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Now unlocked
              </p>
              <div className="space-y-2">
                {[
                  "Unlimited contract analyses",
                  "Full risk & opportunity reports",
                  "Key clauses & recommendations",
                  "Legal compliance assessment",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    <span className="text-xs text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="w-full cursor-pointer text-white font-medium rounded-xl transition-all duration-200 bg-gradient-to-b from-orange-400 to-orange-600 border border-orange-600 shadow-[0_4px_14px_rgba(234,88,12,0.4)] h-11 flex items-center justify-center text-sm hover:scale-[1.01] hover:shadow-[0_6px_20px_rgba(234,88,12,0.6)]"
              >
                <Sparkles className="size-4 mr-2" />
                Upload Contract for Full Analysis
              </button>
              <Link href="/dashboard" className="block">
                <button className="w-full h-11 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center cursor-pointer">
                  <FileText className="size-4 mr-2 text-gray-400" />
                  Go to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={() => {
          queryClient.invalidateQueries({ queryKey: ["user-contracts"] });
          queryClient.invalidateQueries({ queryKey: ["subscriptionStatus"] });
          setIsUploadModalOpen(false);
        }}
      />
    </>
  );
}
