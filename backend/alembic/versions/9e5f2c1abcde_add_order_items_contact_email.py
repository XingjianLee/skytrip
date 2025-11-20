"""add order_items.contact_email

Revision ID: 9e5f2c1abcde
Revises: b1204c277bc3
Create Date: 2025-11-16 22:05:00

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '9e5f2c1abcde'
down_revision = 'b1204c277bc3'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'order_items',
        sa.Column('contact_email', sa.String(length=100), nullable=True, comment='联系邮箱（统一与订单一致）')
    )


def downgrade() -> None:
    op.drop_column('order_items', 'contact_email')