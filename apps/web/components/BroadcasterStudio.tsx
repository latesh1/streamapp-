"use client";

import {
    useTracks,
    ControlBar,
    DisconnectButton,
    RoomAudioRenderer,
    useConnectionState,
    GridLayout,
    ParticipantTile,
} from '@livekit/components-react';
import { ConnectionState, Track } from 'livekit-client';
import { useMemo } from 'react';
import Chat from './Chat';
import ShareButton from './ShareButton';

export default function BroadcasterStudio({ roomName }: { roomName: string }) {
    const connectionState = useConnectionState();
    const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare]);



    if (connectionState === ConnectionState.Connecting) {
        return (
            <div className="h-full w-full bg-neutral-900 flex items-center justify-center text-white flex-col gap-2">
                <div className="animate-spin h-8 w-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
                <p>Connecting to Live Server...</p>
            </div>
        );
    }

    if (connectionState === ConnectionState.Disconnected || connectionState === ConnectionState.Reconnecting) {
        return (
            <div className="h-full w-full bg-neutral-900 flex items-center justify-center text-white flex-col gap-2">
                <p className="text-red-500">Connection Lost or Failed.</p>
                <p className="text-sm opacity-50">Please check if the LiveKit Server is running.</p>
            </div>
        )
    }

    // Construct the watch URL for sharing
    // Uses window.location.origin if available, otherwise relative
    const watchUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/watch/${roomName}`
        : `/watch/${roomName}`;

    return (
        <div className="relative h-full w-full bg-neutral-950 flex flex-col md:flex-row overflow-hidden">
            {/* Main Content Area (Video) */}
            <div className="flex-1 relative flex flex-col h-full">
                {/* Top Bar for Video Area */}
                <div className="absolute top-0 left-0 w-full z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
                    <div className="flex items-center gap-2 pointer-events-auto">
                        <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold animate-pulse">
                            LIVE
                        </span>
                        <span className="text-white text-sm font-mono opacity-80">
                            00:00:00
                        </span>
                    </div>

                    <div className="flex items-center gap-2 pointer-events-auto">
                        <div className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-white text-xs">Excellent Connection</span>
                        </div>
                    </div>
                </div>

                {/* Video Stage */}
                <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                    <GridLayout tracks={tracks}>
                        <ParticipantTile />
                    </GridLayout>
                </div>

                {/* Bottom Controls */}
                <div className="bg-neutral-900 border-t border-neutral-800 p-4 flex flex-wrap items-center justify-center gap-4 z-20">
                    <ShareButton url={watchUrl} title="Copy Stream Link" />

                    <div className="h-8 w-[1px] bg-neutral-700 mx-2 hidden md:block"></div>

                    <ControlBar
                        variation="minimal"
                        controls={{ microphone: true, camera: true, screenShare: true }}
                    />

                    <div className="h-8 w-[1px] bg-neutral-700 mx-2 hidden md:block"></div>

                    <DisconnectButton>
                        <div className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-nowrap">
                            End Stream
                        </div>
                    </DisconnectButton>
                </div>
            </div>

            {/* Right Side Panel (Chat) */}
            <div className="w-full md:w-80 lg:w-96 bg-neutral-900 border-l border-neutral-800 flex flex-col h-1/3 md:h-full z-30">
                <Chat roomId={roomName} />
            </div>
            <RoomAudioRenderer />
        </div>
    );
}
