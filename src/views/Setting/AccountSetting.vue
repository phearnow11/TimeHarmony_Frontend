<template>
      <PopUp 
  :show="showPopup" 
  :message="message" 
  :showDetails="false"
  @close="showPopup = false"
/>
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
        <li><router-link to="/setting/delete" class="hover-underline-animation-r">Xoá tài khoản</router-link></li>
      </ul>
    </aside>

    <!-- Content -->
    <main class="flex-1">
      <!-- Public Info -->
      <section class="p-6 mb-8">
        <div class="text-center mb-6">
          <img :src="user.image" alt="Avatar" class="w-32 h-32 border-2 border-primary mx-auto mb-4 object-cover">
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
              @input="updateChangedField('username')"
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
                @input="updateChangedField('first_name')"
              />
              <label for="first_name" class="form__label">Tên</label>
            </div>
            <div class="form__group field flex-1">
              <input
                type="text"
                class="form__field"
                placeholder="Last Name"
                v-model="user.last_name"
                @input="updateChangedField('last_name')"
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
              @input="validatePhone"
            />
            <label for="phone" class="form__label">Số điện thoại</label>
            <p v-if="!isPhoneValid && user.phone" class="text-red-500 text-sm mt-1">
              Số điện thoại không hợp lệ
            </p>
          </div>
          <div class="form__group field flex justify-between">
            <input
              type="email"
              class="form__field"
              placeholder="Email"
              v-model="user.email"
              @input="updateChangedField('email')"
              required
            />
            <label for="email" class="form__label">Email <i :class="`fa ${isEmailValid ? 'fa-check text-green-500' : 'fa-times text-red-500'}`"></i></label>
            <button @click="verifyMail" v-if="!isEmailValid" class="flex ml-5 w-32 th-p-btn">Xác thực</button>
          </div>
          <button type="submit" class="th-p-btn mt-8" @click="submit">Lưu thay đổi</button>
        </form>
      </section>
    </main>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { onMounted } from 'vue';
import { useUserStore } from '../../stores/user';
import { useCloudinaryStore } from '../../stores/cloudinary';
import { useMailStore } from '../../stores/mail';
import { useChatStore } from '../../stores/chat';
import { useRoute } from 'vue-router';
import PopUp from '../../components/PopUp.vue';

const user = useUserStore();
const auth = useAuthStore();
const cloudinary = useCloudinaryStore();
const message = ref();
const isUploading = ref(false);
const originalUser = reactive({});
const changedFields = reactive({});

const isPhoneValid = ref(true);
const isEmailValid = useUserStore().isVerify;

var api = import.meta.env.VITE_API_PORT;

const showPopup = ref(false);
const route = useRoute();
const verify = route.query.verify

if(verify === `${user.email}:${user.user_id}` && useUserStore()?.isVerify == false){
  useChatStore().sendMessage(`98f4b36e-bd11-4377-b538-2adf19b204b1`,`verify:${verify}`)
  console.log(`send to bot`);
  message.value = 'Xác thực email thành công'
  window.location.reload()
  // showPopup.value = true;
}

console.log("V",useUserStore().isVerify);



const verifyMail = async () => { 
  const host = window.location.origin;
  const link = `${host}/setting/profile?verify=${user.email}:${user.user_id}`;
  const plainTextContent = `Bạn vui lòng bấm vào đường dẫn sau để xác thực email: ${link}`;
  const htmlContent = `Bạn vui lòng bấm vào <a href="${link}">đây</a> để xác thực email`;
  showPopup.value = true;
  message.value = 'Đã gửi đường dẫn xác thực về email'
  await useMailStore().send(
    user.email,
    "THÔNG BÁO XÁC THỰC TÀI KHOẢN",
    plainTextContent,
    htmlContent
  );

  console.log(`send verify`);
  
};

const validatePhone = () => {
  isPhoneValid.value = isValidPhoneNumber(user.phone);
};

const isValidPhoneNumber = (phone) => {
  // This regex allows for Vietnamese phone numbers:
  // - Optionally starts with +84
  // - Can start with 0
  // - Followed by 9-10 digits
  if (!phone.trim()) return true;
  const phoneRegex = /^(\+84|0)([3|5|7|8|9])?[0-9]{8}$/;
  return phoneRegex.test(phone);
};

const uploadToCDN = async (file) => {
  isUploading.value = true;
  try {
    const response = await cloudinary.uploadImage(file);
    await user.updateImage(response.secure_url)
    user.loadUser(auth.user_id)
  } catch (error) {
    console.error("Error uploading file:", error);
  } finally {
    isUploading.value = false;
  }
};

onMounted(async () => {
  if (!auth.user_id) {
    console.log('User is not logged in. Redirecting to login...');
    // Implement redirect logic here
  } else {
    await user.loadUser(auth.user_id);
    Object.assign(originalUser, user.$state);
    
    }
});

async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    await uploadToCDN(file);
  }
}

const updateChangedField = (field) => {
  if (user[field] !== originalUser[field]) {
    changedFields[field] = user[field];
  } else {
    delete changedFields[field];
  }
};

const submit = () => {
  if (!isValidPhoneNumber(user.phone)) {
    alert("Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.");
    return;
  }

  const updatedFields = {
    fname: user.first_name,
    lname: user.last_name,
    phone: user.phone
  };

  // Only include email and username if they've changed
  if (user.email !== originalUser.email) {
    updatedFields.email = user.email;
  }
  
  if (user.username !== originalUser.username) {
    updatedFields.username = user.username;
  }

  user.updateUserInfo(user.user_id, updatedFields)
    .then(() => {
      window.location.reload()
    })
    .catch((error) => {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      alert("Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại.");
    });
};
</script>