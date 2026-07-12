/**
 * Cloudinary URL helper.
 *
 * Our banner/product images are uploaded as full-resolution PNGs (often 1.5–2 MB),
 * which are far too heavy for mobile. Cloudinary can resize and re-encode on the fly
 * via URL transforms, so we inject `f_auto,q_auto,w_<width>` right after `/upload/`:
 *   - f_auto      → serves AVIF/WebP when the browser supports it
 *   - q_auto:good → high-quality auto compression (no visible quality loss)
 *   - w_<n>       → caps the delivered width to what the layout actually needs
 *                   (sized for high-DPI screens so the result stays crisp)
 *
 * A 1.9 MB PNG becomes ~165 KB WebP this way with no perceptible quality drop.
 * Non-Cloudinary URLs are returned untouched.
 */
export function cldOptimize(url: string, width: number): string {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  // Don't double-transform if a transform is already present.
  const [prefix, rest] = url.split("/upload/");
  if (/^(f_|q_|w_|c_|dpr_)/.test(rest)) {
    return url;
  }
  return `${prefix}/upload/f_auto,q_auto:good,w_${width}/${rest}`;
}
