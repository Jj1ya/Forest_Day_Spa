export function getBlobToken() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;

  const prefixed = Object.keys(process.env).find(
    key => key.endsWith('BLOB_READ_WRITE_TOKEN') && process.env[key],
  );
  return prefixed ? process.env[prefixed] : null;
}

export function getBlobStoreId() {
  if (process.env.BLOB_STORE_ID) return process.env.BLOB_STORE_ID;

  const prefixed = Object.keys(process.env).find(
    key => key.endsWith('BLOB_STORE_ID') && process.env[key],
  );
  return prefixed ? process.env[prefixed] : null;
}

export function canGenerateClientToken() {
  return !!getBlobToken();
}

export function canServerUpload() {
  // OIDC auth resolves at runtime via @vercel/oidc when BLOB_STORE_ID is set.
  return !!(getBlobToken() || getBlobStoreId());
}

export function isBlobConfigured() {
  return canServerUpload();
}

export function getBlobAccess() {
  const value = (process.env.BLOB_DEFAULT_ACCESS || 'public').toLowerCase();
  return value === 'private' ? 'private' : 'public';
}
