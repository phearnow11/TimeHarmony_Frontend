<template>
  <div v-if="auth.user_id" class="flex justify-center items-center flex-col mb-96">
    <section class="w-full pt-5 px-9">
      <div class="flex justify-between">
        <span class="text-2xl font-semibold">Watch Cart</span>
      </div>
    </section>
    <div class="flex justify-center h-0 items-start w-full px-10 pt-5 pb-20">
      <section class="w-8/12 flex items-center bg-zinc-900 p-4 mr-4">
        <div class="flex items-center flex-grow">
          <label class="flex items-center cursor-pointer checkbox-container">
            <input
              type="checkbox"
              :checked="selectAll"
              @change="toggleAllProducts"
              class="hidden"
            />
            <svg viewBox="0 0 64 64" height="1em" class="checkbox-svg">
              <path
                d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                class="path"
              ></path>
            </svg>
            <span class="ml-2">{{ selectAll ? "Deselect all" : "Select all" }} ( {{ cartItems.length }} Item(s) )</span>
          </label>
        </div>
        <div>
          <button
            @click="deleteSelected"
            class="hover-underline-animation-r text-gray-500"
          >
            <i class="fas fa-trash-alt mr-1"></i> Delete
          </button>
        </div>
        
      </section>
      
      <section class="flex flex-col z-20 bg-zinc-900 p-6 shadow w-4/12 space-y-4">
        <div class="flex flex-col">
          <p><span class="mdi mdi-map-marker"></span> Ho Chi Minh City</p>
        </div>
        <div class="border-t border-secondary pt-4">
          <span class="block font-bold text-xl pb-4">Order Summary</span>
          <div class="flex justify-between font-normal">
            <span>Subtotal ({{ selectedItemsCount }} items)</span>
            <span class=" font-bold">{{ totalPrice.toLocaleString("vi-VN") }} ₫</span>
          </div>
          <div class="flex justify-between">
            <span>Shipping Fee</span>
            <span class=" font-bold">0 ₫</span>
          </div>
          <div class="flex justify-between">
            <span>Discount</span>
            <span class=" font-bold">0 ₫</span>
          </div>
        </div>
        <div class="border-t border-secondary pt-5 form-content">
          <span class="text-xl font-bold">Voucher</span>
          <div class="form__group field w-full">
            <input
              type="text"
              class="form__field"
              placeholder="Enter a voucher"
            />
            <label for="voucher" class="form__label">Enter a voucher</label>
          </div>
        </div>
        <button class="th-p-btn text-white px-4 py-2">
          Apply
        </button>
        <div class="border-t border-secondary pt-5 flex justify-between items-center">
          <span class="font-semibold text-xl">Total</span>
          <span class="font-bold">{{ totalPrice.toLocaleString("vi-VN") }} ₫</span>
        </div>
        <span class="text-xs">VAT included, where applicable</span>
        <router-link
          to="/order"
          class="th-p-btn text-white px-4 py-2 w-full text-center"
        >
          Proceed to order
        </router-link>
      </section>
    </div>
    
      <cart-item
      
      v-for="item in cartItems"
      :key="item.watch_id"
      :productName="item.name || 'Loading...'"
      :retailerName="item.sellerName || 'Loading...'"
      :productImage="item.image || ''"
      :price="item.price || 0"
      :retailerAvatar="item.sellerAvatar || ''"
      :isSelected="item.isSelected"
      @toggle-select="toggleItemSelection(item.watch_id)"
      @delete-item="deleteItem(item.watch_id)"
      />
  </div>
  <div v-else class="h-screen flex flex-col items-center justify-center">
    <div>
      <p class="text-xl font-medium text-center">You need to login to use this function, <router-link class="hover-underline-animation" to="/login">Log in now</router-link></p>
    </div>
    <div class="mt-4">
      <router-link to="/" class="hover-underline-animation">Go back to Home</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useCartStore } from "../stores/cart";
import { useAuthStore } from "../stores/auth";
import { useWatchStore } from "../stores/watch";
import CartItem from "../components/CartItem.vue";

const watchStore = useWatchStore();
const auth = useAuthStore();
const cartStore = useCartStore();
const watchDetails = ref({});
const cartItems = ref([]);
const selectAll = ref(false);

const fetchWatchDetails = async (watchId) => {
  try {
    const details = await watchStore.getDetailWatch(watchId);
    watchDetails.value[watchId] = details;
    updateCartItem(watchId, details);
  } catch (error) {
    console.error(`Error fetching watch details for ${watchId}:`, error);
  }
};

const updateCartItem = (watchId, details) => {
  const index = cartItems.value.findIndex((item) => item.watch_id === watchId);
  if (index !== -1) {
    cartItems.value[index] = {
      ...cartItems.value[index],
      name: details.name,
      price: parseFloat(details.price) || 0,
      image: details.images?.[0] || "",
      sellerName: details.seller?.user_log_info?.username || "",
      sellerAvatar: details.seller?.member_image || "",
    };
  }
};

const fetchAllWatchDetails = async () => {
  for (const item of cartStore.cart_info) {
    await fetchWatchDetails(item.watch_id);
  }
};

onMounted(async () => {
  try {
    await cartStore.getCart(auth.user_id);
    cartItems.value = cartStore.cart_info.map((item) => ({
      ...item,
      isSelected: false,
      name: "Loading...",
      price: 0,
      image: "",
      sellerName: "Loading...",
      sellerAvatar: "",
    }));
    await fetchAllWatchDetails();
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
});

const selectedItemsCount = computed(
  () => cartItems.value.filter((item) => item.isSelected).length
);

const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return item.isSelected ? total + (item.price || 0) : total;
  }, 0);
});

const toggleAllProducts = () => {
  selectAll.value = !selectAll.value;
  cartItems.value.forEach((item) => (item.isSelected = selectAll.value));
};

const toggleItemSelection = (watchId) => {
  const item = cartItems.value.find((item) => item.watch_id === watchId);
  if (item) {
    item.isSelected = !item.isSelected;
  }
  updateSelectAllState();
};

const updateSelectAllState = () => {
  selectAll.value =
    cartItems.value.length > 0 &&
    cartItems.value.every((item) => item.isSelected);
};

const deleteItem = async (watchId) => {
  try {
    await cartStore.removeFromCart(auth.user_id, watchId);
    cartItems.value = cartItems.value.filter(
      (item) => item.watch_id !== watchId
    );
    updateSelectAllState();
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};

const deleteSelected = async () => {
  try {
    for (const item of cartItems.value.filter((item) => item.isSelected)) {
      await cartStore.removeFromCart(auth.user_id, item.watch_id);
    }
    cartItems.value = cartItems.value.filter((item) => !item.isSelected);
    selectAll.value = false;
  } catch (error) {
    console.error("Error deleting selected items:", error);
  }
};

watch(cartItems, updateSelectAllState, { deep: true });
</script>

<style scoped>
.checkbox-container {
  display: inline-flex;
  align-items: center;
}
.checkbox-svg {
  width: 1em;
  height: 1em;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.checkbox-container input:checked + .checkbox-svg .path {
  stroke-dashoffset: 0;
}

.checkbox-container .path {
  stroke-dasharray: 320;
  stroke-dashoffset: 320;
  transition: stroke-dashoffset 0.3s ease;
}
</style>