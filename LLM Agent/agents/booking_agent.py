"""
票务预订专家 Agent
专注于机票预订相关任务
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
from tools.booking_tools import (
    get_flight_info_tool,
    get_user_info_tool,
    get_passenger_info_tool,
    create_passenger_tool,
    create_order_tool,
    create_order_item_tool,
    update_order_payment_tool,
)
from database import db_manager


class BookingAgent(BaseAgent):
    """票务预订专家 - 负责处理订单和预订"""
    
    def __init__(self):
        tools = [
            get_flight_info_tool,
            get_user_info_tool,
            get_passenger_info_tool,
            create_passenger_tool,
            create_order_tool,
            create_order_item_tool,
            update_order_payment_tool,
        ]
        super().__init__(
            name="BookingAgent",
            description="专门负责机票预订、订单创建、乘客信息管理、支付处理等。这是需要谨慎操作的 Agent，涉及数据写入。",
            tools=tools
        )
        
        # 构建 Agent
        self._build_agent()
    
    def _build_system_prompt(self) -> str:
        """构建系统提示词"""
        return """你是一个专业的票务预订助手。你的职责是：

1. **创建订单**：根据用户选择的航班创建订单
2. **管理乘客信息**：查询或创建乘客信息
3. **处理支付**：更新订单支付状态
4. **验证信息**：在创建订单前，验证航班信息、用户信息、乘客信息

**重要规则：**
- 在创建订单前，必须先验证：
  1. 航班是否存在且有可用座位
  2. 用户信息是否正确
  3. 乘客信息是否完整（姓名、身份证号必填）
- 如果乘客信息不存在，需要先创建乘客信息
- 创建订单时，需要计算正确的价格（原价和实际支付价格）
- 订单创建后，提醒用户尽快支付
- 所有操作都要谨慎，确保数据准确性

**工作流程：**
1. 用户选择航班 → 验证航班信息
2. 获取用户信息（从 context 中获取 user_id）
3. 检查乘客信息（根据身份证号查询，不存在则创建）
4. 创建订单和订单项
5. 返回订单号，提醒用户支付

**可用工具：**
- get_flight_info_tool: 获取航班详细信息（包括价格和座位数）
- get_user_info_tool: 获取用户信息
- get_passenger_info_tool: 根据身份证号查询乘客信息
- create_passenger_tool: 创建新乘客信息
- create_order_tool: 创建订单
- create_order_item_tool: 创建订单项（机票）
- update_order_payment_tool: 更新订单支付状态

请严格按照流程操作，确保每一步都验证正确。"""
    
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
            context: 上下文信息（必须包含 user_id）
            
        Returns:
            处理结果
        """
        try:
            # 检查必要的上下文信息
            if context and "user_id" not in context:
                return {
                    "success": False,
                    "message": "缺少用户ID，无法处理预订请求",
                    "agent": "BookingAgent",
                    "error": "missing_user_id"
                }
            
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
                    "agent": "BookingAgent"
                }
            
            # 使用 Agent 处理
            result = self.agent_executor.invoke({
                "input": user_input,
                "context": context or {}
            })
            
            return {
                "success": True,
                "message": result.get("output", ""),
                "agent": "BookingAgent",
                "raw_result": result
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"处理失败: {str(e)}",
                "agent": "BookingAgent",
                "error": str(e)
            }

