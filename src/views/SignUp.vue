<template>
  <div class="flex items-center justify-center thisForm">
    <form @submit.prevent="signupHandle">
      <div class="flex flex-col items-center">
        <div class="form__group field w-96">
          <input
            type="email"
            class="form__field"
            placeholder="Email"
            v-model="signUpForm.email"
            required
          />
          <label for="email" class="form__label">Email</label>
        </div>

        <div class="form__group field w-96">
          <input
            type="text"
            class="form__field"
            placeholder="Username"
            v-model="signUpForm.username"
            required
          />
          <label for="username" class="form__label">Username</label>
        </div>

        <div class="form__group field w-96">
          <input
            type="password"
            class="form__field"
            placeholder="Password"
            v-model="signUpForm.password"
            required
          />
          <label for="password" class="form__label">Password</label>
        </div>

        <div class="form__group field w-96" id="">
          <input
            type="password"
            class="form__field"
            placeholder="Password"
            v-model="signUpForm.repassword"
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
              v-model="signUpForm.first_name"
              required
            />
            <label for="firstname" class="form__label">First Name</label>
          </div>
          <div class="form__group w-1/2">
            <input
              type="text"
              class="form__field"
              placeholder="Lastname"
              v-model="signUpForm.last_name"
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
            v-model="signUpForm.phone"
            required
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

        <button type="submit" class="w-full th-p-btn mt-5">Sign up</button>

        <div class="mt-4">
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
import { reactive } from "vue";
import { useUserStore } from "../stores/user";
import router from "../router";

const signUpForm = reactive({
  username: '',
  password: '',
  repassword: '',
  email: '',
  first_name: '',
  last_name: '',
  phone: '',
  address: '',
});

const userStore = useUserStore();

async function signupHandle() {
  if (signUpForm.password !== signUpForm.repassword) {
    console.log("Passwords do not match");

    return;
  }

  userStore.loadUser({
    username: signUpForm.username,
    password: signUpForm.password,
    email: signUpForm.email,
    first_name: signUpForm.first_name,
    last_name: signUpForm.last_name,
    phone: signUpForm.phone,
    address: signUpForm.address,
  });

  try {
    const response = await userStore.signUp();
    console.log("Signup successful", response);
    router.push('/login')
    // Redirect or show success message
  } catch (error) {
    console.error("Signup error", error);
    // Handle signup error
  }
}
</script>

<style scoped>
.thisForm {
  height: 100vh;
}
</style>
