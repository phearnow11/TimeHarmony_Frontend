<template>
  <div class="pt-6">
    <carousel
      :startAutoPlay="false"
      :timeout="3000"
      :showNavigation="true"
      :showPagination="true"
    />
    <brand />
  </div>

  <!-- Skeleton -->
  <div v-if="isLoading" class="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-3 md:gap-3 lg:gap-3 mx-20 relative">
    <div class="popular-watch-text flex items-center w-full mb-10">
      <span class="text-primary text-2xl font-light mr-2">WATCHES FOR YOU</span>
      <div class="border-t border-secondary flex-grow mt-1 h-1/6"></div>
    </div>
    <skeleton-card v-for="i in 30" :key="i"/>
  </div>

  <!-- Data real -->
  <div v-else class="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-3 md:gap-3 lg:gap-3 mx-20 relative">
    <div class="popular-watch-text flex items-center w-full mb-10">
      <span class="text-primary text-2xl font-light mr-2">WATCHES FOR YOU</span>
      <div class="border-t border-secondary flex-grow mt-1 h-1/6"></div>
    </div>
    <product-card
      v-for="watch in paginatedWatches" :key="watch.watch_id"
      :productName="watch.watch_name"
      :productImage="watch.image_url[0]"
      :retailerName="watch.seller.user_log_info.username || 'N/A'"
      :retailerAvatar="watch.seller.member_image || ''"
      :price="watch.price"
      :link="`/detail/${watch.watch_id}`"
      :seller_id="`/retailer/${watch.seller.member_id}`"
    />
  </div>

  <div v-if="!isLoading" class="pagination-container flex justify-center items-center mt-10">
    <router-link class="hover-underline-animation" to="/discover/watches for you?page=0">Show more watches</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Carousel from '../components/Carousel.vue';
import ProductCard from '../components/ProductCard.vue';
import Brand from '../components/Brand.vue';
import SkeletonCard from '../components/SkeletonCard.vue';
import axios from 'axios';

const isLoading = ref(true);
const watches = ref([]);
const currentPage = ref(0);
const itemsPerPage = 30;

const paginatedWatches = computed(() => {
  const start = currentPage.value * itemsPerPage;
  const end = start + itemsPerPage;
  return watches.value.slice(start, end);
});

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8080/watch/get/30-watches');
    watches.value = response.data;
    isLoading.value = false;
  } catch (error) {
    console.error('Error fetching watches:', error);
  }
});
</script>

<style scoped>
.popular-watch-text {
  position: absolute;
  top: -50px;
  text-align: left;
  margin-bottom: 5rem;
}

.pagination-container {
  display: flex;
  align-items: center;
}

.pagination-number {
  --size: 32px;
  --margin: 6px;
  margin: 0 var(--margin);
  background: #202020;
  max-width: auto;
  min-width: var(--size);
  height: var(--size);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 6px;
}

.pagination-number:hover {
  background: #4e4e4e;
}

.pagination-number:active {
  background: #282828;
}

.pagination-active {
  background: #282828;
  border: 1px solid var(--primary);
}

.arrow-text {
  display: block;
  font-size: 13px;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hide {
  display: none;
}
</style>