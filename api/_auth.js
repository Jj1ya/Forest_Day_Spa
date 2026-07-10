import crypto from 'crypto';

export function isAdminConfigured() {
  return !!(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
}

export function getAdminToken() {
  const email = process.env.ADMIN_EMAIL || '';
  const password = process.env.ADMIN_PASSWORD || '';
  const secret = process.env.ADMIN_SESSION_SECRET || password || 'fds-admin';
  return crypto.createHmac('sha256', secret).update(`${email}:${password}`).digest('hex');
}

export function checkCredentials(email, password) {
  return email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
}

export function verifyAdminRequest(req) {
  if (!isAdminConfigured()) return true;
  const auth = req.headers.authorization?.replace(/^Bearer\s+/i, '') || '';
  return auth === getAdminToken();
}
