<template>
    <div class="skeleton-container">
      <div class="skeleton-box">
        <div class="skeleton-image-border">
        <div class="skeleton-image"></div>
        <svg class="loader" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect class="loader-rect" x="0" y="0" width="100" height="100" />
        </svg>
      </div>
        <div class="skeleton-content">
          <div class="skeleton-name"></div>
          <div class="skeleton-retailer">
            <div class="skeleton-avatar"></div>
            <div class="skeleton-username"></div>
          </div>
          <div class="skeleton-price"></div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .skeleton-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1em;
  }
  
  .skeleton-box {
    max-width: 22em;
    width: 100%;
    height: 100%;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.074);
    border: 1px solid rgba(255, 255, 255, 0.222);
    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);
    transition: ease-in-out 0.1s;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    box-sizing: border-box;
  }
  

  
  .skeleton-content {
    display: flex;
    flex-direction: column;
  }
  
  .skeleton-name {
    width: 70%;
    height: 20px;
    background: #59595998;
    animation: pulse 1.5s infinite ease-in-out;
    margin-bottom: 0.5rem;
  }
  
  .skeleton-retailer {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .skeleton-avatar {
    width: 2vw;
    height: 2vw;
    background: #59595998;
    animation: pulse 1.5s infinite ease-in-out;
    margin-right: 1rem;
  }
  
  .skeleton-username {
    width: 50%;
    height: 20px;
    background: #59595998;
    animation: pulse 1.5s infinite ease-in-out;
  }
  
  .skeleton-price {
    width: 30%;
    height: 20px;
    background: #59595998;
    animation: pulse 1.5s infinite ease-in-out;
  }
  
  .skeleton-image-border {
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  position: relative;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skeleton-image {
  width: 100%;
  height: 100%;
  background: #59595998;
  animation: pulse 1.5s infinite ease-in-out;
}

.loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.loader-rect {
  fill: none;
  stroke: var(--secondary);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 50, 350; /* Changed this line */
  stroke-dashoffset: 0;
  animation: rectAnimate 3s linear infinite; /* Adjusted animation duration */
}

@keyframes rectAnimate {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -400;
  }
}
  
  @media screen and (max-width: 768px) {
    .skeleton-name,
    .skeleton-username,
    .skeleton-price {
      height: 3.5vw;
    }
    .skeleton-avatar {
      width: 6vw;
      height: 6vw;
    }
  }
  </style>
  