<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="login-container flex gap-8 items-center">
      <div class="logo-container flex flex-col items-center">
        <router-link to="/">
          <img src="../assets/time-harmony.png" class="logo" />
        </router-link>
        <span class="login-text">- Login -</span>
      </div>

      <form
        @submit.prevent="onSubmit"
        class="flex w-96 flex-col justify-center items-center gap-4"
      >
        <div class="form-content">
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
            <input type="checkbox" v-model="remember" />
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
        <div class="flex items-center w-full my-4">
          <div class="border-t border-gray-99 flex-grow mr-3"></div>
          <span>or</span>
          <div class="border-t border-gray-99 flex-grow ml-3"></div>
        </div>        
        <login-via-google />
        <login-via-facebook />
        <div>
          <span>Don't have an account? </span>
          <router-link to="/signup" class="hover-underline-animation"
            >Sign up here</router-link
          >
        </div>
      </form>
    </div>
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
  const authStore = useAuthStore();
  if (user.username && user.password) {
    authStore.login(user.username, user.password, remember.value);
  }
}
</script>

<style scoped>
/* Ensure the parent container takes the full height */
.thisForm {
  height: 100vh;
}

/* Add styles for the login container */
.login-container {
  display: flex;
  align-items: center;
  gap: 2rem; /* Adjust the gap between logo and form as needed */
}

/* Style the logo container */
.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Style the login text */
.login-text {
  color: var(--primary-color); /* Replace with your primary color variable */
  font-size: 1.5rem;
  margin-top: 0.5rem;
}

.logo{
  width: 200%;
}

/* Optional: Add margin to move the form slightly to the right */
form {
  margin-left: 20rem; /* Adjust the value as needed */
}
</style>
