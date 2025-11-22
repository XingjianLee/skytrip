"""
用户管家 Agent
专注于用户信息管理
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
from tools.user_tools import (
    get_user_profile_tool,
    update_user_phone_tool,
    update_user_email_tool,
    get_user_vip_info_tool,
)


class UserProfileAgent(BaseAgent):
    """用户管家 - 负责用户信息管理"""
    
    def __init__(self):
        tools = [
            get_user_profile_tool,
            update_user_phone_tool,
            update_user_email_tool,
            get_user_vip_info_tool,
        ]
        super().__init__(
            name="UserProfileAgent",
            description="专门负责用户个人信息管理，包括查看资料、修改联系方式、查询会员等级等。",
            tools=tools
        )
        
        # 构建 Agent
        self._build_agent()
    
    def _build_system_prompt(self) -> str:
        """构建系统提示词"""
        return """你是一个专业的用户信息管理助手。你的职责是：

1. **查询用户信息**：帮助用户查看个人信息
2. **更新联系方式**：更新手机号、邮箱等
3. **查询会员信息**：查询VIP等级、有效期等

**重要规则：**
- 所有操作都需要从 context 中获取 user_id
- 更新信息前，要确认用户身份
- 保护用户隐私，不要泄露敏感信息
- 会员等级说明：
  - 0: 普通用户
  - 1: 银卡会员
  - 2: 金卡会员
  - 3: 白金会员

**可用工具：**
- get_user_profile_tool: 获取用户完整信息
- update_user_phone_tool: 更新手机号
- update_user_email_tool: 更新邮箱
- get_user_vip_info_tool: 获取VIP信息

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
            context: 上下文信息（必须包含 user_id）
            
        Returns:
            处理结果
        """
        try:
            # 检查必要的上下文信息
            if context and "user_id" not in context:
                return {
                    "success": False,
                    "message": "缺少用户ID，无法处理请求",
                    "agent": "UserProfileAgent",
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
                    "agent": "UserProfileAgent"
                }
            
            # 使用 Agent 处理
            result = self.agent_executor.invoke({
                "input": user_input,
                "context": context or {}
            })
            
            return {
                "success": True,
                "message": result.get("output", ""),
                "agent": "UserProfileAgent",
                "raw_result": result
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"处理失败: {str(e)}",
                "agent": "UserProfileAgent",
                "error": str(e)
            }

