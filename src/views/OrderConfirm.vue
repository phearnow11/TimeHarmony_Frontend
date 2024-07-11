<template>
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="shadow-lg p-8 max-w-7xl w-full">
        <div class="mb-6">
            <router-link to="/" class="hover-underline-animation flex w-40 ">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mt-1 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            <span>Back to Shopping</span>
          </router-link>
        </div>
        
        <div v-if="orderDetails">
        <h1 class="text-3xl font-bold mb-4">Your order #{{ orderDetails.order_detail.order_id }} is confirmed. Thanks for placement an order</h1>
        <p class="mb-6 text-gray-600">You're on your way to furniture bliss! We are preparing your order now and will send an email once it is on its way to you.</p>
  
        <div class="flex flex-col md:flex-row gap-8">
          <div class="flex-1">
            <div class="bg-black-99 p-4 mb-6">
              <div class="flex items-start">
                <ul class="space-y-4">
                <li v-for="watch in detailedWatches" :key="watch.id" class="flex items-start p-4 rounded">
                    <img :src="watch.images[0]" alt="Watch image" class="w-24 h-24 object-cover mr-4" />
                    <div class="flex justify-between w-full">
                    <h3 class="font-bold">{{ watch.name }}</h3>
                    <p class="text-xl font-bold pl-36 mb-2">{{ watch.price.toLocaleString('vi-VN') }} ₫</p>
                    </div>
                </li>
                </ul>
              </div>
            </div>
  
            <div class="grid grid-cols-2 gap-4 mb-6">
                <div>
                <h3 class="font-bold mb-2">Shipping Address</h3>
                <p class="text-[whitesmoke]">{{ orderDetails.order_detail.receive_name }}</p>
                <p class="text-[whitesmoke]">{{ orderDetails.order_detail.address }}</p>
                </div>
                
            </div>
  
            <button class="bg-olive-700 text-white px-6 py-2 rounded hover:bg-olive-800 transition duration-300">
              TRACK ORDER STATUS
            </button>
  
            <p class="mt-4 text-sm text-gray-600">
              Pressed order too soon? <a href="#" class="underline">Contact us here</a> for help with ongoing orders
            </p>
          </div>
  
          <div class="flex-1">
            <div class="bg-black p-6 shadow">
              <h2 class="text-xl font-bold mb-4">Payment Summary</h2>
              <div class="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Note</span>
                <span>{{ orderDetails.order_detail.notice }}</span>
              </div>
              <div class="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Payment Method</span>
                <span>{{ paymentMethod ?? 'COD' }}</span>
              </div>
              <div class="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Subtotal ({{ detailedWatches.length }} item(s))</span>
                <span>{{ orderDetails.order_detail.total_price.toLocaleString('vi-VN') }} ₫</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-[whitesmoke]">Voucher</span>
                <span class="text-[whitesmoke]">0 ₫</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-[whitesmoke]">Shipping</span>
                <span class="text-[whitesmoke]">0 ₫</span>
              </div>
              <div class="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Total</span>
                <span>{{ orderDetails.order_detail.total_price.toLocaleString('vi-VN') }} ₫</span>
              </div>
              <div class="mt-6">
                <div class="flex justify-between text-sm text-gray-99">
                  <span>Transaction No</span>
                  <span>{{ transactionNo ?? '123456' }}</span>
                </div>
                <div class="flex justify-between text-sm text-gray-99">
                  <span>Transaction Date</span>
                  <span>{{ formatDate(orderDetails.order_detail.create_time)}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '../stores/user'; // Adjust the import path as needed
  import { useWatchStore } from '../stores/watch';
  
  const userStore = useUserStore();
  const watchStore = useWatchStore();
  const route = useRoute();
  const orderDetails = ref(null);
  const detailedWatches = ref([]);
  const paymentMethod = userStore.payment_method;
  const transactionNo = userStore.transaction_no;
  userStore.payment_method = null;
  userStore.transaction_no = null;

  onMounted(async () => {
    const orderId = route.params.order_id;
    if (orderId) {
      try {
        orderDetails.value = await userStore.getOrderDetail(orderId);
        await fetchWatchDetails(orderDetails.value.watch);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
      }
    }
  });
  
  const fetchWatchDetails = async (watchIds) => {
    try {
      detailedWatches.value = await Promise.all(watchIds.map(id => watchStore.getDetailWatch(id)));
    } catch (error) {
      console.error('Failed to fetch watch details:', error);
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };
  </script>
  
  <style>
  /* You might need to add these custom colors to your Tailwind config */
  .bg-olive-700 { background-color: #4D5645; }
  .bg-cream-100 { background-color: #F5F5F0; }
  .bg-sage-200 { background-color: #E0E5D9; }
  </style>
  