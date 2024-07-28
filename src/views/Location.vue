<template>
    <div class="flex gap-2 items-center m-11">
      <button @click="locationStore.getLocation()" class="th-p-btn">Cập nhật vị trí hiện tại</button>
      <a class="hover-underline-animation"
        v-if="locationStore.translatedName" 
        :href="locationStore.mapUrl"
        target="_blank"
        style="cursor: pointer;"
      >
        {{ locationStore.translatedName }}
      </a>
    </div>
  </template>
  
  <script setup>
  import { useLocationStore } from '../stores/location';
  const locationStore = useLocationStore();
  </script>