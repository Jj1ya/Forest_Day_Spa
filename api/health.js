import { isBlobConfigured, canGenerateClientToken } from './_blob.js';

export default async function handler(_req, res) {
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.REDIS_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({
    redisConfigured: !!(url && token),
    canSave: !!(url && token),
    uploadConfigured: isBlobConfigured(),
    clientUploadAvailable: canGenerateClientToken(),
  });
}
