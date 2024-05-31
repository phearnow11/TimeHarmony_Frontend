<template>
  <header
    class="myheader grid grid-cols-6 gap-4 h-20 items-center sticky top-0 z-50 w-full px-4 bg-black-99"
  >
    <div class="flex items-center justify-between">
      <side-bar />
      <div class="flex justify-center items-center h-full">
        <router-link to="/">
          <img
            src="../assets/time-harmony.png"
            class="h-16 max-w-full object-contain"
          />
        </router-link>
      </div>
    </div>
    <div class="ui-input-container col-span-3">
      <input
        required=""
        placeholder="Type something..."
        class="ui-input"
        type="text"
      />
      <div class="ui-input-underline"></div>
      <div class="ui-input-highlight"></div>
      <div class="ui-input-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2"
            stroke="currentColor"
            d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
          ></path>
        </svg>
      </div>
    </div>
    <div class="flex justify-end items-center h-full col-span-2" v-if="!auth.user_id">
      <router-link to="/login" class="hover-underline-animation"
        >Have an account? Login</router-link
      >
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";
import SideBar from "./SideBar.vue";
const auth = useAuthStore();
</script>

<style>
body {
  padding-top: 0.5rem; /* Adjust this value based on the header height */
}

.myheader {
  box-shadow: rgba(85, 70, 7, 0.15) 0px 48px 100px 0px;
  width: 100%;
  left: 0;
  right: 0;
  margin-right: 0; /* Ensure there is no unintended margin */
}

.ui-input-container {
  position: relative;
  /* width: 300px; */
}

.ui-input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  font-size: 1em;
  border: none;
  border-bottom: 2px solid #ccc;
  outline: none;
  background-color: transparent;
  transition: border-color 0.3s;
}

.ui-input:focus {
  border-color: var(--secondary);
}

.ui-input-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  background-color: var(--primary);
  transform: scaleX(0);
}

.ui-input:focus + .ui-input-underline {
  transform: scaleX(1);
}

.ui-input-highlight {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 0;
  background-color: var(--back);
  transition: width 0.3s;
}

.ui-input:focus ~ .ui-input-highlight {
  width: 100%;
}

.ui-input-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  transition: color 0.3s;
}

.ui-input:focus ~ .ui-input-icon {
  color: #e6c591;
}

.ui-input-icon svg {
  width: 20px;
  height: 20px;
}
</style>
