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
              <p class="text-sm text-secondary">{{ element.description }}</p>
              <p class="text-sm text-secondary">{{ element.id }}</p>
              <p class="text-xs text-secondary mt-2">Due: {{ element.dueDate }}</p>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import draggable from 'vuedraggable';
import { useStaffStore } from '../stores/staff';

const viewMode = ref('kanban');
const columns = ref([
  {
    name: 'Do not approve yet',
    tasks: [],
    columnName: 'Do not approve yet',
  },
  {
    name: 'Approved',
    tasks: [],
    columnName: 'Approved',
  },
  {
    name: 'Delete',
    tasks: [],
    columnName: 'Delete',
  },
]);
const staffStore = useStaffStore();

onMounted(async () => {
  await staffStore.getAllWatch(0);
  await staffStore.getAllWatch(1);
  await staffStore.getAllWatch(2);
  
  columns.value[0].tasks = staffStore.unapprovedWatches.map(watch => ({
    id: watch.watch_id,
    title: watch.watch_name,
    description: watch.watch_description,
    dueDate: new Date(watch.watch_create_date).toLocaleDateString(),
  }));
  columns.value[1].tasks = staffStore.approvedWatches.map(watch => ({
    id: watch.watch_id,
    title: watch.watch_name,
    description: watch.watch_description,
    dueDate: new Date(watch.watch_create_date).toLocaleDateString(),
  }));
  columns.value[2].tasks = staffStore.deleteWatches.map(watch => ({
    id: watch.watch_id,
    title: watch.watch_name,
    description: watch.watch_description,
    dueDate: new Date(watch.watch_create_date).toLocaleDateString(),
  }));
});

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'kanban' ? 'list' : 'kanban';
};

const onDragEnd = (event) => {
  if (event.to) {
    const targetColumnName = event.to.parentElement.querySelector('h2').textContent.trim();
    console.log(`Dragged into column: ${targetColumnName}`);
    
    // Get the dragged item
    const draggedItemId = event.item.querySelector('p:nth-child(3)').textContent.trim();
    
    // Call appropriate action based on the target column
    if (targetColumnName === 'Approved') {
      staffStore.approveWatch(draggedItemId);
    } else if (targetColumnName === 'Delete') {
      staffStore.deleteWatch(draggedItemId);
    } else if (targetColumnName === 'Do not approve yet') {
      staffStore.unapproveWatch(draggedItemId);
    }
  }
};
</script>

<style scoped>
@import 'https://fonts.googleapis.com/icon?family=Material+Icons';

.btn {
  @apply bg-primary hover:bg-primary text-black font-semibold py-2 px-4 inline-flex items-center;
}

.btn-active {
  @apply bg-primary;
}
</style>