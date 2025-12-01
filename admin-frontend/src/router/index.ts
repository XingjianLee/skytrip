import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import DashboardLayout from "@/views/DashboardLayout.vue";
import FlightsPage from "@/views/FlightsPage.vue";
import HotelsPage from "@/views/HotelsPage.vue";
import ScenicSpotsPage from "@/views/ScenicSpotsPage.vue";
import UsersPage from "@/views/UsersPage.vue";
import OrdersPage from "@/views/OrdersPage.vue";
import NotificationsPage from "@/views/NotificationsPage.vue";
import ReportsPage from "@/views/ReportsPage.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { public: true },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: { public: true },
  },
  {
    path: "/",
    component: DashboardLayout,
    children: [
      { path: "", redirect: "/flights" },
      { path: "flights", component: FlightsPage, meta: { title: "航班管理" } },
      { path: "hotels", component: HotelsPage, meta: { title: "酒店管理" } },
      { path: "scenic-spots", component: ScenicSpotsPage, meta: { title: "景点管理" } },
      { path: "users", component: UsersPage, meta: { title: "用户管理" } },
      { path: "orders", component: OrdersPage, meta: { title: "订单管理" } },
      { path: "notifications", component: NotificationsPage, meta: { title: "通知中心" } },
      { path: "reports", component: ReportsPage, meta: { title: "财务报表" } },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem("token");
  if (!to.meta.public && !token) {
    return next("/login");
  }
  return next();
});

export default router;

