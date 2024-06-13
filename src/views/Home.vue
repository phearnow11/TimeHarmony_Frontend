<template>
  <div class="pt-6">
    <carousel
      :startAutoPlay="false"
      :timeout="3000"
      :showNavigation="true"
      :showPagination="true"
    />
    <!-- Show user's username and logout button if logged in -->
    <div v-if="useUserStore().last_name">
      User ID: {{ useUserStore().last_name }}
      <button class="th-p-btn w-10" @click="logout">Log out</button>
    </div>
    <brand />
  </div>

  <div class="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-3 md:gap-3 lg:gap-3 ml-20 mr-20 relative">
    <div class="popular-watch-text">
      <span class="text-secondary text-2xl font-bold">Watch for you</span>
      <div class="border-t border-gray-99 flex-grow ml-3"></div>
    </div>
    <product-card v-for="index in 32" :key="index" />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import carousel from "../components/Carousel.vue";
import ProductCard from "../components/ProductCard.vue";
import { useUserStore } from "../stores/user";
import Brand from "../components/Brand.vue";

const logout = () => {
  useAuthStore().logout();
};

const user_id = useAuthStore().user_id;
onMounted(() => {
  useUserStore().loadUser(user_id);
});
</script>

<style scoped>

.popular-watch-text {
  position: absolute;
  top: 0px; /* Adjust the top position as needed */
  text-align: left;
}
</style>
