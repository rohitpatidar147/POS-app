//@ts-nocheck
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import AuthFrontend from '../components/user/auth/auth.frontend.vue';
import AdminDashboard from '../components/user/AdminDashboard.vue';
import WaiterDashboard from '../components/user/WaiterDashboard.vue';
import WaiterAccountsPage from '../components/waiter-accounts/WaiterAccountsPage.vue';
import AddMenuItemPage from '../components/add-menu-item/AddMenuItemPage.vue';
import EditMenuItemPage from '../components/edit-menu-item/EditMenuItemPage.vue';
import OrdersPage from '../components/orders-page/OrdersPage.vue';
import HistoryPage from '../components/history-page/HistoryPage.vue';
import BillsPage from '../components/bills-page/BillsPage.vue';
import SalesHistoryPage from '../components/sales-history/SalesHistoryPage.vue';

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
    path: '/admin/orders',
    name: 'admin-orders',
    component: OrdersPage
  },
  {
    path: '/admin/history',
    name: 'admin-history',
    component: HistoryPage
  },
  {
    path: '/admin/bills',
    name: 'admin-bills',
    component: BillsPage
  },
  {
    path: '/admin/sales',
    name: 'admin-sales',
    component: SalesHistoryPage
  },
  {
    path: '/admin/waiter-accounts',
    name: 'admin-waiter-accounts',
    component: WaiterAccountsPage
  },
  {
    path: '/admin/add-menu-item',
    name: 'admin-add-menu-item',
    component: AddMenuItemPage
  },
  {    path: '/admin/edit-menu-item/:id',
    name: 'admin-edit-menu-item',
    component: EditMenuItemPage
  },
  {    path: '/waiter',
    name: 'waiter',
    component: WaiterDashboard
  },
  {
    path: '/waiter/orders',
    name: 'waiter-orders',
    component: OrdersPage
  },
  {
    path: '/waiter/history',
    name: 'waiter-history',
    component: HistoryPage
  },
  {
    path: '/waiter/bills',
    name: 'waiter-bills',
    component: BillsPage
  },
  {
    path: '/waiter/sales',
    name: 'waiter-sales',
    component: SalesHistoryPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

