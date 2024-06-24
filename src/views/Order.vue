<template>
  <div v-if="auth.user_id">
    <div class="flex max-w mx-auto mt-10 left-10 justify-center">
      <router-link to="/">
        <img
          class="h-20 flex items-center"
          src="../assets/time-harmony.png"
          alt=""
        />
      </router-link>
      <div class="border-l mr-5 border-primary"></div>
      <span class="font-bold mt-5 text-2xl text-primary">
        Payment Checkout
      </span>
      <div
        class="border-b pt-5 flex align-middle justify-center items-center"
      ></div>
    </div>
    <div class="max-w-4xl mx-auto p-4 my-10 shadow-lg">
      <div class="border-b pb-4 mb-4">
        <h2 class="text-lg font-semibold mb-2">Delivery Address</h2>
        <p class="text-sm">Nhân Võ Thành (+84) 365663185</p>
        <p class="text-sm">
          633/245, tổ 68, khu phố 9, Phường Phú Lợi, Thành Phố Thủ Dầu Một, Bình
          Dương
        </p>
        <button class="text-blue-500 mt-2">Change</button>
      </div>

      <div class="border-b pb-4 mb-4">
        <h2 class="text-lg font-semibold mb-2">Products Ordered</h2>
        <div class="flex items-center mb-4">
          <img src="" alt="Product" class="w-16 h-16 mr-4" />
          <div>
            <p class="text-sm">VD.Ví Da Cao Cấp</p>
            <p class="text-sm">Variation: KE ĐEN</p>
            <p class="text-sm text-red-500">₫21.500</p>
          </div>
        </div>
      </div>

      <div class="border-b pb-4 mb-4">
        <h2 class="text-lg font-semibold mb-2">Shipping Option</h2>
        <div class="flex items-center justify-between">
          <p class="text-sm">Nhanh</p>
          <p class="text-sm text-red-500">₫37.700</p>
          <button class="text-blue-500">Change</button>
        </div>
        <p class="text-sm text-green-500">
          Guaranteed to get by 25 Tháng 6 - 27 Tháng 6
        </p>
        <p class="text-sm">
          Get a ₫15.000 voucher if no delivery was attempted by 27 Tháng 6 2024.
        </p>
      </div>

      <div class="pb-4 mb-4">
        <h2 class="text-lg font-semibold mb-2">Payment Method</h2>
        <p class="text-sm">Cash on Delivery</p>
        <button class="text-blue-500">Change</button>
      </div>

      <div class="border-t pt-4">
        <div class="flex justify-between mb-2">
          <p class="text-sm">Merchandise Subtotal:</p>
          <p class="text-sm">₫21.500</p>
        </div>
        <div class="flex justify-between mb-2">
          <p class="text-sm">Shipping Total:</p>
          <p class="text-sm">₫37.700</p>
        </div>
        <div class="flex justify-between font-bold">
          <p>Total Payment:</p>
          <p>₫59.200</p>
        </div>
        <button class="w-full bg-orange-500 text-white py-2 rounded-lg mt-4">
          Place Order
        </button>
      </div>
    </div>
    <div></div>
  </div>
  <div v-else class="h-screen flex flex-col items-center justify-center">
    <div>
      <p class="text-xl font-medium text-center">
        You need to login to use this function,
        <router-link class="hover-underline-animation" to="/login"
          >Log in now</router-link
        >
      </p>
    </div>
    <div class="mt-4">
      <router-link to="/" class="hover-underline-animation"
        >Go back to Home</router-link
      >
    </div>
  </div>
</template>
  
  <script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
// Define any necessary reactive state here
const necessaryData = ref({
  // Add your necessary data properties here
});
</script>
  
  
  <style scoped>
/* Tailwind CSS should be imported in your main CSS or main JS file */
</style>
  