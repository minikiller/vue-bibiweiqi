let myplayer, myboard;
var _ev_move, _ev_click, _ev_out;
var black_time, white_time;
var serverGame;
import { socket } from "./socket";

//////////////////////////////
// game init
//////////////////////////////
export function initGame(ele, gameinfo) {

  black_time = gameinfo.total_time;
  white_time = gameinfo.total_time;
  myplayer = new WGo.BasicPlayer(ele, {
    sgf:
      "(;SZ[19]TM[" +
      gameinfo.total_time +
      "]KM[7.5]" +
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
    // move: 1000
  });
  myboard = myplayer.board;
}

// board mouseout callback for edit move
var edit_board_mouse_out = function() {
  if (this._last_mark) {
    myboard.removeObject(this._last_mark);
    delete this._last_mark;
    delete this._lastX;
    delete this._lastY;
  }
};

//board mouse move event
var edit_board_mouse_move = function(x, y) {
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
var play = function(x, y) {
  // ignore invalid move
  if (myplayer.frozen || !myplayer.kifuReader.game.isValid(x, y)) return;

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
  // socket.emit('move', { move: move, gameId: serverGame.id, board: game.fen() });

  // append new node to the current kifu
  myplayer.kifuReader.node.appendChild(node);

  // show next move
  myplayer.next(myplayer.kifuReader.node.children.length - 1);
  var data = {
    move: move,
    gameId: serverGame.id,
    kifu: myplayer.kifu.toSgf(),
    BL: black_time,
    WL: white_time,
  };
    socket.emit("move", data);

    disable_board();
  //   read_time();
};
export function beginGame() {
  _ev_move = _ev_move || edit_board_mouse_move.bind(myboard);
  _ev_out = _ev_out || edit_board_mouse_out.bind(myboard);
  _ev_click = _ev_click || play.bind(myboard);
  myboard.addEventListener("mousemove", _ev_move);
  myboard.addEventListener("click", _ev_click);
  myboard.addEventListener("mouseout", _ev_out);
}
export default {
  edit_board_mouse_out,
  play,
  edit_board_mouse_move,
};
