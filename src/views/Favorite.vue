<template>
  <div class="h-1"></div>

  <!-- Danh sách yêu thích -->
  <div class="mt-8 mx-20">
    <div class="popular-watch-text flex items-center mb-10">
      <span class="text-primary text-2xl font-light mr-2 uppercase">Danh sách yêu thích</span>
      <div class="border-t border-secondary flex-grow ml-2 h-1"></div>
    </div>

    <!-- Nếu đang loading -->
    <template v-if="load">
      <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-3 md:gap-3 lg:gap-3 relative">
        <SkeletonCard v-for="i in 30" :key="i" />
      </div>
    </template>

    <!-- Nếu không có dữ liệu -->
    <template v-else>
      <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-3 md:gap-3 lg:gap-3 relative pt-5 pb-10">
        <favorite-card
          v-for="(watch, index) in watches"
          :key="index"
          :productName="watch.watch_name"
          :productImage="watch.image_url[0]"
          :retailerName="watch.seller.user_log_info.username || 'N/A'"
          :retailerAvatar="watch.seller.member_image || ''"
          :price="watch.price"
          :watch_id="watch.watch_id"
          :seller_id="`/retailer/${watch.seller.member_id}`"
          @favorite-removed="removeFavoriteFromList"
        />
      </div>
    </template>

    <!-- Nếu không tìm thấy đồng hồ -->
    <div v-if="!load && watches.length === 0" class="mt-8 flex justify-center items-center">
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-4">Không tìm thấy đồng hồ</h2>
        <p class="text-lg">Xin lỗi, không có đồng hồ nào phù hợp với yêu cầu của bạn.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import axios from 'axios';
import ProductCard from '../components/ProductCard.vue';
import SkeletonCard from '../components/SkeletonCard.vue';
import FavoriteCard from '../components/FavoriteCard.vue';

var api = import.meta.env.VITE_API_PORT

const watches = ref([]);
const load = ref(true);
const auth = useAuthStore();

onMounted(async () => {
  try {
    const response = await axios.get(`${api}/member/get/favorites/${auth.user_id}`);
    watches.value = response.data;
    console.log(watches.value);
  } catch (error) {
    console.error('Error fetching favorites:', error);
  } finally {
    load.value = false;
  }
});

const setPage = (page) => {
  // Xử lý phân trang ở đây nếu cần
};

const visiblePages = [1, 2, 3]; // Thay thế với logic phân trang của bạn

const removeFavoriteFromList = (watchId) => {
  watches.value = watches.value.filter(watch => watch.watch_id !== watchId);
};
</script>

<style scoped>
/* Thêm các style scoped tại đây nếu cần */
.popular-watch-text {
  margin-left: 20px; /* Điều chỉnh margin nếu cần */
}
</style>
