#!/usr/bin/env python3
"""
创建管理员账号工具
用于快速创建管理员账号
"""
from passlib.context import CryptContext
from getpass import getpass

def create_admin_account():
    """交互式创建管理员账号"""
    print("=" * 50)
    print("SkyTrip 管理员账号创建工具")
    print("=" * 50)
    print()
    
    # 获取用户输入
    username = input("请输入管理员用户名 [admin]: ").strip() or "admin"
    email = input("请输入管理员邮箱 [admin@skytrip.com]: ").strip() or "admin@skytrip.com"
    real_name = input("请输入真实姓名 [管理员]: ").strip() or "管理员"
    id_card = input("请输入身份证号 [110101199001011234]: ").strip() or "110101199001011234"
    
    # 获取密码
    password = getpass("请输入密码: ")
    if not password:
        print("[错误] 密码不能为空")
        return
    
    password_confirm = getpass("请再次输入密码确认: ")
    if password != password_confirm:
        print("[错误] 两次输入的密码不一致")
        return
    
    # 加密密码
    print("\n正在加密密码...")
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hashed_password = pwd_context.hash(password)
    
    # 生成 SQL 语句
    sql = f"""
-- 插入管理员账号
INSERT INTO users (username, email, password, real_name, id_card, role) 
VALUES ('{username}', '{email}', '{hashed_password}', '{real_name}', '{id_card}', 'admin');
"""
    
    print("\n" + "=" * 50)
    print("管理员账号信息")
    print("=" * 50)
    print(f"用户名: {username}")
    print(f"邮箱: {email}")
    print(f"真实姓名: {real_name}")
    print(f"身份证号: {id_card}")
    print(f"角色: admin")
    print()
    print("=" * 50)
    print("SQL 插入语句（已复制到剪贴板）")
    print("=" * 50)
    print(sql)
    print()
    print("请执行以下步骤：")
    print("1. 复制上面的 SQL 语句")
    print("2. 在 MySQL 客户端中执行")
    print("3. 使用创建的用户名和密码登录系统")
    print()
    
    # 尝试复制到剪贴板（Windows）
    try:
        import pyperclip
        pyperclip.copy(sql)
        print("[提示] SQL 语句已复制到剪贴板")
    except ImportError:
        print("[提示] 安装 pyperclip 可以自动复制到剪贴板: pip install pyperclip")
    except Exception:
        pass

if __name__ == "__main__":
    try:
        create_admin_account()
    except KeyboardInterrupt:
        print("\n\n操作已取消")
    except Exception as e:
        print(f"\n[错误] {e}")

