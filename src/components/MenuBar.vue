<template>
  <div id="app" class="relative">
    <div class="menu-wrapper" @mouseenter="showMenu = true" @mouseleave="showMenu = false">
      <!-- Menu Button -->
      <div class="menu-container">
        <div class="menu-button">
          <div class="line"></div>
          <div class="line middle"></div>
          <div class="line"></div>
        </div>
        <span class="menu-label">Danh mục</span>
      </div>

    <!-- Dropdown Menu -->
    <div v-show="showMenu" class="dropdown-menu top-12 absolute z-10 w-48">
      <!-- Men -->
      <div class="menu-item relative" @mouseenter="showSubmenu('menWatch')" @mouseleave="hideSubmenu('menWatch')">
        <a href="/discover/Đồng hồ nam?page=0&gender=male" class="flex items-center justify-between hover-underline-animation w-full px-4 py-2">
          <span>Đồng hồ nam</span>
        </a>
      </div>
      <!-- Women -->
      <div class="menu-item relative" @mouseenter="showSubmenu('womenWatch')" @mouseleave="hideSubmenu('womenWatch')">
        <a href="/discover/Đồng hồ nữ?page=0&gender=female" class="flex items-center justify-between hover-underline-animation w-full px-4 py-2">
          <span>Đồng hồ nữ</span>
        </a>
      </div>
      <!-- Unisex -->
      <div class="menu-item relative" @mouseenter="showSubmenu('womenWatch')" @mouseleave="hideSubmenu('womenWatch')">
        <a href="/discover/Đồng hồ phi giới?page=0&gender=unisex" class="flex items-center justify-between hover-underline-animation w-full px-4 py-2">
          <span>Đồng hồ phi giới</span>
        </a>
      </div>
      <!-- Style -->
      <!-- Collection -->
      <!-- END  -->
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const showMenu = ref(false);
const submenus = ref({
  menWatch: false,
  womenWatch: false,
  style: false,
  collection: false
});

function showSubmenu(menu) {
  submenus.value[menu] = true;
}

function hideSubmenu(menu) {
  submenus.value[menu] = false;
}
</script>

<style scoped>
.menu-wrapper {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
}

.menu-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
}

.menu-button {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 25px;
  height: 24px;
  transition: all 0.3s ease;
}

.menu-container:hover .menu-button .middle {
  width: 150%;
}

.menu-container:hover .menu-label {
  margin-left: 20px;
}

.line {
  width: 100%;
  height: 2px;
  background-color: var(--primary);
  transition: width 0.3s ease;
}

.menu-label {
  font-size: 16px;
  margin-left: 5px;
  transition: margin-left 0.3s ease;
}

.dropdown-menu {
  background-color: rgba(20, 20, 20, 0.95); /* Increased opacity */
  backdrop-filter: blur(30px); /* Increased blur */
  -webkit-backdrop-filter: blur(30px); /* Increased blur */
}

.menu-item {
  position: relative;
}

.menu-item > a {
  display: block;
  text-decoration: none;
  width: 100%;
  padding: 10px;
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

.hover-underline-animation {
  position: relative;
  text-decoration: none;
  color: var(--wait);
}

.hover-underline-animation::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  display: block;
  margin: 0 auto;
  background: #FFBD59;
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
  transition: transform 0.4s ease-in-out;
  transform: rotate(90deg);
}

.menu-item:hover .arrow-icon {
  transform: rotate(0deg);
}
</style>
