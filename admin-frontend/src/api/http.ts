import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8000",
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      const currentPath = window.location.pathname;
      if (currentPath.startsWith("/agency")) {
        window.location.href = "/agency/login";
      } else if (currentPath.startsWith("/admin")) {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export default http;

