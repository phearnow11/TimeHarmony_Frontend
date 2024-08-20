import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useUserStore } from "../stores/user";
import { useChatStore } from "../stores/chat";
import { useAdminStore } from "../stores/admin";

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
      path: '/myself',
      name: 'MySelf',
      component: () => import('../views/MySelf.vue').catch(err => {
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
      meta: { requiresAdmin: true }
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
      path: '/forshipper',
      name: 'Forshipper',
      component: () => import('../views/Forshipper.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/setting/profit',
      name: 'ProfitSetting',
      component: () => import('../views/Setting/ProfitSetting.vue').catch(err => {
        console.error(err);
      }),
    },
    {
      path: '/setting/delete',
      name: 'DeleteAccount',
      component: () => import('../views/Setting/DeleteAccount.vue').catch(err => {
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
      path: '/location',
      name: 'Location',
      component: () => import('../views/Location.vue').catch(err => {
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
  const userStore = useUserStore();
  const chatStore = useChatStore();
  const adminStore = useAdminStore();
  const user_id = authStore.user_id;

  if (user_id != null) {
    await userStore.loadUser(user_id);

    var v = await useChatStore().findVerifyMail()
    if(v && v.length>0){
      console.log(useUserStore().isVerify);
    }
    
    if (!chatStore.subscription) {
      chatStore.subscribeToMessages();
    }

    if(!adminStore.banSubscription){
      adminStore.subscribeToBan()
    }
    
    if (['/login', '/signup', '/forgot'].includes(to.path)) {
      return next('/');
    }

    // Check if the route requires admin access
    if (to.meta.requiresAdmin) {
      if (userStore.role === 'ROLE_ADMIN') {
        next(); // Allow access to admin page
      } else {
        next('/error'); // Redirect to error page for non-admins
      }
    } else if (userStore.role === 'ROLE_ADMIN' && !to.path.startsWith('/admin')) {
      next('/admin'); // Redirect admins to admin page if they try to access non-admin pages
    } else {
      next(); // Proceed for non-admin routes
    }
    
  } else {
    chatStore.unsubscribeFromMessages();
    adminStore.unsubscribeFromBan()

    // If the route requires admin access and user is not logged in, redirect to login
    if (to.meta.requiresAdmin) {
      next('/login');
    } else {
      next();
    }
  }
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