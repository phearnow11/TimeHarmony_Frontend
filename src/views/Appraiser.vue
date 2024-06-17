<template>
  <div v-if="auth.user_id" class="p-4">
    <table class="min-w-full">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b border-gray-200">#</th>
          <th class="py-2 px-4 border-b border-gray-200">Watch Name</th>
          <th class="py-2 px-4 border-b border-gray-200">Upload Date</th>
          <th class="py-2 px-4 border-b border-gray-200">Status</th>
          <th class="py-2 px-4 border-b border-gray-200">Name</th>
          <th class="py-2 px-4 border-b border-gray-200">Progress</th>
          <th class="py-2 px-4 border-b border-gray-200">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(project, index) in projects" :key="index">
          <td class="py-2 px-4 border-b border-gray-200">{{ index + 1 }}</td>
          <td class="py-2 px-4 border-b border-gray-200">{{ project.name }}</td>
          <td class="py-2 px-4 border-b border-gray-200">{{ project.startDate }}</td>
          <td class="py-2 px-4 border-b border-gray-200">
            <span :class="statusClass(project.status)">{{ project.status }}</span>
          </td>
          <td class="py-2 px-4 border-b border-gray-200">
            <span>{{ user.first_name }}</span>
        </td>
          <td class="py-2 px-4 border-b border-gray-200">
            <div class="flex items-center">
              <div class="ml-2">
                <div :style="{ width: project.progress + '%' }" class="bg-green-500 h-2.5"></div>
              </div>
              <span class="ml-2">{{ project.progress }}%</span>
            </div>
          </td>
          <td class="py-2 px-4 border-b border-gray-200">
            <button class="text-green-500 hover:text-green-700 mx-1"><i class="fas fa-edit"></i></button>
            <button class="text-red-500 hover:text-red-700 mx-1"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="h-screen flex items-center justify-center">
    <p class="text-xl font-medium text-center">You need to login to use this function, <router-link class="hover-underline-animation" to="/login">Log in now</router-link></p>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { ref, computed } from 'vue';
import { useUserStore } from '../stores/user';

const user = useUserStore();
const auth = useAuthStore();
const projects = ref([
  {
    name: 'New admin Design',
    startDate: '02.5.2019',
    status: 'Completed',
    team: [
      { avatar: 'https://via.placeholder.com/50' },
      { avatar: 'https://via.placeholder.com/50' },
      { avatar: 'https://via.placeholder.com/50' },
    ],
    progress: 100,
  },
  {
    name: 'Landing page Design',
    startDate: '04.6.2019',
    status: 'Pending',
    team: [
      { avatar: 'https://via.placeholder.com/50' },
      { avatar: 'https://via.placeholder.com/50' },
    ],
    progress: 72,
  },
  // Add the rest of the project data here
]);

const statusClass = (status) => {
  switch (status) {
    case 'Completed':
      return 'text-green-500';
    case 'Pending':
      return 'text-yellow-500';
    default:
      return '';
  }
};
</script>