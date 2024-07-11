<template>
    <div class="h-1 mb-28"></div>
  
    <!-- Skeleton -->
    <div v-if="load" class="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-3 md:gap-3 lg:gap-3 mx-20 relative">
      <div class="popular-watch-text flex items-center w-full mb-10">
        <span class="text-primary text-2xl font-light mr-2 uppercase">Favorite Watch</span>
        <div class="border-t border-secondary flex-grow mt-1 h-1/6"></div>
      </div>
      <SkeletonCard v-for="i in 30" :key="i" />
    </div>
  
    <!-- Data real -->
    <div v-else class="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-3 md:gap-3 lg:gap-3 mx-20 relative">
      <div class="popular-watch-text flex items-center w-full mb-10">
        <span class="text-primary text-2xl font-light mr-2 uppercase">Favorite Watch</span>
        <div class="border-t border-secondary flex-grow mt-1 h-1/6"></div>
      </div>
      <ProductCard
        v-for="(watch, index) in watches" :key="index"
        :productName="watch.watch_name"
        :productImage="watch.image_url[0]"
        :retailerName="watch.seller.user_log_info.username || 'N/A'"
        :retailerAvatar="watch.seller.member_image || ''"
        :price="watch.price"
        :watch_id="watch.watch_id"
        :seller_id="`/retailer/${watch.seller.member_id}`"
      />
    </div>
  
    <!-- No watches found -->
   <!-- No watches found -->
    <div v-if="!load && watches.length === 0" class="mt-8 flex justify-center items-center mx-20">
    <div class="text-center">
        <h2 class="text-2xl font-bold mb-4">No Watches Found</h2>
        <p class="text-lg">Sorry, we couldn't find any watches on this page.</p>
    </div>
    </div>
    
    
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { useAuthStore } from '../stores/auth';
  import axios from 'axios';
  import ProductCard from '../components/ProductCard.vue'; // Make sure to import ProductCard
  import SkeletonCard from '../components/SkeletonCard.vue'; // Make sure to import SkeletonCard
  
  const watches = ref([]);
  const load = ref(true); // Add a loading state
  const auth = useAuthStore();
  
  onMounted(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/member/get/favorites/${auth.user_id}`);
      watches.value = response.data; // Assuming this returns an array of favorite watch objects
      console.log(watches.value);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      load.value = false; // Loading is complete
    }
  });
  
  // Define any additional methods you need for pagination or other actions
  const setPage = (page) => {
    // Pagination logic here
  };
  const visiblePages = [1, 2, 3]; // Example pagination data, replace with your logic
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  