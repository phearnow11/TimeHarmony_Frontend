<template>
  <div class="pt-6">
    <Carousel
      :startAutoPlay="false"
      :timeout="3000"
      :showNavigation="true"
      :showPagination="true"
    />
    <Brand />
  </div>

  <!-- Skeleton -->
  <div v-if="isLoading" class="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-3 md:gap-3 lg:gap-3 mx-20 relative">
    <div class="popular-watch-text flex items-center w-full mb-10">
      <span class="text-primary text-2xl font-light mr-2 uppercase">Dành cho bạn</span>
      <div class="border-t border-secondary flex-grow mt-1 h-1/6"></div>
    </div>
    <SkeletonCard v-for="i in 30" :key="i" />
  </div>

  <!-- Data real -->
  <div v-else class="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-3 md:gap-3 lg:gap-3 mx-20 relative">
    <div class="popular-watch-text flex items-center w-full mb-10">
      <span class="text-primary text-2xl font-light mr-2 uppercase">Dành cho bạn</span>
      <div class="border-t border-secondary flex-grow mt-1 h-1/6"></div>
    </div>
    <ProductCard
      v-for="watch in paginatedWatches"
      :key="watch.watch_id"
      :productName="watch.watch_name"
      :productImage="watch.image_url[0]"
      :retailerName="watch.seller.user_log_info.username || 'N/A'"
      :retailerAvatar="watch.seller.member_image || ''"
      :price="watch.price"
      :watch_id="watch.watch_id"
      :seller_id="`/retailer/${watch.seller.member_id}`"
    />
  </div>

  <div v-if="!isLoading && watches.length <= 30" class="pagination-container flex justify-center items-center mt-10">
    <a class="hover-underline-animation" href="/discover/dành cho bạn?page=0">Nhiều sản phẩm hơn...</a>
  </div>
</template>

<script setup>
import Carousel from '../components/Carousel.vue';
import Brand from '../components/Brand.vue';
import { ref, computed, onMounted, defineAsyncComponent, onUnmounted } from 'vue';
import axios from 'axios';
import { useMailStore } from '../stores/mail';
import { useUserStore } from '../stores/user';
import router from '../router';

const ProductCard = defineAsyncComponent(() => import('../components/ProductCard.vue'));
const SkeletonCard = defineAsyncComponent(() => import('../components/SkeletonCard.vue'));

const isLoading = ref(true);
const watches = ref([]);
const currentPage = ref(0);
const itemsPerPage = 30;

var api = import.meta.env.VITE_API_PORT

const paginatedWatches = computed(() => {
  const start = currentPage.value * itemsPerPage;
  const end = start + itemsPerPage;
  return watches.value.slice(start, end);
});

onMounted(async () => {
  if(useUserStore().role ==='ROLE_ADMIN') return router.push('/admin')
  if(useUserStore().staff_role === 'APPRAISER') return router.push('/appraiser')
    try {
      console.log(api)
      const response = await axios.get(`${api}/watch/get/30-watches`);
      watches.value = response.data;
      isLoading.value = false;
    } catch (error) {
      console.error('Error fetching watches:', error);
    }
  
})

// function handleBeforeUnload(event) {
//   //Start codes here

//   //End codes
//   event.preventDefault();
//   event.returnValue = '';
// }
// onMounted(() => {
//   window.addEventListener('beforeunload', handleBeforeUnload);
// });
// onUnmounted(() => {
//   window.removeEventListener('beforeunload', handleBeforeUnload);
// });
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