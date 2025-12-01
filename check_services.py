#!/usr/bin/env python3
"""
检查服务运行状态
"""
import requests
import socket
import sys

def check_port(host, port):
    """检查端口是否开放"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except:
        return False

def check_backend():
    """检查后端服务"""
    print("=" * 50)
    print("检查后端服务状态")
    print("=" * 50)
    
    # 检查端口
    port_open = check_port("localhost", 8000)
    if port_open:
        print("[OK] 端口 8000 已开放")
        
        # 检查 API
        try:
            response = requests.get("http://localhost:8000/docs", timeout=2)
            if response.status_code == 200:
                print("[OK] 后端 API 服务正常运行")
                print("     API 文档: http://localhost:8000/docs")
                return True
            else:
                print(f"[警告] API 返回状态码: {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            print(f"[错误] 无法连接到后端 API: {e}")
            return False
    else:
        print("[错误] 端口 8000 未开放，后端服务未启动")
        print("")
        print("解决方案：")
        print("  1. 运行: .\\start_backend.ps1")
        print("  2. 或运行: .\\start_backend.bat")
        print("  3. 或手动启动: uvicorn main:app --reload --host 0.0.0.0 --port 8000")
        return False

def check_frontend():
    """检查前端服务"""
    print("")
    print("=" * 50)
    print("检查前端服务状态")
    print("=" * 50)
    
    port_open = check_port("localhost", 5173)
    if port_open:
        print("[OK] 端口 5173 已开放")
        print("     前端地址: http://localhost:5173")
        return True
    else:
        print("[错误] 端口 5173 未开放，前端服务未启动")
        print("")
        print("解决方案：")
        print("  1. 运行: .\\start_frontend.ps1")
        print("  2. 或运行: .\\start_frontend.bat")
        print("  3. 或手动启动: cd admin-frontend && npm run dev")
        return False

def check_database():
    """检查数据库连接"""
    print("")
    print("=" * 50)
    print("检查数据库连接")
    print("=" * 50)
    
    try:
        from app.database import engine
        from sqlalchemy import text
        
        with engine.connect() as conn:
            result = conn.execute(text("SELECT COUNT(*) FROM users")).scalar()
            print(f"[OK] 数据库连接正常")
            print(f"     用户表中有 {result} 条记录")
            return True
    except Exception as e:
        print(f"[错误] 数据库连接失败: {e}")
        print("")
        print("解决方案：")
        print("  1. 检查 MySQL 服务是否运行")
        print("  2. 检查 .env 文件中的 DATABASE_URL 配置")
        print("  3. 运行: python verify_env.py")
        return False

def main():
    print("")
    print("=" * 50)
    print("SkyTrip 系统服务状态检查")
    print("=" * 50)
    print("")
    
    db_ok = check_database()
    backend_ok = check_backend()
    frontend_ok = check_frontend()
    
    print("")
    print("=" * 50)
    print("检查结果汇总")
    print("=" * 50)
    print(f"数据库连接: {'[OK] 正常' if db_ok else '[ERROR] 异常'}")
    print(f"后端服务:   {'[OK] 运行中' if backend_ok else '[ERROR] 未运行'}")
    print(f"前端服务:   {'[OK] 运行中' if frontend_ok else '[ERROR] 未运行'}")
    print("")
    
    if not backend_ok:
        print("[WARNING] 后端服务未运行，这是导致网站无法显示数据的主要原因！")
        print("   请先启动后端服务。")
    elif not frontend_ok:
        print("[WARNING] 前端服务未运行，请启动前端服务以访问管理界面。")
    elif db_ok and backend_ok and frontend_ok:
        print("[SUCCESS] 所有服务运行正常！")
        print("  前端地址: http://localhost:5173")
        print("  后端 API: http://localhost:8000/docs")
    
    print("")

if __name__ == "__main__":
    main()

