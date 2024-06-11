<template>
  <div class="pt-6">
    <carousel :startAutoPlay="false" :timeout="3000" :showNavigation="true" :showPagination="true" />
    <!-- Show user's username and logout button if logged in -->
    <div v-if="useUserStore().last_name">
      User ID: {{ useUserStore().last_name }}
      <button class="th-p-btn w-10" @click="logout">Log out</button>
    </div>
  </div>

  <div class="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-3 md:gap-3 lg:gap-3 ml-20 mr-20">
  <product-card v-for="index in 32" :key="index" />

</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/auth'; 
import carousel from '../components/Carousel.vue';
import ProductCard from '../components/ProductCard.vue';
import { useUserStore } from '../stores/user';

const logout = () => {
  useAuthStore().logout();
};

const user_id = useAuthStore().user_id;
onMounted(() => {
  useUserStore().loadUser(user_id)
});
</script>