<template>
  <div class="login-page">
    <a-card class="login-card" title="SkyTrip 管理后台" bordered>
      <a-form layout="vertical" @submit.prevent="handleSubmit">
        <a-form-item label="用户名">
          <a-input v-model:value="form.username" placeholder="输入管理员账号">
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
        <a-button type="primary" block :loading="auth.loading" @click="handleSubmit">
          登录
        </a-button>
        <div class="login-actions">
          <a-button text @click="router.push('/register')">
            没有账号？立即注册
          </a-button>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";

const router = useRouter();
const auth = useAuthStore();

const form = reactive({
  username: "",
  password: "",
});

const handleSubmit = async () => {
  if (!form.username || !form.password) {
    return message.warning("请输入账号密码");
  }
  try {
    await auth.login(form.username, form.password);
    message.success("登录成功");
    router.push("/");
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "登录失败");
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, var(--primary-light), var(--bg-secondary) 60%);
  padding: 20px;
}
.login-card {
  width: 380px;
  box-shadow: var(--shadow-lg);
  border-radius: 12px;
  overflow: hidden;
}
.login-actions {
  margin-top: 16px;
  text-align: center;
}
/* 自定义卡片和表单样式 */
:deep(.ant-card-head) {
  background: var(--primary-color);
  color: white;
}
:deep(.ant-card-head-title) {
  color: white;
}
:deep(.ant-btn-primary) {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  border-radius: 6px;
}
:deep(.ant-btn-primary:hover) {
  background-color: var(--primary-dark) !important;
  border-color: var(--primary-dark) !important;
}
:deep(.ant-input-affix-wrapper) {
  border-radius: 6px;
}
:deep(.ant-input-affix-wrapper:hover) {
  border-color: var(--primary-light) !important;
}
:deep(.ant-input-affix-wrapper-focused) {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
}
</style>

