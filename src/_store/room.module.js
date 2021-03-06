/**
 * 用于存储对局室的列表信息的stores
 */
import { gameService } from "../_services";
const state = {
  games: [],
  displayGames: [],
  rows: 0,
  showSpinner: false,
  historyGames: [],
};
const mutations = {
  SET_GAMES(state, games) {
    state.games = games;
  },
  SET_ROWS(state, rows) {
    state.rows = rows;
  },
  SET_DISPLAY_GAMES(state, displayGames) {
    state.displayGames = displayGames;
  },
  SET_HISTORY_GAMES(state, historyGames) {
    state.historyGames = historyGames;
  },
  SET_SPINNER(state, spinner) {
    state.showSpinner = spinner;
  },
};
const actions = {
  async fetchData({ commit }) {
    commit("SET_SPINNER", true);

    gameService.getAll().then((data) => {
      commit("SET_SPINNER", false);
    });

    return new Promise((resolve) => {
      setTimeout(async () => {
        const val = await gameService.getAll();
        // const val = await res.json();
        resolve(val);
        commit("SET_SPINNER", false);
      }, 1000);
    });
  },
  async fetchHistoryData({ commit }) {
    commit("SET_SPINNER", true);

    gameService.getHistory().then((data) => {
      commit("SET_SPINNER", false);
    });

    return new Promise((resolve) => {
      setTimeout(async () => {
        const val = await gameService.getHistory();
        // const val = await res.json();
        resolve(val);
        commit("SET_SPINNER", false);
      }, 1000);
    });
  },
  updatePagination({ commit, dispatch }, { myJson, currentPage, perPage }) {
    commit("SET_GAMES", myJson);
    commit("SET_ROWS", myJson.length);
    dispatch("paginate", { currentPage, perPage });
  },
  updateHistoryPagination({ commit, dispatch }, { myJson, currentPage, perPage }) {
    commit("SET_HISTORY_GAMES", myJson);
    // commit("SET_ROWS", myJson.length);
    // dispatch("paginate", { currentPage, perPage });
  },
  async fetchGames({ dispatch }) {
    const myJson = await dispatch("fetchData");
    dispatch("updatePagination", { myJson, currentPage: 1, perPage: 3 });
    return myJson;
  },
  async fetchHistoryGames({ dispatch }) {
    const myJson = await dispatch("fetchHistoryData");
    // commit("SET_HISTORY_GAMES", myJson);
    dispatch("updateHistoryPagination", { myJson, currentPage: 1, perPage: 3 });
    return myJson;
  },
  async paginate({ commit, state }, { currentPage, perPage }) {
    const start = (currentPage - 1) * perPage;
    const game = state.games.slice(start, start + 3);
    commit("SET_DISPLAY_GAMES", game);
  },
  
  async search({ dispatch }, { text }) {
    const myJson = await dispatch("fetchData");
    const values = myJson.filter((val) => {
      return val.name.toLowerCase().includes(text.toLowerCase());
    });

    dispatch("updatePagination", {
      myJson: values,
      currentPage: 1,
      perPage: 3,
    });
  },
};
const getters = {
  getGames(state) {
    return state.games;
  },
  getRows(state) {
    return state.rows;
  },
  getDisplayGames(state) {
    return state.displayGames;
  },
  getHistoryGames(state) {
    return state.historyGames;
  },
  getSpinner(state) {
    return state.showSpinner;
  },
};
export const room = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
