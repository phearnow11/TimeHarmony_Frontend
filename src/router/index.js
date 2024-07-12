import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useUserStore } from "../stores/user";
import { onBeforeUnmount } from "vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/search',
      name: 'SearchResult',
      component: () => import('../views/SearchResult.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/forgot',
      name: 'Forgot',
      component: () => import('../views/Forgot.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: () => import('../views/SignUp.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/upload',
      name: 'Upload',
      component: () => import('../views/Upload.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/favorite',
      name: 'Favorite',
      component: () => import('../views/Favorite.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/About.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('../views/Cart.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/chat',
      name: 'Chat',
      component: () => import('../views/Chat.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/appraiser',
      name: 'Appraiser',
      component: () => import('../views/Appraiser.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/Admin.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/change-password',
      name: 'ChangePassword',
      component: () => import('../views/ChangePassword.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/setting/profile',
      name: 'AccountSetting',
      component: () => import('../views/Setting/AccountSetting.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/setting/password',
      name: 'PasswordSetting',
      component: () => import('../views/Setting/PasswordSetting.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/setting/address',
      name: 'AddressSetting',
      component: () => import('../views/Setting/AddressSetting.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/setting/product',
      name: 'ProductSetting',
      component: () => import('../views/Setting/ProductSetting.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/detail/:watch_id',
      name: 'ProductDetail',
      component: () => import('../views/ProductDetail.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/retailer/:seller_id',
      name: 'Retailer',
      component: () => import('../views/Retailer.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/discover/:field',
      name: 'Discover',
      component: () => import('../views/Discover.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/order',
      name: 'Order',
      component: () => import('../views/Order.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/orderconfirmation/:order_id',
      name: 'OrderConfirm',
      component: () => import('../views/OrderConfirm.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/test',
      name: 'Testaddress',
      component: () => import('../views/testaddress.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/voucher',
      name: 'Voucher',
      component: () => import('../views/Voucher.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/payment-handle',
      name: 'PaymentHandle',
      component: () => import('../views/PaymentHandle.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Error',
      component: () => import('../views/Error.vue').catch(err => {
        console.error(err);
      }),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top
    return { top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const user_id = authStore.user_id;

  if (user_id != null) {
    useUserStore().loadUser(user_id);
    
    // Redirect authenticated users away from login, signup, and forgot pages
    if (['/login', '/signup', '/forgot'].includes(to.path)) {
      return next('/');
    }
  }
  next();
});

// router.afterEach(()=>{
//   // Close
//   window.addEventListener('beforeunload', async () => {
//     try {
//       await useUserStore().saveFavoritesToServer(useUserStore().user_id);
//       console.log('Favorites saved successfully!');
//     } catch (error) {
//       console.error(error);
//     }
//   });
// })

export default router;