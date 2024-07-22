<template>
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
      <!-- Profile Picture and Basic Info -->
      <div class="col-span-1 flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg">
        <img :src="user.image" alt="User Image" class="w-32 h-32 rounded-full border-4 border-primary mb-4">
        <h1 class="text-4xl font-bold text-white mb-2">{{ user.first_name }} {{ user.last_name }}</h1>
        <p class="text-lg text-gray-300">{{ user.username }} <span class="mdi mdi-check-decagram-outline text-blue-500"></span></p>
        <p class="text-gray-400 mt-2">
          <span class="mdi mdi-map-marker"></span> {{ defaultAddress || "N/A" }}
        </p>
      </div>
  
      <!-- Contact and Actions -->
      <div class="col-span-2 flex flex-col bg-gray-800 p-6 rounded-lg shadow-lg">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold text-primary">Keep in Touch</h2>
          <div class="bg-secondary h-1 w-24"></div>
        </div>
  
        <div class="flex gap-6 mb-6">
          <button class="th-s-btn flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Send message <span class="mdi mdi-message-text-outline"></span>
          </button>
          <router-link class="text-blue-400 hover:underline" :href="`tel:${user.phone}`">
            <span class="mdi mdi-phone"></span> {{ user.phone || "N/A" }}
          </router-link>
          <router-link class="text-red-500 hover:underline">Report user</router-link>
        </div>
  
        <div class="flex items-center justify-between mb-6">
          <div class="flex gap-4">
            <label>
              <input type="radio" name="radio" checked id="default-gender" value="contact" class="mr-2">
              <span class="text-white">Contact</span>
            </label>
            <label>
              <input type="radio" name="radio" value="my-watches" class="mr-2">
              <span class="text-white">My Selling Watches</span>
            </label>
          </div>
          <div class="bg-secondary h-1 w-full"></div>
        </div>
  
        <!-- Product Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <product-card
            v-for="i in user.watches" :key="i.watch_id"
            :productName="i.watch_name"
            :productImage="i.image_url[0]"
            :retailerName="user.username"
            :retailerAvatar="user.image"
            :price="i.price"
            :watch_id="i.watch_id"
            :seller_id="`/retailer/${user.user_id}`"
          />
        </div>
  
        <!-- Show More Link -->
        <div class="flex justify-center mt-6">
          <a class="text-blue-500 hover:underline" :href="`/discover/seller searching result?page=0&store=${user.username}`">
            Show more watches
          </a>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import ProductCard from '../components/ProductCard.vue';
  import { ref, onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '../stores/user';
  import { useAuthStore } from '../stores/auth';
  
  const route = useRoute();
  const userStore = useUserStore();
  const addresses = ref([]);
  const user = ref({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    image: "",
    active: "",
    user_id: "",
    watches: [],
  });
  
  const defaultAddress = computed(() => {
    if (addresses.value && addresses.value.length > 0) {
      const defaultAddr = addresses.value.find(addr => addr.isDefault === true);
      return defaultAddr ? defaultAddr.address : addresses.value[0].detail;
    }
    return null;
  });
  
  onMounted(async () => {
    const userId = useAuthStore().user_id;
    try {
      const userInfo = await userStore.getUserInfo(userId);
      user.value = userInfo;
  
      // Fetch address information separately
      const addressData = await userStore.getAddressDetails(userId);
      addresses.value = addressData;
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  });
  </script>  