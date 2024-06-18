<template>
  <div class="pt-6">
    <carousel
      :startAutoPlay="false"
      :timeout="3000"
      :showNavigation="true"
      :showPagination="true"
    />
    <!-- Uncomment and adjust the following section to show user's username and logout button if logged in -->
    <!-- <div v-if="useUserStore().last_name">
      User ID: {{ useUserStore().last_name }}
      <button class="th-p-btn w-10" @click="logout">Log out</button>
    </div> -->
    <brand />
  </div>

  <div class="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-3 md:gap-3 lg:gap-3 ml-20 mr-20 relative">
    <div class="popular-watch-text flex items-center w-full">
      <span class="text-primary text-2xl font-light mr-2">WATCHES FOR YOU</span>
      <div class="border-t border-gray-99 flex-grow mt-1 h-1/6"></div>
    </div>
    <product-card
      productName="Đồng hồ Rolex còn mới siêu đẹp"
      productImage="https://alowatch.vn/wp-content/uploads/2021/04/moa10054.jpg"
      retailerName="ThinhPhoenix"
      retailerAvatar="https://files.catbox.moe/n1w3b0.png"
      price="12.000.000.000 VND"
      v-for="i in 30" :key="i"
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
import carousel from '../components/Carousel.vue';
import ProductCard from '../components/ProductCard.vue';
import Brand from '../components/Brand.vue';
import { useWatchStore } from '../stores/watch';
import { useCloudinaryStore } from '../stores/cloudinary';

// Initialize the watch store and upload an image to Cloudinary
const watchStore = useWatchStore();
const cloudinaryStore = useCloudinaryStore();

watchStore.getWatchesOfPage(0);
// cloudinaryStore.uploadImage('https://files.catbox.moe/n1w3b0.png');
</script>

<style scoped>
.popular-watch-text {
  position: absolute;
  top: 0px; /* Adjust the top position as needed */
  text-align: left;
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
