import Vue from 'vue'
import Vuex from 'vuex'

import * as MutationTypes from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: localStorage.getItem('user') || null,
  },
  mutations: {
    [MutationTypes.LOGIN] (state) {
        state.user = localStorage.getItem('user')
    },
    [MutationTypes.LOGOUT] (state) {
        localStorage.removeItem('user')
        state.user = null
    }
  },
  actions: {
    login ({ commit }) {
        commit(MutationTypes.LOGIN)
    },
    logout ({ commit }) {
        commit(MutationTypes.LOGOUT)
    }
  },
  getters : {
    getUser (state) {
        return state.user
    }
  }
})