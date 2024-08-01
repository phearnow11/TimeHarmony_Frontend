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
        <li><router-link to="/setting/delete" class="hover-underline-animation-r">Xoá tài khoản</router-link></li>
      </ul>
    </aside>

    <div class="container mx-auto p-4">
      <h2 class="text-2xl mt-4 text-primary relative bottom-4">Thống kê thu nhập</h2>
      <div class="p-1">
        
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
                  <!-- Chỉ hiển thị phần trăm thay đổi cho biểu đồ doanh thu theo ngày -->
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
        <button @click="exportToExcel" class="th-p-btn hover:opacity-3 py-2 px-4">
          Xuất Excel
        </button>
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
    isCurrency: false
  },
  {
    icon: 'fa-shopping-cart',
    value: 0,
    label: 'Sản phẩm đã bán',
    bgColor: 'bg-yellow-500',
    isCurrency: false
  },
])

const formatValue = (value, isCurrency) => {
  if (isCurrency) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }
  return value
}


const updateDailyProfitChart = (labels, data) => {
  const ctx = chartRefs[0].getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.map(formatDateForDisplay), // Áp dụng định dạng mới cho nhãn
      datasets: [{
        label: 'Doanh thu theo ngày',
        data: data,
        backgroundColor: getChartColor(0, 0.6),
        borderColor: getChartColor(0),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatValue(value, true)
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: (tooltipItems) => {
              return formatDateForDisplay(labels[tooltipItems[0].dataIndex]);
            },
            label: (context) => formatValue(context.parsed.y, true)
          }
        }
      }
    }
  });
};

const createCharts = () => {
  performanceItems.value.forEach((item, index) => {
    if (index === 0) return;
    const ctx = chartRefs[index].getContext('2d')
    new Chart(ctx, {
      type: 'table',
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

const getChartColor = (index, alpha = 1) => {
  const colors = ['#9061f9', '#3B82F6', '#F59E0B']
  return alpha === 1 ? colors[index] : `${colors[index]}${Math.round(alpha * 255).toString(16)}`
}


const exportToExcel = () => {
  const data = [
    {
      label: performanceItems.value[0].label,
      value: formatValue(performanceItems.value[0].value, true),
      isCurrency: true
    },
    {
      label: performanceItems.value[1].label,
      value: performanceItems.value[1].value,
      isCurrency: false
    },
    {
      label: performanceItems.value[2].label,
      value: performanceItems.value[2].value,
      isCurrency: false
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(data, { header: ['label', 'value'] });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Performance Data');

  XLSX.writeFile(workbook, 'Data.xlsx');
}

onMounted(async () => {
  const sellerId = authStore.user_id;

  try {
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    const currentDate = new Date();
    const dailyProfits = [];
    const labels = [];

    // Lấy dữ liệu cho 7 ngày gần nhất
    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - i);
      const formattedDate = formatDate(date);
      const profit = await userStore.getProfitOfSellerByDate(sellerId, formattedDate);
      dailyProfits.push(profit);
      labels.push(formattedDate);
    }

    // Cập nhật dữ liệu cho biểu đồ doanh thu theo ngày
    performanceItems.value[0].value = dailyProfits[6]; // Ngày hiện tại
    performanceItems.value[0].data = dailyProfits;

    const profitToday = dailyProfits[6];
    const profitYesterday = dailyProfits[5];
    const percentChange = profitYesterday !== 0
      ? ((profitToday - profitYesterday) / profitYesterday) * 100
      : 0;

    performanceItems.value[0].percentChange = Math.abs(percentChange).toFixed(0);
    performanceItems.value[0].isIncrease = percentChange >= 0;

    // Cập nhật biểu đồ doanh thu hàng ngày
    updateDailyProfitChart(labels, dailyProfits);

    // Lấy và cập nhật dữ liệu cho các biểu đồ khác
    const postedWatchesData = await userStore.countPostWatch(sellerId);
    const soldWatchesData = await userStore.countSoldWatch(sellerId);

    performanceItems.value[1].value = postedWatchesData;
    performanceItems.value[2].value = soldWatchesData;

    // Cập nhật các biểu đồ khác
    createCharts();
    
    // Lấy và cập nhật dữ liệu cho biểu đồ tổng thu nhập
    const profitData = await userStore.getProfitOfSeller(sellerId);
    createIncomeChart(createMonthlyData(profitData));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

function formatDateForDisplay(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}`;
}

</script>
