import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user:Object,
    userInfo:Object
  },
  mutations: {
    setUser(state,user){
      state.user = user
    },
    setuserInfo(state,userInfo){
      state.userInfo = userInfo
    }
  },
  actions: {
    handleSetUser(context,user){
      context.commit('setUser',user)
    },
    handleSetuserInfo(context,userInfo){
      context.commit('setUserInfo',userInfo)
    }
  },
  getters:{
    getUser(state){
      return Object.keys(state.user).length?state.user:{}
    },
    getuserInfo(state){
      return Object.keys(state.userInfo).length?state.userInfo:{}
    }
  },
  modules: {}
});
