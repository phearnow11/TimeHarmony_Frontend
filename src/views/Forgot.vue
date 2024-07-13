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
        <button @click="getEmail()" type="submit" class="w-full th-p-btn">Gửi code</button>
        <div class="">
          <span>
            Bạn nhớ mật khẩu?
          </span>
          <router-link to="/login" class="hover-underline-animation"
          >Quay trở lại đăng nhập</router-link
          >
        </div>
      </div>
      <div v-else  class="flex flex-col items-center space-y-5">
        <div class="logo-container flex flex-col items-center">
            <img src="../assets/time-harmony.png" class="logo w-60" />
            <span class="login-text">- Quên mật khẩu -</span>
          </div>
        <div class="relative right-2">
          <span>Nhập vào đây 6 kí tự đã được gửi về email của bạn</span>
        </div>
      <div class="form__group field w-96">
        <div class="verification-code-input">
          <input
            v-for="(digit, index) in 6"
            :key="index"
            v-model="codeDigits[index]"
            @input="onCodeInput(index)"
            @keydown="onKeyDown($event, index)"
            maxlength="1"
            type="text"
            class="code-digit"
          />
        </div>
        <button @click="sendCode()" type="submit" class="w-full th-p-btn my-6">Xác nhận</button>

        <button @click="back" type="submit" class="mdi mdi-chevron-left absolute right-1 hover-underline-animation">Quay lại</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, watch } from "vue";
import { useAuthStore } from "../stores/auth";
import { useUserStore } from "../stores/user";
import { useRouter } from "vue-router";

const router = useRouter();
const inputForm = ref(false);
const email = ref("");
const code = ref("");
const verifyCode = ref("");
const codeDigits = ref(Array(6).fill(''));

async function getEmail() {
  try {
    const response = await useUserStore().getUserByEmail(email.value);
    if (!response) {
      console.log(`Không có ai xài email này: ${email.value}`);
      return null;
    } else {
      console.log(response);
      console.log(response.user_log_info.username);
      inputForm.value = true;
      const authStore = useAuthStore();
      verifyCode.value = await authStore.forgotPassword(email.value);
      console.log('Verification code sent:', verifyCode.value);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

async function sendCode() {
  try {
    if (code.value === verifyCode.value) {
      console.log('Mã xác nhận chính xác');
      router.push('/change-password');
    } else {
      console.log('Mã xác nhận không chính xác');
    }
  } catch (error) {
    console.error('Lỗi khi xác nhận mã hoặc chuyển hướng:', error);
  }
}

const back = () => {
  inputForm.value = false;
}

function onCodeInput(index) {
  if (codeDigits.value[index].length > 0 && index < 5) {
    // Tự động focus vào ô tiếp theo
    document.querySelectorAll('.code-digit')[index + 1].focus();
  }
}

function onKeyDown(event, index) {
  if (event.key === 'Backspace' && index > 0 && codeDigits.value[index] === '') {
    // Quay lại ô trước đó khi nhấn Backspace
    document.querySelectorAll('.code-digit')[index - 1].focus();
  }
}

watch(codeDigits, (newValue) => {
  // Cập nhật giá trị code khi codeDigits thay đổi
  code.value = newValue.join('');
}, { deep: true });


</script>


<style scoped>
.thisForm {
  height: 100vh;
}

.verification-code-input {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.code-digit {
  width: 50px;
  height: 50px;
  font-size: 24px;
  text-align: center;
  border: none;
  border-bottom: 2px solid #333;
  outline: none;
  background-color: transparent;
}

.code-digit:focus {
  border-bottom-color: var(--secondary);
}
</style>
