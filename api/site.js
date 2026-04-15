import { readFileSync } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const redisConfigured = !!process.env.KV_REST_API_URL;

  if (req.method === 'GET') {
    if (redisConfigured) {
      try {
        const { Redis } = await import('@upstash/redis');
        const redis = new Redis({
          url: process.env.KV_REST_API_URL,
          token: process.env.KV_REST_API_TOKEN,
        });
        const data = await redis.get('siteData');
        if (data) return res.json(data);
      } catch {}
    }
    const raw = readFileSync(join(process.cwd(), 'server/data/site.json'), 'utf-8');
    return res.json(JSON.parse(raw));
  }

  if (req.method === 'PUT') {
    if (!redisConfigured) {
      return res.status(503).json({
        error: 'Admin saves require Redis storage. Add Upstash Redis in Vercel Marketplace.',
        readOnly: true,
      });
    }
    try {
      const { Redis } = await import('@upstash/redis');
      const redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      });
      await redis.set('siteData', JSON.stringify(req.body));
      return res.json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
