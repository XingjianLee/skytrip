# SkyTrip 管理员端后端启动脚本
# PowerShell 脚本

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SkyTrip 管理员端后端启动" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Python 环境
Write-Host "[1/4] 检查 Python 环境..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "  $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "  [错误] 未找到 Python，请先安装 Python 3.8+" -ForegroundColor Red
    exit 1
}

# 检查 .env 文件
Write-Host "[2/4] 检查环境配置..." -ForegroundColor Yellow
if (Test-Path .env) {
    Write-Host "  [OK] .env 文件存在" -ForegroundColor Green
    python verify_env.py
} else {
    Write-Host "  [警告] .env 文件不存在，正在创建..." -ForegroundColor Yellow
    python setup_env.py
    if (-not (Test-Path .env)) {
        Write-Host "  [错误] 无法创建 .env 文件" -ForegroundColor Red
        exit 1
    }
}

# 检查依赖
Write-Host "[3/4] 检查 Python 依赖..." -ForegroundColor Yellow
if (-not (Test-Path "venv")) {
    Write-Host "  创建虚拟环境..." -ForegroundColor Yellow
    python -m venv venv
}

Write-Host "  激活虚拟环境并安装依赖..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1
pip install -q -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "  [错误] 依赖安装失败" -ForegroundColor Red
    exit 1
}
Write-Host "  [OK] 依赖已安装" -ForegroundColor Green

# 启动服务
Write-Host "[4/4] 启动后端服务..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "后端服务启动中..." -ForegroundColor Cyan
Write-Host "API 文档: http://localhost:8000/docs" -ForegroundColor Green
Write-Host "API 地址: http://localhost:8000/api/v1" -ForegroundColor Green
Write-Host "按 Ctrl+C 停止服务" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

uvicorn main:app --reload --host 0.0.0.0 --port 8000
