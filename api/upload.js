import Busboy from 'busboy';
import { put } from '@vercel/blob';
import { handleUpload } from '@vercel/blob/client';
import { verifyAdminRequest, getAdminToken, isAdminConfigured } from './_auth.js';
import {
  canGenerateClientToken,
  canServerUpload,
  getBlobAccess,
  getBlobToken,
  isBlobConfigured,
} from './_blob.js';

const IMAGE_LIMIT = 15 * 1024 * 1024;
const VIDEO_LIMIT = 100 * 1024 * 1024;
const VERCEL_BODY_LIMIT = 4.5 * 1024 * 1024;

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

function isMultipart(req) {
  return (req.headers['content-type'] || '').includes('multipart/form-data');
}

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

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
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

  const raw = await readRawBody(req);
  if (!raw.length) return null;

  try {
    return JSON.parse(raw.toString('utf8'));
  } catch {
    return null;
  }
}

async function parseMultipart(req) {
  const rawBody = await readRawBody(req);

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
        reject(new Error('No file uploaded.'));
        return;
      }
      resolve({ fileBuffer, filename, mimeType });
    });

    busboy.end(rawBody);
  });
}

function maxSizeForPath(pathname, multipart) {
  const lower = (pathname || '').toLowerCase();
  const isVideoFile = lower.endsWith('.mp4') || lower.endsWith('.mov') || lower.endsWith('.webm');
  if (isVideoFile) return VIDEO_LIMIT;
  if (multipart) return VIDEO_LIMIT;
  return IMAGE_LIMIT;
}

async function uploadBufferToBlob(fileBuffer, filename, mimeType) {
  const maxSize = isVideo(mimeType) ? VIDEO_LIMIT : IMAGE_LIMIT;
  if (fileBuffer.length > maxSize) {
    throw new Error(
      isVideo(mimeType)
        ? 'Video is too large (max 100MB).'
        : 'Image is too large (max 15MB).',
    );
  }

  if (fileBuffer.length > VERCEL_BODY_LIMIT && !canGenerateClientToken()) {
    throw new Error(
      'This file is too large for server upload. In Vercel, enable BLOB_READ_WRITE_TOKEN for large uploads, or use a file under 4.5MB.',
    );
  }

  const safeName = `fds-${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const putOptions = {
    access: getBlobAccess(),
    contentType: mimeType,
  };

  const blobToken = getBlobToken();
  if (blobToken) putOptions.token = blobToken;

  return put(safeName, fileBuffer, putOptions);
}

async function handleClientTokenRequest(req, res, body) {
  if (!canGenerateClientToken()) {
    return res.status(503).json({
      error: 'Client upload token unavailable. Use Upload file (server upload) or add BLOB_READ_WRITE_TOKEN in Vercel Blob settings.',
    });
  }

  const jsonResponse = await handleUpload({
    body,
    request: req,
    token: getBlobToken(),
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
}

async function handleMultipartUpload(req, res) {
  if (!verifyAdminRequest(req)) {
    return res.status(401).json({ error: 'Unauthorized. Sign in to admin first.' });
  }

  const { fileBuffer, filename, mimeType } = await parseMultipart(req);
  const blob = await uploadBufferToBlob(fileBuffer, filename, mimeType);
  return res.status(200).json({ url: blob.url });
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

  try {
    if (isMultipart(req)) {
      return await handleMultipartUpload(req, res);
    }

    const body = await readJsonBody(req);
    if (!body?.type) {
      return res.status(400).json({ error: 'Invalid upload request.' });
    }

    if (!canServerUpload()) {
      return res.status(503).json({
        error: 'Blob storage is not connected to this deployment.',
      });
    }

    return await handleClientTokenRequest(req, res, body);
  } catch (error) {
    console.error('Upload failed:', error);
    return res.status(400).json({ error: error.message || 'Upload failed' });
  }
}
