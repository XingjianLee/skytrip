<template>
  <CrudPanel
    title="酒店管理"
    :columns="columns"
    :data-source="hotels"
    :loading="loading"
    row-key="hotel_id"
    @refresh="loadData"
    @create="handleCreate"
    @update="handleUpdate"
    @delete="handleDelete"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import CrudPanel, { ColumnConfig, CrudRecord } from "@/views/components/CrudPanel.vue";
import { fetchHotels, createHotel, updateHotel, deleteHotel } from "@/api/resources";

interface Hotel extends CrudRecord {
  hotel_id?: number;
  name: string;
  city: string;
  star_rating: number;
  status: string;
  lowest_price?: number;
}

const columns: ColumnConfig[] = [
  { title: "名称", dataIndex: "name", editable: true },
  { title: "城市", dataIndex: "city", editable: true },
  { title: "星级", dataIndex: "star_rating", editable: true },
  { title: "状态", dataIndex: "status", editable: true, inputType: "select", options: ["active", "inactive"] },
  { title: "最低价", dataIndex: "lowest_price", editable: true },
];

const hotels = ref<Hotel[]>([]);
const loading = ref(false);

const loadData = async () => {
  loading.value = true;
  try {
    hotels.value = await fetchHotels();
  } finally {
    loading.value = false;
  }
};

const handleCreate = async (record: Hotel) => {
  try {
    // 确保必填字段存在
    if (!record.name || !record.city) {
      message.error("名称和城市为必填项");
      return;
    }
    await createHotel(record);
    message.success("创建成功");
    await loadData();
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "创建失败");
  }
};

const handleUpdate = async (record: Hotel) => {
  if (!record.hotel_id) return;
  try {
    await updateHotel(record.hotel_id, record);
    message.success("更新成功");
    await loadData();
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "更新失败");
  }
};

const handleDelete = async (record: Hotel) => {
  if (!record.hotel_id) return;
  await deleteHotel(record.hotel_id);
  message.success("删除成功");
  loadData();
};

onMounted(loadData);
</script>

