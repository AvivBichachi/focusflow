import { apiFetch, setToken, clearToken } from "./http";

/**
 * Registers a new user and stores the returned JWT.
 * Assumes backend returns: { token, user } or at least { token }.
 */
export async function register(email, password) {
  const data = await apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!data?.token) {
    throw new Error("Register succeeded but no token was returned");
  }

  setToken(data.token);
  return data;
}

/**
 * Logs in and stores the returned JWT.
 */
export async function login(email, password) {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!data?.token) {
    throw new Error("Login succeeded but no token was returned");
  }

  setToken(data.token);
  return data;
}

/**
 * Clears local session.
 */
export function logout() {
  clearToken();
}
