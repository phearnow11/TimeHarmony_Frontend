<template>
    <div class="flex flex-col gap-2 items-center m-11">
      <div v-if="locationStore.translatedName">
        <a class="hover-underline-animation"
           :href="locationStore.mapUrl"
           target="_blank"
           style="cursor: pointer;"
        >
          {{ locationStore.translatedName }}
        </a>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { useLocationStore } from '../stores/location';
  
  const locationStore = useLocationStore();
  const data = ref({})
  
  onMounted(async () => {
    data.value = await locationStore.getLocation('9.871173','105.587533');
    console.log(data.value);
  });
  </script>
  