import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user : {}
  },
  mutations: {
    authRequest(state) {
        state.status = 'loading'
    },
    authSuccess(state, token, user) {
        state.status = 'success',
        state.token = token,
        state.user = user
    },
    authError(state) {
        state.status = 'error'
    },
    authLogout(state) {
        state.status = ''
        state.token = ''
    }
  },
  actions: {

  },
  getters : {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
  }
})