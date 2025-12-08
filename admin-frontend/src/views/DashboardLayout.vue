<template>
  <a-layout class="dashboard-layout">
    <!-- 侧边栏 -->
    <a-layout-sider 
      theme="light" 
      collapsible 
      v-model:collapsed="collapsed"
      :width="240"
      :collapsed-width="80"
      class="sidebar"
    >
      <!-- Logo区域 -->
      <div class="logo-container">
        <div class="logo-text" v-if="!collapsed">SkyTrip Admin</div>
        <div class="logo-icon" v-else>ST</div>
      </div>
      <!-- 导航菜单 -->
      <a-menu 
        mode="inline" 
        :selectedKeys="[selectedKey]" 
        @click="handleMenuClick"
        :default-open-keys="['/dashboard']"
        class="main-menu"
      >
        <a-menu-item v-for="item in menu" :key="item.path">
          <template #icon>
            <component :is="item.icon" />
          </template>
          <span>{{ item.label }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <!-- 主内容区域 -->
    <a-layout class="main-layout">
      <!-- 顶部导航栏 -->
      <a-layout-header class="top-header">
        <div class="header-content">
          <div class="header-title">{{ currentPageTitle }}</div>
          <div class="header-actions">
            <a-space size="middle">
              <a-avatar :size="32" style="background-color: var(--primary-light);">
                <UserOutlined />
              </a-avatar>
              <a-button type="primary" danger @click="handleLogout">退出登录</a-button>
            </a-space>
          </div>
        </div>
      </a-layout-header>
      <!-- 内容区域 -->
      <a-layout-content class="page-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { 
  CarOutlined, 
  DotChartOutlined, 
  HomeOutlined, 
  EnvironmentOutlined, 
  UserOutlined, 
  ShoppingCartOutlined, 
  BellOutlined, 
  BarChartOutlined,
  UserOutlined as UserIcon
} from "@ant-design/icons-vue";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const collapsed = ref(false);

// 导航菜单配置
const menu = [
  { path: "/admin/dashboard", label: "数据大屏", icon: DotChartOutlined },
  { path: "/admin/flights", label: "航班管理", icon: CarOutlined },
  { path: "/admin/hotels", label: "酒店管理", icon: HomeOutlined },
  { path: "/admin/scenic-spots", label: "景点管理", icon: EnvironmentOutlined },
  { path: "/admin/users", label: "用户管理", icon: UserOutlined },
  { path: "/admin/orders", label: "订单管理", icon: ShoppingCartOutlined },
  { path: "/admin/notifications", label: "通知中心", icon: BellOutlined },
  { path: "/admin/reports", label: "财务报表", icon: BarChartOutlined },
];

// 当前选中的菜单项
const selectedKey = computed(() => route.path);

// 当前页面标题
const currentPageTitle = computed(() => {
  const currentMenu = menu.find(item => item.path === route.path);
  return currentMenu ? currentMenu.label : "SkyTrip Admin";
});

// 处理菜单点击
const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key);
};

// 处理退出登录
const handleLogout = () => {
  auth.logout();
  localStorage.removeItem("userRole");
  router.push("/");
};
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  background-color: var(--bg-secondary);
}

/* 侧边栏样式 - 玻璃态效果 */
.sidebar {
  background: var(--bg-glass) !important;
  backdrop-filter: var(--blur-md) !important;
  -webkit-backdrop-filter: var(--blur-md) !important;
  border-right: 1px solid var(--border-color) !important;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-lg);
}

/* Logo样式 - 现代渐变 */
.logo-container {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-gradient);
  color: white;
  font-weight: 700;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
}

.logo-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 3s infinite;
}

.logo-text {
  font-size: 18px;
  letter-spacing: 0.5px;
}

.logo-icon {
  font-size: 20px;
  font-weight: 800;
}

/* 主菜单样式 */
.main-menu {
  border-right: none !important;
}

/* 菜单项样式 - 现代设计 */
:deep(.ant-menu-item) {
  padding: 12px 24px !important;
  margin: 4px 8px !important;
  border-radius: var(--radius-lg) !important;
  transition: all var(--transition-base);
  font-weight: 500;
  color: var(--text-secondary);
  position: relative;
  overflow: hidden;
  display: flex !important;
  align-items: center !important;
  height: auto !important;
  line-height: 1.5 !important;
}

:deep(.ant-menu-item::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--primary-gradient);
  transform: scaleY(0);
  transition: transform var(--transition-base);
}

:deep(.ant-menu-item:hover) {
  background: var(--primary-gradient-subtle) !important;
  color: var(--primary-color) !important;
  transform: translateX(4px);
}

:deep(.ant-menu-item:hover::before) {
  transform: scaleY(1);
}

:deep(.ant-menu-item-selected) {
  background: var(--primary-gradient-subtle) !important;
  color: var(--primary-color) !important;
  box-shadow: var(--shadow-md);
  font-weight: 600;
}

:deep(.ant-menu-item-selected::before) {
  transform: scaleY(1);
}

/* 菜单图标样式 */
:deep(.ant-menu-item-icon) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin-right: 12px !important;
  line-height: 1 !important;
  flex-shrink: 0 !important;
}

:deep(.ant-menu-item-icon svg) {
  font-size: 18px !important;
  transition: color 0.3s ease;
  display: inline-block !important;
  vertical-align: middle !important;
  line-height: 1 !important;
}

/* 确保菜单项文本也垂直居中 */
:deep(.ant-menu-item .ant-menu-title-content) {
  display: flex !important;
  align-items: center !important;
  line-height: 1.5 !important;
}

:deep(.ant-menu-item:hover) .ant-menu-item-icon svg {
  color: var(--primary-color) !important;
}

:deep(.ant-menu-item-selected) .ant-menu-item-icon svg {
  color: var(--primary-color) !important;
}

/* 主内容区域 */
.main-layout {
  background-color: var(--bg-secondary);
}

/* 顶部导航栏 - 玻璃态效果 */
.top-header {
  background: var(--bg-glass) !important;
  backdrop-filter: var(--blur-md) !important;
  -webkit-backdrop-filter: var(--blur-md) !important;
  padding: 0 24px !important;
  height: 64px !important;
  line-height: 64px !important;
  box-shadow: var(--shadow-md);
  border-bottom: 1px solid var(--border-color);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.header-title {
  font-size: 20px;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-actions {
  display: flex;
  align-items: center;
}

/* 内容区域 - 玻璃态卡片 */
.page-content {
  margin: 20px;
  padding: 24px;
  background: var(--bg-glass);
  backdrop-filter: var(--blur-md);
  -webkit-backdrop-filter: var(--blur-md);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-color);
  min-height: calc(100vh - 124px);
  animation: fadeIn var(--transition-base);
}

/* 按钮样式优化 */
:deep(.ant-btn) {
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.ant-btn-primary) {
  background: var(--primary-gradient) !important;
  border: none !important;
  box-shadow: var(--shadow-primary);
  font-weight: 600;
  transition: all var(--transition-base);
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

/* 响应式调整 */
@media (max-width: 768px) {
  .page-content {
    margin: 10px;
    padding: 16px;
  }
}
</style>

