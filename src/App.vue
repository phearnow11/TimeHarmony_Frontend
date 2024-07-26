<script setup>
  import NavBar from './components/NavBar.vue';
  import Footer from './components/Footer.vue';
</script>

<template>
  <div class="app-container">
    <div id="global-notification"></div>
    <NavBar/>
    <main class="main-content">
      <router-view/>
      <Footer/>
    </main>
  </div>
</template>

<style scoped>
html, body, #app, .app-container {
  height: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

.app-container {
  min-height: 100vh; /* set a minimum height of 100% of the viewport height */
  display: flex;
  flex-direction: column;
}
</style>
