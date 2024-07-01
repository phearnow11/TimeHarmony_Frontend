<template>
  <div v-if="auth.user_id">
  <div class="flex justify-center items-center flex-col pb-40">
    <div class="flex max-w mx-auto mt-10 left-10 justify-center">
      <router-link to="/">
        <img
          class="h-20 flex items-center"
          src="../assets/time-harmony.png"
          alt=""
        />
      </router-link>
      <div class="border-l mr-5 border-primary"></div>
      <span class="font-bold mt-5 text-3xl text-primary">
        Payment Checkout
      </span>
      <div
        class="border-b pt-5 flex align-middle justify-center items-center"
      ></div>
    </div>
    <div class="flex justify-center h-0 items-start w-full px-10 pt-5 pb-32">
      <section
        class="w-8/12 flex items-start justify-between bg-zinc-900 p-4 mr-4"
      >
        <div class="flex flex-col items-start flex-grow">
          <p><span class="mdi mdi-map-marker"></span> Shipping Address</p>
          <p class="mt-3">
            <span class="mr-5"
              >{{ userStore.first_name }} {{ userStore.last_name }}</span
            >{{ userStore.phone }}
          </p>
          <p>{{ userStore.address || "633/24/5" }}</p>
        </div>
        <div class="flex-none">
          <button
            @click="deleteSelected"
            class="hover-underline-animation text-gray-500"
          >
            Edit
          </button>
        </div>
      </section>

      <section
        class="flex flex-col z-20 bg-zinc-900 p-6 shadow w-4/12 space-y-4 h-auto "
      >
        <div class="flex justify-between items-center">
          <span class="text-xl font-bold">Select payment method</span>
          <button class="hover-underline-animation text-gray-500">
            View all methods
          </button>
        </div>
        <div class="space-y-4">
          <div
            @click="selectedOption = 'cod'"
            class="border p-4 flex items-center justify-between cursor-pointer"
            :class="{ 'border-primary': selectedOption === 'cod' }"
          >
            <div class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 mr-3 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <div>
                <h3 class="font-medium">Cash On Delivery</h3>
                <p class="text-sm text-gray-500">Pay when you receive</p>
              </div>
            </div>
            <div
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
              :class="{
                'border-primary bg-primary': selectedOption === 'cod',
              }"
            >
              <svg
                v-if="selectedOption === 'cod'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                class="w-4 h-4"
              >
                <path
                  fill-rule="evenodd"
                  d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- Credit/Debit Card Option -->
          <div
            @click="selectedOption = 'card'"
            class="border p-4 flex items-center justify-between cursor-pointer"
            :class="{ 'border-primary': selectedOption === 'card' }"
          >
            <div class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 mr-3 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <div>
                <h3 class="font-medium">Credit/Debit Card</h3>
                <p class="text-sm text-gray-500">Tap to add card</p>
              </div>
            </div>
            <div
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
              :class="{
                'border-primary bg-primary': selectedOption === 'card',
              }"
            >
              <svg
                v-if="selectedOption === 'card'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                class="w-4 h-4"
              >
                <path
                  fill-rule="evenodd"
                  d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        <div class="border-t border-secondary pt-4">
          <span class="block text-xl font-bold pb-4">Order Summary</span>
          <div class="flex justify-between font-normal">
            <span>Subtotal ({{ selectedItemsCount }} items)</span>
            <span class="font-bold"
              >{{ totalPrice.toLocaleString("vi-VN") }} ₫</span
            >
          </div>
          <div class="flex justify-between">
            <span>Shipping Fee</span>
            <span class="font-bold">0 ₫</span>
          </div>
          <div class="flex justify-between">
            <span>Discount</span>
            <span class="font-bold">0 ₫</span>
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
        <button class="th-p-btn text-white px-4 py-2">Apply</button>
        <div
          class="border-t border-secondary pt-5 flex justify-between items-center"
        >
          <span class="font-bold text-xl">Total</span>
          <span class="font-bold"
            >{{ totalPrice.toLocaleString("vi-VN") }} ₫</span
          >
        </div>
        <span class="text-xs">VAT included, where applicable</span>
        <router-link
          to="/order"
          class="th-p-btn text-white px-4 py-2 w-full text-center"
        >
          Place an order
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
  <div class="px-16 pt-72 pb-5">
    <h2 class="text-xl font-semibold mb-4">Need help?</h2>
    <p class="mb-4">
      Check our <router-link to="/about" class="hover-underline-animation">Help pages</router-link> or 
      <router-link to="/about" class="hover-underline-animation">contact us</router-link>
    </p>

    <h3 class="font-semibold mb-2">For an item sold by Time Harmony:</h3>
    <p class="mb-4">
      When you click the "Place your order" button, we'll send you an email message 
      acknowledging receipt of your order. Your contract to purchase an item will not 
      be complete until we send you an email notifying you that the item has been shipped.
    </p>

    <p class="font-semibold mb-2">
      Important information about sales tax you may owe in your state
    </p>

    <p class="mb-4">
      You may return new, unopened merchandise in original condition within 30 days of delivery. 
      Exceptions and restrictions apply. See Time Harmony's 
      <router-link to="/about" class="hover-underline-animation">Returns Policy</router-link>.
    </p>

    <p>
      Need to add more items to your order? 
      <router-link to="/" class="hover-underline-animation">
        Continue shopping on the Time Harmony homepage
      </router-link>.
    </p>
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
import CartItem from "../components/CartItem.vue";
import { useUserStore } from "../stores/user";

const watchStore = useWatchStore();
const userStore = useUserStore();
const auth = useAuthStore();
const cartStore = useCartStore();
const watchDetails = ref({});
const cartItems = ref([]);
const selectAll = ref(false);
const selectedOption = ref('cod');

console.log("user:" + userStore.first_name);

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