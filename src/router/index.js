import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import StockList from '@/views/StockList.vue';
import BulkStock from '@/views/BulkStock.vue';
import store from '@/store';

const routes = [
  { path: '/', redirect: '/stocks' },

  { path: '/login', component: Login },

  { path: '/stocks', component: StockList, meta: { requiresAuth: true }},
  { path: '/bulk', component: BulkStock, meta: { requiresAuth: true }},
  { 
    path: '/logout',
    beforeEnter: (to, from, next) => {
      store.dispatch('logout');
      next('/login');
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters.isAuthenticated;

  if (to.path === '/login' && isLoggedIn) {
    return next('/stocks');
  }

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login');
  }

  next();
});

export default router;
