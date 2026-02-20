'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white gap-4">
            <h2 className="text-2xl font-bold">Something went wrong!</h2>
            <p className="text-neutral-400">{error.message}</p>
            <button
                onClick={() => reset()}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
            >
                Try again
            </button>
        </div>
    );
}
