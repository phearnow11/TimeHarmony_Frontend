<template>
  <div id="app" class="relative">
    <!-- Menu Button -->
    <div @click="toggleMenu" class="menu-container">
      <div class="menu-button">
        <div class="line"></div>
        <div class="line middle"></div>
        <div class="line"></div>
      </div>
      <span class="menu-label">Menu</span>
    </div>

    <!-- Dropdown Menu -->
    <div v-show="showMenu" class="dropdown-menu py-2 top-12 absolute z-10 w-48">
      <!-- Men -->
      <div class="menu-item relative" @mouseenter="showSubmenu('menWatch')" @mouseleave="hideSubmenu('menWatch')">
        <div class="flex items-center justify-between hover-underline-animation w-full px-4 py-2">
          <span>Men Watch</span>
        </div>
      </div>
      <!-- Women -->
      <div class="menu-item relative" @mouseenter="showSubmenu('womenWatch')" @mouseleave="hideSubmenu('womenWatch')">
        <div class="flex items-center justify-between hover-underline-animation w-full px-4 py-2">
          <span>Women Watch</span>
        </div>
      </div>
      <!-- Style -->
      <div class="menu-item relative" @mouseenter="showSubmenu('style')" @mouseleave="hideSubmenu('style')">
        <div :class="{'hover-active': submenus.style}" class="flex items-center justify-between hover-underline-animation w-full px-4 py-2">
          <span>Watch Style</span>
          <img src="../assets/arr.svg" class="w-3 arrow-icon" alt="Arrow Icon">
        </div>
        <div v-show="submenus.style" class="submenu absolute left-full top-0 text-white w-44">
          <a href="#" class="submenu-item block px-4 py-2 hover-underline-animation">Dress Watches</a>
          <a href="#" class="submenu-item block px-4 py-2 hover-underline-animation">Sport Watches</a>
          <a href="#" class="submenu-item block px-4 py-2 hover-underline-animation">Diver Watches</a>
          <a href="#" class="submenu-item block px-4 py-2 hover-underline-animation">Pilot Watches</a>
          <a href="#" class="submenu-item block px-4 py-2 hover-underline-animation">Field Watches</a>
          <a href="#" class="submenu-item block px-4 py-2 hover-underline-animation">Fashion Watches</a>
          <a href="#" class="submenu-item block px-4 py-2 hover-underline-animation">Smart Watches</a>
          <a href="#" class="submenu-item block px-4 py-2 hover-underline-animation">Luxury Watches</a>
        </div>
      </div>
      <!-- Collection -->
      <div class="menu-item relative" @mouseenter="showSubmenu('collection')" @mouseleave="hideSubmenu('collection')">
        <div :class="{'hover-active': submenus.collection}" class="flex items-center justify-between hover-underline-animation w-full px-4 py-2">
          <span>Collection</span>
          <img src="../assets/arr.svg" class="w-3 arrow-icon" alt="Arrow Icon">
        </div>
        <div v-show="submenus.collection" class="submenu absolute left-full top-0 text-white pt-1 w-48">
          <a href="#" class="submenu-item block px-4 py-2 hover-underline-animation">Starter Collection</a>
          <a href="#" class="submenu-item block px-4 py-2 hover-underline-animation">Intermediate Collection</a>
          <a href="#" class="submenu-item block px-4 py-2 hover-underline-animation">Advanced Collection</a>
          <a href="#" class="submenu-item block px-4 py-2 hover-underline-animation">Specialized Collection</a>
        </div>
      </div>
      <!-- END  -->
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
  // Add other submenus as needed
});

function toggleMenu() {
  showMenu.value = !showMenu.value;
}

function showSubmenu(menu) {
  submenus.value[menu] = true;
}

function hideSubmenu(menu) {
  submenus.value[menu] = false;
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.menu-container') && !e.target.closest('.dropdown-menu')) {
    showMenu.value = false;
  }
});
</script>

<style scoped>
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
  box-shadow: rgba(153, 153, 153, 0.685) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
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
