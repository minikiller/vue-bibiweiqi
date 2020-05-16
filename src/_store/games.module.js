import { gamesService } from "../_services";

const state = {
  onlineUsers: [],
};

const actions = {};

const mutations = {
  addUser(state, userId) {
    state.onlineUsers.push(userId);
  },
  deleteUser(state, userId) {
    state.onlineUsers.pop(userId);
  },
};

export const games = {
  namespaced: true,
  state,
  actions,
  mutations,
};
