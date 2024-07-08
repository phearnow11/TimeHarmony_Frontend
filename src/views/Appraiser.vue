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
      <div v-for="(column, columnIndex) in columns" :key="column.name" 
           :class="[
             viewMode === 'kanban' ? 'w-1/4' : 'mb-4',
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
          @end="onDragEnd(columnIndex)"
          :class="['flex-grow min-h-[200px] p-2 bg-[#343432]', { 'list-none': viewMode === 'kanban' }]"
        >
          <template #item="{element}">
            <div class="bg-[#1b1b1b] p-4 shadow-md cursor-move mb-2" 
            @dragend="
            setDrag(element.id, column.name); 
            useStaffStore().approveWatch(element.id); 
            console.log(column.name)
            ">
              <h3 class="text-primary font-bold text-md">{{ element.title }}</h3>
              <p class="text-sm text-secondary">{{ element.description }}</p>
              <p class="text-sm text-secondary">{{ element.id }}</p>
              <p class="text-xs text-secondary mt-2">Due: {{ element.dueDate }}</p>
            </div>
          </template>
        </draggable>
        <input 
          v-model="newTask[columnIndex]"
          @keyup.enter="addTask(columnIndex)"
          class="w-full p-2 border mt-4"
          placeholder="Add new task"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import draggable from 'vuedraggable';
import { useStaffStore } from '../stores/staff';

const dragthing = ref('')
const columnNameDrag = ref('');

function setDrag(id, columnName) {
  dragthing.value = id;
  columnNameDrag.value = columnName;
}

const viewMode = ref('kanban');
const columns = ref([
  { 
    name: 'Do not approve yet',
    tasks: [],
    columnName: 'Do not approve yet'
  },
  { 
    name: 'Approved',
    tasks: [],
    columnName: 'Approved'
  },
  { 
    name: 'Delete',
    tasks: [],
    columnName: 'Delete'
  },
]);
const newTask = ref(Array(columns.value.length).fill(''));
const staffStore = useStaffStore();

onMounted(async () => {
  await staffStore.getAllUnApproved();
  columns.value[0].tasks = staffStore.unapprovedWatches.map(watch => ({
    id: watch.watch_id,
    title: watch.watch_name,
    description: watch.watch_description,
    dueDate: new Date(watch.watch_create_date).toLocaleDateString(),
  }));
});

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'kanban' ? 'list' : 'kanban';
};

const onDragEnd = (targetColumnIndex) => {
  console.log(`Dragged into column: ${columns.value[targetColumnIndex].name}`);
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
