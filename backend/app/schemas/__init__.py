# Pydantic schemas
from .user import (
    User, UserCreate, UserUpdate, 
    Token, TokenPayload
)
from .airline import (
    Airline, AirlineCreate, AirlineUpdate, AirlineWithFlights
)
from .airport import (
    Airport, AirportCreate, AirportUpdate, AirportWithRoutes
)
from .route import (
    Route, RouteCreate, RouteUpdate, RouteWithAirports, RouteWithFlights
)
from .flight import (
    Flight, FlightCreate, FlightUpdate, FlightWithDetails, FlightWithPricing,
    FlightPricing, FlightPricingCreate, FlightPricingUpdate,
    FlightStatus, CabinClass
)
from .flight_search import (
    FlightSearchRequest, FlightSearchResult, FlightSearchResponse,
    FlightAvailability
)
from .passenger import (
    Passenger, PassengerCreate, PassengerUpdate, PassengerWithOrders,
    PassengerBookingInfo, Gender
)
from .order import (
    Order, OrderCreate, OrderUpdate, OrderWithItems,
    OrderItem, OrderItemCreate, OrderItemWithDetails,
    OrderPayment, OrderQuery, OrderSummary, OrderStats,
    PaymentMethod, PaymentStatus, OrderStatus, CheckInStatus, TicketStatus
)
from .check_in import (
    CheckIn, CheckInCreate, CheckInUpdate, CheckInWithDetails,
    CheckInResponse, SeatSelection, BoardingPass
)

__all__ = [
    # User schemas
    "User", "UserCreate", "UserUpdate", "UserLogin", 
    "Token", "TokenData", "VipLevel", "UserRole",
    
    # Airline schemas
    "Airline", "AirlineCreate", "AirlineUpdate", "AirlineWithFlights",
    
    # Airport schemas
    "Airport", "AirportCreate", "AirportUpdate", "AirportWithRoutes",
    
    # Route schemas
    "Route", "RouteCreate", "RouteUpdate", "RouteWithAirports", "RouteWithFlights",
    
    # Flight schemas
    "Flight", "FlightCreate", "FlightUpdate", "FlightWithDetails", "FlightWithPricing",
    "FlightPricing", "FlightPricingCreate", "FlightPricingUpdate",
    "FlightStatus", "CabinClass",
    
    # Flight search schemas
    "FlightSearchRequest", "FlightSearchResult", "FlightSearchResponse",
    "FlightAvailability",
    
    # Passenger schemas
    "Passenger", "PassengerCreate", "PassengerUpdate", "PassengerWithOrders",
    "PassengerBookingInfo", "Gender",
    
    # Order schemas
    "Order", "OrderCreate", "OrderUpdate", "OrderWithItems",
    "OrderItem", "OrderItemCreate", "OrderItemWithDetails",
    "OrderPayment", "OrderQuery", "OrderSummary", "OrderStats",
    "PaymentMethod", "PaymentStatus", "OrderStatus", "CheckInStatus", "TicketStatus",
    
    # Check-in schemas
    "CheckIn", "CheckInCreate", "CheckInUpdate", "CheckInWithDetails",
    "CheckInResponse", "SeatSelection", "BoardingPass",
]
