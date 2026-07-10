import { getAdminToken } from './components/AdminGate';

const BASE = '/api';

function authHeaders(extra = {}) {
  const token = getAdminToken();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchSiteData() {
  const res = await fetch(`${BASE}/site`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function loginAdmin(email, password) {
  const res = await fetch(`${BASE}/admin-auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Sign in failed');
  return body;
}

export async function verifyAdminSession() {
  const token = getAdminToken();
  if (!token) return false;
  const res = await fetch(`${BASE}/admin-auth`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}

export async function saveSiteData(data) {
  const res = await fetch(`${BASE}/site`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Failed to save');
  }
  return res.json();
}

export async function saveSection(section, data) {
  const res = await fetch(`${BASE}/site/${section}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save');
  return res.json();
}
