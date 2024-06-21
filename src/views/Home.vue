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

  <div class="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-3 md:gap-3 lg:gap-3 ml-20 mr-20 relative">
    <div class="popular-watch-text flex items-center w-full mb-10">
      <span class="text-primary text-2xl font-light mr-2">WATCHES FOR YOU</span>
      <div class="border-t border-gray-99 flex-grow mt-1 h-1/6"></div>
    </div>
    <product-card
      v-for="(watch, index) in watchStore.watches" :key="index"
      :productName="watch.watch_name"
      :productImage="watch.image_url[0]"
      :retailerName="retailers[index]?.username || 'N/A'"
      :retailerAvatar="retailers[index]?.image || ''"
      :price="watch.price"
      :link="`/detail/${watch.watch_id}`"
      :seller_id="`/retailer/${watch.seller.member_id}`"
    />
  </div>

  <div class="pagination:container flex justify-center items-center mt-10">
    <div class="pagination:number arrow">
      <svg width="18" height="18">
        <use xlink:href="#left" />
      </svg>
      <span class="arrow:text">Previous</span>
    </div>

    <div class="pagination:number">1</div>
    <div class="pagination:number">2</div>
    <div class="pagination:number pagination:active">3</div>
    <div class="pagination:number">4</div>
    <div class="pagination:number">540</div>

    <div class="pagination:number arrow">
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
import { ref, onMounted } from 'vue';
import carousel from '../components/Carousel.vue';
import ProductCard from '../components/ProductCard.vue';
import Brand from '../components/Brand.vue';
import { useWatchStore } from '../stores/watch';
import { useUserStore } from '../stores/user';

const watchStore = useWatchStore();
const userStore = useUserStore();
const retailers = ref([]);

onMounted(async () => {
  await watchStore.getWatchesOfPage(0);
  await fetchRetailerInfo();
});

const fetchRetailerInfo = async () => {
  const retailerPromises = watchStore.watches.map(watch => userStore.getUserInfo(watch.seller.member_id));
  retailers.value = await Promise.all(retailerPromises);
};
</script>


<style scoped>
.popular-watch-text {
  position: absolute;
  top: 0px;
  text-align: left;
  margin-bottom: 2rem;
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

.pagination\:container {
  display: flex;
  align-items: center;
}

.arrow\:text {
  display: block;
  font-size: 13px;
}

.pagination\:number {
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
  .pagination\:number:hover {
    background: #4e4e4e;
  }
}

.pagination\:number:active {
  background: #282828;
}

.pagination\:active {
  background: #282828;
  border: 1px solid var(--primary);
}
</style>
