<template>
  <div class="flex items-center justify-center thisForm">
      <div v-if="!inputForm" class="flex flex-col items-center space-y-5">
          <div class="logo-container flex flex-col items-center">
          <router-link to="/">
            <img src="../assets/time-harmony.png" class="logo w-60" />
          </router-link>
          <span class="login-text">- Quên mật khẩu -</span>
          </div>
        <div class="relative right-2">
          <span>Vui lòng nhập email tài khoản muốn lấy lại mật khẩu.</span>
        </div>
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
        <button @click="toogleInputForm" type="submit" class="w-full th-p-btn">Send Code</button>
        <div>
          <router-link to="/login" class="absolute right-36 hover-underline-animation"
          >Back to log in</router-link
          >
        </div>
      </div>
      <div v-else class="form__group field w-96">
        <input
          type="email"
          class="form__field"
          placeholder="Code"
          v-model="code"
          required
        />
        <label for="code" class="form__label">Code</label>
        <button @click="forgotHandle" type="submit" class="w-full th-p-btn">Submit</button>
      </div>
  </div>
</template>


<script setup>
import { ref } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import { useUserStore } from "../stores/user";
import router from "../router";

const inputForm = ref(false);
const email = ref("");
const code = ref("");
const verify = ref("");

function sendCode(){
  // if(email === useUserStore().email){
    verify.value = useAuthStore().forgotPassword(useUserStore().email)
  // } else{
  //   console.log('wrong email');
  // }

}

const toogleInputForm = () => {
  verify.value = useAuthStore().forgotPassword(useUserStore().email)
  inputForm.value = !inputForm.value;
  if (!showAddForm.value) {
    newAddress.value = { name: '', phone: '', detail: '', default: false };
    selectedProvince.value = '';
    selectedDistrict.value = '';
    selectedWard.value = '';
  }
};

function forgotHandle() {
  if(code.value === verify.value){
    
    router.push('/change-password')
  }
}
</script>


<style scoped>
.thisForm {
  height: 100vh;
}
</style>
