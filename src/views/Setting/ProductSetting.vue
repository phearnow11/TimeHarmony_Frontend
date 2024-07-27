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
        <a href="#purchases" class="mr-4 hover-underline-animation" @click="activeSection = 'purchases'">Đồng hồ đã đăng bán</a>
        <a v-if="isStaff" href="#pending-watches" class="mr-4 hover-underline-animation" @click="activeSection = 'pending-watches'">Đồng hồ đang chờ người bán xác nhận</a>     
       </div>

      <!-- My Orders Section -->
      <div v-if="activeSection === 'orders'" id="orders">
        <h2 class="text-2xl mb-4 text-secondary">Đơn hàng mua</h2>
        <div class="table-container">
          <table class="w-full border-collapse table">
            <thead class="table-header">
              <tr class="bg-[#494949] text-primary">
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
                <td class="py-4 pl-2">{{ getOrderStatusText(order.order_id) }}</td>
                <td class="py-4 px-2">
                  <button v-if="orderStates[order.order_id] !== 'DELETED'" class="hover-underline-animation" @click="viewOrderDetails(order.order_id)">Xem Chi Tiết</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- My Purchased Watches Section -->
      <div v-if="activeSection === 'purchases'" id="purchases">
        <h2 class="text-2xl mb-4">Các đơn hàng đồng hồ đã đăng bán</h2>
        <div class="table-container">
          <table class="w-full border-collapse table">
            <thead class="table-header">
              <tr class="bg-[#494949] text-primary">
                <th class="pb-2">Số Thứ Tự</th>
                <th class="pb-2">Ảnh</th>
                <th class="pb-2 pl-2">Mã đồng hồ</th>
                <th class="pb-2 pl-2">Tên</th>
                <th class="pb-2 pl-2">Giá</th>
                <th class="pb-2">Trạng thái</th>
                <th class="pb-2">Mã đơn</th>
                <th class="pb-2">Thời gian tạo đơn</th>
                <th class="pb-2">Hành động</th>
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
                <td class="py-4 pl-2">{{ watchOrderDetails[list.watch_id] ? watchOrderDetails[list.watch_id][0] : 'N/A' }}</td>
                <td class="py-4 pl-2">{{ watchOrderDetails[list.watch_id] ? formatDateHour(watchOrderDetails[list.watch_id][1]) : 'N/A' }}</td>
                
                <td class="py-4 px-2">
                  <button class="hover-underline-animation" @click="setShip(list.watch_id)">Đóng gói và giao hàng</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pending Watches Section -->
      <div v-if="activeSection === 'pending-watches'" id="pending-watches">
        <h2 class="text-2xl mb-4 text-secondary">Các đơn hàng chờ xác nhận</h2>
        <div class="table-container">
          <table class="w-full border-collapse table">
            <thead class="table-header">
              <tr class="bg-[#494949] text-primary">
                <th class="pb-2">Số Thứ Tự</th>
                <th class="pb-2">Mã đơn</th>
                <th class="pb-2 pl-2">Thời gian tạo đơn</th>
                <th class="pb-2 pl-2">Địa chỉ ship</th>
                <th class="pb-2 pl-2">Tên người nhận</th>
                <th class="pb-2 pl-2">SĐT người nhận</th>
                <th class="pb-2">Lời nhắn</th>
                <th class="pb-2">Giá đơn</th>
                <th class="pb-2">Trạng thái</th>
                <th class="pb-2">Ngày giao đến</th>
                <th class="pb-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in sortedPendingWatches" class="border-t">
                <td class="py-4">{{ index + 1 }}</td>
                <td class="py-4">
                <span @click="viewOrderDetails(item.order_id)" class="hover-underline-animation">
                  {{ item.order_id }}
                </span>
                </td>
                <td class="py-4 pl-2">{{ formatDate(item.create_time) }}</td>
                <td class="py-4 pl-2">{{ item.address }}</td>
                <td class="py-4 pl-2">{{ item.receive_name }}</td>
                <td class="py-4 pl-2">{{ item.phone }}</td>
                <td class="py-4 pl-2">{{ item.notice ? item.notice : 'Không có thông tin' }}</td>
                <td class="py-4 pl-2">{{ formatPriceVND(item.total_price) }}</td>
                <td class="py-4 pl-2">{{ item.state === 'PENDING' ? 'Đang chờ người vận chuyển hoặc người bán' : 'Đã được gửi đến người vận chuyển' }}</td>
                <td class="py-4 pl-2">{{ shipping_date ? shipping_date : 'Không có thông tin' }}</td>

                <td class="py-4 px-2">
                  <button class="hover-underline-animation" @click="approveWatch(item.watch_id)">Duyệt</button>
                  <button class="hover-underline-animation" @click="deleteWatch(item.watch_id)">Xóa</button>
                </td>
                
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth';
import { useStaffStore } from '../../stores/staff';
import { useUserStore } from '../../stores/user';
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const user = useUserStore();
const auth = useAuthStore();
const router = useRouter();
const orderStates = ref({}); // Store order states
const orders = ref([]);
const wlists = ref([]);
const pendingWatches = ref([]);
const activeSection = ref('orders'); // Default section is 'orders'
const isStaff = ref(false);
const watchOrderDetails = ref({});


const viewOrderDetails = (orderId) => {
  const state = orderStates.value[orderId];
  if (state !== 'DELETED') {
    router.push(`/orderconfirmation/${orderId}`);
    console.log('Xem chi tiết đơn hàng:', orderId);
  } else {
    alert('Đơn hàng đã bị xóa, không thể xem chi tiết.');
  }
};



onMounted(async () => {
  if (!auth.user_id) {
    console.log('Người dùng chưa đăng nhập. Đang chuyển hướng đến trang đăng nhập...');
    router.push('/login');
  } else {
    await loadOrders();
    await loadOrderStates();
    const u = await user.loadUser(auth.user_id);
    console.log(u.role);
    if(u.role === 'ROLE_STAFF') isStaff.value = true;
    else isStaff.value = false;
    if (isStaff) {
      await loadPendingWatches();
    }
  }
});

const loadOrderStates = async () => {
  try {
    const ordersList = orders.value; // Assuming orders are already loaded
    for (const order of ordersList) {
      const state = await user.getOrderState(order.order_id);
      orderStates.value[order.order_id] = state;
    }
  } catch (error) {
    console.error('Lỗi khi tải trạng thái đơn hàng:', error);
  }
};

const getOrderStatusText = (orderId) => {
  const state = orderStates.value[orderId];
  if(state === 'PENDING')
           return 'Đơn hàng đã được gửi đến người bán'
        else if (state === 'SHIPPING')
            return 'Đơn hàng đang được vận chuyển'
        else
            return 'Đã huỷ đơn hàng'
};

const loadOrders = async () => {
  try {
    orders.value = await user.getAllOrders(auth.user_id);
    wlists.value = await user.getOrderWaiting(auth.user_id);
    for (const watch of wlists.value) {
      try {
        const orderDetails = await user.getOrderOfWatch(watch.watch_id);
        watchOrderDetails.value[watch.watch_id] = orderDetails[0]; // Assuming the API always returns an array with one item
      } catch (error) {
        console.error(`Error fetching order details for watch ${watch.watch_id}:`, error);
        watchOrderDetails.value[watch.watch_id] = null;
      }
    }
  } catch (error) {
    console.error('Lỗi khi tải danh sách đơn hàng:', error);
    // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
  }
};

const loadPendingWatches = async () => {
  try {
    pendingWatches.value = await useStaffStore().getPendingOrder();
    console.log('aaaaa' + pendingWatches.value);
  } catch (error) {
    console.error('Lỗi khi tải đồng hồ chờ duyệt:', error);
    // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
  }
};

const sortedPendingWatches = computed(() => {
  return [...pendingWatches.value].sort((a, b) => {
    return new Date(b.create_time) - new Date(a.create_time);
  });
});



const deleteWatch = async (watchId) => {
  try {
    await useStaffStore().deleteWatch(watchId);
    await loadPendingWatches();
  } catch (error) {
    console.error('Lỗi khi xóa đồng hồ:', error);
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
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN')
};

const formatDateHour = (dateString) => {
  const date = new Date(dateString);
  date.setHours(date.getHours()+7)
  return date.toLocaleString('vi-VN')
};


</script>

<style scoped>
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

.table-header th {
  position: sticky;
  top: 0;
  background-color: #494949; /* Matches your background color */
  z-index: 1; /* Keeps the header above the table rows */
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
</style>
