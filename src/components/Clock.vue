<template>
    <div class="clock">
      <div class="clock__second"></div>
      <div class="clock__minute"></div>
      <div class="clock__hour"></div>
      <div class="clock__axis"></div>
      <section class="clock__indicator" v-for="n in 60" :key="n" :style="getIndicatorStyle(n)"></section>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  // Function to get the number of seconds passed today
  function getSecondsToday() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diff = now.getTime() - today.getTime(); // Use getTime() to get the timestamp difference
    return Math.round(diff / 1000);
  }
  
  // Function to set the time for the clock hands
  function setTime(element, left) {
    if (element) {
      element.style.animationDelay = `${left * -1}s`;
    }
  }
  
  const secondsToday = ref(getSecondsToday());
  
  onMounted(() => {
    const secondElement = document.querySelector('.clock__second');
    const minuteElement = document.querySelector('.clock__minute');
    const hourElement = document.querySelector('.clock__hour');
  
    const seconds = (secondsToday.value / 60) % 1;
    const minutes = (secondsToday.value / 3600) % 1;
    const hours = (secondsToday.value / 43200) % 1;
  
    setTime(secondElement, 60 * seconds);
    setTime(minuteElement, 3600 * minutes);
    setTime(hourElement, 43200 * hours);
  });
  
  // Function to calculate the transform for indicators
  function getIndicatorStyle(n) {
    return {
      transform: `rotateZ(${6 * n}deg)`
    };
  }
  </script>
  
  <style scoped>
  html, body {
    height: 100%;
  }
  
  body {
    background: #1b1e23;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: sans-serif;
    color: white;
  }
  
  .clock {
    height: 200px;
    width: 200px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    position: relative;
  }
  
  .clock__second,
  .clock__minute,
  .clock__hour,
  .clock__indicator {
    position: absolute;
    left: calc(50% - 1px);
    width: 2px;
    background: #f4eed7;
    transform-origin: bottom center;
    z-index: 2;
    border-radius: 1px;
  }
  
  .clock__second {
    height: 90px;
    margin-top: 10px;
    background: var(--primary);
    animation: time 60s infinite steps(60);
    z-index: 3;
  }
  
  .clock__minute {
    height: 80px;
    margin-top: 20px;
    opacity: 0.75;
    animation: time 3600s linear infinite;
  }
  
  .clock__hour {
    height: 60px;
    margin-top: 40px;
    animation: time 43200s linear infinite;
  }
  
  .clock__indicator {
    height: 98px;
    border-top: 2px solid var(--primary);
    background: none;
  }
  
  .clock__indicator:nth-of-type(5n) {
    opacity: 1;
    height: 93px;
    border-top: 7px solid #f4eed7;
  }
  
  .clock__axis {
    background: var(--primary);
    width: 5px;
    height: 5px;
    border-radius: 50%;
    position: absolute;
    z-index: 4;
    top: 97px;
  }
  
  @keyframes time {
    to {
      transform: rotateZ(360deg);
    }
  }
  </style>
  