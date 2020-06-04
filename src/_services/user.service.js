import config from "config";
import { authHeader, handleResponse, encode } from "../_helpers";

export const userService = {
  login,
  logout,
  register,
  getAll,
  getById,
  update,
  change_avatar,
  delete: _delete,
};

function login(username, password) {
  const str = Base64_encode(username + ":" + password);
  const requestOptions = {
    method: "GET",
    headers: { Authorization: "Basic " + str },
  };
  /* const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    }; */

  return fetch(`${config.apiUrl}/login`, requestOptions)
    .then(handleResponse)
    .then((user) => {
      // login successful if there's a jwt token in the response
      if (user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        sessionStorage.setItem("user", JSON.stringify(user));
      }
      // debugger;
      return user;
    });
}

function logout() {
  // remove user from local storage to log user out
  sessionStorage.removeItem("user");
}

function register(user) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  };

  return fetch(`${config.apiUrl}/users/`, requestOptions).then(handleResponse);
}

function getAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(
    handleResponse
  );
}

function update(user) {
  const requestOptions = {
    method: "PUT",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(user),
  };

  return fetch(`${config.apiUrl}/users/${user.id}`, requestOptions).then(
    handleResponse
  );
}

function change_avatar(user) {
  const requestOptions = {
    method: "PUT",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(user),
  };

  return fetch(
    `${config.apiUrl}/users/change_avatar/${user.public_id}`,
    requestOptions
  ).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader(),
  };

  return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(
    handleResponse
  );
}
