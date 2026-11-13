import { useEffect, useRef, useState, type DragEvent } from 'react';
import { fileToResizedDataUrl, isImageUrl } from '../lib/image';
import { ProductImage } from './ProductImage';

type SetImg = (img: string | undefined) => void;

/** Anything with a photo: a product, or a promo banner. */
type Pictured = { name: string; img?: string };

/** Resize a dropped/picked file and save it; reports a readable error on failure. */
export async function uploadImage(file: File | undefined, setImg: SetImg, onError: (msg: string) => void, maxEdge?: number) {
  if (!file) return;
  try {
    setImg(await fileToResizedDataUrl(file, maxEdge));
    onError('');
  } catch (e) {
    onError(e instanceof Error ? e.message : 'Upload failed.');
  }
}

/** Accept an image file dragged from the desktop onto `onFile`'s element. */
export function dropHandlers(onFile: (f: File | undefined) => void) {
  return {
    onDragOver: (e: DragEvent) => {
      if (e.dataTransfer.types.includes('Files')) e.preventDefault();
    },
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      onFile(e.dataTransfer.files[0]);
    },
  };
}

/** Admin table thumbnail: shows the photo, opens the image panel on click, accepts a dropped photo. */
export function ThumbButton({ p, open, onToggle, onFile }: { p: Pictured; open: boolean; onToggle: () => void; onFile: (f: File | undefined) => void }) {
  return (
    <button
      type="button"
      className={'thumb-btn' + (open ? ' is-open' : '')}
      aria-label={`${p.img ? 'Change' : 'Add'} photo for ${p.name}`}
      aria-expanded={open}
      title={p.img ? 'Change photo' : 'Add photo — click, or drop an image here'}
      onClick={onToggle}
      {...dropHandlers(onFile)}
    >
      <ProductImage className="thumb" src={p.img} alt="" />
      {!p.img && <span className="thumb-btn__plus" aria-hidden="true">+</span>}
    </button>
  );
}

/** Expanded row panel: upload a photo, paste a link, or remove the current image. */
export function ImagePanel({
  p,
  setImg,
  error,
  setError,
  onClose,
  maxEdge,
}: {
  p: Pictured;
  setImg: SetImg;
  error: string;
  setError: (msg: string) => void;
  /** Shows a "Done" button when given. */
  onClose?: () => void;
  /** Longest edge for uploads, in px (default: product size). */
  maxEdge?: number;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  // The link box shows the current image only when it is a web link (not an upload or a site file).
  const currentLink = p.img && isImageUrl(p.img) ? p.img : '';
  const [link, setLink] = useState(currentLink);
  useEffect(() => setLink(currentLink), [currentLink]);

  const applyLink = () => {
    if (!isImageUrl(link)) {
      setError('Paste a full image link starting with https://');
      return;
    }
    setImg(link.trim());
    setError('');
  };

  return (
    <div className="img-panel" role="region" aria-label={`Photo for ${p.name}`} {...dropHandlers((f) => uploadImage(f, setImg, setError, maxEdge))}>
      <ProductImage className="img-panel__preview" src={p.img} alt={p.name} label="no photo yet" />
      <div className="img-panel__controls">
        <div className="img-panel__title">
          <strong>Photo · {p.name}</strong>
          {onClose && <button type="button" className="link-btn" onClick={onClose}>Done</button>}
        </div>

        <div className="img-panel__row">
          <button type="button" className="pill pill--forest" onClick={() => fileRef.current?.click()}>
            {p.img ? 'Replace photo' : 'Upload photo'}
          </button>
          <span className="muted">or drop an image anywhere in this box</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              uploadImage(e.target.files?.[0], setImg, setError, maxEdge);
              e.target.value = ''; // allow re-picking the same file
            }}
          />
        </div>

        <form
          className="img-panel__row"
          onSubmit={(e) => {
            e.preventDefault();
            applyLink();
          }}
        >
          <input
            type="url"
            className="field"
            placeholder="…or paste an image link (https://…)"
            aria-label={`Image link for ${p.name}`}
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <button type="submit" className="pill-outline">Use link</button>
        </form>

        {error && <p className="img-panel__error" role="alert">{error}</p>}

        {p.img && (
          <button
            type="button"
            className="link-btn img-panel__remove"
            onClick={() => {
              setImg(undefined);
              setLink('');
              setError('');
            }}
          >
            Remove photo
          </button>
        )}
      </div>
    </div>
  );
}
