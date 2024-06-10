<template>
  <div class="relative overflow-hidden w-full h-64" style="background-color: rgb(30, 30, 30)">
    <!-- Slides -->
    <div class="relative w-full h-full">
      <div v-for="(slide, index) in slides" :key="index" :class="['absolute w-full h-full transition-opacity duration-1000 ease-in-out', { 'opacity-100': index === currentIndex, 'opacity-0': index !== currentIndex }]" @mouseover="stopAutoplay" @mouseleave="startAutoplay">
        <img :src="slide" alt="Slide Image" class="w-full h-full object-cover" />
      </div>
    </div>

    <!-- Navigation Buttons -->
     <div class="">
      <button @click="prevSlide" class="gradient-left-button absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600 w-8 h-8 flex items-center justify-center">
      <img src="../assets/arr.svg" class="colored-img w-5 rotate-180" alt="" />
    </button>
    
    <button @click="nextSlide" class="gradient-right-button absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-600 rounded w-8 h-8 flex items-center justify-center">
      <img src="../assets/arr.svg" class="colored-img w-5" alt="" />
    </button>
  </div>

    <!-- Navigation Dots -->
    <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
      <div v-for="(slide, index) in slides" :key="index" :class="{
        'bg-primary': index === currentIndex,
        'border-primary': index === currentIndex,
        'bg-black-99': index !== currentIndex,
        'border-secondary': index !== currentIndex
      }" class="w-7 h-1 cursor-pointer flex items-center justify-center dot" @click="goToSlide(index)"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import timeHarmony from '../assets/c4.png';
import anotherImage from '../assets/c5.png';
import thirdImage from '../assets/c6.png';

const slides = [
  timeHarmony,
  anotherImage,
  thirdImage
];

const currentIndex = ref(0);
let interval = null;

const startAutoplay = () => {
  interval = setInterval(nextSlide, 4000);
};

const stopAutoplay = () => {
  clearInterval(interval);
};

const nextSlide = () => {
  if (currentIndex.value === slides.length - 1) {
    currentIndex.value = 0;
  } else {
    currentIndex.value += 1;
  }
};

const prevSlide = () => {
  if (currentIndex.value === 0) {
    currentIndex.value = slides.length - 1;
  } else {
    currentIndex.value -= 1;
  }
};

const goToSlide = (index) => {
  currentIndex.value = index;
};

onMounted(() => {
  startAutoplay();
});

onBeforeUnmount(() => {
  stopAutoplay();
});
</script>

<style scoped>
.dot {
  border: 0.5px solid;
}

.carousel {
  position: relative;
  overflow: hidden;
}
.carousel img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the image covers the container */
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

@media (min-width: 640px) {
  .carousel {
    height: 50vh;
  }
}

@media (min-width: 1024px) {
  .carousel {
    height: 60vh;
  }
}

/* Transition styles */
.transition-opacity {
  transition: opacity 1s ease-in-out;
}

.gradient-left-button{
  background-image: linear-gradient(to left, transparent, rgba(0, 0, 0, 0.633));
  width: auto;
  height: 100%;
  padding-left: 40px;
}
.gradient-right-button{
  background-image: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.633));
  width: auto;
  height: 100%;
  padding-right: 40px;
}
</style>
