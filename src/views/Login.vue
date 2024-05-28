<template>
  <div class="flex justify-center items-center thisForm">
    <form
      @submit.prevent="onSubmit"
      class="flex w-96 flex-col justify-center items-center gap-4"
    >
      <div class="from-content">
        <div class="form__group field w-96">
          <input
            type="text"
            class="form__field"
            placeholder="Username"
            v-model="user.username"
            required
          />
          <label for="username" class="form__label">Username</label>
        </div>
        <div class="form__group field w-96">
          <input
            type="password"
            class="form__field"
            placeholder="Password"
            v-model="user.password"
            required
          />
          <label for="password" class="form__label">Password</label>
        </div>
        <br />
      </div>

      <div class="row-remember w-96 grid grid-cols-2 gap-4">
        <label
          class="container flex justify-start items-center text-center gap-2"
        >
          <input type="checkbox" v-model="remember"/>
          <svg viewBox="0 0 64 64" height="1em">
            <path
              d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
              pathLength="575.0541381835938"
              class="path"
            ></path>
          </svg>
          <label>Remember me</label>
        </label>
        <div class="flex justify-end">
          <router-link to="/forgot" class="hover-underline-animation"
            >Forgot password?</router-link
          >
        </div>
      </div>
      <div class="flex justify-center items-center w-full">
        <button class="th-p-btn w-96">Login</button>
      </div>
      <div>or</div>
      <login-via-google/>
      <login-via-facebook/>
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
import { reactive, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import LoginViaGoogle from '../components/LoginViaGoogle.vue';
import LoginViaFacebook from '../components/LoginViaFacebook.vue';

const user = reactive({
  username: '',
  password: '',
});

const remember = ref(false);

function onSubmit() {
  if (user.username && user.password) {
    useAuthStore().login(user.username, user.password);
  }
}
</script>

<style scoped>
.thisForm {
  height: 70vh;
}
</style>
