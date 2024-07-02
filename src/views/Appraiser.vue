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
          :class="['flex-grow min-h-[200px] p-2 bg-gray-200', { 'list-none': viewMode === 'kanban' }]"
        >
          <template #item="{element}">
            <div class="bg-white p-4  shadow-md cursor-move mb-2">
              <h3 class="font-bold text-md">{{ element.title }}</h3>
              <p class="text-sm text-gray-700">{{ element.description }}</p>
              <p class="text-xs text-gray-500 mt-2">Due: {{ element.dueDate }}</p>
              
            </div>
          </template>
        </draggable>
        <input 
          v-model="newTask[columnIndex]"
          @keyup.enter="addTask(columnIndex)"
          class="w-full p-2  border mt-4"
          placeholder="Add new task"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import draggable from 'vuedraggable';

const viewMode = ref('kanban'); // Assuming 'kanban' is the initial view mode

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'kanban' ? 'list' : 'kanban';
};

const columns = ref([
  { 
    name: 'Do not approve yet',
    tasks: [
      { id: 1, title: 'Design new logo', description: 'Create a modern logo for our brand', dueDate: '2024-07-15' },
      { id: 2, title: 'Update website content', description: 'Refresh the copy on our homepage', dueDate: '2024-07-20' },
    ]
  },
  { 
    name: 'Approved',
    tasks: [
      { id: 3, title: 'Develop new feature', description: 'Implement user authentication system', dueDate: '2024-07-25' },
    ]
  },
  { 
    name: 'Delete',
    tasks: [
      { id: 4, title: 'Set up project repository', description: 'Initialize Git repo and set up branches', dueDate: '2024-07-05' },
    ]
  },

]);

const newTask = ref(Array(columns.value.length).fill(''));

let nextId = 13; // Make sure this reflects the highest ID in your data

const addTask = (columnIndex) => {
  if (newTask.value[columnIndex].trim() !== '') {
    columns.value[columnIndex].tasks.push({
      id: nextId++,
      title: newTask.value[columnIndex],
      description: 'New task description',
      dueDate: '2024-07-09'
    });
    newTask.value[columnIndex] = '';
  }
};
</script>

<style scoped>

@import 'https://fonts.googleapis.com/icon?family=Material+Icons';




.btn {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4  inline-flex items-center;
}

.btn-active {
  @apply bg-gray-300;
}
</style>