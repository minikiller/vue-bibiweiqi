const state = {
  type: null,
  message: null,
};
const time_out = 30000;
const actions = {
  success({ commit }, message) {
    commit("success", message);
    setTimeout(() => {
      commit("clear");
    }, time_out);
  },
  error({ commit }, message) {
    commit("error", message);
    setTimeout(() => {
      commit("clear");
    }, time_out);
  },
  clear({ commit }) {
    commit("clear");
  },
};

const mutations = {
  success(state, message) {
    state.type = "alert-success";
    state.message = message;
    setTimeout(() => {
      state.type = null;
      state.message = null;
    }, time_out);
  },
  error(state, message) {
    state.type = "alert-danger";
    state.message = message;
    setTimeout(() => {
      state.type = null;
      state.message = null;
    }, time_out);
  },
  clear(state) {
    state.type = null;
    state.message = null;
  },
};

export const alert = {
  namespaced: true,
  state,
  actions,
  mutations,
};
