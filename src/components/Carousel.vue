<template>
  <div class="relative overflow-hidden w-full h-64" style="background-color: rgb(30, 30, 30);">
    <!-- Slides -->
    <div
      class="flex transition-transform duration-700"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      @mouseover="stopAutoplay"
      @mouseleave="startAutoplay"
    >
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="w-full h-full flex-shrink-0 flex items-center justify-center text-primary text-2xl"
      >
        {{ slide.content }}
      </div>
    </div>

    <!-- Navigation Buttons -->
    <button @click="prevSlide" class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-600 rounded w-8 h-8 flex items-center justify-center">
      <img src="../assets/arr.svg" class="colored-img w-5 rotate-180" alt="">
    </button>
    <button @click="nextSlide" class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-600 rounded w-8 h-8 flex items-center justify-center">
      <img src="../assets/arr.svg" class="colored-img w-5" alt="">
    </button>

    <!-- Navigation Dots -->
    <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        :class="{
          'bg-primary': index === currentIndex,
          'border-primary': index === currentIndex,
          'bg-black-99': index !== currentIndex,
          'border-secondary': index !== currentIndex
        }"
        class="w-7 h-2 border-2 cursor-pointer flex items-center justify-center"
        @click="goToSlide(index)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const slides = [
  { content: 'Time harmony' },
  { content: 'Best Vietnam shop' },
  { content: 'Your best place for buying and selling watches' }
];

const currentIndex = ref(0);
let interval = null;

const startAutoplay = () => {
  interval = setInterval(nextSlide, 6000);
};

const stopAutoplay = () => {
  clearInterval(interval);
};

const nextSlide = () => {
  if (currentIndex.value === slides.length - 1) {
    currentIndex.value = 0;
  } else {
    currentIndex.value++;
  }
};

const prevSlide = () => {
  if (currentIndex.value === 0) {
    currentIndex.value = slides.length - 1;
  } else {
    currentIndex.value--;
  }
};

const goToSlide = (index) => {
  currentIndex.value = index;
};

onMounted(() => {
  startAutoplay();
});

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<style scoped>
.carousel {
  position: relative;
  overflow: hidden;
}
.carousel img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

button {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  padding: 0;
  cursor: pointer;
}
button:focus {
  outline: none;
}
</style>