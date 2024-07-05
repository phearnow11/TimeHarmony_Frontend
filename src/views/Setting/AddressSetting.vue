<template>
    <div v-if="auth.user_id" class="flex max-w-7xl mx-auto my-8 p-4">
          <!-- Sidebar -->
          <div class="w-1/4 mr-8">
            <h2 class="text-2xl mb-4">Profile Settings</h2>
            <ul>
                <li class="mb-2"><router-link to="/setting/profile" class="hover-underline-animation">Account</router-link></li>
                <li class="mb-2"><router-link to="/setting/password" class="hover-underline-animation">Password</router-link></li>
                <li class="mb-2 text-secondary">Address</li>
              <li class="mb-2"><router-link to="#" class="hover-underline-animation">My Purchase</router-link></li>
              <li class="mb-2"><router-link to="#" class="hover-underline-animation">Delete account</router-link></li>
            </ul>
          </div>
          <!-- Content -->
    <div class="container mx-auto p-4">
      <table class="w-full border-collapse">
        <thead>
          <tr class="text-left">
            <th class="pb-2">Name</th>
            <th class="pb-2 pl-2">Phone Number</th>
            <th class="pb-2 pl-2">Address</th>
            <th class="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="address in addresses" :key="address.id" class="border-t">
            <td class="py-4">{{ address.name }}</td>
            <td class="py-4 px-2">{{ address.phone }}</td>
            <td class="py-4 px-2">{{ address.address }}</td>
            <td class="py-4 px-2 text-right">
              <span v-if="address.isDefault" class="text-gray-500 text-sm px-2">
                Default Address
              </span>
              <button class="hover-underline-animation" @click="editAddress(address)">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button class="mt-4 th-p-btn" @click="addNewAddress">
        + ADD NEW ADDRESS
      </button>
    </div>
    </div>
  </template>
  
  <script setup>
import { useAuthStore } from '../../stores/auth';
import { useUserStore } from '../../stores/user';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const user = useUserStore();
const auth = useAuthStore();
const router = useRouter();
const addresses = ref([]);

onMounted(async () => {
  if (!auth.user_id) {
    console.log('User is not logged in. Redirecting to login...');
    router.push('/login');
  } else {
    try {
      addresses.value = await user.getAddressDetails(auth.user_id);
    } catch (error) {
      console.error('Failed to fetch address details:', error);
      // Handle error (e.g., show an error message to the user)
    }
  }
});

const editAddress = (address) => {
  // Implement edit functionality
  console.log('Edit address:', address);
};

const addNewAddress = () => {
  // Implement add new address functionality
  console.log('Add new address');
};
</script>

  
<style scoped>

</style>
  