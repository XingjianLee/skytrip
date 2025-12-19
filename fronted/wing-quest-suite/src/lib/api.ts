export interface BackendSearchRequest {
  departure_city: string;
  arrival_city: string;
  departure_date: string;
  adult_count?: number;
  cabin_class?: string; // economy | business | first
  price_min?: number;
  price_max?: number;
}

export async function searchFlights(request: BackendSearchRequest) {
  const res = await fetch("http://localhost:8000/api/v1/flights/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json();
}

// ===== Orders APIs =====
export interface CreateOrderItem {
  flight_id: number;
  cabin_class: "economy" | "business" | "first";
  passenger_info: {
    name: string;
    id_card: string;
    contact_phone: string;
    gender?: string;
    nationality?: string;
    birthday?: string;
  };
}

export interface CreateOrderRequest {
  items: CreateOrderItem[];
  payment_method?: "alipay" | "wechat" | "unionpay" | "credit_card" | "offline";
  contact_name?: string;
  contact_email?: string;
}

// ===== Flight Pricing API =====
export interface FlightPricing {
  pricing_id: number;
  flight_id: number;
  cabin_class: "economy" | "business" | "first";
  base_price: number;
}

export async function getFlightPricing(flight_id: number) {
  const url = `http://localhost:8000/api/v1/flights/${flight_id}/pricing`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json() as Promise<FlightPricing[]>;
}

export async function createOrder(payload: CreateOrderRequest, token: string) {
  const res = await fetch("http://localhost:8000/api/v1/orders/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function payOrder(order_id: number, token: string) {
  const url = `http://localhost:8000/api/v1/orders/${order_id}/payment?payment_status=paid`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json();
}

// ===== Auth & User APIs (keep existing exports used across the app) =====
export async function login(username: string, password: string) {
  const body = new URLSearchParams();
  body.set("username", username);
  body.set("password", password);
  const res = await fetch("http://localhost:8000/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function register(payload: {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  real_name: string;
  id_card: string;
}) {
  const res = await fetch("http://localhost:8000/api/v1/users/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function getMe(token: string) {
  const res = await fetch("http://localhost:8000/api/v1/users/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function updateMe(payload: any, token: string) {
  const res = await fetch("http://localhost:8000/api/v1/users/me", {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json();
}

// ===== Flight Availability API =====
export interface FlightAvailability {
  flight_id: number;
  flight_date: string; // ISO date string
  cabin_class: "economy" | "business" | "first";
  available_seats: number;
}

export async function getFlightAvailability(flight_id: number, flight_date: string) {
  const url = `http://localhost:8000/api/v1/flights/${flight_id}/availability?flight_date=${encodeURIComponent(flight_date)}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json() as Promise<FlightAvailability[]>;
}

export interface OrderStats {
  total_orders: number;
  unpaid_count: number;
  paid_count: number;
  completed_count: number;
  cancelled_count: number;
  total_spent: number;
}

export async function getOrderStats(token: string) {
  const res = await fetch("http://localhost:8000/api/v1/orders/stats/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json() as Promise<OrderStats>;
}

export async function getCancelPreview(order_id: number, flight_date: string, token: string) {
  const url = `http://localhost:8000/api/v1/orders/${order_id}/cancel/preview?flight_date=${encodeURIComponent(flight_date)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json() as Promise<{ penalty_total: number; refund_total: number; items: { item_id: number; paid_price: number; penalty: number; refund: number; }[] }>;
}

export async function cancelOrder(order_id: number, flight_date: string, token: string) {
  const url = `http://localhost:8000/api/v1/orders/${order_id}/cancel?flight_date=${encodeURIComponent(flight_date)}`;
  const res = await fetch(url, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function updateOrderItemDate(item_id: number, flight_date: string, token: string) {
  const url = `http://localhost:8000/api/v1/orders/items/${item_id}/date?flight_date=${encodeURIComponent(flight_date)}`;
  const res = await fetch(url, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function updateOrderItemChange(item_id: number, flight_id: number, cabin_class: "economy" | "business" | "first", flight_date: string, token: string) {
  const url = `http://localhost:8000/api/v1/orders/items/${item_id}/change?flight_id=${flight_id}&cabin_class=${encodeURIComponent(cabin_class)}&flight_date=${encodeURIComponent(flight_date)}`;
  const res = await fetch(url, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function updateCheckIn(item_id: number, seat_number: string, token: string) {
  const url = `http://localhost:8000/api/v1/orders/items/${item_id}/check-in?check_in_status=checked&seat_number=${encodeURIComponent(seat_number)}`;
  const res = await fetch(url, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json();
}

// ===== Orders list (with items) =====
export interface BackendOrderItem {
  item_id: number;
  order_id: number;
  flight_id: number;
  cabin_class: "economy" | "business" | "first";
  passenger_id: number;
  original_price: number;
  paid_price: number;
  flight_date?: string;
  seat_number?: string | null;
  contact_email?: string | null;
  check_in_status: "not_checked" | "checked";
  ticket_status: "confirmed" | "cancelled";
  passenger?: { name: string; id_card: string };
  flight?: {
    flight_number: string;
    scheduled_departure_time: string;
    scheduled_arrival_time: string;
    airline?: { airline_name: string };
    route?: {
      departure_airport?: { city: string; airport_code: string };
      arrival_airport?: { city: string; airport_code: string };
    };
  };
}

export interface BackendOrder {
  order_id: number;
  order_no: string;
  user_id: number;
  total_amount_original: number;
  total_amount: number;
  currency: string;
  payment_method: "alipay" | "wechat" | "unionpay" | "credit_card" | "offline";
  payment_status: "unpaid" | "paid" | "refunded" | "failed";
  paid_at?: string | null;
  status: "pending" | "paid" | "cancelled" | "completed";
  created_at: string;
  expired_at?: string | null;
  contact_name?: string | null;
  items: BackendOrderItem[];
}

export async function getOrders(token: string, params?: { status?: string; payment_status?: string; skip?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.payment_status) qs.set("payment_status", params.payment_status);
  if (params?.skip != null) qs.set("skip", String(params.skip));
  if (params?.limit != null) qs.set("limit", String(params.limit));
  const url = `http://localhost:8000/api/v1/orders/${qs.toString() ? `?${qs.toString()}` : ""}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json() as Promise<BackendOrder[]>;
}

export async function getOrderById(order_id: number, token: string) {
  const url = `http://localhost:8000/api/v1/orders/${order_id}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json() as Promise<BackendOrder>;
}

export interface AISuggestion {
  label: string;
  route?: string;
  params?: Record<string, unknown>;
}

export interface AIOrderSummary {
  order_id: number;
  order_no: string;
  status: string;
  payment_status: string;
  total: number;
}

export interface AIChatResponse {
  reply: string;
  suggestions?: AISuggestion[];
  orders?: AIOrderSummary[];
}

export async function postAIChat(payload: { message: string }, token: string): Promise<AIChatResponse> {
  const res = await fetch("http://localhost:8000/api/v1/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json() as Promise<AIChatResponse>;
}

export async function streamAIChat(
  payload: { message: string },
  token: string,
  handlers: { onDelta: (text: string) => void; onFinal: (data: { suggestions?: AISuggestion[]; orders?: AIOrderSummary[] }) => void; onEvent?: (evt: { type: string; data: any }) => void },
  signal?: AbortSignal
) {
  const res = await fetch("http://localhost:8000/api/v1/ai/chat/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, Accept: "text/event-stream" },
    body: JSON.stringify(payload),
    signal,
  });
  if (!res.ok || !res.body) {
    const errText = await res.text().catch(() => "");
    throw new Error(errText || `HTTP ${res.status}`);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";
    for (const part of parts) {
      const lines = part.split("\n");
      let eventType: string | null = null;
      for (const line of lines) {
        if (line.startsWith("event:")) eventType = line.slice(6).trim();
        if (line.startsWith("data:")) {
          const dataStr = line.slice(5).trim();
          try {
            const data = JSON.parse(dataStr);
            if (eventType === "final") {
              handlers.onFinal({ suggestions: data.suggestions || [], orders: data.orders || [] });
            } else if (eventType && handlers.onEvent) {
              handlers.onEvent({ type: eventType, data });
            } else if (typeof data.delta === "string") {
              handlers.onDelta(data.delta);
            }
          } catch { void 0 }
        }
      }
    }
  }
}
