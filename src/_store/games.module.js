import { gamesService } from "../_services";

const state = {
  onlineUsers: [],
  game: null,
  navTitle: "",
  result: "no result",
  turn: "black", //用于记录数子时候的顺序，默认是黑先开始数子，数值为black或white,每次轮换
  connected: false,
};

const actions = {};

const mutations = {
  SOCKET_connect(state) {
    console.log("i got it");
    state.connected = true;
  },
  addUser(state, userId) {
    if (state.onlineUsers.indexOf(userId) == -1) state.onlineUsers.push(userId);
  },
  deleteUser(state, userId) {
    if (state.onlineUsers.indexOf(userId) != -1) state.onlineUsers.pop(userId);
  },
  updateGame(state, game) {
    state.game = game;
  },
  updateNavTitle(state, value) {
    state.navTitle = value;
  },
  setResult(state, value) {
    state.result = value;
  },
  setTurn(state) {
    if (state.turn == "black") state.turn = "white";
    else if (state.turn == "white") {
      state.turn = "black";
    }
  },
};

export const games = {
  namespaced: true,
  state,
  actions,
  mutations,
};
