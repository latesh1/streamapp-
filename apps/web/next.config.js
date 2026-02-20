/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    trailingSlash: true,
    skipMiddlewareUrlNormalize: true,
    async rewrites() {
        return [
            {
                source: '/api/proxy/stream/:path*',
                destination: 'http://localhost:5000/api/stream/:path*',
            },
            {
                source: '/socket.io/:path*',
                destination: 'http://localhost:6001/socket.io/:path*',
            },
            {
                source: '/api/socket',
                destination: 'http://localhost:6001/socket.io/',
            },
            {
                source: '/api/socket/:path*',
                destination: 'http://localhost:6001/socket.io/:path*',
            },
            {
                source: '/api/chat-health',
                destination: 'http://localhost:6001/',
            },
            {
                source: '/livekit/:path*',
                destination: 'http://localhost:7880/:path*',
            },
        ];
    },
};

module.exports = nextConfig;
