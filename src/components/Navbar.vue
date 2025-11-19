<template>
  <nav style="padding: 10px; background: #f5f5f5; margin-bottom: 20px;">
    <router-link to="/stocks" v-if="isAuthenticated" style="margin-right: 10px;">
      Stocks
    </router-link>

    <router-link to="/login" v-if="!isAuthenticated" style="margin-right: 10px;">
      Login
    </router-link>

    <router-link to="/bulk" v-if="isAuthenticated" style="margin-right: 10px;">
      Add Bulk
    </router-link>

    <a href="javascript:void(0)"
       v-if="isAuthenticated"
       @click="logout"
       style="margin-right: 10px;">
      Logout
    </a>
  </nav>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import router from '@/router';

export default {
  setup() {
    const store = useStore();

    const isAuthenticated = computed(() => store.getters.isAuthenticated);

    const logout = async () => {
      await store.dispatch('logout');
      router.push('/login');
    };

    return { isAuthenticated, logout };
  }
};
</script>
