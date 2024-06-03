<template>
  <div class="pt-6">

    <carousel />
    <!-- Show user's username and logout button if logged in -->
    <div v-if="user_id">
      User ID: {{ user_id }}
      <button class="th-p-btn w-10" @click="logout">Log out</button>
    </div>
  </div>

  <div class="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-3 md:gap-3 lg:gap-3 ml-20 mr-20">
  <product-card v-for="index in 32" :key="index" />
</div>

</template>

<script setup>
import { onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth'; 
import carousel from '../components/Carousel.vue';
import ProductCard from '../components/ProductCard.vue';

const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
};

const user_id = authStore.user_id;
onMounted(() => {
  if (user_id) {
    axios.get(`http://localhost:8080/member/get-member?member_id=${user_id}`)
      .then((res) => {
        console.log('Member data:', res.data);
        // Optionally, update the user state with additional data from this response
      })
      .catch((err) => {
        console.error('Error fetching member data:', err);
      });
  }
});
</script>