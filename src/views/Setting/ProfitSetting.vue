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
        <h2 class="text-2xl relative bottom-4">Thống kê thu nhập</h2>
        <div class="p-1">
          <div class="mt-8">
          <h3 class="text-xl font-semibold mb-4">TỔNG THU NHẬP CỦA TÔI</h3>
          <div class="relative h-64">
            <canvas ref="incomeChart"></canvas>
          </div>
          
        </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div v-for="(item, index) in performanceItems" :key="index" class="p-4 shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-4">
            <div :class="`w-12 h-12 flex items-center justify-center ${item.bgColor}`">
              <i :class="`fas ${item.icon} text-white text-xl`"></i>
            </div>
            <div>
              <h3 class="text-2xl font-bold">{{ item.value }}</h3>
              <p class="text-sm text-gray-99">{{ item.label }}</p>
            </div>
          </div>
          <div :class="`text-${item.trend === 'up' ? 'green' : 'red'}-500 text-lg font-semibold`">
            {{ item.trend === 'up' ? '↑' : '↓' }} {{ item.trendValue }}
          </div>
        </div>
        <div class="h-64">
          <canvas :ref="`chart${index}`"></canvas>
        </div>
      </div>
    </div>

    
  </div>
      </div>
    </div>
  </template>
  
  
<script>
import Chart from 'chart.js/auto'

export default {
  data() {
    return {
      performanceItems: [
        {
          icon: 'fa-box',
          value: '1,234',
          label: 'Tổng sản phẩm bán được',
          trend: 'up',
          trendValue: '15.4%',
          bgColor: 'bg-primary',
          data: [65, 59, 80, 81, 56, 55, 40, 70, 75, 80, 90, 100]
        },
        {
          icon: 'fa-dollar-sign',
          value: '$56,789',
          label: 'Tổng thu nhập tháng này',
          trend: 'up',
          trendValue: '7.35%',
          bgColor: 'bg-green-500',
          data: [28, 48, 40, 19, 86, 27, 90, 65, 59, 80, 81, 56]
        },
      ],
    }
  },
  mounted() {
    this.createCharts()
    this.createIncomeChart()
  },
  methods: {

    createCharts() {
      this.performanceItems.forEach((item, index) => {
        const ctx = this.$refs[`chart${index}`][0].getContext('2d')
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
            datasets: [{
              label: item.label,
              data: item.data,
              borderColor: index === 0 ? '#ffbd59' : '#10B981',
              backgroundColor: index === 0 ? 'rgba(255, 189, 89, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
              fill: true,
              pointRadius: 6,
              pointBackgroundColor: index === 0 ? '#ffbd59' : '#10B981',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
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
              x: {
                grid: {
                  display: true,
                  color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: { color: '#6B7280' },
              },
              y: {
                grid: {
                  display: true,
                  color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                  color: '#6B7280',
                  callback: function(value) {
                    return index === 0 ? value : '$' + value
                  }
                },
                beginAtZero: true,
              }
            },
          }
        })
      })
    },
    createIncomeChart() {
      const ctx = this.$refs.incomeChart.getContext('2d')
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
          datasets: [{
            label: 'Tổng thu nhập',
            data: [30000, 45000, 55000, 70000, 85000, 100000, 120000],
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
            x: { 
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.1)',
              },
              ticks: { color: '#6B7280' },
            },
            y: { 
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.1)',
              },
              ticks: {
                color: '#6B7280',
                callback: function(value) {
                  return '$' + value
                }
              },
              beginAtZero: true,
            }
          },
        }
      })
    }
  }
}
</script>
  
  <style scoped>
  /* Các styles từ component gốc có thể được giữ nguyên */
  </style>