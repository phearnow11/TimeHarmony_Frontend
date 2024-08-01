<template>
  <div v-if="auth.user_id" class="mx-auto p-6 flex flex-col lg:flex-row">
    <!-- Sidebar -->
    <aside class="w-1/4 lg:mr-8 p-4">
      <h2 class="text-2xl mb-4">Cài đặt Hồ sơ</h2>
      <ul class="space-y-2">
        <li><router-link to="/setting/profile" class="hover-underline-animation">Thông tin cá nhân</router-link></li>
        <li><router-link to="/setting/password" class="hover-underline-animation">Mật khẩu</router-link></li>
        <li><router-link to="/setting/address" class="hover-underline-animation">Sổ địa chỉ</router-link></li>
        <li><router-link to="/setting/product" class="hover-underline-animation">Đơn hàng của tôi</router-link></li>
        <li><router-link to="/setting/profit" class="hover-underline-animation">Thu nhập</router-link></li>
        <li class="text-red-500">Xoá tài khoản</li>
      </ul>
    </aside>
    <!-- Content -->
    <div class="flex-1">
      <!-- Reset Password -->
      <div class="p-4">
        <section class="mt-1">
        <h2 class="text-xl text-red-500 font-bold mb-4">
          Xác nhận Xoá Tài Khoản khỏi Time Harmony
        </h2>
        <p>
          Khi bạn xác nhận xoá tài khoản ra khỏi nền tảng đồng nghĩa với việc tất cả sản phẩm mua, đăng bán, giao dịch cũng sẽ bị mất đi và chúng tôi sẽ không chịu trách nhiệm về những việc đó cũng như bồi thường sau khi tài khoản của bạn được xoá
        </p>
      </section>
      <div class="py-10">
          <label class="container flex justify-start items-center text-center gap-2 mb-5">
                <input type="checkbox" v-model="check" />
                <svg viewBox="0 0 64 64" height="1em">
                  <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" class="path"></path>
                </svg>
                <label>Bạn đã đọc và xác nhận xoá tài khoản</label>
              </label>

          <button 
            @click="confirmDelete()" 
            :disabled="!check" 
            :class="['th-p-btn', { 'opacity-50 cursor-not-allowed': !check }]"
            >
            Xác nhận xoá !
            </button>
        </div>
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


const check = ref(false)

const auth = useAuthStore();
const resetForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

onMounted(() => {
  if (!auth.user_id) {
    router.push('/login');
  }
});

const returnToHomepage = () => {
  useAuthStore().logout().then(
    window.location.replace('/')
  )
};

function confirmDelete() {
  if(check){
    console.log('Bạn đã xoá ' + auth.user_id + ' thành công');
    useUserStore().deleteUser(auth.user_id)
    returnToHomepage()
  } else{
    alert('Bạn cần xác nhận đã đọc nội dung trên')
  }
}

const showPopup = ref(false);
const closePopup = () => {
  showPopup.value = false;
};
const popupMessage = ref('');



</script>

<style scoped>

.disabled-btn {
  border: 1px solid #5d5d5d;
  background-color: #5d5d5d;
  cursor: not-allowed;
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
