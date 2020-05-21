import config from "config";
import { authHeader, handleResponse } from "../_helpers";

export const gameService = {
  getAll,
  getById,
  saveKifu,
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

function saveKifu(_data) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(_data),
  };
  console.log(requestOptions['body']);
  return fetch(`${config.apiUrl}/kifus`, requestOptions).then(
    handleResponse
  );
}
