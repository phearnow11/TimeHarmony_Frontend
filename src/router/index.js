import { createRouter, createWebHistory } from "vue-router";

const routes = [
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;