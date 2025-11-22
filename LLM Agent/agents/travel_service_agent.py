"""
出行服务助手 Agent
专注于出行相关的服务（天气、景点、美食等）
"""
from typing import Dict, Any, Optional
from langchain_core.messages import HumanMessage, SystemMessage
from .base_agent import BaseAgent

# 尝试导入 Agent 相关功能，如果失败则使用降级方案
try:
    from langchain.agents import create_tool_calling_agent, AgentExecutor
    from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
    HAS_AGENT_SUPPORT = True
except ImportError:
    try:
        from langchain_core.agents import create_tool_calling_agent, AgentExecutor
        from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
        HAS_AGENT_SUPPORT = True
    except ImportError:
        HAS_AGENT_SUPPORT = False
        print("警告: 无法导入 create_tool_calling_agent，将使用降级模式（直接 LLM 调用）")
from tools.travel_tools import (
    get_weather_tool,
    search_travel_info_tool,
    get_airport_info_tool,
)


class TravelServiceAgent(BaseAgent):
    """出行服务助手 - 负责出行相关的服务"""
    
    def __init__(self):
        tools = [
            get_weather_tool,
            search_travel_info_tool,
            get_airport_info_tool,
        ]
        super().__init__(
            name="TravelServiceAgent",
            description="专门负责出行相关的服务，包括查询天气、搜索景点美食、查询机场信息等。不直接操作订单数据库。",
            tools=tools
        )
        
        # 构建 Agent
        self._build_agent()
    
    def _build_system_prompt(self) -> str:
        """构建系统提示词"""
        return """你是一个贴心的出行服务助手。你的职责是：

1. **查询天气**：帮助用户查询目的地的天气情况，提供出行建议
2. **搜索旅游信息**：搜索景点、美食、攻略等旅游相关信息
3. **查询机场信息**：查询机场的航站楼、交通、设施等信息

**重要规则：**
- 这些服务主要连接外部API，提供实时信息
- 如果API不可用，要友好地告知用户
- 提供的信息要准确、有用
- 可以结合用户的出行计划，提供个性化建议

**可用工具：**
- get_weather_tool: 查询指定城市、指定日期的天气
- search_travel_info_tool: 搜索旅游相关信息（景点、美食、攻略等）
- get_airport_info_tool: 获取机场相关信息

**注意：**
当前这些工具是示例实现，实际使用时需要接入真实的API：
- 天气API：和风天气、OpenWeatherMap等
- 搜索API：DuckDuckGo、Tavily、Google Custom Search等

请使用合适的工具来帮助用户。"""
    
    def _build_agent(self):
        """构建 LangChain Agent"""
        if not HAS_AGENT_SUPPORT:
            self.agent_executor = None
            return
        
        try:
            prompt = ChatPromptTemplate.from_messages([
                ("system", self.system_prompt),
                ("human", "{input}"),
                MessagesPlaceholder(variable_name="agent_scratchpad"),
            ])
            
            self.agent = create_tool_calling_agent(self.llm, self.tools, prompt)
            self.agent_executor = AgentExecutor(
                agent=self.agent,
                tools=self.tools,
                verbose=True,
                handle_parsing_errors=True
            )
        except Exception as e:
            print(f"构建 Agent 失败: {str(e)}")
            self.agent_executor = None
    
    def process(self, user_input: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        处理用户输入
        
        Args:
            user_input: 用户输入
            context: 上下文信息（可选，可能包含出行计划等）
            
        Returns:
            处理结果
        """
        try:
            if self.agent_executor is None:
                # 如果 Agent 构建失败，使用简单的 LLM 调用
                messages = [
                    SystemMessage(content=self.system_prompt),
                    HumanMessage(content=f"用户输入：{user_input}\n上下文：{context}")
                ]
                response = self.invoke_llm(messages)
                return {
                    "success": True,
                    "message": response,
                    "agent": "TravelServiceAgent"
                }
            
            # 使用 Agent 处理
            result = self.agent_executor.invoke({
                "input": user_input,
                "context": context or {}
            })
            
            return {
                "success": True,
                "message": result.get("output", ""),
                "agent": "TravelServiceAgent",
                "raw_result": result
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"处理失败: {str(e)}",
                "agent": "TravelServiceAgent",
                "error": str(e)
            }

