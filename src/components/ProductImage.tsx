import { useEffect, useState } from 'react';

/** Product photo, or the striped placeholder when there's no image or the link is broken. */
export function ProductImage({ src, alt, className = '', label }: { src?: string; alt: string; className?: string; label?: string }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [src]);

  if (src && !broken) {
    return <img className={className + ' product-img'} src={src} alt={alt} loading="lazy" onError={() => setBroken(true)} />;
  }
  return (
    <div className={className + ' placeholder'} aria-hidden={label ? undefined : true}>
      {label && <span className="placeholder__label">{label}</span>}
    </div>
  );
}
