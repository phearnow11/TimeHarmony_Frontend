import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(`../views/Home.vue`),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(`../views/Login.vue`),
  },
  {
    path: '/forgot',
    name: 'Forgot',
    component: () => import(`../views/Forgot.vue`),
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import(`../views/SignUp.vue`),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;