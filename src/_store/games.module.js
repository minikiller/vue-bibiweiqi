import { gamesService } from "../_services";

const state = {
  onlineUsers: [],
  game: null,
  navTitle: "",
  result: "no result",
  turn: "black", //用于记录数子时候的顺序，默认是黑先开始数子，数值为black或white,每次轮换
  connected: false,
  roomId: "", //记录用户所在的房间号
  displayGames: [],
  BL: "",
  WL: "",
  B_number: 3,
  W_number: 3,
  showNav: true, //控制navBar的显示
};

const actions = {};

const mutations = {
  SOCKET_connect(state) {
    console.log("i got it");
    state.connected = true;
  },
  SOCKET_disconnect(state) {
    console.log("i don't got it");
    state.connected = false;
  },
  SOCKET_reconnect(state) {
    console.log("i got it again");
    // alert("connect");
    state.connected = true;
  },
  addUser(state, userId) {
    if (state.onlineUsers.indexOf(userId) == -1) state.onlineUsers.push(userId);
  },
  deleteUser(state, userId) {
    if (state.onlineUsers.indexOf(userId) != -1) state.onlineUsers.pop(userId);
  },
  clearUser(state) {
    while (state.onlineUsers.length > 0) {
      state.onlineUsers.pop();
    }
  },
  updateGame(state, game) {
    state.game = game;
  },

  updateNavTitle(state, value) {
    state.navTitle = value;
  },

  updateShowNav(state, value) {
    state.showNav = value;
  },

  setResult(state, value) {
    state.result = value;
  },
  setBL(state, value) {
    state.BL = value;
  },
  setWL(state, value) {
    state.WL = value;
  },
  setB_number(state, value) {
    state.B_number = value;
  },
  setW_number(state, value) {
    state.W_number = value;
  },

  setTurn(state) {
    if (state.turn == "black") state.turn = "white";
    else if (state.turn == "white") {
      state.turn = "black";
    }
  },
  setRoomId(state, value) {
    state.roomId = value;
  },
};

export const games = {
  namespaced: true,
  state,
  actions,
  mutations,
};
