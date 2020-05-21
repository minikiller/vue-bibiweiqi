import { gamesService } from "../_services";

const state = {
  onlineUsers: [],
  game: null,
};

const actions = {};

const mutations = {
  addUser(state, userId) {
    if (state.onlineUsers.indexOf(userId) == -1) state.onlineUsers.push(userId);
  },
  deleteUser(state, userId) {
    state.onlineUsers.pop(userId);
  },
  updateGame(state, game) {
    state.game = game;
  },
};

export const games = {
  namespaced: true,
  state,
  actions,
  mutations,
};
