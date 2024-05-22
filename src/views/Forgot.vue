<template>
  <div class="flex items-center justify-center thisForm">
    <form @submit.prevent="forgotHandle">
      <div class="flex flex-col items-center space-y-3">
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

        <button type="submit" class="w-full th-p-btn">Send Code</button>

        <div>
          <router-link to="/login" class="hover-underline-animation"
            >Back to log in</router-link
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


function forgotHandle() {
  axios
    .post("http://localhost:8080/user/forgot", {
      email: email.value,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}
</script>


<style scoped>
.thisForm {
  height: 74vh;
}
</style>
