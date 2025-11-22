from typing import Dict, Any, Optional
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_community.chat_models import ChatTongyi
from tools import get_available_cities_tool
from config import QWEN_KEY
from models import TravelPlanRequirement
from datetime import datetime, timedelta
import json
import re


class TravelPlanRequirementAgent:
    """出行规划需求整理Agent - 智能分析用户输入，提取完整的出行规划需求"""
    
    def __init__(self):
        self.llm = ChatTongyi(
            model="qwen-max",
            dashscope_api_key=QWEN_KEY,
            temperature=0.2,  # 降低温度以提高解析准确性和一致性
        )
        
        # 获取可用城市列表
        try:
            cities_result = get_available_cities_tool.invoke({})
            if isinstance(cities_result, list) and len(cities_result) > 0:
                if isinstance(cities_result[0], str) and "错误" in cities_result[0]:
                    raise ValueError("获取城市列表失败")
                self.available_cities = cities_result
            else:
                raise ValueError("城市列表为空")
        except Exception as e:
            print(f"获取城市列表失败，使用默认列表: {str(e)}")
            self.available_cities = ["北京", "上海", "广州", "深圳", "成都", "重庆", "西安", "杭州", "南京", 
                                    "天津", "武汉", "长沙", "昆明", "兰州", "乌鲁木齐"]
        
        self.current_date = datetime.now()
        self.current_date_str = self.current_date.strftime('%Y-%m-%d')
        self.current_weekday = self.current_date.strftime('%A')
        
        self.system_prompt = f"""你是一个专业的出行规划需求分析助手。你的任务是从用户的自然语言输入中，智能提取出完整的、结构化的出行规划需求信息。

**当前日期信息：**
- 当前日期：{self.current_date_str} ({self.current_date.strftime('%Y年%m月%d日')})
- 当前星期：{self._get_chinese_weekday(self.current_date.weekday())}

**可用城市列表：** {', '.join(self.available_cities)}

**你需要提取的信息包括：**

## 1. 航班需求
- **departure_city** (出发城市): 必须是可用城市列表中的城市，如果未提及则为 null
- **arrival_city** (到达城市): 必须是可用城市列表中的城市，如果未提及则为 null
- **departure_date** (出发日期): 格式 YYYY-MM-DD
  - 相对时间转换规则：
    - "今天" → {self.current_date_str}
    - "明天" → {(self.current_date + timedelta(days=1)).strftime('%Y-%m-%d')}
    - "后天" → {(self.current_date + timedelta(days=2)).strftime('%Y-%m-%d')}
    - "大后天" → {(self.current_date + timedelta(days=3)).strftime('%Y-%m-%d')}
    - "下周X" → 计算下周对应星期几的日期
    - "下个月X号" → 计算下个月对应日期
- **departure_time_start** (预期出发时间开始): 格式 HH:MM:SS
  - "上午"/"早上" → 06:00:00
  - "中午" → 11:00:00
  - "下午" → 12:00:00
  - "晚上"/"傍晚" → 18:00:00
  - 具体时间如"下午2点" → 14:00:00
  - 未指定则默认为 00:00:00
- **departure_time_end** (预期出发时间结束): 格式 HH:MM:SS
  - 如果用户说"上午"，则为 12:00:00
  - 如果用户说"下午"，则为 18:00:00
  - 如果用户说"晚上"，则为 23:59:59
  - 具体时间范围如"下午2点到6点" → 18:59:59
  - 未指定则默认为 23:59:59
- **arrival_date** (预期到达日期): 格式 YYYY-MM-DD，如果跨天则填写，否则为 null
- **arrival_time_start** (预期到达时间开始): 格式 HH:MM:SS，如果用户提到到达时间则填写
- **arrival_time_end** (预期到达时间结束): 格式 HH:MM:SS，如果用户提到到达时间范围则填写
- **cabin_class** (舱位类型): 
  - "经济舱"/"经济" → economy
  - "商务舱"/"商务" → business
  - "头等舱"/"头等" → first
  - 未指定则默认为 economy
- **flight_price_min** (航班最低价格): 单位元，如果用户提到价格下限则填写
- **flight_price_max** (航班最高价格): 单位元，如果用户提到价格上限则填写
- **airline_preference** (航空公司偏好): 如 CA、MU、CZ、HU、3U，如果用户提到特定航司则填写

## 2. 出行需求等级
- **travel_style** (出行风格):
  - "经济"/"便宜"/"省钱" → economy
  - "舒适"/"中等"/"标准" → comfortable
  - "豪华"/"高端"/"奢侈" → luxury
  - 未指定则默认为 comfortable

## 3. 酒店需求
- **need_hotel** (是否需要酒店): 
  - 如果用户提到"酒店"、"住宿"、"住"等关键词，则为 true
  - 如果用户明确说"不需要酒店"，则为 false
  - 未提及则默认为 false
- **hotel_check_in_date** (入住日期): 格式 YYYY-MM-DD，如果用户提到酒店则尝试推断
- **hotel_check_out_date** (退房日期): 格式 YYYY-MM-DD，如果用户提到酒店则尝试推断
- **hotel_star_level** (酒店星级): 3、4、5，如果用户提到"X星酒店"则填写
- **hotel_location_preference** (酒店位置偏好): 
  - "市中心"、"商业区" → 市中心
  - "机场附近"、"机场" → 机场附近
  - "景区"、"景点"、"旅游区" → 景区附近
  - 其他具体位置描述
- **hotel_price_min** (酒店最低价格): 单位元/晚
- **hotel_price_max** (酒店最高价格): 单位元/晚
- **hotel_amenities** (酒店设施要求): 数组，如 ["wifi", "parking", "gym", "pool", "breakfast"]

## 4. 其他需求
- **passenger_count** (出行人数): 整数，如果用户提到人数则填写，默认为 1
- **special_requirements** (特殊需求): 数组，如 ["wifi", "wheelchair", "pet_friendly", "child_friendly"]
- **budget_total** (总预算): 单位元，如果用户提到总预算则填写
- **notes** (备注): 其他重要信息

**重要规则：**
1. 所有日期必须转换为 YYYY-MM-DD 格式
2. 所有时间必须转换为 HH:MM:SS 格式
3. 如果用户没有明确提到某个字段，使用合理的默认值（见上述说明）
4. 城市名称必须严格匹配可用城市列表
5. 价格单位统一为"元"
6. 数组字段如果为空则返回空数组 []

**输出格式：**
请以JSON格式返回，严格按照以下结构，不要添加任何其他文字说明：

{{
    "departure_city": "北京" 或 null,
    "arrival_city": "上海" 或 null,
    "departure_date": "2025-11-20" 或 null,
    "departure_time_start": "14:00:00" 或 "00:00:00",
    "departure_time_end": "18:59:59" 或 "23:59:59",
    "arrival_date": null 或 "2025-11-20",
    "arrival_time_start": null 或 "16:00:00",
    "arrival_time_end": null 或 "18:00:00",
    "cabin_class": "economy",
    "flight_price_min": null 或 500.0,
    "flight_price_max": null 或 2000.0,
    "airline_preference": null 或 "CA",
    "travel_style": "comfortable",
    "need_hotel": false,
    "hotel_check_in_date": null 或 "2025-11-20",
    "hotel_check_out_date": null 或 "2025-11-22",
    "hotel_star_level": null 或 4,
    "hotel_location_preference": null 或 "市中心",
    "hotel_price_min": null 或 300.0,
    "hotel_price_max": null 或 800.0,
    "hotel_amenities": [],
    "passenger_count": 1,
    "special_requirements": [],
    "budget_total": null 或 5000.0,
    "notes": null 或 "其他备注信息"
}}"""

    def _get_chinese_weekday(self, weekday: int) -> str:
        """获取中文星期"""
        weekdays = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]
        return weekdays[weekday]

    def analyze(self, user_input: str) -> Dict[str, Any]:
        """
        分析用户输入，返回结构化的出行规划需求字典
        
        Args:
            user_input: 用户的自然语言输入
            
        Returns:
            包含完整需求信息的字典，所有字段都有值（包括默认值）
        """
        try:
            # 构建提示词
            prompt = f"""用户输入：{user_input}

请仔细分析用户的出行需求，提取所有相关信息，返回完整的JSON格式。确保所有字段都有值（使用默认值填充缺失字段）。"""
            
            # 调用LLM
            response = self.llm.invoke([
                SystemMessage(content=self.system_prompt),
                HumanMessage(content=prompt)
            ])
            
            # 解析JSON响应
            content = response.content.strip()
            
            # 尝试提取JSON（可能包含markdown代码块）
            json_content = self._extract_json(content)
            
            # 解析JSON
            try:
                requirement_dict = json.loads(json_content)
            except json.JSONDecodeError as e:
                print(f"JSON解析错误: {str(e)}")
                print(f"原始内容: {content[:500]}")
                # 尝试修复常见的JSON问题
                json_content = self._fix_json(json_content)
                requirement_dict = json.loads(json_content)
            
            # 转换为TravelPlanRequirement对象以进行验证和默认值处理
            requirement = TravelPlanRequirement(**requirement_dict)
            
            # 应用智能默认值
            self._apply_intelligent_defaults(requirement)
            
            # 返回标准字典格式
            return requirement.to_dict()
            
        except Exception as e:
            print(f"需求分析错误: {str(e)}")
            import traceback
            traceback.print_exc()
            # 返回默认需求字典
            return self._create_default_requirement_dict()
    
    def _extract_json(self, content: str) -> str:
        """从响应中提取JSON内容"""
        # 尝试提取markdown代码块中的JSON
        if "```json" in content:
            json_start = content.find("```json") + 7
            json_end = content.find("```", json_start)
            if json_end > json_start:
                return content[json_start:json_end].strip()
        elif "```" in content:
            json_start = content.find("```") + 3
            json_end = content.find("```", json_start)
            if json_end > json_start:
                return content[json_start:json_end].strip()
        
        # 尝试提取第一个完整的JSON对象
        json_match = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', content, re.DOTALL)
        if json_match:
            return json_match.group()
        
        # 如果都失败了，返回原内容
        return content
    
    def _fix_json(self, json_str: str) -> str:
        """修复常见的JSON格式问题"""
        # 移除尾随逗号
        json_str = re.sub(r',\s*}', '}', json_str)
        json_str = re.sub(r',\s*]', ']', json_str)
        # 修复单引号为双引号
        json_str = json_str.replace("'", '"')
        return json_str
    
    def _apply_intelligent_defaults(self, requirement: TravelPlanRequirement):
        """应用智能默认值"""
        current_date = datetime.now()
        
        # 日期默认值
        if not requirement.departure_date:
            requirement.departure_date = current_date.strftime('%Y-%m-%d')
        
        # 时间默认值
        if not requirement.departure_time_start:
            requirement.departure_time_start = "00:00:00"
        if not requirement.departure_time_end:
            requirement.departure_time_end = "23:59:59"
        
        # 舱位默认值
        if not requirement.cabin_class:
            requirement.cabin_class = "economy"
        
        # 出行风格默认值
        if not requirement.travel_style:
            requirement.travel_style = "comfortable"
        
        # 出行人数默认值
        if not requirement.passenger_count or requirement.passenger_count < 1:
            requirement.passenger_count = 1
        
        # 酒店相关默认值
        if requirement.need_hotel is None:
            requirement.need_hotel = False
        
        # 数组字段默认值
        if requirement.hotel_amenities is None:
            requirement.hotel_amenities = []
        if requirement.special_requirements is None:
            requirement.special_requirements = []
        
        # 根据出行风格设置默认舱位（如果用户未指定）
        if requirement.cabin_class == "economy" and requirement.travel_style == "luxury":
            requirement.cabin_class = "business"
        elif requirement.cabin_class == "economy" and requirement.travel_style == "economy":
            requirement.cabin_class = "economy"
    
    def _create_default_requirement_dict(self) -> Dict[str, Any]:
        """创建默认需求字典"""
        current_date = datetime.now().strftime('%Y-%m-%d')
        default_requirement = TravelPlanRequirement(
            departure_date=current_date,
            departure_time_start="00:00:00",
            departure_time_end="23:59:59",
            cabin_class="economy",
            travel_style="comfortable",
            need_hotel=False,
            passenger_count=1,
            hotel_amenities=[],
            special_requirements=[]
        )
        return default_requirement.to_dict()


# 为了向后兼容，保留旧的类名
RequirementAnalysisAgent = TravelPlanRequirementAgent
