<template>
    <form @submit.prevent="loginHandle">
      <div>
          <label>Username:</label>
          <input type="text" v-model="username" required><br>
          <label>Password:</label>
          <input type="password" v-model="password" required><br>
          <button type="submit">Login</button><br>
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
  import router from '../router'
  import {useUserStore} from '../stores/user'
  const res = ref('')
  const username = ref('')
  const password = ref('')
  const remember = ref(0)
  const user = useUserStore()
  
  function loginHandle() {
    axios.get(`http://localhost:8080/user/login?username=${username.value}&password=${password.value}`)
      .then(function (response) {
        res.value = response.data
        if (response.data.user_id == null) { //Can not find user
          console.log(`Wrong username or password.`);
        }
        else {
          console.log(response.data)
          user.user_id = response.data.user_id
          user.username = response.data.username
          user.password = response.data.password
          user.email = response.data.email
          router.push(`/`)
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  </script>