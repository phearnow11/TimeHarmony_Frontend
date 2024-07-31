<template>
  <transition name="slide-in-out">
    <div v-if="show" class="fixed inset-0 flex items-end justify-end z-50">
      <div v-if="showDetails" class="color p-6 z-10 max-w-md w-full shadow-lg m-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">{{ message }}</h2>
          <button @click="closePopup" class="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <div  class="flex items-center mb-4">
          <img :src="product.image" alt="Product Image" class="w-16 h-16 object-cover mr-4">
          <div>
            <h3 class="text-lg">{{ product.name }}</h3>
            <p class="text-[whitesmoke]">{{ formatPriceVND(product.price) }}</p>
          </div>
        </div>
        <div class="flex justify-end gap-4">
          <button @click="closePopup" class="border-2 border-secondary py-2 px-4">Tiếp tục</button>
          <router-link to="/cart" class="th-p-btn py-2 px-4">Xem giỏ hàng</router-link>
        </div>
        <div class="relative mt-4 h-1 bg-black-99">
          <div :style="{ width: `${progress}%` }" class="absolute top-0 left-0 h-full bg-secondary"></div>
        </div>
      </div>
      <div v-else class="color p-6 z-10 max-w-md w-full shadow-lg m-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">{{ message }}</h2>
          <button @click="closePopup" class="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <div class="flex justify-end gap-4">
          <button @click="closePopup" class="border-2 border-secondary py-2 px-4">Tiếp tục</button>
        </div>
        <div class="relative mt-4 h-1 bg-black-99">
          <div :style="{ width: `${progress}%` }" class="absolute top-0 left-0 h-full bg-secondary"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  product: Object,
  message: String,
  showDetails: Boolean,
});

const emit = defineEmits(['close']);

const progress = ref(0);

const closePopup = () => {
  emit('close');
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    progress.value = 0;
    let interval = setInterval(() => {
      if (progress.value < 100) {
        progress.value += 1;
      } else {
        clearInterval(interval);
        closePopup();
      }
    }, 50);
  }
});

const formatPriceVND = (price) => {
  const formattedPrice = (price / 1).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
  return formattedPrice;
};
</script>

<style scoped>
.color{
  background-color: hsla(200, 100%, 0%,.4);
  backdrop-filter: blur(10px);
}

.slide-in-out-enter-active, .slide-in-out-leave-active {
  transition: transform 0.5s ease-in-out;
}
.slide-in-out-enter-from, .slide-in-out-leave-to {
  transform: translateX(100%);
}
.slide-in-out-enter-to, .slide-in-out-leave-from {
  transform: translateX(0);
}
</style>