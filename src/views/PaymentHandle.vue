<template>
    <div>
        <p>This page handles payment result from VNPAY</p>
        <p v-if="amountString">Payment amount: {{ amountString }}</p>
        <p v-if="bankCode">Bank code: {{ bankCode }}</p>
        <p v-if="payDate">Pay date: {{ parseDateTimeString(payDate) }}</p>
        <p v-if="transationNo">Transaction: {{ transationNo }}</p>
        <p v-if="responseCode">Payment responseCode: {{ responseCode }}</p>
        <p v-if="vnpCardType">Payment Method: {{ vnpCardType }}</p>
        <p v-if="orderId">Order ID: {{ orderId }}</p>
        <p>Payment Status: {{ paymentStatus }}</p>
        <p v-if="errorMessage" style="color: red;">Error: {{ errorMessage }}</p>
        <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();

const isLoading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');
const orderId = ref(null);
const paymentStatus = ref('');

const amountString = ref('');
const bankCode = ref('');
const payDate = ref('');
const transationNo = ref('');
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
        transationNo.value = paymentData.vnp_TransactionNo;
        responseCode.value = paymentData.vnp_ResponseCode;
        vnpCardType.value = paymentData.vnp_CardType;

        if (paymentData.vnp_ResponseCode === "00") {
            successMessage.value = "Payment successful. Creating order...";
            paymentStatus.value = "Successful";

            // Retrieve the pending order data
            const orderData = userStore.getPendingOrder();
            
            if (!orderData) {
                throw new Error('No pending order data found');
            }

            console.log('Attempting to create order with data:', orderData);

            const result = await userStore.addOrder(authStore.user_id, orderData);
            console.log('Order creation result:', result);

            if (result && result.order_id) {
                orderId.value = result.order_id;
                const orderDetails = await userStore.getOrderDetail(result.order_id);
                console.log('Order details:', orderDetails);

                if (orderDetails && orderDetails.order_detail) {
                    userStore.setCurrentOrder(orderDetails);
                    successMessage.value = "Order created successfully. Redirecting to confirmation page...";
                    setTimeout(() => {
                        router.push(`/testconfirm/${result.order_id}`);
                    }, 2000);
                } else {
                    throw new Error('Invalid order details received');
                }
            } else {
                // Fetch the most recent order if order creation fails
                const recentOrder = await userStore.getNewestOrder(authStore.user_id);
                if (recentOrder && recentOrder.order_id) {
                    orderId.value = recentOrder.order_id;
                    const orderDetails = await userStore.getOrderDetail(recentOrder.order_id);
                    console.log('Order details from recent order:', orderDetails);

                    if (orderDetails && orderDetails.order_detail) {
                        userStore.setCurrentOrder(orderDetails);
                        successMessage.value = "Order fetched successfully. Redirecting to confirmation page...";
                        setTimeout(() => {
                            router.push(`/testconfirm/${recentOrder.order_id}`);
                        }, 2000);
                    } else {
                        throw new Error('Invalid order details received from recent order');
                    }
                } else {
                    throw new Error('Order creation failed and no recent order found');
                }
            }
        } else {
            paymentStatus.value = "Failed";
            errorMessage.value = `Payment was not successful. Response code: ${paymentData.vnp_ResponseCode}`;
        }
    } catch (error) {
        console.error('Error handling payment result:', error);
        errorMessage.value = 'An unexpected error occurred. Please try again or contact support.';
        paymentStatus.value = "Error";
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
</style>