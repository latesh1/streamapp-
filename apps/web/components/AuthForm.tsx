"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AuthFormProps {
    type: "login" | "register";
}

export default function AuthForm({ type }: AuthFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("viewer");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const endpoint = type === "login" ? "/api/auth/login" : "/api/auth/register";
        const body = type === "login"
            ? { email, password }
            : { username, email, password, role };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            if (type === "login") {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                // Force a reload to root to trigger Dashboard rendering
                window.location.href = "/";
            } else {
                setError("Registration successful! Please login.");
                setTimeout(() => {
                    window.location.href = "/";
                }, 1500);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-10 space-y-8 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 dark:border-neutral-800/50">
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight capitalize">
                    {type}
                </h2>
                <p className="text-gray-500 text-sm font-medium">Welcome back to the future of streaming.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {type === "register" && (
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
                        <input
                            type="text"
                            placeholder="johndoe"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-5 py-3.5 bg-gray-50 dark:bg-neutral-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all outline-none placeholder:text-gray-400/50"
                            required
                        />
                    </div>
                )}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-neutral-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all outline-none placeholder:text-gray-400/50"
                        required
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-neutral-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all outline-none placeholder:text-gray-400/50"
                        required
                    />
                </div>

                {type === "register" && (
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Account Type</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-5 py-3.5 bg-gray-50 dark:bg-neutral-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all outline-none appearance-none cursor-pointer"
                        >
                            <option value="viewer">Viewer (Watch only)</option>
                            <option value="creator">Creator (Broadcast & Watch)</option>
                        </select>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                        <p className="text-xs font-bold text-red-500 text-center">{error}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 text-white font-black bg-blue-600 rounded-2xl hover:bg-blue-700 hover:shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? "AUTHENTICATING..." : type.toUpperCase()}
                </button>
            </form>
        </div>
    );
}
