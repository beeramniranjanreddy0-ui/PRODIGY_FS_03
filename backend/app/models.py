import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Numeric,
    Boolean,
    Text,
    DateTime,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship
from backend.app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    role = Column(String(20), default="customer") # 'customer' or 'admin'
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    addresses = relationship("Address", back_populates="user", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user")

class Address(Base):
    __tablename__ = "addresses"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    street_address = Column(Text, nullable=False)
    apartment = Column(String(255), nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    pincode = Column(String(20), nullable=False)

    user = relationship("User", back_populates="addresses")

class Category(Base):
    __tablename__ = "categories"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    image = Column(String(500), nullable=True)

    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    category_id = Column(String(50), ForeignKey("categories.id"), nullable=False)
    base_price = Column(Numeric(10, 2), nullable=False)
    description = Column(Text, nullable=False)
    image = Column(String(500), nullable=False)
    gallery_images = Column(JSON, default=list) # List of image URLs
    supported_weights = Column(JSON, default=["0.5 kg", "1 kg", "2 kg", "3 kg"])
    supported_flavours = Column(JSON, default=["Chocolate", "Vanilla"])
    supports_eggless = Column(Boolean, default=True)
    stock = Column(Integer, default=20)
    is_bestseller = Column(Boolean, default=False)
    is_special = Column(Boolean, default=False)
    rating = Column(Numeric(3, 1), default=5.0)
    review_count = Column(Integer, default=0)

    category = relationship("Category", back_populates="products")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(String(50), primary_key=True, index=True)
    product_id = Column(String(50), ForeignKey("products.id"), nullable=False)
    user_name = Column(String(255), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    product = relationship("Product", back_populates="reviews")

class Cart(Base):
    __tablename__ = "carts"

    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(String(50), nullable=True) # Optional for guest carts
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")

class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(String(100), primary_key=True, index=True)
    cart_id = Column(String(100), ForeignKey("carts.id"), nullable=False)
    product_id = Column(String(50), ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    item_subtotal = Column(Numeric(10, 2), nullable=False)

    # Core Customization Fields
    occasion = Column(String(50), nullable=False)
    weight = Column(String(20), nullable=False)
    flavour = Column(String(100), nullable=False)
    is_eggless = Column(Boolean, default=False)
    has_message = Column(Boolean, default=False)
    cake_message = Column(String(60), nullable=True) # Validated <= 60 chars
    photo_url = Column(Text, nullable=True)
    special_instructions = Column(Text, nullable=True)
    delivery_date = Column(String(30), nullable=True)
    delivery_time_slot = Column(String(100), nullable=True)

    cart = relationship("Cart", back_populates="items")
    product = relationship("Product")

class Order(Base):
    __tablename__ = "orders"

    id = Column(String(50), primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=True)
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=False)
    customer_phone = Column(String(50), nullable=False)

    street_address = Column(Text, nullable=False)
    apartment = Column(String(255), nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    pincode = Column(String(20), nullable=False)

    subtotal = Column(Numeric(10, 2), nullable=False)
    discount_amount = Column(Numeric(10, 2), default=0.0)
    coupon_code = Column(String(50), nullable=True)
    delivery_fee = Column(Numeric(10, 2), default=0.0)
    tax_amount = Column(Numeric(10, 2), default=0.0)
    grand_total = Column(Numeric(10, 2), nullable=False)

    payment_method = Column(String(30), nullable=False) # 'COD', 'SIMULATED_CARD', 'SIMULATED_UPI'
    payment_status = Column(String(30), default="Pending") # 'Pending', 'Paid', 'Failed'
    order_status = Column(String(30), default="Pending") # 'Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'
    
    delivery_date = Column(String(30), nullable=False)
    delivery_time_slot = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String(100), primary_key=True, index=True)
    order_id = Column(String(50), ForeignKey("orders.id"), nullable=False)
    product_id = Column(String(50), nullable=False)
    product_name = Column(String(255), nullable=False)
    product_image = Column(String(500), nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    item_subtotal = Column(Numeric(10, 2), nullable=False)

    # Persisted customization snapshot
    occasion = Column(String(50), nullable=False)
    weight = Column(String(20), nullable=False)
    flavour = Column(String(100), nullable=False)
    is_eggless = Column(Boolean, default=False)
    has_message = Column(Boolean, default=False)
    cake_message = Column(String(60), nullable=True)
    photo_url = Column(Text, nullable=True)
    special_instructions = Column(Text, nullable=True)

    order = relationship("Order", back_populates="items")

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(String(50), primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    discount_percentage = Column(Integer, nullable=False)
    max_discount = Column(Numeric(10, 2), nullable=False)
    min_order_value = Column(Numeric(10, 2), nullable=False)
    is_active = Column(Boolean, default=True)

class DeliverySlot(Base):
    __tablename__ = "delivery_slots"

    id = Column(String(50), primary_key=True, index=True)
    label = Column(String(150), nullable=False)
    is_available = Column(Boolean, default=True)
    extra_fee = Column(Numeric(10, 2), default=0.0)
