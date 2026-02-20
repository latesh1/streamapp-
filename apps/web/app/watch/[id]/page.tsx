"use client";

import { useEffect, useState } from 'react';
import '@livekit/components-styles';
import {
    LiveKitRoom,
    GridLayout,
    ParticipantTile,
    ControlBar,
    RoomAudioRenderer,
    useTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useParams } from 'next/navigation';
import Chat from '../../../components/Chat';

export default function WatchPage() {
    const params = useParams();
    const streamId = params.id as string;

    const [token, setToken] = useState("");
    const [identity, setIdentity] = useState(`viewer-${Math.floor(Math.random() * 10000)}`);

    useEffect(() => {
        const getToken = async () => {
            try {
                const resp = await fetch(`/api/proxy/stream/token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        roomName: streamId,
                        participantName: identity,
                        identity: identity,
                        isPublisher: true
                    })
                });

                if (!resp.ok) {
                    throw new Error("Failed to connect to backend");
                }

                const data = await resp.json();
                setToken(data.token);
            } catch (e) {
                console.error("Failed to get token", e);
            }
        };

        if (streamId) {
            getToken();
        }
    }, [streamId, identity]);

    return (
        <div className="h-screen w-full bg-black text-white" data-lk-theme="default">
            {token === "" ? (
                <div className="flex h-full items-center justify-center flex-col gap-4">
                    <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    <p>Loading Stream...</p>
                </div>
            ) : (
                <LiveKitRoom
                    video={true}
                    audio={true}
                    token={token}
                    serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || "ws://localhost:7880"}
                    data-lk-theme="default"
                    style={{ height: '100vh' }}
                    onDisconnected={() => { window.location.href = 'https://intergular-alexa-pseudogenerically.ngrok-free.dev/' }}
                >
                    <WatchSession streamId={streamId} />
                </LiveKitRoom>
            )}
        </div>
    );
}

function WatchSession({ streamId }: { streamId: string }) {
    // Get tracks for the grid - must be inside LiveKitRoom
    const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare]);

    return (
        <div className="flex h-full flex-col md:flex-row">
            <div className="flex-1 relative flex flex-col">
                <GridLayout tracks={tracks}>
                    <ParticipantTile />
                </GridLayout>
                <ControlBar controls={{ chat: false }} />
            </div>
            <div className="w-full md:w-80 lg:w-96 border-l border-neutral-800 bg-neutral-900">
                <Chat roomId={streamId} />
            </div>
            <RoomAudioRenderer />
        </div>
    );
}
