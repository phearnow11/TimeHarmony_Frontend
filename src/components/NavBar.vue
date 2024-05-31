<template>
 <header class="myheader grid grid-cols-3 gap-4 h-20 items-center sticky top-0 z-50 bg-blue-950 w-full px-4">
    <div class="flex items-center">
      <side-bar />
    </div>
    <div class="flex justify-center items-center h-full">
      <router-link to="/">
        <img src="../assets/time-harmony.png" class="h-16 max-w-full object-contain">
      </router-link>
    </div>
    <div class="flex justify-end items-center h-full" v-if="!auth.user_id">
      <router-link to="/login" class="hover-underline-animation">Have an account? Login</router-link>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import SideBar from './SideBar.vue';
const auth = useAuthStore();
</script>

<style>
body {
  padding-top: 0.5rem; /* Adjust this value based on the header height */
}

.myheader {
  width: 100%;
  left: 0;
  right: 0;
  margin-right: 0; /* Ensure there is no unintended margin */
}
</style>