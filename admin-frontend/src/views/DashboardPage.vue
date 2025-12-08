<template>
  <div class="dashboard-container" ref="dashboardContainerRef">
    <!-- 黑科技背景效果 -->
    <div class="tech-background">
      <div class="grid-overlay"></div>
      <div class="particle-layer"></div>
      <div class="data-stream"></div>
    </div>
    
    <!-- 顶部标题和交互按钮 -->
    <div class="dashboard-header">
      <h1 class="dashboard-title">SkyTrip 数据可视化大屏</h1>
      <a-space>
        <a-button type="primary" @click="refreshData">
          <template #icon>
            <ReloadOutlined />
          </template>
          刷新数据
        </a-button>
        <a-button @click="toggleFullScreen">
          <template #icon>
            <FullscreenOutlined />
          </template>
          {{ isFullScreen ? '退出全屏' : '全屏查看' }}
        </a-button>
      </a-space>
    </div>

    <!-- 数据概览卡片 -->
    <div class="overview-cards">
      <div class="card">
        <div class="card-content">
          <div class="card-title">总订单数</div>
          <div class="card-value">{{ overview.totalOrders }}</div>
          <div class="card-change">+{{ overview.orderGrowth }}%</div>
        </div>
        <div class="card-icon orders-icon"></div>
      </div>
      <div class="card">
        <div class="card-content">
          <div class="card-title">总收入</div>
          <div class="card-value">¥{{ overview.totalRevenue }}</div>
          <div class="card-change">+{{ overview.revenueGrowth }}%</div>
        </div>
        <div class="card-icon revenue-icon"></div>
      </div>
      <div class="card">
        <div class="card-content">
          <div class="card-title">活跃用户</div>
          <div class="card-value">{{ overview.activeUsers }}</div>
          <div class="card-change">+{{ overview.userGrowth }}%</div>
        </div>
        <div class="card-icon users-icon"></div>
      </div>
      <div class="card">
        <div class="card-content">
          <div class="card-title">航班数</div>
          <div class="card-value">{{ overview.totalFlights }}</div>
          <div class="card-change">+{{ overview.flightGrowth }}%</div>
        </div>
        <div class="card-icon flights-icon"></div>
      </div>
    </div>

    <!-- 主要图表区域 -->
    <div class="charts-grid">
      <!-- 收入趋势图 -->
      <div class="chart-item large">
        <div class="chart-title">收入趋势</div>
        <v-chart
          class="chart"
          :option="revenueChartOption"
          autoresize
        />
      </div>

      <!-- 订单来源分布图 -->
      <div class="chart-item medium">
        <div class="chart-title">订单来源分布</div>
        <v-chart
          class="chart"
          :option="orderSourceChartOption"
          autoresize
        />
      </div>

      <!-- 用户增长图 -->
      <div class="chart-item medium">
        <div class="chart-title">用户增长</div>
        <v-chart
          class="chart"
          :option="userGrowthChartOption"
          autoresize
        />
      </div>

      <!-- 航班状态分布图 -->
      <div class="chart-item small">
        <div class="chart-title">航班状态分布</div>
        <v-chart
          class="chart"
          :option="flightStatusChartOption"
          autoresize
        />
      </div>

      <!-- 热门目的地 -->
      <div class="chart-item small">
        <div class="chart-title">热门目的地</div>
        <v-chart
          class="chart"
          :option="popularDestinationsChartOption"
          autoresize
        />
      </div>

      <!-- 实时订单监控 -->
      <div class="chart-item large">
        <div class="chart-title">实时订单监控</div>
        <div class="realtime-orders">
          <div v-for="order in realtimeOrders" :key="order.id" class="order-item">
            <div class="order-info">
              <span class="order-id">订单#{{ order.id }}</span>
              <span class="order-amount">¥{{ order.amount }}</span>
            </div>
            <div class="order-status" :class="order.status">{{ order.status }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart, PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import { ReloadOutlined, FullscreenOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { fetchFlights, fetchOrders, fetchUsers } from '@/api/resources';

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent
]);

// 状态管理
const loading = ref(false);
const isFullScreen = ref(false);
const dashboardContainerRef = ref<HTMLElement | null>(null);

// 数据概览
const overview = ref({
  totalOrders: 12845,
  totalRevenue: 8942000,
  activeUsers: 45230,
  totalFlights: 892,
  orderGrowth: 12.5,
  revenueGrowth: 18.2,
  userGrowth: 9.8,
  flightGrowth: 5.3
});

// 实时订单数据
const realtimeOrders = ref([
  { id: '20231125001', amount: 1280, status: 'pending' },
  { id: '20231125002', amount: 2890, status: 'completed' },
  { id: '20231125003', amount: 980, status: 'cancelled' },
  { id: '20231125004', amount: 1650, status: 'completed' },
  { id: '20231125005', amount: 3200, status: 'pending' }
]);

// 收入趋势图配置
const revenueChartOption = computed(() => ({
  backgroundColor: 'transparent',
  title: {
    text: '',
    left: 'left'
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderColor: '#334155',
    textStyle: {
      color: '#f8fafc'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    axisLine: {
      lineStyle: {
        color: '#475569'
      }
    },
    axisLabel: {
      color: '#cbd5e1'
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#475569'
      }
    },
    axisLabel: {
      color: '#cbd5e1'
    },
    splitLine: {
      lineStyle: {
        color: '#334155'
      }
    }
  },
  series: [
    {
      name: '实际收入',
      type: 'line',
      smooth: true,
      data: [450000, 520000, 680000, 720000, 850000, 980000, 1200000, 1350000, 1100000, 1050000, 1280000, 1450000],
      lineStyle: {
        color: '#3b82f6',
        width: 3
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(59, 130, 246, 0.5)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
          ]
        }
      },
      itemStyle: {
        color: '#3b82f6'
      }
    },
    {
      name: '目标收入',
      type: 'line',
      smooth: true,
      data: [400000, 500000, 600000, 700000, 800000, 900000, 1000000, 1200000, 1150000, 1100000, 1250000, 1400000],
      lineStyle: {
        color: '#64748b',
        width: 2,
        type: 'dashed'
      },
      itemStyle: {
        color: '#64748b'
      }
    }
  ],
  legend: {
    data: ['实际收入', '目标收入'],
    top: '0%',
    right: '0%',
    textStyle: {
      color: '#cbd5e1'
    }
  }
}));

// 订单来源分布图配置
const orderSourceChartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderColor: '#334155',
    textStyle: {
      color: '#f8fafc'
    },
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    right: '5%',
    top: 'center',
    textStyle: {
      color: '#cbd5e1'
    }
  },
  series: [
    {
      name: '订单来源',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#0f172a',
        borderWidth: 2
      },
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 18,
          fontWeight: 'bold',
          color: '#f8fafc'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 4200, name: '网站', itemStyle: { color: '#3b82f6' } },
        { value: 2800, name: '移动端', itemStyle: { color: '#10b981' } },
        { value: 1800, name: '旅行社', itemStyle: { color: '#f59e0b' } },
        { value: 1200, name: '其他', itemStyle: { color: '#6366f1' } }
      ]
    }
  ]
}));

// 用户增长图配置
const userGrowthChartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderColor: '#334155',
    textStyle: {
      color: '#f8fafc'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    axisLine: {
      lineStyle: {
        color: '#475569'
      }
    },
    axisLabel: {
      color: '#cbd5e1'
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#475569'
      }
    },
    axisLabel: {
      color: '#cbd5e1'
    },
    splitLine: {
      lineStyle: {
        color: '#334155'
      }
    }
  },
  series: [
    {
      name: '新增用户',
      type: 'bar',
      data: [1200, 1900, 3000, 2400, 3600, 4200, 5800, 6500, 5200, 4800, 6200, 7800],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#10b981' },
            { offset: 1, color: '#059669' }
          ]
        },
        borderRadius: [4, 4, 0, 0]
      }
    }
  ]
}));

// 航班状态分布图配置
const flightStatusChartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderColor: '#334155',
    textStyle: {
      color: '#f8fafc'
    },
    formatter: '{b}: {c} ({d}%)'
  },
  series: [
    {
      name: '航班状态',
      type: 'pie',
      radius: ['50%', '70%'],
      center: ['50%', '50%'],
      itemStyle: {
        borderRadius: 10,
        borderColor: '#0f172a',
        borderWidth: 2
      },
      label: {
        color: '#cbd5e1',
        formatter: '{b}: {d}%'
      },
      data: [
        { value: 680, name: '正常', itemStyle: { color: '#10b981' } },
        { value: 120, name: '延误', itemStyle: { color: '#f59e0b' } },
        { value: 70, name: '取消', itemStyle: { color: '#ef4444' } },
        { value: 22, name: '其他', itemStyle: { color: '#6366f1' } }
      ]
    }
  ]
}));

// 热门目的地配置
const popularDestinationsChartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderColor: '#334155',
    textStyle: {
      color: '#f8fafc'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#475569'
      }
    },
    axisLabel: {
      color: '#cbd5e1'
    },
    splitLine: {
      lineStyle: {
        color: '#334155'
      }
    }
  },
  yAxis: {
    type: 'category',
    data: ['上海', '北京', '广州', '深圳', '杭州', '成都', '西安', '重庆'],
    axisLine: {
      lineStyle: {
        color: '#475569'
      }
    },
    axisLabel: {
      color: '#cbd5e1'
    }
  },
  series: [
    {
      name: '订单量',
      type: 'bar',
      data: [1850, 1720, 1580, 1450, 1280, 1120, 980, 850],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#3b82f6' },
            { offset: 1, color: '#6366f1' }
          ]
        },
        borderRadius: [0, 4, 4, 0]
      }
    }
  ]
}));

// 刷新数据
const refreshData = async () => {
  loading.value = true;
  try {
    const loadingMessage = message.loading('正在刷新数据...', 0);
    // 这里可以添加实际的数据获取逻辑
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadingMessage(); // 关闭loading消息
    message.success('数据刷新成功');
  } catch (error) {
    message.error('数据刷新失败');
  } finally {
    loading.value = false;
  }
};

// 全屏切换 - 只全屏数据大屏容器
const toggleFullScreen = async () => {
  const container = dashboardContainerRef.value;
  if (!container) return;

  if (!isFullScreen.value) {
    try {
      if (container.requestFullscreen) {
        await container.requestFullscreen();
      } else if ((container as any).msRequestFullscreen) {
        await (container as any).msRequestFullscreen();
      } else if ((container as any).mozRequestFullScreen) {
        await (container as any).mozRequestFullScreen();
      } else if ((container as any).webkitRequestFullscreen) {
        await (container as any).webkitRequestFullscreen();
      }
      isFullScreen.value = true;
    } catch (error) {
      console.error('全屏失败:', error);
    }
  } else {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      }
      isFullScreen.value = false;
    } catch (error) {
      console.error('退出全屏失败:', error);
    }
  }
};

// 监听全屏状态变化
const handleFullScreenChange = () => {
  const container = dashboardContainerRef.value;
  if (container) {
    isFullScreen.value = !!(
      document.fullscreenElement === container ||
      (document as any).msFullscreenElement === container ||
      (document as any).mozFullScreenElement === container ||
      (document as any).webkitFullscreenElement === container
    );
  }
};

// 组件挂载时初始化
onMounted(() => {
  // 添加全屏监听
  document.addEventListener('fullscreenchange', handleFullScreenChange);
  document.addEventListener('MSFullscreenChange', handleFullScreenChange);
  document.addEventListener('mozfullscreenchange', handleFullScreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullScreenChange);

  // 初始加载数据
  refreshData();
});
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  height: 100%;
  padding: 24px;
  background: #0a0e27;
  color: #f8fafc;
  overflow: auto;
  position: relative;
  background-attachment: fixed;
}

/* 响应式布局 - 基础样式 */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .dashboard-title {
    font-size: 24px;
  }
}

/* 黑科技背景效果 */
.tech-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
}

/* 网格覆盖层 */
.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
  opacity: 0.3;
}

@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

/* 粒子层 */
.particle-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(2px 2px at 20% 30%, rgba(99, 102, 241, 0.8), transparent),
    radial-gradient(2px 2px at 60% 70%, rgba(236, 72, 153, 0.8), transparent),
    radial-gradient(1px 1px at 50% 50%, rgba(139, 92, 246, 0.6), transparent),
    radial-gradient(1px 1px at 80% 10%, rgba(6, 182, 212, 0.6), transparent),
    radial-gradient(2px 2px at 90% 40%, rgba(99, 102, 241, 0.7), transparent),
    radial-gradient(1px 1px at 33% 60%, rgba(236, 72, 153, 0.5), transparent),
    radial-gradient(2px 2px at 55% 80%, rgba(139, 92, 246, 0.7), transparent);
  background-size: 200% 200%;
  animation: particleMove 15s ease-in-out infinite;
  opacity: 0.6;
}

@keyframes particleMove {
  0%, 100% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
}

/* 数据流效果 */
.data-stream {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.1) 50%, transparent 100%),
    linear-gradient(0deg, transparent 0%, rgba(236, 72, 153, 0.1) 50%, transparent 100%);
  background-size: 200% 200%;
  animation: dataStream 10s linear infinite;
  opacity: 0.4;
}

@keyframes dataStream {
  0% {
    background-position: 0% 0%, 0% 0%;
  }
  100% {
    background-position: 100% 100%, 100% 100%;
  }
}

.dashboard-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.06) 0%, transparent 50%);
  z-index: 0;
  animation: pulse 12s ease-in-out infinite;
}

.dashboard-container > * {
  position: relative;
  z-index: 1;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #334155;
}

.dashboard-title {
  font-size: 32px;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #f472b6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  text-shadow: 0 0 30px rgba(129, 140, 248, 0.3);
  animation: fadeIn var(--transition-slow);
}

/* 数据概览卡片样式 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

/* 响应式布局 - 数据概览卡片 */
@media (max-width: 1200px) {
  .overview-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .overview-cards {
    grid-template-columns: 1fr;
  }
}

.card {
  position: relative;
  display: flex;
  align-items: center;
  padding: 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: var(--blur-md);
  -webkit-backdrop-filter: var(--blur-md);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-base);
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--primary-gradient);
  transform: scaleX(0);
  transition: transform var(--transition-base);
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-2xl);
  border-color: rgba(129, 140, 248, 0.5);
  background: rgba(255, 255, 255, 0.15);
}

.card:hover::before {
  transform: scaleX(1);
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-value {
  font-size: 36px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 4px;
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.card-change {
  font-size: 13px;
  color: #34d399;
  font-weight: 600;
  background: rgba(16, 185, 129, 0.2);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  display: inline-block;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-md);
  margin-left: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: var(--shadow-sm);
}

.orders-icon {
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}

.revenue-icon {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(6, 182, 212, 0.4);
}

.users-icon {
  background: linear-gradient(135deg, #f472b6 0%, #ec4899 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);
}

.flights-icon {
  background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}

/* 图表区域样式 */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto auto;
  gap: 20px;
}

/* 响应式布局 - 图表区域 */
@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .chart-item.large {
    grid-column: span 2;
  }
  
  .chart-item.medium,
  .chart-item.small {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-item.large,
  .chart-item.medium,
  .chart-item.small {
    grid-column: span 1;
  }
}

.chart-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: var(--blur-md);
  -webkit-backdrop-filter: var(--blur-md);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-xl);
  padding: 24px;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.chart-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-gradient);
  transform: scaleX(0);
  transition: transform var(--transition-base);
}

.chart-item:hover {
  box-shadow: var(--shadow-2xl);
  border-color: rgba(129, 140, 248, 0.5);
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.chart-item:hover::before {
  transform: scaleX(1);
}

.chart-item.large {
  grid-column: span 2;
}

.chart-item.medium {
  grid-column: span 1;
}

.chart-item.small {
  grid-column: span 1;
}

.chart-title {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.3px;
}

.chart {
  width: 100%;
  height: 300px;
}

/* 响应式布局 - 图表高度 */
@media (max-width: 768px) {
  .chart {
    height: 250px;
  }
  
  .realtime-orders {
    height: 300px;
  }
}

.realtime-orders {
  height: 350px;
  overflow-y: auto;
  border-radius: var(--radius-md);
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: var(--blur-sm);
  -webkit-backdrop-filter: var(--blur-sm);
  border-radius: var(--radius-lg);
  border-left: 4px solid;
  border-image: var(--primary-gradient) 1;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);
}

.order-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(6px);
  box-shadow: var(--shadow-lg);
  border-left-width: 6px;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-id {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.order-amount {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.order-status {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  box-shadow: var(--shadow-sm);
}

.order-status.pending {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.order-status.completed {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.order-status.cancelled {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-item.large {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }

  .overview-cards {
    grid-template-columns: 1fr;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-item.large,
  .chart-item.medium,
  .chart-item.small {
    grid-column: span 1;
  }
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.8);
}

</style>