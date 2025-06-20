# Stop n8n MCP Server
Write-Host "Stopping n8n MCP Server..." -ForegroundColor Red
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "n8n MCP Server stopped." -ForegroundColor Yellow
Read-Host "Press Enter to exit"