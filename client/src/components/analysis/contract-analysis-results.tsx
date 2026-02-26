import { ContractAnalysis } from "@/interfaces/contract.interface";
import { ReactNode, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  Clock,
  DollarSign,
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

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-blue-50 text-blue-700 border-blue-200";
      case "medium": return "bg-amber-50 text-amber-700 border-amber-200";
      case "low": return "bg-gray-50 text-gray-600 border-gray-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const risks = analysisResults.risks || [];
  const opportunities = analysisResults.opportunities || [];
  const highRisks = risks.filter(r => r.severity === "high").length;
  const medRisks = risks.filter(r => r.severity === "medium").length;
  const lowRisks = risks.filter(r => r.severity === "low").length;

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

  const sections = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "risks", label: `Risks (${risks.length})`, icon: AlertTriangle },
    { id: "opportunities", label: `Opportunities (${opportunities.length})`, icon: TrendingUp },
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
          <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold", scoreInfo.bg, scoreInfo.color, scoreInfo.border, "border")}>
            <scoreInfo.icon className="size-4" />
            {Math.round(score)}/100 · {scoreInfo.text}
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
            <motion.div initial={{
              opacity: 0
            }} animate={{ opacity: 1 }} className="space-y-5">
              {/* Score Card */}
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

          {/* Risks */}
          {activeSection === "risks" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-medium text-gray-900">
                  Identified Risks
                </h2>
                <span className="text-xs text-gray-400">{risks.length} found</span>
              </div>
              {(isActive ? risks : risks.slice(0, 3)).map((risk, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="size-4 text-red-500 mt-0.5 shrink-0" />
                      <span className="text-sm font-medium text-gray-900">{risk.risk}</span>
                    </div>
                    <Badge className={cn("rounded-md text-xs font-medium border shrink-0", getSeverityColor(risk.severity))}>
                      {risk.severity?.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed ml-[26px]">
                    {risk.explanation}
                  </p>
                </motion.div>
              ))}
              {!isActive && risks.length > 3 && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
                  <Lock className="size-5 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 mb-1">{risks.length - 3} more risks</p>
                  <p className="text-xs text-gray-400 mb-3">Upgrade to Pro to see all identified risks</p>
                  <button onClick={onUpgrade} className="cursor-pointer text-white font-medium rounded-xl bg-gradient-to-b from-orange-400 to-orange-600 border border-orange-600 shadow-[0_4px_14px_rgba(234,88,12,0.4)] inline-flex h-8 px-4 items-center justify-center text-xs hover:scale-[1.02]">
                    Upgrade to Pro
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Opportunities */}
          {activeSection === "opportunities" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-medium text-gray-900">
                  Identified Opportunities
                </h2>
                <span className="text-xs text-gray-400">{opportunities.length} found</span>
              </div>
              {(isActive ? opportunities : opportunities.slice(0, 3)).map((opp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <div className="flex items-start gap-2.5">
                      <TrendingUp className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-sm font-medium text-gray-900">{opp.opportunity}</span>
                    </div>
                    <Badge className={cn("rounded-md text-xs font-medium border shrink-0", getImpactColor(opp.impact))}>
                      {opp.impact?.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed ml-[26px]">
                    {opp.explanation}
                  </p>
                </motion.div>
              ))}
              {!isActive && opportunities.length > 3 && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
                  <Lock className="size-5 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 mb-1">{opportunities.length - 3} more opportunities</p>
                  <p className="text-xs text-gray-400 mb-3">Upgrade to Pro to see all opportunities</p>
                  <button onClick={onUpgrade} className="cursor-pointer text-white font-medium rounded-xl bg-gradient-to-b from-orange-400 to-orange-600 border border-orange-600 shadow-[0_4px_14px_rgba(234,88,12,0.4)] inline-flex h-8 px-4 items-center justify-center text-xs hover:scale-[1.02]">
                    Upgrade to Pro
                  </button>
                </div>
              )}
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
                    analysisResults.recommendations.map((rec, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-xl border border-gray-200 bg-white p-4 flex items-start gap-3"
                      >
                        <span className="size-6 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm text-gray-700 leading-relaxed">{rec}</p>
                      </motion.div>
                    ))
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
                  {/* Legal Compliance */}
                  <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="size-4 text-blue-500" />
                      <h3 className="text-sm font-medium text-gray-900">Compliance Assessment</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                      {analysisResults.legalCompliance || "No compliance assessment available."}
                    </p>
                  </div>

                  {/* Duration & Termination */}
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
                  {/* Compensation Structure */}
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

                  {/* Financial Terms from AI */}
                  {(analysisResults as any).financialTerms && (
                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Financial Details</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {(analysisResults as any).financialTerms.description}
                      </p>
                      {(analysisResults as any).financialTerms.details?.length > 0 && (
                        <div className="space-y-2">
                          {(analysisResults as any).financialTerms.details.map((detail: string, i: number) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-gray-600 bg-emerald-50/50 rounded-lg p-3 border border-emerald-200/50">
                              <DollarSign className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                              {detail}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {!analysisResults.compensationStructure && !(analysisResults as any).financialTerms && (
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
                    analysisResults.negotiationPoints.map((point, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-xl border border-gray-200 bg-white p-4 flex items-start gap-3"
                      >
                        <div className="size-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                          <Target className="size-3.5 text-amber-600" />
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
                      </motion.div>
                    ))
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
