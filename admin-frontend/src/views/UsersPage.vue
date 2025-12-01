<template>
  <a-card title="用户管理">
    <a-table :columns="columns" :data-source="users" row-key="id" :loading="loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'actions'">
          <a-switch
            :checked="!record.is_frozen"
            checked-children="正常"
            un-checked-children="冻结"
            @change="(val) => handleToggle(record, !val)"
          />
        </template>
        <span v-else>{{ record[column.dataIndex] }}</span>
      </template>
    </a-table>
  </a-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { message } from "ant-design-vue";
import { fetchUsers, toggleUserState } from "@/api/resources";

interface User {
  id: number;
  username: string;
  role: string;
  phone?: string;
  id_card?: string;
  is_frozen: boolean;
}

const columns = [
  { title: "ID", dataIndex: "id" },
  { title: "用户名", dataIndex: "username" },
  { title: "角色", dataIndex: "role" },
  { title: "手机号", dataIndex: "phone" },
  { title: "证件号", dataIndex: "id_card" },
  { title: "操作", key: "actions" },
];

const users = ref<User[]>([]);
const loading = ref(false);

const loadData = async () => {
  loading.value = true;
  try {
    users.value = await fetchUsers();
  } finally {
    loading.value = false;
  }
};

const handleToggle = async (user: User, freeze: boolean) => {
  try {
    await toggleUserState(user.id, freeze);
    message.success(freeze ? "已冻结" : "已解冻");
    await loadData();
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "操作失败");
    // 恢复开关状态
    await loadData();
  }
};

onMounted(loadData);
</script>

