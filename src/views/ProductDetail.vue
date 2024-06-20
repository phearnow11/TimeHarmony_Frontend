<template>
    <div>
      {{ watchStore.watch_data.name }}
    </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router';
  import { onMounted } from 'vue';
  import { useWatchStore } from '../stores/watch';
  
  const route = useRoute();
  const watchId = route.params.watch_id;
  const watchStore = useWatchStore();
  
  onMounted(() => {
    watchStore.getDetailWatch(watchId);
  });
  </script>
  
  <style>
  /* Add any styles here */
  </style>
  