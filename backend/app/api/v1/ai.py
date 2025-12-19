from typing import List, Dict, Any
import os
import time
import json
from starlette.responses import StreamingResponse
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import dependencies as deps
from app import crud, schemas
from app.models.order import PaymentStatus as ModelPaymentStatus, OrderStatus as ModelOrderStatus, CheckInStatus as ModelCheckInStatus, OrderItem as ModelOrderItem
from app.services import llm_client


router = APIRouter()

_MIN_INTERVAL = int(os.getenv("AI_MIN_INTERVAL_SECONDS", "0") or "0")
_LAST_REQ_AT: dict[int, float] = {}
_ALLOWED_ROUTES = set((os.getenv("AI_ALLOWED_ROUTES", "/my-orders,/payment,/check-in,/book-flight,/cancel-order") or "").split(","))
_ALLOWED_TOOLS = set((os.getenv("AI_ALLOWED_TOOLS", "get_my_orders,get_order_by_no,get_order_stats,search_flights") or "").split(","))


@router.post("/chat", response_model=schemas.AIChatResponse)
def chat(
    *,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
    req: schemas.AIChatRequest,
):
    if _MIN_INTERVAL > 0:
        now = time.time()
        last = _LAST_REQ_AT.get(current_user.id, 0.0)
        if now - last < _MIN_INTERVAL:
            return schemas.AIChatResponse(reply="请求过于频繁，请稍后再试。")
        _LAST_REQ_AT[current_user.id] = now
    reply, ok = llm_client.chat(req.message)
    plan: Dict[str, Any] = llm_client.plan(req.message)
    suggestions: List[schemas.AISuggestion] = []
    msg = req.message
    m = msg.lower()
    if ("订单" in msg) or ("order" in m):
        if "/my-orders" in _ALLOWED_ROUTES:
            suggestions.append(schemas.AISuggestion(label="查看我的订单", route="/my-orders"))
    if ("支付" in msg) or ("付款" in msg) or ("pay" in m):
        if "/payment" in _ALLOWED_ROUTES:
            suggestions.append(schemas.AISuggestion(label="支付订单", route="/payment"))
    if ("值机" in msg) or ("选座" in msg) or ("check-in" in m):
        if "/check-in" in _ALLOWED_ROUTES:
            suggestions.append(schemas.AISuggestion(label="在线值机", route="/check-in"))
    if ("机票" in msg) or ("航班" in msg) or ("搜索" in msg) or ("flight" in m):
        if "/book-flight" in _ALLOWED_ROUTES:
            suggestions.append(schemas.AISuggestion(label="搜索航班", route="/book-flight"))
    orders = crud.order.get_user_orders_with_items(db, user_id=current_user.id, skip=0, limit=20)
    res_orders: List[schemas.AIOrderSummary] = []
    for o in orders[:3]:
        total = float(getattr(o, "total_amount", 0))
        status = getattr(o.status, "value", str(o.status))
        pstatus = getattr(o.payment_status, "value", str(o.payment_status))
        res_orders.append(
            schemas.AIOrderSummary(
                order_id=o.order_id,
                order_no=o.order_no,
                status=status,
                payment_status=pstatus,
                total=total,
            )
        )
    if ("支付" in msg) or ("付款" in msg) or ("pay" in m):
        target = next((x for x in orders if getattr(x.payment_status, "value", str(x.payment_status)) == ModelPaymentStatus.UNPAID.value and getattr(x.status, "value", str(x.status)) == ModelOrderStatus.PENDING.value), None)
        if target:
            idx = next((i for i, s in enumerate(suggestions) if s.label == "支付订单"), None)
            payload = {"orderData": {"orderId": target.order_id, "orderNo": target.order_no, "total": float(getattr(target, "total_amount", 0))}}
            if idx is not None:
                suggestions[idx] = schemas.AISuggestion(label="支付订单", route="/payment", params=payload)
            else:
                suggestions.append(schemas.AISuggestion(label="支付订单", route="/payment", params=payload))
    if ("取消" in msg) or ("退票" in msg) or ("cancel" in m):
        target = next((x for x in orders if getattr(x.status, "value", str(x.status)) in [ModelOrderStatus.PENDING.value, ModelOrderStatus.PAID.value]), None)
        if target:
            suggestions.append(schemas.AISuggestion(label="取消订单", route="/cancel-order", params={"orderId": target.order_id}))
    if ("值机" in msg) or ("选座" in msg) or ("check-in" in m):
        oi = None
        for o in orders:
            oi = next((it for it in (o.items or []) if getattr(it.check_in_status, "value", str(it.check_in_status)) == ModelCheckInStatus.NOT_CHECKED.value), None)
            if oi:
                break
        if oi:
            idx = next((i for i, s in enumerate(suggestions) if s.label == "在线值机"), None)
            payload = {"orderId": oi.order_id}
            if idx is not None:
                suggestions[idx] = schemas.AISuggestion(label="在线值机", route="/check-in", params=payload)
            else:
                suggestions.append(schemas.AISuggestion(label="在线值机", route="/check-in", params=payload))
    # Execute tools from plan
    actions = plan.get("actions") or []
    for act in actions:
        tool = str(act.get("tool") or "")
        args = act.get("args") or {}
        if tool not in _ALLOWED_TOOLS:
            continue
        if tool == "get_my_orders":
            lim = int(args.get("limit") or 3)
            user_orders = crud.order.get_user_orders_with_items(db, user_id=current_user.id, skip=0, limit=lim)
            for o in user_orders:
                total = float(getattr(o, "total_amount", 0))
                status = getattr(o.status, "value", str(o.status))
                pstatus = getattr(o.payment_status, "value", str(o.payment_status))
                res_orders.append(schemas.AIOrderSummary(order_id=o.order_id, order_no=o.order_no, status=status, payment_status=pstatus, total=total))
        elif tool == "get_order_by_no":
            on = str(args.get("order_no") or "").strip()
            if on:
                o = crud.order.get_by_order_no(db, order_no=on)
                if o and o.user_id == current_user.id:
                    o2 = crud.order.get_with_items(db, order_id=o.order_id) or o
                    total = float(getattr(o2, "total_amount", 0))
                    status = getattr(o2.status, "value", str(o2.status))
                    pstatus = getattr(o2.payment_status, "value", str(o2.payment_status))
                    res_orders.append(schemas.AIOrderSummary(order_id=o2.order_id, order_no=o2.order_no, status=status, payment_status=pstatus, total=total))
                    if "/my-orders" in _ALLOWED_ROUTES:
                        suggestions.append(schemas.AISuggestion(label="查看订单详情", route="/my-orders"))
        elif tool == "get_order_stats":
            # Summarize counts from user's orders
            unpaid = sum(1 for x in orders if getattr(x.payment_status, "value", str(x.payment_status)) == ModelPaymentStatus.UNPAID.value)
            paid = sum(1 for x in orders if getattr(x.payment_status, "value", str(x.payment_status)) == ModelPaymentStatus.PAID.value)
            completed = sum(1 for x in orders if getattr(x.status, "value", str(x.status)) == ModelOrderStatus.COMPLETED.value)
            # Embed into reply
            reply = f"{reply}\n您共有{len(orders)}个订单，已支付{paid}，未支付{unpaid}，已完成{completed}。"
        elif tool == "search_flights":
            # Provide navigation suggestion only for now
            if "/book-flight" in _ALLOWED_ROUTES:
                suggestions.append(schemas.AISuggestion(label="搜索航班", route="/book-flight", params=args))
    return schemas.AIChatResponse(reply=reply, suggestions=suggestions or None, orders=res_orders or None)


@router.post("/chat/stream")
def chat_stream(
    *,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
    req: schemas.AIChatRequest,
):
    if _MIN_INTERVAL > 0:
        now = time.time()
        last = _LAST_REQ_AT.get(current_user.id, 0.0)
        if now - last < _MIN_INTERVAL:
            def sse_err():
                yield "event: error\n" + "data: {\"error\":\"RATE_LIMIT\",\"detail\":\"too many requests\"}\n\n"
            return StreamingResponse(sse_err(), media_type="text/event-stream")
        _LAST_REQ_AT[current_user.id] = now
    def sse():
        for c in llm_client.chat_stream(req.message):
            yield "data: " + json.dumps({"delta": c}, ensure_ascii=False) + "\n\n"
        # Planning
        plan = llm_client.plan(req.message)
        yield "event: tool_plan\n" + "data: " + json.dumps(plan, ensure_ascii=False) + "\n\n"
        suggestions: List[schemas.AISuggestion] = []
        msg = req.message
        m = msg.lower()
        if ("订单" in msg) or ("order" in m):
            if "/my-orders" in _ALLOWED_ROUTES:
                suggestions.append(schemas.AISuggestion(label="查看我的订单", route="/my-orders"))
        if ("支付" in msg) or ("付款" in msg) or ("pay" in m):
            if "/payment" in _ALLOWED_ROUTES:
                suggestions.append(schemas.AISuggestion(label="支付订单", route="/payment"))
        if ("值机" in msg) or ("选座" in msg) or ("check-in" in m):
            if "/check-in" in _ALLOWED_ROUTES:
                suggestions.append(schemas.AISuggestion(label="在线值机", route="/check-in"))
        if ("机票" in msg) or ("航班" in msg) or ("搜索" in msg) or ("flight" in m):
            if "/book-flight" in _ALLOWED_ROUTES:
                suggestions.append(schemas.AISuggestion(label="搜索航班", route="/book-flight"))
        orders = crud.order.get_user_orders_with_items(db, user_id=current_user.id, skip=0, limit=20)
        res_orders: List[schemas.AIOrderSummary] = []
        for o in orders[:3]:
            total = float(getattr(o, "total_amount", 0))
            status = getattr(o.status, "value", str(o.status))
            pstatus = getattr(o.payment_status, "value", str(o.payment_status))
            res_orders.append(
                schemas.AIOrderSummary(
                    order_id=o.order_id,
                    order_no=o.order_no,
                    status=status,
                    payment_status=pstatus,
                    total=total,
                )
            )
        if ("支付" in msg) or ("付款" in msg) or ("pay" in m):
            target = next((x for x in orders if getattr(x.payment_status, "value", str(x.payment_status)) == ModelPaymentStatus.UNPAID.value and getattr(x.status, "value", str(x.status)) == ModelOrderStatus.PENDING.value), None)
            if target:
                idx = next((i for i, s in enumerate(suggestions) if s.label == "支付订单"), None)
                payload = {"orderData": {"orderId": target.order_id, "orderNo": target.order_no, "total": float(getattr(target, "total_amount", 0))}}
                if idx is not None:
                    suggestions[idx] = schemas.AISuggestion(label="支付订单", route="/payment", params=payload)
                else:
                    suggestions.append(schemas.AISuggestion(label="支付订单", route="/payment", params=payload))
        if ("取消" in msg) or ("退票" in msg) or ("cancel" in m):
            target = next((x for x in orders if getattr(x.status, "value", str(x.status)) in [ModelOrderStatus.PENDING.value, ModelOrderStatus.PAID.value]), None)
            if target:
                suggestions.append(schemas.AISuggestion(label="取消订单", route="/cancel-order", params={"orderId": target.order_id}))
        if ("值机" in msg) or ("选座" in msg) or ("check-in" in m):
            oi = None
            for o in orders:
                oi = next((it for it in (o.items or []) if getattr(it.check_in_status, "value", str(it.check_in_status)) == ModelCheckInStatus.NOT_CHECKED.value), None)
                if oi:
                    break
            if oi:
                idx = next((i for i, s in enumerate(suggestions) if s.label == "在线值机"), None)
                payload = {"orderId": oi.order_id}
                if idx is not None:
                    suggestions[idx] = schemas.AISuggestion(label="在线值机", route="/check-in", params=payload)
                else:
                    suggestions.append(schemas.AISuggestion(label="在线值机", route="/check-in", params=payload))
        # Execute tools (same as sync)
        actions = plan.get("actions") or []
        for act in actions:
            tool = str(act.get("tool") or "")
            args = act.get("args") or {}
            if tool not in _ALLOWED_TOOLS:
                continue
            if tool == "get_my_orders":
                lim = int(args.get("limit") or 3)
                user_orders = crud.order.get_user_orders_with_items(db, user_id=current_user.id, skip=0, limit=lim)
                for o in user_orders:
                    total = float(getattr(o, "total_amount", 0))
                    status = getattr(o.status, "value", str(o.status))
                    pstatus = getattr(o.payment_status, "value", str(o.payment_status))
                    res_orders.append(schemas.AIOrderSummary(order_id=o.order_id, order_no=o.order_no, status=status, payment_status=pstatus, total=total))
                yield "event: tool_result\n" + "data: " + json.dumps({"tool": tool, "orders": [x.model_dump() for x in res_orders]}, ensure_ascii=False) + "\n\n"
            elif tool == "get_order_by_no":
                on = str(args.get("order_no") or "").strip()
                if on:
                    o = crud.order.get_by_order_no(db, order_no=on)
                    if o and o.user_id == current_user.id:
                        o2 = crud.order.get_with_items(db, order_id=o.order_id) or o
                        total = float(getattr(o2, "total_amount", 0))
                        status = getattr(o2.status, "value", str(o2.status))
                        pstatus = getattr(o2.payment_status, "value", str(o2.payment_status))
                        res_orders.append(schemas.AIOrderSummary(order_id=o2.order_id, order_no=o2.order_no, status=status, payment_status=pstatus, total=total))
                        yield "event: tool_result\n" + "data: " + json.dumps({"tool": tool, "orders": [x.model_dump() for x in res_orders[-1:]]}, ensure_ascii=False) + "\n\n"
                        if "/my-orders" in _ALLOWED_ROUTES:
                            suggestions.append(schemas.AISuggestion(label="查看订单详情", route="/my-orders"))
            elif tool == "get_order_stats":
                unpaid = sum(1 for x in orders if getattr(x.payment_status, "value", str(x.payment_status)) == ModelPaymentStatus.UNPAID.value)
                paid = sum(1 for x in orders if getattr(x.payment_status, "value", str(x.payment_status)) == ModelPaymentStatus.PAID.value)
                completed = sum(1 for x in orders if getattr(x.status, "value", str(x.status)) == ModelOrderStatus.COMPLETED.value)
                yield "event: tool_result\n" + "data: " + json.dumps({"tool": tool, "stats": {"total": len(orders), "paid": paid, "unpaid": unpaid, "completed": completed}}, ensure_ascii=False) + "\n\n"
            elif tool == "search_flights":
                if "/book-flight" in _ALLOWED_ROUTES:
                    suggestions.append(schemas.AISuggestion(label="搜索航班", route="/book-flight", params=args))
                yield "event: tool_result\n" + "data: " + json.dumps({"tool": tool, "params": args}, ensure_ascii=False) + "\n\n"
        final = {"event": "final", "suggestions": [s.model_dump() for s in suggestions] or None, "orders": [x.model_dump() for x in res_orders] or None}
        yield "event: final\n" + "data: " + json.dumps(final, ensure_ascii=False) + "\n\n"
    return StreamingResponse(sse(), media_type="text/event-stream")
