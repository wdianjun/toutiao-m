import Vue from 'vue'
import Vuex from 'vuex'
// 导入本地存储的函数
import { setItem, getItem, removeItem } from '@/utils/storage'

Vue.use(Vuex)
const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  state: {
    // token: JSON.parse(localStorage.getItem(TOKEN_KEY))
    token: getItem(TOKEN_KEY)
  },
  getters: {
  },
  mutations: {
    setUser (state, payLoad) {
      state.token = payLoad
      // localStorage.setItem(TOKEN_KEY, JSON.stringify(payLoad))
      setItem(TOKEN_KEY, state.token)
    },
    // 清除token
    removeUser (state) {
      state.token = null
      removeItem(TOKEN_KEY)
    }
  },
  actions: {
  },
  modules: {
  }
})
