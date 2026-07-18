export function getBlobToken() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;

  const prefixed = Object.keys(process.env).find(
    key => key.endsWith('BLOB_READ_WRITE_TOKEN') && process.env[key],
  );
  return prefixed ? process.env[prefixed] : null;
}

export function isBlobConfigured() {
  return !!getBlobToken();
}
