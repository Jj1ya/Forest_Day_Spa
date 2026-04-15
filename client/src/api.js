const BASE = '/api';

export async function fetchSiteData() {
  const res = await fetch(`${BASE}/site`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function saveSiteData(data) {
  const res = await fetch(`${BASE}/site`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save');
  return res.json();
}

export async function saveSection(section, data) {
  const res = await fetch(`${BASE}/site/${section}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save');
  return res.json();
}
