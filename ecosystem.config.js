module.exports = {
    apps: [
        {
            name: "auth-service",
            script: "./services/auth/dist/index.js",
            env: {
                NODE_ENV: "production",
                PORT: 4000,
                // Add other env vars here or load from .env
            },
            instances: 2,
            exec_mode: "cluster"
        },
        {
            name: "stream-service",
            script: "./services/stream/dist/index.js",
            env: {
                NODE_ENV: "production",
                PORT: 5000,
            },
            instances: 2,
            exec_mode: "cluster"
        },
        {
            name: "chat-service",
            script: "./services/chat/dist/index.js",
            env: {
                NODE_ENV: "production",
                PORT: 6000,
            },
            instances: 3,
            exec_mode: "cluster"
        },
        {
            name: "analytics-service",
            script: "./services/analytics/dist/index.js",
            env: {
                NODE_ENV: "production",
                PORT: 7000,
            },
            instances: 1,
            exec_mode: "cluster"
        },
        {
            name: "web-app",
            script: "npm",
            args: "start --workspace=apps/web",
            env: {
                NODE_ENV: "production",
                PORT: 3000,
            }
        }
    ]
};
