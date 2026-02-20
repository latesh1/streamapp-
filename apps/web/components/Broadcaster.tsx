"use client";

import '@livekit/components-styles';
import {
    LiveKitRoom,
    VideoConference,
    formatChatMessageLinks,
    useToken,
    LocalUserChoices,
    PreJoin,
} from '@livekit/components-react';
import {
    RoomOptions,
    VideoPresets,
    Room,
    Participant,
} from 'livekit-client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import BroadcasterStudio from './BroadcasterStudio';

export default function Broadcaster() {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [roomName, setRoomName] = useState(`room-${Math.floor(Math.random() * 10000)}`);
    const [identity, setIdentity] = useState(`broadcaster-${Math.floor(Math.random() * 10000)}`);
    const [error, setError] = useState("");

    // Function to get token
    const getToken = async (userChoices: LocalUserChoices) => {
        try {
            setError("");
            const resp = await fetch(`/api/proxy/stream/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomName: roomName,
                    participantName: userChoices.username || identity,
                    identity: identity,
                    isPublisher: true
                })
            });

            if (!resp.ok) {
                throw new Error("Failed to connect to backend");
            }

            const data = await resp.json();
            setToken(data.token);

            // Also start egress for HLS
            // We don't block on this failing, as it might just be the egress service unavailable
            fetch(`/api/proxy/stream/egress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roomName: roomName })
            }).catch(e => console.warn("Egress failed to start", e));

        } catch (e: any) {
            console.error(e);
            setError("Could not start stream. Is the backend running? (npm run dev)");
        }
    };

    const [preJoinChoices, setPreJoinChoices] = useState<LocalUserChoices | undefined>(undefined);

    // Check for Secure Context (HTTPS or localhost)
    const isSecureContext = typeof window !== 'undefined' && (window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    // Non-blocking warning for insecure context
    const insecureWarning = !isSecureContext ? (
        <div className="bg-orange-600 text-white px-4 py-2 text-center z-[100] relative">
            <p className="font-bold">⚠️ Insecure Context Detected</p>
            <p className="text-xs opacity-90">
                Camera/Microphone access may be blocked.
                Enable "Insecure origins treated as secure" in chrome://flags for full functionality.
            </p>
        </div>
    ) : null;

    // const liveKitUrl = "wss://intergular-alexa-pseudogenerically.ngrok-free.dev/livekit";
    const liveKitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || "ws://localhost:7880";
    console.log("LiveKit URL:", liveKitUrl);

    return (
        <div className="h-screen w-full flex flex-col" data-lk-theme="default">
            {insecureWarning}
            {/* DEBUG: Display LiveKit URL */}
            <div className="absolute top-0 right-0 z-50 bg-black/80 text-white p-2 text-xs">
                Server: {liveKitUrl} {isSecureContext ? '(Secure)' : '(Insecure)'}
            </div>
            {token === "" ? (
                <div className="grid place-items-center h-full relative">
                    <PreJoin
                        defaults={{
                            username: identity,
                            videoEnabled: isSecureContext,
                            audioEnabled: isSecureContext,
                        }}
                        onSubmit={async (values) => {
                            setPreJoinChoices(values);
                            await getToken(values);
                        }}
                    />
                    {error && (
                        <div className="absolute bottom-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                </div>
            ) : (
                <LiveKitRoom
                    video={true}
                    audio={true}
                    token={token}
                    serverUrl={liveKitUrl}
                    data-lk-theme="default"
                    style={{ height: '100vh' }}
                    onDisconnected={() => { window.location.href = 'https://intergular-alexa-pseudogenerically.ngrok-free.dev/' }}
                >
                    <BroadcasterStudio roomName={roomName} />
                </LiveKitRoom>
            )}
        </div>
    );
}
