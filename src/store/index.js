import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    curChapter: 0,
    fanfiction: {
      title: "Ascension of the Kitsune",
      story: [
        {
          chapter: 1,
          title: "Chapter 1",
          contents: ["Hello", "World", "First", "Chapter"]
        },
        {
          chapter: 2,
          title: "Chapter 2",
          contents: ["Hello", "World", "Second", "Chapter"]
        }
      ]
    }
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
      commit("goNext")
    },
    goBack({ commit }) {
      commit("goBack")
    },
    goToChapter({ commit }, chapter) {
      commit("goToChapter", chapter);
    }
  },
  modules: {
  }
})
