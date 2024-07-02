<template>
  <div class="text-gray-200 min-h-screen">
    <!-- Navbar -->
    <nav class="sticky top-0 z-10 flex items-center justify-between p-4">
      <a href="#" class="text-xl font-bold">
        <img src="../assets/time-harmony.png" class="w-60 mr-2 " alt="">
      </a>
      <input type="text" placeholder="Search" class="bg-[#313D4F] px-4 py-2 flex-grow mx-4">
      
    </nav>

    <div class="flex">
      <!-- Sidebar -->
      <nav class="w-64 min-h-screen hidden md:block">
        <div class="p-4">
          <ul class="space-y-2">
            <li v-for="(item, index) in sidebarItems" :key="index">
              <a :href="item.link" class="flex items-center p-2 hover:bg-[#313D4F] hover:text-white" :class="{ 'bg-[#313D4F] text-white': item.active }">
                <i :class="item.icon" class="mr-2"></i>
                {{ item.text }}
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-grow p-6">
        <!-- Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div v-for="(card, index) in cards" :key="index" :class="[' p-4 text-white', card.color]">
            <h3 class="text-sm uppercase">{{ card.title }}</h3>
            <div class="text-3xl font-bold my-2">{{ card.value }}</div>
            <div class="text-sm">
              <span class="font-bold">{{ card.change }}</span> {{ card.direction }}
            </div>
          </div>
        </div>

        <!-- Projects Table -->
        <div class="bg-[#273142]  overflow-hidden mb-6">
          <div class="flex justify-between items-center p-4 bg-[#313D4F] text-white">
            <h2 class="text-xl font-bold">Ongoing Projects</h2>
          </div>
          <table class="w-full">
            <thead class="bg-[#313D4F] text-white">
              <tr>
                <th class="p-3 text-left">Project</th>
                <th class="p-3 text-left">Deadline</th>
                <th class="p-3 text-left">Leader + Team</th>
                <th class="p-3 text-left">Budget</th>
                <th class="p-3 text-left">Status</th>
                <th class="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(project, index) in projects" :key="index" class="border-b border-[#313D4F] hover:bg-[#2a3547]">
                <td class="p-3">
                  <p>{{ project.name }}</p>
                  <p class="text-sm text-gray-400">{{ project.company }}</p>
                </td>
                <td class="p-3">
                  <p>{{ project.deadline }}</p>
                  <p :class="project.overdue ? 'text-red-500' : 'text-gray-400'">{{ project.overdue ? 'Overdue' : '' }}</p>
                </td>
                <td class="p-3 flex items-center">
                  <img :src="project.leader.image" alt="Leader" class="w-8 h-8 rounded-full mr-2">
                  <div>
                    <p>{{ project.leader.name }}</p>
                    <p class="text-sm text-gray-400">{{ project.leader.team }}</p>
                  </div>
                </td>
                <td class="p-3">
                  <p>{{ project.budget }}</p>
                  <p class="text-sm text-gray-400">{{ project.paymentStatus }}</p>
                </td>
                <td class="p-3">
                  <span :class="['px-2 py-1 rounded-full text-xs', project.status.color]">
                    {{ project.status.text }}
                  </span>
                </td>
                <td class="p-3 text-right">
                  <select class="bg-[#313D4F] text-white rounded p-1">
                    <option>Actions</option>
                    <option>Start project</option>
                    <option>Send for QA</option>
                    <option>Send invoice</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Charts -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="(chart, index) in charts" :key="index" class="bg-[#273142]  p-4">
            <h3 class="text-xl font-bold mb-2">{{ chart.title }}</h3>
            <p class="text-sm text-gray-400 mb-4">{{ chart.subtitle }}</p>
            <!-- Placeholder for chart -->
            <div class="h-64 bg-[#313D4F] "></div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const sidebarItems = ref([
  { text: 'Dashboard', icon: 'zmdi zmdi-widgets', link: '#', active: true },
  { text: 'Orders', icon: 'zmdi zmdi-file-text', link: '#' },
  { text: 'Products', icon: 'zmdi zmdi-shopping-cart', link: '#' },
  { text: 'Customers', icon: 'zmdi zmdi-accounts', link: '#' },
  { text: 'Reports', icon: 'zmdi zmdi-chart', link: '#' },
  { text: 'Integrations', icon: 'zmdi zmdi-layers', link: '#' },
]);

const cards = ref([
  { title: 'All Product', value: '89', change: '13', direction: 'increase', color: 'bg-[#327c51]' },
  { title: 'Website Customers', value: '5,990', change: '4', direction: 'increase', color: 'bg-[#327c51]' },
  { title: 'Total Budget', value: '$80,990', change: '13', direction: 'decrease', color: 'bg-[#327c51]' },
  { title: 'New Customers', value: '3', change: '13', direction: 'decrease', color: 'bg-[#327c51]' },
]);

const projects = ref([
  {
    name: 'New Dashboard',
    company: 'Google',
    deadline: '17th Oct, 15',
    overdue: true,
    leader: {
      name: 'Myrtle Erickson',
      team: 'UK Design Team',
      image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/584938/people_8.png'
    },
    budget: '$4,670',
    paymentStatus: 'Paid',
    status: { text: 'In progress', color: 'bg-orange-500 text-white' },
  },
  // Add more projects here...
]);

const charts = ref([
  { title: 'Household Expenditure', subtitle: 'Yearly' },
  { title: 'Monthly revenue', subtitle: '2015 (in thousands US$)' },
  { title: 'Exports of Goods', subtitle: '2015 (in billion US$)' },
]);
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css');
</style>