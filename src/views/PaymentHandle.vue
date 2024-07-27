<template>
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
      <button @click="returnToHomepage">Return to Homepage</button>
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
const countdown = ref(30);
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

onMounted(async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentData = Object.fromEntries(urlParams.entries());

    const pendingOrder = userStore.getPendingOrder();
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



    if (isSuccess) {
      successMessage.value = 'Payment successful. Saving payment details...';
      paymentStatus.value = 'Successful';

      const paymentDataToSave = {
        transaction_no: transactionNo.value,
        payment_amount: parseFloat(amountString.value),
        bank_code: bankCode.value,
        payment_method: vnpCardType.value,
        isSuccess: "True",
        wids: wids
      };
      console.log('Payment ok: ' + JSON.stringify(paymentDataToSave));
      const savedPayment = await savePaymentDetail(paymentDataToSave);
      console.log('Saved payment details:', savedPayment);

      successMessage.value = 'Payment details saved. Creating order...';

      const orderData = userStore.getPendingOrder();

      if (!orderData) {
        throw new Error('No pending order data found');
      }

      console.log('Attempting to create order with data:', orderData);

      const result = await userStore.addOrder(authStore.user_id, orderData);
      console.log('Order creation result:', result);
      const orderID = await userStore.getNewestOrder(authStore.user_id);
      console.log('Order ID:', orderID);
      if (result) {
        orderId.value = result.order_id;
        const orderDetails = await userStore.getOrderDetail(orderID);
        console.log('Order details:', orderDetails);

        if (orderDetails) {
          successMessage.value = 'Order created successfully. Redirecting to confirmation page...';
          router.push(`/orderconfirmation/${orderID}`);
        } else {
          throw new Error('Invalid order details received');
        }
      } else {
        throw new Error('Order creation failed');
      }
    } else {
      paymentStatus.value = 'Failed';
      errorMessage.value = `Payment was not successful. Response code: ${paymentData.vnp_ResponseCode}`;
      
      const paymentFailDataToSave = {
        transaction_no: transactionNo.value,
        payment_amount: parseFloat(amountString.value),
        bank_code: bankCode.value,
        payment_method: vnpCardType.value,
        isSuccess: "False",
        wids: wids
      };

      console.log('Failed Payment: ' + JSON.stringify(paymentFailDataToSave));
      const savedPayment = await savePaymentDetail(paymentFailDataToSave);
      console.log('Payment details saved:', savedPayment);
      
      

      localStorage.removeItem(wids)
    }
  } catch (error) {
    console.error('Error handling payment result:', error);
    errorMessage.value = 'An unexpected error occurred. Please try again or contact support.';
    paymentStatus.value = 'Error';
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
</style>
