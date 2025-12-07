<template>
  <a-layout class="full-height">
    <a-layout-sider theme="light" collapsible v-model:collapsed="collapsed">
      <div class="logo">SkyTrip Admin</div>
      <a-menu mode="inline" :selectedKeys="[selectedKey]" @click="handleMenuClick">
        <a-menu-item v-for="item in menu" :key="item.path">
          <template #icon>
            <component :is="item.icon" />
          </template>
          <span>{{ item.label }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header">
        <div />
        <a-space>
          <a-button type="text" @click="handleLogout">退出登录</a-button>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { CarOutlined, HomeOutlined, EnvironmentOutlined, UserOutlined, ShoppingCartOutlined, BellOutlined, BarChartOutlined } from "@ant-design/icons-vue";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const collapsed = ref(false);
const menu = [
  { path: "/flights", label: "航班管理", icon: CarOutlined },
  { path: "/hotels", label: "酒店管理", icon: HomeOutlined },
  { path: "/scenic-spots", label: "景点管理", icon: EnvironmentOutlined },
  { path: "/users", label: "用户管理", icon: UserOutlined },
  { path: "/orders", label: "订单管理", icon: ShoppingCartOutlined },
  { path: "/notifications", label: "通知中心", icon: BellOutlined },
  { path: "/reports", label: "财务报表", icon: BarChartOutlined },
];

const selectedKey = computed(() => route.path);

const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key);
};

const handleLogout = () => {
  auth.logout();
  router.push("/login");
};
</script>

<style scoped>
.logo {
  height: 48px;
  margin: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  color: var(--primary-color);
  font-size: 18px;
}
.header {
  background: var(--bg-primary);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 24px;
  box-shadow: var(--shadow-sm);
  border-bottom: 1px solid var(--border-color);
}
.content {
  margin: 24px;
  padding: 24px;
  background: var(--bg-primary);
  min-height: calc(100vh - 120px);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
}
/* 自定义菜单样式 */
:deep(.ant-layout-sider) {
  background: var(--bg-primary) !important;
  border-right: 1px solid var(--border-color);
}
:deep(.ant-menu-item-selected) {
  background-color: var(--bg-tertiary) !important;
  color: var(--primary-color) !important;
}
:deep(.ant-menu-item-selected) .ant-menu-item-icon svg {
  color: var(--primary-color) !important;
}
:deep(.ant-menu-item:hover) {
  background-color: var(--bg-tertiary) !important;
}
:deep(.ant-menu-item-icon svg) {
  color: var(--text-secondary) !important;
}
/* 自定义按钮样式 */
:deep(.ant-btn) {
  border-radius: 6px;
}
:deep(.ant-btn-primary) {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}
:deep(.ant-btn-primary:hover) {
  background-color: var(--primary-dark) !important;
  border-color: var(--primary-dark) !important;
}
</style>

