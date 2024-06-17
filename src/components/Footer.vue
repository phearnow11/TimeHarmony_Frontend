<template>
  <footer v-if="route.path !== '/chat'" class="footer">
    <div class="w-full max-w-screen-xl mx-auto px-4 md:py-4">
      <div class="sm:flex sm:items-center sm:justify-between">
        <router-link to="/" class="flex items-center mb-4 sm:mb-0">
          <img src="../assets/time-harmony.png" class="w-auto h-14 mr-3" alt="Logo" />
        </router-link>
        <ul class="flex flex-wrap items-center mb-4 text-sm text-gray-500 sm:mb-0 dark:text-gray-400">
          <li>
            <router-link to="/about" class="mr-4 hover-underline-animation md:mr-6">About</router-link>
          </li>
          <li>
            <a href="/" class="mr-4 hover-underline-animation md:mr-6">Privacy Policy</a>
          </li>
          <li>
            <a href="/" class="mr-4 hover-underline-animation md:mr-6">Licensing</a>
          </li>
          <li>
            <a href="/" class="hover-underline-animation">Contact</a>
          </li>
        </ul>
      </div>
      <hr class="my-4 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-6" />
      <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© {{ date }} <a href="/" class="hover:underline">TimeHarmony™</a>. All Rights Reserved.</span>
    </div>
  </footer>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const date = computed(() => new Date().getFullYear());
</script>

<style scoped>
.footer {
  background-color: rgba(20, 20, 20, 0.836);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 50;
  box-shadow: rgba(153, 153, 153, 0.685) 0px -1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  margin-top: 2rem;
  width: 100%;
}
</style>