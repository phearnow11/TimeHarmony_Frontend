<template>
    <div class="search-results">
      <h1>Search Results for "{{ searchQuery }}"</h1>
      <!-- Add your search results display logic here -->
    </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const searchQuery = route.query.q || '';
  </script>
  
  <style scoped>
  .search-results {
    padding: 20px;
  }
  </style>
  