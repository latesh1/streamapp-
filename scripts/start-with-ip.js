const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal (i.e. 127.0.0.1) and non-IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const ip = getLocalIp();
console.log(`Detected Local IP: ${ip}`);

// Paths to env files
const webEnvPath = path.join(__dirname, '..', 'apps', 'web', '.env.local');

// Update apps/web/.env.local
let webEnvContent = '';
if (fs.existsSync(webEnvPath)) {
    webEnvContent = fs.readFileSync(webEnvPath, 'utf8');
}

const newLiveKitUrl = `NEXT_PUBLIC_LIVEKIT_URL=ws://${ip}:7880`;
const liveKitRegex = /^NEXT_PUBLIC_LIVEKIT_URL=.*$/m;

if (liveKitRegex.test(webEnvContent)) {
    // Only update if it's not already a cloud URL
    if (!webEnvContent.match(/NEXT_PUBLIC_LIVEKIT_URL=wss:\/\/.*\.livekit\.cloud/)) {
        webEnvContent = webEnvContent.replace(liveKitRegex, newLiveKitUrl);
        console.log(`Updated ${webEnvPath} with ${newLiveKitUrl}`);
    } else {
        console.log(`LiveKit Cloud URL detected. Skipping local IP update for NEXT_PUBLIC_LIVEKIT_URL.`);
    }
} else {
    webEnvContent += `\n${newLiveKitUrl}`;
    console.log(`Added ${newLiveKitUrl} to ${webEnvPath}`);
}

const newChatUrl = `NEXT_PUBLIC_CHAT_URL=`;
const chatUrlRegex = /^NEXT_PUBLIC_CHAT_URL=.*$/m;

if (chatUrlRegex.test(webEnvContent)) {
    webEnvContent = webEnvContent.replace(chatUrlRegex, newChatUrl);
} else {
    webEnvContent += `\n${newChatUrl}`;
}

// Add other necessary env vars for services if they need to know the public URL
// For now, valid for local dev where services are on the same machine
// But we might need to update backend CORS or similar if it's strict

fs.writeFileSync(webEnvPath, webEnvContent);
console.log(`Updated ${webEnvPath} with ${newLiveKitUrl}`);

console.log('Starting development server...');
const child = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    env: {
        ...process.env,
        // Add any global env overrides here if needed
        // HOST: '0.0.0.0' // This is handled by next dev -H 0.0.0.0
    }
});

child.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
});
