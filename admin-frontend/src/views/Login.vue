<template>
  <div class="login-page">
    <a-card class="login-card" title="SkyTrip 管理后台" bordered>
      <a-form layout="vertical" @submit.prevent="handleSubmit">
        <a-form-item label="用户名">
          <a-input v-model:value="form.username" placeholder="输入管理员账号" />
        </a-form-item>
        <a-form-item label="密码">
          <a-input-password v-model:value="form.password" placeholder="输入密码" />
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
  background: radial-gradient(circle at top, #e0f2fe, #f8fafc 60%);
}
.login-card {
  width: 380px;
}
.login-actions {
  margin-top: 16px;
  text-align: center;
}
</style>

