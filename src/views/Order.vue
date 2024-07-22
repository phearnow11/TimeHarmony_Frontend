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
        Xác nhận đơn hàng
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
            <p><span class="mdi mdi-map-marker pr-2"></span>Địa chỉ giao hàng</p>
            <p class="mt-3">
              <span class="mr-5">{{ shippingAddress.name || "No information" }}</span>
            </p>
            <p>
              {{ shippingAddress.phone || "No information" }}
            </p>
            <p>{{ shippingAddress.address || "No information" }}</p>
          </div>
          
        </section>

      <section
        class="flex flex-col z-20 bg-zinc-900 p-6 shadow w-4/12 space-y-4 h-auto "
      >
        <div class="flex justify-between items-center">
          <span class="text-xl font-bold">Chọn phương thức thanh toán</span>
          
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
                <h3 class="font-medium">Thanh toán khi nhận hàng</h3>
                <p class="text-sm text-gray-500">Trả tiền khi bạn nhận hàng</p>
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
                <h3 class="font-medium">Thanh toán thẻ ATM/Internet Banking</h3>
                <p class="text-sm text-gray-500">Chuyển khoản qua hệ thống VNPay</p>
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
          <div class="border-t border-secondary border-dashed pt-4">
            <span class="block text-xl font-bold pb-4">Thông tin đơn hàng</span>
            <div class="flex justify-between font-normal">
              <span class="text-gray-99">Tạm tính ({{ selectedItems.length }} sản phẩm)</span>
              <span class="text-[whitesmoke] font-bold">{{ totalPrice.toLocaleString("vi-VN") }} ₫</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-99">Phí vận chuyển</span>
              <span class="text-[whitesmoke] font-bold">{{ shipFee.toLocaleString("vi-VN") }} ₫</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-99">Discount</span>
              <span class=" text-[whitesmoke] font-bold">0 ₫</span>
            </div>
          </div>

          <div class="border-t border-secondary border-dashed pt-5 form-content">
            <span class="text-xl font-bold">Ghi chú của bạn</span>
            <div class="form__group field w-full">
              <p>{{ note || "Không có thông tin"}}</p>
            </div>
          </div>

          

          <!-- Total -->
          <div class="border-t border-secondary border-dashed  pt-5 flex justify-between items-center">
            <span class="font-bold text-xl">Tính tổng</span>
            <span class="font-bold">{{ totalAll.toLocaleString("vi-VN") }} ₫</span>
          </div>

          <!-- Place Order Button -->
          <button
            @click="createOrder"
            :disabled="isProcessingPayment"
            class="th-p-btn text-white px-4 py-2 w-full text-center"
          >
            {{ isProcessingPayment ? 'Tiến hàng đặt hàng...' : 'Đặt hàng' }}
          </button>
        </section>
      </div>

      <!-- Selected Items Summary -->
      <div class="w-full px-10">
        <h2 class="text-xl font-bold pt-10 pb-3">Giỏ hàng của bạn ({{ selectedItems.length }} sản phẩm)</h2>
        <div class="px-6">
          <order-item
          v-for="item in selectedItems" :key="item.watch_id"
          :productName="item.name || 'Loading...'"
          :productImage="item.image || ''"
          :price="item.price || 0"
          >
          </order-item>
          <!-- <h3>{{ item.name }}</h3>
          <p>Price: {{ item.price.toLocaleString("vi-VN") }} ₫</p> -->
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
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import OrderItem from '../components/OrderItem.vue';
import { createVnPayPayment } from '../stores/payment';

const cartStore = useCartStore();
const userStore = useUserStore();
const auth = useAuthStore();
const router = useRouter();
const selectedItems = ref([]);
const shippingAddress = ref(null);
const note = ref('');
const selectedOption = ref('cod');
const isProcessingPayment = ref(false);
const shipFee = computed(() => cartStore.getShipFee);
const totalPrice = computed(() => cartStore.getTotalPrice);
const totalAll = computed(() => cartStore.getTotalWithShipping);

onMounted(() => {
  selectedItems.value = cartStore.getSelectedItems;
  totalAll.value = cartStore.getTotalWithShipping;
  shippingAddress.value = cartStore.getShippingAddress;
  note.value = cartStore.getNote;


  if (selectedItems.value.length === 0) {
    router.push('/cart');
  }
});


//Tạo order
const createOrder = async () => {
  const orderData = {
    wids: selectedItems.value.map(item => item.watch_id),
    address: shippingAddress.value.id,
    notice: note.value,
    total_price: totalAll.value,
    payment_method: selectedOption.value,
    transaction_no: selectedOption.value === 'card' ? '123456' : '123456', // Replace '123456' with your actual logic for transaction_no

  };

  localStorage.setItem(`pay_method`,orderData.payment_method)
  localStorage.setItem(`trans_no`,orderData.transaction_no)
  try {
    if (selectedOption.value === 'cod') {
      console.log('Sending order data:', orderData);
      const result = await userStore.addOrder(auth.user_id, orderData);
      console.log('Order created successfully: ', result);
      // Get the most recent order
      const mostRecentOrder = await userStore.getNewestOrder(auth.user_id);
      console.log('Most recent order:', mostRecentOrder);

      if (mostRecentOrder) {
        console.log('Fetching order details for order ID:', mostRecentOrder);
        const orderDetails = await userStore.getOrderDetail(mostRecentOrder);
        console.log('Order details:', orderDetails);
        
        if (orderDetails && orderDetails.order_detail) {
          userStore.setCurrentOrder(orderDetails);
          router.push(`/orderconfirmation/${mostRecentOrder}`);
        } else {
          console.error('Invalid order details:', orderDetails);
          alert('Error processing order. Please try again.');
        }
      } else {
        console.error('No recent order found');
        alert('Error creating order. Please try again.');
      }
    } else if (selectedOption.value === 'card') {
      userStore.setPendingOrder(orderData);

      isProcessingPayment.value = true;
      // VNPay payment process
      const paymentResponse = await createVnPayPayment(totalAll.value);
      if (paymentResponse.data && paymentResponse.data.paymentUrl) {
        // Redirect to VNPay payment page
        window.location.href = paymentResponse.data.paymentUrl;
      } else {
        throw new Error('Invalid payment response');
      }
    } else {
      alert('Invalid payment method. Please try again.');
    }
  } catch (error) {
    console.error('Failed to process payment:', error);
    alert('Failed to process payment. Please try again.');
  } finally {
    isProcessingPayment.value = false;
  }
};

// Add this method to handle the return from VNPay
const handleVNPayReturn = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const vnpResponseCode = urlParams.get('vnp_ResponseCode');
  
  if (vnpResponseCode === '00') {
    // Payment successful, create order
    try {
      const result = await userStore.addOrder(auth.user_id, {
        wids: selectedItems.value.map(item => item.watch_id),
        address: shippingAddress.value.id,
        notice: note.value,
        total_price: totalPrice.value,
        payment_method: 'card'
      });
      console.log('Order created successfully: ', result);

      // Get the most recent order
      const mostRecentOrder = await userStore.getOrder(auth.user_id);
      if (mostRecentOrder && mostRecentOrder.order_id) {
        const orderDetails = await userStore.getOrderDetail(mostRecentOrder.order_id);
        if (orderDetails && orderDetails.order_detail) {
          userStore.setCurrentOrder(orderDetails);
          router.push(`/orderconfirmation/${mostRecentOrder.order_id}`);
        } else {
          console.error('Invalid order details:', orderDetails);
          alert('Error processing order. Please try again.');
        }
      } else {
        console.error('No recent order found');
        alert('Error creating order. Please try again.');
      }
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order. Please try again.');
    }
  } else {
    alert('Payment was not successful. Please try again.');
    router.push('/cart');  // Redirect back to cart page
  }
};

onMounted(() => {
  // Check if we're returning from VNPay
  if (window.location.search.includes('vnp_ResponseCode')) {
    handleVNPayReturn();
  }
});
//Tạo order

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