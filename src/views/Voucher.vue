<template>
    <div class="mx-auto p-4 text-center">
      <h1 class="text-2xl font-bold mb-4">Voucher Management</h1>
      
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="form__group field">
          <input
            v-model="newVoucher.name"
            type="text"
            class="form__field"
            placeholder="Voucher Name"
            required
          />
          <label for="name" class="form__label">Voucher Name</label>
        </div>
        <div class="form__group field">
          <input
            v-model="newVoucher.description"
            type="text"
            class="form__field"
            placeholder="Description"
            required
          />
          <label for="description" class="form__label">Description</label>
        </div>
        <div class="form__group field">
          <input
            v-model="newVoucher.value_percentage"
            type="number"
            class="form__field"
            placeholder="Value Percentage"
            required
          />
          <label for="value_percentage" class="form__label">Value Percentage</label>
        </div>
        <div class="form__group field">
          <input
            v-model="newVoucher.value"
            type="number"
            class="form__field"
            placeholder="Value"
            required
          />
          <label for="value" class="form__label">Value</label>
        </div>
        <div class="form__group field">
          <input
            v-model="newVoucher.limit"
            type="number"
            class="form__field"
            placeholder="Limit"
            required
          />
          <label for="limit" class="form__label">Limit</label>
        </div>
        <div class="form__group field">
          <input
            v-model="newVoucher.condition"
            type="number"
            class="form__field"
            placeholder="Condition"
            required
          />
          <label for="condition" class="form__label">Condition</label>
        </div>
        <div class="form__group field">
          <input
            v-model="newVoucher.expired_date"
            type="number"
            class="form__field"
            placeholder="Expired Date (days)"
            required
          />
          <label for="expired_date" class="form__label">Expired Date (days)</label>
        </div>
        <div class="form__group field">
          <input
            v-model="newVoucher.quantity"
            type="number"
            class="form__field"
            placeholder="Quantity"
            required
          />
          <label for="quantity" class="form__label">Quantity</label>
        </div>
      </div>
      <div class="flex justify-start">
        <button @click="createVoucher" class="th-s-btn">Create Voucher +</button>
      </div>
  
      <section class="mt-8">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="py-2 px-4 border-b">Name</th>
              <th class="py-2 px-4 border-b">Description</th>
              <th class="py-2 px-4 border-b">Value %</th>
              <th class="py-2 px-4 border-b">Value</th>
              <th class="py-2 px-4 border-b">Limit</th>
              <th class="py-2 px-4 border-b">Condition</th>
              <th class="py-2 px-4 border-b">Expired In</th>
              <th class="py-2 px-4 border-b">Quantity</th>
              <th class="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="voucher in voucherStore.vouchers" :key="voucher.id">
              <td class="py-2 px-4 border-b">{{ voucher.name }}</td>
              <td class="py-2 px-4 border-b">{{ voucher.description }}</td>
              <td class="py-2 px-4 border-b">{{ voucher.value_percentage }}%</td>
              <td class="py-2 px-4 border-b">{{ voucher.value }}</td>
              <td class="py-2 px-4 border-b">{{ voucher.limit }}</td>
              <td class="py-2 px-4 border-b">{{ voucher.condition }}</td>
              <td class="py-2 px-4 border-b">{{ voucher.expired_date }} days</td>
              <td class="py-2 px-4 border-b">{{ voucher.quantity }}</td>
              <td class="py-2 px-4 border-b">
                <button @click="editVoucher(voucher)" class="text-blue-500 mr-2">Edit</button>
                <button @click="deleteVoucher(voucher.id)" class="text-red-500">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useVoucherStore } from '../stores/voucher';
import { useUserStore } from '../stores/user';
import router from '../router';

  if(useUserStore().role!='ROLE_STAFF'){
  console.log('Not STAFF');
  router.push('/')
}
  
  const voucherStore = useVoucherStore();
  
  const newVoucher = ref({
    name: '',
    description: '',
    value_percentage: 0,
    value: 0,
    limit: 0,
    condition: 0,
    expired_date: 0,
    quantity: 1
  });
  
  onMounted(() => {
    voucherStore.getAllVoucher();
  });
  
  async function createVoucher() {
    if (validateVoucher(newVoucher.value)) {
      try {
        await voucherStore.uploadVoucher(newVoucher.value);
        resetNewVoucher();
      } catch (error) {
        console.error('Error creating voucher:', error);
        alert('Failed to create voucher. Please try again.');
      }
    } else {
      alert('Please fill in all fields correctly');
    }
  }
  
  function resetNewVoucher() {
    newVoucher.value = {
      name: '',
      description: '',
      value_percentage: 0,
      value: 0,
      limit: 0,
      condition: 0,
      expired_date: 0,
      quantity: 1
    };
  }
  
  function validateVoucher(voucher) {
    return (
      voucher.name &&
      voucher.description &&
      voucher.value_percentage >= 0 &&
      voucher.value >= 0 &&
      voucher.limit > 0 &&
      voucher.condition >= 0 &&
      voucher.expired_date > 0 &&
      voucher.quantity > 0
    );
  }
  
  function editVoucher(voucher) {
    // Implement edit functionality
    console.log('Edit voucher', voucher);
  }
  
  function deleteVoucher(id) {
    voucherStore.vouchers = voucherStore.vouchers.filter(v => v.id !== id);
  }
  </script>  