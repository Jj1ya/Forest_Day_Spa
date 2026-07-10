import {
  checkCredentials,
  getAdminToken,
  isAdminConfigured,
  verifyAdminRequest,
} from './_auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!isAdminConfigured()) {
    return res.status(503).json({
      error: 'Admin login is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in Vercel.',
    });
  }

  if (req.method === 'POST') {
    const { email, password } = req.body || {};
    if (checkCredentials(email?.trim(), password)) {
      return res.json({ success: true, token: getAdminToken() });
    }
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (req.method === 'GET') {
    if (verifyAdminRequest(req)) return res.json({ valid: true });
    return res.status(401).json({ valid: false });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
