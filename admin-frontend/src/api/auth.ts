import http from "./http";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  real_name: string;
  id_card: string;
}

export const loginApi = (payload: LoginPayload) =>
  http.post("/api/v1/admin/login", payload);

export const registerApi = (data: RegisterPayload) => {
  return http.post("/api/v1/admin/register", data);
};


