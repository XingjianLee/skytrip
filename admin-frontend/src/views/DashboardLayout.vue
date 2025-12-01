<template>
  <a-layout class="full-height">
    <a-layout-sider theme="light" collapsible v-model:collapsed="collapsed">
      <div class="logo">SkyTrip Admin</div>
      <a-menu mode="inline" :selectedKeys="[selectedKey]" @click="handleMenuClick">
        <a-menu-item v-for="item in menu" :key="item.path">
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

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const collapsed = ref(false);
const menu = [
  { path: "/flights", label: "航班管理" },
  { path: "/hotels", label: "酒店管理" },
  { path: "/scenic-spots", label: "景点管理" },
  { path: "/users", label: "用户管理" },
  { path: "/orders", label: "订单管理" },
  { path: "/notifications", label: "通知中心" },
  { path: "/reports", label: "财务报表" },
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
}
.header {
  background: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 24px;
}
.content {
  margin: 24px;
  padding: 24px;
  background: #fff;
  min-height: calc(100vh - 120px);
}
</style>

