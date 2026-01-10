// Single place for token + HTTP conventions.
// Uses Vite proxy, so we call "/api/..." directly.

const TOKEN_KEY = "focusflow_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * apiFetch wraps fetch with:
 * - automatic Bearer token injection (if exists)
 * - consistent JSON error handling
 * - safe handling of 204 responses
 */
export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  // Only set JSON content-type when sending a body.
  // (Prevents some edge cases with GET requests)
  const hasBody = options.body !== undefined;
  if (hasBody && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(path, { ...options, headers });

  if (!res.ok) {
    // Try to parse JSON error body, but don't crash if not JSON
    let body = null;
    try {
      body = await res.json();
    } catch {}

    const err = new Error(body?.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  if (res.status === 204) return null;
  return res.json();
}
