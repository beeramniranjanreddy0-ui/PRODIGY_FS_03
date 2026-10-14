from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Optional
from datetime import datetime

class OccasionEnum:
    ALLOWED = [
        "Birthday",
        "Anniversary",
        "Wedding",
        "Engagement",
        "Congratulations",
        "Baby Shower",
        "Farewell",
        "Graduation",
        "Valentine's Day",
        "Festival",
        "Just Because",
        "Other"
    ]

# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2)
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Customization Schemas
class CustomizationSchema(BaseModel):
    occasion: str
    weight: str
    flavour: str
    is_eggless: bool = False
    has_message: bool = False
    cake_message: Optional[str] = None
    photo_url: Optional[str] = None
    special_instructions: Optional[str] = None
    delivery_date: Optional[str] = None
    delivery_time_slot: Optional[str] = None

    @field_validator("occasion")
    @classmethod
    def validate_occasion(cls, v: str) -> str:
        if v not in OccasionEnum.ALLOWED:
            raise ValueError(f"Occasion must be one of: {', '.join(OccasionEnum.ALLOWED)}")
        return v

    @field_validator("cake_message")
    @classmethod
    def validate_cake_message(cls, v: Optional[str], values) -> Optional[str]:
        if v is not None and len(v) > 60:
            raise ValueError("Cake message must not exceed 60 characters.")
        return v

# Cart Schemas
class AddToCartRequest(BaseModel):
    product_id: str
    quantity: int = Field(default=1, ge=1)
    customization: CustomizationSchema

class CartItemResponse(BaseModel):
    id: str
    product_id: str
    product_name: str
    product_image: str
    unit_price: float
    quantity: int
    item_subtotal: float
    customization: CustomizationSchema

    class Config:
        from_attributes = True

class CartResponse(BaseModel):
    items: List[CartItemResponse]
    subtotal: float

# Checkout & Order Schemas
class AddressSchema(BaseModel):
    full_name: str
    phone: str
    email: EmailStr
    street_address: str
    apartment: Optional[str] = None
    city: str
    state: str
    pincode: str

class CreateOrderRequest(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    shipping_address: AddressSchema
    items: List[CartItemResponse]
    coupon_code: Optional[str] = None
    payment_method: str = Field(..., pattern="^(COD|SIMULATED_CARD|SIMULATED_UPI)$")
    delivery_date: str
    delivery_time_slot: str

class OrderResponse(BaseModel):
    id: str
    order_number: str
    customer_name: str
    customer_email: str
    subtotal: float
    discount_amount: float
    delivery_fee: float
    tax_amount: float
    grand_total: float
    payment_method: str
    payment_status: str
    order_status: str
    delivery_date: str
    delivery_time_slot: str
    created_at: datetime

    class Config:
        from_attributes = True

# Coupon Validation
class CouponValidateRequest(BaseModel):
    code: str
    order_value: float

class CouponValidateResponse(BaseModel):
    valid: bool
    code: str
    discount_amount: float
    discount_percentage: int
