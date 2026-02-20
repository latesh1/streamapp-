'use client';

import {
    useTracks,
    VideoTrack,
    useConnectionState,
    ControlBar,
    RoomAudioRenderer,
} from '@livekit/components-react';
import { ConnectionState, Track } from 'livekit-client';
import { useMemo } from 'react';
import Chat from './Chat';
import ShareButton from './ShareButton';

export default function StreamViewer({ roomName }: { roomName: string }) {
    const connectionState = useConnectionState();

    // Subscribe to camera and microphone tracks
    const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]);

    // Find the broadcaster's video track (usually the first camera track in the room)
    const videoTrack = useMemo(() => {
        return tracks.find(t => t.source === Track.Source.Camera && t.publication.kind === 'video');
    }, [tracks]);

    // Construct the watch URL for sharing
    const watchUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/watch/${roomName}`
        : `/watch/${roomName}`;

    if (connectionState === ConnectionState.Connecting) {
        return (
            <div className="h-full w-full bg-neutral-900 flex items-center justify-center text-white flex-col gap-2">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <p>Joining Stream...</p>
            </div>
        );
    }

    if (connectionState === ConnectionState.Disconnected || connectionState === ConnectionState.Reconnecting) {
        return (
            <div className="h-full w-full bg-neutral-900 flex items-center justify-center text-white flex-col gap-2">
                <p className="text-red-500">Stream Offline or Connection Failed.</p>
                <p className="text-sm opacity-50">Trying to reconnect...</p>
            </div>
        )
    }

    return (
        <div className="relative h-full w-full bg-neutral-950 flex flex-col md:flex-row overflow-hidden">
            {/* Main Content Area (Video) */}
            <div className="flex-1 relative flex flex-col h-full">
                {/* Top Bar */}
                <div className="absolute top-0 left-0 w-full z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
                    <div className="flex items-center gap-2 pointer-events-auto">
                        <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                            LIVE
                        </span>
                        <span className="text-white text-sm font-bold shadow-black drop-shadow-md">
                            {roomName}
                        </span>
                    </div>
                </div>

                {/* Video Stage */}
                <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                    {videoTrack ? (
                        <VideoTrack
                            trackRef={videoTrack}
                            className="h-full w-full object-contain"
                        />
                    ) : (
                        <div className="text-white opacity-50 flex flex-col items-center gap-2">
                            <div className="animate-pulse flex flex-col items-center">
                                <span className="text-4xl mb-2">📡</span>
                                <span>Waiting for broadcaster...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Controls */}
                <div className="bg-neutral-900 border-t border-neutral-800 p-4 flex flex-wrap items-center justify-center gap-4 z-20">
                    <ShareButton url={watchUrl} title="Share Stream" />

                    {/* Volume/Audio controls could go here */}
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
