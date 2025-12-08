<template>
  <div class="login-page">
    <a-card class="login-card" title="SkyTrip 旅行社端" bordered>
      <a-form layout="vertical" @submit.prevent="handleSubmit">
        <a-form-item label="用户名">
          <a-input v-model:value="form.username" placeholder="输入旅行社账号">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="密码">
          <a-input-password v-model:value="form.password" placeholder="输入密码">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>
        <a-button type="primary" block :loading="loading" @click="handleSubmit">
          登录
        </a-button>
        <div class="login-actions">
          <a-button text @click="router.push('/agency/register')">
            没有账号？旅行社注册
          </a-button>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import http from "@/api/http";

const router = useRouter();
const loading = ref(false);

const form = reactive({
  username: "",
  password: "",
});

const handleSubmit = async () => {
  if (!form.username || !form.password) {
    return message.warning("请输入账号密码");
  }
  loading.value = true;
  try {
    const response: any = await http.post("/api/v1/agency/login", {
      username: form.username,
      password: form.password,
    });
    const token = response.access_token;
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", "agency");
    message.success("登录成功");
    router.push("/agency/dashboard");
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "登录失败");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-gradient);
  background-attachment: fixed;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-page::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

.login-card {
  width: 420px;
  box-shadow: var(--shadow-2xl);
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--bg-glass);
  backdrop-filter: var(--blur-lg);
  -webkit-backdrop-filter: var(--blur-lg);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
  animation: fadeIn var(--transition-slow);
}

.login-actions {
  margin-top: 16px;
  text-align: center;
}

:deep(.ant-card-head) {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  color: white;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0 !important;
  border: none;
  position: relative;
  overflow: hidden;
}

:deep(.ant-card-head::before) {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 3s infinite;
}

:deep(.ant-card-head-title) {
  color: white;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
}

:deep(.ant-btn-primary) {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%) !important;
  border: none !important;
  border-radius: var(--radius-lg);
  height: 44px;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 10px 25px -5px rgba(6, 182, 212, 0.3);
  transition: all var(--transition-base);
  letter-spacing: 0.5px;
}

:deep(.ant-btn-primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px -10px rgba(6, 182, 212, 0.4);
  filter: brightness(1.1);
}

:deep(.ant-input-affix-wrapper),
:deep(.ant-input) {
  border-radius: var(--radius-lg);
  height: 44px;
  border: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: var(--blur-sm);
  -webkit-backdrop-filter: var(--blur-sm);
  color: var(--text-primary);
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
}

:deep(.ant-input-affix-wrapper .ant-input),
:deep(.ant-input-affix-wrapper input) {
  height: 100%;
  line-height: 42px;
  padding: 0;
  border: none;
  background: transparent;
}

:deep(.ant-input-affix-wrapper .ant-input-prefix) {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  height: 100%;
}

:deep(.ant-input-affix-wrapper .ant-input-prefix svg) {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1;
  display: inline-block;
}

:deep(.ant-input-password) {
  display: flex;
  align-items: center;
}

:deep(.ant-input-password .ant-input) {
  height: 100%;
  line-height: 42px;
}

:deep(.ant-input-affix-wrapper:hover),
:deep(.ant-input:hover) {
  border-color: #06b6d4 !important;
  box-shadow: var(--shadow-md);
  background: rgba(255, 255, 255, 1);
}

:deep(.ant-input-affix-wrapper-focused),
:deep(.ant-input-focused) {
  border-color: #06b6d4 !important;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15) !important;
  background: rgba(255, 255, 255, 1);
}
</style>

