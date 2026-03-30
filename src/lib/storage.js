export const USERNAME_KEY = "verifyuz_username";

export function getStoredUsername() {
  return localStorage.getItem(USERNAME_KEY) || "";
}

export function setStoredUsername(username) {
  localStorage.setItem(USERNAME_KEY, username);
}

export function clearStoredUsername() {
  localStorage.removeItem(USERNAME_KEY);
}
