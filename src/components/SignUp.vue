<template>
  <form @submit.prevent="signupHandle">
    <div>
      <label>Email:</label>
      <input type="email" v-model="email" required><br>
      <label>Username:</label>
      <input type="text" v-model="username" required><br>
      <label>Password:</label>
      <input type="password" v-model="password" required><br>
      <label>Confirm password:</label>
      <input type="password" v-model="repassword" required><br>
      <label>First name:</label>
      <input type="text" v-model="firstname" required><br>
      <label>Last name:</label>
      <input type="text" v-model="lastname" required><br>
      <label>Phone:</label>
      <input type="tel" v-model="phone" required><br>
      <label>Address:</label>
      <input type="text" v-model="address" required><br>
      <button type="submit">Sign up</button><br>
    </div>
    <div>
      <span>Already have an account? </span><router-link to="/login">Log in here</router-link>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const username = ref('');
const password = ref('');
const repassword = ref('');
const firstname = ref('');
const lastname = ref('');
const phone = ref('');
const address = ref('');

function signupHandle() {
  axios.post('http://localhost:8080/user/register', {
    email: email.value,
    username: username.value,
    password: password.value,
    firstname: firstname.value,
    lastname: lastname.value,
    phone: phone.value,
    address: address.value,
  })
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });
}
</script>
