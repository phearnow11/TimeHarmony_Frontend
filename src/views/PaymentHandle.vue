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
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '../stores/user';
  import { useAuthStore } from '../stores/auth';
  import { savePaymentDetail } from '../stores/payment';
  

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
  
  const parseDateTimeString = (dateTimeString) => {
    // Implement your date parsing logic here
    return dateTimeString;
  };
  
  onMounted(async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentData = Object.fromEntries(urlParams.entries());
  
      // Set the payment data values
      amountString.value = paymentData.vnp_Amount;
      bankCode.value = paymentData.vnp_BankCode;
      payDate.value = paymentData.vnp_PayDate;
      transactionNo.value = paymentData.vnp_TransactionNo;
      responseCode.value = paymentData.vnp_ResponseCode;
      vnpCardType.value = paymentData.vnp_CardType;
      
      userStore.transaction_no = paymentData.vnp_TransactionNo;
      userStore.payment_method = paymentData.vnp_CardType;

      if (paymentData.vnp_ResponseCode === '00') {
        successMessage.value = 'Payment successful. Saving payment details...';
        paymentStatus.value = 'Successful';
  
        // Save payment details to the backend
        const paymentDataToSave = {
          transaction_no: transactionNo.value,
          payment_amount: parseFloat(amountString.value), // Assuming amount is numeric
          bank_code: bankCode.value,
          payment_method: vnpCardType.value,
        };
  
        const savedPayment = await savePaymentDetail(paymentDataToSave);
        console.log('Saved payment details:', savedPayment);
  
        successMessage.value = 'Payment details saved. Creating order...';
  
        // Retrieve the pending order data
        const orderData = userStore.getPendingOrder();
  
        if (!orderData) {
          throw new Error('No pending order data found');
        }
  
        console.log('Attempting to create order with data:', orderData);
  
        const result = await userStore.addOrder(authStore.user_id, orderData);
        console.log('Order creation result:', result);
        const orderID = await userStore.getNewestOrder(authStore.user_id);
        console.log('Order ID:' + orderID);
        if (result) {
          orderId.value = result.order_id;
          const orderDetails = await userStore.getOrderDetail(orderID)
          console.log('Order details:', orderDetails);
  
          if (orderDetails) {
            successMessage.value = 'Order created successfully. Redirecting to confirmation page...';
            setTimeout(() => {
              router.push(`/orderconfirmation/${orderID}`);
            }, 10);
          } else {
            throw new Error('Invalid order details received');
          }
        } else {
          throw new Error('Order creation failed');
        }
      } else {
        paymentStatus.value = 'Failed';
        errorMessage.value = `Payment was not successful. Response code: ${paymentData.vnp_ResponseCode}`;
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
  