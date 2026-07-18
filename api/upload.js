import { handleUpload } from '@vercel/blob/client';
import { verifyAdminRequest, getAdminToken, isAdminConfigured } from './_auth.js';
import { isBlobConfigured, getBlobToken } from './_blob.js';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'video/webm',
];

function isAuthorized(req, clientPayload) {
  if (!isAdminConfigured()) return true;
  if (verifyAdminRequest(req)) return true;

  try {
    const payload = clientPayload ? JSON.parse(clientPayload) : {};
    return payload.token === getAdminToken();
  } catch {
    return false;
  }
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function maxSizeForPath(pathname, multipart) {
  const lower = (pathname || '').toLowerCase();
  const isVideo = lower.endsWith('.mp4') || lower.endsWith('.mov') || lower.endsWith('.webm');
  if (isVideo) return 100 * 1024 * 1024;
  if (multipart) return 100 * 1024 * 1024;
  return 15 * 1024 * 1024;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-vercel-signature');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isBlobConfigured()) {
    return res.status(503).json({
      error: 'File upload is not configured. In Vercel: Storage → Blob → Connect to this project, then Redeploy.',
    });
  }

  const blobToken = getBlobToken();
  if (!blobToken) {
    return res.status(503).json({
      error: 'Blob token missing. Reconnect Vercel Blob storage to this project, then Redeploy.',
    });
  }

  try {
    const body = await readJsonBody(req);
    if (!body?.type) {
      return res.status(400).json({ error: 'Invalid upload request.' });
    }

    const jsonResponse = await handleUpload({
      body,
      request: req,
      token: blobToken,
      onBeforeGenerateToken: async (pathname, clientPayload, multipart) => {
        if (!isAuthorized(req, clientPayload)) {
          throw new Error('Unauthorized. Sign in to admin first.');
        }

        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: maxSizeForPath(pathname, multipart),
          addRandomSuffix: false,
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
