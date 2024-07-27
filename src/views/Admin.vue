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
      <button @click="promoteToStaff" class="th-p-btn">
        Thêm làm nhân viên
      </button>
    </div>

    <section class="mb-6">
      <h2 class="text-2xl font-semibold mb-2">Danh Sách Thành Viên</h2>
      <div class="table-container">
        <table class="table">
          <thead class="table-header">
            <tr class="text-primary">
              <th class="p-2 border-b">ID</th>
              <th class="p-2 border-b">Hình Ảnh</th>
              <th class="p-2 border-b">Tên</th>
              <th class="p-2 border-b">Email</th>
              <th class="p-2 border-b">Username</th>
              <th class="p-2 border-b">Số Điện Thoại</th>
              <th class="p-2 border-b">Vai trò</th>
              <th class="p-2 border-b">Trạng Thái</th>
              <th class="p-2 border-b">Cấm người dùng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in members" :key="member.member_id">
              <td class="p-2 border-b">{{ member.member_id }}</td>
              <td class="p-2 border-b">
                <img
                  :src="member.member_image"
                  alt="Member Image"
                  class="w-12 h-12"
                />
              </td>
              <td class="p-2 border-b">
                {{ member.first_name }} {{ member.last_name }}
              </td>
              <td class="p-2 border-b">{{ member.email }}</td>
              <td class="p-2 border-b">{{ member.user_log_info.username }}</td>
              <td class="p-2 border-b">{{ member.phone || "N/A" }}</td>
              <td class="p-2 border-b">
                {{ member.user_log_info.authorities.authority || "N/A" }}
              </td>
              <td class="p-2 border-b">
                {{ member.user_log_info.enabled === 1 ? 'Hoạt động' : 'Bị cấm' }}
              </td>
              <td class="p-2 border-b">
                <div
                  v-if="member.user_log_info.enabled === 1"
                  class="hover-underline-animation-r flex items-center justify-center gap-2"
                  @click="openBanModal(member)"
                >
                  Cấm khỏi hệ thống <span class="mdi mdi-cancel"></span>
                </div>
                <div v-else
                  class="hover-underline-animation-r flex items-center justify-center gap-2"
                  @click="unbanUser(member)"
                >
                  Bỏ cấm người dùng<span class="mdi mdi-cancel"></span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="mb-6">
      <h2 class="text-2xl font-semibold mb-2">Sản Phẩm</h2>
      <div class="table-container">
        <table class="table">
          <thead class="table-header">
            <tr class="text-primary">
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
                  <img
                    :src="product.seller.member_image"
                    alt="Seller Image"
                    class="w-8 h-8 rounded-full mr-2"
                  />
                  <span>{{ product.seller.user_log_info.username }}</span>
                </div>
              </td>
              <td class="p-2 border-b">{{ product.price }}</td>
              <td class="p-2 border-b">
                {{ product.state === 1 ? "Hoạt động" : "Không hoạt động" }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="mb-6">
      <h2 class="text-2xl font-semibold mb-2">Đơn Hàng</h2>
      <div class="table-container">
        <table class="table">
          <thead class="table-header">
            <tr class="text-primary">
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
              <td class="p-2 border-b">
                {{ new Date(order.create_time).toLocaleDateString() }}
              </td>
              <td class="p-2 border-b">{{ order.address }}</td>
              <td class="p-2 border-b">{{ order.receive_name }}</td>
              <td class="p-2 border-b">{{ order.phone }}</td>
              <td class="p-2 border-b">{{ order.notice || "N/A" }}</td>
              <td class="p-2 border-b">{{ order.total_price }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="mb-6">
      <h2 class="text-2xl font-semibold mb-2">Tổng Quan Lợi Nhuận</h2>
      <div class="profit-container p-4 border border-secondary rounded mb-6">
        <p class="text-xl font-medium">
          Doanh Thu Tổng: {{ totalRevenue.toLocaleString("vi-VN") + " ₫" }}
        </p>
        <p class="text-xl font-medium">
          Chi Phí Tổng: {{ totalCost.toLocaleString("vi-VN") + " ₫" }}
        </p>
        <p class="text-xl font-medium">
          Lợi Nhuận Tổng: {{ totalProfit.toLocaleString("vi-VN") + " ₫" }}
        </p>
      </div>
      <ProfitChart
        :totalRevenue="totalRevenue"
        :totalCost="totalCost"
        :totalProfit="totalProfit"
      />
    </section>

    <!-- Ban User Modal -->
    <div v-if="isBanModalOpen" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeBanModal">&times;</span>
        <h2>Xác nhận Cấm người dùng</h2>
        <textarea
          v-model="banMessage"
          placeholder="Lý do cấm người dùng"
          rows="4"
          class="textarea"
        ></textarea>
        <button @click="confirmBanUser" class="confirm-btn">Xác nhận</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAdminStore } from "../stores/admin";
import ProfitChart from "../components/ProfitChart.vue";
import { useChatStore } from "../stores/chat";
import { useAuthStore } from "../stores/auth";
import { useUserStore } from "../stores/user";
import router from "../router";
import { useMailStore } from "../stores/mail";

// Initialize the store
const adminStore = useAdminStore();

// State variables
const userId = ref("");
const isBanModalOpen = ref(false);
const banMessage = ref("");
const selectedMember = ref(null);

// Fetch data from the store on component mount
onMounted(async () => {
  await adminStore.getMembers();
  await adminStore.getWatches();
  await adminStore.getOrders();
});

if(useUserStore().role !== 'ROLE_ADMIN' && useAuthStore().user_id !== import.meta.env.VITE_ADMIN_USERID) {
  console.log('Not ADMIN');
  router.push('/');
}

// Define computed properties
const members = computed(() => adminStore.members);
const products = computed(() => adminStore.products);
const orders = computed(() => adminStore.orders);

// Compute financial metrics
const totalCost = computed(() =>
  products.value.reduce((sum, product) => sum + product.price * 1, 0)
); // Stock is always 1

const totalRevenue = computed(() =>
  orders.value.reduce((sum, order) => sum + order.total_price, 0)
);
const totalProfit = computed(() => totalRevenue.value * 0.02); // 2% profit from total revenue

// Define a method to promote a user to staff
const promoteToStaff = async () => {
  try {
    await adminStore.promoteToStaff(userId.value);
    // Optionally refresh members data after promotion
    await adminStore.getMembers();
  } catch (error) {
    console.error("Failed to promote user:", error);
  }
};

// Open the ban modal
const openBanModal = (member) => {
  selectedMember.value = member;
  isBanModalOpen.value = true;
};

// Close the ban modal
const closeBanModal = () => {
  isBanModalOpen.value = false;
  banMessage.value = "";
  selectedMember.value = null;
};

// Confirm ban user
const confirmBanUser = () => {
  if (selectedMember.value) {
    useChatStore().registerUser2(selectedMember.value.member_id)
      .then(() => {
        return useChatStore().sendMessage(
          selectedMember.value.member_id,
          `Tài khoản mang tên ${selectedMember.value.user_log_info.username} đã bị cấm khỏi nền tảng! Lý do: ${banMessage.value}.`
        );
      })
      .then(() => {
        useMailStore().send(selectedMember.value.email, "THÔNG BÁO BẠN ĐÃ BỊ BAN KHỎI TIME HARMONY.", `Tài khoản mang tên ${selectedMember.value.user_log_info.username} đã bị cấm khỏi nền tảng! Lý do: ${banMessage.value}.`);
        return useAdminStore().ban(selectedMember.value.user_log_info.username);
      })
      .catch((error) => {
        console.error("Error banning user:", error);
      })
      .finally(() => {
        closeBanModal();
      });
  }
};

const unbanUser = (member) => {
  useChatStore().removeChat(useAuthStore().user_id, member.member_id);
  useAdminStore().unBan(member.user_log_info.username);
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
  position: sticky;
  top: 0;
  z-index: 10; /* Ensure the table header is above the table rows */
}

.table th,
.table td {
  padding: 8px;
  border: 1px solid var(--secondary);
}

.table-header th {
  background-color: #494949; /* Matches your background color */
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

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000; /* Ensure the modal is above all other content */
}

.modal-content {
  background-color: #181818;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.textarea {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background: #181818;
}

.confirm-btn {
  margin-top: 10px;
  background-color: var(--primary);
  color: #fff;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}
</style>