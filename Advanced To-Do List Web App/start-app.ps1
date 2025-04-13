# Get the script's directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Change to the script's directory
Set-Location $scriptPath

# Kill any existing Node.js processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Check if MongoDB is running
$mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
if (-not $mongoProcess) {
    Write-Host "Starting MongoDB..."
    Start-Process "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
    Start-Sleep -Seconds 5
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..."
    npm install
}

# Install frontend dependencies
Write-Host "Installing frontend dependencies..."
Set-Location -Path "client"
npm install --legacy-peer-deps
Set-Location -Path ".."

# Start both servers
Write-Host "Starting Task Mate application..."

# Start the backend server
$backendCommand = "Set-Location '$scriptPath'; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand

# Wait a moment for the backend to start
Start-Sleep -Seconds 5

# Start the frontend server
$frontendCommand = "Set-Location '$scriptPath\client'; npm start"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCommand 