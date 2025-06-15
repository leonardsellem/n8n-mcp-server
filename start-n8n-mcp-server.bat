@echo off
setlocal enabledelayedexpansion

:: Set colors for output
for /F %%a in ('echo prompt $E ^| cmd') do set "ESC=%%a"
set "GREEN=%ESC%[32m"
set "RED=%ESC%[31m"
set "YELLOW=%ESC%[33m"
set "BLUE=%ESC%[34m"
set "RESET=%ESC%[0m"

:: Set window title
title n8n MCP Server Launcher

:: Clear screen and show header
cls
echo.
echo %BLUE%========================================%RESET%
echo %BLUE%       n8n MCP Server Launcher        %RESET%
echo %BLUE%========================================%RESET%
echo.

:: Get the directory where this batch file is located
set "SCRIPT_DIR=%~dp0"
set "SERVER_DIR=%SCRIPT_DIR%"

echo %YELLOW%[INFO]%RESET% Script directory: %SERVER_DIR%
echo.

:: Check if we're in the right directory (look for package.json)
if not exist "%SERVER_DIR%package.json" (
    echo %RED%[ERROR]%RESET% package.json not found in current directory
    echo %RED%[ERROR]%RESET% Make sure this script is in the n8n-mcp-server directory
    echo.
    pause
    exit /b 1
)

:: Verify this is the n8n-mcp-server project
findstr /C:"n8n-mcp-server" "%SERVER_DIR%package.json" >nul 2>&1
if errorlevel 1 (
    echo %RED%[ERROR]%RESET% This doesn't appear to be the n8n-mcp-server project
    echo %RED%[ERROR]%RESET% Please run this script from the correct directory
    echo.
    pause
    exit /b 1
)

echo %GREEN%[SUCCESS]%RESET% Found n8n-mcp-server project
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo %RED%[ERROR]%RESET% Node.js is not installed or not in PATH
    echo %RED%[ERROR]%RESET% Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo %GREEN%[SUCCESS]%RESET% Node.js is available
for /f "tokens=*" %%i in ('node --version') do echo %BLUE%[INFO]%RESET% Node.js version: %%i
echo.

:: Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo %RED%[ERROR]%RESET% npm is not available
    echo %RED%[ERROR]%RESET% Please ensure npm is installed with Node.js
    echo.
    pause
    exit /b 1
)

echo %GREEN%[SUCCESS]%RESET% npm is available
for /f "tokens=*" %%i in ('npm --version') do echo %BLUE%[INFO]%RESET% npm version: %%i
echo.

:: Check if node_modules exists
if not exist "%SERVER_DIR%node_modules" (
    echo %YELLOW%[WARNING]%RESET% node_modules directory not found
    echo %BLUE%[INFO]%RESET% Installing dependencies...
    echo.
    
    call npm install
    if errorlevel 1 (
        echo.
        echo %RED%[ERROR]%RESET% Failed to install dependencies
        echo %RED%[ERROR]%RESET% Please check the error messages above
        echo.
        pause
        exit /b 1
    )
    
    echo.
    echo %GREEN%[SUCCESS]%RESET% Dependencies installed successfully
    echo.
)

:: Check if build directory exists
if not exist "%SERVER_DIR%build" (
    echo %YELLOW%[WARNING]%RESET% Build directory not found
    echo %BLUE%[INFO]%RESET% Building the project...
    echo.
    
    call npm run build
    if errorlevel 1 (
        echo.
        echo %RED%[ERROR]%RESET% Build failed
        echo %RED%[ERROR]%RESET% Please check the error messages above
        echo.
        pause
        exit /b 1
    )
    
    echo.
    echo %GREEN%[SUCCESS]%RESET% Project built successfully
    echo.
) else (
    echo %GREEN%[SUCCESS]%RESET% Build directory found
    echo.
    
    :: Check if build is up to date by comparing timestamps
    for %%f in ("%SERVER_DIR%src\*.ts") do (
        if "%%~tf" gtr "!latest_src!" set "latest_src=%%~tf"
    )
    
    for %%f in ("%SERVER_DIR%build\*.js") do (
        if "%%~tf" gtr "!latest_build!" set "latest_build=%%~tf"
    )
    
    if "!latest_src!" gtr "!latest_build!" (
        echo %YELLOW%[WARNING]%RESET% Source files are newer than build files
        echo %BLUE%[INFO]%RESET% Rebuilding the project...
        echo.
        
        call npm run build
        if errorlevel 1 (
            echo.
            echo %RED%[ERROR]%RESET% Build failed
            echo %RED%[ERROR]%RESET% Please check the error messages above
            echo.
            pause
            exit /b 1
        )
        
        echo.
        echo %GREEN%[SUCCESS]%RESET% Project rebuilt successfully
        echo.
    )
)

:: Check if the main entry point exists
if not exist "%SERVER_DIR%build\index.js" (
    echo %RED%[ERROR]%RESET% Main entry point (build\index.js) not found
    echo %RED%[ERROR]%RESET% Build may have failed or been incomplete
    echo.
    pause
    exit /b 1
)

echo %GREEN%[SUCCESS]%RESET% Main entry point found
echo.

:: Check for environment configuration
if exist "%SERVER_DIR%.env" (
    echo %GREEN%[SUCCESS]%RESET% Environment file (.env) found
) else (
    echo %YELLOW%[WARNING]%RESET% No .env file found
    echo %BLUE%[INFO]%RESET% You may need to configure environment variables
    echo %BLUE%[INFO]%RESET% See the README.md for configuration details
)
echo.

:: Final confirmation before starting
echo %BLUE%========================================%RESET%
echo %BLUE%       Ready to start MCP Server       %RESET%
echo %BLUE%========================================%RESET%
echo.
echo %BLUE%[INFO]%RESET% Starting n8n MCP Server...
echo %BLUE%[INFO]%RESET% Press Ctrl+C to stop the server
echo %BLUE%[INFO]%RESET% Keep this window open to see server logs
echo.

:: Start the server
echo %GREEN%[STARTING]%RESET% node build/index.js
echo.

node build/index.js

:: If we get here, the server has stopped
echo.
echo %YELLOW%[INFO]%RESET% Server has stopped
echo.

:: Keep window open
echo Press any key to close this window...
pause >nul