from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uuid

from backend.app.config import settings
from backend.app.database import engine, Base, get_db
from backend.app.models import User, Category, Product, DeliverySlot, Coupon, Order
from backend.app.schemas import (
    UserRegister, UserLogin, TokenResponse, UserResponse,
    AddToCartRequest, CartResponse, CreateOrderRequest,
    CouponValidateRequest, CouponValidateResponse
)
from backend.app.auth import get_password_hash, verify_password, create_access_token, get_current_user, get_current_admin

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="The Baker's Corner — Artisanal Bakery E-Commerce & Custom Cake Ordering API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to The Baker's Corner API", "status": "online"}

@app.get("/api/health")
def health():
    return {"status": "ok", "app": "The Baker's Corner"}

# Single Designated Administrator Credentials
ADMIN_EMAIL = "thebakerscorner@admin.com"
ADMIN_PASSWORD = "Bakerscorner@123"

# ----------------- Auth Endpoints -----------------
@app.post("/api/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    if user_in.email.lower() == ADMIN_EMAIL.lower():
        raise HTTPException(
            status_code=400,
            detail="This email address is reserved and cannot be registered via customer signup."
        )

    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    new_user = User(
        id=f"user-{uuid.uuid4().hex[:12]}",
        email=user_in.email.lower(),
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        phone=user_in.phone,
        role="customer"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.id, "email": new_user.email, "role": new_user.role})
    return {"access_token": token, "token_type": "bearer", "user": new_user}

@app.post("/api/auth/login", response_model=TokenResponse)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    clean_email = user_in.email.lower()
    
    # Designated admin login check
    if clean_email == ADMIN_EMAIL.lower():
        if user_in.password != ADMIN_PASSWORD:
            raise HTTPException(status_code=401, detail="Invalid administrator password")
        
        admin_user = db.query(User).filter(User.email == ADMIN_EMAIL.lower()).first()
        if not admin_user:
            admin_user = User(
                id="user-admin-corner",
                email=ADMIN_EMAIL.lower(),
                hashed_password=get_password_hash(ADMIN_PASSWORD),
                full_name="Executive Chef & Admin",
                phone="+91 98765 43210",
                role="admin"
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
        
        token = create_access_token({"sub": admin_user.id, "email": admin_user.email, "role": "admin"})
        return {"access_token": token, "token_type": "bearer", "user": admin_user}

    user = db.query(User).filter(User.email == clean_email, User.role == "customer").first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}

@app.post("/api/auth/admin-login", response_model=TokenResponse)
def admin_login(user_in: UserLogin, db: Session = Depends(get_db)):
    clean_email = user_in.email.lower()
    if clean_email != ADMIN_EMAIL.lower():
        raise HTTPException(
            status_code=403,
            detail="Access restricted. Invalid administrator credentials or unauthorized email."
        )

    if user_in.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid administrator password")

    admin_user = db.query(User).filter(User.email == ADMIN_EMAIL.lower()).first()
    if not admin_user:
        admin_user = User(
            id="user-admin-corner",
            email=ADMIN_EMAIL.lower(),
            hashed_password=get_password_hash(ADMIN_PASSWORD),
            full_name="Executive Chef & Admin",
            phone="+91 98765 43210",
            role="admin"
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

    token = create_access_token({"sub": admin_user.id, "email": admin_user.email, "role": "admin"})
    return {"access_token": token, "token_type": "bearer", "user": admin_user}

@app.get("/api/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# ----------------- Categories & Products -----------------
@app.get("/api/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return {"categories": categories}

@app.get("/api/products")
def get_products(category: str = None, search: str = None, sort: str = None, db: Session = Depends(get_db)):
    query = db.query(Product)
    if category and category != "all":
        query = query.filter((Product.category_id == category) | (Product.slug.contains(category)))
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%") | Product.description.ilike(f"%{search}%"))
    
    products = query.all()
    return {"products": products}

@app.get("/api/products/{product_id}")
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter((Product.id == product_id) | (Product.slug == product_id)).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"product": product}

# ----------------- Coupons & Delivery Slots -----------------
@app.get("/api/delivery-slots")
def get_delivery_slots(db: Session = Depends(get_db)):
    slots = db.query(DeliverySlot).all()
    return {"slots": slots}

@app.post("/api/coupons/validate", response_model=CouponValidateResponse)
def validate_coupon(req: CouponValidateRequest, db: Session = Depends(get_db)):
    coupon = db.query(Coupon).filter(Coupon.code == req.code.upper(), Coupon.is_active == True).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Invalid coupon code")
    if req.order_value < float(coupon.min_order_value):
        raise HTTPException(status_code=400, detail=f"Minimum order of ₹{coupon.min_order_value} required")

    discount = round((req.order_value * coupon.discount_percentage) / 100)
    if discount > float(coupon.max_discount):
        discount = float(coupon.max_discount)

    return {
        "valid": True,
        "code": coupon.code,
        "discount_amount": discount,
        "discount_percentage": coupon.discount_percentage
    }

# ----------------- Admin Stats -----------------
@app.get("/api/admin/stats")
def admin_stats(current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    orders = db.query(Order).all()
    total_sales = sum([float(o.grand_total) for o in orders])
    total_orders = len(orders)
    pending_orders = len([o for o in orders if o.order_status in ["Pending", "Confirmed", "Preparing"]])
    low_stock = db.query(Product).filter(Product.stock <= 10).all()

    return {
        "totalSales": total_sales,
        "totalOrders": total_orders,
        "pendingOrders": pending_orders,
        "lowStockCount": len(low_stock),
        "lowStockProducts": low_stock
    }
