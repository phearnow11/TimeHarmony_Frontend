<template>
 
  <div class="flex justify-center items-center h-screen">
    <div class="login-background pr-16 shadow-lg">
      <div class="login-container flex gap-8 items-center">
        <div class="logo-container flex flex-col items-center pr-5">
          <img src="../assets/test2.png" class="w-80 h-full" alt="" />
        </div>
        <form @submit.prevent="onSubmit" class="flex w-96 flex-col justify-center items-center gap-3">
          <div class="flex left-10 justify-center">
            <router-link to="/">
              <img class="h-20 flex items-center" src="../assets/time-harmony.png" alt="" />
            </router-link>
            <div class="border-l mr-5 border-primary"></div>
            <span class="font-bold mt-5 mr-5 text-3xl text-primary">Đăng nhập</span>
          </div>
          <div class="form-content">
            <div class="form__group field w-96">
              <input type="text" class="form__field" placeholder="Username" v-model="user.username" required />
              <label for="username" class="form__label">Tên tài khoản</label>
            </div>
            <div class="form__group field w-96">
              <input type="password" class="form__field" placeholder="Password" v-model="user.password" required />
              <label for="password" class="form__label">Mật khẩu</label>
            </div>
          </div>
          <div class="row-remember w-96 grid grid-cols-2 gap-4">
            <label class="container flex justify-start items-center text-center gap-2">
              <input type="checkbox" v-model="remember" />
              <svg viewBox="0 0 64 64" height="1em">
                <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" class="path"></path>
              </svg>
              <label>Ghi nhớ tôi</label>
            </label>
            <div class="flex justify-end">
              <router-link to="/forgot" class="hover-underline-animation">Quên mật khẩu?</router-link>
            </div>
          </div>
          <button class="th-p-btn w-full relative" :disabled="isLoading">
            <span :class="{ 'opacity-0': isLoading }">Đăng nhập</span>
            <div v-if="isLoading" class="loader-container">
              <div class="loader">
                <div class="loaderBar"></div>
              </div>
            </div>
          </button>
          <p v-if="message" class="text-red-500 mt-2">{{ message }}</p>
          <div class="flex items-center w-full my-2">
            <div class="border-t border-gray-99 flex-grow mr-3"></div>
            <span class="text-gray-99">hoặc</span>
            <div class="border-t border-gray-99 flex-grow ml-3"></div>
          </div>
          <LoginViaGoogle />
          <!-- <LoginViaFacebook /> -->
          <div class="mt-4">
            <span>Bạn chưa có tài khoản? </span>
            <router-link to="/signup" class="hover-underline-animation">Đăng ký tại đây</router-link>
          </div>
        </form>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { reactive, ref, toRaw, watch } from "vue";
import { useAuthStore } from "../stores/auth";
import LoginViaGoogle from "../components/LoginViaGoogle.vue";
import LoginViaFacebook from "../components/LoginViaFacebook.vue";
import PopUp from "../components/PopUp.vue";
import { useChatStore } from "../stores/chat";
import { useUserStore } from "../stores/user";

const errorMessage = ref('');
const showErrorPopup = ref(false);
const isLoading = ref(false);

const message = ref(null)

watch(message, (newValue) => {
  console.log('Message changed:', newValue);
});

const user = reactive({
  username: localStorage.getItem('username') || '',
  password: localStorage.getItem('password') || '',
});

const remember = ref(false);

if (localStorage.getItem('username') !== null) {
  remember.value = true;
}

async function onSubmit() {
  console.log('onSubmit called');
  message.value = '';
  console.log('Message cleared:', message.value);
  
  if (remember.value) {
    localStorage.setItem('username', user.username);
    localStorage.setItem('password', user.password);
  } else {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
  }

  const authStore = useAuthStore();
  if (user.username && user.password) {
    isLoading.value = true;
    try {
      const ban = await useChatStore().findBanChat(user.username, import.meta.env.VITE_ADMIN_USERID);
      if (ban && ban.length > 0) {
        message.value = ban[0].text;
        console.log('Ban message set:', message.value);
        return;
      }

      console.log('Attempting login with:', { username: user.username, password: user.password });
      
      // Wrap the login call in a Promise to handle its asynchronous nature
      await new Promise((resolve, reject) => {
        authStore.login(user.username, user.password);
        
        // Set up a timeout to check if login was successful
        const loginCheckInterval = setInterval(() => {
          if (authStore.user_id) {
            clearInterval(loginCheckInterval);
            resolve();
          }
        }, 100);

        // Set a timeout for login attempt
        setTimeout(() => {
          clearInterval(loginCheckInterval);
          reject(new Error('Login timed out'));
        }, 5000);
      });

      console.log('Login successful');
      message.value = '';
    } catch (error) {
      console.error('Login error:', error);
      message.value = 'Sai mật khẩu hoặc tên người dùng';
      console.log('Error message set:', message.value);
      showErrorPopup.value = true;
    } finally {
      isLoading.value = false;
      console.log('Final message value:', message.value);
    }
  }
}
</script>
<style scoped>
/* Ensure the parent container takes the full height */
.thisForm {
  height: 100vh;
}

.login-background {
  background-color: #6f6f6f22; /* Dark, semi-transparent background */
  backdrop-filter: blur(10px);
  box-shadow: 0px 0px 20px 1px #ffbb763f;
  border: 1px solid rgba(255, 255, 255, 0.454);
}

.login-text {
  color: var(--primary-color); /* Replace with your primary color variable */
  font-size: 1.5rem;
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
