<template>
    <div class="slider">
      <div class="slide-track">
        <div class="slide">
          <img src="../assets/rolex.png" alt="" />
        </div>
        <div class="slide">
          <img src="../assets/TagHeuer.png" alt="" />
        </div>
        <div class="slide">
          <img src="../assets/casio.png" alt="" />
        </div>
        <div class="slide">
          <img src="../assets/hublot.png" alt="" />
        </div>
        <div class="slide">
          <img src="../assets/seiko.png" alt="" />
        </div>
        <div class="slide">
          <img src="../assets/cartier.png" alt="" />
        </div>
        <div class="slide">
          <img src="../assets/iwc.png" alt="" />
        </div>
        <div class="slide">
          <img src="../assets/patek.png" alt="" />
        </div>
  
        <!-- Duplicate the slides for infinite looping -->
        <div class="slide">
          <img src="../assets/rolex.png" alt="" />
        </div>
        <div class="slide">
          <img src="../assets/TagHeuer.png" alt="" />
        </div>
        <div class="slide">
          <img src="../assets/casio.png" alt="" />
        </div>
        <div class="slide">
          <img src="../assets/hublot.png" alt="" />
        </div>
        <div class="slide">
          <img src="../assets/seiko.png" alt="" />
        </div>
        <div class="slide">
          <img src="../assets/cartier.png" alt="" />
        </div>
        <div class="slide">
          <img src="../assets/iwc.png" alt="" />
        </div>
        <div class="slide">
          <img src="../assets/patek.png" alt="" />
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .slider {
    height: 150px;
    margin: auto;
    position: relative;
    width: 90%;
    display: grid;
    place-items: center;
    overflow: hidden; /* Add this line to hide overflow */
  }
  
  .slide-track {
    display: flex;
    width: calc(250px * 16); /* Adjust the width based on the number of slides */
    animation: scroll 20s linear infinite;
  }
  
  .slide {
    height: 50px;
    width: 250px;
    display: flex;
    align-items: center;
    padding: 45px;
    perspective: 150px;
    opacity: 0.5;
  }
  
  .slide:hover{
    opacity: 1;
  }
  img:hover {
    transform: translateZ(20px);
  }
  
  img {
    width: 100%;
    transition: transform 0.4s;
  }
  
  .slide-track:hover {
    animation-play-state: paused;
  }
  
  .slider::before,
  .slider::after {
    content: '';
    height: 100%;
    position: absolute;
    width: 15%;
    z-index: 2;
  }
  
  .slider::before {
    left: 0;
    top: 0;
  }
  
  .slider::after {
    right: 0;
    top: 0;
    transform: rotateZ(180deg);
  }
  
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-250px * 8)); /* Adjust the scroll distance based on the number of slides */
    }
  }
  </style>