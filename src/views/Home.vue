<template>
  <carousel/>
  <div v-if="userStore.username">
    {{ userStore.username }}
    <button class="th-p-btn w-10 " @click="logout">Log out</button>
  </div>
  
  
<!-- Slider -->

<!-- End Slider -->

</template>


<script setup>
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import carousel from '../components/Carousel.vue'

const userStore = useUserStore();
const router = useRouter();

function logout() {
  userStore.$reset(); // Reset the user store
  localStorage.clear(); // Clear local storage
  router.push({ name: 'Home' }); // Navigate to the Login page
}

// Check local storage for existing username
const storedUsername = localStorage.getItem('username');
if (storedUsername) {
  userStore.setUsername(storedUsername);
}
</script>


<style></style>
