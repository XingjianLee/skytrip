@echo off
chcp 65001 >nul
echo ========================================
echo SkyTrip 管理员端后端启动
echo ========================================
echo.

REM 检查 PowerShell 是否可用
where powershell >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到 PowerShell
    pause
    exit /b 1
)

REM 使用 PowerShell 执行脚本，指定 UTF-8 编码
powershell.exe -ExecutionPolicy Bypass -NoProfile -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $PSDefaultParameterValues['*:Encoding'] = 'utf8'; & '%~dp0start_backend.ps1'"

pause

