let myplayer, myboard;
var _ev_move, _ev_click, _ev_out;
var _ev_try_move, _ev_try_click, _ev_try_out;
var black_time, white_time;
// var w_number, b_number;
// import { socket } from "./socket";
import { EventBus } from "../index.js";
import { store } from "../_store/index.js";
var username, game;
var timer_loop = null; //定时器
var timer_minute = null; //读秒定时器
var _score_mode;
var score_selected = false;
var _marker, _isFirst;
var bconfirm = false;
var prepare_confirm = false;
var prepare_x;
var prepare_y;
var board_background;

//////////////////////////////
// game init
//////////////////////////////
const user = JSON.parse(sessionStorage.getItem("user"));
if (user) {
  board_background = "/static/" + user.background;
}
export function testing() {
  // store.state.games.BL = 90;
  store.commit("games/setBL", 180);
  alert(store.state.games.BL);
}

export function initGame(ele, gameinfo) {
  if (myplayer != null) myplayer = null;
  black_time = gameinfo.total_time;
  white_time = gameinfo.total_time;
  // w_number = gameinfo.number;
  // b_number = gameinfo.number;
  EventBus.$emit("w_timeout", white_time);
  EventBus.$emit("b_timeout", black_time);
  EventBus.$emit("b_number", gameinfo.number);
  EventBus.$emit("w_number", gameinfo.number);
  myplayer = new WGo.BasicPlayer(ele, {
    sgf:
      "(;SZ[19]TM[" +
      gameinfo.total_time +
      "]KM[7.5]" +
      "DT[" +
      getTime() +
      "]" +
      "PB[" +
      gameinfo.blackOne +
      "&" +
      gameinfo.blackTwo +
      "]PW[" +
      gameinfo.whiteOne +
      "&" +
      gameinfo.whiteTwo +
      "])",
    enableWheel: false,
    enableKeys: false,
    layout: {
      // you can use static or dynamic layout
      // top: ["InfoBox"],
      bottom: ["Control"],
    },
    board: {
      background: board_background,
    },
    update: update,
    // move: 1000
  });
  myboard = myplayer.board;
}
//监听提子个数的函数
function update(e) {
  if (e.node.move) {
    console.log("it my move");
    EventBus.$emit("caps", {
      black: e.position.capCount.black,
      white: e.position.capCount.white,
    });
  }
}
export function gotoStep(value) {
  myplayer.goTo(value);
  console.log(myplayer.kifu.nodeCount);
}
export function getTotalStep() {
  return myplayer.kifu.nodeCount;
}

var butupd_last = function(e) {
  EventBus.$emit("go_move", e.path.m);

  // if (!e.node.children.length ) this.disable();
  // else if (e.node.children.length) this.enable();
};

export function kifuViewGame(ele, kifu) {
  myplayer = new WGo.BasicPlayer(ele, {
    sgf: kifu.kifu_data,
    enableWheel: false,
    enableKeys: false,
    layout: {
      // you can use static or dynamic layout
      // top: ["InfoBox"],
      bottom: ["Control"],
    },
    board: {
      background: board_background,
    },
    update: butupd_last,
    // move: 1000
  });
  myboard = myplayer.board;
  // myplayer.last();
}

function getTime() {
  var date = new Date();
  var str =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  return str;
}

export function initResumeGame(ele, gameinfo, result) {
  if (myplayer != null) myplayer = null;
  if (gameinfo.BL === "" && gameinfo.WL === "") {
    black_time = gameinfo.total_time;
    white_time = gameinfo.total_time;
    // b_number = 3;
    // w_number = 3;
  } else {
    black_time = gameinfo.BL;
    white_time = gameinfo.WL;
    // b_number = gameinfo.b_number;
    // w_number = gameinfo.w_number;
  }

  EventBus.$emit("w_timeout", white_time);
  EventBus.$emit("b_timeout", black_time);
  EventBus.$emit("b_number", gameinfo.b_number);
  EventBus.$emit("w_number", gameinfo.w_number);

  if (gameinfo.kifu == "") {
    myplayer = new WGo.BasicPlayer(ele, {
      sgf:
        "(;SZ[19]TM[" +
        gameinfo.total_time +
        "]KM[7.5]" +
        "DT[" +
        getTime() +
        "]" +
        "PB[" +
        gameinfo.users.black1 +
        "&" +
        gameinfo.users.black2 +
        "]PW[" +
        gameinfo.users.white1 +
        "&" +
        gameinfo.users.white2 +
        "])",
      enableWheel: false,
      enableKeys: false,
      layout: {
        // you can use static or dynamic layout
        // top: ["InfoBox"],
        bottom: ["Control"],
      },
      board: {
        background: board_background,
      },
      update: update,
      frozen: function(e) {
        console.log("> Player is now frozen.\n");
      },
      unfrozen: function(e) {
        console.log("> Player is no longer frozen.\n");
      },
      // move: 1000
    });
  } else {
    myplayer = new WGo.BasicPlayer(ele, {
      sgf: gameinfo.kifu,
      enableWheel: false,
      enableKeys: false,
      layout: {
        // you can use static or dynamic layout
        // top: ["InfoBox"],
        bottom: ["Control"],
      },
      board: {
        background: board_background,
      },
      update: update,
      // move: 1000
    });
  }

  myboard = myplayer.board;
  myplayer.last();
  // move_play(myplayer, gameinfo.move.x, gameinfo.move.y);
  // if (!isView)
  if (result == "begin") {
    var step = enable_board();
    if (step !== 0) read_time();
  } else if (result == "passed") {
    setPassedStatus();
  }
}

// board mouseout callback for edit move
var edit_board_mouse_out = function() {
  if (prepare_confirm == true) return;
  if (this._last_mark) {
    myboard.removeObject(this._last_mark);
    delete this._last_mark;
    delete this._lastX;
    delete this._lastY;
  }
};

export function isPc() {
  var userAgentInfo = navigator.userAgent;
  var Agents = new Array(
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod"
  );
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

//board mouse move event
var edit_board_mouse_move = function(x, y) {
  if (prepare_confirm == true && isPc()) return;
  // if (prepare_confirm == true) return;
  if (myplayer.frozen || (this._lastX == x && this._lastY == y)) return;

  this._lastX = x;
  this._lastY = y;
  // console.log("x value is " + x + ",y value is " + y)
  if (this._last_mark) {
    myboard.removeObject(this._last_mark);
  }

  if (x != -1 && y != -1 && myplayer.kifuReader.game.isValid(x, y)) {
    this._last_mark = {
      type: "outline",
      // type: "red_dot",
      x: x,
      y: y,
      c: myplayer.kifuReader.game.turn,
    };
    myboard.addObject(this._last_mark);
  } else {
    delete this._last_mark;
  }
};

//play a move
export function play(x, y) {
  // ignore invalid move
  if (myplayer.frozen || !myplayer.kifuReader.game.isValid(x, y)) return;
  // var con = confirm("确认落子吗?");

  var node;

  // create new node
  if (x == null && y == null) {
    node = new WGo.KNode({
      move: {
        pass: true,
        c: myplayer.kifuReader.game.turn,
      },
      BL: black_time,
      WL: white_time,
      _edited: true,
    });
    // return;
  } else {
    node = new WGo.KNode({
      move: {
        x: x,
        y: y,
        c: myplayer.kifuReader.game.turn,
      },
      BL: black_time,
      WL: white_time,
      _edited: true,
    });
  }

  if (bconfirm == false) {
    prepare_confirm = true;
    if (prepare_x == null && prepare_y == null)
      (prepare_x = x), (prepare_y = y);
    if (!isPc()) {
      (prepare_x = x), (prepare_y = y);
    }
    EventBus.$emit("confirmTurn", true);
    return;
  }
  let move = {
    x: x,
    y: y,
    c: myplayer.kifuReader.game.turn,
  };
  // socket.emit('move', { move: move, gameId: serverGame.id, board: game.fen() });

  // append new node to the current kifu
  myplayer.kifuReader.node.appendChild(node);
  // show next move
  myplayer.next(myplayer.kifuReader.node.children.length - 1);
  myplayer.kifu.nodeCount++;
  disable_board();
  read_time();
  var data = {
    move: move,
    gameId: game.gameId,
    kifu: myplayer.kifu.toSgf(),
    BL: black_time,
    WL: white_time,
    b_number: store.state.games.B_number,
    w_number: store.state.games.W_number,
  };
  console.log("current move data is:" + data);
  EventBus.$emit("move", data);
}

function add_event() {
  _ev_move = _ev_move || edit_board_mouse_move.bind(myboard);
  _ev_out = _ev_out || edit_board_mouse_out.bind(myboard);
  _ev_click = _ev_click || play.bind(myboard);
  myboard.addEventListener("mousemove", _ev_move);
  myboard.addEventListener("click", _ev_click);
  myboard.addEventListener("mouseout", _ev_out);
  EventBus.$emit("yourturn", "");
}

export function disable_board() {
  // clear_time();
  getWhichTurn();
  myboard.removeEventListener("click", _ev_click);
  myboard.removeEventListener("mousemove", _ev_move);
  myboard.removeEventListener("mouseout", _ev_out);
}

export function clear_time() {
  clearTimeout(timer_loop);
}

export function clear_minute() {
  clearTimeout(timer_minute);
}
//clear all timer
export function clear_all() {
  clear_time();
  clear_minute();
}

// export function set_b_number(value) {
//   b_number = value;
// }

// export function set_w_number(value) {
//   w_number = value;
// }

var read_minute = function() {
  clearTimeout(timer_minute);
  if (myplayer.kifuReader.node.move.c == -1) {
    if (myplayer.kifuReader.node.BL == 0) {
      // game_over("白超时胜");
      // 进入给黑读秒
      // EventBus.$emit("timeout", "白超时胜");
      EventBus.$emit("clear_readTime", {
        black_time: black_time,
        white_time: white_time,
      });
      timer_minute = setInterval(function() {
        EventBus.$emit("b_readTime", "black");
        // clear_time();
      }, 1000);
    }
  } else {
    if (myplayer.kifuReader.node.WL == 0) {
      // game_over("白超时胜");
      // 进入给黑读秒
      // EventBus.$emit("timeout", "白超时胜");
      // clear_time();
      EventBus.$emit("clear_readTime", {
        black_time: black_time,
        white_time: white_time,
      });
      timer_minute = setInterval(function() {
        EventBus.$emit("w_readTime", "white");
        // clear_time();
      }, 1000);
    }
  }
};

var read_time = function() {
  console.log("clear event bus");
  clearTimeout(timer_loop);
  clearTimeout(timer_minute);

  if (myplayer.kifuReader.node.move.c == -1) {
    if (myplayer.kifuReader.node.BL > 0) {
      timer_loop = setInterval(function() {
        console.log("still in interval");
        if (black_time == 0) {
          clearTimeout(timer_loop);
          read_minute();
        } else {
          black_time -= 1;
          myplayer.kifuReader.node.BL = black_time;
          EventBus.$emit("b_timeout", black_time);
          console.log("main time is reduced");
        }
        // myplayer.update();
      }, 1000); //读主时间
    } else {
      read_minute(); //读秒
    }
  } else {
    if (myplayer.kifuReader.node.WL > 0) {
      timer_loop = setInterval(function() {
        console.log("still in interval");

        // myplayer.update();

        // game_over("黑超时胜");
        // 进入给黑读秒
        // EventBus.$emit("timeout", "黑超时胜");
        // EventBus.$emit("w_readTime", "white");
        // clear_time();
        if (white_time == 0) {
          clearTimeout(timer_loop);
          read_minute();
        } else {
          white_time -= 1;
          myplayer.kifuReader.node.WL = white_time;
          EventBus.$emit("w_timeout", white_time);
          console.log("main time is reduced");
        }
      }, 1000); //读主时间
    } else {
      read_minute(); //读秒
    }
  }

  // myplayer.update();
};

var move_play = function(player, x, y) {
  // ignore invalid move
  if (player.frozen || !player.kifuReader.game.isValid(x, y)) return;

  var node;

  // show next move
  console.log("this is last total " + player.kifu.nodeCount);
  console.log("this is current total " + player.kifuReader.path.m);
  if (player.kifu.nodeCount == player.kifuReader.path.m) {
    // create new node
    if (x == null) {
      node = new WGo.KNode({
        move: {
          pass: true,
          c: player.kifuReader.game.turn,
        },
        BL: black_time,
        WL: white_time,
        _edited: true,
      });
      // return;
    } else {
      node = new WGo.KNode({
        move: {
          x: x,
          y: y,
          c: player.kifuReader.game.turn,
        },
        BL: black_time,
        WL: white_time,
        _edited: true,
      });
    }
    player.kifuReader.node.appendChild(node);
    player.next(player.kifuReader.node.children.length - 1);
  } else {
    var m = player.kifuReader.path.m;
    player.kifuReader.last();
    // create new node
    if (x == null) {
      node = new WGo.KNode({
        move: {
          pass: true,
          c: player.kifuReader.game.turn,
        },
        BL: black_time,
        WL: white_time,
        _edited: true,
      });
      // return;
    } else {
      node = new WGo.KNode({
        move: {
          x: x,
          y: y,
          c: player.kifuReader.game.turn,
        },
        BL: black_time,
        WL: white_time,
        _edited: true,
      });
    }
    player.kifuReader.node.appendChild(node);
    player.update();
    gotoStep(m);
  }
  player.kifu.nodeCount++;
  // console.log(player.kifuReader.game.position)
  //   // append new node to the current kifu

  // } else {
  //   player.last();
  //   player.kifuReader.node.appendChild(node);
  // }
  read_time();
};
//获得现在是黑骡子，还是白骡子
export function getGameTurn() {
  return myplayer.kifuReader.game.turn;
}

export function game_over(result) {
  clearTimeout(timer_loop);
  let node = new WGo.KNode({
    RE: result,
  });
  // append new node to the current kifu
  myplayer.kifuReader.node.appendChild(node);

  myplayer.kifu.info["RE"] = result;
  // myplayer.kifu.info['BL'] = black_time;
  // myplayer.kifu.info['WL'] = white_time;
  myplayer.loadSgf(myplayer.kifu.toSgf());
  myplayer.last();
  myplayer.kifuReader.node.WL = white_time;
  myplayer.kifuReader.node.BL = black_time;

  myplayer.update();
  alert(result);
  disable_board();

  return myplayer.kifu.toSgf();
}

export function setConfirm(value) {
  if (value) {
    bconfirm = value;
    prepare_confirm = false;
    play(prepare_x, prepare_y);
  } else {
    bconfirm = value;
    prepare_confirm = false;
    if (myboard._last_mark) myboard.removeObject(myboard._last_mark);
  }
  prepare_x = null;
  prepare_y = null;
}
//显示坐标
export function toggleCoordinates(value) {
  myplayer.setCoordinates(!myplayer.coordinates);
}
// 正在申请悔棋操作！
export function regretCurrentGame() {
  myplayer.kifuReader.node.remove();
  myplayer.loadSgf(myplayer.kifu.toSgf());
  myplayer.last();
  disable_board();
  enable_board();
  read_time();
}
//获得当前对局棋谱
export function getKifu() {
  return myplayer.kifu.toSgf();
}
//显示手数功能
export function showMarker() {
  _marker = _marker || new WGo.Player.Marker(myplayer, myplayer.board);
  if (!_isFirst) {
    myplayer.config.markLastMove = false;
    _marker.clearDefaultSytle();
    _marker.switchMaker();
    _isFirst = true;
  } else if (
    _marker.config.markerStyle == "LB" &&
    _marker.config.markerNum != 0
  ) {
    _marker.switchMaker({
      markerNum: 0,
    });
  } else if (
    _marker.config.markerStyle == "LB" &&
    _marker.config.markerNum == 0
  ) {
    _marker.switchMaker({
      markerStyle: "TRS",
      markerNum: 1,
    });
  } else {
    _marker.switchMaker({
      markerStyle: "LB",
      markerNum: 5,
    });
  }
}

export function initGameData(_username, _game) {
  username = _username;
  game = _game;
}

export function getResult() {
  let result = "";
  if (myplayer.kifuReader.node.move.c == 1) {
    result = "白中盘胜";
  } else {
    result = "黑中盘胜";
  }
  return result;
}

//获取比赛结果和棋谱
export function gameResign(result) {
  let kifu = game_over(result);
  return { result: result, kifu: kifu, game: game.id };
}

export function getWhichTurn() {
  var last_steps;
  if (myplayer.kifuReader) {
    last_steps = myplayer.kifuReader.path.m;
  } else {
    last_steps = 0;
  }
  var turn = last_steps % 4;
  EventBus.$emit("myturn", turn);
  return turn;
}

// board mouseout callback for edit move
var try_board_mouse_out = function() {
  if (this._last_mark) {
    myboard.removeObject(this._last_mark);
    delete this._last_mark;
    delete this._lastX;
    delete this._lastY;
  }
};

//board mouse move event,试下
var try_board_mouse_move = function(x, y) {
  // if (prepare_confirm == true) return;
  if (myplayer.frozen || (this._lastX == x && this._lastY == y)) return;

  this._lastX = x;
  this._lastY = y;
  // console.log("x value is " + x + ",y value is " + y)
  if (this._last_mark) {
    myboard.removeObject(this._last_mark);
  }

  if (x != -1 && y != -1 && myplayer.kifuReader.game.isValid(x, y)) {
    this._last_mark = {
      type: "outline",
      // type: "red_dot",
      x: x,
      y: y,
      c: myplayer.kifuReader.game.turn,
    };
    myboard.addObject(this._last_mark);
  } else {
    delete this._last_mark;
  }
};

//play a move，试下
var try_play = function(x, y) {
  // ignore invalid move
  if (myplayer.frozen || !myplayer.kifuReader.game.isValid(x, y)) return;
  // var con = confirm("确认落子吗?");

  var node;

  // create new node
  if (x == null) {
    node = new WGo.KNode({
      move: {
        pass: true,
        c: myplayer.kifuReader.game.turn,
      },
      BL: black_time,
      WL: white_time,
      _edited: true,
    });
    return;
  } else {
    node = new WGo.KNode({
      move: {
        x: x,
        y: y,
        c: myplayer.kifuReader.game.turn,
      },
      BL: black_time,
      WL: white_time,
      _edited: true,
    });
  }

  let move = {
    x: x,
    y: y,
    c: myplayer.kifuReader.game.turn,
  };

  // append new node to the current kifu
  myplayer.kifuReader.node.appendChild(node);
  // show next move
  myplayer.next(myplayer.kifuReader.node.children.length - 1);
};

export function enable_try() {
  _ev_try_move = _ev_try_move || try_board_mouse_move.bind(myboard);
  _ev_try_out = _ev_try_out || try_board_mouse_out.bind(myboard);
  _ev_try_click = _ev_try_click || try_play.bind(myboard);
  myboard.addEventListener("mousemove", _ev_try_move);
  myboard.addEventListener("click", _ev_try_click);
  myboard.addEventListener("mouseout", _ev_try_out);
}

export function disable_try() {
  myboard.removeEventListener("click", _ev_try_click);
  myboard.removeEventListener("mousemove", _ev_try_move);
  myboard.removeEventListener("mouseout", _ev_try_out);
}
//enable board so it can play
export function enable_board() {
  var last_steps;
  if (myplayer.kifuReader) {
    last_steps = myplayer.kifuReader.path.m;
  } else {
    last_steps = 0;
  }
  var turn = last_steps % 4;
  EventBus.$emit("myturn", turn);
  if (turn == 0 && username == game.users.black1) {
    //black 0
    add_event();
  }
  if (turn == 1 && username == game.users.white1) {
    //white 0

    add_event();
  }
  if (turn == 2 && username == game.users.black2) {
    //black 1

    add_event();
  }
  if (turn == 3 && username == game.users.white2) {
    //white 1

    add_event();
  }
  return last_steps;
}

export function readyMove(msg) {
  black_time = msg.BL;
  white_time = msg.WL;
  move_play(myplayer, msg.move.x, msg.move.y);
  // if (!isView)
  disable_board();
  enable_board();
}

/* export function resumeGame(msg) {
  game = msg.game;
  black_time = game.BL;
  white_time = game.WL;
  myplayer.loadSgf(game.kifu);
  myplayer.last();
  move_play(myplayer, game.move.x, game.move.y);
  // if (!isView)
  enable_board();
  
} */
//回调函数，用于形势判断，获得判断的结果
function showScoreResult(msg) {
  console.log(msg);
  EventBus.$emit("showScore", msg);
}

export function setPassedStatus() {
  disable_board();
  clearTimeout(timer_loop);
}
//显示数子结果
export function showScore() {
  if (score_selected) {
    myplayer.setFrozen(false);
    _score_mode.end();
    // delete _score_mode;
    myplayer.notification();
    myplayer.help();
    score_selected = false;
    return "";
  } else {
    myplayer.setFrozen(true);
    showScoreResult("<p>" + WGo.t("help_score") + "</p>");
    _score_mode = new WGo.ScoreMode(
      myplayer.kifuReader.game.position,
      myplayer.board,
      myplayer.kifu.info.KM || 7.5,
      // myplayer.notification
      showScoreResult
    );

    score_selected = true;
    return _score_mode.start();
  }
}

export function showViewScore(value) {
  if (value) {
    myplayer.setFrozen(false);
    _score_mode.end();
    // delete _score_mode;
    myplayer.notification();
    myplayer.help();
    return "";
  } else {
    myplayer.setFrozen(true);
    showScoreResult("<p>" + WGo.t("help_score") + "</p>");
    _score_mode = new WGo.ScoreMode(
      myplayer.kifuReader.game.position,
      myplayer.board,
      myplayer.kifu.info.KM || 7.5,
      // myplayer.notification
      showScoreResult
    );
    return _score_mode.start();
  }
}
