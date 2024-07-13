<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="login-background pr-16 shadow-lg">
      <div class="login-container flex gap-8 items-center">
        <div class="logo-container flex flex-col items-center pr-5">
          <img src="../assets/test.jpg" class="w-80 h-full" alt="" />
        </div>
      
      <form
      @submit.prevent="signupHandle"
      class="flex w-96 flex-col justify-center items-center gap-3"
      >
      <div class="flex left-10 justify-center">
      <router-link to="/">
        <img
          class="h-20 flex items-center"
          src="../assets/time-harmony.png"
          alt=""
        />
      </router-link>
      <div class="border-l mr-5 border-primary"></div>
      <span class="font-bold mt-5 mr-9 text-3xl text-primary">
        Đăng ký
      </span>
      
    </div>
        <div class="form__group field w-96">
          <input
            type="email"
            class="form__field"
            placeholder="Email"
            v-model="signUpForm.email"
            required
          />
          <label for="email" class="form__label">Email*</label>
        </div>

        <div class="form__group field w-96">
          <input
            type="text"
            class="form__field"
            placeholder="Username"
            v-model="signUpForm.username"
            required
          />
          <label for="username" class="form__label">Tên tài khoản*</label>
        </div>

        <div :class="['form__group', 'field', 'w-96', {'input-error': !isPasswordValid && signUpForm.password !== ''}]">
          <input
            type="password"
            class="form__field"
            placeholder="Password"
            v-model="signUpForm.password"
            @input="checkPasswordFormat"
            required
          />
          <label for="password" class="form__label">Mật khẩu*</label>
          <p v-if="!isPasswordValid && signUpForm.password !== ''" class="error-message">
            Password must be at least 8 characters, contain at least one uppercase letter, one number, and one special character.
          </p>
        </div>

        <div :class="['form__group', 'field', 'w-96', {'input-error': !passwordsMatch && signUpForm.repassword !== ''}]">
          <input
            type="password"
            class="form__field"
            placeholder="Confirm password"
            v-model="signUpForm.repassword"
            @blur="checkPasswords"
            required
          />
          <label for="repassword" class="form__label">Xác nhận mật khẩu*</label>
        </div>

        <div class="flex space-x-2 w-96">
          <div class="form__group w-1/2">
            <input
              type="text"
              class="form__field"
              placeholder="First Name"
              v-model="signUpForm.first_name"
              required
            />
            <label for="firstname" class="form__label">Tên*</label>
          </div>
          <div class="form__group w-1/2">
            <input
              type="text"
              class="form__field"
              placeholder="Last Name"
              v-model="signUpForm.last_name"
              required
            />
            <label for="lastname" class="form__label">Họ*</label>
          </div>
        </div>
        <button class="th-p-btn w-full relative" :disabled="isLoading">
          <span :class="{ 'opacity-0': isLoading }">Đăng ký</span>
          <div v-if="isLoading" class="loader-container">
            <div class="loader">
              <div class="loaderBar"></div>
            </div>
          </div>
        </button>
        
        <div class="mt-1">
          <span>Đã có tài khoản? </span>
          <router-link to="/login" class="hover-underline-animation">Đăng nhập tại đây</router-link>
        </div>
      </form>
    </div>
  </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useUserStore } from "../stores/user";
import router from "../router";

const signUpForm = reactive({
  username: "",
  password: "",
  repassword: "",
  email: "",
  first_name: "",
  last_name: "",
  phone: "",
  address: "",
});

const passwordsMatch = ref(true);
const isPasswordValid = ref(true);
const isLoading = ref(false);
const userStore = useUserStore();

function checkPasswords() {
  passwordsMatch.value = signUpForm.password === signUpForm.repassword || signUpForm.repassword === '';
  if (!passwordsMatch.value && signUpForm.repassword !== '') {
    const label = document.querySelector('label[for="repassword"]');
    label.classList.add("shake");
    setTimeout(() => {
      label.classList.remove("shake");
    }, 500);
  }
}

function checkPasswordFormat() {
  const password = signUpForm.password;
  if (password === "") {
    isPasswordValid.value = true; // Reset validation if password is empty
  } else {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    isPasswordValid.value = regex.test(password);
  }
}

async function signupHandle() {
  if (!passwordsMatch.value || !isPasswordValid.value) {
    console.log("Passwords do not match or invalid password format");
    return;
  }
  try {
    isLoading.value = true;
    const userData = [
      {
        Fname: signUpForm.first_name,
        Lname: signUpForm.last_name,
        phone: signUpForm.phone,
        email: signUpForm.email,
        image: "https://files.catbox.moe/n1w3b0.png",
      },
      {
        username: signUpForm.username,
        password: signUpForm.password,
      },
    ];
    const response = await userStore.signUp(userData);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate login delay
    console.log("Signup successful", response);
    router.push("/login");
  } catch (error) {
    console.error("Signup error", error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* Ensure the parent container takes the full height */
.thisForm {
  height: 100vh;
}

.login-background {
  background-color: #131313; /* Dark, semi-transparent background */
  backdrop-filter: blur(10px);
  box-shadow: 0px 0px 20px 1px #ffbb763f;
  border: 1px solid rgba(255, 255, 255, 0.454);
}

.signup-text {
  color: var(--primary-color); /* Replace with your primary color variable */
  font-size: 1.5rem;
  margin-top: 0.5rem;
}

.input-error .form__field {
  border-color: red;
}

.input-error .form__label {
  color: red;
}

.error-message {
  color: red;
  font-size: 0.875rem; /* Adjust font size as needed */
  margin-top: 0.5rem;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
}

.shake {
  animation: shake 0.5s;
}
</style>
