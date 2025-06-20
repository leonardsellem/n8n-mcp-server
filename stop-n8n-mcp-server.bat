@echo off
title Stop n8n MCP Server
echo Stopping n8n MCP Server...
cd "C:\Users\Chris Boyd\Documents\MCP-Servers\n8n-mcp-server"
taskkill /f /im node.exe 
echo n8n MCP Server stopped.
pause
