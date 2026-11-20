const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export async function api(path, options = {}) {
  const token = sessionStorage.getItem("tf-token");
  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || data.detail || `Request failed (${response.status})`);
  return data.data ?? data;
}
export const authApi = {
  login: (body) => api("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => api("/auth/register", { method: "POST", body: JSON.stringify(body) }),
};

export async function downloadApplicationResume(applicationId) {
  const token = sessionStorage.getItem("tf-token");
  const response = await fetch(`${API_URL}/applications/${applicationId}/resume`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `Resume download failed (${response.status})`);
  }
  return response.blob();
}
