<template>
  <div v-if="route.path !== '/chat'">
  <nav
  v-if="(auth.user_id) || (route.path !== '/login' && route.path !== '/signup')"
  class="myheader grid grid-cols-6 gap-4 h-20 items-center sticky top-0 z-50 w-full pl-6 pr-6"
  >
    <div class="flex items-center justify-between col-span-1">
      <side-bar />
      <div class="flex justify-center items-center h-full">
        <router-link to="/">
          <img src="../assets/time-harmony.png" class="h-14 logo" />
        </router-link>
      </div>
    </div>
    <div class="ui-input-container col-span-3" @click="showHint = true">
      <input
        required
        placeholder="Type something..."
        class="ui-input"
        type="text"
        v-model="searchQuery"
        @keyup.enter="search"
        @input="updateHint"
      />
      <div class="ui-input-underline"></div>
      <div class="ui-input-highlight"></div>
      <div class="ui-input-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path
            stroke-width="2"
            stroke="currentColor"
            d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
          ></path>
        </svg>
      </div>
      <div
        v-if="showHint && searchQuery"
        class="hint-dropdown"
        @click="navigateToSearchResult"
        @mouseover="hovered = true"
        @mouseleave="hovered = false"
      >
        Searching "{{ searchQuery }}..."
      </div>
    </div>

    <div class="flex justify-end items-center h-full gap-4 col-span-2">
      <!-- <router-link
        to="/upload"
        class="hover-underline-animation"
        v-if="auth.user_id"
        >Upload</router-link
      > -->
      <button v-if="auth.user_id" class="th-p-btn upload-button pl-4 pr-4">
        <router-link
        to="/upload"
      
        
        >Upload <span class="mdi mdi-plus"></span></router-link
      >
      </button>
      <router-link to="/chat">
        <span class="mdi mdi-message-text-outline hover-animation"></span>
      </router-link>
      <router-link to="">
        <span class="mdi mdi-heart-outline hover-animation"></span>
      </router-link>
      <router-link to="/cart">
        <span class="mdi mdi-shopping-outline hover-animation"></span>
      </router-link>
      <!-- Guest Page -->
      <div v-if="!auth.user_id" class="relative">
        <div @click="toggleMenu" class="user cursor-pointer flex items-center hover-animation">
          <span class="mdi mdi-account-outline "></span>
          <span class="arrow-icon" :class="{ 'rotate-180': showMenu }">
            <img src="../assets/arr.svg" class="w-3" alt="Arrow Icon">
          </span>
        </div>
        <div v-show="showMenu" class="submenu absolute top-10 right-0.5 pt-1 w-48">
          
          <router-link to="/login" class="submenu-item block px-4 py-2 hover-underline-animation">Log in</router-link>
          <router-link to="/signup" class="submenu-item block px-4 py-2 hover-underline-animation">Sign Up</router-link>
        </div>
      </div>
      <!-- Guest Page -->
      <!-- User Page -->
      <div v-if="auth.user_id" class="relative">
        <div @click="toggleMenu" class="user cursor-pointer flex items-center hover-animation">
          <span>{{ greeting }}, {{ useUserStore().first_name }} </span>
          <span class="ml-2 mr-1">
            <img :src="useUserStore().image" class="img-responsive" alt="Image Description">
          </span>
          <span class="arrow-icon" :class="{ 'rotate-180': showMenu }">
      <img src="../assets/arr.svg" class="w-3" alt="Arrow Icon">
    </span>
        </div>
        <div v-show="showMenu">
          
          <div class="submenu absolute top-10 right-0.5 text-white pt-1 w-48">
            <router-link to="/setting/profile" 
            class="submenu-item block px-4 py-2 hover-underline-animation"
            >Settings</router-link>
            <router-link to="/appraiser" 
            class="submenu-item block px-4 py-2 hover-underline-animation"
            >Appraise</router-link>
            <a
              @click="logout"
              class="submenu-item block px-4 py-2 cursor-pointer hover-underline-animation"
              >Log Out</a
            >
            
          </div>
        </div>
      </div>
      <!-- User Page -->
    </div>
  </nav>
  </div>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";
import SideBar from "./MenuBar.vue";
import { useRoute } from "vue-router";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import { onMounted } from "vue";


const searchQuery = ref("");
const showHint = ref(false);
const hovered = ref(false);
const router = useRouter();
const showMenu = ref(false);
const greeting = ref("");
const submenus = ref({
  setting: false,
  logout: false,
  style: false,
  collection: false,
  // Add other submenus as needed
});

const logout = () => {
  useAuthStore().logout();
};

document.addEventListener("click", (e) => {
  if (!e.target.closest(".user") && !e.target.closest(".dropdown-menu")) {
    showMenu.value = false;
  }
});

const search = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: "SearchResult", query: { q: searchQuery.value } });
    showHint.value = false;
  }
};

const updateHint = () => {
  showHint.value = true;
};

const navigateToSearchResult = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: "SearchResult", query: { q: searchQuery.value } });
    showHint.value = false;
  }
};

document.addEventListener("click", (e) => {
  if (!e.target.closest(".ui-input-container")) {
    showHint.value = false;
  }
});

function toggleMenu() {
  showMenu.value = !showMenu.value;
}

function showSubmenu(menu) {
  submenus.value[menu] = true;
}
function setGreeting() {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 0 && hour < 5) {
    greeting.value = "Good night";
  } else if (hour >= 5 && hour < 12) {
    greeting.value = "Good morning";
  } else if (hour >= 12 && hour < 18) {
    greeting.value = "Good afternoon";
  } else{
    greeting.value = "Good evening";
  }
}

onMounted(() => {
  setGreeting();
});

const auth = useAuthStore();
const route = useRoute();
</script>

<style scoped>
.avatar {
  border: var(--primary) solid 2px;
}

textarea:focus,
.logo {
  width: 100%;
  max-width: 140px;
  height: auto;
}

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* Ensure consistent box-sizing */
}

/* Global Styles */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

.mdi {
  font-size: 20px;
}

.img-responsive {
  width: 35px; /* Đặt kích thước bạn muốn */
  height: 35px;
  object-fit: cover;
  border: 1.5px solid var(--secondary)
}



.myheader {
  box-shadow: rgba(153, 153, 153, 0.685) 0px 1px 1px,
    rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: rgba(20, 20, 20, 0.836);
  backdrop-filter: blur(10px); /* Apply a blur effect to the background */
  -webkit-backdrop-filter: blur(10px); /* For Safari */
}

.ui-input-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.ui-input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  font-size: 1em;
  border: none;
  border-bottom: 2px solid #ccc;
  background-color: transparent;
  transition: border-color 0.3s, background-color 0.3s, padding 0.3s;
}

.ui-input:focus {
  border-color: var(--secondary);

  padding: 10px 10px 10px 40px; /* Ensuring the padding remains the same on focus */
}

.ui-input-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  background-color: var(--primary);
  transform: scaleX(0);
  transition: transform 0.3s;
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

.hint-dropdown {
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(25px);
  box-shadow: rgba(153, 153, 153, 0.685) 0px 1px 1px,
    rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  padding: 8px;
  margin-top: 2px;
  width: 100%;
  text-align: left;
  position: absolute;
  top: 100%;
  left: 0;
  cursor: pointer;
  color: var(--wait);
  text-decoration: none;
}

.hint-dropdown::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  display: block;
  margin: 0 auto;
  background: #ffbd59;
  transition: width 0.4s ease-in-out;
  left: 50%;
  transform: translateX(-50%);
  bottom: -2px;
}

.hint-dropdown:hover::after {
  width: 100%;
}

.hint-dropdown:hover {
  color: var(--secondary);
}

.submenu {
  background-color: rgba(20, 20, 20, 0.95); /* Increased opacity */
  backdrop-filter: blur(30px); /* Increased blur */
  -webkit-backdrop-filter: blur(30px); /* Increased blur */
}

.submenu-item {
  display: block;
  text-decoration: none;
  width: 100%;
  padding: 10px;
}

.hover-animation {
  position: relative;
  text-decoration: none;
  color: var(--wait);
}

.hover-animation::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  display: block;
  margin: 0 auto;
  background: #ffbd59;
  transition: width 0.6s ease-in-out;
  left: 50%;
  transform: translateX(-50%);
  bottom: -2px;
}
.hover-animation:hover {
  color: var(--secondary);
}

.hover-underline-animation {
  position: relative;
  text-decoration: none;
  color: var(--wait);
}

.hover-underline-animation::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  display: block;
  margin: 0 auto;
  background: #ffbd59;
  transition: width 0.4s ease-in-out;
  left: 50%;
  transform: translateX(-50%);
  bottom: -2px;
}

.hover-underline-animation:hover::after {
  width: 100%;
}

.hover-underline-animation:hover {
  color: var(--secondary);
}

.hover-active {
  color: var(--secondary);
}

.hover-active::after {
  width: 100%;
}

.arrow-icon {
  margin-left: 3px;
  transition: transform 0.4s ease-in-out;
  transform: rotate(90deg);
}

.rotate-180 {
  transform: rotate(270deg);
}

.logo {
  width: 100%;
  max-width: 140px;
  height: auto;
}

.upload-button{
  width: 6.8rem;
  height: 35px;
}
</style>
