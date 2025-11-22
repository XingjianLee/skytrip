"""
航班查询专家 Agent
专注于航班查询相关任务
"""
from typing import Dict, Any, Optional, List
from langchain_core.messages import HumanMessage, SystemMessage
from .base_agent import BaseAgent

# 尝试导入 Agent 相关功能，如果失败则使用降级方案
try:
    from langchain.agents import create_tool_calling_agent, AgentExecutor
    from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
    HAS_AGENT_SUPPORT = True
except ImportError:
    try:
        # 尝试其他可能的导入路径
        from langchain_core.agents import create_tool_calling_agent, AgentExecutor
        from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
        HAS_AGENT_SUPPORT = True
    except ImportError:
        HAS_AGENT_SUPPORT = False
        print("警告: 无法导入 create_tool_calling_agent，将使用降级模式（直接 LLM 调用）")
from tools.flight_tools import (
    search_flights_advanced_tool,
    get_airport_codes_tool,
    get_available_cities_tool,
    get_available_routes_tool,
    get_flight_by_number_tool,
)


class FlightSearchAgent(BaseAgent):
    """航班查询专家 - 负责查询航班信息"""
    
    def __init__(self):
        tools = [
            search_flights_advanced_tool,
            get_airport_codes_tool,
            get_available_cities_tool,
            get_available_routes_tool,
            get_flight_by_number_tool,
        ]
        super().__init__(
            name="FlightSearchAgent",
            description="专门负责查询航班信息，包括搜索航班、查询机场、查询航线等。只负责读取数据，不涉及预订操作。",
            tools=tools
        )
        
        # 构建 Agent
        self._build_agent()
    
    def _build_system_prompt(self) -> str:
        """构建系统提示词"""
        return """你是一个专业的航班查询助手。你的职责是：

1. **查询航班**：根据用户提供的出发地、目的地、日期、时间等条件查询航班
2. **查询机场信息**：帮助用户了解机场代码、机场名称等信息
3. **查询航线**：查询可用的航线信息
4. **查询航班详情**：根据航班号查询具体航班信息

**重要规则：**
- 只负责查询和展示信息，不涉及预订、下单等操作
- 如果用户想要预订，请告知用户需要使用预订功能
- 查询结果要清晰、准确，包含航班号、时间、价格等关键信息
- 如果查询不到结果，要友好地告知用户

**可用工具：**
- search_flights_advanced_tool: 高级航班搜索（支持舱位、价格、航空公司筛选）
- get_airport_codes_tool: 查询城市的所有机场
- get_available_cities_tool: 获取所有可用城市列表
- get_available_routes_tool: 获取所有可用航线
- get_flight_by_number_tool: 根据航班号查询航班信息

请使用合适的工具来回答用户的问题。"""
    
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
            context: 上下文信息
            
        Returns:
            处理结果
        """
        try:
            if self.agent_executor is None:
                # 如果 Agent 构建失败，使用简单的 LLM 调用
                messages = [
                    SystemMessage(content=self.system_prompt),
                    HumanMessage(content=user_input)
                ]
                response = self.invoke_llm(messages)
                return {
                    "success": True,
                    "message": response,
                    "agent": "FlightSearchAgent"
                }
            
            # 使用 Agent 处理
            result = self.agent_executor.invoke({
                "input": user_input,
                "context": context or {}
            })
            
            return {
                "success": True,
                "message": result.get("output", ""),
                "agent": "FlightSearchAgent",
                "raw_result": result
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"处理失败: {str(e)}",
                "agent": "FlightSearchAgent",
                "error": str(e)
            }

