<template>
  <div v-if="isLoading" class="overlay">
      <div class="loader-container">
        <div class="loader">
          <div class="loaderBar"></div>
        </div>
      </div>
    </div>
  <div>
    <p>This page handles payment result from VNPAY</p>
    <p v-if="amountString">Payment amount: {{ amountString }}</p>
    <p v-if="bankCode">Bank code: {{ bankCode }}</p>
    <p v-if="payDate">Pay date: {{ parseDateTimeString(payDate) }}</p>
    <p v-if="transactionNo">Transaction: {{ transactionNo }}</p>
    <p v-if="responseCode">Payment responseCode: {{ responseCode }}</p>
    <p v-if="vnpCardType">Payment Method: {{ vnpCardType }}</p>
    <p v-if="orderId">Order ID: {{ orderId }}</p>
    <p>Payment Status: {{ paymentStatus }}</p>
    <p v-if="errorMessage" class="error-message">Error: {{ errorMessage }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

    <div v-if="paymentStatus === 'Failed'">
      <p>Returning to homepage in {{ countdown }} seconds...</p>
      <button @click="returnToHomepage" class="hover-underline-animation">Return to Homepage</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { useAuthStore } from '../stores/auth';
import { savePaymentDetail } from '../stores/payment';
import { useCartStore } from '../stores/cart';
import { useMailStore } from '../stores/mail';

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const errorMessage = ref('');
const successMessage = ref('');
const orderId = ref(null);
const paymentStatus = ref('');
const amountString = ref('');
const bankCode = ref('');
const payDate = ref('');
const transactionNo = ref('');
const responseCode = ref('');
const vnpCardType = ref('');

const loadUser = userStore.loadUser(authStore.user_id);

const countdown = ref(15);
let countdownTimer;

const parseDateTimeString = (dateTimeString) => {
  return new Date(dateTimeString).toLocaleString();
};

const returnToHomepage = () => {
  router.push('/');
};

const startCountdown = () => {
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer);
      returnToHomepage();
    }
  }, 1000);
};

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});

const isLoading = ref(false)

onMounted(async () => {
  try {
    isLoading.value = true;
    const urlParams = new URLSearchParams(window.location.search);
    const paymentData = Object.fromEntries(urlParams.entries());

    console.log('Received payment data:', paymentData);

    amountString.value = paymentData.vnp_Amount;
    bankCode.value = paymentData.vnp_BankCode;
    payDate.value = paymentData.vnp_PayDate;
    transactionNo.value = paymentData.vnp_TransactionNo;
    responseCode.value = paymentData.vnp_ResponseCode;
    vnpCardType.value = paymentData.vnp_CardType;

    userStore.transaction_no = paymentData.vnp_TransactionNo;
    userStore.payment_method = paymentData.vnp_CardType;
    
    const isSuccess = paymentData.vnp_ResponseCode === '00';

    const wids = JSON.parse(localStorage.getItem('pendingWids') || '[]');
    console.log('Watch id: ' + wids);


    const widsString = `[${wids.join(',')}]`;

    if (isSuccess) {
      
      successMessage.value = 'Payment details saved. Creating order...';
      
      
      const orderData = userStore.getPendingOrder();
      orderData.transaction_no = transactionNo.value;

      console.log('Attempting to create order with data:', orderData);      
      const result = await userStore.addOrder(authStore.user_id, orderData);
      
      console.log('Order creation result:', result);
      if (result !== "java.lang.Exception: An Error occur" && orderData !== null) {
        

      successMessage.value = 'Payment successful. Saving payment details...';
      paymentStatus.value = 'Successful';
      console.log('Order ID:', result);
      const paymentDataToSave = {
        transaction_no: transactionNo.value,
        payment_amount: parseFloat(amountString.value),
        bank_code: bankCode.value,
        payment_method: vnpCardType.value,
        order_id: result,
        member_id: authStore.user_id,
        isSuccess: isSuccess,
        wids: widsString
      };
      console.log('Payment ok: ' + JSON.stringify(paymentDataToSave));
      const savedPayment = await savePaymentDetail(paymentDataToSave);
      console.log('Saved payment details:', savedPayment);

      const orderDetails = await userStore.getOrderDetail(result);
      console.log('Order details:', orderDetails);
      if (orderDetails) {
        successMessage.value = 'Order created successfully. Redirecting to confirmation page...';
        router.push(`/orderconfirmation/${result}`);
        useMailStore().send(
        (await loadUser).email,
        "THÔNG BÁO ĐƠN HÀNG ĐÃ ĐẶT THÀNH CÔNG - TIME HARMONY.",
        `Đơn hàng có mã #${result} đã được đặt thành công. Vui lòng chú ý đến cái trạng thái giao hàng để nhận được hàng. Chúc bạn 1 ngày tốt lành`)
      } else {
        throw new Error('Invalid order details received');
      }

      } else {
        successMessage.value = 'Có lỗi khi tạo đơn hàng, hãy cung cấp số giao dịch ở trên với Time Harmony để được liên hệ giải quyết';
        paymentStatus.value = 'Failed';
        const paymentDataNullOrder = {
          transaction_no: transactionNo.value,
          payment_amount: parseFloat(amountString.value),
          bank_code: bankCode.value,
          payment_method: vnpCardType.value,
          order_id: null,
          member_id: authStore.user_id,
          isSuccess: isSuccess,
          wids: widsString
        };
        console.log('Payment order id null: ' + JSON.stringify(paymentDataNullOrder));
        const savedPayment = await savePaymentDetail(paymentDataNullOrder);
        console.log('Saved payment details:', savedPayment);


        return;
      }
    } else {
      paymentStatus.value = 'Failed';
      errorMessage.value = `Payment was not successful. Response code: ${paymentData.vnp_ResponseCode}`;
      
      const paymentFailDataToSave = {
        transaction_no: transactionNo.value,
        payment_amount: parseFloat(amountString.value),
        bank_code: bankCode.value,
        payment_method: vnpCardType.value,
        isSuccess: "false",
        wids: widsString
      };

      console.log('Failed Payment: ' + JSON.stringify(paymentFailDataToSave));
      const savedPayment = await savePaymentDetail(paymentFailDataToSave);
      console.log('Payment details saved:', savedPayment);
      startCountdown();
      localStorage.removeItem(wids)
    }
  } catch (error) {
    console.error('Error handling payment result:', error);
    errorMessage.value = 'An unexpected error occurred. Please try again or contact support.';
    paymentStatus.value = 'Error';
    const paymentDataNullOrder = {
          transaction_no: transactionNo.value,
          payment_amount: parseFloat(amountString.value),
          bank_code: bankCode.value,
          payment_method: vnpCardType.value,
          order_id: null,
          member_id: authStore.user_id,
          isSuccess: isSuccess,
          wids: widsString
        };
        console.log('Payment order id null: ' + JSON.stringify(paymentDataNullOrder));
        const savedPayment = await savePaymentDetail(paymentDataNullOrder);
        console.log('Saved payment details:', savedPayment);
  } finally {
    isLoading.value = false;
  }

});
</script>

<style scoped>
.error-message {
  color: red;
  font-weight: bold;
}
.success-message {
  color: green;
  font-weight: bold;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 9999;
}
.loader-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  background: rgba(
    23,
    23,
    23,
    0.5
  ); /* Adjust the alpha value for transparency */
}

.loader {
  width: 80px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  position: relative;
  padding: 1px;
}

.loader .loaderBar {
  position: absolute;
  top: 0;
  right: 100%;
  bottom: 0;
  left: 0;
  background: var(--secondary);
  width: 0;
  animation: borealisBar 2s linear infinite;
}



.loader::after {
  content: "";
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border: 2px solid var(--secondary);
  left: 0;
  top: 0;
  animation: rotation 2s ease-in-out infinite alternate;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
