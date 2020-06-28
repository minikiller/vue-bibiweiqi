import config from "config";
import { authHeader, handleResponse } from "../_helpers";

export const gameService = {
  newGame,
  getAll,
  getById,
  saveKifu,
  beginGame,
  completeGame,
  deleteById,
  moveVoice,
  chatVoice,
  shareKifu,
};

async function getAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  const response = await fetch(`${config.apiUrl}/games/`, requestOptions);
  const data = await response.json();

  return data.games;
}

function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(`${config.apiUrl}/games/${id}`, requestOptions).then(
    handleResponse
  );
}

function newGame(data) {
  const requestOptions = {
    method: "POST",
    headers: {
      ...authHeader(),
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(data),
  };

  return fetch(`${config.apiUrl}/games/`, requestOptions).then(handleResponse);
}

function deleteById(id) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader(),
  };

  return fetch(`${config.apiUrl}/games/${id}`, requestOptions).then(
    handleResponse
  );
}
/**
 * update game status to "进行中"
 * @param {*} id gameId
 */
function beginGame(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(`${config.apiUrl}/games/begin/${id}`, requestOptions).then(
    handleResponse
  );
}

/**
 * update game status to "已完成"
 * @param {*} id gameId
 */

function completeGame(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(`${config.apiUrl}/games/complete/${id}`, requestOptions).then(
    handleResponse
  );
}

function shareKifu(kifu_id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(`${config.apiUrl}/kifus/share/${kifu_id}`, requestOptions).then(
    handleResponse
  );
}

function saveKifu(_data) {
  const requestOptions = {
    method: "POST",
    headers: {
      ...authHeader(),
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(_data),
  };
  console.log(requestOptions["body"]);
  return fetch(`${config.apiUrl}/kifus/`, requestOptions).then(handleResponse);
}

function moveVoice() {
  let data = {
    text: "该你下棋了",
  };
  const requestOptions = {
    method: "POST",
    headers: {
      ...authHeader(),
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(data),
  };
  console.log(requestOptions["body"]);
  return fetch(`${config.apiUrl}/util/tts`, requestOptions).then(
    handleResponse
  );
}

function chatVoice(message) {
  let data = {
    text: message.msg,
    username: message.username,
  };
  const requestOptions = {
    method: "POST",
    headers: {
      ...authHeader(),
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(data),
  };
  console.log(requestOptions["body"]);
  return fetch(`${config.apiUrl}/util/chat`, requestOptions).then(
    handleResponse
  );
}
