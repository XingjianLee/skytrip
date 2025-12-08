<template>
  <div class="hotels-page">
    <div class="page-header">
      <h2 class="page-title">预订酒店</h2>
      <p class="page-subtitle">搜索并预订酒店，享受团体优惠价格</p>
    </div>

    <!-- 搜索区域 -->
    <a-card class="search-card" bordered>
      <a-form layout="inline" :model="searchForm">
        <a-form-item label="城市">
          <a-input v-model:value="searchForm.city" placeholder="请输入城市名称" style="width: 180px" />
        </a-form-item>
        <a-form-item label="入住日期">
          <a-date-picker v-model:value="searchForm.check_in" format="YYYY-MM-DD" placeholder="选择入住日期" />
        </a-form-item>
        <a-form-item label="离店日期">
          <a-date-picker v-model:value="searchForm.check_out" format="YYYY-MM-DD" placeholder="选择离店日期" />
        </a-form-item>
        <a-form-item label="房间数">
          <a-input-number v-model:value="searchForm.rooms" :min="1" :max="10" style="width: 100px" />
        </a-form-item>
        <a-form-item label="星级">
          <a-select v-model:value="searchForm.star_level" allow-clear style="width: 120px" placeholder="选择星级">
            <a-select-option value="5">五星级</a-select-option>
            <a-select-option value="4">四星级</a-select-option>
            <a-select-option value="3">三星级</a-select-option>
            <a-select-option value="2">二星级</a-select-option>
            <a-select-option value="1">一星级</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="searchHotels" :loading="loading">搜索</a-button>
            <a-button @click="resetSearch">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 筛选和排序 -->
    <div class="filter-bar">
      <a-space>
        <span>排序：</span>
        <a-radio-group v-model:value="sortBy" @change="applySort">
          <a-radio-button value="price_asc">价格从低到高</a-radio-button>
          <a-radio-button value="price_desc">价格从高到低</a-radio-button>
          <a-radio-button value="rating_desc">评分最高</a-radio-button>
          <a-radio-button value="distance_asc">距离最近</a-radio-button>
        </a-radio-group>
      </a-space>
    </div>

    <!-- 酒店列表 -->
    <div v-if="loading" class="loading-container">
      <a-spin size="large" />
    </div>
    <div v-else-if="hotels.length === 0" class="empty-container">
      <a-empty description="暂无符合条件的酒店，请调整搜索条件" />
    </div>
    <div v-else class="hotels-grid">
      <a-card
        v-for="hotel in hotels"
        :key="hotel.hotel_id"
        class="hotel-card"
        :hoverable="true"
        @click="viewHotelDetail(hotel)"
      >
        <div class="hotel-image">
          <img v-if="hotel.image" :src="hotel.image" :alt="hotel.name" />
          <div v-else class="image-placeholder">
            <span>暂无图片</span>
          </div>
          <a-tag v-if="hotel.star_level" color="gold" class="star-tag">{{ hotel.star_level }}星级</a-tag>
        </div>
        <div class="hotel-info">
          <h3 class="hotel-name">{{ hotel.name }}</h3>
          <div class="hotel-location">
            <EnvironmentOutlined />
            <span>{{ hotel.city }} · {{ hotel.address }}</span>
          </div>
          <div class="hotel-features">
            <a-tag v-for="feature in hotel.features" :key="feature" color="blue">{{ feature }}</a-tag>
          </div>
          <div class="hotel-rating" v-if="hotel.rating">
            <StarOutlined />
            <span>{{ hotel.rating }}</span>
          </div>
        </div>
        <div class="hotel-price">
          <div class="price-label">起价</div>
          <div class="price-value">¥{{ hotel.min_price }}</div>
          <div class="price-unit">/晚</div>
          <a-button type="primary" block style="margin-top: 12px" @click.stop="bookHotel(hotel)">
            立即预订
          </a-button>
        </div>
      </a-card>
    </div>

    <!-- 分页 -->
    <div class="pagination-container" v-if="hotels.length > 0">
      <a-pagination
        v-model:current="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        show-size-changer
        show-total
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { EnvironmentOutlined, StarOutlined } from "@ant-design/icons-vue";
import http from "@/api/http";

const router = useRouter();
const loading = ref(false);
const sortBy = ref("price_asc");
const currentPage = ref(1);
const pageSize = ref(12);
const total = ref(0);

const searchForm = reactive({
  city: "",
  check_in: null,
  check_out: null,
  rooms: 1,
  star_level: undefined,
});

const hotels = ref<any[]>([]);

const searchHotels = async () => {
  if (!searchForm.city) {
    message.warning("请输入城市名称");
    return;
  }
  loading.value = true;
  try {
    // TODO: 对接后端API
    // const response = await http.get("/api/v1/agency/hotels", { params: searchForm });
    // hotels.value = response.data || [];
    // total.value = response.total || 0;
    
    // 占位数据
    await new Promise((resolve) => setTimeout(resolve, 500));
    hotels.value = [
      {
        hotel_id: 1,
        name: "示例酒店A",
        city: "北京",
        address: "朝阳区CBD核心区",
        star_level: 5,
        rating: 4.8,
        min_price: 588,
        features: ["免费WiFi", "停车场", "健身房"],
        image: null,
      },
      {
        hotel_id: 2,
        name: "示例酒店B",
        city: "上海",
        address: "黄浦区外滩",
        star_level: 4,
        rating: 4.5,
        min_price: 388,
        features: ["免费WiFi", "早餐"],
        image: null,
      },
    ];
    total.value = 2;
    message.success("搜索完成（当前为演示数据）");
  } catch (error: any) {
    message.error(error?.response?.data?.detail || "搜索失败");
  } finally {
    loading.value = false;
  }
};

const resetSearch = () => {
  searchForm.city = "";
  searchForm.check_in = null;
  searchForm.check_out = null;
  searchForm.rooms = 1;
  searchForm.star_level = undefined;
  hotels.value = [];
  currentPage.value = 1;
};

const applySort = () => {
  // TODO: 实现排序逻辑
  message.info("排序功能待对接后端");
};

const handlePageChange = () => {
  searchHotels();
};

const viewHotelDetail = (hotel: any) => {
  message.info(`查看酒店详情：${hotel.name}（功能待完善）`);
};

const bookHotel = (hotel: any) => {
  message.info(`预订酒店：${hotel.name}（功能待对接后端）`);
};
</script>

<style scoped>
.hotels-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  margin-bottom: 8px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
}

.search-card {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.filter-bar {
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
}

.loading-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.hotels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.hotel-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
}

.hotel-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.hotel-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--bg-tertiary);
}

.hotel-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
}

.star-tag {
  position: absolute;
  top: 12px;
  right: 12px;
}

.hotel-info {
  padding: 16px;
}

.hotel-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.hotel-location {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 12px;
}

.hotel-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.hotel-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #faad14;
  font-weight: 600;
}

.hotel-price {
  padding: 16px;
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.price-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.price-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
  display: inline-block;
}

.price-unit {
  font-size: 14px;
  color: var(--text-secondary);
  margin-left: 4px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
</style>
