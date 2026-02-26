"use client";

import { ContractAnalysis } from "@/interfaces/contract.interface";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { UploadModal } from "../modals/upload-modal";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertTriangle,
  ArrowUpRight,
  FileText,
  Grid3X3,
  LayoutList,
  Loader2,
  MoreHorizontal,
  Sparkles,
  TrendingUp,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// Parse contract type from possible JSON/object format
function parseContractType(raw: any): string {
  if (!raw) return "Unknown";
  if (typeof raw === "string") {
    // Try to parse JSON strings like '{"contract_type": "Lease"}'
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
      // Clean up any quotes or extra whitespace
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

// Generate a short name from the contract type
function getContractName(contract: ContractAnalysis): string {
  const type = parseContractType(contract.contractType);
  const date = new Date(contract.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return `${type} — ${date}`;
}

const contractTypeColors: { [key: string]: string } = {
  Employment: "bg-blue-50 text-blue-700 border-blue-200",
  "Non-Disclosure Agreement":
    "bg-violet-50 text-violet-700 border-violet-200",
  NDA: "bg-violet-50 text-violet-700 border-violet-200",
  Sales: "bg-amber-50 text-amber-700 border-amber-200",
  Lease: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Services: "bg-pink-50 text-pink-700 border-pink-200",
  "Consulting Services Agreement": "bg-pink-50 text-pink-700 border-pink-200",
  "Vendor Services Agreement": "bg-cyan-50 text-cyan-700 border-cyan-200",
  SaaS: "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Software-as-a-Service": "bg-indigo-50 text-indigo-700 border-indigo-200",
  Other: "bg-gray-50 text-gray-600 border-gray-200",
};

function getTypeColor(contractType: string): string {
  const type = parseContractType(contractType);
  // Check exact match first
  if (contractTypeColors[type]) return contractTypeColors[type];
  // Check partial match
  for (const [key, value] of Object.entries(contractTypeColors)) {
    if (type.toLowerCase().includes(key.toLowerCase())) return value;
  }
  return contractTypeColors["Other"];
}

function getScoreColor(score: number) {
  if (score >= 75)
    return { bg: "bg-emerald-50", text: "text-emerald-700", label: "Good" };
  if (score >= 50)
    return { bg: "bg-amber-50", text: "text-amber-700", label: "Fair" };
  return { bg: "bg-red-50", text: "text-red-700", label: "At Risk" };
}

export default function UserContracts() {
  const queryClient = useQueryClient();

  const {
    data: contracts,
    isLoading,
    isError,
  } = useQuery<ContractAnalysis[]>({
    queryKey: ["user-contracts"],
    queryFn: () => fetchUserContracts(),
  });

  const { mutate: deleteContract, isPending: isDeleting } = useMutation({
    mutationFn: async (contractId: string) => {
      await api.delete(`/contracts/contract/${contractId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-contracts"] });
      toast.success("Contract deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete contract");
    },
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const columns: ColumnDef<ContractAnalysis>[] = [
    {
      accessorKey: "contractType",
      header: "Contract",
      cell: ({ row }) => {
        const contract = row.original;
        const type = parseContractType(contract.contractType);
        return (
          <Link
            href={`/dashboard/contract/${contract._id}`}
            className="group flex items-center gap-3"
          >
            <div className="size-9 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition-colors">
              <FileText className="size-4 text-orange-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                {getContractName(contract)}
              </p>
              <p className="text-xs text-gray-400 truncate">{type}</p>
            </div>
          </Link>
        );
      },
    },
    {
      accessorKey: "overallScore",
      header: "Score",
      cell: ({ row }) => {
        const score = parseFloat(row.getValue("overallScore")) || 0;
        const scoreInfo = getScoreColor(score);
        return (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border",
                scoreInfo.bg,
                scoreInfo.text
              )}
            >
              {Math.round(score)}/100
            </span>
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const contract = row.original;
        const hasRisks = contract.risks?.some((r) => r.severity === "high");
        return (
          <Badge
            className={cn(
              "rounded-md text-xs font-medium border",
              hasRisks
                ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
            )}
          >
            {hasRisks ? "Needs Review" : "Analyzed"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <span className="text-sm text-gray-500">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const contract = row.original;

        return (
          <div className="flex items-center gap-1">
            <Link href={`/dashboard/contract/${contract._id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-orange-600 h-8 px-2"
              >
                <ArrowUpRight className="size-4" />
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-red-600 h-8 px-2"
                >
                  <Trash2 className="size-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this contract?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The contract analysis will be
                    permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-lg">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteContract(contract._id)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    {isDeleting ? (
                      <Loader2 className="size-4 animate-spin mr-2" />
                    ) : null}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: contracts ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const totalContracts = contracts?.length || 0;
  const averageScore =
    totalContracts > 0
      ? (contracts?.reduce(
        (sum, contract) => sum + (contract.overallScore ?? 0),
        0
      ) ?? 0) / totalContracts
      : 0;

  const highRiskContracts =
    contracts?.filter((contract) =>
      contract.risks?.some((risk) => risk.severity === "high")
    ).length ?? 0;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="size-6 animate-spin text-gray-400" />
          <span className="ml-3 text-gray-500 text-sm">
            Loading contracts...
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500 text-sm">
            Failed to load contracts. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-gray-900">
            Your Contracts
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage and review your analyzed contracts
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="cursor-pointer text-white font-medium rounded-xl transition-all duration-200 bg-gradient-to-b from-orange-400 to-orange-600 border border-orange-600 shadow-[0_4px_14px_rgba(234,88,12,0.4)] inline-flex h-10 px-6 items-center justify-center text-sm hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(234,88,12,0.6)]"
        >
          <Sparkles className="size-4 mr-2" />
          New Contract
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
              <FileText className="size-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Total Contracts
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {totalContracts}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <TrendingUp className="size-4 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Average Score
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {averageScore.toFixed(0)}
            <span className="text-sm font-normal text-gray-400">/100</span>
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-9 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
              <AlertTriangle className="size-4 text-red-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              High Risk
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {highRiskContracts}
          </p>
        </div>
      </div>

      {/* View Toggle + Content */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-500">All Contracts</h2>
          <div className="flex items-center gap-1 p-1 rounded-lg border border-gray-200 bg-white">
            <button
              onClick={() => setViewMode("cards")}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === "cards"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Grid3X3 className="size-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === "table"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <LayoutList className="size-4" />
            </button>
          </div>
        </div>

        {/* Cards View */}
        {viewMode === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contracts && contracts.length > 0 ? (
              contracts.map((contract) => {
                const type = parseContractType(contract.contractType);
                const score = contract.overallScore ?? 0;
                const scoreInfo = getScoreColor(score);
                const hasRisks = contract.risks?.some(
                  (r) => r.severity === "high"
                );
                const date = new Date(contract.createdAt);

                return (
                  <Link
                    key={contract._id}
                    href={`/dashboard/contract/${contract._id}`}
                    className="group block"
                  >
                    <div className="rounded-xl border border-gray-200 bg-white p-5 hover:border-orange-300 hover:shadow-md transition-all duration-200 h-full flex flex-col">
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="size-10 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                          <FileText className="size-5 text-orange-600" />
                        </div>
                        <Badge
                          className={cn(
                            "rounded-md text-xs font-medium border",
                            hasRisks
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          )}
                        >
                          {hasRisks ? "Needs Review" : "Analyzed"}
                        </Badge>
                      </div>

                      {/* Contract Name & Type */}
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors truncate">
                        {type}
                      </h3>
                      <p className="text-xs text-gray-400 mb-4">
                        {date.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>

                      {/* Summary Preview */}
                      {contract.summary && (
                        <p className="text-xs text-gray-500 mb-4 line-clamp-2 flex-grow">
                          {contract.summary}
                        </p>
                      )}

                      {/* Score + Stats */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold border",
                              scoreInfo.bg,
                              scoreInfo.text
                            )}
                          >
                            {Math.round(score)}/100
                          </span>
                          <span className="text-xs text-gray-400">
                            {scoreInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span>{contract.risks?.length || 0} risks</span>
                          <span>
                            {contract.opportunities?.length || 0} opps
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <div className="size-14 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
                  <FileText className="size-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  No contracts yet
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Upload your first contract to get AI-powered analysis
                </p>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="cursor-pointer text-white font-medium rounded-xl transition-all duration-200 bg-gradient-to-b from-orange-400 to-orange-600 border border-orange-600 shadow-[0_4px_14px_rgba(234,88,12,0.4)] inline-flex h-9 px-5 items-center justify-center text-xs hover:scale-[1.02]"
                >
                  <Sparkles className="size-3.5 mr-1.5" />
                  Upload Contract
                </button>
              </div>
            )}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <>
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="border-gray-100 hover:bg-transparent"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="text-xs font-medium text-gray-500 h-10"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="border-gray-100 hover:bg-gray-50/50 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="py-3">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-sm text-gray-400"
                      >
                        No contracts yet. Upload one to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg text-xs h-8"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg text-xs h-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={() => {
          queryClient.invalidateQueries({ queryKey: ["user-contracts"] });
        }}
      />
    </div>
  );
}

async function fetchUserContracts(): Promise<ContractAnalysis[]> {
  const response = await api.get("/contracts/user-contracts");
  return response.data;
}
