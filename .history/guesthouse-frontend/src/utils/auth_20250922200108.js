// src/utils/auth.js

export const isAuthenticated = () => {
  const adminUser = JSON.parse(localStorage.getItem("adminUser"));
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // Check if admin is logged in (using the flag) and the user data exists.
  return isLoggedIn && adminUser && adminUser.email;
};

export const login = () => {
  localStorage.setItem("isLoggedIn", "true");
};

export const logout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("adminUser");
};