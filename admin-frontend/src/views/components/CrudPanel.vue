<template>
  <a-card :title="title">
    <template #extra>
      <a-space>
        <a-button @click="$emit('refresh')">刷新</a-button>
        <a-button type="primary" @click="openDrawer()">新增</a-button>
      </a-space>
    </template>
    <a-table :columns="tableColumns" :data-source="dataSource" :loading="loading" :row-key="rowKey">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'actions'">
          <a-space>
            <a-button size="small" @click="openDrawer(record)">编辑</a-button>
            <a-popconfirm title="确认删除？" @confirm="$emit('delete', record)">
              <a-button size="small" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
        <span v-else>{{ record[column.dataIndex] }}</span>
      </template>
    </a-table>
    <a-drawer v-model:open="drawerOpen" :title="drawerTitle" width="420px">
      <a-form layout="vertical">
        <template v-for="col in editableColumns" :key="col.dataIndex">
          <a-form-item :label="col.title">
            <component
              :is="resolveInput(col)"
              v-model:value="editingRecord[col.dataIndex]"
              :options="col.options || []"
              :placeholder="col.title"
            />
          </a-form-item>
        </template>
      </a-form>
      <template #extra>
        <a-space>
          <a-button @click="drawerOpen = false">取消</a-button>
          <a-button type="primary" @click="handleSubmit" :loading="submitting">保存</a-button>
        </a-space>
      </template>
    </a-drawer>
  </a-card>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import type { ColumnType } from "ant-design-vue/es/table";

export interface ColumnConfig {
  title: string;
  dataIndex: string;
  editable?: boolean;
  inputType?: "text" | "number" | "select";
  options?: string[];
}

export interface CrudRecord {
  id?: number;
  [key: string]: any;
}

const props = defineProps<{
  title: string;
  columns: ColumnConfig[];
  dataSource: CrudRecord[];
  loading?: boolean;
  rowKey?: string;
}>();

const emit = defineEmits(["refresh", "create", "update", "delete"]);

const drawerOpen = ref(false);
const submitting = ref(false);
const editingRecord = reactive<CrudRecord>({});
const drawerTitle = ref("新增");

const editableColumns = computed(() => props.columns.filter((col) => col.editable));
const tableColumns = computed<ColumnType[]>(() => [
  ...props.columns.map((col) => ({ ...col })),
  { title: "操作", key: "actions" },
]);

const rowKey = computed(() => props.rowKey || "id");

const resolveInput = (col: ColumnConfig) => {
  if (col.inputType === "number") return "a-input-number";
  if (col.inputType === "select") return "a-select";
  return "a-input";
};

const openDrawer = (record?: CrudRecord) => {
  Object.keys(editingRecord).forEach((key) => delete editingRecord[key]);
  if (record) {
    Object.assign(editingRecord, record);
    drawerTitle.value = "编辑";
  } else {
    editableColumns.value.forEach((col) => {
      editingRecord[col.dataIndex] = "";
    });
    drawerTitle.value = "新增";
  }
  drawerOpen.value = true;
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    const key = rowKey.value;
    if (editingRecord[key]) {
      await new Promise<void>((resolve) => {
        emit("update", { ...editingRecord });
        // 给父组件一些时间处理
        setTimeout(resolve, 100);
      });
    } else {
      await new Promise<void>((resolve) => {
        emit("create", { ...editingRecord });
        setTimeout(resolve, 100);
      });
    }
    drawerOpen.value = false;
  } finally {
    submitting.value = false;
  }
};
</script>

