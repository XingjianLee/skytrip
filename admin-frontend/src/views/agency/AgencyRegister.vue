<template>
  <div class="login-page">
    <a-card class="login-card" title="旅行社注册" bordered>
      <a-form layout="vertical" @submit.prevent="handleSubmit">
        <a-form-item label="账号" required>
          <a-input v-model:value="form.username" placeholder="请输入账号（3-50字符）" />
        </a-form-item>
        <a-form-item label="密码" required>
          <a-input-password v-model:value="form.password" placeholder="请输入密码（至少6位）" />
        </a-form-item>
        <a-form-item label="真实姓名" required>
          <a-input v-model:value="form.real_name" placeholder="请输入真实姓名" />
        </a-form-item>
        <a-form-item label="身份证号" required>
          <a-input v-model:value="form.id_card" maxlength="18" placeholder="请输入18位身份证号" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="邮箱">
              <a-input v-model:value="form.email" placeholder="可选" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="手机号">
              <a-input v-model:value="form.phone" placeholder="可选" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-divider>旅行社信息</a-divider>
        <a-form-item label="旅行社名称" required>
          <a-input v-model:value="form.agency_name" placeholder="请输入旅行社全称" />
        </a-form-item>
        <a-form-item label="营业执照号" required>
          <a-input v-model:value="form.business_license" placeholder="请输入营业执照注册号" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="旅行社联系电话">
              <a-input v-model:value="form.contact_phone" placeholder="可选" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="旅行社地址">
              <a-input v-model:value="form.address" placeholder="可选" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" block :loading="loading" @click="handleSubmit">
          注册并登录</a-button>
        <div class="login-actions">
          <a-button text @click="router.push('/agency/login')">
            已有账号？去登录
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
import http from "@/api/http";

const router = useRouter();
const loading = ref(false);

const form = reactive({
  username: "",
  password: "",
  email: "",
  phone: "",
  real_name: "",
  id_card: "",
  agency_name: "",
  business_license: "",
  contact_phone: "",
  address: "",
});

const handleSubmit = async () => {
  if (!form.username || !form.password || !form.real_name || !form.id_card || !form.agency_name || !form.business_license) {
    return message.warning("请填写必填信息");
  }
  loading.value = true;
  try {
    const response: any = await http.post("/api/v1/agency/register", {
      ...form,
    });
    const token = response.access_token;
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", "agency");
    message.success("注册成功，已登录");
    router.push("/agency/dashboard");
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "注册失败");
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
  width: 640px;
  max-width: 94vw;
  box-shadow: var(--shadow-2xl);
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--bg-glass);
  backdrop-filter: var(--blur-lg);
  -webkit-backdrop-filter: var(--blur-lg);
  border: 1px solid rgba(255, 255, 255, 0.18);
  position: relative;
  z-index: 1;
  animation: fadeIn var(--transition-slow);
}

.login-actions {
  margin-top: 16px;
  text-align: center;
}

::deep(.ant-card-head) {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  color: white;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0 !important;
  border: none;
  position: relative;
  overflow: hidden;
}

::deep(.ant-card-head::before) {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 3s infinite;
}

::deep(.ant-card-head-title) {
  color: white;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
}

::deep(.ant-btn-primary) {
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

::deep(.ant-btn-primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px -10px rgba(6, 182, 212, 0.4);
  filter: brightness(1.1);
}

::deep(.ant-form-item) {
  margin-bottom: 16px;
}

::deep(.ant-input),
::deep(.ant-input-password),
::deep(.ant-select-selector) {
  height: 44px;
  display: flex;
  align-items: center;
}

::deep(.ant-input-affix-wrapper) {
  height: 44px;
  display: flex;
  align-items: center;
}

::deep(.ant-input-affix-wrapper .ant-input),
::deep(.ant-input-affix-wrapper input) {
  height: 100%;
  line-height: 42px;
  padding: 0;
  border: none;
  background: transparent;
}

::deep(.ant-input),
::deep(.ant-input-password input) {
  line-height: 42px;
  height: 100%;
}

::deep(.ant-input-password) {
  display: flex;
  align-items: center;
}

::deep(.ant-form-item-label > label) {
  font-weight: 600;
}
</style>
