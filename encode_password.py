#!/usr/bin/env python3
"""
密码编码工具
用于将包含特殊字符的数据库密码编码为 URL 安全格式
"""
from urllib.parse import quote_plus
import sys

def encode_password(password: str) -> str:
    """对密码进行 URL 编码"""
    return quote_plus(password)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        password = sys.argv[1]
    else:
        password = input("请输入数据库密码: ")
    
    encoded = encode_password(password)
    
    print("\n" + "=" * 50)
    print("密码编码结果")
    print("=" * 50)
    print(f"原始密码: {password}")
    print(f"编码后:   {encoded}")
    print("\n在 .env 文件中使用编码后的密码：")
    print(f"DATABASE_URL=mysql+pymysql://root:{encoded}@localhost:3306/skytrip")
    print("\n特殊字符编码对照：")
    print("  @ -> %40")
    print("  # -> %23")
    print("  % -> %25")
    print("  & -> %26")
    print("  + -> %2B")
    print("  / -> %2F")
    print("  ? -> %3F")
    print("  = -> %3D")

