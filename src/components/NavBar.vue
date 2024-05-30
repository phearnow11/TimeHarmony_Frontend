<template>
  <header class="myheader grid grid-cols-3 gap-4 h-20 items-center w-full top-0 z-50">
    <div>
      <side-bar />
    </div>
    <router-link class="flex justify-center items-center h-full" to="/">
      <img src="../assets/time-harmony.png" class="h-16 max-w-full object-contain">
    </router-link>
    <div class="submenu flex flex-row-reverse" v-if="!auth.user_id">
      <router-link to="/login" class="hover-underline-animation">Have an account? Login</router-link>
    </div>
  </header>
</template>

<script setup>
  import { useAuthStore } from '../stores/auth';
  import SideBar from './SideBar.vue';
  const auth = useAuthStore()
</script>