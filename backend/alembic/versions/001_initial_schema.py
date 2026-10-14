"""Initial schema for The Baker's Corner

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-10-13 12:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(50), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(50), nullable=True),
        sa.Column('role', sa.String(20), default='customer'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )

    # Categories table
    op.create_table(
        'categories',
        sa.Column('id', sa.String(50), primary_key=True),
        sa.Column('name', sa.String(100), nullable=False, unique=True),
        sa.Column('slug', sa.String(100), nullable=False, unique=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('image', sa.String(500), nullable=True),
    )

    # Products table
    op.create_table(
        'products',
        sa.Column('id', sa.String(50), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('slug', sa.String(255), nullable=False, unique=True),
        sa.Column('category_id', sa.String(50), sa.ForeignKey('categories.id'), nullable=False),
        sa.Column('base_price', sa.Numeric(10, 2), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('image', sa.String(500), nullable=False),
        sa.Column('gallery_images', sa.JSON(), nullable=True),
        sa.Column('supported_weights', sa.JSON(), nullable=True),
        sa.Column('supported_flavours', sa.JSON(), nullable=True),
        sa.Column('supports_eggless', sa.Boolean(), default=True),
        sa.Column('stock', sa.Integer(), default=20),
        sa.Column('is_bestseller', sa.Boolean(), default=False),
        sa.Column('is_special', sa.Boolean(), default=False),
        sa.Column('rating', sa.Numeric(3, 1), default=5.0),
        sa.Column('review_count', sa.Integer(), default=0),
    )

    # Orders table
    op.create_table(
        'orders',
        sa.Column('id', sa.String(50), primary_key=True),
        sa.Column('order_number', sa.String(50), nullable=False, unique=True),
        sa.Column('user_id', sa.String(50), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('customer_name', sa.String(255), nullable=False),
        sa.Column('customer_email', sa.String(255), nullable=False),
        sa.Column('customer_phone', sa.String(50), nullable=False),
        sa.Column('street_address', sa.Text(), nullable=False),
        sa.Column('apartment', sa.String(255), nullable=True),
        sa.Column('city', sa.String(100), nullable=False),
        sa.Column('state', sa.String(100), nullable=False),
        sa.Column('pincode', sa.String(20), nullable=False),
        sa.Column('subtotal', sa.Numeric(10, 2), nullable=False),
        sa.Column('discount_amount', sa.Numeric(10, 2), default=0.0),
        sa.Column('coupon_code', sa.String(50), nullable=True),
        sa.Column('delivery_fee', sa.Numeric(10, 2), default=0.0),
        sa.Column('tax_amount', sa.Numeric(10, 2), default=0.0),
        sa.Column('grand_total', sa.Numeric(10, 2), nullable=False),
        sa.Column('payment_method', sa.String(30), nullable=False),
        sa.Column('payment_status', sa.String(30), default='Pending'),
        sa.Column('order_status', sa.String(30), default='Pending'),
        sa.Column('delivery_date', sa.String(30), nullable=False),
        sa.Column('delivery_time_slot', sa.String(100), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
    )

    # Order items table
    op.create_table(
        'order_items',
        sa.Column('id', sa.String(100), primary_key=True),
        sa.Column('order_id', sa.String(50), sa.ForeignKey('orders.id'), nullable=False),
        sa.Column('product_id', sa.String(50), nullable=False),
        sa.Column('product_name', sa.String(255), nullable=False),
        sa.Column('product_image', sa.String(500), nullable=False),
        sa.Column('unit_price', sa.Numeric(10, 2), nullable=False),
        sa.Column('quantity', sa.Integer(), default=1),
        sa.Column('item_subtotal', sa.Numeric(10, 2), nullable=False),
        sa.Column('occasion', sa.String(50), nullable=False),
        sa.Column('weight', sa.String(20), nullable=False),
        sa.Column('flavour', sa.String(100), nullable=False),
        sa.Column('is_eggless', sa.Boolean(), default=False),
        sa.Column('has_message', sa.Boolean(), default=False),
        sa.Column('cake_message', sa.String(60), nullable=True),
        sa.Column('photo_url', sa.Text(), nullable=True),
        sa.Column('special_instructions', sa.Text(), nullable=True),
    )

def downgrade() -> None:
    op.drop_table('order_items')
    op.drop_table('orders')
    op.drop_table('products')
    op.drop_table('categories')
    op.drop_table('users')
