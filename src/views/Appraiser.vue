<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Watch Appraise</h1>
      <div class="space-x-2">
        <button @click="toggleViewMode" class="btn">
          <i class="material-icons">{{ viewMode === 'kanban' ? 'view_list' : 'view_column' }}</i>
          {{ viewMode === 'kanban' ? 'List View' : 'Kanban View' }}
        </button>
      </div>
    </div>
    <div :class="{ 'flex align-middle justify-center space-x-4': viewMode === 'kanban' }">
      <div v-for="(column) in columns" :key="column.name"
        :class="[
          viewMode === 'kanban' ? 'w-1/3' : 'mb-4',
          'frame flex flex-col'
        ]">
        <h2 class="font-bold text-lg mb-4">
          <i :class="['material-icons', column.iconColor]">{{ column.icon }}</i>
          {{ column.name }}
        </h2>
        <draggable
          v-model="column.tasks"
          :group="'tasks'"
          item-key="id"
          @end="onDragEnd"
          :class="['flex-grow min-h-[200px] p-2 bg-[#343432]', { 'list-none': viewMode === 'kanban' }]"
        >
          <template #item="{element}">
            <div class="bg-[#1b1b1b] p-4 shadow-md cursor-move mb-2">
              <h3 class="text-primary font-bold text-md">{{ element.title }}</h3>
              <p class="text-sm text-[whitesmoke]">{{ formatPriceVND(element.price) }}</p>
              <p class="text-sm text-[whitesmoke]">{{ element.id }}</p>
              <p class="text-xs text-[whitesmoke] mt-2 mb-2">Due: {{ element.dueDate }}</p>
              <router-link :to="`/detail/${element.id}`" class="mt-2 hover-underline-animation">Go to Detail</router-link>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- Approval Confirmation Modal -->
    <div v-if="showApproveModal" class="fixed inset-0 z-50 flex items-center justify-center back bg-opacity-50">
      <div class="bg-[#1b1b1b] p-6 shadow-lg">
        <h2 class="text-lg font-semibold mb-4">Xác nhận Duyệt</h2>
        <p>Bạn có muốn duyệt đồng hồ này không?</p>
        <div class="mt-6 flex justify-end space-x-4">
          <button @click="handleCancel('approve')" class="border-2 px-2 py-2 border-secondary">Huỷ</button>
          <button @click="handleConfirm('approve')" class="btn">Xác nhận</button>
        </div>
      </div>
    </div>

    <!-- Unapprove Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center back bg-opacity-50">
      <div class="bg-[#1b1b1b] p-6 shadow-lg max-w-md w-full">
        <h2 class="text-lg font-semibold mb-4">Xác nhận Từ chối</h2>
        <p class="mb-4">Bạn có muốn từ chối duyệt đồng hồ này không?</p>
        
        <form @submit.prevent="handleConfirm('unapprove')">
          <div class="mb-4">
            <label for="reportContent" class="block text-sm font-medium text-gray-300 mb-2">Lý do từ chối:</label>
            <textarea 
              id="reportContent" 
              v-model="reportContent" 
              rows="4" 
              class="w-full px-3 py-2 text-gray-200 bg-[#2b2b2b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            ></textarea>
          </div>
          
          <div class="flex justify-end space-x-4">
            <button type="button" @click="handleCancel('unapprove')" class="border-2 px-4 py-2 border-secondary">Huỷ</button>
            <button type="submit" class="btn">Xác nhận</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import draggable from 'vuedraggable';
import { useStaffStore } from '../stores/staff';
import { useAuthStore } from '../stores/auth';
import { useUserStore } from '../stores/user';
import router from '../router';

if(useUserStore().role!='ROLE_STAFF'){
  console.log('Not STAFF');
  router.push('/')
}

const authStore = useAuthStore();
const viewMode = ref('kanban');
const columns = ref([
  {
    name: 'Chưa duyệt',
    tasks: [],
    columnName: 'Chưa duyệt',
  },
  {
    name: 'Đã được duyệt',
    tasks: [],
    columnName: 'Đã được duyệt',
  },
  {
    name: 'Không chấp thuận',
    tasks: [],
    columnName: 'Không chấp thuận',
  },
]);
const staffStore = useStaffStore();
const showApproveModal = ref(false);
const showDeleteModal = ref(false);
const targetColumnName = ref('');
const draggedItemId = ref(null);
const reportContent = ref('');
const draggedItem = ref(null);
const watchSellerMap = ref(new Map());

onMounted(async () => {
  const unapprovedWatches = await staffStore.getAllWatch(0);
  unapprovedWatches.forEach(watch => {
    if (watch.seller && watch.seller.member_id) {
      watchSellerMap.value.set(watch.watch_id, watch.seller.member_id);
      console.log('Seller Member ID of Unapprove Watch: ' + watch.seller.member_id);
    } else {
      console.log('Seller Member ID not available for watch: ' + watch.watch_id);
    }
  });

  await staffStore.getAllWatch(0);
  await staffStore.getAllWatch(1);
  await staffStore.getAllWatch(2);
  
  columns.value[0].tasks = staffStore.unapprovedWatches.map(watch => ({
    id: watch.watch_id,
    title: watch.watch_name,
    price: watch.price,
    dueDate: new Date(watch.watch_create_date).toLocaleDateString(),
  }));
  columns.value[1].tasks = staffStore.approvedWatches.map(watch => ({
    id: watch.watch_id,
    title: watch.watch_name,
    price: watch.price,
    dueDate: new Date(watch.watch_create_date).toLocaleDateString(),
  }));
  columns.value[2].tasks = staffStore.deleteWatches.map(watch => ({
    id: watch.watch_id,
    title: watch.watch_name,
    price: watch.price,
    dueDate: new Date(watch.watch_create_date).toLocaleDateString(),
  }));
});

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'kanban' ? 'list' : 'kanban';
};

const onDragEnd = (event) => {
  if (event.to) {
    targetColumnName.value = event.to.parentElement.querySelector('h2').textContent.trim();
    draggedItemId.value = event.item.querySelector('p:nth-child(3)').textContent.trim();
    draggedItem.value = columns.value.flatMap(col => col.tasks).find(task => task.id === draggedItemId.value);
    
    if (targetColumnName.value === 'Đã được duyệt') {
      showApproveModal.value = true;
    } else if (targetColumnName.value === 'Không chấp thuận') {
      showDeleteModal.value = true;
      reportContent.value = ''; // Clear previous content
    } else if (targetColumnName.value === 'Chưa duyệt') {
      staffStore.getAllWatch(0);
      refreshColumns();
    }
  }
};

const handleConfirm = async (type) => {
  if (type === 'approve') {
    await staffStore.approveWatch(draggedItemId.value);
    showApproveModal.value = false;
  } else if (type === 'unapprove') {
    if (!reportContent.value.trim()) {
      alert('Vui lòng nhập lý do từ chối.');
      return;
    }
    let sellerId = watchSellerMap.value.get(draggedItemId.value);
    if (!sellerId) {
      const watch = staffStore.unapprovedWatches.find(w => w.watch_id === draggedItemId.value) ||
                    staffStore.approvedWatches.find(w => w.watch_id === draggedItemId.value) ||
                    staffStore.deleteWatches.find(w => w.watch_id === draggedItemId.value);
      if (watch && watch.seller && watch.seller.member_id) {
        sellerId = watch.seller.member_id;
        watchSellerMap.value.set(draggedItemId.value, sellerId);
      }
    }
    const data = {
      watch_id: draggedItemId.value,
      type: 1, // For APPRAISER_REPORT
      content: reportContent.value,
      from: authStore.user_id,
      to: sellerId
    };

    if(sellerId){
      console.log(data);
      await useStaffStore().notapproveWatch(data);
    } else {
      console.error('Seller ID not found for watch:', draggedItemId.value);
    }
    showDeleteModal.value = false;
  }
  refreshColumns();
};

const handleCancel = (type) => {
  if (type === 'approve') {
    showApproveModal.value = false;
  } else if (type === 'unapprove') {
    showDeleteModal.value = false;
  }
  refreshColumns();
};

const refreshColumns = () => {
  columns.value[0].tasks = staffStore.unapprovedWatches.map(watch => ({
    id: watch.watch_id,
    title: watch.watch_name,
    price: watch.price,
    dueDate: new Date(watch.watch_create_date).toLocaleDateString(),
  }));
  columns.value[1].tasks = staffStore.approvedWatches.map(watch => ({
    id: watch.watch_id,
    title: watch.watch_name,
    price: watch.price,
    dueDate: new Date(watch.watch_create_date).toLocaleDateString(),
  }));
  columns.value[2].tasks = staffStore.deleteWatches.map(watch => ({
    id: watch.watch_id,
    title: watch.watch_name,
    price: watch.price,
    dueDate: new Date(watch.watch_create_date).toLocaleDateString(),
  }));
};

const formatPriceVND = (price) => {
  const formattedPrice = (price / 1).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
  return formattedPrice;
};
</script>

<style scoped>
@import 'https://fonts.googleapis.com/icon?family=Material+Icons';
.back{
  background-color: rgba(20, 20, 20, 0.836);
  backdrop-filter: blur(10px);
}
.btn {
  @apply bg-primary hover:bg-primary text-black font-semibold py-2 px-4 inline-flex items-center;
}

.btn-active {
  @apply bg-primary;
}
</style>