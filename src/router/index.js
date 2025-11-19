import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import StockList from '@/views/StockList.vue';
import BulkStock from '@/views/BulkStock.vue';
import store from '@/store';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/stocks', component: StockList, meta: { requiresAuth: true }},
  { path: '/bulk', component: BulkStock, meta: { requiresAuth: true }},
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    return next('/login');
  }
  next();
});

export default router;
