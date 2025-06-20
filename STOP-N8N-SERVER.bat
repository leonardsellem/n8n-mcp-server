@echo off
title Stop n8n MCP Server
powershell -ExecutionPolicy Bypass -File "%~dp0stop-n8n-server.ps1"