const EMBED_HOST = 'google.com/maps/embed';

function buildEmbedFromAddress(address) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&hl=en&z=15&output=embed`;
}

export function getMapEmbedUrl(contact = {}) {
  const mapUrl = contact.mapUrl?.trim();
  const address = contact.address?.trim();

  if (mapUrl?.includes(EMBED_HOST)) {
    return mapUrl;
  }

  if (mapUrl?.includes('google.com/maps') || mapUrl?.includes('maps.app.goo.gl')) {
    if (address) return buildEmbedFromAddress(address);
  }

  if (mapUrl && !mapUrl.includes('google.com')) {
    return mapUrl;
  }

  if (address) {
    return buildEmbedFromAddress(address);
  }

  return null;
}

export function getMapDirectionsUrl(contact = {}) {
  const mapUrl = contact.mapUrl?.trim();
  const address = contact.address?.trim();

  if (mapUrl && !mapUrl.includes(EMBED_HOST)) {
    return mapUrl;
  }

  if (address) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  }

  return null;
}
