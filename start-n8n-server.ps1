# Start n8n MCP Server
Write-Host "Starting n8n MCP Server..." -ForegroundColor Green
Set-Location "C:\Users\Chris Boyd\Documents\MCP-Servers\n8n-mcp-server"

# Build and start
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful, starting server..." -ForegroundColor Green
    npm start
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
}