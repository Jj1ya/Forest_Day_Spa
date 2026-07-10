import { handleUpload } from '@vercel/blob/client';
import { getAdminToken, isAdminConfigured } from './_auth.js';

function isAuthorized(req, clientPayload) {
  if (!isAdminConfigured()) return true;

  const header = req.headers.authorization?.replace(/^Bearer\s+/i, '') || '';
  const expected = getAdminToken();
  if (header === expected) return true;

  try {
    const payload = clientPayload ? JSON.parse(clientPayload) : {};
    return payload.token === expected;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(503).json({
      error: 'File upload is not configured. In Vercel: Storage → Blob → Connect to this project, then Redeploy.',
    });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!isAuthorized(req, clientPayload)) {
          throw new Error('Unauthorized. Sign in to admin first.');
        }

        const lower = (pathname || '').toLowerCase();
        const isVideo = lower.endsWith('.mp4') || lower.endsWith('.mov') || lower.endsWith('.webm');

        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'video/mp4',
            'video/quicktime',
            'video/webm',
          ],
          maximumSizeInBytes: isVideo ? 100 * 1024 * 1024 : 15 * 1024 * 1024,
        };
      },
      onUploadCompleted: async () => {},
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Upload failed:', error);
    return res.status(400).json({ error: error.message || 'Upload failed' });
  }
}
