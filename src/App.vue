<script setup>
  import NavBar from './components/NavBar.vue';
  import Footer from './components/Footer.vue';
</script>

<template>
  <div class="app-container">
    <NavBar/>
    <main class="main-content">
      <router-view/>
    </main>
    <Footer/>
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
</style>
