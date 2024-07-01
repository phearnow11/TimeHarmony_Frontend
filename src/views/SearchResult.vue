<template>
  <div class="search-results">
    <h1 class="pl-10">Search Results for "{{ searchQuery }}"</h1>
    <!-- Add your search results display logic here -->
  </div>

  <div class="border-t border-secondary w-52 ml-14">
    <div class="p-4">
      <div class="mb-4">
        <h2 class="text-lg font-bold">Category</h2>
        <ul>
          <li v-for="(category, index) in categories" :key="index" class="mt-2">
            <label class="inline-flex items-center">
              <input type="checkbox" class="form-checkbox" v-model="selectedCategories" :value="category">
              <span class="ml-2">{{ category }}</span>
            </label>
          </li>
        </ul>
      </div>
      <div>
        <h2 class="text-lg font-bold">Brand</h2>
        <ul>
          <li v-for="(brand, index) in brands" :key="index" class="mt-2">
            <label class="inline-flex items-center">
              <input type="checkbox" class="form-checkbox" v-model="selectedBrands" :value="brand">
              <span class="ml-2">{{ brand }}</span>
            </label>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const searchQuery = route.query.q || '';

const categories = ref([
  "Women's Dresses",
  "Cross Body & Shoulder Bags",
  "Men's Sports Hats & Caps",
  "Women's Hair Accessories",
  "Women's Socks & Tights",
  "Men's Sports Sunglasses",
  "Fish Food",
  "Aquariums Decorations"
]);

const brands = ref([
  "NT FISHING",
  "ZOEF",
  "Richy",
  "7Up",
  "Cozy",
  "Foodmap",
  "FS Fruits",
  "Cool Air",
  "Nhật Cà Phê",
  "O'Food"
]);

const selectedCategories = ref([]);
const selectedBrands = ref([]);
</script>

<style scoped>
.search-results {
  padding: 20px;
}
</style>
