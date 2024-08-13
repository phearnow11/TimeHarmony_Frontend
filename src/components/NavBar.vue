<template>
  <PopUp 
          :show="showPopup" 
          :message="'Yêu cầu xác thực email để tiếp tục đăng bán hàng'" 
          :showDetails="false"
          @close="showPopup = false"
        />
 <nav
  v-if="(!auth.user_id && !['/login', '/signup', '/chat', '/upload', '/order', '/cart', '/forgot'].includes(route.path)) || (auth.user_id && !['/chat', '/order', '/orderconfirmation/:order_id', '/admin', '/appraiser'].includes(route.path))"

  class="myheader grid grid-cols-6 gap-4 h-20 items-center sticky top-0 z-50 w-full pl-6 pr-6"
>
    <div class="flex items-center justify-between col-span-1">
      <side-bar />
      <div class="flex justify-center items-center h-full">
        <router-link v-if="!checkRole" to="/">
          <img src="../assets/time-harmony.png" class="h-12" />
        </router-link>
      </div>
    </div>
    <div class="ui-input-container col-span-3" @click="showHint = true">
      <input
        required
        placeholder="Tìm kiếm"
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
        Tìm kiếm cho "{{ searchQuery }}..."
      </div>
    </div>

    <div class="flex justify-end items-center h-full gap-4 col-span-2">
      <!-- <router-link
        to="/upload"
        class="hover-underline-animation"
        v-if="auth.user_id"
        >Upload</router-link
      > -->
      <router-link to="/upload" v-if="auth.user_id && userStore.role!='ROLE_STAFF' && userStore.role!='ROLE_ADMIN'">
        
        <button @click="handleUploadClick" class="th-p-btn upload-button px-6">
          Đăng bán<span class="mdi mdi-plus"></span>
        </button>
      </router-link>
      
      <a href="/chat">
        <span class="mdi mdi-message-text-outline hover-animation"></span>
        <span class="absolute top-5 newmessnoti text-blue-400" v-if="useChatStore().haveNewMessage">●</span>
      </a>
      <router-link v-if="useUserStore().role !=='ROLE_ADMIN'  && useUserStore().role !=='ROLE_STAFF'" to="/favorite">
        <span class="mdi mdi-heart-outline hover-animation"></span>
      </router-link>
      <router-link v-if="useUserStore().role !=='ROLE_ADMIN'  && useUserStore().role !=='ROLE_STAFF' " to="/cart">
        <div class="pr-2">
          <span class="mdi mdi-shopping-outline hover-animation"></span>
          <span class="absolute top-6">{{ useUserStore().cart_num }}</span>
        </div>
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
          
          <router-link to="/login" class="submenu-item block px-4 py-2 hover-underline-animation">Đăng nhập</router-link>
          <router-link to="/signup" class="submenu-item block px-4 py-2 hover-underline-animation">Đăng ký</router-link>
        </div>
      </div>
      <!-- Guest Page -->
      <!-- User Page -->
      <div v-if="auth.user_id" class="relative">
        <div @click="toggleMenu" class="user cursor-pointer flex items-center hover-animation">
          <span class=" capitalize">{{ greeting }}, {{ useUserStore().first_name }} </span>
          <span class="ml-2 mr-1">
            <img :src="useUserStore().image" class="img-responsive" alt="Image Description">
          </span>
          <span class="arrow-icon" :class="{ 'rotate-180': showMenu }">
            <img src="../assets/arr.svg" class="w-3" alt="Arrow Icon">
          </span>
        </div>
        <div v-show="showMenu">
          <div class="submenu absolute top-10 right-0.5 text-white pt-1 w-48">
            <router-link v-if="useUserStore().role !=='ROLE_ADMIN'  && useUserStore().role !=='ROLE_STAFF' " to="/setting/profile" 
            class="submenu-item block px-4 py-2 hover-underline-animation"
            >Cài đặt</router-link>
            <router-link to="/myself" 
            class="submenu-item block px-4 py-2 hover-underline-animation"
            v-if="useUserStore().role=='ROLE_SELLER' || useUserStore().role=='ROLE_USER'"
            >Quản lý trang cá nhân</router-link>
            <router-link v-if="useUserStore().staff_role === 'SHIPPER'" to="/forshipper" class="submenu-item block px-4 py-2 hover-underline-animation">Vận chuyển đơn hàng</router-link>
            <router-link to="/appraiser" 
            class="submenu-item block px-4 py-2 hover-underline-animation" v-if="useUserStore().role=='ROLE_STAFF' && useUserStore().staff_role=='APPRAISER'"
            >Kiểm Duyệt</router-link>
            <!-- <router-link to="/voucher" 
            class="submenu-item block px-4 py-2 hover-underline-animation" v-if="useUserStore().role=='ROLE_STAFF' && useUserStore().staff_role=='APPRAISER'"
            >Khuyến mãi</router-link> -->
            <router-link to="/admin" 
            class="submenu-item block px-4 py-2 hover-underline-animation" v-if="useUserStore().role=='ROLE_ADMIN'"
            >Quản trị</router-link>
            <a
              @click="logout"
              class="submenu-item block px-4 py-2 cursor-pointer hover-underline-animation"
              >Đăng xuất</a
            >
          </div>
        </div>
        
      </div>
      <!-- User Page -->
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";
import SideBar from "./MenuBar.vue";
import { useRoute } from "vue-router";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import { onMounted } from "vue";
import { useCartStore } from "../stores/cart";
import { useWatchStore } from "../stores/watch";
import { useChatStore } from "../stores/chat";
import PopUp from "./PopUp.vue"


const authStore = useAuthStore();
const cartStore = useCartStore();
const watchStore = useWatchStore();
const userStore = useUserStore();
const cartItems = ref([])
const searchQuery = ref("");
const showHint = ref(false);
const hovered = ref(false);
const router = useRouter();
const showMenu = ref(false);
const greeting = ref("");
const auth = useAuthStore();
const route = useRoute();
const submenus = ref({
  setting: false,
  logout: false,
  style: false,
  collection: false,
  // Add other submenus as needed
});
const showPopup = ref(false);
const checkRole = ref(false)





const handleUploadClick = (event) => {
  if (!userStore.isVerify) {
    event.preventDefault();
    showPopup.value = true;
  }
};

const logout = () => {
   useAuthStore().logout().then(
    window.location.replace('/')
  )
};

document.addEventListener("click", (e) => {
  if (!e.target.closest(".user") && !e.target.closest(".dropdown-menu")) {
    showMenu.value = false;
  }
});

const search = async () => {
  if (searchQuery.value.trim()) {
    try {
      await watchStore.searchWatches(searchQuery.value);
      window.location.replace(`/search?q=${searchQuery.value}`);
      showHint.value = false;
    } catch (error) {
      console.error("Error during search:", error);
    }
  }
};
const updateHint = () => {
  showHint.value = true;
};

const navigateToSearchResult = () => {
  if (searchQuery.value.trim()) {
    window.location.replace(`/search?q=${searchQuery.value}`);
    showHint.value = false;
  }
};

document.addEventListener("click", (e) => {
  if (!e.target.closest(".ui-input-container")) {
    showHint.value = false;
  }
});

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const showSubmenu = (menu) => {
  submenus.value[menu] = true;
};

const hideSubmenu = (menu) => {
  submenus.value[menu] = false;
};

function setGreeting() {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 0 && hour < 5) {
    greeting.value = "Chào buổi tối";
  } else if (hour >= 5 && hour < 12) {
    greeting.value = "Chào buổi sáng";
  } else if (hour >= 12 && hour < 18) {
    greeting.value = "Chào buổi chiều";
  } else{
    greeting.value = "Chào buổi tối";
  }
}


onMounted(async () => {
  try {
    
    setGreeting();
    if (authStore.user_id) {
    await cartStore.getCart(authStore.user_id);
    userStore.setCartNum(cartStore.cart_count);
  }
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
});

watch(() => authStore.user_id, async (newUserId) => {
  if (newUserId) {
    await cartStore.getCart(newUserId);
    userStore.setCartNum(cartStore.cart_count);
  } else {
    userStore.setCartNum(0);
  }
});
</script>

<style scoped>
.avatar {
  border: var(--primary) solid 2px;
}

textarea:focus,
.logo {
  width: 50%;
  max-width: 40px;
  height: 50%;
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
  height: 35px;
}

.newmessnoti {
  animation: blink 1s infinite; /* Áp dụng animation chớp chớp */
}

/* Định nghĩa keyframes cho hiệu ứng chớp chớp */
@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
