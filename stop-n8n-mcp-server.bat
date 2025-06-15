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
title n8n MCP Server Stopper

:: Clear screen and show header
cls
echo.
echo %RED%========================================%RESET%
echo %RED%       n8n MCP Server Stopper         %RESET%
echo %RED%========================================%RESET%
echo.

echo %BLUE%[INFO]%RESET% Searching for running n8n MCP Server processes...
echo.

:: Initialize counter
set "processes_found=0"
set "processes_killed=0"

:: Look for node processes running the MCP server
echo %BLUE%[INFO]%RESET% Checking for Node.js processes...

:: Method 1: Look for processes with "build/index.js" in command line
for /f "tokens=2 delims=," %%a in ('tasklist /fo csv /v ^| findstr /i "node.exe" ^| findstr /i "build\\index.js"') do (
    set /a processes_found+=1
    set "pid=%%a"
    set "pid=!pid:"=!"
    echo %YELLOW%[FOUND]%RESET% n8n MCP Server process found with PID: !pid!
    
    :: Try to kill the process
    taskkill /PID !pid! /F >nul 2>&1
    if !errorlevel! equ 0 (
        echo %GREEN%[SUCCESS]%RESET% Process with PID !pid! terminated successfully
        set /a processes_killed+=1
    ) else (
        echo %RED%[ERROR]%RESET% Failed to terminate process with PID !pid!
    )
)

:: Method 2: Look for processes with "n8n-mcp-server" in command line
for /f "tokens=2 delims=," %%a in ('tasklist /fo csv /v ^| findstr /i "node.exe" ^| findstr /i "n8n-mcp-server"') do (
    set /a processes_found+=1
    set "pid=%%a"
    set "pid=!pid:"=!"
    echo %YELLOW%[FOUND]%RESET% n8n MCP Server process found with PID: !pid!
    
    :: Try to kill the process
    taskkill /PID !pid! /F >nul 2>&1
    if !errorlevel! equ 0 (
        echo %GREEN%[SUCCESS]%RESET% Process with PID !pid! terminated successfully
        set /a processes_killed+=1
    ) else (
        echo %RED%[ERROR]%RESET% Failed to terminate process with PID !pid!
    )
)

:: Method 3: Look for any node process in the current directory
set "SCRIPT_DIR=%~dp0"
for /f "tokens=1,2 delims=," %%a in ('tasklist /fo csv /v ^| findstr /i "node.exe"') do (
    set "process_name=%%a"
    set "pid=%%b"
    set "process_name=!process_name:"=!"
    set "pid=!pid:"=!"
    
    :: Get the command line for this process
    for /f "tokens=*" %%c in ('wmic process where "ProcessId=!pid!" get CommandLine /format:value 2^>nul ^| findstr "CommandLine="') do (
        set "cmdline=%%c"
        set "cmdline=!cmdline:CommandLine=!"
        set "cmdline=!cmdline:~1!"
        
        :: Check if the command line contains our script directory
        echo !cmdline! | findstr /i "!SCRIPT_DIR!" >nul 2>&1
        if !errorlevel! equ 0 (
            set /a processes_found+=1
            echo %YELLOW%[FOUND]%RESET% Related Node.js process found with PID: !pid!
            echo %BLUE%[INFO]%RESET% Command: !cmdline!
            
            :: Ask for confirmation before killing
            set /p "confirm=Kill this process? (y/N): "
            if /i "!confirm!"=="y" (
                taskkill /PID !pid! /F >nul 2>&1
                if !errorlevel! equ 0 (
                    echo %GREEN%[SUCCESS]%RESET% Process with PID !pid! terminated successfully
                    set /a processes_killed+=1
                ) else (
                    echo %RED%[ERROR]%RESET% Failed to terminate process with PID !pid!
                )
            ) else (
                echo %BLUE%[INFO]%RESET% Process with PID !pid! left running
            )
        )
    )
)

echo.

:: Additional cleanup - kill any orphaned processes
echo %BLUE%[INFO]%RESET% Checking for orphaned MCP server processes...

:: Look for any processes listening on common MCP ports
netstat -ano | findstr ":8080" >nul 2>&1
if !errorlevel! equ 0 (
    echo %YELLOW%[WARNING]%RESET% Found processes listening on port 8080
    echo %BLUE%[INFO]%RESET% These might be related to the MCP server
    netstat -ano | findstr ":8080"
)

echo.

:: Summary
echo %BLUE%========================================%RESET%
echo %BLUE%               Summary                  %RESET%
echo %BLUE%========================================%RESET%
echo.

if !processes_found! equ 0 (
    echo %GREEN%[INFO]%RESET% No n8n MCP Server processes found running
) else (
    echo %BLUE%[INFO]%RESET% Found !processes_found! process(es)
    echo %GREEN%[SUCCESS]%RESET% Successfully terminated !processes_killed! process(es)
    
    set /a processes_remaining=!processes_found!-!processes_killed!
    if !processes_remaining! gtr 0 (
        echo %YELLOW%[WARNING]%RESET% !processes_remaining! process(es) could not be terminated
        echo %BLUE%[INFO]%RESET% You may need to terminate them manually or restart your system
    )
)

echo.

:: Additional cleanup instructions
if !processes_killed! gtr 0 (
    echo %GREEN%[SUCCESS]%RESET% n8n MCP Server has been stopped
    echo %BLUE%[INFO]%RESET% You can now safely start a new instance
) else (
    echo %BLUE%[INFO]%RESET% No processes were terminated
)

echo.

:: Option to show all Node.js processes for manual cleanup
echo %BLUE%[INFO]%RESET% Would you like to see all running Node.js processes?
set /p "show_all=Show all Node.js processes? (y/N): "
if /i "!show_all!"=="y" (
    echo.
    echo %BLUE%[INFO]%RESET% All Node.js processes:
    echo.
    tasklist /fi "imagename eq node.exe" /fo table
    echo.
)

:: Keep window open
echo Press any key to close this window...
pause >nul