<template>
  <carousel />
  <div v-if="user">
    {{ user.username }}
    <button class="th-p-btn w-10" @click="logout">Log out</button>
  </div>
</template>

<script setup>

import { useAuthStore } from '../stores/auth'; // Assuming there's an auth store
import carousel from '../components/Carousel.vue';

const user = useAuthStore().user

const logout = () => {
  useAuthStore().logout();
};

// onMounted(() => {
//   const token = authStore.token;
//   axios.post('http://localhost:8080/api/auth/token', {}, {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   })
//   .then(response => {
//     data.value = response.data;
//   })
//   .catch(error => {
//     console.error('Error fetching token data:', error);
//   });
// });
</script>
