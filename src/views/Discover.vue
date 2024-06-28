<template>
  <div class="h-1 mb-28"></div>

  <!-- Skeleton -->
  <div v-if="load" class="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-3 md:gap-3 lg:gap-3 mx-20 relative">
    <div class="popular-watch-text flex items-center w-full mb-10">
      <span class="text-primary text-2xl font-light mr-2 uppercase">{{ field }}</span>
      <div class="border-t border-secondary flex-grow mt-1 h-1/6"></div>
    </div>
    <SkeletonCard v-for="i in 30" :key="i" />
  </div>

  <!-- Data real -->
  <div v-else class="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-3 md:gap-3 lg:gap-3 mx-20 relative">
    <div class="popular-watch-text flex items-center w-full mb-10">
      <span class="text-primary text-2xl font-light mr-2 uppercase">{{ field }}</span>
      <div class="border-t border-secondary flex-grow mt-1 h-1/6"></div>
    </div>
    <ProductCard
      v-for="(watch, index) in watchStore.watches.get(watchStore.currentPage)" :key="index"
      :productName="watch.watch_name"
      :productImage="watch.image_url[0]"
      :retailerName="watch.seller.user_log_info.username || 'N/A'"
      :retailerAvatar="watch.seller.member_image || ''"
      :price="watch.price"
      :link="`/detail/${watch.watch_id}`"
      :seller_id="`/retailer/${watch.seller.member_id}`"
    />
  </div>

  <!-- Pagination -->
  <div v-if="!load" class="pagination-container flex justify-center items-center mt-10">
    <div class="pagination-number arrow" @click="setPage(0)">
      <svg width="18" height="18">
        <use xlink:href="#left" />
      </svg>
      <span class="arrow-text">First Page</span>
    </div>

    <div v-for="page in visiblePages" :key="page" class="pagination-number" :class="{'pagination-active': page === watchStore.currentPage + 1}" @click="setPage(page - 1)">
      {{ page }}
    </div>

    <div class="pagination-number arrow" @click="setPage(totalPages-1)">
      <span class="arrow-text">Last Page</span>
      <svg width="18" height="18">
        <use xlink:href="#right" />
      </svg>
    </div>
  </div>

  <svg class="hide">
    <symbol id="left" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </symbol>
    <symbol id="right" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </symbol>
  </svg>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductCard from '../components/ProductCard.vue';
import { useWatchStore } from '../stores/watch';
import SkeletonCard from '../components/SkeletonCard.vue';

const watchStore = useWatchStore();
const load = ref(true);
const route = useRoute();
const router = useRouter();

const field = computed(() => route.params.field);

const page = computed(() => {
  const pageParam = route.query.page;
  return pageParam ? parseInt(pageParam, 10) : 0;
});

watchStore.currentPage = page

onMounted(async () => {
  if (watchStore.watches.has(page.value)) {
    load.value = false;
    return;
  }

  try {
    if (!watchStore.watches.has(page.value)) {
      await watchStore.getWatchesOfPage(page.value);
      load.value = false;
    }
  } catch (error) {
    console.error('Error during mounted hook execution:', error);
  }
});

const setPage = async (newPage) => {
  load.value = true;

  await router.push({
    path: `/discover/${field.value}`,
    query: { page: newPage }
  });

  if (!watchStore.watches.has(newPage)) {
    await watchStore.getWatchesOfPage(newPage);
  }

  load.value = false;
};

watch(() => route.query.page, async (newPage) => {
  if (newPage !== undefined) {
    const pageNumber = parseInt(newPage, 10);
    if (pageNumber !== watchStore.currentPage) {
      watchStore.currentPage = pageNumber;
      await setPage(pageNumber);
    }
  }
});

const totalPages = 540;
const visiblePages = computed(() => {
  const currentPage = watchStore.currentPage + 1;
  let startPage = Math.max(currentPage - 2, 1);
  let endPage = Math.min(startPage + 4, totalPages);

  if (endPage - startPage < 4) {
    startPage = Math.max(endPage - 4, 1);
  }

  if (endPage === totalPages) {
    startPage = Math.max(endPage - 4, 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});
</script>
  
  <style scoped>
  .popular-watch-text {
    position: absolute;
    top: -50px;
    text-align: left;
    margin-bottom: 5rem;
  }
  
  *:focus {
    outline: none;
  }
  
  html, body, .full-width {
    height: 100%;
  }
  
  body {
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: var(--bg-page);
    color: var(--text-color);
  }
  
  body, body html {
    margin: 0;
    padding: 0;
  }
  
  .hide {
    display: none;
    visibility: hidden;
    height: 0;
  }
  
  .pagination-container {
    display: flex;
    align-items: center;
  }
  
  .arrow-text {
    display: block;
    font-size: 13px;
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
  
  @media (hover: hover) {
    .pagination-number:hover {
      background: #4e4e4e;
    }
  }
  
  .pagination-number:active {
    background: #282828;
  }
  
  .pagination-active {
    background: #282828;
    border: 1px solid var(--primary);
  }
</style>
  