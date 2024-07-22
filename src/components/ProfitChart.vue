<template>
    <div>
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </template>
  
  <script setup>
  import { Line } from 'vue-chartjs';
  import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement } from 'chart.js';
  import { ref, computed } from 'vue';
  
  ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);
  
  const props = defineProps({
    totalRevenue: Number,
    totalCost: Number,
    totalProfit: Number
  });
  
  const chartData = computed(() => ({
    labels: ['Revenue', 'Cost', 'Profit'],
    datasets: [{
      label: 'Profit Overview',
      data: [props.totalRevenue, props.totalCost, props.totalProfit],
      backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(153, 102, 255, 0.2)'],
      borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(153, 102, 255, 1)'],
      borderWidth: 1,
      pointRadius: 5, // Ensure points are visible
    }]
  }));
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.label}: $${tooltipItem.raw.toFixed(2)}`;
          }
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add any specific styles for the chart if needed */
  </style>
  