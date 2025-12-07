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
      <a-button type="default" @click="exportPDF" :disabled="!hasData">导出PDF</a-button>
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
          <p>已支付订单</p>
          <h2>{{ report.paid_orders }}</h2>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <p>取消订单</p>
          <h2>{{ report.cancelled_orders }}</h2>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <p>平均订单金额</p>
          <h2>¥{{ report.avg_order_value }}</h2>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" style="margin-top: 16px">
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
      <a-col :span="12">
        <a-card>
          <p>净收入</p>
          <h2>¥{{ report.net_income }}</h2>
        </a-card>
      </a-col>
    </a-row>
  </a-card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import dayjs, { Dayjs } from "dayjs";
import { message } from "ant-design-vue";
import { fetchFinancialReport, exportFinancialReportPDF } from "@/api/resources";

const range = ref<{ start: Dayjs; end: Dayjs }>({
  start: dayjs().startOf("month"),
  end: dayjs(),
});

const report = ref({
  order_count: 0,
  total_revenue: 0,
  total_refund: 0,
  net_income: 0,
  paid_orders: 0,
  cancelled_orders: 0,
  avg_order_value: 0,
});

const hasData = computed(() => {
  return report.value.order_count > 0 || report.value.total_revenue > 0;
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

const exportPDF = async () => {
  if (!range.value.start || !range.value.end) {
    return message.warning("请选择日期范围");
  }
  
  try {
    const hideLoading = message.loading("正在生成PDF报表...", 0);
    const response = await exportFinancialReportPDF({
      start_date: range.value.start.format("YYYY-MM-DD"),
      end_date: range.value.end.format("YYYY-MM-DD"),
    });
    
    // 创建下载链接
    const blob = new Blob([response], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `财务报表_${range.value.start.format("YYYYMMDD")}_${range.value.end.format("YYYYMMDD")}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    hideLoading(); // 关闭加载提示
    message.success("PDF报表导出成功");
  } catch (error) {
    console.error("导出PDF失败:", error);
    message.destroy(); // 关闭所有提示，包括加载提示
    message.error("PDF报表导出失败");
  }
};

loadReport();
</script>

