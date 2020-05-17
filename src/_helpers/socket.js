/**
 * 处理websocket相关的业务方法
 */
import config from "config";

export let socketServer = "dfdfdf";

export let socket = io.connect(`${config.socketUrl}`);

import { EventBus } from "../index.js";
import { readyMove } from "./go";
// var connection = new RTCMultiConnection();

//////////////////////////////
// Socket.io handlers
//////////////////////////////

socket.on("initGameUser", function(msg) {
  EventBus.$emit("initGameUser", msg);
});

//用户进入对局室
socket.on("joinlobby", function(msg) {
  EventBus.$emit("joinlobbye", msg);
  // addUser(msg);
});
//用户立刻对局室
socket.on("leavelobby", function(msg) {
  EventBus.$emit("leavelobby", msg);
  // removeUser(msg);
});
//用户准备开始对局
socket.on("prepare", function(msg) {
  EventBus.$emit("prepare", msg);
  // removeUser(msg);
});

//全部用户准备开始对局
socket.on("beginGame", function(msg) {
  EventBus.$emit("beginGame", msg);
  // removeUser(msg);
});

socket.on("gameadd", function(msg) {});

socket.on("resign", function(msg) {
  if (msg.gameId == serverGame.id) {
    if (myplayer.kifuReader.node.move.c == 1) {
      game_over("白中盘胜");
    } else {
      game_over("黑中盘胜");
    }
    socket.emit("login", username);
  }
});

socket.on("joingame", function(msg) {
  console.log("joined as game id: " + msg.game.id);
  playerColor = msg.color;
  game = msg.game;
  initGame(msg.game, playerColor);
  renderRoom(msg);
});

socket.on("joingame", function(msg) {
  console.log("joined as game id: " + msg.game.id);
  playerColor = msg.color;
  game = msg.game;
  initGame(msg.game, playerColor);
});

socket.on("viewgame", function(msg) {
  console.log("viewed as game id: " + msg.game.id);
  game = msg.game;
  initViewGame(msg.game);
});

socket.on("move", function(msg) {
  readyMove(msg);
});

socket.on("logout", function(msg) {
  removeUser(msg.username);
});

//Listen on new_message
socket.on("get_message", function(msg) {
  EventBus.$emit("get_message", msg);
});
