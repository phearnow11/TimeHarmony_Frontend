<template>
  <div class="flex items-center justify-center min-h-screen">
    <form @submit.prevent="signupHandle">
      <div class="flex flex-col items-center space-y-5">
        <div class="form__group field w-96">
          <input
            type="email"
            class="form__field"
            placeholder="Email"
            v-model="email"
            required
          />
          <label for="email" class="form__label">Email</label>
        </div>

        <div class="form__group field w-96">
          <input
            type="text"
            class="form__field"
            placeholder="Username"
            v-model="username"
            required
          />
          <label for="username" class="form__label">Username</label>
        </div>

        <div class="form__group field w-96">
          <input
            type="password"
            class="form__field"
            placeholder="Password"
            v-model="password"
            required
          />
          <label for="password" class="form__label">Password</label>
        </div>

        <div class="form__group field w-96">
          <input
            type="password"
            class="form__field"
            placeholder="Password"
            v-model="repassword"
            required
          />
          <label for="repassword" class="form__label">Confirm password</label>
        </div>

        <div class="flex space-x-4 w-96">
          <div class="form__group w-1/2">
            <input
              type="text"
              class="form__field"
              placeholder="Firstname"
              v-model="firstname"
              required
            />
            <label for="firstname" class="form__label">First Name</label>
          </div>
          <div class="form__group w-1/2">
            <input
              type="text"
              class="form__field"
              placeholder="Lastname"
              v-model="lastname"
              required
            />
            <label for="lastname" class="form__label">Last Name</label>
          </div>
        </div>

        <div class="form__group field w-96">
          <input
            type="text"
            class="form__field"
            placeholder="Phone"
            v-model="phone"
            required
          />
          <label for="phone" class="form__label">Phone</label>
        </div>

        <div class="form__group field w-96">
          <input
            type="text"
            class="form__field"
            placeholder="Address"
            v-model="address"
            required
          />
          <label for="address" class="form__label">Address</label>
        </div>

        <button type="submit" class="w-full th-p-btn">Sign up</button>

        <div>
          <span>Already have an account? </span>
          <router-link to="/login" class="hover-underline-animation"
            >Log in here</router-link
          >
        </div>
      </div>
    </form>
  </div>
</template>


<script setup>
import { ref } from "vue";
import axios from "axios";

const email = ref("");
const username = ref("");
const password = ref("");
const repassword = ref("");
const firstname = ref("");
const lastname = ref("");
const phone = ref("");
const address = ref("");

function signupHandle() {
  axios
    .post("http://localhost:8080/user/register", {
      email: email.value,
      username: username.value,
      password: password.value,
      firstname: firstname.value,
      lastname: lastname.value,
      phone: phone.value,
      address: address.value,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}
</script>
