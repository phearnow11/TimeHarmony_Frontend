<template>
  <div class="search-page">
    <div class="search-body flex">
      <div class="w-1/4 px-10 py-10">
        <!-- Categories filter -->
        <div class="filter-category mb-6">
          <h2 class="text-lg font-bold">Phân loại</h2>
          <ul>
            <li v-for="(category, index) in categories" :key="index" class="mt-2">
              <label class="container flex justify-start items-center text-center gap-2">
                <input
                  type="checkbox"
                  :value="category"
                  :checked="selectedCategory === category"
                  @change="toggleCategory(category)"
                />
                <svg viewBox="0 0 64 64" height="1em">
                  <path
                    d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                    pathLength="575.0541381835938"
                    class="path"
                  ></path>
                </svg>
                <span class="ml-2">{{ category }}</span>
              </label>
            </li>
          </ul>
        </div>
        <!-- Brands filter -->
        <div class="filter-brand mb-6">
          <h2 class="text-lg font-bold">Hãng</h2>
          <ul>
            <li v-for="(brand, index) in brands" :key="index" class="mt-2">
              <label class="container flex justify-start items-center text-center gap-2">
                <input
                  type="checkbox"
                  :value="brand"
                  :checked="selectedBrand === brand"
                  @change="toggleBrand(brand)"
                />
                <svg viewBox="0 0 64 64" height="1em">
                  <path
                    d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                    pathLength="575.0541381835938"
                    class="path"
                  ></path>
                </svg>
                <span class="ml-2">{{ brand }}</span>
              </label>
            </li>
          </ul>
        </div>
        <!-- Price filter -->
        <div class="filter-price mb-6">
          <h2 class="text-lg font-bold">Giá</h2>
          <vue-slider
            v-model="priceRange"
            :min="1000000"
            :max="maxPriceValue"
            :step="100000"
            class="mt-12 pr-16"
          />
          <div class="flex items-center gap-2 mt-2">
            Giá từ
            <input
              type="text"
              v-model="formattedPrice[0]"
              @focus="handleFocus(0)"
              @blur="handleBlur(0)"
              class="price-input"
            />₫ đến
            <input
              type="text"
              v-model="formattedPrice[1]"
              @focus="handleFocus(1)"
              @blur="handleBlur(1)"
              class="price-input"
            />
            ₫
          </div>
        </div>
      </div>
      <!-- Search results -->
      <div class="search-results w-3/4 p-4">
        <div class="search-header">
          <h1 class="px-10 pb-10">Hiển thị kết quả cho "{{ searchQuery }}"</h1>
        </div>
        <div
          v-if="searchResults.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 relative"
        >
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
            class="w-full"
          />
        </div>
        <div v-else class="text-center text-gray-600 mt-8">
          Không có kết quả tìm kiếm cho "{{ searchQuery }}"
        </div>
      </div>
    </div>
  <!-- Pagination -->
  <div v-if="!loading" class="pagination-container flex justify-center items-center mt-10">
    <div class="pagination-button" @click="setPage(watchStore.currentPage - 1)">
      <span>{{ `<` }}</span>
      <span class="button-text">Trước</span>
    </div>
    <div class="pagination-button" @click="setPage(watchStore.currentPage + 1)">
      <span class="button-text">Sau</span>
      <span>{{ `>` }}</span>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useWatchStore } from '../stores/watch';
import ProductCard from '../components/ProductCard.vue';
import VueSlider from '@vueform/slider';
import '@vueform/slider/themes/default.css';

const route = useRoute();
const watchStore = useWatchStore();

const searchQuery = computed(() => route.query.q || '');

const categories = ref(['Đồng hồ nam', 'Đồng hồ nữ', 'Đồng hồ phi giới']);
const brands = ref(['Rolex', 'Omega', 'Cartier', 'Tag Heuer', 'Seiko', 'Casio', 'Apple', 'Fossil']);

const selectedCategory = ref(null); // Only one category
const selectedBrand = ref(null); // Only one brand
const priceRange = ref([1000000, 5000000000]); // Default price range
const maxPriceValue = ref(5000000000); // Adjust this value based on your data

const currentPage = ref(0);
const loading = ref(false);

const setPage = async (page) => {
  if (page < 0 || page >= watchStore.totalPage) return;
  currentPage.value = page;
  watchStore.currentPage = page
  await applyFilter()
};

const formattedPrice = computed(() => {
  return priceRange.value.map(price => formatPrice(price));
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price).replace('₫', '');
};

const parsePrice = (value) => {
  return parseInt(value.replace(/[^0-9]/g, ''), 10);
};

const handleFocus = (index) => {
  formattedPrice.value[index] = priceRange.value[index];
};

const handleBlur = (index) => {
  const newValue = parsePrice(formattedPrice.value[index]);
  if (!isNaN(newValue)) {
    priceRange.value[index] = Math.max(1000000, Math.min(newValue, maxPriceValue.value));
    updateSlider();
  }
};

const updateSlider = () => {
  // Ensure that priceRange values are within bounds
  if (priceRange.value[0] < 1000000) priceRange.value[0] = 1000000;
  if (priceRange.value[1] > maxPriceValue.value) priceRange.value[1] = maxPriceValue.value;
  applyFilter();
};

const toggleCategory = (category) => {
  selectedCategory.value = selectedCategory.value === category ? null : category;
  applyFilter();
};

const toggleBrand = (brand) => {
  selectedBrand.value = selectedBrand.value === brand ? null : brand;
  applyFilter();
};

const applyFilter = async () => {
  const filters = [];
  const gender = selectedCategory.value
    ? selectedCategory.value === 'Đồng hồ nam'
      ? 'male'
      : selectedCategory.value === 'Đồng hồ nữ'
      ? 'female'
      : 'unisex'
    : null;

  if (gender) filters.push(`gender=${gender}`);
  if (selectedBrand.value) filters.push(`brand=${selectedBrand.value}`);
  const style = selectedCategory.value &&
    ['Đồng hồ cao cấp', 'Đồng hồ thể thao', 'Đồng hồ thông minh'].includes(selectedCategory.value)
    ? selectedCategory.value
    : null;
  if (style) filters.push(`style=${style}`);
  if (priceRange.value[0] && priceRange.value[1]) filters.push(`lprice=${priceRange.value[0]}&hprice=${priceRange.value[1]}`);

  try {
    // Clear the watches map and fetch filtered results
    watchStore.watches.clear();
    await watchStore.getWatchesOfPage(currentPage.value , searchQuery.value, filters);
  
  } catch (error) {
    console.error('Error applying filters:', error);
  }
};

onMounted(async () => {
  if (searchQuery.value) {
    try {
      await watchStore.getWatchesOfPage(0, searchQuery.value);
    } catch (error) {
      console.error('Error fetching initial results:', error);
    }
  }
});

// Watch for changes to searchQuery and reload
watch(searchQuery, (newQuery) => {
    window.location.reload(); // Reload the page
});

watch([selectedCategory, selectedBrand, priceRange], () => {
  applyFilter();
});

const searchResults = computed(() => {
  // Flatten all pages into a single array
  const allWatches = [];
  for (const watches of watchStore.watches.values()) {
    allWatches.push(...watches);
  }
  return allWatches;
});
</script>

<style scoped>
.search-page {
  display: flex;
  flex-direction: column;
}

.search-body {
  display: flex;
}

.search-results {
  flex-grow: 1;
  padding: 20px;
}
.price-input {
  width: 100px; /* Adjust width as needed */
  padding: 4px;
  font-size: 0.875rem; /* Adjust font size as needed */
  border: 1px solid var(--primary);
  border-radius: 4px;
  background: none;
}

.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.pagination-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background-color: #202020;
  cursor: pointer;
  transition: background-color 0.3s;
  border: solid 1px var(--primary);
}

.pagination-button:hover:not(.disabled) {
  background-color: #4e4e4e;
}

.pagination-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-text {
  margin: 0 8px;
}

.pagination-info {
  font-size: 14px;
}
</style>
