<template>
  <a-card title="财务报表">
    <a-form layout="inline" @submit.prevent="loadReport">
      <a-form-item label="开始日期">
        <a-date-picker v-model:value="range.start" />
      </a-form-item>
      <a-form-item label="结束日期">
        <a-date-picker v-model:value="range.end" />
      </a-form-item>
      <a-button type="primary" @click="loadReport">查询</a-button>
    </a-form>

    <a-row :gutter="16" style="margin-top: 24px">
      <a-col :span="6">
        <a-card>
          <p>订单数量</p>
          <h2>{{ report.order_count }}</h2>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <p>总收入</p>
          <h2>¥{{ report.total_revenue }}</h2>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <p>退款总额</p>
          <h2>¥{{ report.total_refund }}</h2>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <p>净收入</p>
          <h2>¥{{ report.net_income }}</h2>
        </a-card>
      </a-col>
    </a-row>
  </a-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import dayjs, { Dayjs } from "dayjs";
import { message } from "ant-design-vue";
import { fetchFinancialReport } from "@/api/resources";

const range = ref<{ start: Dayjs; end: Dayjs }>({
  start: dayjs().startOf("month"),
  end: dayjs(),
});

const report = ref({
  order_count: 0,
  total_revenue: 0,
  total_refund: 0,
  net_income: 0,
});

const loadReport = async () => {
  if (!range.value.start || !range.value.end) {
    return message.warning("请选择日期范围");
  }
  const data = await fetchFinancialReport({
    start_date: range.value.start.format("YYYY-MM-DD"),
    end_date: range.value.end.format("YYYY-MM-DD"),
  });
  report.value = data;
};

loadReport();
</script>

