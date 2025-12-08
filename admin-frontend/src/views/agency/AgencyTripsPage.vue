<template>
  <div class="trips-page">
    <div class="page-header">
      <h2 class="page-title">我的行程</h2>
      <p class="page-subtitle">查看您的所有行程安排，包括机票、酒店和景点预订</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <a-card class="stat-card">
        <div class="stat-content">
          <div class="stat-label">总行程数</div>
          <div class="stat-value">{{ statistics.total_trips }}</div>
        </div>
        <CalendarOutlined class="stat-icon" />
      </a-card>
      <a-card class="stat-card">
        <div class="stat-content">
          <div class="stat-label">进行中</div>
          <div class="stat-value">{{ statistics.ongoing }}</div>
        </div>
        <ClockCircleOutlined class="stat-icon" />
      </a-card>
      <a-card class="stat-card">
        <div class="stat-content">
          <div class="stat-label">已完成</div>
          <div class="stat-value">{{ statistics.completed }}</div>
        </div>
        <CheckCircleOutlined class="stat-icon" />
      </a-card>
      <a-card class="stat-card">
        <div class="stat-content">
          <div class="stat-label">总消费</div>
          <div class="stat-value">¥{{ formatNumber(statistics.total_spent) }}</div>
        </div>
        <DollarOutlined class="stat-icon" />
      </a-card>
    </div>

    <!-- 筛选和视图切换 -->
    <a-card class="filter-card">
      <a-space>
        <span>筛选：</span>
        <a-select v-model:value="filterStatus" style="width: 120px" @change="applyFilter">
          <a-select-option value="">全部状态</a-select-option>
          <a-select-option value="upcoming">即将开始</a-select-option>
          <a-select-option value="ongoing">进行中</a-select-option>
          <a-select-option value="completed">已完成</a-select-option>
          <a-select-option value="cancelled">已取消</a-select-option>
        </a-select>
        <a-date-picker v-model:value="filterDate" placeholder="选择日期" @change="applyFilter" />
        <a-button @click="resetFilter">重置</a-button>
        <a-radio-group v-model:value="viewMode" style="margin-left: auto">
          <a-radio-button value="list">
            <UnorderedListOutlined />
            列表
          </a-radio-button>
          <a-radio-button value="timeline">
            <ScheduleOutlined />
            时间线
          </a-radio-button>
        </a-radio-group>
      </a-space>
    </a-card>

    <!-- 行程列表视图 -->
    <div v-if="viewMode === 'list'" class="trips-list">
      <a-card
        v-for="trip in filteredTrips"
        :key="trip.trip_id"
        class="trip-card"
        :class="{ 'trip-ongoing': trip.status === 'ongoing', 'trip-completed': trip.status === 'completed' }"
      >
        <div class="trip-header">
          <div class="trip-title-section">
            <h3 class="trip-title">{{ trip.title }}</h3>
            <a-tag :color="getStatusColor(trip.status)">{{ getStatusText(trip.status) }}</a-tag>
          </div>
          <div class="trip-dates">
            <CalendarOutlined />
            <span>{{ formatDate(trip.start_date) }} - {{ formatDate(trip.end_date) }}</span>
          </div>
        </div>
        <div class="trip-content">
          <div class="trip-items">
            <div class="trip-item" v-for="item in trip.items" :key="item.id">
              <component :is="getItemIcon(item.type)" class="item-icon" />
              <div class="item-info">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-detail">{{ item.detail }}</div>
              </div>
              <div class="item-price">¥{{ item.price }}</div>
            </div>
          </div>
          <div class="trip-footer">
            <div class="trip-total">
              <span>总计：</span>
              <span class="total-amount">¥{{ trip.total_amount }}</span>
            </div>
            <a-space>
              <a-button @click="viewTripDetail(trip)">查看详情</a-button>
              <a-button v-if="trip.status === 'upcoming'" type="primary" @click="editTrip(trip)">
                编辑行程
              </a-button>
              <a-button v-if="trip.status === 'upcoming'" danger @click="cancelTrip(trip)">
                取消行程
              </a-button>
            </a-space>
          </div>
        </div>
      </a-card>
      <a-empty v-if="filteredTrips.length === 0" description="暂无行程数据" />
    </div>

    <!-- 时间线视图 -->
    <div v-else class="trips-timeline">
      <a-timeline>
        <a-timeline-item v-for="trip in filteredTrips" :key="trip.trip_id" :color="getTimelineColor(trip.status)">
          <div class="timeline-content">
            <div class="timeline-header">
              <h4>{{ trip.title }}</h4>
              <a-tag :color="getStatusColor(trip.status)">{{ getStatusText(trip.status) }}</a-tag>
            </div>
            <div class="timeline-date">
              {{ formatDate(trip.start_date) }} - {{ formatDate(trip.end_date) }}
            </div>
            <div class="timeline-items">
              <a-tag v-for="item in trip.items" :key="item.id" color="blue">{{ item.name }}</a-tag>
            </div>
            <div class="timeline-actions">
              <a-button size="small" @click="viewTripDetail(trip)">查看详情</a-button>
      </div>
      </div>
        </a-timeline-item>
      </a-timeline>
      <a-empty v-if="filteredTrips.length === 0" description="暂无行程数据" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { message } from "ant-design-vue";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  UnorderedListOutlined,
  ScheduleOutlined,
  CarOutlined,
  HomeOutlined,
  CameraOutlined,
} from "@ant-design/icons-vue";
import http from "@/api/http";

const filterStatus = ref("");
const filterDate = ref(null);
const viewMode = ref<"list" | "timeline">("list");

const statistics = reactive({
  total_trips: 0,
  ongoing: 0,
  completed: 0,
  total_spent: 0,
});

const trips = ref<any[]>([]);

const filteredTrips = computed(() => {
  let result = trips.value;
  if (filterStatus.value) {
    result = result.filter((t) => t.status === filterStatus.value);
  }
  if (filterDate.value) {
    const dateStr = filterDate.value.format("YYYY-MM-DD");
    result = result.filter((t) => t.start_date <= dateStr && t.end_date >= dateStr);
  }
  return result;
});

const loadTrips = async () => {
  try {
    // TODO: 对接后端API
    // const response = await http.get("/api/v1/agency/trips");
    // trips.value = response.data || [];
    // updateStatistics();
    
    // 占位数据
    trips.value = [
      {
        trip_id: 1,
        title: "北京三日游",
        start_date: "2024-01-15",
        end_date: "2024-01-17",
        status: "completed",
        total_amount: 5688,
        items: [
          { id: 1, type: "flight", name: "北京往返机票", detail: "经济舱", price: 2888 },
          { id: 2, type: "hotel", name: "北京酒店", detail: "2晚", price: 1800 },
          { id: 3, type: "scenic", name: "故宫门票", detail: "3人", price: 1000 },
        ],
      },
      {
        trip_id: 2,
        title: "上海商务行",
        start_date: "2024-02-01",
        end_date: "2024-02-03",
        status: "upcoming",
        total_amount: 3888,
        items: [
          { id: 4, type: "flight", name: "上海往返机票", detail: "商务舱", price: 2888 },
          { id: 5, type: "hotel", name: "上海酒店", detail: "2晚", price: 1000 },
        ],
      },
    ];
    updateStatistics();
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "加载行程失败");
  }
};

const updateStatistics = () => {
  statistics.total_trips = trips.value.length;
  statistics.ongoing = trips.value.filter((t) => t.status === "ongoing").length;
  statistics.completed = trips.value.filter((t) => t.status === "completed").length;
  statistics.total_spent = trips.value.reduce((sum, t) => sum + t.total_amount, 0);
};

const applyFilter = () => {
  // computed自动处理
};

const resetFilter = () => {
  filterStatus.value = "";
  filterDate.value = null;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    upcoming: "blue",
    ongoing: "green",
    completed: "default",
    cancelled: "red",
  };
  return colors[status] || "default";
};

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    upcoming: "即将开始",
    ongoing: "进行中",
    completed: "已完成",
    cancelled: "已取消",
  };
  return texts[status] || status;
};

const getTimelineColor = (status: string) => {
  const colors: Record<string, string> = {
    upcoming: "blue",
    ongoing: "green",
    completed: "gray",
    cancelled: "red",
  };
  return colors[status] || "blue";
};

const getItemIcon = (type: string) => {
  const icons: Record<string, any> = {
    flight: CarOutlined,
    hotel: HomeOutlined,
    scenic: CameraOutlined,
  };
  return icons[type] || CalendarOutlined;
};

const formatDate = (dateStr: string) => {
  return dateStr;
};

const formatNumber = (num: number) => {
  return num.toLocaleString();
};

const viewTripDetail = (trip: any) => {
  message.info(`查看行程详情：${trip.title}（功能待完善）`);
};

const editTrip = (trip: any) => {
  message.info(`编辑行程：${trip.title}（功能待对接后端）`);
};

const cancelTrip = (trip: any) => {
  message.warning(`取消行程：${trip.title}（功能待对接后端）`);
};

// 初始化加载
loadTrips();
</script>

<style scoped>
.trips-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  margin-bottom: 8px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 48px;
  opacity: 0.1;
  color: var(--primary-color);
}

.filter-card {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.trips-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.trip-card {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: all 0.3s;
}

.trip-card:hover {
  box-shadow: var(--shadow-lg);
}

.trip-ongoing {
  border-left: 4px solid #52c41a;
}

.trip-completed {
  border-left: 4px solid #d9d9d9;
}

.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.trip-title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.trip-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.trip-dates {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
}

.trip-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.trip-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.item-icon {
  font-size: 20px;
  color: var(--primary-color);
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.item-detail {
  font-size: 12px;
  color: var(--text-secondary);
}

.item-price {
  font-weight: 600;
  color: var(--primary-color);
}

.trip-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.trip-total {
  font-size: 16px;
  font-weight: 600;
}

.total-amount {
  font-size: 24px;
  color: var(--primary-color);
  margin-left: 8px;
}

.trips-timeline {
  padding: 24px;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
}

.timeline-content {
  padding-left: 16px;
}

.timeline-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.timeline-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.timeline-date {
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.timeline-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.timeline-actions {
  margin-top: 12px;
}
</style>
