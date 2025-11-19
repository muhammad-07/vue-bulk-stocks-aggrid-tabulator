<template>
  <div style="max-width:420px;margin:40px auto">
    <h2>Login</h2>
    <form @submit.prevent="submit">
      <div>
        <label>Email</label><br/>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Password</label><br/>
        <input v-model="password" type="password" required />
      </div>
      <div style="margin-top:10px">
        <button type="submit">Login</button>
      </div>
      <div v-if="error" style="color:red;margin-top:10px">{{ error }}</div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import router from '@/router';

export default {
  setup() {
    const store = useStore();
    const email = ref('');
    const password = ref('');
    const error = ref(null);

    const submit = async () => {
      error.value = null;
      try {
        await store.dispatch('login', { email: email.value, password: password.value });
        router.push('/stocks');
      } catch (e) {
        error.value = e.response?.data?.message || 'Login failed';
      }
    };

    return { email, password, submit, error };
  }
}
</script>
