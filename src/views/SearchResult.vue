<template>
  <div class="search-page">
    <div class="search-body flex">
      <div class="w-1/4 px-10 py-10">
        <div class="filter-category mb-6">
          <h2 class="text-lg font-bold">Phân loại</h2>
          <ul>
            <li v-for="(category, index) in categories" :key="index" class="mt-2">
              <label class="container flex justify-start items-center text-center gap-2">
                <input
                  type="checkbox"
                  v-model="selectedCategories"
                  :value="category"
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
        <div class="filter-brand mb-6">
          <h2 class="text-lg font-bold">Hãng</h2>
          <ul>
            <li v-for="(brand, index) in brands" :key="index" class="mt-2">
              <label class="container flex justify-start items-center text-center gap-2">
                <input
                  type="checkbox"
                  v-model="selectedBrands"
                  :value="brand"
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
        <div class="filter-price mb-6">
          <h2 class="text-lg font-bold">Giá</h2>
          <div class="flex items-center mt-2">
            <div class="form__group field w-96">
              <input
                type="text"
                class="form__field"
                placeholder="Tối thiểu"
                v-model="minPrice"
                @input="validateInput('min')"
              />
              <label for="minPrice" class="form__label">Tối thiểu</label>
            </div>
            <span class="px-2">-</span>
            <div class="form__group field w-96">
              <input
                type="text"
                class="form__field"
                placeholder="Tối đa"
                v-model="maxPrice"
                @input="validateInput('max')"
              />
              <label for="maxPrice" class="form__label">Tối đa</label>
            </div>
          </div>
        </div>
        
      </div>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useWatchStore } from "../stores/watch";
import ProductCard from "../components/ProductCard.vue";

const route = useRoute();
const watchStore = useWatchStore();

const searchQuery = computed(() => route.query.q || "");
const searchResults = computed(() => watchStore.searchResults);

const categories = ref([
  "Đồng hồ nam",
  "Đồng hồ nữ",
  "Đồng hồ Unisex",
]);

const brands = ref([
  "Rolex",
  "Omega",
  "Cartier",
  "Tag Heuer",
  "Seiko",
  "Casio",
  "Apple",
  "Fossil",
]);

const selectedCategories = ref([]);
const selectedBrands = ref([]);
const minPrice = ref("");
const maxPrice = ref("");

const validateInput = (type) => {
  const input = type === "min" ? minPrice : maxPrice;
  // Remove any non-digit characters
  input.value = input.value.replace(/\D/g, "");
  // Remove leading zeros
  input.value = input.value.replace(/^0+/, "");
  // If the input is empty, set it to an empty string
  if (input.value === "0") {
    input.value = "";
  }
};

const applyFilter = async () => {
  const filters = {
    gender: selectedCategories.value.includes("Đồng hồ nam")
      ? "Male"
      : selectedCategories.value.includes("Đồng hồ nữ")
      ? "Female"
      : selectedCategories.value.includes("Đồng hồ Unisex")
      ? "Unisex"
      : null,
    brand: selectedBrands.value.length > 0 ? selectedBrands.value[0] : null,
    style: selectedCategories.value.find((cat) =>
      ["Đồng hồ cao cấp", "Đồng hồ thể thao", "Đồng hồ thông minh"].includes(
        cat
      )
    ),
    priceRange:
      minPrice.value && maxPrice.value
        ? { min: minPrice.value, max: maxPrice.value }
        : null,
  };

  try {
    await watchStore.applyFilters(filters);
  } catch (error) {
    console.error("Lỗi khi áp dụng bộ lọc:", error);
  }
};

onMounted(async () => {
  if (searchQuery.value) {
    try {
      await watchStore.searchWatches(searchQuery.value);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm kết quả:", error);
    }
  }
});

watch([selectedCategories, selectedBrands, minPrice, maxPrice], () => {
  applyFilter();
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
</style>
