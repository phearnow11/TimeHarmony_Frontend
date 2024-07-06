<template>
  <div v-if="auth.user_id" class="flex max-w-7xl mx-auto my-8 p-4">
    <!-- Sidebar -->
    <div class="w-1/4 mr-8">
      <h2 class="text-2xl mb-4">Profile Settings</h2>
      <ul>
        <li class="mb-2">
          <router-link to="/setting/profile" class="hover-underline-animation">Account</router-link>
        </li>
        <li class="mb-2 text-secondary">Password</li>
        <li class="mb-2"><router-link to="/setting/address" class="hover-underline-animation">My Address</router-link></li>

        <li class="mb-2"><router-link to="/setting/product" class="hover-underline-animation">My Watch Product</router-link></li>

        <li class="mb-2">
          <router-link to="#" class="hover-underline-animation">Delete account</router-link>
        </li>
      </ul>
    </div>
    <!-- Content -->
    <div class="flex-1">
      <!-- Private Info -->
      <div class="p-4">
        <h3 class="text-xl mb-10">Reset Password</h3>
        <form @submit.prevent="resetPasswordHandle">
          <div class="form__group field w-96">
            <input
              type="password"
              class="form__field w-full"
              placeholder="New Password"
              v-model="resetForm.newPassword"
              required
            />
            <label for="newpassword" class="form__label">New Password</label>
          </div>
          <div :class="['form__group', 'field', 'w-96', {'input-error': !passwordsMatch}]">
            <input
              type="password"
              class="form__field w-full"
              placeholder="Confirm New Password"
              v-model="resetForm.confirmPassword"
              @blur="checkPasswords"
              required
            />
            <label for="repassword" class="form__label">Confirm New Password</label>
          </div>
          <button type="submit" class="mt-5 th-p-btn">Reset Password</button>
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

const auth = useAuthStore();
const resetForm = ref({
  newPassword: '',
  confirmPassword: ''
});
const passwordsMatch = ref(true);

onMounted(() => {
  if (!auth.user_id) {
    // Handle user not logged in, e.g., redirect to login page
    // For example, using Vue Router's push method:
    router.push('/login');
  }
});

function checkPasswords() {
  passwordsMatch.value = resetForm.value.newPassword === resetForm.value.confirmPassword;
  if (!passwordsMatch.value) {
    const label = document.querySelector('label[for="repassword"]');
    label.classList.add('shake');
    setTimeout(() => {
      label.classList.remove('shake');
    }, 500);
  }
}

async function resetPasswordHandle() {
  if (!passwordsMatch.value) {
    console.log('Passwords do not match');
    return;
  }
  try {
    // Call your store action to update the password
    await auth.updatePassword(resetForm.value.newPassword);
    console.log('Password reset successful');
    router.push('/login');
  } catch (error) {
    console.error('Password reset error', error);
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
