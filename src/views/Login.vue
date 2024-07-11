<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="login-container flex gap-8 items-center">
      <div class="logo-container flex flex-col items-center">
        <router-link to="/">
          <img src="../assets/time-harmony.png" class="logo w-60" />
        </router-link>
        <span class="login-text">- Đăng nhập -</span>
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
            <label for="username" class="form__label">Tên tài khoản</label>
          </div>
          <div class="form__group field w-96">
            <input
              type="password"
              class="form__field"
              placeholder="Password"
              v-model="user.password"
              required
            />
            <label for="password" class="form__label">Mật khẩu</label>
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
            <label>Ghi nhớ tôi</label>
          </label>
          <div class="flex justify-end">
            <router-link to="/forgot" class="hover-underline-animation"
              >Quên mật khẩu?</router-link
            >
          </div>
        </div>
        <div class="flex justify-center items-center w-full relative">
          <button class="th-p-btn w-96 relative" :disabled="isLoading">
            <span :class="{ 'opacity-0': isLoading }">Đăng nhập</span>
            <div v-if="isLoading" class="loader-container">
              <div class="loader">
                <div class="loaderBar"></div>
              </div>
            </div>
          </button>
        </div>
        <div class="flex items-center w-full my-4">
          <div class="border-t border-gray-99 flex-grow mr-3"></div>
          <span class="text-gray-99">hoặc</span>
          <div class="border-t border-gray-99 flex-grow ml-3"></div>
        </div>
        <login-via-google />
        <login-via-facebook />
        <div>
          <span>Bạn chưa có tài khoản? </span>
          <router-link to="/signup" class="hover-underline-animation"
            >Đăng kí tại đây</router-link
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "../stores/auth";
import LoginViaGoogle from "../components/LoginViaGoogle.vue";
import LoginViaFacebook from "../components/LoginViaFacebook.vue";

const isLoading = ref(false);

const user = reactive({
  username: "",
  password: "",
});

const remember = ref(false);

async function onSubmit() {
  const authStore = useAuthStore();
  if (user.username && user.password) {
    isLoading.value = true;
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate login delay
      await authStore.login(user.username, user.password, remember.value);
    } finally {
      isLoading.value = false;
    }
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
/* Optional: Add margin to move the form slightly to the right */
form {
  margin-left: 20rem; /* Adjust the value as needed */
}

.loader-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  background: rgba(
    23,
    23,
    23,
    0.5
  ); /* Adjust the alpha value for transparency */
}

.loader {
  width: 80px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  position: relative;
  padding: 1px;
}

.loader .loaderBar {
  position: absolute;
  top: 0;
  right: 100%;
  bottom: 0;
  left: 0;
  background: var(--secondary);
  width: 0;
  animation: borealisBar 2s linear infinite;
}



.loader::after {
  content: "";
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border: 2px solid var(--secondary);
  left: 0;
  top: 0;
  animation: rotation 2s ease-in-out infinite alternate;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
