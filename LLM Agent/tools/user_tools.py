"""
用户管理相关工具
供 UserProfileAgent 使用
"""
from langchain_core.tools import tool
from typing import Dict, List, Any, Optional
from database import db_manager


@tool
def get_user_profile_tool(user_id: int) -> Dict:
    """
    获取用户个人信息。

    Args:
        user_id: 用户ID

    Returns:
        用户信息字典
    """
    try:
        user = db_manager.get_user_by_id(user_id)
        return user if user else {"error": "用户不存在"}
    except Exception as e:
        return {"error": f"查询用户信息时发生错误: {str(e)}"}


@tool
def update_user_phone_tool(user_id: int, phone: str) -> Dict:
    """
    更新用户手机号。

    Args:
        user_id: 用户ID
        phone: 新手机号

    Returns:
        操作结果字典
    """
    try:
        connection = db_manager.get_connection()
        cursor = connection.cursor()
        query = "UPDATE users SET phone = %s WHERE user_id = %s"
        cursor.execute(query, (phone, user_id))
        connection.commit()
        cursor.close()
        connection.close()
        return {"success": True, "message": "手机号更新成功"}
    except Exception as e:
        return {"error": f"更新手机号时发生错误: {str(e)}"}


@tool
def update_user_email_tool(user_id: int, email: str) -> Dict:
    """
    更新用户邮箱。

    Args:
        user_id: 用户ID
        email: 新邮箱

    Returns:
        操作结果字典
    """
    try:
        connection = db_manager.get_connection()
        cursor = connection.cursor()
        query = "UPDATE users SET email = %s WHERE user_id = %s"
        cursor.execute(query, (email, user_id))
        connection.commit()
        cursor.close()
        connection.close()
        return {"success": True, "message": "邮箱更新成功"}
    except Exception as e:
        return {"error": f"更新邮箱时发生错误: {str(e)}"}


@tool
def get_user_vip_info_tool(user_id: int) -> Dict:
    """
    获取用户VIP等级信息。

    Args:
        user_id: 用户ID

    Returns:
        VIP信息字典（包含等级、有效期等）
    """
    try:
        user = db_manager.get_user_by_id(user_id)
        if not user:
            return {"error": "用户不存在"}
        
        vip_levels = {0: "普通用户", 1: "银卡会员", 2: "金卡会员", 3: "白金会员"}
        
        return {
            "vip_level": user.get("vip_level", 0),
            "vip_level_name": vip_levels.get(user.get("vip_level", 0), "普通用户"),
            "vip_expire_date": user.get("vip_expire_date"),
            "user_id": user_id
        }
    except Exception as e:
        return {"error": f"查询VIP信息时发生错误: {str(e)}"}

