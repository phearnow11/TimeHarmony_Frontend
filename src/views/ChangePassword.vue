<template>
    <div class="flex max-w-7xl mx-auto my-8 p-4">
      <!-- Content -->
      <div class="flex-1">
        <!-- Reset Password -->
        <div class="p-4">
          <h3 class="text-xl mb-10">Đặt lại mật khẩu</h3>
            <div class="form__group field w-96">
              <input
                type="password"
                class="form__field w-full"
                placeholder="Mật khẩu mới"
                v-model="resetForm.newPassword"
                required
              />
              <label for="newpassword" class="form__label">Mật khẩu mới</label>
            </div>
            <div :class="['form__group', 'field', 'w-96', {'input-error': !passwordsMatch}]">
              <input
                type="password"
                class="form__field w-full"
                placeholder="Xác nhận mật khẩu mới"
                v-model="resetForm.confirmPassword"
                @blur="checkPasswords"
                required
              />
              <label for="repassword" class="form__label">Xác nhận mật khẩu mới</label>
            </div>
            <button @click="resetPasswordHandle" type="submit" class="mt-10 th-p-btn">Đặt lại mật khẩu</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useUserStore } from '../stores/user';
  import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter()
  const auth = useAuthStore();
  const resetForm = ref({
    newPassword: '',
    confirmPassword: ''
  });
  const passwordsMatch = ref(true);

  function checkPasswords() {
  passwordsMatch.value = resetForm.value.newPassword === resetForm.value.confirmPassword;
  if (!passwordsMatch.value) {
    const label = document.querySelector('label[for="repassword"]');
    console.log('The confirm password does not match');
    label.classList.add('shake');
    setTimeout(() => {
      label.classList.remove('shake');
    }, 500);
  }
}
  async function resetPasswordHandle() {
    try {
      console.log('Username from store:', useUserStore().username)
      if(passwordsMatch.value){
      await auth.resetPassword(useUserStore().username,resetForm.value.newPassword);
      router.push('/login');
      } else{
        console.log('No match password');
      }
    } catch (error) {
      console.error('Lỗi khi đặt lại mật khẩu', error);
    }
  }
  </script>
  
  <style scoped>
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
  