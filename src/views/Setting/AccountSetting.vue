<template>
  <div v-if="auth.user_id" class="mx-auto p-6 flex flex-col lg:flex-row">
    <!-- Sidebar -->
    <aside class="lg:w-1/4 lg:mr-8 p-4">
      <h2 class="text-2xl text-secondary mb-4">Cài đặt Hồ sơ</h2>
      <ul class="space-y-2">
        <li class="text-secondary">Thông tin cá nhân</li>
        <li><router-link to="/setting/password" class="hover-underline-animation">Mật khẩu</router-link></li>
        <li><router-link to="/setting/address" class="hover-underline-animation">Sổ địa chỉ</router-link></li>
        <li><router-link to="/setting/product" class="hover-underline-animation">Đơn hàng của tôi</router-link></li>
        <li><router-link to="/setting/profit" class="hover-underline-animation">Thu nhập</router-link></li>
        <li><router-link to="#" class="hover-underline-animation-r">Xoá tài khoản</router-link></li>
      </ul>
    </aside>

    <!-- Content -->
    <main class="flex-1">
      <!-- Public Info -->
      <section class="p-6 mb-8">
        <div class="text-center mb-6">
          <img :src="user.image" alt="Avatar" class="w-32 h-32 border-4 border-primary mx-auto mb-4">
          <p class="text-gray-400 mb-4">For best results, use an image at least 128px by 128px in jpg format</p>
          <input type="file" id="file-upload" class="hidden" @change="handleFileUpload">
          <label for="file-upload" class="th-p-btn cursor-pointer gap-2">Upload <span class="mdi mdi-tray-arrow-up"></span></label>
        </div>
      </section>

      <!-- Private Info -->
      <section class="p-6">
        <h3 class="text-xl text-secondary mb-4">Thông tin tài khoản</h3>
        <form @submit.prevent="saveChanges">
          <div class="form__group field">
            <input
              type="text"
              class="form__field"
              placeholder="Username"
              v-model="user.username"
              required
            />
            <label for="username" class="form__label">Tên tài khoản</label>
          </div>
          <div class="flex gap-4">
            <div class="form__group field flex-1">
              <input
                type="text"
                class="form__field"
                placeholder="First Name"
                v-model="user.first_name"
                required
              />
              <label for="first_name" class="form__label">Tên</label>
            </div>
            <div class="form__group field flex-1">
              <input
                type="text"
                class="form__field"
                placeholder="Last Name"
                v-model="user.last_name"
                required
              />
              <label for="last_name" class="form__label">Họ (Tên đệm)</label>
            </div>
          </div>
          <div class="form__group field ">
            <input
              type="text"
              class="form__field"
              placeholder="Phone"
              v-model="user.phone"
              required
            />
            <label for="phone" class="form__label">Số điện thoại</label>
          </div>
          <div class="form__group field">
            <input
              type="email"
              class="form__field"
              placeholder="Email"
              v-model="user.email"
              required
            />
            <label for="email" class="form__label">Email</label>
          </div>
          <button type="submit" class="th-p-btn mt-8" @click="submit">Lưu thay đổi</button>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { onMounted } from 'vue';
import { useUserStore } from '../../stores/user';
import { useCloudinaryStore } from '../../stores/cloudinary'; // Make sure this import is correct

const user = useUserStore();
const auth = useAuthStore();
const cloudinary = useCloudinaryStore();

const isUploading = ref(false);

const uploadToCDN = async (file) => {
  isUploading.value = true;
  try {
    const response = await cloudinary.uploadImage(file);
    await user.updateImage(response.secure_url)
    user.loadUser(auth.user_id)
  } catch (error) {
    console.error("Error uploading file:", error);
    // You might want to show an error message to the user here
  } finally {
    isUploading.value = false;
  }
};

onMounted(() => {
  if (!auth.user_id) {
    console.log('User is not logged in. Redirecting to login...');
    // Implement redirect logic here
  } else {
    user.loadUser(auth.user_id);
  }
});

async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    await uploadToCDN(file);
  }
}

const submit = () => {
  user.updateUserInfo(user.user_id, user.username, user.first_name, user.last_name, user.phone, user.email)
}
</script>

<style scoped>
/* Add your styles here */
</style>
