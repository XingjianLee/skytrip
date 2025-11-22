"""
基础 Agent 类
所有 Worker Agent 的基类
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_community.chat_models import ChatTongyi
from config import QWEN_KEY


class BaseAgent(ABC):
    """所有 Worker Agent 的基类"""
    
    def __init__(self, name: str, description: str, tools: List = None):
        """
        初始化 Agent
        
        Args:
            name: Agent 名称
            description: Agent 职责描述
            tools: Agent 可用的工具列表
        """
        self.name = name
        self.description = description
        self.tools = tools or []
        
        # 初始化 LLM
        self.llm = ChatTongyi(
            model="qwen-max",
            dashscope_api_key=QWEN_KEY,
            temperature=0.2,
        )
        
        # 构建系统提示词
        self.system_prompt = self._build_system_prompt()
    
    def _build_system_prompt(self) -> str:
        """构建系统提示词（子类可重写）"""
        return f"""你是一个专业的{self.name}。

你的职责：{self.description}

重要规则：
1. 只处理与你的职责相关的任务
2. 如果任务超出你的职责范围，明确告知用户
3. 使用提供的工具来完成任务
4. 返回清晰、准确的结果
5. 如果遇到错误，提供友好的错误信息
"""
    
    @abstractmethod
    def process(self, user_input: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        处理用户输入
        
        Args:
            user_input: 用户输入
            context: 上下文信息（如用户ID、会话历史等）
            
        Returns:
            处理结果字典
        """
        pass
    
    def invoke_llm(self, messages: List) -> str:
        """调用 LLM"""
        response = self.llm.invoke(messages)
        return response.content.strip()

