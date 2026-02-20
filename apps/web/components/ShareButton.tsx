'use client';

import { useState } from 'react';
import { Copy } from 'lucide-react';

interface ShareButtonProps {
    url?: string;
    title?: string;
}

export default function ShareButton({ url, title = 'Share Stream' }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const targetUrl = url || window.location.href;
        try {
            await navigator.clipboard.writeText(targetUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-all active:scale-95 border border-neutral-700"
            title="Copy Link"
        >
            {copied ? (
                <>
                    <span className="text-green-500 font-bold">✓ Copied!</span>
                </>
            ) : (
                <>
                    <Copy size={18} />
                    <span>{title}</span>
                </>
            )}
        </button>
    );
}
