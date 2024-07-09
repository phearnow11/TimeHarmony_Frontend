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
        <div class="flex flex-row items-center justify-between w-full">
          <div class="flex items-center">
            <p v-if="selectedAddress" class="flex items-center">
              <span class="mdi mdi-map-marker"></span>
              {{ selectedAddress.address }}
            </p>
            <p v-else-if="defaultAddress" class="flex items-center">
              <span class="mdi mdi-map-marker"></span>
              {{ defaultAddress.address }}
            </p>
            <p v-else class="flex items-center">No address selected</p>
          </div>
          <button @click="openAddressModal" class="hover-underline-animation flex items-center">Edit</button>
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
          <span class="text-xl font-bold">Note</span>
          <div class="form__group field w-full">
            <input
              v-model="note"
              type="text"
              class="form__field"
              placeholder="Enter a note"
            />
            <label for="note" class="form__label">Enter a note</label>
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
        <button
          @click="createOrder"
          class="th-p-btn text-white px-4 py-2 w-full text-center"
        >
          Proceed to order
        </button>
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

      <div v-if="showAddressModal" class="modal-overlay">
      <div class="modal-content">
        <h2 class="text-xl font-bold mb-4">Select Shipping Address</h2>
        <div v-for="address in addresses" :key="address.id" class="address-item mb-2">
          <label class="flex items-center">
            <input
              type="radio"
              :value="address"
              v-model="tempSelectedAddress"
              :checked="address.id === tempSelectedAddress?.id"
              class="mr-2"
            />
            <span>
              {{ address.name}} {{ address.phone }} <br>
              {{ address.address }}
            </span>
          </label>
        </div>
        <div class="mt-4 flex justify-end">
          <button @click="closeAddressModal" class="mr-2 px-4 py-2 border border-secondary">Cancel</button>
          <button @click="confirmAddressSelection" class="th-p-btn px-4 py-2">Confirm</button>
        </div>
      </div>
    </div>
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
import { useUserStore } from "../stores/user";
import CartItem from "../components/CartItem.vue";
import { useRouter } from 'vue-router';

const watchStore = useWatchStore();
const auth = useAuthStore();
const cartStore = useCartStore();
const userStore = useUserStore();
const watchDetails = ref({});
const cartItems = ref([]);
const selectAll = ref(false);
const addresses = ref([]);
const defaultAddress = ref(null);
const showAddressModal = ref(false);
const selectedAddress = ref(null);
const tempSelectedAddress = ref(null);
const note = ref('');
const router = useRouter();

const fetchAddresses = async () => {
  try {
    addresses.value = await userStore.getAddressDetails(auth.user_id);
    console.log("Fetched addresses:", addresses.value);
    selectedAddress.value = addresses.value.find(addr => addr.isDefault) || null;
    console.log("Selected address:", selectedAddress.value);
  } catch (error) {
    console.error("Error fetching addresses:", error);
  }
};

const closeAddressModal = () => {
  showAddressModal.value = false;
  tempSelectedAddress.value = null;
};

const openAddressModal = () => {
  tempSelectedAddress.value = selectedAddress.value;
  showAddressModal.value = true;
};

const confirmAddressSelection = () => {
  if (tempSelectedAddress.value) {
    selectedAddress.value = tempSelectedAddress.value;
    console.log("New selected address:", selectedAddress.value);
  }
  closeAddressModal();
};

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
    await fetchAddresses();
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

const createOrder = async () => {
  const selectedItems = cartItems.value.filter(item => item.isSelected);
  cartStore.setSelectedItems(selectedItems);
  cartStore.setTotalPrice(totalPrice.value);
  cartStore.setShippingAddress(selectedAddress.value);
  cartStore.setNote(note.value);
  
  router.push('/order');
};

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

.modal-overlay {
  padding: 5px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(20, 20, 20, 0.836);
  backdrop-filter: blur(10px); /* Apply a blur effect to the background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: hidden;
}

.modal-content {
  background-color: #1a1a1a;
  padding: 2rem;
  max-width: 700px;
  width: 100%;
  height: 70%;
  overflow-y: scroll;
  
}

.address-item {
  padding: 0.5rem;
  border: 1px solid #333;
}
</style>