import config from "config";
import { authHeader, handleResponse } from "../_helpers";

export const gameService = {
  getAll,
  getById,
};

function getAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(`${config.apiUrl}/games`, requestOptions).then(handleResponse);
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
function saveKifu(data) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    data: JSON.stringify(data),
  };

  return fetch(`${config.apiUrl}/games/${data.gameid}`, requestOptions).then(
    handleResponse
  );
}
