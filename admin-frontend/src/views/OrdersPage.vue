<template>
  <a-card title="订单管理">
    <a-table :columns="columns" :data-source="orders" row-key="order_id" :loading="loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="statusColor(record.status)">{{ record.status }}</a-tag>
        </template>
        <template v-else-if="column.key === 'actions'">
          <a-button size="small" @click="openModal(record)">调整</a-button>
        </template>
        <span v-else>{{ record[column.dataIndex] }}</span>
      </template>
    </a-table>
    <a-modal
      v-model:open="modalOpen"
      title="订单状态调整"
      @ok="handleSubmit"
      :confirm-loading="submitLoading"
    >
      <a-form layout="vertical">
        <a-form-item label="订单状态">
          <a-select v-model:value="form.status">
            <a-select-option value="pending">待支付</a-select-option>
            <a-select-option value="paid">已支付</a-select-option>
            <a-select-option value="cancelled">已取消</a-select-option>
            <a-select-option value="completed">已完成</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="支付状态">
          <a-select v-model:value="form.payment_status">
            <a-select-option value="unpaid">未支付</a-select-option>
            <a-select-option value="paid">已支付</a-select-option>
            <a-select-option value="failed">失败</a-select-option>
            <a-select-option value="refunded">已退款</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="实付金额">
          <a-input-number v-model:value="form.total_amount" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { message } from "ant-design-vue";
import { fetchOrders, updateOrder } from "@/api/resources";

interface Order {
  order_id: number;
  order_no: string;
  total_amount: number;
  status: string;
  payment_status: string;
}

const columns = [
  { title: "订单号", dataIndex: "order_no" },
  { title: "金额", dataIndex: "total_amount" },
  { title: "订单状态", key: "status" },
  { title: "支付状态", dataIndex: "payment_status" },
  { title: "操作", key: "actions" },
];

const orders = ref<Order[]>([]);
const loading = ref(false);
const modalOpen = ref(false);
const submitLoading = ref(false);
const editingId = ref<number | null>(null);
const form = reactive({
  status: "pending",
  payment_status: "unpaid",
  total_amount: 0,
});

const loadData = async () => {
  loading.value = true;
  try {
    const response = await fetchOrders();
    // 后端返回的是 { items: [], total: number, ... } 格式
    orders.value = response.items || response;
  } finally {
    loading.value = false;
  }
};

const openModal = (record: Order) => {
  editingId.value = record.order_id;
  Object.assign(form, record);
  modalOpen.value = true;
};

const handleSubmit = async () => {
  if (!editingId.value) return;
  submitLoading.value = true;
  try {
    await updateOrder(editingId.value, form);
    message.success("更新成功");
    modalOpen.value = false;
    loadData();
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "操作失败");
  } finally {
    submitLoading.value = false;
  }
};

const statusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "green";
    case "cancelled":
      return "red";
    case "completed":
      return "blue";
    default:
      return "gold";
  }
};

onMounted(loadData);
</script>

