<template>
  <div class="register-page">
    <a-card class="register-card" title="SkyTrip 用户注册" bordered>
      <a-form layout="vertical" @submit.prevent="handleSubmit">
        <a-form-item label="用户名">
          <a-input 
            v-model:value="form.username" 
            placeholder="请输入用户名（3-50个字符）" 
            :maxlength="50"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="密码">
          <a-input-password 
            v-model:value="form.password" 
            placeholder="请输入密码（至少6个字符，包含字母和数字）" 
            :maxlength="50"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
          <div v-if="form.password && !isPasswordStrong(form.password)" class="validation-tip">
            密码强度较弱，建议包含字母和数字
          </div>
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input 
            v-model:value="form.email" 
            placeholder="请输入邮箱（选填）" 
          >
            <template #prefix>
              <MailOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="手机号">
          <a-input 
            v-model:value="form.phone" 
            placeholder="请输入手机号（选填）" 
          >
            <template #prefix>
              <PhoneOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="真实姓名" required>
          <a-input 
            v-model:value="form.real_name" 
            placeholder="请输入真实姓名" 
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="身份证号" required>
          <a-input 
            v-model:value="form.id_card" 
            placeholder="请输入18位身份证号" 
            :maxlength="18"
          >
            <template #prefix>
              <IdcardOutlined />
            </template>
          </a-input>
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
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from "@ant-design/icons-vue";

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
  background: var(--bg-gradient);
  background-attachment: fixed;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.register-page::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

.register-card {
  width: 480px;
  max-width: 90vw;
  max-height: 95vh;
  overflow-y: auto;
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

/* 确保卡片内容区域有足够的底部内边距 */
:deep(.ant-card-body) {
  padding: 24px !important;
  padding-bottom: 32px !important;
}

/* 确保表单有足够的底部间距 */
:deep(.ant-form) {
  margin-bottom: 0;
}

/* 确保按钮区域可见 */
.register-actions {
  margin-top: 16px;
  margin-bottom: 8px;
  text-align: center;
}
.validation-tip {
  color: var(--warning-color);
  font-size: 12px;
  margin-top: 4px;
}
/* 自定义卡片和表单样式 - 现代渐变 */
:deep(.ant-card-head) {
  background: var(--primary-gradient);
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
  background: var(--primary-gradient) !important;
  border: none !important;
  border-radius: var(--radius-lg);
  height: 44px;
  font-weight: 600;
  font-size: 16px;
  box-shadow: var(--shadow-primary);
  transition: all var(--transition-base);
  letter-spacing: 0.5px;
}
:deep(.ant-btn-primary:hover) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-primary-lg);
  filter: brightness(1.1);
}
:deep(.ant-btn-primary:active) {
  transform: translateY(0);
  box-shadow: var(--shadow-primary);
}

:deep(.ant-btn-text) {
  color: var(--primary-color) !important;
}
:deep(.ant-btn-text:hover) {
  color: var(--primary-dark) !important;
  background-color: var(--primary-lightest) !important;
}

:deep(.ant-input-affix-wrapper) {
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
  padding: 0 11px;
  box-sizing: border-box;
}

:deep(.ant-input-affix-wrapper .ant-input) {
  border: none;
  background: transparent;
  padding: 0;
  height: auto;
  line-height: 22px;
  box-sizing: border-box;
  flex: 1;
}

:deep(.ant-input) {
  border-radius: var(--radius-lg);
  height: 44px;
  border: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: var(--blur-sm);
  -webkit-backdrop-filter: var(--blur-sm);
  color: var(--text-primary);
  transition: all var(--transition-base);
  padding: 4px 11px;
  box-sizing: border-box;
  line-height: 36px;
}

:deep(.ant-input-affix-wrapper .ant-input-prefix) {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  flex-shrink: 0;
}

:deep(.ant-input-affix-wrapper .ant-input-prefix svg) {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1;
  display: inline-block;
}

:deep(.ant-input-affix-wrapper:hover) {
  border-color: var(--primary-light) !important;
  box-shadow: var(--shadow-md);
  background: rgba(255, 255, 255, 1);
}

:deep(.ant-input:hover) {
  border-color: var(--primary-light) !important;
  box-shadow: var(--shadow-md);
  background: rgba(255, 255, 255, 1);
}

:deep(.ant-input-affix-wrapper-focused) {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important;
  background: rgba(255, 255, 255, 1);
}

:deep(.ant-input-focused) {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important;
  background: rgba(255, 255, 255, 1);
}

:deep(.ant-input-affix-wrapper-focused .ant-input-prefix svg) {
  color: var(--primary-color);
}

:deep(.ant-form-item) {
  margin-bottom: 20px;
}

:deep(.ant-form-item-label) {
  padding-bottom: 8px;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: var(--text-primary);
}
:deep(.ant-input::placeholder) {
  color: var(--text-secondary);
}
.validation-tip {
  color: var(--warning-color);
  font-size: 12px;
  margin-top: 4px;
}
</style>