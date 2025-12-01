import { defineStore } from "pinia";
import { ref } from "vue";
import { loginApi } from "@/api/auth";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("token"));
  const loading = ref(false);

  const login = async (username: string, password: string) => {
    loading.value = true;
    try {
      const data = await loginApi({ username, password });
      token.value = data.access_token;
      localStorage.setItem("token", data.access_token);
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    token.value = null;
    localStorage.removeItem("token");
  };

  return { token, loading, login, logout };
});

