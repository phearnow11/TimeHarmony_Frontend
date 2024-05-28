<template>
  <carousel />
  <div v-if="userStore.username">
    {{ userStore.username }}
    <button class="th-p-btn w-10" @click="logout">Log out</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/user';
import { useAuthStore } from '../stores/auth'; // Assuming there's an auth store
import { useRouter } from 'vue-router';
import axios from 'axios';
import carousel from '../components/Carousel.vue';

const userStore = useUserStore();
const authStore = useAuthStore(); // Use auth store
const router = useRouter();
const data = ref('');

const logout = () => {
  userStore.$reset(); // Reset the user store
  localStorage.clear(); // Clear local storage
  router.push({ name: 'Home' }); // Navigate to the Home page
};

// Check local storage for existing username
const storedUsername = localStorage.getItem('username');
if (storedUsername) {
  userStore.setUsername(storedUsername);
}

onMounted(() => {
  const token = authStore.token;
  axios.post('http://localhost:8080/api/auth/token', {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => {
    data.value = response.data;
  })
  .catch(error => {
    console.error('Error fetching token data:', error);
  });
});
</script>
