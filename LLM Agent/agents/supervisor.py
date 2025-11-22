"""
Supervisor Agent (总管/路由 Agent)
负责分析用户意图，将任务分发给具体的子 Agent，最后汇总结果
"""
from typing import Dict, Any, List, Optional
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_community.chat_models import ChatTongyi
from config import QWEN_KEY
from .base_agent import BaseAgent


class SupervisorAgent:
    """总管 Agent - 负责路由和协调"""
    
    def __init__(self, workers: Dict[str, BaseAgent]):
        """
        初始化 Supervisor
        
        Args:
            workers: 子 Agent 字典，格式为 {agent_name: agent_instance}
        """
        self.workers = workers
        self.llm = ChatTongyi(
            model="qwen-max",
            dashscope_api_key=QWEN_KEY,
            temperature=0.3,  # 稍高温度以支持更好的意图理解
        )
        
        # 构建可用 Agent 列表描述
        self.agent_descriptions = self._build_agent_descriptions()
        self.system_prompt = self._build_system_prompt()
    
    def _build_agent_descriptions(self) -> str:
        """构建 Agent 描述列表"""
        descriptions = []
        for name, agent in self.workers.items():
            descriptions.append(f"- **{name}**: {agent.description}")
        return "\n".join(descriptions)
    
    def _build_system_prompt(self) -> str:
        """构建系统提示词"""
        return f"""你是一个智能任务路由助手（Supervisor）。你的职责是：

1. **分析用户意图**：理解用户想要做什么
2. **选择合适的 Agent**：根据任务类型，将任务分配给最合适的专业 Agent
3. **汇总结果**：收集 Agent 的回复，整理后回答用户

**可用的专业 Agent：**

{self.agent_descriptions}

**路由规则：**

- **查询航班**（如"查航班"、"找飞机"、"有哪些航班"）→ 分配给 **FlightSearchAgent**
- **预订机票**（如"订票"、"下单"、"预订"、"购买"）→ 分配给 **BookingAgent**
- **订单服务**（如"值机"、"选座"、"查订单"、"退票"）→ 分配给 **ServiceAgent**
- **用户信息**（如"我的信息"、"修改资料"、"会员等级"）→ 分配给 **UserProfileAgent**
- **出行服务**（如"天气"、"景点"、"美食"、"旅游攻略"）→ 分配给 **TravelServiceAgent**

**工作流程：**

1. 分析用户输入，确定任务类型
2. 选择最合适的 Agent（只能选择一个）
3. 返回 Agent 名称和简要的任务描述

**输出格式（JSON）：**
{{
    "selected_agent": "Agent名称",
    "task_description": "简要任务描述",
    "reasoning": "选择该 Agent 的原因"
}}

如果用户输入不明确或需要多个 Agent 协作，选择最核心的 Agent。
"""
    
    def route(self, user_input: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        路由用户输入到合适的 Agent
        
        Args:
            user_input: 用户输入
            context: 上下文信息
            
        Returns:
            路由决策字典，包含 selected_agent 和 task_description
        """
        prompt = f"""用户输入：{user_input}

请分析用户意图，选择合适的 Agent 来处理这个任务。

如果上下文中有相关信息，请考虑：
{context if context else "无额外上下文"}
"""
        
        messages = [
            SystemMessage(content=self.system_prompt),
            HumanMessage(content=prompt)
        ]
        
        response = self.llm.invoke(messages)
        content = response.content.strip()
        
        # 尝试解析 JSON 响应
        import json
        import re
        
        # 提取 JSON
        json_match = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', content, re.DOTALL)
        if json_match:
            try:
                routing = json.loads(json_match.group())
                selected_agent_name = routing.get("selected_agent", "")
                
                # 验证 Agent 是否存在
                if selected_agent_name in self.workers:
                    return {
                        "selected_agent": selected_agent_name,
                        "agent_instance": self.workers[selected_agent_name],
                        "task_description": routing.get("task_description", ""),
                        "reasoning": routing.get("reasoning", ""),
                        "success": True
                    }
            except json.JSONDecodeError:
                pass
        
        # 如果解析失败，使用关键词匹配作为后备方案
        return self._fallback_routing(user_input)
    
    def _fallback_routing(self, user_input: str) -> Dict[str, Any]:
        """后备路由方案（基于关键词匹配）"""
        user_input_lower = user_input.lower()
        
        # 关键词匹配规则
        if any(keyword in user_input_lower for keyword in ["订", "买", "下单", "预订", "购买", "支付"]):
            agent_name = "BookingAgent"
        elif any(keyword in user_input_lower for keyword in ["值机", "选座", "登机", "订单", "退票", "取消"]):
            agent_name = "ServiceAgent"
        elif any(keyword in user_input_lower for keyword in ["天气", "景点", "美食", "攻略", "旅游", "推荐"]):
            agent_name = "TravelServiceAgent"
        elif any(keyword in user_input_lower for keyword in ["信息", "资料", "会员", "修改", "更新"]):
            agent_name = "UserProfileAgent"
        else:
            # 默认使用航班查询
            agent_name = "FlightSearchAgent"
        
        if agent_name in self.workers:
            return {
                "selected_agent": agent_name,
                "agent_instance": self.workers[agent_name],
                "task_description": "处理用户请求",
                "reasoning": "基于关键词匹配",
                "success": True
            }
        
        # 如果都匹配不上，返回第一个可用的 Agent
        first_agent = list(self.workers.keys())[0]
        return {
            "selected_agent": first_agent,
            "agent_instance": self.workers[first_agent],
            "task_description": "处理用户请求",
            "reasoning": "默认路由",
            "success": True
        }
    
    def process(self, user_input: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        处理用户输入：路由 -> 执行 -> 汇总
        
        Args:
            user_input: 用户输入
            context: 上下文信息
            
        Returns:
            处理结果
        """
        # 1. 路由到合适的 Agent
        routing_result = self.route(user_input, context)
        
        if not routing_result.get("success"):
            return {
                "success": False,
                "message": "无法确定合适的处理 Agent",
                "error": "路由失败"
            }
        
        selected_agent = routing_result["agent_instance"]
        
        # 2. 让选中的 Agent 处理任务
        try:
            agent_result = selected_agent.process(user_input, context)
            
            # 3. 汇总结果
            return {
                "success": True,
                "agent": routing_result["selected_agent"],
                "result": agent_result,
                "routing_info": {
                    "task_description": routing_result.get("task_description", ""),
                    "reasoning": routing_result.get("reasoning", "")
                }
            }
        except Exception as e:
            return {
                "success": False,
                "agent": routing_result["selected_agent"],
                "message": f"Agent 处理失败: {str(e)}",
                "error": str(e)
            }

