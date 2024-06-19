<template>
    <div class="flex flex-col md:flex-row pt-5">
      <div class="md:w-1/3 p-4">
        <div class="flex items-center mb-4">
          <img
            src="https://via.placeholder.com/50"
            alt="Profile Picture"
            class= "mr-4"
          />
          <div>
            <h2 class="font-bold">ThinhPhoenix</h2>
            <p class="text-secondary">No star yet</p>
          </div>
        </div>
        <div class="mb-4">
          <p class="text-secondary">Follower: 0</p>
          <p class="text-secondary">Following: 0</p>
        </div>
        <button
          class="th-p-btn"
        >
          + Follow
        </button>
        <button
          class="ml-5 th-p-btn"
        >
          Chat
        </button>
        <div class="p-4 shadow-md">
          <h3 class="font-bold mb-2">Chat response:</h3>
          <p class="text-secondary">Thinh thoang (Trong 5 gio)</p>
          <h3 class="font-bold mb-2 mt-4">Joined:</h3>
          <p class="text-secondary">{{ getCurrentDate() }}</p>
          <h3 class="font-bold mb-2 mt-4">Verified:</h3>
          <div class="flex items-center">
            <i class="fas fa-check-circle text-green-500 mr-2"></i>
            <i class="fab fa-facebook-square text-blue-500 mr-2"></i>
            <i class="fab fa-google text-red-500 mr-2"></i>
            <i class="fas fa-envelope text-gray-500"></i>
          </div>
          <h3 class="font-bold mb-2 mt-4">Address:</h3>
          <p class="text-secondary">No information</p>
        </div>
      </div>
      <div class="md:w-2/3 p-4">
        <div class="p-4 shadow-md mb-4">
          <h2 class="font-bold mb-2">Dang hien thi (1)</h2>
          <div class="flex items-center mb-4">
            <cart-item/>
          </div>
        </div>
        <div class="p-4 shadow-md">
          <h2 class="font-bold mb-2">Da ban (0)</h2>
        </div>
      </div>
    </div>
  </template>

<script setup>
import CartItem from '../components/CartItem.vue'

function getCurrentDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
};

</script>