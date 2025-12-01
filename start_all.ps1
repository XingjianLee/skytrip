# SkyTrip 管理员端完整启动脚本
# 同时启动后端和前端服务

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SkyTrip 管理员端系统启动" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查必要环境
Write-Host "检查运行环境..." -ForegroundColor Yellow

# 检查 Python
try {
    python --version | Out-Null
    Write-Host "  [OK] Python 已安装" -ForegroundColor Green
} catch {
    Write-Host "  [错误] 未找到 Python" -ForegroundColor Red
    exit 1
}

# 检查 Node.js
try {
    node --version | Out-Null
    Write-Host "  [OK] Node.js 已安装" -ForegroundColor Green
} catch {
    Write-Host "  [错误] 未找到 Node.js" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "启动选项：" -ForegroundColor Cyan
Write-Host "  1. 仅启动后端服务" -ForegroundColor White
Write-Host "  2. 仅启动前端服务" -ForegroundColor White
Write-Host "  3. 同时启动后端和前端（推荐）" -ForegroundColor White
Write-Host "  4. 退出" -ForegroundColor White
Write-Host ""

$choice = Read-Host "请选择 (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "启动后端服务..." -ForegroundColor Yellow
        & .\start_backend.ps1
    }
    "2" {
        Write-Host ""
        Write-Host "启动前端服务..." -ForegroundColor Yellow
        & .\start_frontend.ps1
    }
    "3" {
        Write-Host ""
        Write-Host "同时启动后端和前端服务..." -ForegroundColor Yellow
        Write-Host "注意：将打开两个 PowerShell 窗口" -ForegroundColor Yellow
        Write-Host ""
        
        # 启动后端（新窗口）
        $backendScript = Join-Path $PWD "start_backend.ps1"
        Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-NoProfile", "-Command", "cd '$PWD'; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; & '$backendScript'"
        Start-Sleep -Seconds 3
        
        # 启动前端（新窗口）
        $frontendScript = Join-Path $PWD "start_frontend.ps1"
        Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-NoProfile", "-Command", "cd '$PWD'; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; & '$frontendScript'"
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "服务已启动！" -ForegroundColor Green
        Write-Host "后端 API: http://localhost:8000/docs" -ForegroundColor Green
        Write-Host "前端界面: http://localhost:5173" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "提示：两个服务窗口已打开，关闭窗口即可停止服务" -ForegroundColor Yellow
    }
    "4" {
        Write-Host "退出" -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "无效选择" -ForegroundColor Red
        exit 1
    }
}
