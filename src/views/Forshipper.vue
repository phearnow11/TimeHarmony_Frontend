<template>
  <div v-if="auth.user_id" class="mx-auto p-6 flex flex-col lg:flex-row">
    <!-- Sidebar -->

    <!-- Content -->
    <div class="container mx-auto p-4 w-full lg:w-3/4">
      <!-- Navigation links -->
      <div class="mb-6">
        <span class="text-lg text-primary"><button class="hover-underline-animation text-lg">Cập nhật</button> vị trí hiện tại: <br>
          <div class="text-secondary text-sm">{{ locationStore.translatedName }}</div></span>
      </div>
      
      <!-- Shipping Orders Section -->
      <div>
        <h2 class="text-2xl mb-4 text-primary">Đơn hàng đang vận chuyển</h2>
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
                  <button class="hover-underline-animation" @click="shippedOrderToMember(order.order_id, auth.user_id)">Đã giao</button>
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
  import { onMounted, ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useLocationStore } from '../stores/location';
  
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
      const u = await user.loadUser(auth.user_id);
      console.log(u.role);
      if(u.role === 'ROLE_STAFF') 
        isStaff.value = true;
      else 
        isStaff.value = false;
      if (isStaff) {
        await loadShippingOrders();
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
  
  const cancelOrder = async (orderid) => {
      try {
          console.log('cancelling order');
          await useUserStore().cancelOrder(orderid);
          await loadOrders();
        
      } catch (error) {
        console.log('Lỗi canceled order:', error);
      }
    }
  
  
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
  
  // lấy đơn
  const shipOrder = async (order_id, user_id) => {
    try {
      const user = await useUserStore().loadUser(auth.user_id);
      console.log('Loaded user:', user);
  
      if (user.staff_role !== 'SHIPPER') {
        alert('Bạn không phải là shipper nên không thể sử dụng chức năng này');
        return;
      }
      await useStaffStore().shipOrderByShipper(order_id, user_id)
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái vận chuyển:', error);
    }
  };
  
  // đã giao đơn thành công cho ngta
  const shippedOrderToMember = async (order_id, user_id) => {
    try {
      await useStaffStore().shippedToMember(order_id, user_id);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái vận chuyển:', error);
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
  });
  
  
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
  
