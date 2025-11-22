"""
出行服务相关工具
供 TravelServiceAgent 使用
这些工具连接外部服务，不直接操作数据库
"""
from langchain_core.tools import tool
from typing import Dict, List, Any, Optional
import requests
from datetime import datetime


@tool
def get_weather_tool(city: str, date: Optional[str] = None) -> Dict:
    """
    查询指定城市、指定日期的天气信息。
    注意：这是一个示例工具，实际使用时需要接入真实的天气API（如和风天气、OpenWeatherMap等）。

    Args:
        city: 城市名称（如 "北京"、"上海"）
        date: 日期（格式：YYYY-MM-DD），如果不提供则查询今天

    Returns:
        天气信息字典
    """
    try:
        # 这里是一个示例实现，实际应该调用真实的天气API
        # 例如：和风天气、OpenWeatherMap、心知天气等
        
        if not date:
            date = datetime.now().strftime('%Y-%m-%d')
        
        # 模拟返回（实际应该调用API）
        return {
            "city": city,
            "date": date,
            "weather": "晴",
            "temperature": "15-25°C",
            "humidity": "60%",
            "wind": "微风",
            "note": "这是模拟数据，实际使用时需要接入真实的天气API"
        }
    except Exception as e:
        return {"error": f"查询天气时发生错误: {str(e)}"}


@tool
def search_travel_info_tool(query: str, city: Optional[str] = None) -> Dict:
    """
    搜索旅游相关信息（景点、美食、攻略等）。
    注意：这是一个示例工具，实际使用时需要接入真实的搜索API（如DuckDuckGo、Tavily、Google等）。

    Args:
        query: 搜索关键词（如 "景点"、"美食"、"火锅"）
        city: 城市名称（可选，用于限定搜索范围）

    Returns:
        搜索结果字典
    """
    try:
        # 这里是一个示例实现，实际应该调用真实的搜索API
        # 例如：DuckDuckGo、Tavily、Google Custom Search等
        
        search_query = f"{city} {query}" if city else query
        
        # 模拟返回（实际应该调用API）
        return {
            "query": search_query,
            "results": [
                {
                    "title": f"{city or ''}相关{query}推荐",
                    "description": f"为您找到{query}相关信息",
                    "url": "https://example.com"
                }
            ],
            "note": "这是模拟数据，实际使用时需要接入真实的搜索API"
        }
    except Exception as e:
        return {"error": f"搜索信息时发生错误: {str(e)}"}


@tool
def get_airport_info_tool(airport_code: Optional[str] = None, city: Optional[str] = None) -> Dict:
    """
    获取机场相关信息（航站楼、交通、设施等）。
    这个工具可以查询数据库中的机场信息，也可以连接外部API获取实时信息。

    Args:
        airport_code: 机场三字码（如 "PEK"、"PVG"）
        city: 城市名称（如果提供，会查询该城市的所有机场）

    Returns:
        机场信息字典
    """
    try:
        from database import db_manager
        
        if city:
            airports = db_manager.get_airport_codes_by_city(city)
            return {
                "city": city,
                "airports": airports,
                "info": "机场信息查询成功"
            }
        elif airport_code:
            # 查询特定机场的详细信息
            connection = db_manager.get_connection()
            cursor = connection.cursor(dictionary=True)
            query = "SELECT * FROM airports WHERE airport_code = %s"
            cursor.execute(query, (airport_code,))
            airport = cursor.fetchone()
            cursor.close()
            connection.close()
            
            if airport:
                return {
                    "airport_code": airport_code,
                    "airport_name": airport.get("airport_name"),
                    "city": airport.get("city"),
                    "info": "机场信息查询成功"
                }
            else:
                return {"error": "机场不存在"}
        else:
            return {"error": "请提供机场代码或城市名称"}
    except Exception as e:
        return {"error": f"查询机场信息时发生错误: {str(e)}"}

