from sqlalchemy import Column, DECIMAL, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class OrderItem(Base):
    __tablename__ = "order_items"

    item_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"), nullable=False)
    flight_id = Column(Integer, ForeignKey("flights.flight_id"), nullable=False)
    cabin_class = Column(
        Enum("economy", "business", "first", name="cabin_class"), nullable=False
    )
    passenger_id = Column(Integer, ForeignKey("passengers.passenger_id"), nullable=False)
    original_price = Column(DECIMAL(10, 2), nullable=False)
    paid_price = Column(DECIMAL(10, 2), nullable=False)
    seat_number = Column(String(10))
    check_in_status = Column(
        Enum("not_checked", "checked", name="check_in_status"), default="not_checked"
    )
    ticket_status = Column(Enum("confirmed", "cancelled", name="ticket_status"), default="confirmed")
    contact_email = Column(String(100))

    order = relationship("Order", back_populates="items")
    flight = relationship("Flight", back_populates="order_items")


