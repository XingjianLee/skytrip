<template>
  <a-layout class="dashboard-layout">
    <!-- 顶部导航，呼应用户端 -->
    <a-layout-header class="top-header">
      <div class="header-inner">
        <div class="brand" @click="router.push('/agency/dashboard')">
          <div class="brand-logo">ST</div>
          <div class="brand-text">
            <div class="brand-name">SkyTrip Travel</div>
            <div class="brand-sub">团体 · 机票 · 酒店 · 景点</div>
          </div>
        </div>
        <a-menu
          mode="horizontal"
          :selectedKeys="[selectedKey]"
          @click="handleMenuClick"
          class="nav-menu"
        >
          <a-menu-item v-for="item in menu" :key="item.path" :disabled="item.disabled">
            <template #icon>
              <component :is="item.icon" />
            </template>
            {{ item.label }}
          </a-menu-item>
        </a-menu>
        <div class="header-actions">
          <a-space size="middle">
            <a-avatar :size="36" class="avatar">
              <TeamOutlined />
            </a-avatar>
            <a-button type="primary" danger @click="handleLogout">退出登录</a-button>
          </a-space>
        </div>
      </div>
    </a-layout-header>

    <!-- 页面内容 -->
    <a-layout-content class="page-content">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { 
  HomeOutlined,
  CarOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  FileAddOutlined,
  ProfileOutlined
} from "@ant-design/icons-vue";

const router = useRouter();
const route = useRoute();

// 顶部导航菜单
const menu = [
  { path: "/agency/dashboard", label: "首页", icon: HomeOutlined },
  { path: "/agency/flights", label: "预订机票", icon: CarOutlined },
  { path: "/agency/bulk-order", label: "团购专区", icon: FileAddOutlined },
  { path: "/agency/orders", label: "我的订单", icon: ShoppingCartOutlined },
  { path: "/agency/customers", label: "乘机人/客户", icon: TeamOutlined },
  { path: "/agency/hotels", label: "预订酒店", icon: ShopOutlined },
  { path: "/agency/trips", label: "我的行程", icon: ProfileOutlined }
];

// 当前选中的菜单项
const selectedKey = computed(() => route.path);

// 处理菜单点击
const handleMenuClick = ({ key, item }: { key: string; item: any }) => {
  if (item?.disabled) return;
  router.push(key);
};

// 退出登录
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  router.push("/");
};
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  background: linear-gradient(180deg, rgba(0, 128, 96, 0.05) 0%, rgba(0, 180, 160, 0.08) 40%, #f8fbfb 100%);
}

.top-header {
  background: #ffffff;
  padding: 0 32px !important;
  height: 72px !important;
  display: flex;
  align-items: center;
  box-shadow: 0 6px 20px rgba(0, 128, 96, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.brand-logo {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0bb07b 0%, #0e9a8b 100%);
  color: #fff;
  font-weight: 800;
  display: grid;
  place-items: center;
  box-shadow: 0 10px 25px rgba(11, 176, 123, 0.35);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-name {
  font-weight: 800;
  font-size: 18px;
  color: #0f5748;
}

.brand-sub {
  font-size: 12px;
  color: #4f8f87;
}

.nav-menu {
  flex: 1;
  border: none;
  margin-left: 8px;
}

::deep(.ant-menu-horizontal) {
  border: none;
  background: transparent;
}

::deep(.ant-menu-horizontal > .ant-menu-item) {
  padding: 0 16px;
  font-weight: 600;
  color: #32615b;
  border-radius: 12px;
  margin: 0 4px;
}

::deep(.ant-menu-horizontal > .ant-menu-item-selected) {
  background: linear-gradient(135deg, #0bb07b 0%, #0e9a8b 100%);
  color: #fff !important;
}

::deep(.ant-menu-horizontal > .ant-menu-item:hover) {
  color: #0bb07b !important;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  background: linear-gradient(135deg, #0bb07b 0%, #0e9a8b 100%);
}

.page-content {
  margin: 20px 32px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(0, 128, 96, 0.12);
  min-height: calc(100vh - 112px);
  border: 1px solid rgba(11, 176, 123, 0.06);
}
</style>
