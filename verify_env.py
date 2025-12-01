#!/usr/bin/env python3
"""验证 .env 文件配置"""
from pathlib import Path

def verify_env():
    env_path = Path('.env')
    
    if not env_path.exists():
        print("❌ .env 文件不存在")
        return False
    
    content = env_path.read_text(encoding='utf-8')
    
    checks = {
        'DATABASE_URL': 'DATABASE_URL' in content and 'localhost' in content,
        'SECRET_KEY': 'SECRET_KEY' in content and 'change-me' not in content,
        '密码已编码': '%40' in content or '@' not in content.split('DATABASE_URL=')[1].split('@')[0] if 'DATABASE_URL=' in content else False
    }
    
    print("=" * 50)
    print("Environment Configuration Verification")
    print("=" * 50)
    print(f"[OK] .env file exists: {env_path.absolute()}")
    print(f"[INFO] File size: {env_path.stat().st_size} bytes")
    print()
    
    all_ok = True
    for key, value in checks.items():
        status = "[OK]" if value else "[FAIL]"
        print(f"{status} {key}: {'Configured' if value else 'Not configured or has issues'}")
        if not value:
            all_ok = False
    
    if all_ok:
        print()
        print("[SUCCESS] All configurations verified! You can start the backend service now.")
        print()
        print("Start command:")
        print("  uvicorn main:app --reload")
    else:
        print()
        print("[WARNING] Some configurations need attention, please check above.")
    
    return all_ok

if __name__ == "__main__":
    verify_env()

