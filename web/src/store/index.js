import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const COVER_URL = [
  require("../assets/cover/cover1.jpg"),
  require("../assets/cover/cover2.jpg"),
  require("../assets/cover/cover3.jpg"),
  require("../assets/cover/cover4.jpg"),
  require("../assets/cover/cover5.jpg"),
  require("../assets/cover/cover6.jpg")
];

export default new Vuex.Store({
  state: {
    isPlaying: false,
    isLoading: false,
    isError: false,
    playType: 0,
    coverUrl: "",
    isPlayListComplete: false,
    currentIndex:0,
    isMuted:false,
    prevIndex:-1,
  },
  mutations: {
    togglePlay(state, toggle) {
      state.isPlaying = toggle !== undefined ? toggle : !state.isPlaying;
    },
    toggleLoad(state, toggle) {
      state.isLoading = toggle !== undefined ? toggle : !state.isLoading;
    },
    toggleError(state, toggle) {
      state.isError = toggle !== undefined ? toggle : !state.isError;
    },
    toggleMuted(state, toggle) {
      state.isMuted = !state.isMuted;
    },
    changePlayType(state, playType) {
      state.playType = playType;
    },
    changeCurrentIndex(state,index){
      state.currentIndex = index
    },
    togglePlayListComplete(state, toggle) {
      state.isPlayListComplete = toggle;
    },
    changePrevIndex(state, prevIndex){
      state.prevIndex = prevIndex
    },
    changeCover(state) {
      while (1) {
        const index = Math.floor(Math.random() * COVER_URL.length);
        const coverUrl = COVER_URL[index];
        if (coverUrl !== state.coverUrl) {
          state.coverUrl = coverUrl;
          break;
        }
      }
    }
  },
  actions: {},
  modules: {}
});
