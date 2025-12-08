import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import RoleSelector from "@/views/RoleSelector.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import DashboardLayout from "@/views/DashboardLayout.vue";
import DashboardPage from "@/views/DashboardPage.vue";
import FlightsPage from "@/views/FlightsPage.vue";
import HotelsPage from "@/views/HotelsPage.vue";
import ScenicSpotsPage from "@/views/ScenicSpotsPage.vue";
import UsersPage from "@/views/UsersPage.vue";
import OrdersPage from "@/views/OrdersPage.vue";
import NotificationsPage from "@/views/NotificationsPage.vue";
import ReportsPage from "@/views/ReportsPage.vue";

// 旅行社端页面（待创建）
import AgencyLogin from "@/views/agency/AgencyLogin.vue";
import AgencyDashboardLayout from "@/views/agency/AgencyDashboardLayout.vue";
import AgencyDashboardPage from "@/views/agency/AgencyDashboardPage.vue";
import AgencyFlightsPage from "@/views/agency/AgencyFlightsPage.vue";
import AgencyOrdersPage from "@/views/agency/AgencyOrdersPage.vue";
import AgencyBulkOrderPage from "@/views/agency/AgencyBulkOrderPage.vue";
import AgencyCustomersPage from "@/views/agency/AgencyCustomersPage.vue";
import AgencyHotelsPage from "@/views/agency/AgencyHotelsPage.vue";
import AgencyTripsPage from "@/views/agency/AgencyTripsPage.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "role-selector",
    component: RoleSelector,
    meta: { public: true },
  },
  // 管理员端路由
  {
    path: "/admin/login",
    name: "admin-login",
    component: Login,
    meta: { public: true },
  },
  {
    path: "/admin/register",
    name: "admin-register",
    component: Register,
    meta: { public: true },
  },
  {
    path: "/admin",
    component: DashboardLayout,
    children: [
      { path: "", redirect: "/admin/dashboard" },
      { path: "dashboard", component: DashboardPage, meta: { title: "数据大屏" } },
      { path: "flights", component: FlightsPage, meta: { title: "航班管理" } },
      { path: "hotels", component: HotelsPage, meta: { title: "酒店管理" } },
      { path: "scenic-spots", component: ScenicSpotsPage, meta: { title: "景点管理" } },
      { path: "users", component: UsersPage, meta: { title: "用户管理" } },
      { path: "orders", component: OrdersPage, meta: { title: "订单管理" } },
      { path: "notifications", component: NotificationsPage, meta: { title: "通知中心" } },
      { path: "reports", component: ReportsPage, meta: { title: "财务报表" } },
    ],
  },
  // 旅行社端路由
  {
    path: "/agency/login",
    name: "agency-login",
    component: AgencyLogin,
    meta: { public: true },
  },
  {
    path: "/agency/register",
    name: "agency-register",
    component: () => import("@/views/agency/AgencyRegister.vue"),
    meta: { public: true },
  },
  {
    path: "/agency",
    component: AgencyDashboardLayout,
    children: [
      { path: "", redirect: "/agency/dashboard" },
      { path: "dashboard", component: AgencyDashboardPage, meta: { title: "数据概览" } },
      { path: "flights", component: AgencyFlightsPage, meta: { title: "航班查询" } },
      { path: "orders", component: AgencyOrdersPage, meta: { title: "订单管理" } },
      { path: "bulk-order", component: AgencyBulkOrderPage, meta: { title: "批量购票" } },
      { path: "customers", component: AgencyCustomersPage, meta: { title: "客户管理" } },
      { path: "hotels", component: AgencyHotelsPage, meta: { title: "预订酒店" } },
      { path: "trips", component: AgencyTripsPage, meta: { title: "我的行程" } },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  
  // 公开页面直接放行
  if (to.meta.public) {
    return next();
  }
  
  // 需要登录的页面
  if (!token) {
    // 根据路径判断应该跳转到哪个登录页
    if (to.path.startsWith("/agency")) {
      return next("/agency/login");
    } else if (to.path.startsWith("/admin")) {
      return next("/admin/login");
    } else {
      return next("/");
    }
  }
  
  // 检查角色权限
  if (to.path.startsWith("/agency") && userRole !== "agency") {
    return next("/");
  }
  if (to.path.startsWith("/admin") && userRole !== "admin") {
    return next("/");
  }
  
  return next();
});

export default router;

