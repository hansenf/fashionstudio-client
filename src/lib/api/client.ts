const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

async function getToken() {
  if (typeof window === 'undefined') return null;
  const { auth } = await import('@/lib/firebase/client');
  const user = auth.currentUser;
  return user ? await user.getIdToken() : null;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = await getToken();
  const res = await fetch(`${BACKEND_URL}/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `API Error: ${res.status}`);
  }
  return res.json();
}