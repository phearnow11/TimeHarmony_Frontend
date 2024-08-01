<template>
  <div v-if="auth.user_id" class="mx-auto p-6 flex flex-col lg:flex-row">
    <!-- Sidebar -->
    <div v-if="isLoading" class="overlay">
      <div class="loader-container">
        <div class="loader">
          <div class="loaderBar"></div>
        </div>
      </div>
    </div>
    <!-- Content -->
    <div class="container mx-auto p-4 w-full lg:w-3/4">
      <!-- Navigation links -->
      <div class="mb-6">
        <span class="text-lg text-primary"><button class="hover-underline-animation text-lg" @click="locationStore.getMyLocation(); updateLocation()">Cập nhật</button> vị trí hiện tại: <br>
          <div class="text-secondary text-sm">{{ locationStore.translatedName ?? locationStore.locationName }}</div></span>
      </div>
      <div class="mb-6">
        <a href="#pending-watches" class="mr-4 hover-underline-animation" @click="activeSection = 'pending-watches'">Đồng hồ đang chờ người bán xác nhận</a>     
        <a href="#shipping-orders" class="mr-4 hover-underline-animation" @click="handleShippingOrdersClick">Đơn hàng đang vận chuyển</a>
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
                <th class="pb-2">Thu tiền (COD)</th>
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
                <td class="py-4 pl-2">{{ item.payment_method === 'ATM' ? '0đ' : formatPriceVND(item.total_price) + ' (Thu hộ COD)'  }}</td>
                <td class="py-4 pl-2">{{ item.state === 'PENDING' ? 'Đang chờ người bán đóng gói' : 'Đã được gửi đến người vận chuyển' }}</td>
                <td class="py-4 pl-2">{{ shipping_date ? shipping_date : 'Không có thông tin' }}</td>

                <td class="py-4 px-2">
                  <button class="hover-underline-animation" @click="shipOrder(item.order_id, auth.user_id)">Xác nhận giao đơn</button>                
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
          <th class="pb-2 pl-2">Thu tiền hộ</th>
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
          <td class="py-4 pl-2">{{ order.payment_method === 'ATM' ? '0đ' : formatPriceVND(order.total_price) + ' (Thu hộ COD)' }}</td>
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
  import { useAuthStore } from '../stores/auth';
  import { useStaffStore } from '../stores/staff';
  import { useUserStore } from '../stores/user';
  import { onMounted, ref, computed, onUnmounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useLocationStore } from '../stores/location';
  import axios from 'axios';
  
  const user = useUserStore();
  const auth = useAuthStore();
  const router = useRouter();
  const orderStates = ref({}); // Store order states
  const pendingWatches = ref([]);
  const shippingOrders = ref([]);
  const activeSection = ref('pending-watches'); // Default section is 'orders'
  const isStaff = ref(false);
  const watchOrderDetails = ref({});
  const isLoading = ref(false);
  


  const viewOrderDetails = (orderId) => {
    const state = orderStates.value[orderId];
    if (state !== 'DELETED') {
      router.push(`/orderconfirmation/${orderId}`);
      console.log('Xem chi tiết đơn hàng:', orderId);
    } else {
      alert('Đơn hàng đã bị xóa, không thể xem chi tiết.');
    }
  };

  

const refreshPending = async () => {
  try {
    isLoading.value = true;
    await loadPendingWatches();
    await loadOrderStates();
  } catch (error) {
    console.error('Lỗi khi làm mới dữ liệu đơn hàng:', error);
  } finally {
    isLoading.value = false;
  }
};

const refreshShipping = async () => {
  try {
    isLoading.value = true;
    await loadShippingOrders();
    await loadOrderStates();
  } catch (error) {
    console.error('Lỗi khi làm mới dữ liệu đơn hàng:', error);
  } finally {
    isLoading.value = false;
  }
};


  onMounted(async () => {
    if (!auth.user_id) {
      console.log('Người dùng chưa đăng nhập. Đang chuyển hướng đến trang đăng nhập...');
      router.push('/login');
    } else {
      const u = await user.loadUser(auth.user_id);
      console.log(u.role);
      if(u.role === 'ROLE_STAFF') 
        isStaff.value = true;
      else 
        isStaff.value = false;
      if (isStaff) {
        await loadPendingWatches()
        await loadShippingOrders();
      }
    }
  });
  
  const loadOrderStates = async () => {
  try {
    for (const order of shippingOrders.value) {
      const state = await user.getOrderState(order.order_id);
      orderStates.value[order.order_id] = state;
      }
    } catch (error) {
      console.error('Lỗi khi tải trạng thái đơn hàng:', error);
    }
  };
  
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
      console.log('All orders:', orders.value); // Log all orders to check if state 4 orders are present
  
      wlists.value = await user.getOrderWaiting(auth.user_id);
      console.log('Waiting orders:', wlists.value); // Log waiting orders
  
      for (const watch of wlists.value) {
        try {
          const orderDetails = await user.getOrderOfWatch(watch.watch_id);
          watchOrderDetails.value[watch.watch_id] = orderDetails[0];
        } catch (error) {
          console.error(`Error fetching order details for watch ${watch.watch_id}:`, error);
          watchOrderDetails.value[watch.watch_id] = null;
        }
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách đơn hàng:', error);
    }
  };
  
  const loadPendingWatches = async () => {
  try {
    pendingWatches.value = await useStaffStore().getPendingOrder();
    console.log('Pending watches:', pendingWatches.value);
    
    // Loop through each pending watch and get its order details
    for (const watch of pendingWatches.value) {
      try {
        const orderDetails = await useUserStore().getOrderDetail(watch.order_id);
        // Assuming orderDetails contains a payment_method property
        watch.payment_method = orderDetails.payment_method;
      } catch (error) {
        console.error(`Error fetching order details for order ${watch.order_id}:`, error);
        watch.payment_method = 'Unknown'; // Or some default value if there's an error
      }
    }
  } catch (error) {
    console.error('Lỗi khi tải đồng hồ chờ duyệt:', error);
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
  
  const cancelOrder = async (orderid) => {
      try {
          console.log('cancelling order');
          await useUserStore().cancelOrder(orderid);
          await loadOrders();
        
      } catch (error) {
        console.log('Lỗi canceled order:', error);
      }
    }

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
  
  
  const setShip = async (watchid, orderId) => {
    try {
      const res = await user.setShipping(watchid, orderId);
      console.log(res);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái giao hàng:', error);
      // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
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
  
  const handleShippingOrdersClick = async () => {
    const user = await useUserStore().loadUser(auth.user_id);
    if (user.staff_role !== 'SHIPPER') {
      alert('Bạn không phải là shipper nên không thể sử dụng chức năng này');
      return;
    }
    activeSection.value = 'shipping-orders';
  };

  
  
  //load đơn của mình
  const loadShippingOrders = async () => {
    try {
      
        const orderIds = await useStaffStore().getMyShippingOrder(auth.user_id);
        console.log("Shipping order IDs:", orderIds);
        
        const orderDetails = await Promise.all(
          orderIds.map(orderId => useUserStore().getOrderDetail(orderId))
        );
        
        shippingOrders.value = orderDetails.map(detail => ({
          ...detail.order_detail,
          payment_method: detail.payment_method})); 
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
  
  // lấy đơn
  const shipOrder = async (order_id, user_id) => {
    try {
      isLoading.value = true;
      const user = await useUserStore().loadUser(auth.user_id);
      console.log('Loaded user:', user);
  
      if (user.staff_role !== 'SHIPPER') {
        alert('Bạn không phải là shipper nên không thể sử dụng chức năng này');
        return;
      }
      await useStaffStore().shipOrderByShipper(order_id, user_id)
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái vận chuyển:', error);
    } finally {
      isLoading.value = false
    }
  };
  
  // đã giao đơn thành công cho ngta
  const shippedOrderToMember = async (order_id, user_id) => {
    try {
      isLoading.value = true;
      await useStaffStore().shippedToMember(order_id, user_id);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái vận chuyển:', error);
    } finally{
      isLoading.value = false;
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

  
  const locationStore = useLocationStore();
  
  onMounted(async () => {
    await locationStore.getMyLocation();
    updateLocation()
  });
  // Run getMyLocation every 15 minutes
  const interval = setInterval(async () => {
    await locationStore.getMyLocation();
    console.log('update location');
    updateLocation()
  }, 1 * 60 * 1000); // 1 minute

  // Clear the interval when the component is unmounted
  onUnmounted(() => {
    clearInterval(interval);
  });

  var api = import.meta.env.VITE_API_PORT
  const saveLocation = (n) => {
    axios.post(`${api}/staff/save/location/${user.user_id}`,{
      oid: n,
      latitude: locationStore.latitude,
      longtitude: locationStore.longitude
    })
  }

  // Check if shippingOrders is an array before calling forEach
const updateLocation = () => {
  if (Array.isArray(shippingOrders.value)) {
    shippingOrders.value.forEach(order => {
      saveLocation(order.order_id); // Use order.order_id instead of just order
      console.log(`save order ${order.order_id}`);
    });
  } else {
    console.error('shippingOrders is not an array');
  }
};
  
  const currency = (value) => `${value.toLocaleString("vi-VN")} ₫`;
  
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
  
  /* Mobile styles */
  @media (max-width: 1024px) {
    .table th, .table td {
      display: block;
      width: 100%;
      text-align: left;
      box-sizing: border-box; /* Ensures padding is included in the width */
    }
  
    .table thead {
      display: none;
    }
  
    .table tbody tr {
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
      border: 1px solid var(--secondary);
    }
  
    .table tbody td {
      border: none;
      padding-left: 15px;
      padding-right: 15px; /* Ensure padding on both sides */
      padding-top: 10px;
      padding-bottom: 10px;
      position: relative;
    }
  
    .table tbody td:before {
      content: attr(data-label);
      position: absolute;
      left: 0;
      width: 50%; /* Ensure the label takes half the width */
      padding-left: 15px;
      font-weight: bold;
      background-color: #494949;
      color: #fff;
      box-sizing: border-box; /* Ensures padding is included in the width */
    }
  }
  </style>
  
