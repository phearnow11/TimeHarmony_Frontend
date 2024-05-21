<template>
  <header class="myheader grid grid-cols-3 gap-4 h-20 items-center w-full top-0 z-50">
    <div>
      <menu-button />
    </div>
    <router-link class="flex justify-center items-center h-full" to="/">
      <img src="../assets/time-harmony.png" class="h-16 max-w-full object-contain">
    </router-link>
    <div class="submenu flex flex-row-reverse">
      <div @click="goToLogin" class="hover-underline-animation">Have an account? Login</div>
    </div>
  </header>
</template>

<script setup>
  import router from '../router';
import MenuButton from './MenuButton.vue';
  function goToLogin() {
    router.push('/login')
  }
</script>