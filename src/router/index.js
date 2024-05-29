import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
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
  ]
});

// router.beforeEach(async (to) => {
//   const publicPages = ['/login', '/forgot', '/signup'];
//   const authRequired = !publicPages.includes(to.path);
//   const auth = useAuthStore()

//   if (authRequired && !auth.user) {
//     return '/login'
//   }
// })

export default router;