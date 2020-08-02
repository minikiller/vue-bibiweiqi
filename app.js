var express = require("express");
/* const pino = require("pino");
const expressPino = require("express-pino-logger");

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  prettyPrint: { colorize: true },
});
const expressLogger = expressPino({ logger }); */

const log = require("./log");
var logger = require("./log").logger;

var app = express();
log.use(app);
// app.use(logger('dev'));
// var logger = require('./log').logger;

var fs = require("fs");
app.use(express.static("dist"));
var https = require("https");
// var http = require('http').Server(app);
var https = require("https").Server(
  {
    key: fs.readFileSync("privkey.pem"),
    cert: fs.readFileSync("cert.pem"),
  },
  app
);

var inspect = require("util").inspect;

// var io = require('socket.io')(http);
// var io = require("socket.io")(https, { pingInterval: 5000, pingTimeout: 5000 });
var io = require("socket.io")(https);
// io.set('heartbeat timeout', 5000);
// io.set('heartbeat interval', 2000);

var port = process.env.PORT || 3000;

https.listen(port, function() {
  logger.info("Server running on port %d", port);
});

const redis_client = require("redis").createClient();

var lobbyUsers = {};
var users = {}; //保存用户所在的game信息
var activeGames = {}; //正在进行的对局字典
var activeUsers = {}; //正在进行对局的用户字典
var gameInfos = {}; //存储对局室的信息
var gameStatus = {}; //game对局者是否准备的信息
var gamePassed = {}; //game对局者是否终局的信息
var hbeat = {};
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
  // res.sendFile(__dirname + "/public/index.html");
});

// Redis Client Ready
redis_client.once("ready", () => {
  // Flush Redis DB
  // client.flushdb();

  // Initialize gameInfos
  redis_client.get("gameInfos", function(err, reply) {
    if (reply) {
      gameInfos = JSON.parse(reply);
    }
  });

  // Initialize gameStatus
  redis_client.get("gameStatus", function(err, reply) {
    if (reply) {
      gameStatus = JSON.parse(reply);
    }
  });

  // Initialize gamePassed
  redis_client.get("gamePassed", function(err, reply) {
    if (reply) {
      gamePassed = JSON.parse(reply);
    }
  });

  // Initialize activeUsers
  redis_client.get("activeUsers", function(err, reply) {
    if (reply) {
      activeUsers = JSON.parse(reply);
    }
  });

  // Initialize activeGames
  redis_client.get("activeGames", function(err, reply) {
    if (reply) {
      activeGames = JSON.parse(reply);
    }
  });
  // Initialize activeGames
  redis_client.get("users", function(err, reply) {
    if (reply) {
      users = JSON.parse(reply);
    }
  });
});

io.on("reconnect", function(socket) {
  logger.info("it is reconnect by it!");
});

io.on("connection", function(socket) {
  logger.info(getFormattedDate() + "new connection " + socket);
  // logger.info(inspect(socket))
  // if (socket.userId && users[socket.userId]) {
  //   socket.join(users[userId].gameId);
  //   logger.info("reconnect to room id is " + users[userId].gameId);
  // }
  //用户进入对局室的处理过程
  socket.on("login", function(msg) {
    logger.info(getFormattedDate() + " login " + inspect(msg));
    doLogin(socket, msg);
    io.sockets.in(msg.gameId).emit("prepare", gameStatus[msg.gameId]);
  });

  socket.conn.on("packet", (packet) => {
    if (packet.type === "ping") {
      logger.info(`Received ping from client ${socket.userId}`);
      logger.info(`Received ping from client ${socket.gameId}`);
    }
  });

  socket.conn.on("packetCreate", (packet) => {
    if (packet.type === "pong") {
      logger.info(`Sending pong to client. ${socket.userId}`);
    }
  });

  function doLogin(socket, msg) {
    let userId = msg.userId;
    let gameId = msg.gameId;
    socket.userId = msg.userId;
    socket.gameId = msg.gameId;
    userStatus = {};
    userPassed = {};
    if (!gameInfos[gameId]) {
      gameInfos[gameId] = msg.gameInfo;
      redis_client.set("gameInfos", JSON.stringify(gameInfos));
    }

    if (!gameStatus[gameId]) {
      if (msg.gameInfo) {
        userStatus[msg.gameInfo.blackone_id.name] = false;
        userStatus[msg.gameInfo.blacktwo_id.name] = false;
        userStatus[msg.gameInfo.whiteone_id.name] = false;
        userStatus[msg.gameInfo.whitetwo_id.name] = false;
        gameStatus[gameId] = userStatus;
        redis_client.set("gameStatus", JSON.stringify(gameStatus));
      }
    }

    if (!gamePassed[gameId]) {
      userPassed[msg.gameInfo.blackone_id.name] = false;
      userPassed[msg.gameInfo.blacktwo_id.name] = false;
      userPassed[msg.gameInfo.whiteone_id.name] = false;
      userPassed[msg.gameInfo.whitetwo_id.name] = false;
      gamePassed[gameId] = userPassed;
      redis_client.set("gamePassed", JSON.stringify(gamePassed));
    }

    if (!users[userId]) {
      logger.info(getFormattedDate() + "creating new user " + userId);
      users[userId] = { userId: socket.userId, games: gameId, prepared: false };
      redis_client.set("users", JSON.stringify(users));
    } else {
      logger.info("user found!");
      // Object.keys(users[userId].games).forEach(function(gameId) {
      //   logger.info(getFormattedDate() + "gameid - " + gameId);
      // });
      if (users[userId].games == gameId) {
        logger.info("user in same game room");
      } else {
        logger.info("user in new game room");
        users[userId].games = gameId;
      }
    }
    // socket.emit("login", userinGame[gameId]);
    lobbyUsers[userId] = socket;
    socket.join(gameId, () => {}); //进入对局室
    io.in(gameId).clients((err, clients) => {
      logger.info("room has client is: " + clients); // an array containing socket ids in 'room3'
    });
    // io.sockets.in(gameId).emit("joinlobby", userId);
    // 给房间内的所有人发送新人进入对局室消息，不包括sender本身
    socket.broadcast.to(gameId).emit("joinlobby", userId);
    //获得当前房间的所有人员信息列表
    let game_users = [];
    for (key in users) {
      if (users[key].games == gameId) {
        game_users.push(users[key].userId);
      }
    }
    //给新登陆的用户发送当前房间的所有人员信息列表
    socket.emit("initGameUser", game_users);
  }

  //准备开始终局
  socket.on("passedGame", function(msg) {
    gamePassed[msg.gameId][msg.userId] = true;
    if (checkGamePassed(msg.gameId)) {
      activeGames[msg.gameId].result = "passed";
      var black1 = activeGames[msg.gameId].users.black1;
      var white1 = activeGames[msg.gameId].users.white1;
      var result = `进入数子状态，由${black1}数子，由${white1}确认结果！如有异议，${white1}数子，${black1}确认！`;
      io.sockets.in(msg.gameId).emit("endGame", result);
    } else {
      io.sockets.in(msg.gameId).emit("passed", getUserPassed(msg.gameId));
    }
    redis_client.set("activeGames", JSON.stringify(activeGames));
    redis_client.set("gamePassed", JSON.stringify(gamePassed));
  });
  //数子结果
  socket.on("resultGame", function(msg) {
    socket.broadcast.to(msg.gameId).emit("resultGame", msg);
  });

  //数子双方未达成一致
  socket.on("noagreeGame", function(msg) {
    logger.info("noagreeGame is received!");
    socket.broadcast.to(msg.gameId).emit("noagreeGame", msg);
  });

  //数子结束，双方达成一致
  socket.on("finishGame", function(msg) {
    logger.info("finish game is received!");
    clearGame(msg);
    io.sockets.in(msg.gameId).emit("finishGame", msg);
  });

  //正在申请悔棋操作！
  socket.on("regretGame", function(msg) {
    logger.info("regret game is received!");
    io.sockets.in(msg.gameId).emit("regretGame", msg);
  });

  //同意悔棋操作！
  socket.on("failRegretGame", function(msg) {
    logger.info("failRegretGame game is received!");
    io.sockets.in(msg.gameId).emit("failRegretGame", msg);
  });

  //不同意悔棋操作！
  socket.on("successRegretGame", function(msg) {
    logger.info("successRegretGame game is received!");
    io.sockets.in(msg.gameId).emit("successRegretGame", msg);
  });

  //判断是否可以进入终局状态
  function checkGamePassed(gameId) {
    var userPassed = gamePassed[gameId];
    for (var key in userPassed) {
      if (!userPassed[key]) {
        return false;
      }
    }
    return true;
  }

  //查看棋局终局的准备状态
  function getUserPassed(gameId) {
    let str = [];
    let ok;
    var userPassed = gamePassed[gameId];
    for (var key in userPassed) {
      if (!userPassed[key]) {
        ok = `${key} 还没有进入终局；`;
      } else {
        ok = `${key} 已经进入终局；`;
      }
      str.push(ok);
    }
    let value = "";
    str.forEach((v) => {
      value = value + v;
    });
    return str;
  }

  //准备开始对局
  socket.on("prepareGame", function(msg) {
    // users[msg.userId].prepared = true;
    gameStatus[msg.gameId][msg.userId] = true;
    // io.sockets.in(msg.gameId).emit("prepare", getUserStatus(msg.gameId));
    io.sockets.in(msg.gameId).emit("prepare", gameStatus[msg.gameId]);

    if (checkGameStatus(msg.gameId)) {
      //进入对局状态
      var game = {
        users: {
          black1: gameInfos[msg.gameId].blackone_id.name,
          black2: gameInfos[msg.gameId].blacktwo_id.name,
          white1: gameInfos[msg.gameId].whiteone_id.name,
          white2: gameInfos[msg.gameId].whitetwo_id.name,
        },
        kifu: "",
        total_time: gameInfos[msg.gameId].total_time,
        BL: "",
        WL: "",
        move: null,
        gameId: msg.gameId,
        result: "begin",
      };
      activeUsers[gameInfos[msg.gameId].blackone_id.name] = msg.gameId;
      activeUsers[gameInfos[msg.gameId].blacktwo_id.name] = msg.gameId;
      activeUsers[gameInfos[msg.gameId].whiteone_id.name] = msg.gameId;
      activeUsers[gameInfos[msg.gameId].whitetwo_id.name] = msg.gameId;
      activeGames[msg.gameId] = game; //保存新的对局
      redis_client.set("activeUsers", JSON.stringify(activeUsers));
      redis_client.set("activeGames", JSON.stringify(activeGames));
      io.sockets.in(msg.gameId).emit("beginGame", game);
    }
  });
  //查看棋局开始的准备状态
  function getUserStatus(gameId) {
    let str = [];
    let ok;
    var userStatus = gameStatus[gameId];
    for (var key in userStatus) {
      if (!userStatus[key]) {
        ok = `${key} 还没有开始对局；`;
      } else {
        ok = `${key} 已经开始对局；`;
      }
      str.push(ok);
    }
    let value = "";
    str.forEach((v) => {
      value = value + v;
    });
    return str;
  }
  //判断是否可以进入对局状态
  function checkGameStatus(gameId) {
    var userStatus = gameStatus[gameId];
    for (var key in userStatus) {
      if (!userStatus[key]) {
        return false;
      }
    }
    return true;
  }

  //悔棋同意后，更新本地棋谱
  socket.on("updateRegretKifu", function(msg) {
    activeGames[msg.gameId].kifu = msg.kifu;
  });

  //落子事件
  socket.on("move", function(msg, callback) {
    socket.broadcast.to(msg.gameId).emit("move", msg);
    // activeGames[msg.gameId].board = msg.board;
    activeGames[msg.gameId].kifu = msg.kifu;
    activeGames[msg.gameId].BL = msg.BL;
    activeGames[msg.gameId].WL = msg.WL;
    activeGames[msg.gameId].move = msg.move;
    redis_client.set("activeGames", JSON.stringify(activeGames));
    // allGames[msg.gameId].kifu = msg.kifu;
    logger.info(getFormattedDate() + "move data is " + msg.move);
    logger.info(getFormattedDate() + "kifu data is " + msg.kifu);
    callback("ok");
  });

  //检查用户是否有正在进行的对局
  socket.on("resume", function(msg) {
    if (activeUsers[msg.userId] !== undefined) {
      var gameId = activeUsers[msg.userId];
      socket.userId = msg.userId;
      socket.gameId = msg.gameId;
      var game = activeGames[gameId];
      var result = activeGames[gameId].result;
      socket.join(gameId, () => {});
      socket.emit("resume", {
        gameId: gameId,
        game: game,
        result: result,
      });
    }
  });

  //用户观战正在进行的对局
  socket.on("view", function(msg) {
    game = activeGames[msg.gameId];
    socket.emit("view", {
      gameId: msg.gameId,
      game: game,
    });
  });

  socket.on("logout", function(msg) {
    socket.leave(msg.gameId, () => {
      logger.info(socket.adapter.rooms);
      io.in(msg.gameId).clients((err, clients) => {
        logger.info("leave room client is " + clients); // an array containing socket ids in 'room3'
      });
      socket.broadcast.to(msg.gameId).emit("leavelobby", msg.userId);
      delete users[msg.userId];

      redis_client.set("users", JSON.stringify(users));
    });
  });

  socket.on("viewgame", function(msg) {
    logger.info(getFormattedDate() + "ready to view game: " + msg.gameId);

    socket.gameId = msg.gameId;
    var game = activeGames[msg.gameId];
    if (game.users.black0 == 0) {
      game.users.black0 = socket.userId;
    } else if (game.users.white0 == 0) {
      game.users.white0 = socket.userId;
    }
    logger.info(getFormattedDate() + "begin to view game: " + msg.gameId);
    lobbyUsers[msg.userId].emit("viewgame", { game: game });
  });

  /* socket.on("resumegame", function(gameId) {
    logger.info(getFormattedDate() + "ready to resume game: " + gameId);

    socket.gameId = gameId;
    var game = activeGames[gameId];

    users[game.users.white].games[game.id] = game.id;
    users[game.users.black].games[game.id] = game.id;

    logger.info(getFormattedDate() + "resuming game: " + game.id);
    if (lobbyUsers[game.users.white]) {
      lobbyUsers[game.users.white].emit("joingame", {
        game: game,
        color: "white",
      });
      delete lobbyUsers[game.users.white];
    }

    if (lobbyUsers[game.users.black]) {
      lobbyUsers[game.users.black] &&
        lobbyUsers[game.users.black].emit("joingame", {
          game: game,
          color: "black",
        });
      delete lobbyUsers[game.users.black];
    }
  }); */

  function clearGame(msg) {
    if (activeGames[msg.gameId]) {
      delete activeUsers[activeGames[msg.gameId].users.black1];
      delete activeUsers[activeGames[msg.gameId].users.black2];
      delete activeUsers[activeGames[msg.gameId].users.white1];
      delete activeUsers[activeGames[msg.gameId].users.white2];
      delete activeGames[msg.gameId];
      delete gameInfos[msg.gameId]; //存储对局室的信息
      delete gameStatus[msg.gameId]; //game对局者是否准备的信息
      redis_client.set("activeUsers", JSON.stringify(activeUsers));
      redis_client.set("activeGames", JSON.stringify(activeGames));
      redis_client.set("gameInfos", JSON.stringify(gameInfos));
      redis_client.set("gameStatus", JSON.stringify(gameStatus));
    }
  }

  socket.on("resignGame", function(msg) {
    logger.info(getFormattedDate() + "resign: " + msg);
    logger.info(activeGames[msg.gameId]);
    clearGame(msg);

    // socket.broadcast.emit("resign", msg);
    io.sockets.in(msg.gameId).emit("resign", msg);
  });

  socket.on("hello", function(msg, callback) {
    // socket.broadcast.emit("resign", msg);
    io.in(msg.gameId).clients((err, clients) => {
      logger.info(clients); // an array containing socket ids in 'room3'
    });
    callback("test", "etste", "hlloe");
    logger.info(socket.adapter.rooms);
    // socket.emit("helloMsg", msg);
    // socket.emit("hello_you", msg);
    // socket.emit("first", msg);
    io.in(msg.gameId).emit("helloMsg", msg);
    // socket.broadcast.to(msg.gameId).emit('hello', 'nice game');
  });

  //listen on new_message
  socket.on("new_message", function(msg) {
    logger.info(
      getFormattedDate() +
        "chat message received!" +
        msg.message +
        " user id is: " +
        socket.userId
    );
    //给房间内的其他用户发送消息，不包括sender本身
    io.sockets.in(msg.gameId).emit("get_message", msg);
    /* socket.broadcast.to(data.gameId).emit("get_message", {
      message: data.message,
      username: socket.userId,
      gameId: data.gameId,
    }); */
  });
  //用户掉线后重连
  socket.on("registerToRoom", function(msg) {
    logger.info("socket is join to room id " + msg.gameId);
    doLogin(socket, msg);
    // socket.join(msg.gameId);
    if (activeGames[msg.gameId] !== undefined) {
      var game = activeGames[msg.gameId];
      var result = activeGames[msg.gameId].result;
      socket.emit("updateRoomGame", {
        gameId: msg.gameId,
        game: game,
        result: result,
      });
    }
  });

  socket.on("disconnect", function(msg) {
    logger.info(msg);

    if (socket && socket.userId && socket.gameId) {
      logger.info(
        getFormattedDate() + "user: " + socket.userId + " disconnected"
      );
      logger.info(
        getFormattedDate() + "game id: " + socket.gameId + " disconnected"
      );

      socket.broadcast.to(socket.gameId).emit("leavelobby", socket.userId);
    }

    delete lobbyUsers[socket.userId];
    delete users[socket.userId];
    socket.broadcast.emit("logout", {
      userId: socket.userId,
      gameId: socket.gameId,
    });
  });

  socket.on("heartbeat", function() {
    console.log("heartbeat called!");
    hbeat[socket.id] = Date.now();
    setTimeout(function() {
      var now = Date.now();
      if (now - hbeat[socket.id] > 5000) {
        console.log("this socket id will be closed " + socket.id);
        if (addedUser) {
          --onlineUsers;
          removeFromLobby(socket.id);
          try {
            // this is the most important part
            io.sockets.connected[socket.id].disconnect();
          } catch (error) {
            console.log(error);
          }
        }
      }
      now = null;
    }, 6000);
  });
});

function getFormattedDate() {
  var date = new Date();
  var str =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();
  str += " ";
  return str;
}

// http.listen(port, function() {
//     logger.info('listening on *: ' + port);
// });
