<template>
  <div class="flex justify-center items-center thisForm">
    <form @submit.prevent="loginHandle">
      <div>
        <div class="form__group field">
          <input type="password" class="form__field" placeholder="Name" />
          <label for="name" class="form__label">Username</label>
        </div>
        <div class="form__group field">
          <input type="password" class="form__field" placeholder="Name" />
          <label for="name" class="form__label">Password</label>
        </div>
        <br />
        <button type="submit" class="th-p-btn">Login</button><br />
      </div>
      <div>

          <label class="container flex items-center text-center gap-1">
            <input type="checkbox" />
            <svg viewBox="0 0 64 64" height="1em" width="1em">
              <path
                d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                pathLength="575.0541381835938"
                class="path"
              ></path>
            </svg>
            <label>Remember me</label>
          </label>

        <router-link to="/forgot" class="hover-underline-animation"
          >Forgot password?</router-link
        >
      </div>
      <div>
        <span>Don't have an account? </span
        ><router-link to="/signup" class="hover-underline-animation"
          >Sign up here</router-link
        >
      </div>
    </form>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import router from "../router";
import { useUserStore } from "../stores/user";
const username = ref("");
const password = ref("");
const remember = ref(0);
const user = useUserStore();

function loginHandle() {
  axios
    .get(
      `http://localhost:8080/user/login?username=${username.value}&password=${password.value}`
    )
    .then(function (response) {
      if (response.data.user_id == null) {
        //Can not find user
        console.log(`Wrong username or password.`);
      } else {
        console.log(response.data);
        user.user_id = response.data.user_id;
        user.username = response.data.username;
        user.password = response.data.password;
        user.email = response.data.email;
        router.push(`/`);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
</script>

<style scoped>
.thisForm{
  height: 70vh;
}
</style>
