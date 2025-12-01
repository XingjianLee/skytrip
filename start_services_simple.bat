@echo off
chcp 65001 >nul
echo ========================================
echo SkyTrip 系统启动
echo ========================================
echo.
echo 正在启动后端和前端服务...
echo 将打开两个新窗口
echo.

REM 获取当前目录
set "CURRENT_DIR=%~dp0"

REM 启动后端（新窗口）
start "SkyTrip Backend" powershell.exe -ExecutionPolicy Bypass -NoProfile -Command "cd '%CURRENT_DIR%'; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; & '%CURRENT_DIR%start_backend.ps1'"

REM 等待3秒
timeout /t 3 /nobreak >nul

REM 启动前端（新窗口）
start "SkyTrip Frontend" powershell.exe -ExecutionPolicy Bypass -NoProfile -Command "cd '%CURRENT_DIR%'; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; & '%CURRENT_DIR%start_frontend.ps1'"

echo.
echo ========================================
echo 服务启动完成！
echo ========================================
echo.
echo 后端 API: http://localhost:8000/docs
echo 前端界面: http://localhost:5173
echo.
echo 两个服务窗口已打开
echo 关闭窗口即可停止服务
echo.
echo 等待服务启动（约10秒）...
timeout /t 10 /nobreak >nul

echo.
echo 正在检查服务状态...
python check_services.py

pause

