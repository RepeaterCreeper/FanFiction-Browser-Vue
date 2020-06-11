import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    curChapter: 0,
    fanfiction: {},
    libraryList: []
  },
  mutations: {
    goNext(state) {
      state.curChapter++
    },
    goBack(state) {
      state.curChapter--
    },
    goToChapter(state, chapter) {
      state.curChapter = chapter;
    }
  },
  actions: {
    goNext({ commit }, chapter) {
      commit("goNext");
      document.documentElement.scrollTop = 0;
    },
    goBack({ commit }) {
      commit("goBack");
      document.documentElement.scrollTop = 0;
    },
    goToChapter({ commit }, chapter) {
      commit("goToChapter", chapter);
      document.documentElement.scrollTop = 0;
    }
  },
  modules: {
  }
})
