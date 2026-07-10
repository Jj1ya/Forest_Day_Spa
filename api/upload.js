import Busboy from 'busboy';
import { put } from '@vercel/blob';
import { verifyAdminRequest } from './_auth.js';
import { isBlobConfigured, getBlobToken } from './_blob.js';

export const config = {
  api: { bodyParser: false },
};

const IMAGE_LIMIT = 15 * 1024 * 1024;
const VIDEO_LIMIT = 100 * 1024 * 1024;

function isVideo(mime = '') {
  return mime.startsWith('video/');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isBlobConfigured()) {
    return res.status(503).json({
      error: 'File upload is not configured. In Vercel: Storage → Blob → Connect to this project, then Redeploy.',
    });
  }

  if (!verifyAdminRequest(req)) {
    return res.status(401).json({ error: 'Unauthorized. Sign in to admin first.' });
  }

  return new Promise(resolve => {
    const busboy = Busboy({
      headers: req.headers,
      limits: { fileSize: VIDEO_LIMIT },
    });

    let fileBuffer = null;
    let filename = 'upload.bin';
    let mimeType = 'application/octet-stream';
    let limitHit = false;

    busboy.on('file', (_field, file, info) => {
      filename = info.filename || filename;
      mimeType = info.mimeType || mimeType;
      const chunks = [];

      file.on('data', chunk => chunks.push(chunk));
      file.on('limit', () => { limitHit = true; });
      file.on('end', () => {
        if (!limitHit) fileBuffer = Buffer.concat(chunks);
      });
    });

    busboy.on('error', error => {
      resolve(res.status(400).json({ error: error.message || 'Upload failed' }));
    });

    busboy.on('finish', async () => {
      if (limitHit) {
        return resolve(res.status(413).json({
          error: 'File is too large. Images up to 15MB, videos up to 100MB.',
        }));
      }

      if (!fileBuffer?.length) {
        return resolve(res.status(400).json({ error: 'No file uploaded.' }));
      }

      const maxSize = isVideo(mimeType) ? VIDEO_LIMIT : IMAGE_LIMIT;
      if (fileBuffer.length > maxSize) {
        return resolve(res.status(413).json({
          error: isVideo(mimeType)
            ? 'Video is too large (max 100MB).'
            : 'Image is too large (max 15MB).',
        }));
      }

      try {
        const safeName = `fds-${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const blob = await put(safeName, fileBuffer, {
          access: 'public',
          contentType: mimeType,
          token: getBlobToken() || undefined,
        });
        resolve(res.status(200).json({ url: blob.url }));
      } catch (error) {
        console.error('Blob upload failed:', error);
        resolve(res.status(500).json({ error: error.message || 'Upload failed' }));
      }
    });

    req.pipe(busboy);
  });
}
