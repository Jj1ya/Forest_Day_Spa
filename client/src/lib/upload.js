import { upload } from '@vercel/blob/client';
import { getAdminToken } from '../components/AdminGate';

function isLocalDev() {
  return ['localhost', '127.0.0.1'].includes(window.location.hostname);
}

async function uploadViaLocalServer(file, token) {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Upload failed');

  if (data.url?.startsWith('/')) {
    return `${window.location.origin}${data.url}`;
  }
  return data.url;
}

async function uploadViaBlob(file, token) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const pathname = `fds-${Date.now()}-${safeName}`;
  const useMultipart = file.type.startsWith('video/') || file.size > 4 * 1024 * 1024;

  const blob = await upload(pathname, file, {
    access: 'public',
    handleUploadUrl: '/api/upload',
    clientPayload: JSON.stringify({ token }),
    multipart: useMultipart,
  });

  return blob.url;
}

export async function uploadMedia(file) {
  if (!file) throw new Error('No file selected');

  const token = getAdminToken();
  if (!token) throw new Error('Please sign in again.');

  try {
    if (isLocalDev()) {
      return await uploadViaLocalServer(file, token);
    }
    return await uploadViaBlob(file, token);
  } catch (err) {
    const message = err?.message || 'Upload failed';
    if (message.includes('Unauthorized')) {
      throw new Error('Session expired. Please sign out and sign in again.');
    }
    throw new Error(message);
  }
}
