<template>
  <div class="register-page">
    <a-card class="register-card" title="SkyTrip 用户注册" bordered>
      <a-form layout="vertical" @submit.prevent="handleSubmit">
        <a-form-item label="用户名">
          <a-input 
            v-model:value="form.username" 
            placeholder="请输入用户名（3-50个字符）" 
            :maxlength="50"
          />
        </a-form-item>
        <a-form-item label="密码">
          <a-input-password 
            v-model:value="form.password" 
            placeholder="请输入密码（至少6个字符，包含字母和数字）" 
            :maxlength="50"
          />
          <div v-if="form.password && !isPasswordStrong(form.password)" class="validation-tip">
            密码强度较弱，建议包含字母和数字
          </div>
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input 
            v-model:value="form.email" 
            placeholder="请输入邮箱（选填）" 
          />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input 
            v-model:value="form.phone" 
            placeholder="请输入手机号（选填）" 
          />
        </a-form-item>
        <a-form-item label="真实姓名" required>
          <a-input 
            v-model:value="form.real_name" 
            placeholder="请输入真实姓名" 
          />
        </a-form-item>
        <a-form-item label="身份证号" required>
          <a-input 
            v-model:value="form.id_card" 
            placeholder="请输入18位身份证号" 
            :maxlength="18"
          />
        </a-form-item>
        <a-button type="primary" block :loading="loading" @click="handleSubmit">
          注册
        </a-button>
        <div class="register-actions">
          <a-button text @click="router.push('/login')">
            已有账号？立即登录
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
import { registerApi } from "@/api/auth";

const router = useRouter();
const loading = ref(false);

const form = reactive({
  username: "",
  password: "",
  email: "",
  phone: "",
  real_name: "",
  id_card: ""
});

// 密码强度检查
const isPasswordStrong = (password: string): boolean => {
  // 至少包含字母和数字
  return /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
};

// 身份证号验证函数
const validateIdCard = (idCard: string): boolean => {
  // 18位身份证号正则
  const reg = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  if (!reg.test(idCard)) {
    return false;
  }
  
  // 校验码验证
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(idCard[i]) * weights[i];
  }
  
  const checkCode = checkCodes[sum % 11];
  return idCard[17].toUpperCase() === checkCode;
};

const handleSubmit = async () => {
  // 表单基本验证
  if (!form.username || form.username.length < 3) {
    return message.warning("用户名至少需要3个字符");
  }
  if (!form.password || form.password.length < 6) {
    return message.warning("密码至少需要6个字符");
  }
  if (!isPasswordStrong(form.password)) {
    return message.warning("密码必须包含字母和数字");
  }
  if (!form.real_name) {
    return message.warning("请输入真实姓名");
  }
  if (!form.id_card || form.id_card.length !== 18 || !validateIdCard(form.id_card)) {
    return message.warning("请输入有效的18位身份证号");
  }
  
  // 邮箱格式验证
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    return message.warning("请输入有效的邮箱地址");
  }
  
  // 手机号格式验证
  if (form.phone && !/^1[3-9]\d{9}$/.test(form.phone)) {
    return message.warning("请输入有效的手机号");
  }
  
  loading.value = true;
  try {
    await registerApi(form);
    message.success("注册成功，请登录");
    router.push("/login");
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "注册失败");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #e0f2fe, #f8fafc 60%);
  padding: 20px;
}
.register-card {
  width: 420px;
}
.register-actions {
  margin-top: 16px;
  text-align: center;
}
.validation-tip {
  color: #faad14;
  font-size: 12px;
  margin-top: 4px;
}

</style>