<template>
  <div class="orders-page">
    <h2 class="page-title">订单管理</h2>

    <!-- 筛选与导出 -->
    <a-card class="filters-card">
      <a-form layout="inline" :model="filters">
        <a-form-item label="订单号">
          <a-input v-model:value="filters.order_no" placeholder="支持模糊搜索" allow-clear />
        </a-form-item>
        <a-form-item label="订单状态">
          <a-select v-model:value="filters.status" allow-clear style="width: 140px">
            <a-select-option value="pending">待支付</a-select-option>
            <a-select-option value="paid">已支付</a-select-option>
            <a-select-option value="completed">已完成</a-select-option>
            <a-select-option value="cancelled">已取消</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="支付状态">
          <a-select v-model:value="filters.payment_status" allow-clear style="width: 140px">
            <a-select-option value="unpaid">未支付</a-select-option>
            <a-select-option value="paid">已支付</a-select-option>
            <a-select-option value="refunded">已退款</a-select-option>
            <a-select-option value="failed">支付失败</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="下单时间">
          <a-range-picker
            v-model:value="filters.range"
            value-format="YYYY-MM-DD"
            style="width: 260px"
          />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="applyFilters">查询</a-button>
            <a-button @click="resetFilters">重置</a-button>
            <a-button type="dashed" @click="exportOrders">导出报表（占位）</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card>
      <a-table
        :columns="columns"
        :data-source="filteredOrders"
        :loading="loading"
        :pagination="{ pageSize: 10 }"
        row-key="order_id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</a-tag>
          </template>
          <template v-else-if="column.key === 'payment_status'">
            <a-tag :color="getPaymentStatusColor(record.payment_status)">
              {{ getPaymentStatusText(record.payment_status) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'total_amount'">
            ¥{{ record.total_amount.toFixed(2) }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="viewDetail(record)">详情</a-button>
              <a-button type="link">导出行程单（占位）</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:open="detailModalOpen"
      title="订单详情"
      :footer="null"
      width="820px"
    >
      <div v-if="orderDetail">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="订单号">{{ orderDetail.order_no }}</a-descriptions-item>
          <a-descriptions-item label="订单状态">
            <a-tag :color="getStatusColor(orderDetail.status)">{{ getStatusText(orderDetail.status) }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="支付状态">
            <a-tag :color="getPaymentStatusColor(orderDetail.payment_status)">
              {{ getPaymentStatusText(orderDetail.payment_status) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="支付方式">{{ orderDetail.payment_method }}</a-descriptions-item>
          <a-descriptions-item label="原价总额">¥{{ orderDetail.total_amount_original.toFixed(2) }}</a-descriptions-item>
          <a-descriptions-item label="实付金额">¥{{ orderDetail.total_amount.toFixed(2) }}</a-descriptions-item>
          <a-descriptions-item label="创建时间">{{ orderDetail.created_at }}</a-descriptions-item>
          <a-descriptions-item label="过期时间">{{ orderDetail.expired_at }}</a-descriptions-item>
        </a-descriptions>

        <a-divider>订单明细</a-divider>
        <a-table
          :columns="itemColumns"
          :data-source="orderDetail.items"
          :pagination="false"
          size="small"
        />
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import http from "@/api/http";
import dayjs, { Dayjs } from "dayjs";

const loading = ref(false);
const orders = ref([]);
const filteredOrders = ref([]);
const detailModalOpen = ref(false);
const orderDetail = ref<any>(null);
const filters = ref<{
  order_no: string;
  status?: string;
  payment_status?: string;
  range: [string, string] | null;
}>({
  order_no: "",
  status: undefined,
  payment_status: undefined,
  range: null,
});

const columns = [
  { title: "订单号", dataIndex: "order_no", key: "order_no" },
  { title: "订单状态", key: "status" },
  { title: "支付状态", key: "payment_status" },
  { title: "金额", key: "total_amount" },
  { title: "创建时间", dataIndex: "created_at", key: "created_at" },
  { title: "操作", key: "action" },
];

const itemColumns = [
  { title: "航班ID", dataIndex: "flight_id", key: "flight_id" },
  { title: "舱位", dataIndex: "cabin_class", key: "cabin_class" },
  { title: "乘客ID", dataIndex: "passenger_id", key: "passenger_id" },
  { title: "原价", dataIndex: "original_price", key: "original_price" },
  { title: "实付", dataIndex: "paid_price", key: "paid_price" },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: "orange",
    paid: "green",
    cancelled: "red",
    completed: "blue",
  };
  return colors[status] || "default";
};

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: "待支付",
    paid: "已支付",
    cancelled: "已取消",
    completed: "已完成",
  };
  return texts[status] || status;
};

const getPaymentStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    unpaid: "orange",
    paid: "green",
    refunded: "red",
    failed: "red",
  };
  return colors[status] || "default";
};

const getPaymentStatusText = (status: string) => {
  const texts: Record<string, string> = {
    unpaid: "未支付",
    paid: "已支付",
    refunded: "已退款",
    failed: "支付失败",
  };
  return texts[status] || status;
};

const loadOrders = async () => {
  loading.value = true;
  try {
    const response = await http.get("/api/v1/agency/orders");
    orders.value = response;
    filteredOrders.value = response;
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "加载订单失败");
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  const list = orders.value as any[];
  const keyword = (filters.value.order_no || "").toLowerCase();
  filteredOrders.value = list.filter((o) => {
    const matchNo = keyword ? o.order_no?.toLowerCase().includes(keyword) : true;
    const matchStatus = filters.value.status ? o.status === filters.value.status : true;
    const matchPay = filters.value.payment_status ? o.payment_status === filters.value.payment_status : true;
    const matchRange = filters.value.range
      ? dayjs(o.created_at).isAfter(dayjs(filters.value.range[0]).startOf("day")) &&
        dayjs(o.created_at).isBefore(dayjs(filters.value.range[1]).endOf("day"))
      : true;
    return matchNo && matchStatus && matchPay && matchRange;
  });
};

const resetFilters = () => {
  filters.value = {
    order_no: "",
    status: undefined,
    payment_status: undefined,
    range: null,
  };
  filteredOrders.value = orders.value;
};

const exportOrders = () => {
  message.info("导出报表功能占位，如需真实导出请提供接口/格式要求");
};

const viewDetail = async (order: any) => {
  try {
    const response = await http.get(`/api/v1/agency/orders/${order.order_id}`);
    orderDetail.value = response;
    detailModalOpen.value = true;
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "加载订单详情失败");
  }
};

onMounted(() => {
  loadOrders();
});
</script>

<style scoped>
.orders-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--text-primary);
}

.filters-card {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
</style>

