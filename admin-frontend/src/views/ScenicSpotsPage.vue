<template>
  <CrudPanel
    title="景点管理"
    :columns="columns"
    :data-source="spots"
    :loading="loading"
    row-key="spot_id"
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
import {
  fetchScenicSpots,
  createScenicSpot,
  updateScenicSpot,
  deleteScenicSpot,
} from "@/api/resources";

interface ScenicSpot extends CrudRecord {
  spot_id?: number;
  name: string;
  city: string;
  ticket_price?: number;
  status: string;
}

const columns: ColumnConfig[] = [
  { title: "名称", dataIndex: "name", editable: true },
  { title: "城市", dataIndex: "city", editable: true },
  { title: "票价", dataIndex: "ticket_price", editable: true },
  {
    title: "状态",
    dataIndex: "status",
    editable: true,
    inputType: "select",
    options: ["active", "inactive"],
  },
];

const spots = ref<ScenicSpot[]>([]);
const loading = ref(false);

const loadData = async () => {
  loading.value = true;
  try {
    spots.value = await fetchScenicSpots();
  } finally {
    loading.value = false;
  }
};

const handleCreate = async (record: ScenicSpot) => {
  try {
    // 确保必填字段存在
    if (!record.name || !record.city) {
      message.error("名称和城市为必填项");
      return;
    }
    await createScenicSpot(record);
    message.success("创建成功");
    await loadData();
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "创建失败");
  }
};

const handleUpdate = async (record: ScenicSpot) => {
  if (!record.spot_id) return;
  try {
    await updateScenicSpot(record.spot_id, record);
    message.success("更新成功");
    await loadData();
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "更新失败");
  }
};

const handleDelete = async (record: ScenicSpot) => {
  if (!record.spot_id) return;
  await deleteScenicSpot(record.spot_id);
  message.success("删除成功");
  loadData();
};

onMounted(loadData);
</script>

