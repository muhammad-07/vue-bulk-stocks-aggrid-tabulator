import { createStore } from 'vuex';
import api from '@/services/api';

const TOKEN_KEY = 'auth_token';

export default createStore({
  state: {
    token: localStorage.getItem(TOKEN_KEY) || null,
    user: null
  },
  getters: {
    isAuthenticated: state => !!state.token
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    },
    setUser(state, user) {
      state.user = user;
    },
    clearAuth(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem(TOKEN_KEY);
    }
  },
  actions: {
    async login({commit}, {email,password}) {
      const resp = await api.post('/login', { email, password });
      commit('setToken', resp.data.token);
      commit('setUser', resp.data.user);
      return resp;
    },
    async logout({commit}) {
      try { await api.post('/logout'); } catch(e){}
      commit('clearAuth');
    }
  }
});
