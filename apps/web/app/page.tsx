"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthForm from '../components/AuthForm';

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [user, setUser] = useState<any>(null);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setIsLoggedIn(true);
            setUser(JSON.parse(userData));
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
    };

    if (isLoggedIn === null) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">Loading...</div>;
    }

    // Dashboard View (Authenticated)
    if (isLoggedIn) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 dark:bg-black relative">
                <div className="absolute top-10 right-10 flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Welcome, <span className="text-blue-600 font-bold">{user?.username}</span>
                    </span>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors shadow-md border border-neutral-700"
                    >
                        Logout
                    </button>
                </div>

                <div className="relative flex flex-col items-center z-10">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400 mb-2">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-12">Manage your streams and engage with your audience.</p>

                    <Link
                        href="/broadcast"
                        className="group relative inline-flex items-center justify-center rounded-2xl border border-transparent px-10 py-5 transition-all hover:scale-105 active:scale-95 bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                    >
                        <div className="flex flex-col items-center">
                            <h2 className={`text-2xl font-black flex items-center gap-3 tracking-tight`}>
                                GO LIVE 🔴{' '}
                                <span className="transition-transform group-hover:translate-x-2">
                                    -&gt;
                                </span>
                            </h2>
                            <p className={`mt-1 text-sm font-medium opacity-80`}>
                                Start your broadcast now
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -z-10" />
            </main>
        );
    }

    // Auth Homepage (Guest)
    return (
        <main className="flex min-h-screen flex-col lg:flex-row items-center bg-white dark:bg-black">
            <div className="flex-1 p-12 lg:p-24 flex flex-col justify-center space-y-8">
                <div>
                    <h1 className="text-7xl font-black tracking-tighter text-gray-900 dark:text-white leading-tight">
                        Broadcast to the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400 font-extrabold underline decoration-blue-500/30">
                            World.
                        </span>
                    </h1>
                    <p className="mt-6 text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
                        The ultimate low-latency streaming platform for creators. Join the community and start your journey today.
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-black bg-gray-200 overflow-hidden shadow-sm">
                                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                            </div>
                        ))}
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Joined by <span className="text-blue-600">10,000+</span> creators
                    </p>
                </div>
            </div>

            <div className="flex-1 w-full lg:max-w-2xl p-12 lg:p-24 flex items-center justify-center bg-gray-50 dark:bg-neutral-950 relative overflow-hidden">
                <div className="relative z-10 w-full flex flex-col items-center">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Get Started</h2>
                        <p className="text-gray-500 text-sm mt-1">Sign in to access your dashboard</p>
                    </div>

                    <div className="w-full max-w-md">
                        <AuthForm type={authMode} />
                    </div>

                    <div className="mt-8 flex gap-2">
                        <p className="text-sm text-gray-500">
                            {authMode === 'login' ? "New here?" : "Already member?"}
                        </p>
                        <button
                            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                            className="text-sm font-bold text-blue-600 hover:underline"
                        >
                            {authMode === 'login' ? "Create account" : "Sign in now"}
                        </button>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-3xl rounded-full" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/5 blur-3xl rounded-full" />
            </div>
        </main>
    );
}
