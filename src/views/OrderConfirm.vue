<template>
  <div class="flex flex-col items-center pb-40">
    <!-- Header Section -->
    <div class="flex max-w mx-auto mt-10 justify-center items-center">
      <router-link to="/">
        <img class="h-20" src="../assets/time-harmony.png" alt="Logo" />
      </router-link>
      <div class="border-l mr-5 border-primary h-10"></div>
      <div></div>
      <span class="font-bold text-3xl text-primary">Đặt hàng thành công</span>
    </div>

      <div class="shadow-lg p-8 max-w-7xl w-full">
        
        
        <div v-if="orderDetails">
        <h1 class="text-3xl font-bold mb-4">Đơn hàng #{{ orderDetails.order_detail.order_id }} đã được xác nhận. Cảm ơn bạn vì đã đặt hàng</h1>
        <p class="mb-6 text-gray-600">Chúng tôi đang chuẩn bị đơn hàng của bạn và sẽ gửi email cho bạn ngay khi đơn hàng được gửi đi.</p>
  
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
                <h3 class="font-bold mb-2">Địa chỉ giao hàng</h3>
                <p class="text-[whitesmoke]">{{ orderDetails.order_detail.receive_name }}</p>
                <p class="text-[whitesmoke]">{{ orderDetails.order_detail.address }}</p>
                </div>
                <div>
                  <h3 class="font-bold mb-2">Trạng thái giao hàng</h3>
                  <span class="text-[whitesmoke]">
                    {{ state?.display }} 
                  </span>
                </div>
            </div>
  
            <button
              v-if="buttonState" 
              @click="cancelOrder(orderDetails.order_detail.order_id)" 
              :disabled="state.original !== 'PENDING'"
              :class="[
                'px-6 py-2 rounded transition duration-300',
                state.original === 'PENDING'
                  ? 'bg-olive-700 text-white hover:bg-olive-800' 
                  : 'bg-gray-400 text-gray-700 cursor-not-allowed'
              ]"
            >
              Huỷ đơn hàng
            </button>
          </div>
  
          <div class="flex-1">
            <div class="bg-black p-6 shadow">
              <h2 class="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
              <div class="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Ghi chú</span>
                <span>{{ orderDetails.order_detail.notice }}</span>
              </div>
              <div class="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Phương thức thanh toán</span>
                <span>{{ orderDetails.payment_method ? orderDetails.payment_method : "COD"}}</span>
              </div>
              <div class="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Tạm tính ({{ detailedWatches.length }} sản phẩm)</span>
                <span>{{ orderDetails.order_detail.total_price.toLocaleString('vi-VN') }} ₫</span>
              </div>
              <!-- <div class="flex justify-between mb-2">
                <span class="text-[whitesmoke]">Voucher</span>
                <span class="text-[whitesmoke]">0 ₫</span>
              </div> -->
              <div class="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Tổng tiền</span>
                <span>{{ orderDetails.order_detail.total_price.toLocaleString('vi-VN') }} ₫</span>
              </div>
              <div class="mt-6">
                <div class="flex justify-between text-sm text-gray-99">
                  <span>Mã giao dịch</span>
                  <span>{{ transactionNo ? transactionNo : "123456" }}</span>
                </div>
                <div class="flex justify-between text-sm text-gray-99">
                  <span>Giờ/Ngày thực hiện giao dịch</span>
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
  import { useAuthStore } from '../stores/auth';
import router from '../router';
  
  const userStore = useUserStore();
  const watchStore = useWatchStore();
  const route = useRoute();
  const orderDetails = ref(null);
  const state = ref(null); 
  const buttonState = ref(false)
  const detailedWatches = ref([]);
  const order = ref([])
  const transactionNo = ref(null);
  const paymentMethod = ref(null);

  const auth = useAuthStore();

  onMounted(async () => {
    const orderId = route.params.order_id;
    order.value = await useUserStore().getAllOrders(auth.user_id)

    
    if (orderId) {
      try {
        orderDetails.value = await userStore.getOrderDetail(orderId);
        transactionNo.value = await userStore.getOrderTransactionNo(orderId);
        await fetchWatchDetails(orderDetails.value.watch);
        const orderState = await userStore.getOrderState(orderId);
        state.value = mapOrderState(orderState);
        buttonState.value = order.value.some(order => order.order_id === orderId);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
      }
    }
    
    
    
  });
  

  const mapOrderState = (state) => {
  switch (state) {
    case 'PENDING':
      return { original: 'PENDING', display: 'Đơn hàng đang được người bán chuẩn bị' };
    case 'SHIPPING':
      return { original: 'SHIPPING', display: 'Đơn hàng đang được vận chuyển' };
    case 'SHIPPED':
      return { original: 'SHIPPED', display: 'Đơn hàng đã giao đến người nhận' };
    case 'SUCCESS':
      return { original: 'SUCCESS', display: 'Đơn hàng giao thành công' };
    case 'CANCELLED':
      return { original: 'CANCELLED', display: 'Đã huỷ đơn hàng' };
  }
};

    const cancelOrder = async (orderid) => {
      try {
        if (state.value.original === 'PENDING') {
          console.log('cancelling order');
          await userStore.cancelOrder(orderid);
          // Sau khi huỷ đơn hàng thành công, cập nhật lại trạng thái
          state.value = mapOrderState('CANCELLED');
          window.location.replace('/')
        } else {
          alert("Không thể huỷ đơn hàng trong trạng thái hiện tại");
        }
      } catch (error) {
        console.log('Lỗi canceled order:', error);
      }
    }
  
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
  