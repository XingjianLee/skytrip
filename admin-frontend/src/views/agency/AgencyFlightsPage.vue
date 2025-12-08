<template>
  <div class="flights-page">
    <!-- 华丽的搜索区域 -->
    <a-card class="hero-search" bordered={false}>
      <div class="hero-search-left">
        <div class="hero-title">机票搜索 · 团体价优先</div>
        <div class="hero-sub">直飞 / 中转提示 · 价格日历（占位） · 团队人数可选</div>
        <div class="pill-search">
          <a-input v-model:value="searchForm.departure_city" placeholder="出发城市，如：北京" class="pill-input" />
          <a-input v-model:value="searchForm.arrival_city" placeholder="到达城市，如：上海" class="pill-input" />
          <a-date-picker v-model:value="searchForm.departure_date" format="YYYY-MM-DD" class="pill-input" placeholder="出发日期" />
          <a-select v-model:value="searchForm.cabin_class" class="pill-input" allow-clear placeholder="舱位">
            <a-select-option value="economy">经济舱</a-select-option>
            <a-select-option value="business">商务舱</a-select-option>
            <a-select-option value="first">头等舱</a-select-option>
          </a-select>
          <a-button type="primary" size="large" @click="searchFlights">搜索</a-button>
          <a-button size="large" ghost @click="resetSearch">重置</a-button>
        </div>
        <div class="hero-tags">
          <a-tag color="orange">支持团体价</a-tag>
          <a-tag color="blue">余票实时</a-tag>
          <a-tag color="green">可直达团购下单</a-tag>
        </div>
      </div>
      <div class="hero-search-right">
        <div class="mini-block">
          <div class="mini-label">热门航线</div>
          <div class="mini-value">北上广 · 成渝 · 深杭</div>
          <div class="mini-desc">价格日历与推荐航线将在此展示（占位）</div>
        </div>
      </div>
    </a-card>

    <!-- 筛选条 -->
    <div class="filter-bar">
      <div class="filter-label">结果 {{ flights.length }} 条</div>
      <div class="filter-actions">
        <a-tag color="green">直飞/中转提示</a-tag>
        <a-tag color="blue">显示舱位余票</a-tag>
        <a-tag color="purple">团购入口</a-tag>
      </div>
    </div>

    <!-- 航班卡片列表 -->
    <div class="flight-grid">
      <a-empty v-if="!loading && flights.length === 0" description="请先搜索航班" />
      <a-spin v-else :spinning="loading">
        <a-card
          v-for="item in flights"
          :key="item.flight_id"
          class="flight-card"
        >
          <div class="flight-main">
            <div class="flight-line">
              <div class="flight-no">
                <div class="flight-number">{{ item.flight_number }}</div>
                <div class="flight-airline">{{ item.airline }}</div>
              </div>
              <div class="flight-time">
                <div class="time">{{ item.departure_time }}</div>
                <div class="city">{{ item.departure_city }}</div>
              </div>
              <div class="flight-arrow">→</div>
              <div class="flight-time">
                <div class="time">{{ item.arrival_time }}</div>
                <div class="city">{{ item.arrival_city }}</div>
              </div>
              <div class="badges">
                <a-tag color="blue">直飞/中转</a-tag>
                <a-tag color="cyan">准点率（占位）</a-tag>
              </div>
            </div>

            <div class="prices">
              <div class="price-item">
                <div class="price-label">经济舱</div>
                <div class="price-value">¥{{ item.economy_price }}</div>
                <div class="stock">余 {{ item.economy_available }} 张</div>
              </div>
              <div class="price-item">
                <div class="price-label">商务舱</div>
                <div class="price-value">¥{{ item.business_price }}</div>
                <div class="stock">余 {{ item.business_available }} 张</div>
              </div>
              <div class="price-item">
                <div class="price-label">头等舱</div>
                <div class="price-value">¥{{ item.first_price }}</div>
                <div class="stock">余 {{ item.first_available }} 张</div>
              </div>
            </div>

            <div class="actions">
              <a-button type="link" @click="goToBulkOrder(item)">团购下单</a-button>
              <a-button type="primary" ghost @click="goToBulkOrder(item)">单个下单（占位）</a-button>
            </div>
          </div>
        </a-card>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import http from "@/api/http";
import dayjs, { Dayjs } from "dayjs";

const router = useRouter();
const loading = ref(false);
const flights = ref([]);

const searchForm = reactive({
  departure_city: "",
  arrival_city: "",
  departure_date: null as Dayjs | null,
  cabin_class: undefined as string | undefined,
});

const searchFlights = async () => {
  loading.value = true;
  try {
    const params: any = {};
    if (searchForm.departure_city) params.departure_city = searchForm.departure_city;
    if (searchForm.arrival_city) params.arrival_city = searchForm.arrival_city;
    if (searchForm.departure_date) {
      params.departure_date = searchForm.departure_date.format("YYYY-MM-DD");
    }
    if (searchForm.cabin_class) params.cabin_class = searchForm.cabin_class;
    
    const response = await http.get("/api/v1/agency/flights", { params });
    flights.value = response;
    message.success(`找到 ${response.length} 个航班`);
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "查询失败");
  } finally {
    loading.value = false;
  }
};

const resetSearch = () => {
  searchForm.departure_city = "";
  searchForm.arrival_city = "";
  searchForm.departure_date = null;
  searchForm.cabin_class = undefined;
  flights.value = [];
};

const goToBulkOrder = (flight: any) => {
  router.push({
    path: "/agency/bulk-order",
    query: { flight_id: flight.flight_id },
  });
};
</script>

<style scoped>
.flights-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-search {
  border-radius: 18px;
  background: linear-gradient(135deg, #0bb07b 0%, #0e9a8b 40%, #f5fffb 100%);
  color: #fff;
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 16px;
  box-shadow: 0 24px 60px rgba(0, 128, 96, 0.18);
  border: none;
}

.hero-search-left {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hero-search-right {
  padding: 16px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 14px;
  backdrop-filter: blur(4px);
  color: #0f5748;
}

.hero-title {
  font-size: 26px;
  font-weight: 800;
}

.hero-sub {
  font-size: 15px;
  opacity: 0.92;
}

.pill-search {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.pill-input {
  min-width: 160px;
  border-radius: 999px;
  overflow: hidden;
}

.hero-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.mini-block {
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 12px;
}

.mini-label {
  font-weight: 700;
  font-size: 14px;
}

.mini-value {
  font-size: 18px;
  font-weight: 800;
}

.mini-desc {
  color: #0f5748;
  font-size: 13px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 8px;
}

.filter-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.flight-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.flight-card {
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(11, 176, 123, 0.08);
}

.flight-main {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.flight-line {
  display: grid;
  grid-template-columns: 1.2fr 1fr 40px 1fr 1.4fr;
  gap: 10px;
  align-items: center;
}

.flight-no .flight-number {
  font-weight: 800;
  font-size: 18px;
}

.flight-no .flight-airline {
  color: var(--text-secondary);
}

.flight-time .time {
  font-size: 18px;
  font-weight: 700;
}

.flight-time .city {
  color: var(--text-secondary);
}

.flight-arrow {
  text-align: center;
  font-weight: 800;
  font-size: 18px;
  color: #0e9a8b;
}

.badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.prices {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
}

.price-item {
  padding: 10px;
  border-radius: 12px;
  background: var(--bg-tertiary);
}

.price-label {
  color: var(--text-secondary);
}

.price-value {
  font-size: 20px;
  font-weight: 800;
  color: #0f5748;
}

.stock {
  color: var(--text-secondary);
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

@media (max-width: 1080px) {
  .hero-search {
    grid-template-columns: 1fr;
  }

  .flight-line {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "no badges"
      "from to";
  }
}
</style>

