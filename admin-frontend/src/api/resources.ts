import http from "./http";

export const fetchFlights = () => http.get("/api/v1/flights/");
export const createFlight = (payload: any) => http.post("/api/v1/flights/", payload);
export const updateFlight = (id: number, payload: any) =>
  http.put(`/api/v1/flights/${id}`, payload);
export const deleteFlight = (id: number) => http.delete(`/api/v1/flights/${id}`);

export const fetchHotels = () => http.get("/api/v1/hotels/");
export const createHotel = (payload: any) => http.post("/api/v1/hotels/", payload);
export const updateHotel = (id: number, payload: any) =>
  http.put(`/api/v1/hotels/${id}`, payload);
export const deleteHotel = (id: number) => http.delete(`/api/v1/hotels/${id}`);

export const fetchScenicSpots = () => http.get("/api/v1/scenic-spots/");
export const createScenicSpot = (payload: any) =>
  http.post("/api/v1/scenic-spots/", payload);
export const updateScenicSpot = (id: number, payload: any) =>
  http.put(`/api/v1/scenic-spots/${id}`, payload);
export const deleteScenicSpot = (id: number) =>
  http.delete(`/api/v1/scenic-spots/${id}`);

export const fetchUsers = () => http.get("/api/v1/users/");
export const toggleUserState = (userId: number, isFrozen: boolean) =>
  http.patch(`/api/v1/users/${userId}/state`, { is_frozen: isFrozen });

export const fetchOrders = () => http.get("/api/v1/orders/");
export const updateOrder = (orderId: number, payload: any) =>
  http.put(`/api/v1/orders/${orderId}`, payload);

export const fetchNotifications = () => http.get("/api/v1/notifications/");
export const createNotification = (payload: any) =>
  http.post("/api/v1/notifications/", payload);
export const deleteNotification = (id: number) =>
  http.delete(`/api/v1/notifications/${id}`);

export const fetchFinancialReport = (params: { start_date: string; end_date: string }) =>
  http.get("/api/v1/reports/financial", { params });

export const exportFinancialReportPDF = (params: { start_date: string; end_date: string }) =>
  http.get("/api/v1/reports/financial/pdf", { params, responseType: "blob" });

