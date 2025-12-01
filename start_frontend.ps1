# SkyTrip 管理员端前端启动脚本
# PowerShell 脚本

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SkyTrip 管理员端前端启动" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js 环境
Write-Host "[1/3] 检查 Node.js 环境..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "  $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  [错误] 未找到 Node.js，请先安装 Node.js 18+" -ForegroundColor Red
    Write-Host "  下载地址: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# 检查 npm
try {
    $npmVersion = npm --version 2>&1
    Write-Host "  npm $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  [错误] 未找到 npm" -ForegroundColor Red
    exit 1
}

# 进入前端目录
Set-Location admin-frontend

# 检查依赖
Write-Host "[2/3] 检查前端依赖..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "  安装依赖（这可能需要几分钟）..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  [错误] 依赖安装失败" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
    Write-Host "  [OK] 依赖已安装" -ForegroundColor Green
} else {
    Write-Host "  [OK] 依赖已存在" -ForegroundColor Green
}

# 检查前端环境变量
if (-not (Test-Path ".env")) {
    Write-Host "  创建前端 .env 文件..." -ForegroundColor Yellow
    @"
# 后端 API 地址
VITE_API_BASE=http://localhost:8000
"@ | Out-File -FilePath .env -Encoding utf8
    Write-Host "  [OK] .env 文件已创建" -ForegroundColor Green
}

# 启动开发服务器
Write-Host "[3/3] 启动前端开发服务器..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "前端服务启动中..." -ForegroundColor Cyan
Write-Host "前端地址: http://localhost:5173" -ForegroundColor Green
Write-Host "按 Ctrl+C 停止服务" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

npm run dev
