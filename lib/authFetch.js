import { getAuth } from "firebase/auth";

/**
 * authFetch wraps fetch() and attaches Firebase ID token automatically.
 */
export async function authFetch(url, options = {}) {
  const auth = getAuth();
  const user = auth.currentUser;
  let headers = { ...(options.headers || {}) };

  if (user) {
    const token = await user.getIdToken();
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(url, { ...options, headers });
}
