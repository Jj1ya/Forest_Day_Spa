import { readFileSync } from 'fs';
import { join } from 'path';
import { verifyAdminRequest, isAdminConfigured } from './_auth.js';

function getRedisEnv() {
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.REDIS_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN;
  return { url, token, configured: !!(url && token) };
}

function loadDefaultData() {
  const raw = readFileSync(join(process.cwd(), 'server/data/site.json'), 'utf-8');
  return JSON.parse(raw);
}

function normalizeStored(data) {
  if (!data) return null;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return data;
}

function isValidSiteData(data) {
  return (
    data &&
    typeof data === 'object' &&
    data.hero &&
    data.about &&
    Array.isArray(data.services)
  );
}

function mergeMissingDefaults(data) {
  const defaults = loadDefaultData();
  const merged = { ...data };
  for (const key of ['packages', 'servicesSection', 'serviceCategories', 'navigation']) {
    if (!merged[key] && defaults[key]) merged[key] = defaults[key];
  }
  return merged;
}

async function getRedis() {
  const { Redis } = await import('@upstash/redis');
  const { url, token } = getRedisEnv();
  return new Redis({ url, token });
}

async function readSiteData() {
  const { configured } = getRedisEnv();

  if (configured) {
    try {
      const redis = await getRedis();
      let data = normalizeStored(await redis.get('siteData'));
      if (data && !isValidSiteData(data)) {
        console.warn('Invalid siteData in Redis, restoring defaults');
        data = null;
      }
      if (data) return mergeMissingDefaults(data);

      // First visit: copy bundled defaults into Redis so saves persist
      const defaults = loadDefaultData();
      await redis.set('siteData', defaults);
      return defaults;
    } catch (e) {
      console.error('Redis read failed:', e);
    }
  }

  return loadDefaultData();
}

async function writeSiteData(body) {
  const { configured } = getRedisEnv();

  if (!configured) {
    return {
      ok: false,
      status: 503,
      body: {
        error:
          'Redis is not connected. In Vercel: Storage → Upstash Redis → Connect to this project, then Redeploy.',
        readOnly: true,
      },
    };
  }

  if (!isValidSiteData(body)) {
    return {
      ok: false,
      status: 400,
      body: {
        error:
          'Invalid site data. Save from Admin (Save All) with full content — partial updates are not allowed.',
      },
    };
  }

  try {
    const redis = await getRedis();
    await redis.set('siteData', body);
    return { ok: true, status: 200, body: { success: true, storage: 'redis' } };
  } catch (e) {
    console.error('Redis write failed:', e);
    return { ok: false, status: 500, body: { error: e.message || 'Redis save failed' } };
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const data = await readSiteData();
    return res.status(200).json(data);
  }

  if (req.method === 'PUT') {
    if (isAdminConfigured() && !verifyAdminRequest(req)) {
      return res.status(401).json({ error: 'Unauthorized. Sign in to admin first.' });
    }
    const result = await writeSiteData(req.body);
    return res.status(result.status).json(result.body);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
