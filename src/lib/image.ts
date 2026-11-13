/** Longest edge of an uploaded photo after resizing. Cards render at most ~400px wide. */
const MAX_EDGE = 600;
const QUALITY = 0.8;

/**
 * Read an image file, shrink it to fit MAX_EDGE and re-encode as JPEG, returning a data: URL.
 * Keeps each photo around 40–90 KB so a catalogue's worth fits in browser storage.
 */
export async function fileToResizedDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('That file is not an image.');
  const src = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Could not read that image.'));
      el.src = src;
    });
    const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff'; // flatten transparent PNGs onto white instead of black
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', QUALITY);
  } finally {
    URL.revokeObjectURL(src);
  }
}

/** Accepts http(s) links only — rejects javascript:, file: and other schemes. */
export function isImageUrl(s: string) {
  try {
    const u = new URL(s.trim());
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}
