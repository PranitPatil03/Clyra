"use client";

import { api } from "@/lib/api";
import { queryClient } from "@/providers/tanstack/react-query-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function LoginPage() {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useCurrentUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    useEffect(() => {
        if (!isAuthLoading && user) {
            router.replace("/dashboard");
        }
    }, [user, isAuthLoading, router]);

    if (isAuthLoading || user) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#f8fafc]">
                <Loader2 className="size-6 animate-spin text-gray-400" />
            </div>
        );
    }

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post("/api/auth/sign-in/email", {
                email,
                password,
            });

            if (response.status === 200) {
                toast.success("Login successful!");
                queryClient.clear();
                router.refresh();
                router.replace("/dashboard");
            }
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Invalid email or password"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setIsGoogleLoading(true);
        window.location.href = `/auth/google`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
            <div className="w-full max-w-sm p-8">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link
                        href="/"
                        className="text-xl font-light tracking-tight text-gray-900 inline-block"
                    >
                        Clyra
                    </Link>
                    <h1 className="text-2xl font-medium text-gray-900 mt-3">
                        Login to your account
                    </h1>
                    <p className="text-sm text-gray-400 mt-2">
                        Sign in to access your contract analysis dashboard.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-all"
                        />
                    </div>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 rounded-xl text-sm font-semibold text-white bg-gradient-to-b from-orange-400 to-orange-600 border border-orange-600 shadow-[0_4px_14px_rgba(234,88,12,0.4)] hover:shadow-[0_6px_20px_rgba(234,88,12,0.6)] hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading && (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        )}
                        Log in
                    </button>
                </form>

                {/* Separator */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-[#f8fafc] px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Or authorize with
                        </span>
                    </div>
                </div>

                {/* Google OAuth */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isGoogleLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <svg className="size-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                    )}
                    Google
                </button>

                {/* Footer */}
                <p className="text-center text-sm text-gray-400 mt-6">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="text-gray-900 font-semibold hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
