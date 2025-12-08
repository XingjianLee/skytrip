<template>
  <div class="role-selector-page">
    <div class="role-selector-container">
      <div class="header">
        <h1 class="title">SkyTrip 旅行服务平台</h1>
        <p class="subtitle">请选择您的身份进入系统</p>
      </div>
      
      <div class="role-cards">
        <!-- 管理员端 -->
        <div class="role-card" @click="selectRole('admin')">
          <div class="card-icon admin-icon">
            <UserOutlined />
          </div>
          <h3 class="card-title">管理员端</h3>
          <p class="card-description">管理航班、酒店、景点信息，处理订单和用户管理</p>
          <div class="card-features">
            <span class="feature-tag">航班管理</span>
            <span class="feature-tag">订单管理</span>
            <span class="feature-tag">用户管理</span>
            <span class="feature-tag">财务报表</span>
          </div>
        </div>

        <!-- 旅行社端 -->
        <div class="role-card" @click="selectRole('agency')">
          <div class="card-icon agency-icon">
            <TeamOutlined />
          </div>
          <h3 class="card-title">旅行社端</h3>
          <p class="card-description">批量购票、团体票优惠、订单管理和客户服务</p>
          <div class="card-features">
            <span class="feature-tag">批量购票</span>
            <span class="feature-tag">团体优惠</span>
            <span class="feature-tag">订单管理</span>
            <span class="feature-tag">客户管理</span>
          </div>
        </div>

        <!-- 用户端 -->
        <div class="role-card disabled" @click="selectRole('user')">
          <div class="card-icon user-icon">
            <ShoppingOutlined />
          </div>
          <h3 class="card-title">用户端</h3>
          <p class="card-description">预订航班、酒店、景点，管理个人订单和行程</p>
          <div class="card-features">
            <span class="feature-tag">航班预订</span>
            <span class="feature-tag">酒店预订</span>
            <span class="feature-tag">景点预订</span>
            <span class="feature-tag">在线值机</span>
          </div>
          <div class="coming-soon">即将上线</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { UserOutlined, TeamOutlined, ShoppingOutlined } from "@ant-design/icons-vue";

const router = useRouter();

const selectRole = (role: string) => {
  if (role === 'user') {
    // 用户端暂未实现，显示提示
    return;
  }
  
  // 保存选择的角色到 localStorage
  localStorage.setItem('selectedRole', role);
  
  // 根据角色跳转到对应的登录页面
  if (role === 'admin') {
    router.push('/admin/login');
  } else if (role === 'agency') {
    router.push('/agency/login');
  }
};
</script>

<style scoped>
.role-selector-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-gradient);
  background-attachment: fixed;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.role-selector-page::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

.role-selector-container {
  max-width: 1200px;
  width: 100%;
  position: relative;
  z-index: 1;
  animation: fadeIn var(--transition-slow);
}

.header {
  text-align: center;
  margin-bottom: 60px;
}

.title {
  font-size: 42px;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  letter-spacing: -1px;
}

.subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.role-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

@media (max-width: 992px) {
  .role-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .role-cards {
    grid-template-columns: 1fr;
  }
}

.role-card {
  background: var(--bg-glass);
  backdrop-filter: var(--blur-lg);
  -webkit-backdrop-filter: var(--blur-lg);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-xl);
  padding: 40px 32px;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.role-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary-gradient);
  transform: scaleX(0);
  transition: transform var(--transition-base);
}

.role-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-2xl);
  border-color: rgba(129, 140, 248, 0.5);
  background: rgba(255, 255, 255, 0.15);
}

.role-card:hover::before {
  transform: scaleX(1);
}

.role-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  position: relative;
}

.role-card.disabled:hover {
  transform: none;
}

.coming-soon {
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--warning-color);
  color: white;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
}

.card-icon {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 36px;
  color: white;
  box-shadow: var(--shadow-lg);
}

.admin-icon {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

.agency-icon {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
}

.user-icon {
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
}

.card-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 24px;
  min-height: 44px;
}

.card-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.feature-tag {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: var(--blur-sm);
  padding: 6px 12px;
  border-radius: var(--radius-md);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>

