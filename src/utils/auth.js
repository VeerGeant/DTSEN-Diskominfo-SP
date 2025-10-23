export function loginUser(username, password) {
  const users = [
    { username: "admin", password: "admin123" },
    { username: "user", password: "user123" },
  ];

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("userChanged"));
    return true;
  } else {
    return false;
  }
}

export function logoutUser() {
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("userChanged"));

}

export function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function isLoggedIn() {
  return !!localStorage.getItem("user");
}
