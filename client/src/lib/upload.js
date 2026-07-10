import { upload } from '@vercel/blob/client';
import { getAdminToken } from '../components/AdminGate';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);

async function uploadLocal(file) {
  const token = getAdminToken();
  const form = new FormData();
  form.append('file', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data.url;
}

export async function uploadMedia(file) {
  if (!file) throw new Error('No file selected');
  const token = getAdminToken();
  if (!token) throw new Error('Please sign in again.');

  if (LOCAL_HOSTS.has(window.location.hostname)) {
    return uploadLocal(file);
  }

  const blob = await upload(file.name, file, {
    access: 'public',
    handleUploadUrl: '/api/upload',
    clientPayload: JSON.stringify({ token }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return blob.url;
}
