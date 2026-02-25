"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { BentoCard, BentoGrid } from "./ui/bento-grid";
import { Marquee } from "./ui/marquee";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  FileSearch,
  Scale,
  Shield,
  Sparkles,
  FileText,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Bell,
  Share2,
  Calendar,
} from "lucide-react";

import HighPrioriyWarning from "../public/images/high-priority.png";
import Warning from "../public/images/warning.png";


const fadeInUpVariant = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const getTransition = (delay: number = 0) => ({
  duration: 0.5,
  ease: "easeOut",
  delay,
});

// Contract file items for the marquee background
const contractFiles = [
  { name: "NDA-2024.pdf", body: "Non-disclosure agreement with standard confidentiality clauses." },
  { name: "Employment.pdf", body: "Full-time employment contract covering compensation and benefits." },
  { name: "SaaS-Agreement.pdf", body: "Software-as-a-Service subscription agreement with SLA terms." },
  { name: "Vendor-Contract.pdf", body: "Vendor services agreement outlining deliverables and timelines." },
  { name: "Lease-Agreement.pdf", body: "Commercial property lease with rental terms and renewal options." },
];

// Bento feature cards - Magic UI style
const bentoFeatures = [
  {
    Icon: FileSearch,
    name: "AI-Powered Analysis",
    description: "Upload any contract PDF and get comprehensive analysis with risks and insights.",
    href: "/register",
    cta: "Learn more",
    className: "col-span-3 md:col-span-2 lg:col-span-2",
    background: (
      <div className="absolute top-10 flex w-full flex-col gap-4 [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)]">
        <Marquee
          pauseOnHover
          className="[--duration:20s]"
        >
          {contractFiles.map((f, idx) => (
            <figure
              key={idx}
              className={cn(
                "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                "border-gray-950/[.05] bg-gray-950/[.02] hover:bg-gray-950/[.05]",
                "dark:border-gray-50/[.05] dark:bg-gray-50/[.02] dark:hover:bg-gray-50/[.05]",
                "transform-gpu transition-all duration-300 ease-out hover:blur-none"
              )}
            >
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-col">
                  <figcaption className="text-sm font-medium dark:text-white">
                    {f.name}
                  </figcaption>
                </div>
              </div>
              <blockquote className="mt-2 text-xs text-gray-500">{f.body}</blockquote>
            </figure>
          ))}
        </Marquee>
        <Marquee
          pauseOnHover
          reverse
          className="[--duration:20s]"
        >
          {[
            { name: "Partnership-Agreement.pdf", body: "Joint venture partnership terms and revenue split." },
            { name: "Licensing-Rights.pdf", body: "IP licensing agreement providing global rights." },
            { name: "Consulting-MSA.pdf", body: "Master services agreement detailing hourly consulting rates." },
            { name: "Commercial-Lease.pdf", body: "Office space commercial lease over 5 years." },
          ].map((f, idx) => (
            <figure
              key={idx + 100}
              className={cn(
                "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                "border-gray-950/[.05] bg-gray-950/[.02] hover:bg-gray-950/[.05]",
                "dark:border-gray-50/[.05] dark:bg-gray-50/[.02] dark:hover:bg-gray-50/[.05]",
                "transform-gpu transition-all duration-300 ease-out hover:blur-none"
              )}
            >
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-col">
                  <figcaption className="text-sm font-medium dark:text-white">
                    {f.name}
                  </figcaption>
                </div>
              </div>
              <blockquote className="mt-2 text-xs text-gray-500">{f.body}</blockquote>
            </figure>
          ))}
        </Marquee>
      </div>
    ),
  },
  {
    Icon: AlertTriangle,
    name: "Risk Detection",
    description: "Automatically identify and categorize contractual risks by severity.",
    href: "/register",
    cta: "Learn more",
    className: "col-span-3 md:col-span-1 lg:col-span-1",
    background: (
      <div className="absolute right-0 top-0 h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105 overflow-hidden">
        <motion.div
          animate={{ y: ["0%", "-50%"] }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity }}
          className="flex flex-col items-center gap-4 pt-4 w-full"
        >
          {/* Double the array for seamless infinite vertical scroll */}
          {[...Array(2)].map((_, groupIdx) => (
            <div key={groupIdx} className="flex flex-col gap-4 w-full items-center">
              {[
                { tag: "High Risk", text: "Unlimited Liability", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-100 dark:bg-red-950", border: "border-red-200 dark:border-red-900" },
                { tag: "Warning", text: "Vague Termination", icon: Bell, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-950", border: "border-amber-200 dark:border-amber-900" },
                { tag: "Critical", text: "Missing Indemnity", icon: Shield, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-950", border: "border-rose-200 dark:border-rose-900" },
                { tag: "Review", text: "Auto-renewal at +10%", icon: FileSearch, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-950", border: "border-blue-200 dark:border-blue-900" },
              ].map((item, i) => (
                <div
                  key={`${groupIdx}-${i}`}
                  className="flex items-center gap-3 w-full max-w-[240px] rounded-xl border border-gray-950/[.05] bg-white p-3 shadow-sm dark:border-gray-50/[.05] dark:bg-gray-950"
                >
                  <div className={cn("p-2 rounded-full border", item.bg, item.border)}>
                    <item.icon className={cn("h-4 w-4", item.color)} />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">{item.tag}</span>
                    <span className="text-xs text-gray-500 truncate">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    ),
  },
  {
    Icon: Scale,
    name: "Legal Compliance",
    description: "Instant compliance assessment against regulatory requirements.",
    href: "/register",
    cta: "Learn more",
    className: "col-span-3 md:col-span-1 lg:col-span-1",
    background: (
      <div className="absolute right-0 top-4 h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105">
        <div className="absolute inset-0 flex justify-center items-start pt-8">
          <div className="w-full max-w-[240px] rounded-xl border border-gray-950/[.05] bg-white overflow-hidden relative shadow-md dark:border-gray-50/[.05] dark:bg-gray-950 p-4">
            <motion.div
              animate={{ top: ["-10%", "110%", "-10%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[2px] bg-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.5)] z-10"
            />
            <div className="space-y-4 mb-2">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
              </div>
              <div className="flex items-center gap-3 opacity-80">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <div className="h-2 w-4/5 bg-gray-100 dark:bg-gray-800 rounded"></div>
              </div>
              <div className="flex items-center gap-3 opacity-60">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <div className="h-2 w-5/6 bg-gray-100 dark:bg-gray-800 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    Icon: Sparkles,
    name: "Smart Recommendations",
    description: "AI-generated negotiation points to strengthen your position.",
    href: "/register",
    cta: "Learn more",
    className: "col-span-3 md:col-span-1 lg:col-span-1",
    background: (
      <div className="absolute right-0 top-0 h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105">
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="relative w-full h-full max-w-[280px]">

            {/* Document Mockup */}
            <motion.div
              className="absolute top-8 left-4 w-[160px] bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900 rounded-lg p-3 shadow-sm z-10"
              initial={{ y: 0 }}
              animate={{ y: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-3 h-3 text-gray-400" />
                <div className="h-1.5 w-12 bg-gray-200 dark:bg-gray-800 rounded-full" />
              </div>
              <div className="space-y-1.5 mb-3">
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800/50 rounded-full" />
                <div className="h-1.5 w-4/5 bg-gray-100 dark:bg-gray-800/50 rounded-full" />
              </div>

              {/* Highlighted text */}
              <div className="relative p-1.5 rounded bg-yellow-100/50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 mb-3">
                <div className="h-1.5 w-full bg-yellow-400/50 rounded-full mb-1.5" />
                <div className="h-1.5 w-2/3 bg-yellow-400/50 rounded-full" />
              </div>

              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800/50 rounded-full" />
                <div className="h-1.5 w-3/4 bg-gray-100 dark:bg-gray-800/50 rounded-full" />
              </div>
            </motion.div>

            {/* Connecting Line */}
            <svg className="absolute inset-0 w-full h-full z-0">
              <motion.path
                d="M 120 100 Q 180 100 200 130"
                fill="none"
                stroke="currentColor"
                className="text-indigo-400 dark:text-indigo-600"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <motion.circle cx="200" cy="130" r="3" className="fill-indigo-500" />
            </svg>

            {/* AI Suggestion Card */}
            <motion.div
              className="absolute top-[110px] right-2 w-[160px] bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-3 shadow-lg z-20 border border-indigo-400"
              initial={{ opacity: 0.8, x: 10 }}
              animate={{ opacity: 1, x: 0, y: [0, -4, 0] }}
              transition={{ y: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3 text-indigo-200" />
                <span className="text-[10px] font-bold text-white tracking-wide">AI NEGOTIATION</span>
              </div>
              <p className="text-[9px] text-indigo-100 leading-relaxed font-medium">
                Strike this clause. Suggest limiting liability to 12 months of fees instead of unlimited.
              </p>
              <div className="mt-2.5 flex gap-1.5">
                <div className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[8px] font-semibold tracking-wide cursor-pointer hover:bg-white/30 transition-colors">Accept</div>
                <div className="px-2.5 py-1 rounded-full bg-black/20 text-white text-[8px] font-semibold tracking-wide cursor-pointer hover:bg-black/30 transition-colors">Reject</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    ),
  },
  {
    Icon: DollarSign,
    name: "Cost Analytics",
    description: "Track contract values, identify savings, and optimize spending.",
    href: "/register",
    cta: "Learn more",
    className: "col-span-3 md:col-span-1 lg:col-span-1",
    background: (
      <div className="absolute right-0 top-4 h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105">
        <div className="absolute inset-0 flex justify-center items-start pt-8">
          <div className="w-[85%] rounded-xl bg-transparent p-4">
            {/* Top Metrics Row */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-medium">Total Contract Value</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">$2.4M</span>
                  <span className="text-[10px] text-emerald-500 font-semibold bg-emerald-100/50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <TrendingUp className="w-2 h-2" /> +14%
                  </span>
                </div>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-gray-500 font-medium">Identified Savings</span>
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">$120k</span>
              </div>
            </div>

            {/* Simulated Line Chart */}
            <div className="relative h-[60px] w-full mt-4">
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                <defs>
                  <linearGradient id="gradientCurve" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgb(99 102 241)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="rgb(99 102 241)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Area under curve */}
                <motion.path
                  d="M0,40 L0,30 L20,25 L40,15 L60,20 L80,5 L100,0 L100,40 Z"
                  fill="url(#gradientCurve)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                {/* Line Graph */}
                <motion.path
                  d="M0,30 L20,25 L40,15 L60,20 L80,5 L100,0"
                  fill="none"
                  stroke="rgb(99 102 241)"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "linear", repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
                />
                {/* Moving dot */}
                <motion.circle
                  r="2"
                  className="fill-indigo-500"
                  animate={{
                    cx: [0, 20, 40, 60, 80, 100],
                    cy: [30, 25, 15, 20, 5, 0]
                  }}
                  transition={{ duration: 2, ease: "linear", repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
                />
              </svg>
            </div>

            {/* Timeline/Axis */}
            <div className="flex justify-between items-center mt-2 border-t border-gray-100 dark:border-gray-800 pt-2">
              <span className="text-[8px] text-gray-400">Jan</span>
              <span className="text-[8px] text-gray-400">Feb</span>
              <span className="text-[8px] text-gray-400">Mar</span>
              <span className="text-[8px] text-gray-400">Apr</span>
              <span className="text-[8px] text-gray-400">May</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export function HeroSection() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative flex flex-col w-full px-4 pt-32 md:pt-40 lg:pt-48 pb-20 overflow-hidden bg-[#f8fafc]">
        {/* Background radial soft blur meshes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-300/30 rounded-full blur-[100px]" />
          <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-orange-200/40 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-rose-100/40 rounded-full blur-[100px]" />
        </div>

        {/* Centered Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            {...fadeInUpVariant}
            transition={getTransition(0.1)}
            className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-gray-900 leading-[1.1]"
          >
            Know what you&apos;re{" "}
            <span className="font-light bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent pr-4">
              signing
            </span>
          </motion.h1>

          <motion.p
            {...fadeInUpVariant}
            transition={getTransition(0.2)}
            className="text-lg md:text-xl text-gray-500 mt-6 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Clyra uses intelligent AI to scan contracts, highlight risks, and
            recommend edits so your team can move faster with confidence.
          </motion.p>

          <motion.div
            {...fadeInUpVariant}
            transition={getTransition(0.4)}
          >
            <Link
              href="/register"
              className="cursor-pointer text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-b from-orange-400 to-orange-600 border border-orange-600 shadow-[0_4px_14px_rgba(234,88,12,0.4)] inline-flex h-12 px-8 items-center justify-center text-base hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(234,88,12,0.6)]"
            >
              Review your contract
            </Link>
          </motion.div>
        </div>

        {/* Mockup UI Window */}
        <motion.div
          {...fadeInUpVariant}
          transition={getTransition(0.5)}
          className="relative z-10 w-full max-w-4xl mx-auto mt-16 mb-8 px-4"
        >
          <div className="rounded-xl bg-white/60 backdrop-blur-sm shadow-md p-6 md:p-12 border border-white text-left">
            {/* Decorative Callout - Data Usage */}
            <div className="absolute -left-2 md:-left-10 top-4 bg-white border border-gray-100 shadow-xl rounded-2xl p-4 flex gap-3 items-start w-60 md:w-80 transform -rotate-2 z-20">
              <div className="p-2 rounded-full shrink-0">
                <Image src={Warning} className="size-8" alt="warning" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">
                  Clarify data usage
                </p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Does this include using data for product improvement or AI
                  training?
                </p>
              </div>
            </div>

            {/* Avatars */}
            <div className="flex gap-0 justify-end mb-8 pr-4">
              <div className="size-9 rounded-full border-[3px] border-white relative right-[-12px] z-30 overflow-hidden shadow-sm">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="User 1"
                  className="size-full object-cover"
                />
              </div>
              <div className="size-9 rounded-full border-[3px] border-white relative right-[-6px] z-20 overflow-hidden shadow-sm">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="User 2"
                  className="size-full object-cover"
                />
              </div>
              <div className="size-9 rounded-full border-[3px] border-white z-10 overflow-hidden shadow-sm">
                <img
                  src="https://randomuser.me/api/portraits/men/68.jpg"
                  alt="User 3"
                  className="size-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-10 md:pl-12">
              {/* Section 7.1 */}
              <div>
                <p className="text-sm text-gray-400 mb-2 font-medium">
                  Section 7.1 — Data Ownership
                </p>
                <p className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-800 leading-snug">
                  Customer retains all rights to data submitted through the
                  Platform.
                  <span className="bg-gradient-to-b from-yellow-100/80 to-yellow-200/80 border border-gray-200 shadow-[0_2px_10px_rgba(234,179,8,0.2)] px-2 -py-4 rounded-xl inline-block mb-1">
                    Vendor may access and
                  </span>
                  <span className="bg-gradient-to-b from-yellow-100/80 to-yellow-200/80 border border-gray-200 shadow-[0_2px_10px_rgba(234,179,8,0.2)] px-2 -py-4 rounded-xl mr-2">
                    Customer Data solely to provide
                    services
                  </span>
                  under this Agreement.
                </p>
              </div>

              {/* Section 9.2 */}
              <div className="relative pb-8">
                <p className="text-sm text-gray-400 mb-2 font-medium">
                  Section 9.2 — Limitation of Liability
                </p>
                <p className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-800 leading-snug">
                  Vendor&apos;s total{" "}
                  <span className="bg-gradient-to-b from-rose-100/80 to-rose-200/80 border border-gray-200  shadow-[0_2px_10px_rgba(225,29,72,0.2)] px-2 -py-4 rounded-xl">
                    liability shall not exceed the fees
                  </span>
                  <span className="bg-gradient-to-b from-rose-100/80 to-rose-200/80 border border-gray-200 shadow-[0_2px_10px_rgba(225,29,72,0.2)] px-2 py-0.5 rounded-xl inline-block mt-1">
                    paid in six months
                  </span>{" "}
                  preceding the claim, regardless of the cause of action.
                </p>

                {/* Decorative Callout - Risk */}
                <div className="absolute right-0 md:-right-20 bottom-[-10px] bg-white border border-gray-100 shadow-xl rounded-2xl p-4 flex gap-3 items-start w-60 md:w-64 transform -rotate-6 z-20">
                  <div className="p-2 rounded-full shrink-0">
                    <Image src={HighPrioriyWarning} className="size-7" alt="high-prioriy-warning" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      Potential Risk
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      This cap may not cover potential damages.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== FEATURES ===== */}
      <section
        id="features"
        className="w-full py-24 md:py-32 bg-[#f8fafc]"
      >
        <div className="container max-w-6xl mx-auto px-4 md:px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-4">
              Contracts Made Simple, Fast,
              <br className="hidden md:block" /> and Transparent.
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto px-5">
              Empowering you to review contracts with flexible, reliable, and
              AI-powered analysis platform.
            </p>
          </div>

          {/* Bento Grid */}
          <BentoGrid className="max-w-6xl mx-auto">
            {bentoFeatures.map((feature, index) => (
              <BentoCard
                key={feature.name}
                {...feature}
              />
            ))}
          </BentoGrid>
        </div>
      </section>
    </>
  );
}
