<template>
  <footer v-if="shouldShowFooter" class="footer bg-[#212121] text-[#E6C591]">
    <div class="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
      <div class="xl:grid xl:grid-cols-3 xl:gap-8">
        <div class="space-y-8 xl:col-span-1">
          <router-link to="/" class="flex items-center">
            <img src="../assets/time-harmony.png" class="h-14 w-auto mr-3" alt="Logo TimeHarmony" />
          </router-link>
          <p class="text-[#9b9b9b] mt-0">
            Khám Phá Di Sản, Nâng Tầm Đẳng Cấp
          </p>
        
            
          <div class="flex space-x-6">
            <a href="https://www.facebook.com/profile.php" class="text-[#9b9b9b] hover-underline-animation">
              <span class="sr-only">Facebook</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="text-[#9b9b9b] hover-underline-animation">
              <span class="sr-only">Instagram</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="text-[#9b9b9b] hover-underline-animation">
              <span class="sr-only">Twitter</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
        <div class="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
          <div class="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 class="text-sm font-semibold text-[#E6C591] tracking-wider uppercase">Giải pháp</h3>
              <ul role="list" class="mt-4 space-y-4">
                <li><router-link to="/features" class="text-[#9b9b9b] hover-underline-animation">Tính năng</router-link></li>
                <li><router-link to="/pricing" class="text-[#9b9b9b] hover-underline-animation">Báo giá</router-link></li>
                <li><router-link to="/contact" class="text-[#9b9b9b] hover-underline-animation">Liên hệ</router-link></li>
              </ul>
            </div>
            <div class="mt-12 md:mt-0">
              <h3 class="text-sm font-semibold text-[#E6C591] tracking-wider uppercase">Công ty</h3>
              <ul role="list" class="mt-4 space-y-4">
                <li><router-link to="/about" class="text-[#9b9b9b] hover-underline-animation">Về chúng tôi</router-link></li>
                <li><router-link to="/team" class="text-[#9b9b9b] hover-underline-animation">Nhóm</router-link></li>
                <li><router-link to="/careers" class="text-[#9b9b9b] hover-underline-animation">Tuyển dụng</router-link></li>
              </ul>
            </div>
          </div>
          <div class="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 class="text-sm font-semibold text-[#E6C591] tracking-wider uppercase">Hỗ trợ</h3>
              <ul role="list" class="mt-4 space-y-4">
                <li><router-link to="/documentation" class="text-[#9b9b9b] hover-underline-animation">Tài liệu</router-link></li>
                <li><router-link to="/faq" class="text-[#9b9b9b] hover-underline-animation">Câu hỏi thường gặp</router-link></li>
                <li><router-link to="/support" class="text-[#9b9b9b] hover-underline-animation">Hỗ trợ khách hàng</router-link></li>
              </ul>
            </div>
            <div class="mt-12 md:mt-0">
              <h3 class="text-sm font-semibold text-[#E6C591] tracking-wider uppercase">Pháp lý</h3>
              <ul role="list" class="mt-4 space-y-4">
                <li><router-link to="/privacy" class="text-[#9b9b9b] hover-underline-animation">Chính sách bảo mật</router-link></li>
                <li><router-link to="/terms" class="text-[#9b9b9b] hover-underline-animation">Điều khoản sử dụng</router-link></li>
                <li><router-link to="/cookies" class="text-[#9b9b9b] hover-underline-animation">Chính sách cookie</router-link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-12 border-t border-gray-700 pt-8">
        <p class="text-base text-gray-400 xl:text-center">
          &copy; TimeHarmony, Inc.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useUserStore } from '../stores/user';

const auth = useUserStore();
const route = useRoute();
const date = computed(() => new Date().getFullYear());

const shouldShowFooter = computed(() => {
      const hiddenRoutesWithoutAuth = ['/login', '/signup', '/chat', '/upload', '/order', '/cart', '/forgot'];
      const hiddenRoutesWithAuth = ['/chat', '/order', '/orderconfirmation/:order_id' , '/admin', '/appraiser'];

      if (!auth.user_id && hiddenRoutesWithoutAuth.includes(route.path)) {
        return false;
      }

      if (auth.user_id && hiddenRoutesWithAuth.includes(route.path)) {
        return false;
      }

      return true;
    });
</script>

<style scoped>
.footer {
  background-color: rgba(20, 20, 20, 0.836);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: rgba(153, 153, 153, 0.2) 0px -1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  margin-top: 2rem;
}

/* The hover-underline-animation class is assumed to be defined in your global CSS */
</style>