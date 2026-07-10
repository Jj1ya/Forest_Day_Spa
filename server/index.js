import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import multer from 'multer';
import { mkdirSync } from 'fs';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, 'data', 'site.json');
const UPLOADS_DIR = join(__dirname, '../client/public/uploads');
mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^(image\/(jpeg|png|webp|gif)|video\/(mp4|quicktime|webm))$/.test(file.mimetype);
    cb(ok ? null : new Error('Only images and MP4/MOV/WebM videos are allowed.'), ok);
  },
});
const app = express();
const PORT = 4000;

function isAdminConfigured() {
  return !!(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
}

function getAdminToken() {
  const email = process.env.ADMIN_EMAIL || '';
  const password = process.env.ADMIN_PASSWORD || '';
  const secret = process.env.ADMIN_SESSION_SECRET || password || 'fds-admin';
  return crypto.createHmac('sha256', secret).update(`${email}:${password}`).digest('hex');
}

function verifyAdminRequest(req) {
  if (!isAdminConfigured()) return true;
  const auth = req.headers.authorization?.replace(/^Bearer\s+/i, '') || '';
  return auth === getAdminToken();
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));

function readData() {
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
}

function writeData(data) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

app.post('/api/admin-auth', (req, res) => {
  if (!isAdminConfigured()) {
    return res.status(503).json({ error: 'Set ADMIN_EMAIL and ADMIN_PASSWORD in .env for local dev.' });
  }
  const { email, password } = req.body || {};
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true, token: getAdminToken() });
  }
  return res.status(401).json({ error: 'Invalid email or password.' });
});

app.get('/api/admin-auth', (req, res) => {
  if (!isAdminConfigured()) return res.json({ valid: true });
  if (verifyAdminRequest(req)) return res.json({ valid: true });
  return res.status(401).json({ valid: false });
});

app.get('/api/site', (_req, res) => {
  try {
    res.json(readData());
  } catch (err) {
    res.status(500).json({ error: 'Failed to read site data' });
  }
});

app.put('/api/site', (req, res) => {
  if (isAdminConfigured() && !verifyAdminRequest(req)) {
    return res.status(401).json({ error: 'Unauthorized. Sign in to admin first.' });
  }
  try {
    writeData(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save site data' });
  }
});

app.put('/api/site/:section', (req, res) => {
  try {
    const data = readData();
    data[req.params.section] = req.body;
    writeData(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save section' });
  }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (isAdminConfigured() && !verifyAdminRequest(req)) {
    return res.status(401).json({ error: 'Unauthorized. Sign in to admin first.' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  return res.json({ url: `/uploads/${req.file.filename}` });
});

app.use((err, _req, res, next) => {
  if (err) return res.status(400).json({ error: err.message || 'Upload failed' });
  next();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
