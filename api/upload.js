import Busboy from 'busboy';
import { put } from '@vercel/blob';
import { verifyAdminRequest } from './_auth.js';
import {
  getBlobAccess,
  getBlobToken,
  isBlobConfigured,
} from './_blob.js';

const IMAGE_LIMIT = 15 * 1024 * 1024;
const VIDEO_LIMIT = 100 * 1024 * 1024;

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'video/webm',
];

function isVideo(mime = '') {
  return mime.startsWith('video/');
}

function isAllowedType(mime = '') {
  return ALLOWED_TYPES.includes(mime) || mime.startsWith('image/') || mime.startsWith('video/');
}

function formatError(error) {
  const message = error?.message || String(error || 'Upload failed');
  return message.replace(/^Vercel Blob:\s*/i, '').replace(/^Error:\s*/i, '');
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function parseMultipart(req) {
  const rawBody = await readRawBody(req);
  if (!rawBody.length) {
    throw new Error('No file uploaded. Please choose a file and try again.');
  }

  return new Promise((resolve, reject) => {
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

    busboy.on('error', error => reject(error));
    busboy.on('finish', () => {
      if (limitHit) {
        reject(new Error('File is too large. Images up to 15MB, videos up to 100MB.'));
        return;
      }
      if (!fileBuffer?.length) {
        reject(new Error('No file uploaded. Please choose a file and try again.'));
        return;
      }
      resolve({ fileBuffer, filename, mimeType });
    });

    busboy.end(rawBody);
  });
}

async function uploadBufferToBlob(fileBuffer, filename, mimeType) {
  if (!isAllowedType(mimeType)) {
    throw new Error('Unsupported file type. Use JPG, PNG, WebP, GIF, MP4, MOV, or WebM.');
  }

  const maxSize = isVideo(mimeType) ? VIDEO_LIMIT : IMAGE_LIMIT;
  if (fileBuffer.length > maxSize) {
    throw new Error(
      isVideo(mimeType)
        ? 'Video is too large (max 100MB).'
        : 'Image is too large (max 15MB).',
    );
  }

  const safeName = `fds-${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const putOptions = {
    access: getBlobAccess(),
    contentType: mimeType,
    addRandomSuffix: false,
  };

  const blobToken = getBlobToken();
  if (blobToken) putOptions.token = blobToken;

  return put(safeName, fileBuffer, putOptions);
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
      error: 'File upload is not configured. Connect Vercel Blob to this project, then Redeploy.',
    });
  }

  if (!verifyAdminRequest(req)) {
    return res.status(401).json({ error: 'Unauthorized. Sign in to admin first.' });
  }

  try {
    const { fileBuffer, filename, mimeType } = await parseMultipart(req);
    const blob = await uploadBufferToBlob(fileBuffer, filename, mimeType);
    return res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error('Upload failed:', error);
    return res.status(400).json({ error: formatError(error) });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
