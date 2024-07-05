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

    
     <!-- Main content -->
     <div class="flex justify-center h-0 items-start w-full px-10 pt-5 pb-32">
        <!-- Shipping Address Section -->
        <section
          v-if="shippingAddress"
          class="w-8/12 flex items-start justify-between bg-zinc-900 p-4 mr-4"
        >
          <div class="flex flex-col items-start flex-grow">
            <p><span class="mdi mdi-map-marker"></span> Shipping Address</p>
            <p class="mt-3">
              <span class="mr-5">{{ shippingAddress.name || "No information" }}</span>
              {{ shippingAddress.phone || "No information" }}
            </p>
            <p>{{ shippingAddress.address || "No information" }}</p>
          </div>
          <div class="flex-none">
            <button class="hover-underline-animation text-gray-500">
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

        <!-- Order Summary -->
          <div class="border-t border-secondary pt-4">
            <span class="block text-xl font-bold pb-4">Order Summary</span>
            <div class="flex justify-between font-normal">
              <span>Subtotal ({{ selectedItems.length }} items)</span>
              <span class="font-bold">{{ totalPrice.toLocaleString("vi-VN") }} ₫</span>
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
            <span class="text-xl font-bold">Note from customer</span>
            <div class="form__group field w-full">
              <p>{{ note }}</p>
            </div>
          </div>

          <!-- Voucher Section -->
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

          <!-- Total -->
          <div class="border-t border-secondary pt-5 flex justify-between items-center">
            <span class="font-bold text-xl">Total</span>
            <span class="font-bold">{{ totalPrice.toLocaleString("vi-VN") }} ₫</span>
          </div>
          <span class="text-xs">VAT included, where applicable</span>

          <!-- Place Order Button -->
          <button
            @click="createOrder"
            class="th-p-btn text-white px-4 py-2 w-full text-center"
          >
            Place an order
          </button>
        </section>
      </div>

      <!-- Selected Items Summary -->
      <div class="w-full px-10">
        <h2 class="text-xl font-bold mb-4">Order Items</h2>
        <div v-for="item in selectedItems" :key="item.watch_id" class="mb-4 p-4 bg-zinc-900">
          <h3>{{ item.name }}</h3>
          <p>Price: {{ item.price.toLocaleString("vi-VN") }} ₫</p>
          <!-- Add more item details as needed -->
        </div>
      </div>
    </div>


  <div class="px-16 pt-96 pb-5">
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
import { useCartStore } from '../stores/cart';
import { useUserStore } from '../stores/user';
import { useAuthStore } from '../stores/auth';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const userStore = useUserStore();
const auth = useAuthStore();
const router = useRouter();

const selectedItems = ref([]);
const totalPrice = ref(0);
const shippingAddress = ref(null);
const note = ref('');
const selectedOption = ref('cod');

onMounted(() => {
  selectedItems.value = cartStore.getSelectedItems;
  totalPrice.value = cartStore.getTotalPrice;
  shippingAddress.value = cartStore.getShippingAddress;
  note.value = cartStore.getNote;

  if (selectedItems.value.length === 0) {
    router.push('/cart');
  }
});

const createOrder = async () => {
  const orderData = {
    wids: selectedItems.value.map(item => item.watch_id),
    address: shippingAddress.value.id,
    notice: note.value,
    total_price: totalPrice.value,
    payment_method: selectedOption.value
  };

  try {
    const result = await userStore.addOrder(auth.user_id, orderData);
    console.log('Order created successfully:', result);
    cartStore.clearOrderDetails();
    router.push('/ConfirmOrder');
  } catch (error) {
    console.error('Failed to create order:', error);
    alert('Failed to create order. Please try again.');
  }
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
</style>