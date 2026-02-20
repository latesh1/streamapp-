$ErrorActionPreference = "Stop"

function Test-Endpoint {
    param (
        [string]$Method,
        [string]$Url,
        [hashtable]$Body = @{},
        [hashtable]$Headers = @{}
    )
    Write-Host "Testing $Method $Url" -Foreground Cyan
    try {
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $Url -Method Get -Headers $Headers
        } else {
            $jsonBody = $Body | ConvertTo-Json
            $response = Invoke-RestMethod -Uri $Url -Method Post -Body $jsonBody -ContentType "application/json" -Headers $Headers
        }
        Write-Host "SUCCESS" -Foreground Green
        return $response
    } catch {
        Write-Host "FAILED: $_" -Foreground Red
        return $null
    }
}

# 1. Auth Service
Write-Host "`n--- AUTH SERVICE (Port 4000) ---" -Foreground Yellow
Test-Endpoint -Method "GET" -Url "http://localhost:4000/health"

$rand = Get-Random
$email = "testuser$rand@example.com"
$password = "password123"

# Register
$registerResp = Test-Endpoint -Method "POST" -Url "http://localhost:4000/api/auth/register" -Body @{
    username = "testuser$rand"
    email = $email
    password = $password
    role = "creator"
}

# Login
$loginResp = Test-Endpoint -Method "POST" -Url "http://localhost:4000/api/auth/login" -Body @{
    email = $email
    password = $password
}

if ($loginResp) {
    $token = $loginResp.token
    Write-Host "Token received: $($token.Substring(0, 20))..." -Foreground Gray
} else {
    Write-Error "Login failed, cannot proceed with protected routes."
}

# 2. Stream Service
Write-Host "`n--- STREAM SERVICE (Port 5000) ---" -Foreground Yellow
Test-Endpoint -Method "POST" -Url "http://localhost:5000/api/stream/token" -Body @{
    roomName = "test-room"
    participantName = "tester"
    identity = "tester-id"
    isPublisher = $true
}

# Egress (Expect 200 OK with 'skipped' message in dev)
Test-Endpoint -Method "POST" -Url "http://localhost:5000/api/stream/egress" -Body @{
    roomName = "test-room"
}

Test-Endpoint -Method "GET" -Url "http://localhost:5000/api/stream/playback/test-room"

# 3. Chat Service
Write-Host "`n--- CHAT SERVICE (Port 6000) ---" -Foreground Yellow
# Chat root returns string, Invoke-RestMethod handles it
try {
    $chatResp = Invoke-WebRequest -Uri "http://localhost:6000/" -Method Get
    Write-Host "Testing GET http://localhost:6000/" -Foreground Cyan
    if ($chatResp.StatusCode -eq 200) { Write-Host "SUCCESS" -Foreground Green }
} catch {
    Write-Host "FAILED: $_" -Foreground Red
}

# 4. Analytics Service
Write-Host "`n--- ANALYTICS SERVICE (Port 7000) ---" -Foreground Yellow
Test-Endpoint -Method "POST" -Url "http://localhost:7000/api/analytics/track" -Body @{
    streamId = "test-room"
    eventType = "view"
    meta = @{ browser = "curl" }
}

Test-Endpoint -Method "GET" -Url "http://localhost:7000/api/analytics/stream/test-room"
