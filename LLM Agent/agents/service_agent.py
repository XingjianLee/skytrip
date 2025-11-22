"""
行程服务专家 Agent
专注于订单服务、值机、选座等
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
from tools.service_tools import (
    get_user_orders_tool,
    get_order_details_tool,
    get_order_items_tool,
    create_check_in_tool,
    get_check_in_info_tool,
    get_flight_info_for_checkin_tool,
)


class ServiceAgent(BaseAgent):
    """行程服务专家 - 负责订单服务、值机、选座等"""
    
    def __init__(self):
        tools = [
            get_user_orders_tool,
            get_order_details_tool,
            get_order_items_tool,
            create_check_in_tool,
            get_check_in_info_tool,
            get_flight_info_for_checkin_tool,
        ]
        super().__init__(
            name="ServiceAgent",
            description="专门负责已购机票的后续服务，包括查看订单、办理值机、选座、查询登机信息等。",
            tools=tools
        )
        
        # 构建 Agent
        self._build_agent()
    
    def _build_system_prompt(self) -> str:
        """构建系统提示词"""
        return """你是一个专业的行程服务助手。你的职责是：

1. **查询订单**：帮助用户查看历史订单和订单详情
2. **办理值机**：为用户办理值机，分配座位
3. **查询值机信息**：查询已办理的值机信息（座位号、登机口等）
4. **查询登机信息**：查询航班的登机时间、航站楼等信息

**重要规则：**
- 查询订单时，需要从 context 中获取 user_id
- 办理值机时，需要：
  1. 确认订单项（item_id）和乘客信息
  2. 分配合适的座位号（格式：如 "15C"）
  3. 如果用户要求靠窗或靠过道，需要合理分配
  4. 设置登机口和航站楼（可以从航班信息中获取或合理推断）
- 值机信息要准确，包括座位号、航站楼、登机口、登机时间
- 如果订单不存在或已值机，要友好地告知用户

**座位分配规则：**
- 靠窗位置：A、F（或根据机型调整）
- 靠过道位置：C、D（或根据机型调整）
- 中间位置：B、E（或根据机型调整）

**可用工具：**
- get_user_orders_tool: 获取用户的所有订单
- get_order_details_tool: 获取订单详细信息（包括订单项）
- get_order_items_tool: 获取订单的所有订单项
- create_check_in_tool: 办理值机，分配座位
- get_check_in_info_tool: 查询值机信息
- get_flight_info_for_checkin_tool: 获取航班信息（用于值机）

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
            context: 上下文信息（应包含 user_id）
            
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
                    "agent": "ServiceAgent"
                }
            
            # 使用 Agent 处理
            result = self.agent_executor.invoke({
                "input": user_input,
                "context": context or {}
            })
            
            return {
                "success": True,
                "message": result.get("output", ""),
                "agent": "ServiceAgent",
                "raw_result": result
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"处理失败: {str(e)}",
                "agent": "ServiceAgent",
                "error": str(e)
            }

