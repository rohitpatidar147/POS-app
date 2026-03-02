import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import AuthFrontend from '../components/auth/auth.frontend.vue';
import AdminDashboard from '../components/auth/AdminDashboard.vue';
import WaiterDashboard from '../components/auth/WaiterDashboard.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'login',
    component: AuthFrontend
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard
  },
  {
    path: '/waiter',
    name: 'waiter',
    component: WaiterDashboard
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

