<template>
  <div v-if="auth.user_id" class="flex max-w-7xl mx-auto my-8 p-4">
    <!-- Sidebar -->
    <div class="w-1/4 mr-8">
      <h2 class="text-2xl mb-4">Cài đặt Hồ sơ</h2>
      <ul>
        <li class="mb-2">
          <router-link to="/setting/profile" class="hover-underline-animation">Thông tin cá nhân</router-link>
        </li>
        <li class="mb-2">
          <router-link to="/setting/password" class="hover-underline-animation">Mật khẩu</router-link>
        </li>
        <li class="mb-2">
          <router-link to="/setting/address" class="hover-underline-animation">Sổ địa chỉ</router-link>
        </li>
        <li class="mb-2 text-secondary">Đơn hàng của tôi </li>
        <li class="mb-2">
          <router-link to="#" class="hover-underline-animation">Xóa tài khoản</router-link>
        </li>
      </ul>
    </div>
    <!-- Content -->
    <div class="container mx-auto p-4 w-3/4">
      <!-- Navigation links -->
      <div class="mb-6">
        <a href="#orders" class="mr-4 hover-underline-animation" @click="activeSection = 'orders'">Đồng hồ đã mua</a>
        <a href="#purchases" class="hover-underline-animation" @click="activeSection = 'purchases'">Đồng hồ đã bán</a>
      </div>

      <!-- My Orders Section -->
      <div v-if="activeSection === 'orders'" id="orders">
        <h2 class="text-2xl mb-4 text-secondary">Đơn hàng mua</h2>
        <table class="w-full border-collapse">
          <thead>
            <tr class="text-left">
              <th class="pb-2">Mã Đơn Hàng</th>
              <th class="pb-2 pl-2">Ngày Đặt</th>
              <th class="pb-2 pl-2">Tổng Tiền</th>
              <th class="pb-2 pl-2">Trạng Thái</th>
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
                <button class="hover-underline-animation" @click="viewOrderDetails(order.order_id)">Xem Chi Tiết</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- My Purchased Watches Section -->
      <div v-if="activeSection === 'purchases'" id="purchases">
        <h2 class="text-2xl mb-4">Các đơn hàng đồng hồ đã bán</h2>
        <!-- Add content for purchased watches here -->
        <p>Phần này sẽ hiển thị những đồng hồ bạn đã mua.</p>
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
const activeSection = ref('orders'); // Mặc định là phần 'Đơn hàng của tôi'

onMounted(async () => {
  if (!auth.user_id) {
    console.log('Người dùng chưa đăng nhập. Đang chuyển hướng đến trang đăng nhập...');
    router.push('/login');
  } else {
    try {
      orders.value = await user.getAllOrders(auth.user_id);
    } catch (error) {
      console.error('Lỗi khi tải danh sách đơn hàng:', error);
      // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
    }
  }
});

const viewOrderDetails = (orderId) => {
  router.push(`/orderconfirmation/${orderId}`);
  console.log('Xem chi tiết đơn hàng:', orderId);
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
