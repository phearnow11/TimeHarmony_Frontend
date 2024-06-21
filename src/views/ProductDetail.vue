<template>
  <div class="max-w-4xl mx-auto p-4">
    <!-- Product Display -->
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Image Gallery -->
      <div class="w-full md:w-1/2">
        <div v-if="watchStore.watch_data.images">
      <img 
        v-for="(imageUrl, index) in watchStore.watch_data.images" 
        :key="index" 
        :src="imageUrl" 
        :alt="`Product Image ${index + 1}`"
      >
    </div>
      </div>
      
      <!-- Product Info -->
      <div class="w-full md:w-1/2">
        <h1 class="text-xl font-semibold mb-2">{{ watchStore.watch_data.name }}</h1>
        <div class="flex items-center mb-2">
          <!-- Star rating component -->
          <span class="text-2xl font-bold text-red-500">{{ watchStore.watch_data.description }}</span>
        </div>
        <div class="mb-4">
          <span class="text-2xl font-bold text-red-500">₫{{ watchStore.watch_data.price }}</span>
        </div>
        
        <!-- Shipping, Quantity, etc. -->
        <div class="mb-4">
          <!-- Add shipping and quantity selectors here -->
        </div>
        <div class="flex gap-4">
          <button class="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg">Add To Cart</button>
          <button class="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg">Buy Now</button>
        </div>
      </div>
    </div>
    
    <!-- Seller Info -->
    <div class="mt-8 border-t pt-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <img src="" alt="Seller" class="w-12 h-12 rounded-full mr-4">
          <div>
            <h2 class="font-semibold">{{ sellerName }}</h2>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="bg-red-500 text-white py-2 px-4 rounded-lg">Chat Now</button>
          <button class="border border-gray-300 py-2 px-4 rounded-lg">View Shop</button>
        </div>
      </div>
      <!-- Seller stats -->
      <div class="grid grid-cols-4 gap-4 mt-4 text-center">
        <div>
          <p class="font-semibold">{{ ratings }}</p>
          <p class="text-gray-500 text-sm">Ratings</p>
        </div>
        <div>
          <p class="font-semibold">{{ products }}</p>
          <p class="text-gray-500 text-sm">Products</p>
        </div>
        <div>
          <p class="font-semibold">{{ responseRate }}%</p>
          <p class="text-gray-500 text-sm">Response Rate</p>
        </div>
        <div>
          <p class="font-semibold">{{ followers }}</p>
          <p class="text-gray-500 text-sm">Followers</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useWatchStore } from '../stores/watch';

const route = useRoute();
const watchId = route.params.watch_id;
const watchStore = useWatchStore();

onMounted(() => {
  watchStore.getDetailWatch(watchId);
  console.log("These are the images:", watchStore.watch_data.images);
});
</script>

<style>
/* Add any necessary styles here */
</style>