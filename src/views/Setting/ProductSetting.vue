<template>
  <div v-if="auth.user_id" class="mx-auto p-6 flex flex-col lg:flex-row">
    <!-- Sidebar -->
    <aside class="w-1/4 lg:mr-8 p-4">
      <h2 class="text-2xl mb-4">Cài đặt Hồ sơ</h2>
      <ul class="space-y-2">
        <li><router-link to="/setting/profile" class="hover-underline-animation">Thông tin cá nhân</router-link></li>
        <li><router-link to="/setting/password" class="hover-underline-animation">Mật khẩu</router-link></li>
        <li><router-link to="/setting/address" class="hover-underline-animation">Sổ địa chỉ</router-link></li>
        <li class="text-secondary">Đơn hàng của tôi</li>
        <li><router-link to="#" class="hover-underline-animation-r">Xoá tài khoản</router-link></li>
      </ul>
    </aside>
    <!-- Content -->
    <div class="container mx-auto p-4 w-3/4">
      <!-- Navigation links -->
      <div class="mb-6">
        <a href="#orders" class="mr-4 hover-underline-animation" @click="activeSection = 'orders'">Đồng hồ đã mua</a>
        <a href="#purchases" class="hover-underline-animation" @click="activeSection = 'purchases'">Đồng hồ đã đăng bán</a>
      </div>

      <!-- My Orders Section -->
      <div v-if="activeSection === 'orders'" id="orders">
        <h2 class="text-2xl mb-4 text-secondary">Đơn hàng mua</h2>
        <table class="w-full border-collapse">
          <thead>
            <tr class="text-left">
              <th class="pb-2">Số Thứ Tự</th>
              <th class="pb-2">Mã Đơn Hàng</th>
              <th class="pb-2 pl-2">Ngày Đặt</th>
              <th class="pb-2 pl-2">Tổng Tiền</th>
              <th class="pb-2 pl-2">Trạng Thái</th>
              <th class="pb-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in orders" :key="order.order_id" class="border-t">
              <td class="py-4">{{ index + 1 }}</td>
              <td class="py-4">{{ order.order_id }}</td>
              <td class="py-4 pl-2">{{ formatDate(order.create_time) }}</td>
              <td class="py-4 pl-2">{{ formatPriceVND(order.total_price) }}</td>
              <td class="py-4 pl-2">{{ state }}</td>
              <td class="py-4 px-2 text-right">
                <button class="hover-underline-animation" @click="viewOrderDetails(order.order_id)">Xem Chi Tiết</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- My Purchased Watches Section -->
      <div v-if="activeSection === 'purchases'" id="purchases">
        <h2 class="text-2xl mb-4">Các đơn hàng đồng hồ đã đăng bán</h2>
        <table class="w-full border-collapse">
          <thead>
            <tr class="text-left">
              <th class="pb-2">Số Thứ Tự</th>
              <th class="pb-2">Ảnh</th>
              <th class="pb-2 pl-2">Mã đồng hồ</th>
              <th class="pb-2 pl-2">Tên</th>
              <th class="pb-2 pl-2">Giá</th>
              <th class="pb-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(list, index) in wlists" :key="list.watch_id" class="border-t">
              <td class="py-4">{{ index + 1 }}</td>
              <td class="py-4"><img :src="list.image_url[0]" alt="watch image" class="w-16 h-16 object-cover"></td>
              <td class="py-4 pl-2">{{ list.watch_id }}</td>
              <td class="py-4 pl-2">{{ list.watch_name }}</td>
              <td class="py-4 pl-2">{{ formatPriceVND(list.price) }}</td>
              <td class="py-4 pl-2">{{ list.state === 3 ? 'Đang chờ duyệt đơn' : list.state }}</td>
              <td class="py-4 px-2 text-right">
                <button class="hover-underline-animation" @click="setShip(list.watch_id)">Giao hàng</button>
              </td>
            </tr>
          </tbody>
        </table>
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
const state = ref(null);
const orders = ref([]);
const wlists = ref([]);
const activeSection = ref('orders'); // Mặc định là phần 'Đơn hàng của tôi'

onMounted(async () => {
  if (!auth.user_id) {
    console.log('Người dùng chưa đăng nhập. Đang chuyển hướng đến trang đăng nhập...');
    router.push('/login');
  } else {
    await loadOrders();
    const orderState = await user.getOrderState(orders.order_id);
          state.value = orderState === 'PENDING' 
            ? 'Đơn hàng đã được gửi đến người bán'
            : 'Đơn hàng đang được vận chuyển';
  }
});

const loadOrders = async () => {
  try {
    orders.value = await user.getAllOrders(auth.user_id);
    
    wlists.value = await user.getOrderWaiting(auth.user_id);
  } catch (error) {
    console.error('Lỗi khi tải danh sách đơn hàng:', error);
    // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
  }
};

const setShip = async (watchid) => {
  try {
    await user.setShipping(watchid);
    await loadOrders(); // Reload the orders and wlists after shipping
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái giao hàng:', error);
    // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
  }
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
/* Add your styles here */
</style>
