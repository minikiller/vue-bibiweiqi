/**
 * 处理websocket相关的业务方法
 */
import config from "config";

var usersOnline = [];
var myGames, allGames;
export let socketServer = "dfdfdf";

export let socket = io.connect(`${config.socketUrl}`);

import { EventBus } from "../index.js";
// var connection = new RTCMultiConnection();

//////////////////////////////
// Socket.io handlers
//////////////////////////////

socket.on("login", function(msg) {
  usersOnline = msg.users;
  // updateUserList();
  EventBus.$emit("fetchdata", msg);
  myGames = msg.games;
  // updateGamesList();

  allGames = msg.allgames;
  // updateAllGamesList();
});

//用户进入对局室
socket.on("joinlobby", function (msg) {
  EventBus.$emit("joinlobbye", msg);
  // addUser(msg);
});
//用户立刻对局室
socket.on("leavelobby", function (msg) {
  EventBus.$emit("get_message", msg);
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

    // $('#page-lobby').show();
    // $('#page-game').hide();
  }
});

socket.on("joingame", function(msg) {
  console.log("joined as game id: " + msg.game.id);
  playerColor = msg.color;
  game = msg.game;
  initGame(msg.game, playerColor);
  renderRoom(msg);
  // $('#page-lobby').hide();
  // $('#page-game').show();
  // connection.userid = username;
  // connection.openOrJoin(msg.game.id);
  $("#page-lobby").hide();
  $("#page-game").css("visibility", "visible");
});

socket.on("joingame", function(msg) {
  console.log("joined as game id: " + msg.game.id);
  playerColor = msg.color;
  game = msg.game;
  initGame(msg.game, playerColor);
  renderRoom(msg);
  // $('#page-lobby').hide();
  // $('#page-game').show();
  $("#page-lobby").hide();
  $("#page-game").css("visibility", "visible");
});

socket.on("viewgame", function(msg) {
  console.log("viewed as game id: " + msg.game.id);
  game = msg.game;

  // playerColor = msg.color;
  initViewGame(msg.game);
  renderRoom(msg);
  $("#page-lobby").hide();
  $("#page-game").css("visibility", "visible");
});

socket.on("move", function(msg) {
  if (serverGame && msg.gameId === serverGame.id) {
    // game.move(msg.move);
    // board.position(game.fen());
    black_time = msg.BL;
    white_time = msg.WL;
    move_play(myplayer, msg.move.x, msg.move.y);
    // if (!isView)
    enable_board();
  }
});

socket.on("logout", function(msg) {
  removeUser(msg.username);
});

//Listen on new_message
socket.on("get_message", function (msg) {
  EventBus.$emit("get_message", msg);
});
