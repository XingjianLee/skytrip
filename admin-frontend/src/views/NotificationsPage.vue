<template>
  <a-card title="通知中心">
    <a-space style="margin-bottom: 16px">
      <a-button type="primary" @click="openModal">发送通知</a-button>
      <a-button @click="loadData">刷新</a-button>
    </a-space>
    <a-table :columns="columns" :data-source="notifications" row-key="notification_id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'actions'">
          <a-popconfirm title="删除?" @confirm="handleDelete(record.notification_id)">
            <a-button size="small" danger>删除</a-button>
          </a-popconfirm>
        </template>
        <span v-else>{{ record[column.dataIndex] }}</span>
      </template>
    </a-table>
    <a-modal v-model:open="modalOpen" title="发送通知" @ok="handleSubmit">
      <a-form layout="vertical">
        <a-form-item label="标题">
          <a-input v-model:value="form.title" />
        </a-form-item>
        <a-form-item label="内容">
          <a-textarea v-model:value="form.content" rows="4" />
        </a-form-item>
        <a-form-item label="目标用户 ID (空为全体)">
          <a-input-number v-model:value="form.target_user_id" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { message } from "ant-design-vue";
import {
  fetchNotifications,
  createNotification,
  deleteNotification,
} from "@/api/resources";

interface Notification {
  notification_id: number;
  title: string;
  content: string;
  target_user_id?: number;
}

const columns = [
  { title: "标题", dataIndex: "title" },
  { title: "内容", dataIndex: "content" },
  { title: "目标用户", dataIndex: "target_user_id" },
  { title: "操作", key: "actions" },
];

const notifications = ref<Notification[]>([]);
const modalOpen = ref(false);
const form = reactive({
  title: "",
  content: "",
  target_user_id: undefined as number | undefined,
});

const loadData = async () => {
  notifications.value = await fetchNotifications();
};

const openModal = () => {
  form.title = "";
  form.content = "";
  form.target_user_id = undefined;
  modalOpen.value = true;
};

const handleSubmit = async () => {
  await createNotification(form);
  message.success("已发送");
  modalOpen.value = false;
  loadData();
};

const handleDelete = async (id: number) => {
  try {
    await deleteNotification(id);
    message.success("已删除");
    await loadData();
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "删除失败");
  }
};

onMounted(loadData);
</script>

