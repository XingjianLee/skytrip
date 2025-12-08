<template>
  <div class="customers-page">
    <h2 class="page-title">乘机人 / 客户管理</h2>

    <!-- 顶部说明 -->
    <a-alert
      type="info"
      show-icon
      style="margin-bottom: 16px"
      message="提示"
      description="可批量导入常旅客，便于团购/下单时快速选择。上传仅占位，需后端支持时请提供接口。"
    />

    <!-- 导入/导出工具条 -->
    <a-card class="toolbar-card">
      <a-space>
        <a-button type="primary" @click="downloadTemplate">下载模板（CSV/Excel）</a-button>
        <a-upload :before-upload="beforeUpload" :show-upload-list="false">
          <a-button>上传批量乘机人（占位）</a-button>
        </a-upload>
        <a-button @click="syncToBulkOrder">同步到团购单（占位）</a-button>
      </a-space>
      <a-space style="margin-left: auto">
        <a-input-search
          v-model:value="keyword"
          placeholder="搜索姓名/证件号/手机号"
          allow-clear
          style="width: 240px"
          @search="applyFilter"
        />
      </a-space>
    </a-card>

    <!-- 列表 -->
    <a-card>
      <a-table
        :columns="columns"
        :data-source="filteredCustomers"
        :pagination="{ pageSize: 10 }"
        row-key="id_card"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'tag'">
            <a-tag color="blue" v-if="record.is_frequent">常旅客</a-tag>
            <a-tag color="green" v-else>新客户</a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="prefill(record)">快速填充到团购单（占位）</a-button>
              <a-button type="link" danger @click="remove(record)">删除（占位）</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { message } from "ant-design-vue";

const customers = ref([
  { name: "张三", id_card: "110101199001011234", phone: "13800000001", email: "zhangsan@example.com", is_frequent: true },
  { name: "李四", id_card: "110101199202022345", phone: "13900000002", email: "", is_frequent: false },
]);

const keyword = ref("");
const filteredCustomers = computed(() => {
  const k = keyword.value.trim().toLowerCase();
  if (!k) return customers.value;
  return customers.value.filter(
    (c) =>
      c.name?.toLowerCase().includes(k) ||
      c.id_card?.toLowerCase().includes(k) ||
      c.phone?.toLowerCase().includes(k)
  );
});

const columns = [
  { title: "姓名", dataIndex: "name", key: "name" },
  { title: "身份证号", dataIndex: "id_card", key: "id_card" },
  { title: "手机号", dataIndex: "phone", key: "phone" },
  { title: "邮箱", dataIndex: "email", key: "email" },
  { title: "标签", key: "tag" },
  { title: "操作", key: "action" },
];

const beforeUpload = () => {
  message.info("上传占位，需对接后端解析接口后生效");
  return false;
};

const downloadTemplate = () => {
  message.info("模板下载占位：请提供后端静态模板文件路径");
};

const applyFilter = () => {
  // computed 已自动过滤
};

const prefill = (_record: any) => {
  message.success("已将乘机人信息准备好，可在团购单中粘贴/选择（占位）");
};

const remove = (_record: any) => {
  message.info("删除占位，需对接后端后生效");
};

const syncToBulkOrder = () => {
  message.info("同步占位，需与团购单接口对接后生效");
};
</script>

<style scoped>
.customers-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.toolbar-card {
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
</style>

