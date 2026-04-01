import { request } from "../utils/api";

export const register = ({ name, email, password }) => {
  return request("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });
};

export const login = ({ email, password }) => {
  return request("/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
};

export const getCurrentUser = (token) => {
  return request("/users/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};