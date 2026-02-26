"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useContractStore } from "@/store/zustand";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface IUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

// Parse contract type from possible JSON format from AI
function cleanContractType(raw: string): string {
  if (!raw) return "Unknown";
  const trimmed = raw.trim();
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed === "object" && parsed !== null) {
      return (
        parsed.contract_type ||
        parsed.contractType ||
        parsed.type ||
        String(Object.values(parsed)[0]) ||
        "Unknown"
      );
    }
    return String(parsed);
  } catch {
    return trimmed.replace(/^["']|["']$/g, "").trim();
  }
}

export function UploadModal({
  isOpen,
  onClose,
  onUploadComplete,
}: IUploadModalProps) {
  const { setAnalysisResults } = useContractStore();
  const router = useRouter();

  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState<
    "upload" | "detecting" | "confirm" | "processing" | "done"
  >("upload");

  const { mutate: detectContractType } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("contract", file);

      const response = await api.post<{ detectedType: string }>(
        `/contracts/detect-type`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.detectedType;
    },

    onSuccess: (data: string) => {
      setDetectedType(cleanContractType(data));
      setStep("confirm");
    },
    onError: (error) => {
      console.error(error);
      setError("Failed to detect contract type. Please try again.");
      setStep("upload");
    },
  });

  const { mutate: uploadFile } = useMutation({
    mutationFn: async ({
      file,
      contractType,
    }: {
      file: File;
      contractType: string;
    }) => {
      const formData = new FormData();
      formData.append("contract", file);
      formData.append("contractType", contractType);

      const response = await api.post(`/contracts/analyze`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onSuccess: (data) => {
      setAnalysisResults(data);
      setStep("done");
      onUploadComplete();
      setTimeout(() => {
        handleClose();
        router.push(`/dashboard/contract/${data._id}`);
      }, 1200);
    },
    onError: (error) => {
      console.error(error);
      setError("Failed to analyze contract. Please try again.");
      setStep("upload");
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles(acceptedFiles);
      setError(null);
      setStep("upload");
    } else {
      setError("No file selected");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleFileUpload = () => {
    if (files.length > 0) {
      setError(null);
      setStep("detecting");
      detectContractType(files[0]);
    }
  };

  const handleAnalyzeContract = () => {
    if (files.length > 0 && detectedType) {
      setStep("processing");
      uploadFile({ file: files[0], contractType: detectedType });
    }
  };

  const handleClose = () => {
    onClose();
    setFiles([]);
    setDetectedType(null);
    setError(null);
    setStep("upload");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl border-gray-200 shadow-xl p-6 [&>button]:hidden">
        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="mb-5">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-medium text-gray-900">
                    Upload Contract
                  </DialogTitle>
                  <button
                    onClick={handleClose}
                    className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400 hover:text-gray-600"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <DialogDescription className="text-sm text-gray-400">
                  Upload a PDF contract for AI-powered analysis
                </DialogDescription>
              </DialogHeader>

              {/* Drop zone */}
              <div
                {...getRootProps()}
                className={cn(
                  "rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 cursor-pointer",
                  isDragActive
                    ? "border-orange-400 bg-orange-50/50"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50/30"
                )}
              >
                <input {...getInputProps()} />
                <div
                  className={cn(
                    "size-11 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors",
                    isDragActive
                      ? "bg-orange-100 text-orange-600"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  <Upload className="size-5" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {isDragActive
                    ? "Drop your file here"
                    : "Drag & drop your contract"}
                </p>
                <p className="text-xs text-gray-400">
                  or click to browse · PDF only
                </p>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200"
                >
                  <X className="size-4 text-red-500 shrink-0" />
                  <span className="text-xs text-red-700">{error}</span>
                </motion.div>
              )}

              {/* Selected file */}
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200">
                    <div className="size-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                      <FileText className="size-4 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {files[0].name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatFileSize(files[0].size)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFiles([]);
                      }}
                      className="size-7 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                      <X className="size-3.5 text-gray-400" />
                    </button>
                  </div>

                  <button
                    onClick={handleFileUpload}
                    className="mt-3 w-full cursor-pointer text-white font-medium rounded-xl transition-all duration-200 bg-gradient-to-b from-orange-400 to-orange-600 border border-orange-600 shadow-[0_4px_14px_rgba(234,88,12,0.4)] h-11 flex items-center justify-center text-sm hover:scale-[1.01] hover:shadow-[0_6px_20px_rgba(234,88,12,0.6)]"
                  >
                    Detect Contract Type
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === "detecting" && (
            <motion.div
              key="detecting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-14"
            >
              <Loader2 className="size-8 text-orange-500 animate-spin mb-5" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Detecting contract type...
              </p>
              <p className="text-xs text-gray-400">
                Reading and analyzing your document
              </p>
            </motion.div>
          )}

          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <DialogHeader className="mb-5">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-medium text-gray-900">
                    Contract Detected
                  </DialogTitle>
                  <button
                    onClick={handleClose}
                    className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400 hover:text-gray-600"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <DialogDescription className="text-sm text-gray-400">
                  We identified your contract type
                </DialogDescription>
              </DialogHeader>

              {/* Detected type */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 mb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-[11px] text-emerald-600 font-medium uppercase tracking-wider">
                      Detected Type
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {detectedType}
                    </p>
                  </div>
                </div>
              </div>

              {/* File info */}
              {files.length > 0 && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 mb-4">
                  <div className="size-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                    <FileText className="size-3.5 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">
                      {files[0].name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {formatFileSize(files[0].size)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setDetectedType(null);
                    setStep("upload");
                  }}
                  className="flex-1 h-11 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Change File
                </button>
                <button
                  onClick={handleAnalyzeContract}
                  className="flex-1 cursor-pointer text-white font-medium rounded-xl transition-all duration-200 bg-gradient-to-b from-orange-400 to-orange-600 border border-orange-600 shadow-[0_4px_14px_rgba(234,88,12,0.4)] h-11 text-sm hover:scale-[1.01] hover:shadow-[0_6px_20px_rgba(234,88,12,0.6)]"
                >
                  Analyze Contract
                </button>
              </div>
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-14"
            >
              <Loader2 className="size-8 text-orange-500 animate-spin mb-5" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Analyzing your contract...
              </p>
              <p className="text-xs text-gray-400 mb-6">
                AI is reviewing risks, opportunities & clauses
              </p>

              {/* Subtle progress bar */}
              <div className="w-52 h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
                  initial={{ width: "5%" }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 20, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-14"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 200 }}
              >
                <CheckCircle2 className="size-10 text-emerald-500 mb-4" />
              </motion.div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Analysis Complete
              </p>
              <p className="text-xs text-gray-400 mb-3">
                Redirecting to results...
              </p>
              <Loader2 className="size-4 text-gray-300 animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
