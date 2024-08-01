<template>
  <div v-if="auth.user_id" class="mx-auto p-6 flex flex-col lg:flex-row">
    <div v-if="isLoading" class="overlay">
      <div class="loader-container">
        <div class="loader">
          <div class="loaderBar"></div>
        </div>
      </div>
    </div>
    <!-- Sidebar -->
    <aside class="w-1/4 lg:mr-8 p-4">
      <h2 class="text-2xl mb-4">Cài đặt Hồ sơ</h2>
      <ul class="space-y-2">
        <li><router-link to="/setting/profile" class="hover-underline-animation">Thông tin cá nhân</router-link></li>
        <li><router-link to="/setting/password" class="hover-underline-animation">Mật khẩu</router-link></li>
        <li><router-link to="/setting/address" class="hover-underline-animation">Sổ địa chỉ</router-link></li>
        <li class="text-secondary">Đơn hàng của tôi</li>
        <li><router-link to="/setting/profit" class="hover-underline-animation">Thu nhập</router-link></li>
        <li><router-link to="/setting/delete" class="hover-underline-animation-r">Xoá tài khoản</router-link></li>
      </ul>
    </aside>
    <!-- Content -->
    <div class="container mx-auto p-4 w-3/4">
      <!-- Navigation links -->
      <div class="mb-6">
        <a href="#orders" class="mr-4 hover-underline-animation" @click="activeSection = 'orders'">Đồng hồ đã mua</a>
        <a href="#purchases" class="mr-4 hover-underline-animation" @click="activeSection = 'purchases'">Đồng hồ đã đăng bán</a>
        <a v-if="isStaff" href="#pending-watches" class="mr-4 hover-underline-animation" @click="activeSection = 'pending-watches'">Đồng hồ đang chờ người bán xác nhận</a>     
        <a v-if="isStaff" href="#shipping-orders" class="mr-4 hover-underline-animation" @click="handleShippingOrdersClick">Đơn hàng đang vận chuyển</a>
      </div>

      <!-- My Orders Section -->
      <div v-if="activeSection === 'orders'" id="orders">
        <h2 class="text-2xl mb-4 text-secondary">Đơn hàng mua <button @click="refreshOrderData" class="fa fa-refresh text-gray-99 hover:text-secondary p-1 text-lg transition-colors duration-300"></button></h2>
        <div class="table-container">
          <table class="w-full border-collapse table">
            <thead class="table-header">
              <tr class="bg-[#494949] text-primary">
                <th class="pb-2">Số Thứ Tự</th>
                <th class="pb-2">Mã Đơn Hàng</th>
                <th class="pb-2 pl-2">Ngày Đặt</th>
                <th class="pb-2 pl-2">Phương thức thanh toán</th>
                <th class="pb-2 pl-2">Tổng Tiền</th>
                <th class="pb-2 pl-2">Trạng Thái</th>
                <th class="pb-2">Đơn hàng đang tại</th>
                <th class="pb-2 pl-2">Thời gian</th>
                <th class="pb-2">Hành động</th>

              </tr>
            </thead>
            <tbody>
              <tr v-for="(order, index) in orders" :key="order.order_id" class="border-t">
                <td class="py-4">{{ index + 1 }}</td>
                <td class="py-4">{{ order.order_id }}</td>
                <td class="py-4 pl-2">{{ formatDate(order.create_time) }}</td>
                <td class="py-4 pl-2">
                  {{ 
                    orderStates[order.order_id] === 'DELETED' ? 'N/A' :
                    orderDetails[order.order_id]?.payment_method === 'ATM' ? 'ATM' : 'COD'
                  }}
                </td>                
                <td class="py-4 pl-2">{{ formatPriceVND(order.total_price) }}</td>
                <td class="py-4 pl-2">{{ getOrderStatusText(order.order_id) }}</td>
                <td class="py-4 pl-2">
                  <a target="_blank" :href="orderLocations[order.order_id]?.mapUrl" class="hover-underline-animation">{{ orderLocations[order.order_id]?.translatedName ?? orderLocations[order.order_id]?.locationName ??  'N/A' }}</a>
                </td>
                <td class="py-4 pl-2">{{ order.shipping_date ? formatDate(order.shipping_date) : "N/A" }}</td>
                <td class="py-4 px-2">
                  <button v-if="orderStates[order.order_id] !== 'DELETED' || orderStates[order.order_id] === 'PENDING'" class="hover-underline-animation px-2" @click="viewOrderDetails(order.order_id)">Xem Chi Tiết</button>
                  <button v-if="orderStates[order.order_id] === 'PENDING'" class="hover-underline-animation px-2 border-l border-secondary" @click="cancelOrder(order.order_id)">Huỷ Đơn</button>
                  <button v-if="orderStates[order.order_id] === 'SHIPPED'" class="hover-underline-animation px-2 border-l border-secondary" @click="confirmShip(order.order_id)">Đã nhận</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- My Purchased Watches Section -->
      <div v-if="activeSection === 'purchases'" id="purchases">
        <h2 class="text-2xl mb-4">Các đơn hàng đồng hồ đã đăng bán <button @click="refreshOrderData" class="fa fa-refresh text-gray-99 hover:text-secondary p-1 text-lg transition-colors duration-300"></button></h2>
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
                <th class="pb-2">Đơn hàng đang tại</th>
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
                <td class="py-4 pl-2">{{ getPendingWatchStatusText(list.state) }}</td>
                <td class="py-4 pl-2">{{ orderDetails[list.watch_id]?.order_detail?.order_id ?? 'N/A' }}</td>
                <td class="py-4 pl-2"><a class="hover-underline-animation" target="_blank" :href="locations[list.watch_id]?.mapUrl">{{ locations[list.watch_id]?.translatedName ?? locations[list.watch_id]?.locationName ??'N/A' }}</a></td>
                <td class="py-4 pl-2">{{ watchOrderDetails[list.watch_id] ? formatDateHour(watchOrderDetails[list.watch_id][1]) : 'N/A' }}</td>
                
                <td class="py-4 px-2">
                  <button v-if="list.state === 3" class="hover-underline-animation" @click="setShip(list.watch_id, watchOrderDetails[list.watch_id][0])">Đóng gói và giao hàng</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pending Watches Section -->
      <div v-if="activeSection === 'pending-watches'" id="pending-watches">
        <h2 class="text-2xl mb-4 text-secondary">Các đơn hàng chờ xác nhận bởi người bán <button @click="refreshPending" class="fa fa-refresh text-gray-99 hover:text-secondary p-1 text-lg transition-colors duration-300"></button></h2>
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
              <tr v-for="(item, index) in sortedPendingWatches" :key="item" class="border-t">
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
                <td class="py-4 pl-2">{{ item.state === 'PENDING' ? 'Đang chờ người bán đóng gói' : 'Đã được gửi đến người vận chuyển' }}</td>
                <td class="py-4 pl-2">{{ shipping_date ? shipping_date : 'Không có thông tin' }}</td>

                <td class="py-4 px-2">
                  <button v-if="isShipper" class="hover-underline-animation" @click="shipOrder(item.order_id, auth.user_id)">Xác nhận giao đơn</button>                
                </td>
                
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Shipping Orders Section -->
      <div v-if="activeSection === 'shipping-orders'" id="shipping-orders">
  <h2 class="text-2xl mb-4 text-secondary">Đơn hàng đang vận chuyển của tôi <button @click="refreshShipping" class="fa fa-refresh text-gray-99 hover:text-secondary p-1 text-lg transition-colors duration-300"></button></h2>
  <div class="table-container">
    <table class="w-full border-collapse table">
      <thead class="table-header">
        <tr class="bg-[#494949] text-primary">
          <th class="pb-2">Số Thứ Tự</th>
          <th class="pb-2">Mã Đơn Hàng</th>
          <th class="pb-2 pl-2">Thời gian tạo đơn</th>
          <th class="pb-2 pl-2">Địa chỉ giao hàng</th>
          <th class="pb-2 pl-2">Tên người nhận</th>
          <th class="pb-2 pl-2">SĐT người nhận</th>
          <th class="pb-2">Trạng thái</th>
          <th class="pb-2">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(order, index) in shippingOrders" :key="order.order_id" class="border-t">
          <td class="py-4">{{ index + 1 }}</td>
          <td class="py-4">{{ order.order_id }}</td>
          <td class="py-4 pl-2">{{ formatDate(order.create_time) }}</td>
          <td class="py-4 pl-2">{{ order.address }}</td>
          <td class="py-4 pl-2">{{ order.receive_name }}</td>
          <td class="py-4 pl-2">{{ order.phone }}</td>
          <td class="py-4 pl-2">{{ getShippingStatusText(order.state) }}</td>
          <td class="py-4 px-2">
            <button class="hover-underline-animation" @click="shippedOrderToMember(order.order_id, auth.user_id)">Đã giao đến người nhận</button>
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
import { useLocationStore } from '../../stores/location';
import { useStaffStore } from '../../stores/staff';
import { useUserStore } from '../../stores/user';
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

const user = useUserStore();
const auth = useAuthStore();
const router = useRouter();
const orderStates = ref({}); // Store order states
const orders = ref([]);
const wlists = ref([]);
const pendingWatches = ref([]);
const shippingOrders = ref([]);
const activeSection = ref('orders'); // Default section is 'orders'
const isStaff = ref(false);
const isShipper = ref(false);
const watchOrderDetails = ref({});
const orderDetails = ref({});
const locationStore = useLocationStore()
const locations = ref({});
const isLoading = ref(false);


const fetchOrderDetails = async (orderId) => {
  try {
    const details = await user.getOrderDetail(orderId);
    if (details) {
      orderDetails.value[orderId] = details;
    }
  } catch (error) {
    console.error(`Error fetching details for order ${orderId}:`, error);
  }
};


const refreshOrderData = async () => {
  try {
    isLoading.value = true;
    await Promise.all([loadOrders(), loadOrderStates()]);
  } catch (error) {
    console.error('Lỗi khi làm mới dữ liệu đơn hàng:', error);
  } finally {
    isLoading.value = false;
  }
};

const refreshPending = async () => {
  try {
    isLoading.value = true;
    await Promise.all([loadPendingWatches(), loadOrderStates()]);
  } catch (error) {
    console.error('Lỗi khi làm mới dữ liệu đơn hàng:', error);
  } finally {
    isLoading.value = false;
  }
};

const refreshShipping = async () => {
  try {
    isLoading.value = true;
    await Promise.all([loadShippingOrders(), loadOrderStates()]);
  } catch (error) {
    console.error('Lỗi khi làm mới dữ liệu đơn hàng:', error);
  } finally {
    isLoading.value = false;
  }
};

const orderLocations = ref({});

const fetchOrderLocation = async (orderId, latitude, longitude) => {
  if (latitude && longitude) {
    try {
      orderLocations.value[orderId] = await locationStore.getLocation(latitude, longitude);
    } catch (error) {
      console.error(`Error fetching location for order ${orderId}:`, error);
      orderLocations.value[orderId] = { translatedName: 'Error fetching location', locationName: 'Error' };
    }
  } else {
    orderLocations.value[orderId] = { translatedName: 'No location data', locationName: 'No data' };
  }
};

const fetchLocation = async (watchId, latitude, longitude) => {
  if (latitude && longitude) {
    try {
      locations.value[watchId] = await locationStore.getLocation(latitude, longitude);
    } catch (error) {
      console.error(`Error fetching location for watch ${watchId}:`, error);
      locations.value[watchId] = 'Error fetching location';
    }
  } else {
    locations.value[watchId] = 'No location data';
  }
};

watch(orderDetails, (newOrderDetails) => {
  Object.entries(newOrderDetails).forEach(([watchId, details]) => {
    if (details && details.locations && details.locations[0]) {
      const { latitude, longitude } = details.locations[0];
      fetchLocation(watchId, latitude, longitude);
    }
  });
}, { deep: true });

//nút xem chi tiết ở bảng 1 các đơn hàng đã mua
const viewOrderDetails = (orderId) => {
  const state = orderStates.value[orderId];
  if (state !== 'DELETED') {
    router.push(`/orderconfirmation/${orderId}`);
    console.log('Xem chi tiết đơn hàng:', orderId);
  } else {
    alert('Đơn hàng đã bị xóa, không thể xem chi tiết.');
  }
};

//nút xác nhận đơn hàng cho user nếu shipper đã giao thành công
const confirmShip = async (orderId) => {
    try {
      isLoading.value = true;
      const state = orderStates.value[orderId];
    if (state === 'SHIPPED') {
      await useUserStore().confirmShip(orderId)
    } else {
      alert('Không chấp thuận, lỗi');
    }
    await loadOrders(); 
    await loadOrderStates();
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
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
    if(u.role === 'ROLE_STAFF') 
      isStaff.value = true;
    else 
      isStaff.value = false;
    if (isStaff.value) {
      await loadPendingWatches();
      await loadShippingOrders();
    }
    if (u.staff_role === 'SHIPPER') {
      isShipper.value = true;
    } else 
      isShipper.value = false;
    // Fetch locations after order details are loaded
    Object.entries(orderDetails.value).forEach(([watchId, details]) => {
      if (details && details.locations && details.locations[0]) {
        const { latitude, longitude } = details.locations[0];
        fetchLocation(watchId, latitude, longitude);
      }
    });
  }
});

//load state của order
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

//text của các state của order
const getOrderStatusText = (orderId) => {
  const state = orderStates.value[orderId];
  if (state === 'PENDING')
    return 'Đơn hàng đã được gửi đến người bán'
  else if (state === 'SHIPPING')
    return 'Đơn hàng đang được vận chuyển'
  else if (state === 'SHIPPED')
    return 'Đơn hàng đã được giao đến người mua'
  else if (state === 'SUCCESS')
    return 'Đơn hàng giao thành công'
  else if (state === 'DELETED')
    return 'Đã huỷ đơn hàng'
  else
    return 'Trạng thái không xác định'
};

const loadOrders = async () => {
  try {
    orders.value = await user.getAllOrders(auth.user_id);
    console.log('All orders:', orders.value);

    wlists.value = await user.getOrderWaiting(auth.user_id);
    console.log('Waiting orders:', wlists.value);
    
    for (const order of orders.value) {
      console.log('fetching location');
      const detail = await fetchOrderDetails(order.order_id);
      
      console.log("DET", detail);

      if (detail && detail.locations && detail.locations[0]) {
        const { latitude, longitude } = detail.locations[0];
        if (latitude && longitude) {
          await fetchOrderLocation(order.order_id, latitude, longitude);
        } else {
          console.error('Latitude or longitude is missing for order:', order.order_id);
        }
      } else {
        console.error('Location details are missing for order:', order.order_id);
      }
    }

    for (const watch of wlists.value) {
      try {
        const details = await user.getOrderOfWatch(watch.watch_id);
        watchOrderDetails.value[watch.watch_id] = details[0];
        await fetchOrderDetails(watch.watch_id, details[0][0]);
      } catch (error) {
        console.error(`Error fetching order details for watch ${watch.watch_id}:`, error);
        watchOrderDetails.value[watch.watch_id] = null;
      }
    }
  } catch (error) {
    console.error('Lỗi khi tải danh sách đơn hàng:', error);
  }
};

//lấy các đồng hồ nằm ở state chờ duyệt bởi người bán (dành cho appraiser)
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

const sortedOrderWaiting = computed(() => {
  return [...wlists.value].sort((a, b) => {
    return new Date(b.create_time) - new Date(a.create_time);
  });
});

//huỷ đơn hoạt động chỉ khi mới đặt đơn và người bán chưa xác nhận
const cancelOrder = async (orderid) => {
    try {
      isLoading.value = true;
      console.log('cancelling order');
      await useUserStore().cancelOrder(orderid);
      await loadOrders();
      await loadOrderStates();
    } catch (error) {
      console.log('Lỗi canceled order:', error);
    } finally {
      isLoading.value = false;
    }
}

//nút đóng gói và giao hàng gửi đến cho shipper (dành cho seller)
const setShip = async (watchid, orderId) => {
  try {
    isLoading.value = true;
    const res = await user.setShipping(watchid, orderId);
    console.log(res);
    await loadOrders();
    await loadOrderStates();
    } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái giao hàng:', error);
  } finally {
    isLoading.value = false;
  }
};

const getPendingWatchStatusText = (state) => {
  switch (state) {
    case 3:
      return 'Đang chờ đóng gói';
    case 4:
      return 'Đã giao cho shipper';
    case 6:
      return 'Giao thành công';
  }
};

//nút chỉ dành riêng cho staff role shipper
const handleShippingOrdersClick = async () => {
  const user = await useUserStore().loadUser(auth.user_id);
  if (user.staff_role !== 'SHIPPER') {
    alert('Bạn không phải là shipper nên không thể sử dụng chức năng này');
    return;
  }
  activeSection.value = 'shipping-orders';
};


//load tất cả đơn hàng mà shipper đang giao
const loadShippingOrders = async () => {
  try {
    const orderIds = await useStaffStore().getMyShippingOrder(auth.user_id);
    console.log("Shipping order IDs:", orderIds);
    
    const orderDetails = await Promise.all(
      orderIds.map(orderId => useUserStore().getOrderDetail(orderId))
    );
    
    shippingOrders.value = orderDetails.map(detail => detail.order_detail);
    console.log("Shipping order details:", shippingOrders.value);
  } catch (error) {
    console.error('Lỗi khi tải đơn hàng đang vận chuyển:', error);
  }
};

const getShippingStatusText = (state) => {
  switch (state) {
    case 'SHIPPING':
      return 'Đang vận chuyển';
    case 'DELIVERED':
      return 'Đã giao hàng';
    default:
      return 'Trạng thái không xác định';
  }
};

//nếu là shipper thì được dùng nút này, nút này để xác nhận rằng shipper cầm đơn này đi giao
const shipOrder = async (order_id, user_id) => {
  try {
    isLoading.value = true
    const user = await useUserStore().loadUser(auth.user_id);
    console.log('Loaded user:', user);

    if (user.staff_role !== 'SHIPPER') {
      alert('Bạn không phải là shipper nên không thể sử dụng chức năng này');
      return;
    }
    const res = await useStaffStore().shipOrderByShipper(order_id, user_id)
    console.log(res);
    await loadPendingWatches();
    await loadOrderStates();
    if(res === 'java.lang.Exception: Order is not packed') 
      alert('Người bán chưa đóng gói hàng và gửi cho Shipper')
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái vận chuyển:', error);
  } finally {
    isLoading.value = false
  }
};

//nút này dùng để báo là đơn đã giao tới tay ng dùng và ng dùng chỉ cần bấm xác nhận là hoàn tất quy trình giao hàng
const shippedOrderToMember = async (order_id, user_id) => {
  try {
    isLoading.value = true
    await useStaffStore().shippedToMember(order_id, user_id);
    await loadShippingOrders()
    await loadOrderStates()
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái vận chuyển:', error);
  } finally{
    isLoading.value = false
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
