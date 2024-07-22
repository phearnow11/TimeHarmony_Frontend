<template>
  <div class="admin-page p-6 gap-6">
    <h1 class="text-3xl font-bold mb-4">Bảng Điều Khiển Quản Trị</h1>
    <div class="flex items-center gap-9">
      <div class="form__group mb-3">
        <input
          type="text"
          class="form__field"
          placeholder="Nhập ID người dùng"
          v-model="userId"
          required
        />
        <label for="userid" class="form__label">ID người dùng</label>
      </div>
      <button @click="promoteToStaff" class="th-p-btn">Thêm làm nhân viên</button>
    </div>

    <section class="mb-6">
      <h2 class="text-2xl font-semibold mb-2">Danh Sách Thành Viên</h2>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr class="bg-primary text-white">
              <th class="p-2 border-b">ID</th>
              <th class="p-2 border-b">Hình Ảnh</th>
              <th class="p-2 border-b">Tên</th>
              <th class="p-2 border-b">Email</th>
              <th class="p-2 border-b">Username</th>
              <th class="p-2 border-b">Số Điện Thoại</th>
              <th class="p-2 border-b">Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in members" :key="member.member_id">
              <td class="p-2 border-b">{{ member.member_id }}</td>
              <td class="p-2 border-b">
                <img :src="member.member_image" alt="Member Image" class="w-12 h-12" />
              </td>
              <td class="p-2 border-b">{{ member.first_name }} {{ member.last_name }}</td>
              <td class="p-2 border-b">{{ member.email }}</td>
              <td class="p-2 border-b">{{ member.user_log_info.username }}</td>
              <td class="p-2 border-b">{{ member.phone || 'N/A' }}</td>
              <td class="p-2 border-b">{{ member.is_active ? 'Active' : 'Inactive' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="mb-6">
      <h2 class="text-2xl font-semibold mb-2">Sản Phẩm</h2>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr class="bg-primary text-white">
              <th class="p-2 border-b">ID</th>
              <th class="p-2 border-b">Tên</th>
              <th class="p-2 border-b">Người Bán</th>
              <th class="p-2 border-b">Giá</th>
              <th class="p-2 border-b">Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.watch_id">
              <td class="p-2 border-b">{{ product.watch_id }}</td>
              <td class="p-2 border-b">{{ product.watch_name }}</td>
              <td class="p-2 border-b">
                <div class="flex items-center">
                  <img :src="product.seller.member_image" alt="Seller Image" class="w-8 h-8 rounded-full mr-2" />
                  <span>{{ product.seller.user_log_info.username }}</span>
                </div>
              </td>
              <td class="p-2 border-b">{{ product.price }}</td>
              <td class="p-2 border-b">{{ product.state === 1 ? 'Active' : 'Inactive' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="mb-6">
      <h2 class="text-2xl font-semibold mb-2">Đơn Hàng</h2>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr class="bg-primary text-white">
              <th class="p-2 border-b">ID Đơn Hàng</th>
              <th class="p-2 border-b">Ngày Tạo</th>
              <th class="p-2 border-b">Địa Chỉ</th>
              <th class="p-2 border-b">Tên Nhận Hàng</th>
              <th class="p-2 border-b">Số Điện Thoại</th>
              <th class="p-2 border-b">Ghi Chú</th>
              <th class="p-2 border-b">Tổng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.order_id">
              <td class="p-2 border-b">{{ order.order_id }}</td>
              <td class="p-2 border-b">{{ new Date(order.create_time).toLocaleDateString() }}</td>
              <td class="p-2 border-b">{{ order.address }}</td>
              <td class="p-2 border-b">{{ order.receive_name }}</td>
              <td class="p-2 border-b">{{ order.phone }}</td>
              <td class="p-2 border-b">{{ order.notice || 'N/A' }}</td>
              <td class="p-2 border-b">{{ order.total_price }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="mb-6">
      <h2 class="text-2xl font-semibold mb-2">Tổng Quan Lợi Nhuận</h2>
      <div class="profit-container p-4 border border-secondary rounded mb-6">
        <p class="text-xl font-medium">Doanh Thu Tổng: {{ totalRevenue.toLocaleString("vi-VN") + ' ₫' }}</p>
        <p class="text-xl font-medium">Chi Phí Tổng: {{ totalCost.toLocaleString("vi-VN") + ' ₫' }}</p>
        <p class="text-xl font-medium">Lợi Nhuận Tổng: {{ totalProfit.toLocaleString("vi-VN") + ' ₫' }}</p>
      </div>
      <ProfitChart :totalRevenue="totalRevenue" :totalCost="totalCost" :totalProfit="totalProfit" />
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '../stores/admin';
import ProfitChart from '../components/ProfitChart.vue';

// Initialize the store
const adminStore = useAdminStore();

// State variables
const userId = ref('');

// Fetch data from the store on component mount
onMounted(async () => {
  await adminStore.getMembers();
  await adminStore.getWatches();
  await adminStore.getOrders();
});

// Define computed properties
const members = computed(() => adminStore.members);
const products = computed(() => adminStore.products);
const orders = computed(() => adminStore.orders);

// Compute financial metrics
const totalCost = computed(() => products.value.reduce((sum, product) => sum + (product.price * 1), 0)); // Stock is always 1

const totalRevenue = computed(() => orders.value.reduce((sum, order) => sum + order.total_price, 0));
const totalProfit = computed(() => totalRevenue.value * 0.05); // 5% profit from total revenue

// Define a method to promote a user to staff
const promoteToStaff = async () => {
  try {
    await adminStore.promoteToStaff(userId.value);
    // Optionally refresh members data after promotion
    await adminStore.getMembers();
  } catch (error) {
    console.error('Failed to promote user:', error);
  }
};

// Format currency
const currency = (value) => `${value.toLocaleString("vi-VN")} ₫`;
</script>

<style scoped>
.admin-page {
  background-color: #212121;
  color: var(--secondary);
}

.table-container {
  overflow-x: auto;
  max-height: 400px; /* Adjust this value as needed */
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background-color: var(--primary);
  color: #fff;
}

.table th, .table td {
  padding: 8px;
  border: 1px solid var(--secondary);
}

.table th {
  text-align: left;
}

.table tbody tr:nth-child(even) {
  background-color: #333;
}

.table-container::-webkit-scrollbar {
  height: 8px;
}

.table-container::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #ffbd59;
}

.profit-container {
  background-color: #333;
  color: var(--secondary);
}
</style>
