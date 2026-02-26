"use client";

import { ContractAnalysis } from "@/interfaces/contract.interface";
import { ReactNode, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BookOpen,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  FileText,
  Gavel,
  Key,
  Lightbulb,
  Lock,
  Minus,
  Scale,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import OverallScoreChart from "./chart";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface IContractAnalysisResultsProps {
  analysisResults: ContractAnalysis;
  isActive: boolean;
  contractId: string;
  onUpgrade: () => void;
}

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
  return String(raw);
}

const severityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };

export default function ContractAnalysisResults({
  analysisResults,
  isActive,
  onUpgrade,
}: IContractAnalysisResultsProps) {
  const [activeSection, setActiveSection] = useState("overview");

  if (!analysisResults) {
    return <div>No results</div>;
  }

  const contractType = parseContractType(analysisResults.contractType);
  const score = analysisResults.overallScore ?? 0;

  const getScoreInfo = () => {
    if (score >= 75) return { icon: ArrowUp, color: "text-emerald-600", bg: "bg-emerald-50", text: "Good", border: "border-emerald-200" };
    if (score >= 50) return { icon: Minus, color: "text-amber-600", bg: "bg-amber-50", text: "Fair", border: "border-amber-200" };
    return { icon: ArrowDown, color: "text-red-600", bg: "bg-red-50", text: "At Risk", border: "border-red-200" };
  };

  const scoreInfo = getScoreInfo();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-50 text-red-700 border-red-200";
      case "medium": return "bg-amber-50 text-amber-700 border-amber-200";
      case "low": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getSeverityBar = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-400";
      case "medium": return "bg-amber-400";
      case "low": return "bg-emerald-400";
      default: return "bg-gray-300";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-blue-50 text-blue-700 border-blue-200";
      case "medium": return "bg-amber-50 text-amber-700 border-amber-200";
      case "low": return "bg-gray-50 text-gray-600 border-gray-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getImpactBar = (impact: string) => {
    switch (impact) {
      case "high": return "bg-blue-400";
      case "medium": return "bg-amber-400";
      case "low": return "bg-gray-300";
      default: return "bg-gray-300";
    }
  };

  const risks = analysisResults.risks || [];
  const opportunities = analysisResults.opportunities || [];
  const highRisks = risks.filter(r => r.severity === "high").length;
  const medRisks = risks.filter(r => r.severity === "medium").length;
  const lowRisks = risks.filter(r => r.severity === "low").length;

  // Sort high → medium → low
  const sortedRisks = [...risks].sort(
    (a, b) => (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3)
  );
  const sortedOpps = [...opportunities].sort(
    (a, b) => (severityOrder[a.impact] ?? 3) - (severityOrder[b.impact] ?? 3)
  );

  const renderPremiumGate = (content: ReactNode, label?: string) => {
    if (isActive) return content;
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[3px] z-10 flex flex-col items-center justify-center rounded-xl">
          <Lock className="size-5 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            {label || "Pro Feature"}
          </p>
          <button
            onClick={onUpgrade}
            className="cursor-pointer text-white font-medium rounded-xl transition-all duration-200 bg-gradient-to-b from-orange-400 to-orange-600 border border-orange-600 shadow-[0_4px_14px_rgba(234,88,12,0.4)] inline-flex h-8 px-4 items-center justify-center text-xs hover:scale-[1.02] mt-2"
          >
            Upgrade to Pro
          </button>
        </div>
        <div className="opacity-30 pointer-events-none">{content}</div>
      </div>
    );
  };

  const handleDownloadPDF = () => {
    const scoreLabel = score >= 75 ? "Good" : score >= 50 ? "Fair" : "At Risk";
    const scoreColor = score >= 75 ? "#059669" : score >= 50 ? "#d97706" : "#dc2626";
    const scoreBg = score >= 75 ? "#d1fae5" : score >= 50 ? "#fef3c7" : "#fee2e2";
    const analysisDate = new Date(analysisResults.createdAt).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    });

    const riskItems = sortedRisks.map((risk, i) => `
      <div style="display:flex;gap:0;margin-bottom:8px;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="width:4px;flex-shrink:0;background:${risk.severity === "high" ? "#f87171" : risk.severity === "medium" ? "#fbbf24" : "#34d399"};"></div>
        <div style="flex:1;padding:12px 16px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
            <span style="font-size:13px;font-weight:600;color:#111827;">${String(i + 1).padStart(2, "0")}. ${risk.risk}</span>
            <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;flex-shrink:0;margin-left:8px;background:${risk.severity === "high" ? "#fee2e2" : risk.severity === "medium" ? "#fef3c7" : "#d1fae5"};color:${risk.severity === "high" ? "#b91c1c" : risk.severity === "medium" ? "#b45309" : "#065f46"};">${risk.severity.toUpperCase()}</span>
          </div>
          <p style="font-size:12px;color:#4b5563;line-height:1.6;margin:0 0 ${risk.suggestedAlternative ? "8px" : "0"} 0;">${risk.explanation}</p>
          ${risk.suggestedAlternative ? `<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:8px 12px;"><div style="font-size:10px;font-weight:700;color:#1d4ed8;margin-bottom:3px;">💡 SUGGESTED ALTERNATIVE</div><p style="font-size:11px;color:#374151;line-height:1.6;margin:0;">${risk.suggestedAlternative}</p></div>` : ""}
        </div>
      </div>
    `).join("");

    const oppItems = sortedOpps.map((opp, i) => `
      <div style="display:flex;gap:0;margin-bottom:8px;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="width:4px;flex-shrink:0;background:${opp.impact === "high" ? "#60a5fa" : opp.impact === "medium" ? "#fbbf24" : "#9ca3af"};"></div>
        <div style="flex:1;padding:12px 16px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
            <span style="font-size:13px;font-weight:600;color:#111827;">${String(i + 1).padStart(2, "0")}. ${opp.opportunity}</span>
            <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;flex-shrink:0;margin-left:8px;background:${opp.impact === "high" ? "#dbeafe" : opp.impact === "medium" ? "#fef3c7" : "#f3f4f6"};color:${opp.impact === "high" ? "#1d4ed8" : opp.impact === "medium" ? "#b45309" : "#4b5563"};">${opp.impact.toUpperCase()}</span>
          </div>
          <p style="font-size:12px;color:#4b5563;line-height:1.6;margin:0 0 ${opp.suggestedAlternative ? "8px" : "0"} 0;">${opp.explanation}</p>
          ${opp.suggestedAlternative ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:8px 12px;"><div style="font-size:10px;font-weight:700;color:#15803d;margin-bottom:3px;">✓ HOW TO LEVERAGE</div><p style="font-size:11px;color:#374151;line-height:1.6;margin:0;">${opp.suggestedAlternative}</p></div>` : ""}
        </div>
      </div>
    `).join("");

    const recItems = (analysisResults.recommendations || []).map((rec, i) => `
      <div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #f3f4f6;align-items:flex-start;">
        <div style="background:#fff7ed;color:#ea580c;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;">${i + 1}</div>
        <p style="font-size:12px;color:#374151;line-height:1.6;margin:0;">${rec}</p>
      </div>
    `).join("");

    const clauseItems = (analysisResults.keyClauses || []).map((clause) => `
      <div style="padding:10px 14px;border-left:3px solid #e5e7eb;margin-bottom:6px;background:#f9fafb;border-radius:0 6px 6px 0;">
        <p style="font-size:12px;color:#374151;line-height:1.6;margin:0;">${clause}</p>
      </div>
    `).join("");

    const negItems = (analysisResults.negotiationPoints || []).map((point, i) => `
      <div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #f3f4f6;align-items:flex-start;">
        <div style="background:#fffbeb;color:#b45309;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;">${i + 1}</div>
        <p style="font-size:12px;color:#374151;line-height:1.6;margin:0;">${point}</p>
      </div>
    `).join("");

    const reportHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${contractType} — Analysis Report</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Helvetica Neue',Arial,sans-serif;color:#111827;background:#fff;font-size:14px;}
    .page{max-width:800px;margin:0 auto;padding:48px;}
    @page{margin:20mm 15mm;}
    @media print{.page{padding:0;max-width:100%;}}
    .header{border-bottom:2px solid #ea580c;padding-bottom:20px;margin-bottom:28px;}
    .brand{font-size:11px;font-weight:700;color:#ea580c;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
    .doc-title{font-size:26px;font-weight:700;color:#111827;margin-bottom:8px;}
    .doc-meta{font-size:12px;color:#6b7280;display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
    .score-chip{display:inline-flex;align-items:center;padding:3px 10px;border-radius:6px;font-size:12px;font-weight:700;}
    .section{margin-bottom:28px;}
    .section-title{font-size:13px;font-weight:700;color:#111827;padding-left:10px;border-left:3px solid #ea580c;margin-bottom:14px;text-transform:uppercase;letter-spacing:.04em;}
    .summary-box{font-size:13px;color:#374151;line-height:1.7;background:#f9fafb;padding:16px;border-radius:8px;border:1px solid #e5e7eb;}
    .stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px;}
    .stat-card{text-align:center;padding:12px;border-radius:8px;border:1px solid;}
    hr.sep{border:none;border-top:1px solid #e5e7eb;margin:24px 0;}
    .contract-text-box{font-size:11px;color:#374151;line-height:1.8;white-space:pre-wrap;font-family:'Courier New',monospace;background:#f9fafb;padding:20px;border-radius:8px;border:1px solid #e5e7eb;}
  </style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="brand">ContractAI · Analysis Report</div>
    <div class="doc-title">${contractType}</div>
    <div class="doc-meta">
      <span>Analyzed ${analysisDate}</span>
      <span style="color:#d1d5db">·</span>
      <span>AI Model: Llama 3.3-70B</span>
      <span style="color:#d1d5db">·</span>
      <span class="score-chip" style="background:${scoreBg};color:${scoreColor};">Score: ${Math.round(score)}/100 · ${scoreLabel}</span>
    </div>
  </div>

  <div class="stat-grid">
    <div class="stat-card" style="background:#fef2f2;border-color:#fecaca;">
      <div style="font-size:24px;font-weight:700;color:#b91c1c;">${highRisks}</div>
      <div style="font-size:11px;color:#dc2626;font-weight:600;margin-top:2px;">HIGH RISK</div>
    </div>
    <div class="stat-card" style="background:#fffbeb;border-color:#fde68a;">
      <div style="font-size:24px;font-weight:700;color:#b45309;">${medRisks}</div>
      <div style="font-size:11px;color:#d97706;font-weight:600;margin-top:2px;">MEDIUM RISK</div>
    </div>
    <div class="stat-card" style="background:#f0fdf4;border-color:#bbf7d0;">
      <div style="font-size:24px;font-weight:700;color:#065f46;">${lowRisks}</div>
      <div style="font-size:11px;color:#059669;font-weight:600;margin-top:2px;">LOW RISK</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Contract Summary</div>
    <div class="summary-box">${analysisResults.summary || "No summary available."}</div>
  </div>
  <hr class="sep">

  <div class="section">
    <div class="section-title">Identified Risks (${risks.length})</div>
    ${riskItems || '<p style="font-size:13px;color:#9ca3af;">No risks identified.</p>'}
  </div>
  <hr class="sep">

  <div class="section">
    <div class="section-title">Opportunities (${opportunities.length})</div>
    ${oppItems || '<p style="font-size:13px;color:#9ca3af;">No opportunities identified.</p>'}
  </div>

  ${analysisResults.keyClauses?.length ? `<hr class="sep"><div class="section"><div class="section-title">Key Clauses</div>${clauseItems}</div>` : ""}
  ${recItems ? `<hr class="sep"><div class="section"><div class="section-title">Recommendations</div>${recItems}</div>` : ""}
  ${analysisResults.legalCompliance ? `<hr class="sep"><div class="section"><div class="section-title">Legal &amp; Compliance</div><div class="summary-box">${analysisResults.legalCompliance}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;"><div style="padding:12px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;"><div style="font-size:10px;font-weight:600;color:#6b7280;margin-bottom:4px;text-transform:uppercase;">Contract Duration</div><div style="font-size:13px;color:#374151;">${analysisResults.contractDuration || "Not specified"}</div></div><div style="padding:12px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;"><div style="font-size:10px;font-weight:600;color:#6b7280;margin-bottom:4px;text-transform:uppercase;">Termination</div><div style="font-size:13px;color:#374151;">${analysisResults.terminationConditions || "Not specified"}</div></div></div></div>` : ""}
  ${negItems ? `<hr class="sep"><div class="section"><div class="section-title">Negotiation Points</div>${negItems}</div>` : ""}
  ${analysisResults.contractText ? `<hr class="sep" style="page-break-before:always;"><div class="section"><div class="section-title">Full Contract Text</div><div class="contract-text-box">${analysisResults.contractText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div></div>` : ""}
</div>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (!win) {
      alert("Please allow popups to download the PDF report.");
      return;
    }
    win.document.write(reportHTML);
    win.document.close();
    setTimeout(() => {
      win.focus();
      win.print();
    }, 500);
  };

  const sections = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "risks", label: `Risks (${risks.length})`, icon: AlertTriangle },
    { id: "opportunities", label: `Opportunities (${opportunities.length})`, icon: TrendingUp },
    { id: "contract", label: "Contract", icon: BookOpen },
    { id: "clauses", label: "Key Clauses", icon: Scale },
    { id: "recommendations", label: "Recommendations", icon: Lightbulb },
    { id: "legal", label: "Legal & Compliance", icon: Shield },
    { id: "financial", label: "Financial Terms", icon: DollarSign },
    { id: "negotiation", label: "Negotiation Points", icon: Target },
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-5"
      >
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
              <FileText className="size-5 text-orange-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-gray-900">
                {contractType}
              </h1>
              <p className="text-xs text-gray-400">
                Analyzed{" "}
                {new Date(analysisResults.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer"
            >
              <Download className="size-3.5" />
              Download PDF
            </button>
            <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold", scoreInfo.bg, scoreInfo.color, scoreInfo.border, "border")}>
              <scoreInfo.icon className="size-4" />
              {Math.round(score)}/100 · {scoreInfo.text}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-7 rounded-lg bg-gray-100 flex items-center justify-center">
              <Target className="size-3.5 text-gray-500" />
            </div>
            <span className="text-xs text-gray-400">Score</span>
          </div>
          <span className="text-2xl font-semibold text-gray-900">{Math.round(score)}</span>
          <span className="text-xs text-gray-400 ml-1">/100</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-7 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertTriangle className="size-3.5 text-red-500" />
            </div>
            <span className="text-xs text-gray-400">Risks</span>
          </div>
          <span className="text-2xl font-semibold text-gray-900">{risks.length}</span>
          {highRisks > 0 && <span className="text-xs text-red-500 ml-2">{highRisks} high</span>}
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="size-3.5 text-emerald-500" />
            </div>
            <span className="text-xs text-gray-400">Opportunities</span>
          </div>
          <span className="text-2xl font-semibold text-gray-900">{opportunities.length}</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Clock className="size-3.5 text-blue-500" />
            </div>
            <span className="text-xs text-gray-400">Duration</span>
          </div>
          <span className="text-sm font-medium text-gray-900 leading-tight">
            {analysisResults.contractDuration || "Not specified"}
          </span>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex gap-6">
        {/* Sidebar Nav */}
        <div className="hidden md:block w-52 shrink-0">
          <nav className="sticky top-6 space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left cursor-pointer",
                  activeSection === section.id
                    ? "bg-orange-50 text-orange-700 font-medium"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                )}
              >
                <section.icon className="size-4 shrink-0" />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden w-full mb-4">
          <div className="flex overflow-x-auto gap-1 pb-2 -mx-4 px-4 scrollbar-hide">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all cursor-pointer",
                  activeSection === section.id
                    ? "bg-orange-50 text-orange-700 font-medium"
                    : "text-gray-500 hover:bg-gray-50"
                )}
              >
                <section.icon className="size-3.5" />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* Overview */}
          {activeSection === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between flex-wrap gap-6">
                  <div className="flex-1 min-w-[200px]">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      Overall Contract Score
                    </h3>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-4xl font-semibold text-gray-900">
                        {Math.round(score)}
                      </span>
                      <div className={cn("flex items-center gap-1 text-sm font-medium", scoreInfo.color)}>
                        <scoreInfo.icon className="size-4" />
                        {scoreInfo.text}
                      </div>
                    </div>
                    <div className="space-y-3 max-w-xs">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Risk Level</span>
                          <span className="font-medium text-gray-700">{100 - score}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full bg-red-400" style={{ width: `${100 - score}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Favorability</span>
                          <span className="font-medium text-gray-700">{score}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full bg-emerald-400" style={{ width: `${score}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-44 h-44 flex justify-center items-center">
                    <OverallScoreChart overallScore={score} />
                  </div>
                </div>
              </div>

              {/* Risk Breakdown */}
              {risks.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Risk Distribution</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-center">
                      <span className="text-xl font-semibold text-red-700">{highRisks}</span>
                      <p className="text-xs text-red-600 mt-0.5">High</p>
                    </div>
                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
                      <span className="text-xl font-semibold text-amber-700">{medRisks}</span>
                      <p className="text-xs text-amber-600 mt-0.5">Medium</p>
                    </div>
                    <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-center">
                      <span className="text-xl font-semibold text-emerald-700">{lowRisks}</span>
                      <p className="text-xs text-emerald-600 mt-0.5">Low</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Contract Summary</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {analysisResults.summary}
                </p>
              </div>
            </motion.div>
          )}

          {/* Risks — sorted list with left-border severity indicators */}
          {activeSection === "risks" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium text-gray-900">Identified Risks</h2>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-red-600">
                    <span className="size-2 rounded-full bg-red-400 inline-block" />
                    {highRisks} High
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-amber-600">
                    <span className="size-2 rounded-full bg-amber-400 inline-block" />
                    {medRisks} Med
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                    <span className="size-2 rounded-full bg-emerald-400 inline-block" />
                    {lowRisks} Low
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                {(isActive ? sortedRisks : sortedRisks.slice(0, 3)).map((risk, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex border-b last:border-b-0 border-gray-100"
                  >
                    {/* Severity stripe */}
                    <div className={cn("w-1 shrink-0", getSeverityBar(risk.severity))} />
                    <div className="flex-1 px-4 py-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-start gap-2">
                          <span className="text-[11px] font-mono text-gray-300 shrink-0 mt-[3px] select-none">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <h3 className="text-sm font-semibold text-gray-900 leading-snug">{risk.risk}</h3>
                        </div>
                        <Badge className={cn("rounded text-[10px] font-semibold border shrink-0 px-1.5 py-0", getSeverityColor(risk.severity))}>
                          {risk.severity?.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed ml-6">
                        {risk.explanation}
                      </p>
                      {risk.suggestedAlternative && (
                        <div className="ml-6 mt-3 bg-blue-50/60 border border-blue-100 rounded-lg px-3 py-2.5">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Lightbulb className="size-3.5 text-blue-600 shrink-0" />
                            <span className="text-[11px] font-semibold text-blue-700">Suggested Alternative</span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {risk.suggestedAlternative}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {!isActive && risks.length > 3 && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
                  <Lock className="size-5 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 mb-1">{risks.length - 3} more risks hidden</p>
                  <p className="text-xs text-gray-400 mb-3">Upgrade to Pro to see all risks with suggested alternatives</p>
                  <button onClick={onUpgrade} className="cursor-pointer text-white font-medium rounded-xl bg-gradient-to-b from-orange-400 to-orange-600 border border-orange-600 shadow-[0_4px_14px_rgba(234,88,12,0.4)] inline-flex h-8 px-4 items-center justify-center text-xs hover:scale-[1.02]">
                    Upgrade to Pro
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Opportunities — sorted list with left-border impact indicators */}
          {activeSection === "opportunities" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium text-gray-900">Identified Opportunities</h2>
                <span className="text-xs text-gray-400">{opportunities.length} found</span>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                {(isActive ? sortedOpps : sortedOpps.slice(0, 3)).map((opp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex border-b last:border-b-0 border-gray-100"
                  >
                    {/* Impact stripe */}
                    <div className={cn("w-1 shrink-0", getImpactBar(opp.impact))} />
                    <div className="flex-1 px-4 py-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-start gap-2">
                          <span className="text-[11px] font-mono text-gray-300 shrink-0 mt-[3px] select-none">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <h3 className="text-sm font-semibold text-gray-900 leading-snug">{opp.opportunity}</h3>
                        </div>
                        <Badge className={cn("rounded text-[10px] font-semibold border shrink-0 px-1.5 py-0", getImpactColor(opp.impact))}>
                          {opp.impact?.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed ml-6">
                        {opp.explanation}
                      </p>
                      {opp.suggestedAlternative && (
                        <div className="ml-6 mt-3 bg-emerald-50/60 border border-emerald-100 rounded-lg px-3 py-2.5">
                          <div className="flex items-center gap-1.5 mb-1">
                            <TrendingUp className="size-3.5 text-emerald-600 shrink-0" />
                            <span className="text-[11px] font-semibold text-emerald-700">How to Leverage</span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {opp.suggestedAlternative}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {!isActive && opportunities.length > 3 && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
                  <Lock className="size-5 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 mb-1">{opportunities.length - 3} more opportunities hidden</p>
                  <p className="text-xs text-gray-400 mb-3">Upgrade to Pro to see all opportunities with leverage strategies</p>
                  <button onClick={onUpgrade} className="cursor-pointer text-white font-medium rounded-xl bg-gradient-to-b from-orange-400 to-orange-600 border border-orange-600 shadow-[0_4px_14px_rgba(234,88,12,0.4)] inline-flex h-8 px-4 items-center justify-center text-xs hover:scale-[1.02]">
                    Upgrade to Pro
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Contract Text Viewer */}
          {activeSection === "contract" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium text-gray-900">Contract Document</h2>
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer"
                >
                  <Download className="size-3.5" />
                  Download Full Report
                </button>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                  <BookOpen className="size-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500 font-medium">Full Contract Text</span>
                  <span className="ml-auto text-xs text-gray-400">
                    {analysisResults.contractText
                      ? `~${Math.round(analysisResults.contractText.split(" ").length / 100) * 100} words`
                      : ""}
                  </span>
                </div>
                <div className="p-5 max-h-[620px] overflow-y-auto">
                  {analysisResults.contractText ? (
                    <pre className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-mono">
                      {analysisResults.contractText}
                    </pre>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <BookOpen className="size-8 text-gray-200 mb-3" />
                      <p className="text-sm text-gray-400">Contract text not available.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Key Clauses */}
          {activeSection === "clauses" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-base font-medium text-gray-900">Key Clauses</h2>
              {renderPremiumGate(
                <div className="space-y-3">
                  {analysisResults.keyClauses?.length > 0 ? (
                    analysisResults.keyClauses.map((clause, i) => (
                      <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 flex items-start gap-3">
                        <div className="size-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                          <Key className="size-3.5 text-blue-500" />
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{clause}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No key clauses identified.</p>
                  )}

                  {/* IP Clauses */}
                  {analysisResults.intellectualPropertyClauses && (
                    <div className="rounded-xl border border-purple-200 bg-purple-50/30 p-5 mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Gavel className="size-4 text-purple-600" />
                        <h3 className="text-sm font-medium text-gray-900">Intellectual Property</h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {typeof analysisResults.intellectualPropertyClauses === "string"
                          ? analysisResults.intellectualPropertyClauses
                          : Array.isArray(analysisResults.intellectualPropertyClauses)
                            ? (analysisResults.intellectualPropertyClauses as string[]).join(". ")
                            : "Not specified"}
                      </p>
                    </div>
                  )}
                </div>,
                "Key Clauses & IP Analysis"
              )}
            </motion.div>
          )}

          {/* Recommendations */}
          {activeSection === "recommendations" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-base font-medium text-gray-900">Recommendations</h2>
              {renderPremiumGate(
                <div className="space-y-3">
                  {analysisResults.recommendations?.length > 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                      {analysisResults.recommendations.map((rec, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex items-start gap-3 px-4 py-3.5 border-b last:border-b-0 border-gray-100"
                        >
                          <span className="size-6 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-sm text-gray-700 leading-relaxed">{rec}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No recommendations generated.</p>
                  )}

                  {/* Performance Metrics */}
                  {analysisResults.performanceMetrics?.length > 0 && (
                    <div className="rounded-xl border border-gray-200 bg-white p-5 mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="size-4 text-amber-500" />
                        <h3 className="text-sm font-medium text-gray-900">Performance Metrics</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2">
                        {analysisResults.performanceMetrics.map((metric, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
                            <CheckCircle2 className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                            {metric}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>,
                "Recommendations & Performance Metrics"
              )}
            </motion.div>
          )}

          {/* Legal & Compliance */}
          {activeSection === "legal" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-base font-medium text-gray-900">Legal & Compliance</h2>
              {renderPremiumGate(
                <div className="space-y-4">
                  <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="size-4 text-blue-500" />
                      <h3 className="text-sm font-medium text-gray-900">Compliance Assessment</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                      {analysisResults.legalCompliance || "No compliance assessment available."}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="size-4 text-gray-500" />
                        <h3 className="text-sm font-medium text-gray-900">Contract Duration</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {analysisResults.contractDuration || "Not specified"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="size-4 text-gray-500" />
                        <h3 className="text-sm font-medium text-gray-900">Termination Conditions</h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {analysisResults.terminationConditions || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>,
                "Legal Analysis & Compliance"
              )}
            </motion.div>
          )}

          {/* Financial Terms */}
          {activeSection === "financial" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-base font-medium text-gray-900">Financial Terms</h2>
              {renderPremiumGate(
                <div className="space-y-4">
                  {analysisResults.compensationStructure && (
                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="size-4 text-emerald-500" />
                        <h3 className="text-sm font-medium text-gray-900">Compensation Structure</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        {[
                          { label: "Base Salary", value: analysisResults.compensationStructure.baseSalary },
                          { label: "Bonuses", value: analysisResults.compensationStructure.bonuses },
                          { label: "Equity", value: analysisResults.compensationStructure.equity },
                          { label: "Other Benefits", value: analysisResults.compensationStructure.otherBenefits },
                        ].filter(item => item.value).map((item, i) => (
                          <div key={i} className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                            <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                            <p className="text-sm font-medium text-gray-900">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysisResults.financialTerms && (
                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Financial Details</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {analysisResults.financialTerms.description}
                      </p>
                      {analysisResults.financialTerms.details?.length > 0 && (
                        <div className="space-y-2">
                          {analysisResults.financialTerms.details.map((detail: string, i: number) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-gray-600 bg-emerald-50/50 rounded-lg p-3 border border-emerald-200/50">
                              <DollarSign className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                              {detail}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {!analysisResults.compensationStructure && !analysisResults.financialTerms && (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                      <DollarSign className="size-6 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No financial terms identified in this contract.</p>
                    </div>
                  )}
                </div>,
                "Financial Terms & Compensation"
              )}
            </motion.div>
          )}

          {/* Negotiation Points */}
          {activeSection === "negotiation" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-base font-medium text-gray-900">Negotiation Points</h2>
              {renderPremiumGate(
                <div className="space-y-3">
                  {analysisResults.negotiationPoints?.length > 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                      {analysisResults.negotiationPoints.map((point, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex items-start gap-3 px-4 py-3.5 border-b last:border-b-0 border-gray-100"
                        >
                          <div className="size-6 rounded-full bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                            <Target className="size-3 text-amber-600" />
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                      <Target className="size-6 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No negotiation points identified.</p>
                    </div>
                  )}
                </div>,
                "Negotiation Points"
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
