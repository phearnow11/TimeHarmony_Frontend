<template>
  <div v-if="auth.user_id" class="mx-auto p-6 flex flex-col lg:flex-row">
    <!-- Sidebar -->
    <aside class="w-1/4 lg:mr-8 p-4">
      <h2 class="text-2xl mb-4">Cài đặt Hồ sơ</h2>
      <ul class="space-y-2">
        <li><router-link to="/setting/profile" class="hover-underline-animation">Thông tin cá nhân</router-link></li>
        <li class="text-secondary">Mật khẩu</li>
        <li><router-link to="/setting/address" class="hover-underline-animation">Sổ địa chỉ</router-link></li>
        <li><router-link to="/setting/product" class="hover-underline-animation">Đơn hàng của tôi</router-link></li>
        <li><router-link to="#" class="hover-underline-animation-r">Xoá tài khoản</router-link></li>
      </ul>
    </aside>
    <!-- Content -->
    <div class="flex-1">
      <!-- Reset Password -->
      <div class="p-4">
        <h3 class="text-xl mb-10">Đặt lại mật khẩu</h3>
        <form @submit.prevent="resetPasswordHandle">
          <div class="form__group field w-96">
            <input
              type="password"
              class="form__field w-full"
              placeholder="Mật khẩu cũ"
              v-model="resetForm.oldPassword"
              required
            />
            <label for="newpassword" class="form__label">Mật khẩu cũ</label>
          </div>
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
          <button type="submit" class="mt-10 th-p-btn">Đặt lại mật khẩu</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { onMounted } from 'vue';
import router from '../../router';
import { useUserStore } from '../../stores/user';

const auth = useAuthStore();
const resetForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});
const passwordsMatch = ref(true);

onMounted(() => {
  if (!auth.user_id) {
    router.push('/login');
  }
});

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
    await auth.resetPass(resetForm.value.oldPassword,useUserStore().username,resetForm.value.newPassword);
    // router.push('/login');
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
