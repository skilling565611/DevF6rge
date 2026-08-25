@echo off
setlocal

cd /d "%~dp0\..\.."
set "VERSION=2.1.2"
set "VSIX=%CD%\devforge-language-%VERSION%.vsix"

where npx >nul 2>nul
if errorlevel 1 (
    echo Node.js/npm is required. Install it, then run this file again.
    exit /b 1
)

where code >nul 2>nul
if errorlevel 1 (
    echo The VS Code code command was not found in PATH.
    exit /b 1
)

echo Building DevForge %VERSION%...
call npx --yes @vscode/vsce package --out "%VSIX%"
if errorlevel 1 exit /b 1

echo Installing %VSIX%...
call code --install-extension "%VSIX%" --force
if errorlevel 1 exit /b 1

echo DevForge %VERSION% is installed.
echo In VS Code, run: Developer: Reload Window
endlocal
