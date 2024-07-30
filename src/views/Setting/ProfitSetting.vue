<template>
  <div class="mx-auto p-6 flex flex-col lg:flex-row">
    <!-- Thanh bên -->
    <aside class="lg:w-1/4 lg:mr-8 p-4">
      <h2 class="text-2xl text-secondary mb-4">Cài đặt Hồ sơ</h2>
      <ul class="space-y-2">
        <li><router-link to="/setting/profile" class="hover-underline-animation">Thông tin cá nhân</router-link></li>
        <li><router-link to="/setting/password" class="hover-underline-animation">Mật khẩu</router-link></li>
        <li><router-link to="/setting/address" class="hover-underline-animation">Sổ địa chỉ</router-link></li>
        <li><router-link to="/setting/product" class="hover-underline-animation">Đơn hàng của tôi</router-link></li>
        <li class="text-secondary">Thu nhập</li>
        <li><router-link to="#" class="hover-underline-animation-r">Xoá tài khoản</router-link></li>
      </ul>
    </aside>

    <!-- Nội dung -->
    <div class="container mx-auto p-4">
      <h2 class="text-2xl mt-4 text-primary relative bottom-4">Thống kê thu nhập</h2>
      <div class="p-1">
        <div class="mt-8">
          <h3 class="text-xl font-semibold mb-4">TỔNG THU NHẬP CỦA TÔI</h3>
          <div class="relative h-64">
            <canvas ref="incomeChart"></canvas>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div v-for="(item, index) in performanceItems" :key="index" class="p-4 shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-4">
                <div :class="`w-12 h-12 flex items-center justify-center ${item.bgColor}`">
                  <i :class="`fas ${item.icon} text-white text-xl`"></i>
                </div>
                <div>
                  <h3 class="text-2xl font-bold">{{ formatValue(item.value, item.isCurrency) }}</h3>
                  <p class="text-sm text-gray-99">{{ item.label }}</p>
                  <!-- Add comparison for the first item only -->
                  <p v-if="index === 0" :class="`text-sm ${item.isIncrease ? 'text-green-500' : 'text-red-500'}`">
                    <i :class="`fas ${item.isIncrease ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`"></i>
                    {{ item.percentChange }}% so với hôm qua
                  </p>
                </div>
              </div>
            </div>
            <div class="h-64">
              <canvas :ref="el => { if (el) chartRefs[index] = el }"></canvas>
            </div>
          </div>
        </div>
        <button @click="exportToExcel" class="hover-underline-animation">Xuất Excel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import Chart from 'chart.js/auto'
import { useUserStore } from '../../stores/user'
import { useAuthStore } from '../../stores/auth.js'
import * as XLSX from 'xlsx';

const userStore = useUserStore()
const authStore = useAuthStore()

const incomeChart = ref(null)
const chartRefs = reactive({})

const createMonthlyData = (value) => {
  const currentMonth = new Date().getMonth();
  return Array(12).fill(0).map((_, index) => index === currentMonth ? value : 0);
};

const performanceItems = ref([
  {
    icon: 'fa-dollar-sign',
    value: 0,
    label: 'Tổng lợi nhuận theo ngày',
    bgColor: 'bg-purple-500',
    data: [],
    isCurrency: true,
    yesterdayValue: 0,
    percentChange: 0,
    isIncrease: true
  },
  {
    icon: 'fa-upload',
    value: 0,
    label: 'Sản phẩm đã đăng',
    bgColor: 'bg-blue-500',
    data: [],
    isCurrency: false
  },
  {
    icon: 'fa-shopping-cart',
    value: 0,
    label: 'Sản phẩm đã bán',
    bgColor: 'bg-yellow-500',
    data: [],
    isCurrency: false
  },
])

const formatValue = (value, isCurrency) => {
  if (isCurrency) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }
  return value
}

const createCharts = () => {
  performanceItems.value.forEach((item, index) => {
    const ctx = chartRefs[index].getContext('2d')
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [{
          label: item.label,
          data: item.data,
          borderColor: getChartColor(index),
          backgroundColor: getChartColor(index, 0.1),
          tension: 0.4,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 10,
            cornerRadius: 5,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => formatValue(value, item.isCurrency),
              stepSize: 1
            }
          }
        },
      }
    })
  })
}

const createIncomeChart = (monthlyProfit) => {
  const ctx = incomeChart.value.getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      datasets: [{
        label: 'Tổng thu nhập',
        data: monthlyProfit,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleColor: '#fff',
          bodyColor: '#fff',
          padding: 10,
          cornerRadius: 5,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatValue(value, true)
          }
        }
      },
    }
  });
};

const getChartColor = (index, alpha = 1) => {
  const colors = ['#9061f9', '#3B82F6', '#F59E0B']
  return alpha === 1 ? colors[index] : `${colors[index]}${Math.round(alpha * 255).toString(16)}`
}

const exportToExcel = () => {
  const data = performanceItems.value.map(item => ({
    label: item.label,
    value: item.isCurrency ? formatValue(item.value, item.isCurrency) : item.value,
    data: item.data.join(', '),  // Convert data array to string for Excel
    isCurrency: item.isCurrency
  }));

  // Lấy dữ liệu từ biểu đồ Tổng thu nhập
  const totalProfitData = incomeChart.value?.chart?.data?.datasets[0]?.data || [];
  const totalProfit = {
    label: 'Tổng thu nhập của tôi',
    value: totalProfitData.reduce((acc, val) => acc + val, 0),  // Tổng hợp các giá trị
    data: totalProfitData.join(', '),  // Chuyển đổi mảng dữ liệu thành chuỗi cho Excel
    isCurrency: true
  };
  data.push(totalProfit);

  const worksheet = XLSX.utils.json_to_sheet(data, { header: ['label', 'value', 'data'] });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Performance Data');

  XLSX.writeFile(workbook, 'Dữ liệu thu nhập cá nhân.xlsx');
}

onMounted(async () => {
  const sellerId = authStore.user_id;

  try {
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên cần cộng thêm 1
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    // Sử dụng hàm
    const date = new Date();
    const yesterday = new Date(date);
    yesterday.setDate(date.getDate() - 1)
    const formattedDate = formatDate(yesterday);

    const profitData = await userStore.getProfitOfSeller(sellerId);
    const postedWatchesData = await userStore.countPostWatch(sellerId);
    const soldWatchesData = await userStore.countSoldWatch(sellerId);
    const dailyData = await userStore.getProfitOfSellerByDate(sellerId, formatDate(date));
    const yesterdayData = await userStore.getProfitOfSellerByDate(sellerId, formattedDate);

    const percentChange = yesterdayData !== 0
      ? ((dailyData - yesterdayData) / yesterdayData) * 100
      : 100;

    // Cập nhật dữ liệu cho các biểu đồ
    performanceItems.value[0].value = dailyData;
    performanceItems.value[0].data = createMonthlyData(dailyData);
    performanceItems.value[0].yesterdayValue = yesterdayData;
    performanceItems.value[0].percentChange = Math.abs(percentChange).toFixed(0);
    performanceItems.value[0].isIncrease = percentChange >= 0;
    performanceItems.value[1].value = postedWatchesData;
    performanceItems.value[1].data = createMonthlyData(postedWatchesData);
    performanceItems.value[2].value = soldWatchesData;
    performanceItems.value[2].data = createMonthlyData(soldWatchesData);

    createCharts();
    createIncomeChart(createMonthlyData(profitData));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});
</script>
