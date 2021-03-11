import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 购物车数量
    shopbagCount:0,
    // 是否加载购物车数量
    sign:false
  },
  mutations: {
    changeShopbagCount(state, data) {
      //state: vuex状态state
      //data: 载荷(参数)

      state.shopbagCount = data;
    },

    signshopbag(state , data){
      state.sign = data ; 
    }
  },
  actions: {
  },
  modules: {
  }
})
