## 管理员端整体结构

```
skytrip/
├── main.py
├── requirements.txt
├── app
│   ├── api
│   │   └── v1
│   │       ├── __init__.py
│   │       ├── admin.py
│   │       ├── flights.py
│   │       ├── hotels.py
│   │       ├── notifications.py
│   │       ├── orders.py
│   │       ├── reports.py
│   │       ├── scenic_spots.py
│   │       └── users.py
│   ├── core
│   │   ├── config.py
│   │   └── security.py
│   ├── database.py
│   ├── models
│   │   ├── flight.py
│   │   ├── hotel.py
│   │   ├── notification.py
│   │   ├── order.py
│   │   ├── order_item.py
│   │   ├── scenic_spot.py
│   │   └── user.py
│   ├── schemas
│   │   ├── auth.py
│   │   ├── common.py
│   │   ├── flight.py
│   │   ├── hotel.py
│   │   ├── notification.py
│   │   ├── order.py
│   │   ├── report.py
│   │   ├── scenic_spot.py
│   │   └── user.py
│   ├── services
│   │   └── order_service.py
│   └── utils
└── sql
    └── *.sql
```

## 关键交互序列（示意）

1. **管理员登录**：`Admin` -> `POST /api/v1/admin/login` -> 校验密码、签发 JWT。
2. **航班 CRUD**：`Admin` -> `FlightsRouter` -> `FlightService/SQLAlchemy` -> `MySQL`。
3. **订单修改**：`Admin` -> `OrdersRouter` -> `OrderService`：状态机校验 -> 库存检查 -> 事务提交。
4. **财务报表**：`Admin` -> `ReportsRouter` -> 聚合查询 -> 返回统计指标。

## 模型定义摘要

| 模型 | 关键字段 | 说明 |
| --- | --- | --- |
| `User` | `role`, `is_frozen` | RBAC & 冻结控制 |
| `Flight` | `economy_seats` 等 | 提供库存基础 |
| `Hotel` | `status`, `lowest_price` | 后台维护酒店资源 |
| `ScenicSpot` | `ticket_price` | 景点资源信息 |
| `Order` | `status`, `payment_status`, `total_amount` | 订单状态机 |
| `OrderItem` | `flight_id`, `cabin_class` | 库存占用 |
| `Notification` | `target_user_id`, `created_by` | 定向/全量通知 |

## 安全与合规模块

- JWT + OAuth2 Password Flow。
- `passlib[bcrypt]` 对密码进行哈希。
- `schemas.user.UserBase` 负责手机号/身份证脱敏。
- `deps.get_current_admin` 保证 RBAC。

## 数据一致性

- `orders.py` 在更新接口中对订单行加 `SELECT ... FOR UPDATE`。
- `order_service.ensure_inventory` 依据航班座位容量与已支付订单数确保不超售。
- 状态机通过 `assert_status_transition` 防止非法流转。


