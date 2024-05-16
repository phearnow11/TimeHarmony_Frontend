import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(`../components/Home.vue`),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(`../components/Login.vue`),
  },
  {
    path: '/forgot',
    name: 'Forgot',
    component: () => import(`../components/Forgot.vue`),
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import(`../components/SignUp.vue`),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;