<template>
  <div class="agency-dashboard">
    <!-- Hero 搜索与 CTA -->
    <a-card class="hero-card" bordered={false}>
      <div class="hero-left">
        <div class="hero-eyebrow">旅行社专属 · 团体优惠</div>
        <div class="hero-title">一站式预订机票 / 酒店 / 景点</div>
        <div class="hero-sub">快速搜索 · 团购阶梯折扣 · 乘机人批量导入</div>
        <div class="hero-actions">
          <a-button type="primary" size="large" @click="router.push('/agency/flights')">
            立即查航班
          </a-button>
          <a-button size="large" @click="router.push('/agency/bulk-order')">
            团购专区
          </a-button>
        </div>
        <div class="hero-tags">
          <a-tag color="green">团体价自动计算</a-tag>
          <a-tag color="blue">支持线下支付</a-tag>
          <a-tag color="gold">可导出报销单</a-tag>
        </div>
      </div>
      <div class="hero-right">
        <div class="mini-stats">
          <div class="mini-stat">
            <div class="mini-label">总订单数</div>
            <div class="mini-value">{{ statistics.total_orders }}</div>
          </div>
          <div class="mini-stat">
            <div class="mini-label">总交易额</div>
            <div class="mini-value">¥{{ formatNumber(statistics.total_amount) }}</div>
          </div>
          <div class="mini-stat">
            <div class="mini-label">已支付</div>
            <div class="mini-value">{{ statistics.paid_orders }}</div>
          </div>
          <div class="mini-stat">
            <div class="mini-label">待支付</div>
            <div class="mini-value">{{ statistics.pending_orders }}</div>
          </div>
        </div>
      </div>
    </a-card>

    <!-- 快捷服务 -->
    <div class="quick-grid">
      <a-card class="quick-item" @click="router.push('/agency/flights')">
        <CarOutlined class="quick-icon" />
        <div class="quick-title">预订机票</div>
        <div class="quick-desc">直飞/中转筛选 · 舱位余票 · 团体价</div>
      </a-card>
      <a-card class="quick-item" @click="router.push('/agency/bulk-order')">
        <FileAddOutlined class="quick-icon" />
        <div class="quick-title">团购专区</div>
        <div class="quick-desc">10-50人阶梯折扣 · 支持线下支付</div>
      </a-card>
      <a-card class="quick-item" @click="router.push('/agency/orders')">
        <ShoppingCartOutlined class="quick-icon" />
        <div class="quick-title">我的订单</div>
        <div class="quick-desc">批量导出 · 行程单/报销单 · 退改售后</div>
      </a-card>
      <a-card class="quick-item" @click="router.push('/agency/customers')">
        <TeamOutlined class="quick-icon" />
        <div class="quick-title">乘机人/客户</div>
        <div class="quick-desc">常旅客管理 · 批量导入 · 证件校验</div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  ShoppingCartOutlined,
  FileAddOutlined,
  CarOutlined,
  TeamOutlined
} from "@ant-design/icons-vue";
import http from "@/api/http";

const router = useRouter();
const statistics = ref({
  total_orders: 0,
  total_amount: 0,
  paid_orders: 0,
  pending_orders: 0,
});

const formatNumber = (num: number) => {
  return num.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const loadStatistics = async () => {
  try {
    const response = await http.get("/api/v1/agency/statistics");
    statistics.value = response;
  } catch (error) {
    console.error("加载统计数据失败:", error);
  }
};

onMounted(() => {
  loadStatistics();
});
</script>

<style scoped>
.agency-dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-card {
  border-radius: 18px;
  background: linear-gradient(135deg, #0bb07b 0%, #0e9a8b 40%, #f5fffb 100%);
  color: #fff;
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 16px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 128, 96, 0.18);
  border: none;
}

.hero-left {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hero-right {
  background: rgba(255, 255, 255, 0.18);
  padding: 20px;
  border-radius: 16px;
  margin: 16px;
  display: flex;
  align-items: center;
}

.hero-eyebrow {
  font-size: 14px;
  letter-spacing: 0.5px;
  opacity: 0.9;
}

.hero-title {
  font-size: 28px;
  font-weight: 800;
}

.hero-sub {
  font-size: 16px;
  opacity: 0.92;
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}

.hero-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.mini-stats {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.mini-stat {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px;
  color: #0f5748;
  backdrop-filter: blur(4px);
}

.mini-label {
  font-size: 13px;
  color: #0f5748;
}

.mini-value {
  font-size: 20px;
  font-weight: 800;
  color: #0b4f40;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 16px;
}

.quick-item {
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(11, 176, 123, 0.08);
  min-height: 150px;
}

.quick-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.quick-icon {
  font-size: 28px;
  color: #0e9a8b;
  margin-bottom: 8px;
}

.quick-title {
  font-weight: 700;
  margin-bottom: 4px;
}

.quick-desc {
  color: var(--text-secondary);
  font-size: 13px;
}

@media (max-width: 960px) {
  .hero-card {
    grid-template-columns: 1fr;
  }
  .hero-right {
    margin: 0 16px 16px;
  }
}
</style>

