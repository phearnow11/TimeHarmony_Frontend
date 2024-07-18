<template>
  <div class="search-results">
    <h1 class="pl-10">Search Results for "{{ searchQuery }}"</h1>
    <!-- Add your search results display logic here -->
  </div>
  <div class="flex-grow p-4">
        <div v-if="searchResults.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProductCard
            v-for="watch in searchResults"
            :key="watch.id"
            :productName="watch.watch_name"
            :productImage="watch.image_url[0]"
            :retailerName="watch.seller.user_log_info.username || 'N/A'"
            :retailerAvatar="watch.seller.member_image || ''"
            :price="watch.price"
            :watch_id="watch.watch_id"
            :seller_id="`/retailer/${watch.seller.member_id}`"
          />
        </div>
        <div v-else class="text-center text-gray-600 mt-8">
          No results found for "{{ searchQuery }}"
        </div>
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
      <!-- Search results -->
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useWatchStore } from '../stores/watch';
import ProductCard from '../components/ProductCard.vue';

const route = useRoute();
const watchStore = useWatchStore();

const searchQuery = computed(() => route.query.q || '');
const searchResults = computed(() => watchStore.searchResults);
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

onMounted(async () => {
  if (searchQuery.value) {
    try {
      await watchStore.searchWatches(searchQuery.value);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }
});
</script>

<style scoped>
.search-results {
  padding: 20px;
}
</style>
