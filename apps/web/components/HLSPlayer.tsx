import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface HLSPlayerProps {
    src: string;
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play();
            });

            return () => {
                hls.destroy();
            };
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.addEventListener('loadedmetadata', () => {
                video.play();
            });
        }
    }, [src]);

    return (
        <video
            ref={videoRef}
            controls
            className="w-full h-full rounded-lg"
            style={{ maxHeight: '80vh' }}
        />
    );
};

export default HLSPlayer;
