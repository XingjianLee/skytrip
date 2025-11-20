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
  const res = await fetch("http://0.0.0.0:8000/api/v1/flights/search", {
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
  const url = `http://0.0.0.0:8000/api/v1/flights/${flight_id}/pricing`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json() as Promise<FlightPricing[]>;
}

export async function createOrder(payload: CreateOrderRequest, token: string) {
  const res = await fetch("http://0.0.0.0:8000/api/v1/orders/", {
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
  const url = `http://0.0.0.0:8000/api/v1/orders/${order_id}/payment?payment_status=paid`;
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
  const res = await fetch("http://0.0.0.0:8000/api/v1/auth/login", {
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
  const res = await fetch("http://0.0.0.0:8000/api/v1/users/", {
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
  const res = await fetch("http://0.0.0.0:8000/api/v1/users/me", {
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
  const res = await fetch("http://0.0.0.0:8000/api/v1/users/me", {
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
  const url = `http://0.0.0.0:8000/api/v1/flights/${flight_id}/availability?flight_date=${encodeURIComponent(flight_date)}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json() as Promise<FlightAvailability[]>;
}