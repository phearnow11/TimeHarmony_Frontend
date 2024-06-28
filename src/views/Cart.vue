<template>
  <div class="flex justify-center items-center flex-col">
    <section class="w-3/4 p-4">
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold">Watch Cart</span>
      </div>
    </section>
    <section class="w-3/4 mb-4 p-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <label class="flex items-center cursor-pointer">
            <input type="checkbox" v-model="selectAll" @change="toggleAllProducts" class="mr-2">
            <span>Select All ({{ cartItems.length }})</span>
          </label>
          <button @click="deleteSelected" class="hover-underline-animation-r">Delete all</button>
          <button class="hover-underline-animation">Move to My Likes</button>
        </div>
        <div class="flex items-center space-x-4">
          <span class="font-semibold">
            Total ({{ selectedItemsCount }} item{{ selectedItemsCount !== 1 ? 's' : '' }}): 
            <span class="text-secondary font-thin">₫{{ totalPrice.toLocaleString('vi-VN') }}</span>
          </span>
          <router-link to="/order" class="th-p-btn">
            Check Out
          </router-link>
        </div>
      </div>
    </section>
    <cart-item
      v-for="item in cartItems" 
      :key="item.watch_id"
      :productName="item.name || 'Loading...'"
      :retailerName="item.sellerName || 'Loading...'"
      :productImage="item.image || ''"
      :price="item.price || 'Loading...'"
      :retailerAvatar="item.sellerAvatar || ''"
      :isSelected="item.isSelected"
      @toggle-select="toggleItemSelection(item.watch_id)"
      @delete-item="deleteItem(item.watch_id)"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useWatchStore } from '../stores/watch';
import CartItem from '../components/CartItem.vue'

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
  const index = cartItems.value.findIndex(item => item.watch_id === watchId);
  if (index !== -1) {
    cartItems.value[index] = {
      ...cartItems.value[index],
      name: details.name,
      price: parseFloat(details.price) || 0,
      image: details.images?.[0] || '',
      sellerName: details.seller?.user_log_info?.username || '',
      sellerAvatar: details.seller?.member_image || ''
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
    cartItems.value = cartStore.cart_info.map(item => ({
      ...item,
      isSelected: false,
      name: 'Loading...',
      price: 0,
      image: '',
      sellerName: 'Loading...',
      sellerAvatar: ''
    }));
    await fetchAllWatchDetails();
  } catch (error) {
    console.error('Error fetching cart:', error);
  }
});

const selectedItemsCount = computed(() => cartItems.value.filter(item => item.isSelected).length);

const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return item.isSelected ? total + item.price : total;
  }, 0);
});

const toggleAllProducts = () => {
  cartItems.value.forEach(item => item.isSelected = selectAll.value);
};

const toggleItemSelection = (watchId) => {
  const item = cartItems.value.find(item => item.watch_id === watchId);
  if (item) {
    item.isSelected = !item.isSelected;
  }
  selectAll.value = cartItems.value.every(item => item.isSelected);
};

const deleteItem = async (watchId) => {
  try {
    await cartStore.removeFromCart(auth.user_id, watchId);
    cartItems.value = cartItems.value.filter(item => item.watch_id !== watchId);
    selectAll.value = cartItems.value.every(item => item.isSelected);
  } catch (error) {
    console.error('Error deleting item:', error);
  }
};

const deleteSelected = async () => {
  try {
    for (const item of cartItems.value.filter(item => item.isSelected)) {
      await cartStore.removeFromCart(auth.user_id, item.watch_id);
    }
    cartItems.value = cartItems.value.filter(item => !item.isSelected);
    selectAll.value = false;
  } catch (error) {
    console.error('Error deleting selected items:', error);
  }
};
</script>