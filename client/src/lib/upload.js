import { getAdminToken } from '../components/AdminGate';

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

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data.url;
}
