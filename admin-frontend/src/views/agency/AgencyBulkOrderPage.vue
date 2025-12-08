<template>
  <div class="bulk-page">
    <!-- Hero 提示与关键卖点 -->
    <div class="hero">
      <div class="hero-left">
        <div class="hero-eyebrow">旅行社团购 · 阶梯折扣 · 最低10人</div>
        <div class="hero-title">批量购票，一键成团</div>
        <div class="hero-sub">
          同航班 · 10人起享95折，50人可至8折；支持线下支付与发票报销单导出
        </div>
        <div class="hero-actions">
          <a-button type="primary" size="large" @click="router.push('/agency/flights')">去查航班</a-button>
          <a-button size="large" ghost @click="loadFlightInfo">刷新航班</a-button>
        </div>
        <div class="hero-tags">
          <a-tag color="green">实时余票</a-tag>
          <a-tag color="blue">团体价格自动计算</a-tag>
          <a-tag color="gold">支持线下支付</a-tag>
        </div>
      </div>
      <div class="hero-right">
        <div class="hero-stat">
          <div class="stat-label">最低人数</div>
          <div class="stat-value">10 人</div>
          <div class="stat-desc">同一航班即可成团</div>
        </div>
        <div class="hero-stat">
          <div class="stat-label">折扣幅度</div>
          <div class="stat-value">95%-80%</div>
          <div class="stat-desc">人数越多折扣越大</div>
        </div>
        <div class="hero-stat">
          <div class="stat-label">单批上限</div>
          <div class="stat-value">50 人</div>
          <div class="stat-desc">超出请分批下单</div>
        </div>
      </div>
    </div>

    <!-- 航班选择 -->
    <a-card class="section-card" title="选择航班">
      <a-alert
        message="团体票要求"
        description="同一航班、同一舱位集合，10人起享95折，20人9折，30人8.5折，50人8折"
        type="info"
        show-icon
        style="margin-bottom: 16px"
      />
      <a-form layout="inline">
        <a-form-item label="航班ID">
          <a-input-number
            v-model:value="selectedFlightId"
            :min="1"
            placeholder="输入航班ID"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="loadFlightInfo">查询航班</a-button>
        </a-form-item>
        <a-form-item>
          <a-button @click="router.push('/agency/flights')" type="link">去搜索更多航班</a-button>
        </a-form-item>
      </a-form>

      <div v-if="flightInfo" class="flight-info">
        <a-descriptions :column="2" bordered size="small">
          <a-descriptions-item label="航班号">{{ flightInfo.flight_number }}</a-descriptions-item>
          <a-descriptions-item label="航空公司">{{ flightInfo.airline }}</a-descriptions-item>
          <a-descriptions-item label="出发城市">{{ flightInfo.departure_city }}</a-descriptions-item>
          <a-descriptions-item label="到达城市">{{ flightInfo.arrival_city }}</a-descriptions-item>
          <a-descriptions-item label="出发时间">{{ flightInfo.departure_time }}</a-descriptions-item>
          <a-descriptions-item label="到达时间">{{ flightInfo.arrival_time }}</a-descriptions-item>
        </a-descriptions>
      </div>
    </a-card>

    <!-- 乘机人信息 -->
    <a-card class="section-card" title="乘机人信息">
      <template #extra>
        <a-space>
          <a-button @click="addPassenger">添加乘机人</a-button>
          <a-button type="dashed" @click="addTemplatePassengers(10)">快速添加 10 人占位</a-button>
          <a-button @click="downloadTemplate">下载模板</a-button>
          <a-upload :before-upload="beforeUpload" :show-upload-list="false">
            <a-button type="default">上传乘机人表（占位）</a-button>
          </a-upload>
        </a-space>
      </template>

      <a-table
        :columns="passengerColumns"
        :data-source="passengers"
        :pagination="false"
        row-key="index"
        size="middle"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'cabin_class'">
            <a-select v-model:value="record.cabin_class" style="width: 110px" @change="calculateDiscount">
              <a-select-option value="economy">经济舱</a-select-option>
              <a-select-option value="business">商务舱</a-select-option>
              <a-select-option value="first">头等舱</a-select-option>
            </a-select>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-button type="link" danger @click="removePassenger(index)">删除</a-button>
          </template>
        </template>
      </a-table>

      <div class="passenger-count">
        当前人数: {{ passengers.length }} 人
        <span v-if="passengers.length < 10" class="warn">
          （至少需要10人才能享受团体票优惠）
        </span>
        <span v-else-if="passengers.length > 50" class="warn">
          （超过50人，请分批下单）
        </span>
      </div>
    </a-card>

    <!-- 订单信息 -->
    <a-card class="section-card" title="订单信息">
      <a-form :model="orderForm" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="联系人姓名" required>
              <a-input v-model:value="orderForm.contact_name" placeholder="请输入联系人姓名" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="联系人电话" required>
              <a-input v-model:value="orderForm.contact_phone" placeholder="请输入联系人电话" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="联系人邮箱">
              <a-input v-model:value="orderForm.contact_email" placeholder="可选" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="支付方式">
          <a-radio-group v-model:value="orderForm.payment_method">
            <a-radio value="alipay">支付宝</a-radio>
            <a-radio value="wechat">微信支付</a-radio>
            <a-radio value="unionpay">银联</a-radio>
            <a-radio value="offline">线下支付</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="orderForm.notes" :rows="3" placeholder="可选，填写特殊要求或备注信息" />
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 价格汇总 -->
    <a-card class="section-card" title="价格汇总">
      <div v-if="discountInfo" class="price-summary">
        <a-descriptions :column="2" bordered size="small">
          <a-descriptions-item label="乘客人数">{{ discountInfo.passenger_count }} 人</a-descriptions-item>
          <a-descriptions-item label="折扣率">{{ (discountInfo.discount_rate * 100).toFixed(0) }}%</a-descriptions-item>
          <a-descriptions-item label="原价总额">¥{{ discountInfo.original_total.toFixed(2) }}</a-descriptions-item>
          <a-descriptions-item label="优惠金额">¥{{ discountInfo.discount_amount.toFixed(2) }}</a-descriptions-item>
          <a-descriptions-item label="实付金额" :span="2">
            <span class="final-price">¥{{ discountInfo.final_total.toFixed(2) }}</span>
          </a-descriptions-item>
        </a-descriptions>
        <div class="discount-tips" v-if="passengers.length >= 10 && passengers.length < 20">
          <a-alert
            message="提示"
            description="当前{{ passengers.length }}人，如果增加到20人可享受9折优惠"
            type="info"
            show-icon
            style="margin-top: 16px"
          />
        </div>
        <div class="discount-tips" v-if="passengers.length >= 20 && passengers.length < 30">
          <a-alert
            message="提示"
            description="当前{{ passengers.length }}人，如果增加到30人可享受8.5折优惠"
            type="info"
            show-icon
            style="margin-top: 16px"
          />
        </div>
        <div class="discount-tips" v-if="passengers.length >= 30 && passengers.length < 50">
          <a-alert
            message="提示"
            description="当前{{ passengers.length }}人，如果增加到50人可享受8折优惠"
            type="info"
            show-icon
            style="margin-top: 16px"
          />
        </div>
      </div>
      <div v-else class="price-placeholder">
        请添加乘机人信息并选择航班
      </div>
    </a-card>

    <!-- 提交按钮 -->
    <div class="submit-actions">
      <a-button size="large" @click="router.push('/agency/flights')">返回查询</a-button>
      <a-button
        type="primary"
        size="large"
        :loading="submitting"
        :disabled="!canSubmit"
        @click="submitOrder"
      >
        提交订单
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { message } from "ant-design-vue";
import http from "@/api/http";

const router = useRouter();
const route = useRoute();

const selectedFlightId = ref<number | null>(null);
const flightInfo = ref<any>(null);
const passengers = ref<any[]>([]);
const discountInfo = ref<any>(null);
const submitting = ref(false);

const orderForm = reactive({
  contact_name: "",
  contact_phone: "",
  contact_email: "",
  payment_method: "alipay",
  notes: "",
});

const passengerColumns = [
  { title: "姓名", dataIndex: "name", key: "name" },
  { title: "身份证号", dataIndex: "id_card", key: "id_card" },
  { title: "手机号", dataIndex: "phone", key: "phone" },
  { title: "邮箱", dataIndex: "email", key: "email" },
  { title: "舱位", key: "cabin_class" },
  { title: "操作", key: "action" },
];

const canSubmit = computed(() => {
  return (
    selectedFlightId.value &&
    flightInfo.value &&
    passengers.value.length >= 10 &&
    passengers.value.length <= 50 &&
    passengers.value.every((p: any) => p.name && p.id_card && p.cabin_class) &&
    orderForm.contact_name &&
    orderForm.contact_phone
  );
});

onMounted(() => {
  const flightId = route.query.flight_id;
  if (flightId) {
    selectedFlightId.value = Number(flightId);
    loadFlightInfo();
  }
});

const loadFlightInfo = async () => {
  if (!selectedFlightId.value) {
    message.warning("请输入航班ID");
    return;
  }
  try {
    const response: any = await http.get("/api/v1/agency/flights", { params: { skip: 0, limit: 100 } });
    const flight = (Array.isArray(response) ? response : []).find((f: any) => f.flight_id === selectedFlightId.value);
    if (flight) {
      flightInfo.value = flight;
      message.success("航班信息加载成功");
      // 自动计算折扣
      if (passengers.value.length >= 10) {
        calculateDiscount();
      }
    } else {
      message.error("未找到该航班");
    }
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "加载航班信息失败");
  }
};

const downloadTemplate = () => {
  message.info("模板下载占位：待提供统一在线模板路径");
};

const beforeUpload = () => {
  message.info("上传乘机人表为占位，需对接解析接口后生成");
  return false;
};

const addPassenger = () => {
  passengers.value.push({
    index: passengers.value.length,
    name: "",
    id_card: "",
    phone: "",
    email: "",
    cabin_class: "economy",
  });
};

const addTemplatePassengers = (count: number) => {
  for (let i = 0; i < count; i++) {
    addPassenger();
  }
  message.success(`已添加 ${count} 个占位乘机人，请填写详细信息`);
};

const removePassenger = (index: number) => {
  passengers.value.splice(index, 1);
  passengers.value.forEach((p, i) => {
    p.index = i;
  });
  calculateDiscount();
};

const calculateDiscount = async () => {
  if (!selectedFlightId.value || passengers.value.length < 10) {
    discountInfo.value = null;
    return;
  }
  const validPassengers = passengers.value.filter((p: any) => p.name && p.id_card && p.cabin_class);
  if (validPassengers.length !== passengers.value.length) {
    discountInfo.value = null;
    return;
  }
  try {
    const requestData = {
      items: passengers.value.map((p: any) => ({
        flight_id: selectedFlightId.value!,
        cabin_class: p.cabin_class,
        passenger_name: p.name,
        passenger_id_card: p.id_card,
        passenger_phone: p.phone || undefined,
        passenger_email: p.email || undefined,
      })),
      contact_name: orderForm.contact_name || "临时联系人",
      contact_phone: orderForm.contact_phone || "临时电话",
      contact_email: orderForm.contact_email || undefined,
      payment_method: orderForm.payment_method,
    };
    const response = await http.post("/api/v1/agency/calculate-group-discount", requestData);
    discountInfo.value = response;
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "计算折扣失败");
    discountInfo.value = null;
  }
};

const submitOrder = async () => {
  if (!canSubmit.value) {
    message.warning("请完善所有必填信息");
    return;
  }
  submitting.value = true;
  try {
    const requestData = {
      items: passengers.value.map((p: any) => ({
        flight_id: selectedFlightId.value!,
        cabin_class: p.cabin_class,
        passenger_name: p.name,
        passenger_id_card: p.id_card,
        passenger_phone: p.phone || undefined,
        passenger_email: p.email || undefined,
      })),
      contact_name: orderForm.contact_name,
      contact_phone: orderForm.contact_phone,
      contact_email: orderForm.contact_email || undefined,
      payment_method: orderForm.payment_method,
      notes: orderForm.notes || undefined,
    };
    await http.post("/api/v1/agency/bulk-order", requestData);
    message.success("订单创建成功！");
    router.push(`/agency/orders`);
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "提交订单失败");
  } finally {
    submitting.value = false;
  }
};

watch(
  () => passengers.value,
  () => {
    calculateDiscount();
  },
  { deep: true }
);

watch(
  () => orderForm.contact_name,
  () => {
    if (passengers.value.length >= 10 && selectedFlightId.value) {
      calculateDiscount();
    }
  }
);

watch(
  () => orderForm.contact_phone,
  () => {
    if (passengers.value.length >= 10 && selectedFlightId.value) {
      calculateDiscount();
    }
  }
);
</script>

<style scoped>
.bulk-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #0bb07b 0%, #0e9a8b 45%, #f5fffb 100%);
  border-radius: 18px;
  box-shadow: 0 24px 60px rgba(0, 128, 96, 0.18);
  color: #fff;
}

.hero-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hero-right {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
}

.hero-stat {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px;
  color: #0f5748;
  backdrop-filter: blur(4px);
}

.stat-label {
  font-weight: 700;
  font-size: 14px;
  color: #0f5748;
}

.stat-value {
  font-size: 20px;
  font-weight: 800;
  color: #0b4f40;
}

.stat-desc {
  color: #0f5748;
  font-size: 12px;
}

.hero-eyebrow {
  font-size: 14px;
  letter-spacing: 0.5px;
  opacity: 0.9;
}

.hero-title {
  font-size: 26px;
  font-weight: 800;
}

.hero-sub {
  font-size: 15px;
  opacity: 0.92;
}

.hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.hero-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.section-card {
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(11, 176, 123, 0.08);
}

.flight-info {
  margin-top: 12px;
}

.passenger-count {
  margin-top: 16px;
  padding: 12px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  font-weight: 600;
}

.passenger-count .warn {
  color: var(--warning-color);
  margin-left: 12px;
  font-weight: normal;
}

.price-summary {
  margin-top: 12px;
}

.price-placeholder {
  text-align: center;
  padding: 32px;
  color: var(--text-secondary);
}

.final-price {
  font-size: 24px;
  font-weight: 800;
  color: var(--primary-color);
}

.discount-tips {
  margin-top: 16px;
}

.submit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 12px;
}

@media (max-width: 1080px) {
  .hero {
    grid-template-columns: 1fr;
  }
}
</style>
