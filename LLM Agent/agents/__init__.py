"""
多智能体架构模块
采用 Supervisor-Worker 模式
"""

from .base_agent import BaseAgent
from .supervisor import SupervisorAgent
from .flight_search_agent import FlightSearchAgent
from .booking_agent import BookingAgent
from .service_agent import ServiceAgent
from .user_profile_agent import UserProfileAgent
from .travel_service_agent import TravelServiceAgent

__all__ = [
    'BaseAgent',
    'SupervisorAgent',
    'FlightSearchAgent',
    'BookingAgent',
    'ServiceAgent',
    'UserProfileAgent',
    'TravelServiceAgent',
]

