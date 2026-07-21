import { getAdminToken } from '../components/AdminGate';

async function readResponse(res) {
  const raw = await res.text();
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    return { error: raw.slice(0, 240) };
  }
}

export async function uploadMedia(file) {
  if (!file) throw new Error('No file selected');

  const token = getAdminToken();
  if (!token) throw new Error('Please sign in again.');

  const form = new FormData();
  form.append('file', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  const data = await readResponse(res);
  if (!res.ok) {
    const message = data.error || `Upload failed (${res.status})`;
    if (message.includes('Unauthorized')) {
      throw new Error('Session expired. Please sign out and sign in again.');
    }
    throw new Error(message);
  }

  if (!data.url) {
    throw new Error('Upload succeeded but no file URL was returned.');
  }

  if (data.url.startsWith('/')) {
    return `${window.location.origin}${data.url}`;
  }
  return data.url;
}
