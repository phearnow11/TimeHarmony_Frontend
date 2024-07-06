<template>
    <div v-if="auth.user_id" class="flex max-w-7xl mx-auto my-8 p-4">
      <!-- Sidebar -->
      <div class="w-1/4 mr-8">
        <h2 class="text-2xl mb-4">Profile Settings</h2>
        <ul>
          <li class="mb-2"><router-link to="/setting/profile" class="hover-underline-animation">Account</router-link></li>
          <li class="mb-2"><router-link to="/setting/password" class="hover-underline-animation">Password</router-link></li>
          <li class="mb-2"><router-link to="/setting/address" class="hover-underline-animation">My Address</router-link></li>
          <li class="mb-2 text-secondary">My Watch Product</li>
          <li class="mb-2"><router-link to="#" class="hover-underline-animation">Delete account</router-link></li>
        </ul>
      </div>
      <!-- Content -->
      <div class="container mx-auto p-4 w-3/4">
        <!-- Navigation links -->
        <div class="mb-6">
          <a href="#orders" class="mr-4 hover-underline-animation" @click="activeSection = 'orders'">My Orders</a>
          <a href="#purchases" class="hover-underline-animation" @click="activeSection = 'purchases'">My Purchased Watches</a>
        </div>
  
        <!-- My Orders Section -->
        <div v-if="activeSection === 'orders'" id="orders">
          <h2 class="text-2xl mb-4 text-secondary">My Orders</h2>
          <table class="w-full border-collapse">
            <thead>
              <tr class="text-left">
                <th class="pb-2">Order ID</th>
                <th class="pb-2 pl-2">Date</th>
                <th class="pb-2 pl-2">Total</th>
                <th class="pb-2 pl-2">Status</th>
                <th class="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.order_id" class="border-t">
                <td class="py-4">{{ order.order_id }}</td>
                <td class="py-4 pl-2">{{ formatDate(order.create_time) }}</td>
                <td class="py-4 pl-2">{{ formatPriceVND(order.total_price) }}</td>
                <td class="py-4 pl-2">{{ order.status }}</td>
                <td class="py-4 px-2 text-right">
                  <button class="hover-underline-animation" @click="viewOrderDetails(order.order_id)">View Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- My Purchased Watches Section -->
        <div v-if="activeSection === 'purchases'" id="purchases">
          <h2 class="text-2xl mb-4">My Purchased Watches</h2>
          <!-- Add content for purchased watches here -->
          <p>This section will display your purchased watches.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from '../../stores/auth';
  import { useUserStore } from '../../stores/user';
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const user = useUserStore();
  const auth = useAuthStore();
  const router = useRouter();
  const orders = ref([]);
  const activeSection = ref('orders'); // Default to 'orders' section
  
  onMounted(async () => {
    if (!auth.user_id) {
      console.log('User is not logged in. Redirecting to login...');
      router.push('/login');
    } else {
      try {
        orders.value = await user.getAllOrders(auth.user_id);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        // Handle error (e.g., show an error message to the user)
      }
    }
  });
  
  const viewOrderDetails = (orderId) => {
    router.push(`/testconfirm/${orderId}`);
    console.log('View order details:', orderId);
  };
  
  const formatPriceVND = (price) => {
    return price.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND'
    });
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };
  </script>
  
  <style scoped>

  </style>