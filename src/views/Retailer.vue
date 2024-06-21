<template>
  <div class="flex flex-col md:flex-row pt-5">
    <div class="md:w-1/3 p-4">
      <div class="flex items-center mb-4">
        <img
          :src="retailer.image"
          alt="Profile Picture"
          class="mr-4 w-10 h-10"
        />
        <div>
          <h2 class="font-bold">{{ retailer.username }}</h2>
          <p class="text-secondary">No star yet</p>
        </div>
      </div>
      <div class="mb-4">
        <p class="text-secondary">Follower: 0</p>
        <p class="text-secondary">Following: 0</p>
      </div>
      <button class="th-p-btn">
        + Follow
      </button>
      <button class="ml-5 th-p-btn">
        Chat
      </button>
      <div class="p-4 shadow-md">
        <h3 class="font-bold mb-2">Chat response:</h3>
        <p class="text-secondary">Thinh thoang (Trong 5 gio)</p>
        <h3 class="font-bold mb-2 mt-4">Verified:</h3>
        <div class="flex items-center">
          <i class="fas fa-check-circle text-green-500 mr-2"></i>
          <i class="fab fa-facebook-square text-blue-500 mr-2"></i>
          <i class="fab fa-google text-red-500 mr-2"></i>
          <i class="fas fa-envelope text-gray-500"></i>
        </div>
        <h3 class="font-bold mb-2 mt-4">Address:</h3>
        <p class="text-secondary">{{ retailer.address }}</p>
      </div>
    </div>
    <div class="md:w-2/3 p-4">
      <div class="p-4 shadow-md mb-4">
        <h2 class="font-bold mb-2">Dang hien thi (1)</h2>
        <div class="flex items-center mb-4">
          <cart-item />
        </div>
      </div>
      <div class="p-4 shadow-md">
        <h2 class="font-bold mb-2">Da ban (0)</h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import CartItem from '../components/CartItem.vue';
import { useUserStore } from '../stores/user';

const route = useRoute();
const userStore = useUserStore();
const retailer = ref({
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  address: "",
  phone: "",
  image: "",
  active: "",
  user_id: "",
});

onMounted(async () => {
  const userId = route.params.seller_id;
  try {
    const userInfo = await userStore.getUserInfo(userId);
    retailer.value = userInfo;
    console.log("Fetched retailer info:", userInfo);
  } catch (error) {
    console.error('Error fetching retailer info:', error);
  }
});

</script>