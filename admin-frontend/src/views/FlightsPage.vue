<template>
  <a-space direction="vertical" size="large" style="width: 100%">
    <a-space>
      <a-button type="primary" @click="openModal()">新增航班</a-button>
      <a-button @click="loadData">刷新</a-button>
    </a-space>
    <a-table :columns="columns" :data-source="flights" row-key="flight_id" :loading="loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'actions'">
          <a-space>
            <a-button size="small" @click="openModal(record)">编辑</a-button>
            <a-popconfirm title="确认删除？" @confirm="handleDelete(record.flight_id)">
              <a-button size="small" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
        <template v-else>
          {{ record[column.dataIndex as keyof Flight] }}
        </template>
      </template>
    </a-table>
    <a-modal v-model:open="modalOpen" title="航班信息" @ok="handleSubmit" :confirm-loading="submitLoading">
      <a-form layout="vertical">
        <a-form-item label="航班号">
          <a-input v-model:value="form.flight_number" />
        </a-form-item>
        <a-form-item label="所属航司代码">
          <a-input v-model:value="form.airline_code" />
        </a-form-item>
        <a-form-item label="航线ID">
          <a-input-number v-model:value="form.route_id" style="width: 100%" />
        </a-form-item>
        <a-form-item label="计划起飞/到达">
          <a-space>
            <a-time-picker
              v-model:value="form.scheduled_departure_time"
              valueFormat="HH:mm:ss"
              format="HH:mm:ss"
            />
            <a-time-picker
              v-model:value="form.scheduled_arrival_time"
              valueFormat="HH:mm:ss"
              format="HH:mm:ss"
            />
          </a-space>
        </a-form-item>
        <a-form-item label="舱位座位">
          <a-space>
            <a-input-number v-model:value="form.economy_seats" addon-before="经济" />
            <a-input-number v-model:value="form.business_seats" addon-before="公务" />
            <a-input-number v-model:value="form.first_seats" addon-before="头等" />
          </a-space>
        </a-form-item>
        <a-form-item label="运营状态">
          <a-select v-model:value="form.status">
            <a-select-option value="active">Active</a-select-option>
            <a-select-option value="suspended">Suspended</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-space>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { message } from "ant-design-vue";
import {
  fetchFlights,
  createFlight,
  updateFlight,
  deleteFlight,
} from "@/api/resources";

interface Flight {
  flight_id?: number;
  flight_number: string;
  airline_code: string;
  route_id: number;
  aircraft_type?: string;
  economy_seats: number;
  business_seats: number;
  first_seats: number;
  operating_days: string;
  status: string;
  scheduled_departure_time: string;
  scheduled_arrival_time: string;
}

const columns = [
  { title: "航班号", dataIndex: "flight_number" },
  { title: "航线ID", dataIndex: "route_id" },
  { title: "经济舱", dataIndex: "economy_seats" },
  { title: "公务舱", dataIndex: "business_seats" },
  { title: "头等舱", dataIndex: "first_seats" },
  { title: "状态", dataIndex: "status" },
  { title: "操作", key: "actions" },
];

const flights = ref<Flight[]>([]);
const loading = ref(false);
const modalOpen = ref(false);
const submitLoading = ref(false);
const editingId = ref<number | null>(null);
const form = reactive<Flight>({
  flight_number: "",
  airline_code: "",
  route_id: 0,
  economy_seats: 120,
  business_seats: 30,
  first_seats: 10,
  operating_days: "1111111",
  status: "active",
  scheduled_departure_time: "08:00:00",
  scheduled_arrival_time: "10:00:00",
});

const loadData = async () => {
  loading.value = true;
  try {
    flights.value = await fetchFlights();
  } finally {
    loading.value = false;
  }
};

const openModal = (record?: Flight) => {
  if (record) {
    Object.assign(form, record);
    editingId.value = record.flight_id || null;
  } else {
    Object.assign(form, {
      flight_number: "",
      airline_code: "",
      route_id: 0,
      economy_seats: 120,
      business_seats: 30,
      first_seats: 10,
      operating_days: "1111111",
      status: "active",
      scheduled_departure_time: "08:00:00",
      scheduled_arrival_time: "10:00:00",
    });
    editingId.value = null;
  }
  modalOpen.value = true;
};

const handleSubmit = async () => {
  submitLoading.value = true;
  try {
    const payload = { ...form };
    if (editingId.value) {
      await updateFlight(editingId.value, payload);
      message.success("更新成功");
    } else {
      await createFlight(payload);
      message.success("创建成功");
    }
    modalOpen.value = false;
    await loadData();
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "操作失败");
  } finally {
    submitLoading.value = false;
  }
};

const handleDelete = async (id: number) => {
  try {
    await deleteFlight(id);
    message.success("已删除");
    await loadData();
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "删除失败");
  }
};

onMounted(loadData);
</script>

