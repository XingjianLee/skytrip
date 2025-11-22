"""
SkyTrip Agent - 多智能体架构主程序
采用 Supervisor-Worker 模式
"""
from agents import (
    SupervisorAgent,
    FlightSearchAgent,
    BookingAgent,
    ServiceAgent,
    UserProfileAgent,
    TravelServiceAgent,
)
import json
from typing import Dict, Any, Optional


class SkyTripMultiAgentSystem:
    """SkyTrip 多智能体系统"""
    
    def __init__(self):
        """初始化所有 Agent"""
        print("🚀 正在初始化多智能体系统...")
        
        # 创建所有 Worker Agent
        self.flight_search_agent = FlightSearchAgent()
        self.booking_agent = BookingAgent()
        self.service_agent = ServiceAgent()
        self.user_profile_agent = UserProfileAgent()
        self.travel_service_agent = TravelServiceAgent()
        
        # 创建 Supervisor Agent
        self.supervisor = SupervisorAgent({
            "FlightSearchAgent": self.flight_search_agent,
            "BookingAgent": self.booking_agent,
            "ServiceAgent": self.service_agent,
            "UserProfileAgent": self.user_profile_agent,
            "TravelServiceAgent": self.travel_service_agent,
        })
        
        print("✅ 多智能体系统初始化完成！")
        print("\n可用 Agent：")
        print("  ✈️  FlightSearchAgent - 航班查询专家")
        print("  🛒 BookingAgent - 票务预订专家")
        print("  🧳 ServiceAgent - 行程服务专家")
        print("  👤 UserProfileAgent - 用户管家")
        print("  🌍 TravelServiceAgent - 出行服务助手")
        print()
    
    def process(self, user_input: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        处理用户输入
        
        Args:
            user_input: 用户输入
            context: 上下文信息（如 user_id、会话历史等）
            
        Returns:
            处理结果
        """
        try:
            print(f"\n{'='*60}")
            print(f"📋 收到用户请求")
            print(f"{'='*60}")
            print(f"用户输入：{user_input}\n")
            
            # 使用 Supervisor 处理
            result = self.supervisor.process(user_input, context)
            
            print(f"\n{'='*60}")
            print("✅ 处理完成！")
            print(f"{'='*60}\n")
            
            return result
        except Exception as e:
            print(f"❌ 处理失败: {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                "success": False,
                "message": f"系统错误: {str(e)}",
                "error": str(e)
            }
    
    def print_result(self, result: Dict[str, Any]):
        """格式化打印结果"""
        print("\n" + "="*60)
        print("📊 处理结果")
        print("="*60)
        
        if result.get("success"):
            print(f"✅ 处理成功")
            print(f"🤖 使用的 Agent: {result.get('agent', 'Unknown')}")
            
            if result.get("routing_info"):
                routing = result["routing_info"]
                print(f"📝 任务描述: {routing.get('task_description', '')}")
                print(f"💭 路由原因: {routing.get('reasoning', '')}")
            
            print(f"\n💬 Agent 回复:")
            print("-" * 60)
            
            agent_result = result.get("result", {})
            if isinstance(agent_result, dict):
                message = agent_result.get("message", "")
                if message:
                    print(message)
                else:
                    print(json.dumps(agent_result, ensure_ascii=False, indent=2))
            else:
                print(str(agent_result))
        else:
            print(f"❌ 处理失败")
            print(f"错误信息: {result.get('message', 'Unknown error')}")
        
        print("="*60 + "\n")


def main():
    """主函数"""
    print("\n" + "="*60)
    print("✈️  SkyTrip Agent - 多智能体出行规划助手")
    print("="*60)
    print("\n采用 Supervisor-Worker 架构，智能路由到专业 Agent 处理您的需求\n")
    
    # 初始化系统
    system = SkyTripMultiAgentSystem()
    
    # 示例：设置默认用户上下文（实际应用中应该从登录系统获取）
    default_context = {
        "user_id": 22,  # 示例用户ID，实际应该从登录系统获取
        "username": "示例用户"
    }
    
    print("💡 提示：")
    print("  - 查询航班：'帮我查明天早上从北京去上海的航班'")
    print("  - 预订机票：'帮我预订刚才查到的那个航班'")
    print("  - 办理值机：'帮我办理值机，我想要靠窗的位置'")
    print("  - 查询订单：'查询我的历史订单'")
    print("  - 查询天气：'我这周去上海，那边天气怎么样？'")
    print("  - 用户信息：'我的会员等级是什么？'")
    print("\n输入 'quit' 或 'exit' 退出\n")
    
    # 交互循环
    while True:
        try:
            user_input = input("> ").strip()
            
            if not user_input:
                continue
            
            if user_input.lower() in ['quit', 'exit', '退出']:
                print("\n👋 感谢使用 SkyTrip Agent，再见！")
                break
            
            # 处理用户输入
            result = system.process(user_input, default_context)
            
            # 打印结果
            system.print_result(result)
            
        except KeyboardInterrupt:
            print("\n\n👋 感谢使用 SkyTrip Agent，再见！")
            break
        except Exception as e:
            print(f"\n❌ 发生错误: {str(e)}")
            import traceback
            traceback.print_exc()


if __name__ == '__main__':
    main()
