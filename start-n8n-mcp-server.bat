@echo off
title n8n MCP Server
echo Starting n8n MCP Server...
cd "C:\Users\Chris Boyd\Documents\MCP-Servers\n8n-mcp-server"
npm run build && npm start
pause
