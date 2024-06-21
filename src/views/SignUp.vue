<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="signup-container flex gap-8 items-center">
      <div class="logo-container flex flex-col items-center">
        <router-link to="/">
          <img src="../assets/time-harmony.png" class="logo" />
        </router-link>
        <span class="signup-text">- Sign Up -</span>
      </div>

      <form
        @submit.prevent="signupHandle"
        class="flex w-96 flex-col items-center gap-2"
      >
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
          <label for="username" class="form__label">Username*</label>
        </div>

        <div class="form__group field w-96">
          <input
            type="password"
            class="form__field"
            placeholder="Password"
            v-model="signUpForm.password"
            required
          />
          <label for="password" class="form__label">Password*</label>
        </div>

        <div :class="['form__group', 'field', 'w-96', {'input-error': !passwordsMatch}]">
          <input
            type="password"
            class="form__field"
            placeholder="Confirm password"
            v-model="signUpForm.repassword"
            @blur="checkPasswords"
            required
          />
          <label for="repassword" class="form__label">Confirm password*</label>
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
            <label for="firstname" class="form__label">First Name*</label>
          </div>
          <div class="form__group w-1/2">
            <input
              type="text"
              class="form__field"
              placeholder="Last Name"
              v-model="signUpForm.last_name"
              required
            />
            <label for="lastname" class="form__label">Last Name*</label>
          </div>
        </div>

        <div class="form__group field w-96">
          <input
            type="text"
            class="form__field"
            placeholder="Phone"
            v-model="signUpForm.phone"
          
          />
          <label for="phone" class="form__label">Phone</label>
        </div>

        <div class="form__group field w-96">
          <input
            type="text"
            class="form__field"
            placeholder="Address"
            v-model="signUpForm.address"
          />
          <label for="address" class="form__label">Address</label>
        </div>

        <button type="submit" class="w-full th-p-btn mt-3">Sign up</button>

        <div class="mt-1">
          <span>Already have an account? </span>
          <router-link to="/login" class="hover-underline-animation"
            >Log in here</router-link
          >
        </div>
      </form>
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

const userStore = useUserStore();

function checkPasswords() {
  passwordsMatch.value = signUpForm.password === signUpForm.repassword;
  if (!passwordsMatch.value) {
    const label = document.querySelector('label[for="repassword"]');
    label.classList.add("shake");
    setTimeout(() => {
      label.classList.remove("shake");
    }, 500);
  }
}

async function signupHandle() {
  if (!passwordsMatch.value) {
    console.log("Passwords do not match");
    return;
  }
  try {
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
    console.log("Signup successful", response);
    router.push("/login");
  } catch (error) {
    console.error("Signup error", error);
  }
}
</script>

<style scoped>
/* Ensure the parent container takes the full height */
.thisForm {
  height: 100vh;
}

/* Add styles for the signup container */
.signup-container {
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

/* Style the signup text */
.signup-text {
  color: var(--primary-color); /* Replace with your primary color variable */
  font-size: 1.5rem;
  margin-top: 0.5rem;
}

/* Adjust the logo size */
.logo {
  width: 200px;
  height: auto;
}

/* Optional: Add margin to move the form slightly to the right */
form {
  margin-left: 10rem; /* Adjust the value as needed */
}

.input-error .form__field {
  border-color: red;
}

.input-error .form__label {
  color: red;
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
