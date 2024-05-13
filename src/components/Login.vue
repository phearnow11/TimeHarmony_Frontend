<template>
    <form>
        <div>
            <label>Username:</label>
            <input type="text" v-model="username" required><br>
            <label>Password:</label>
            <input type="password" v-model="password" required><br>
            <button @click="loginHandle">Login</button><br>
        </div>
        <div>
            <input type="checkbox" v-model="remember">
            <label>Remember me</label>
            <router-link to="/forgot">Forgot password?</router-link>
        </div>
    </form>
    <!-- <p v-if="res">Hello {{ res.name }}!</p>
    <p v-if="res">You are {{ res.age }} year olds.</p> -->
  </template>
  
  <script setup>
  import axios from 'axios';
  import { ref } from 'vue'
  
  const res = ref('')
  const username = ref('')
  const password = ref('')
  const remember = ref(0)
  
  function loginHandle() {
    axios.get(``)
      .then(function (response) {
        res.value = response.data
        console.log(response.data)
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  </script>