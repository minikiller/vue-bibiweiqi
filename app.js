var express = require("express");
var app = express();
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

// var io = require('socket.io')(http);
var io = require("socket.io")(https);

var port = process.env.PORT || 3000;

https.listen(port, function() {
  console.log("listening on *:" + port);
});

var lobbyUsers = {};
var users = {};
var activeGames = {};
var allGames = {};
var gameInfos = {};
var gameStatus = {}; //game对局者是否准备的信息
app.get("/", function(req, res) {
  // res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  res.sendFile(__dirname + "/public/index.html");
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

io.on("connection", function(socket) {
  console.log(getFormattedDate() + "new connection " + socket);

  socket.on("login", function(msg) {
    doLogin(socket, msg);
  });

  function doLogin(socket, msg) {
    let userId = msg.userId;
    let gameId = msg.gameId;
    socket.userId = msg.userId;
    userStatus = {};

    gameInfos[gameId] = msg.gameInfo;
    if (!gameStatus[gameId]) {
      userStatus[msg.gameInfo.blackone_id] = false;
      userStatus[msg.gameInfo.blacktwo_id] = false;
      userStatus[msg.gameInfo.whiteone_id] = false;
      userStatus[msg.gameInfo.whitetwo_id] = false;
      gameStatus[gameId] = userStatus;
    }

    if (!users[userId]) {
      console.log(getFormattedDate() + "creating new user " + userId);
      users[userId] = { userId: socket.userId, games: gameId, prepared: false };
    } else {
      console.log("user found!");
      // Object.keys(users[userId].games).forEach(function(gameId) {
      //   console.log(getFormattedDate() + "gameid - " + gameId);
      // });
      if (users[userId].games == gameId) {
        console.log("user in same game room");
      } else {
        console.log("user in new game room");
        users[userId].games = gameId;
      }
    }
    // socket.emit("login", userinGame[gameId]);
    lobbyUsers[userId] = socket;
    socket.join(gameId, () => {});

    // io.sockets.in(gameId).emit("joinlobby", userId);
    // 给房间内的所有人发送消息，不包括sender本身
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

  //准备开始对局
  socket.on("prepareGame", function(msg) {
    // users[msg.userId].prepared = true;
    gameStatus[msg.gameId][msg.userId] = true;
    io.sockets.in(msg.gameId).emit("prepare", getUserStatus(msg.gameId));

    if (checkGameStatus(msg.gameId)) {
      var game = {
        users: {
          black1: gameInfos[msg.gameId].blackone_id,
          black2: gameInfos[msg.gameId].blacktwo_id,
          white1: gameInfos[msg.gameId].whiteone_id,
          white2: gameInfos[msg.gameId].whitetwo_id,
        },
        kifu: "",
        gameId: msg.gameId,
      };
      activeGames[msg.gameId] = game; //保存新的对局
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
  //落子事件
  socket.on("move", function (msg) {
    
    socket.broadcast.to(msg.gameId).emit("move", msg);
    // activeGames[msg.gameId].board = msg.board;
    activeGames[msg.gameId].kifu = msg.kifu;
    // allGames[msg.gameId].kifu = msg.kifu;
    console.log(getFormattedDate() + "move data is " + msg.move);
    console.log(getFormattedDate() + "kifu data is " + msg.kifu);
  });

  socket.on("logout", function(msg) {
    socket.broadcast.to(msg.gameId).emit("leavelobby", msg.userId);
    socket.leave(msg.gameId);
    delete users[msg.userId];
  });

  socket.on("viewgame", function(msg) {
    console.log(getFormattedDate() + "ready to view game: " + msg.gameId);

    socket.gameId = msg.gameId;
    var game = activeGames[msg.gameId];
    if (game.users.black0 == 0) {
      game.users.black0 = socket.userId;
    } else if (game.users.white0 == 0) {
      game.users.white0 = socket.userId;
    }
    console.log(getFormattedDate() + "begin to view game: " + msg.gameId);
    lobbyUsers[msg.userId].emit("viewgame", { game: game });
  });

  socket.on("resumegame", function(gameId) {
    console.log(getFormattedDate() + "ready to resume game: " + gameId);

    socket.gameId = gameId;
    var game = activeGames[gameId];

    users[game.users.white].games[game.id] = game.id;
    users[game.users.black].games[game.id] = game.id;

    console.log(getFormattedDate() + "resuming game: " + game.id);
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
  });

  socket.on("resign", function(msg) {
    console.log(getFormattedDate() + "resign: " + msg);
    delete activeGames[msg.gameId];
    // socket.broadcast.emit("resign", msg);
    io.sockets.in(msg.gameId).emit("resign", msg);
  });

  //listen on new_message
  socket.on("new_message", function(data) {
    console.log(
      getFormattedDate() +
        "chat message received!" +
        data.message +
        " user id is: " +
        socket.userId
    );
    //给房间内的其他用户发送消息，不包括sender本身
    socket.broadcast.to(data.gameId).emit("get_message", {
      message: data.message,
      username: socket.userId,
      gameId: data.gameId,
    });
  });

  socket.on("disconnect", function(msg) {
    console.log(msg);

    if (socket && socket.userId && socket.gameId) {
      console.log(
        getFormattedDate() + "user: " + socket.userId + " disconnected"
      );
      console.log(
        getFormattedDate() + "game id: " + socket.gameId + " disconnected"
      );
    }

    delete lobbyUsers[socket.userId];

    socket.broadcast.emit("logout", {
      userId: socket.userId,
      gameId: socket.gameId,
    });
  });
});

// http.listen(port, function() {
//     console.log('listening on *: ' + port);
// });
