#!/usr/bin/env python3
"""
修复 bcrypt 版本兼容性问题
"""
import subprocess
import sys

def fix_bcrypt():
    print("=" * 50)
    print("修复 bcrypt 版本兼容性问题")
    print("=" * 50)
    print()
    print("当前问题：bcrypt 5.0.0 与 passlib 1.7.4 不兼容")
    print("解决方案：降级 bcrypt 到 4.1.2")
    print()
    
    print("请先停止后端服务（如果正在运行），然后按回车继续...")
    input()
    
    print("正在安装 bcrypt 4.1.2...")
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "bcrypt==4.1.2", "--force-reinstall"
        ])
        print("[OK] bcrypt 已降级到 4.1.2")
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] 安装失败: {e}")
        print()
        print("如果遇到权限错误，请：")
        print("1. 关闭所有正在运行的后端服务窗口")
        print("2. 以管理员身份运行 PowerShell")
        print("3. 执行: pip install bcrypt==4.1.2 --force-reinstall")
        return False
    
    print()
    print("测试安全模块...")
    try:
        from app.core.security import verify_password, get_password_hash
        print("[OK] 安全模块加载成功")
        
        # 测试密码哈希
        test_hash = get_password_hash("test123")
        result = verify_password("test123", test_hash)
        if result:
            print("[OK] 密码验证功能正常")
        else:
            print("[WARNING] 密码验证测试失败")
    except Exception as e:
        print(f"[ERROR] 测试失败: {e}")
        return False
    
    print()
    print("=" * 50)
    print("修复完成！")
    print("=" * 50)
    print()
    print("现在可以重新启动后端服务了。")
    return True

if __name__ == "__main__":
    fix_bcrypt()

