import { useState } from 'react'
import { ImageOff } from 'lucide-react'

const FALLBACK = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"%3E%3Crect width="400" height="500" fill="%23F0EBE3"/%3E%3C/svg%3E'

/**
 * Since there's no backend to store uploaded images, product images
 * are always remote URLs. This wraps <img> with a graceful fallback
 * so a broken/missing URL never shows a browser's broken-image icon.
 */
export default function ImageWithFallback({ src, alt, className, ...props }) {
  const [errored, setErrored] = useState(false)

  if (!src || errored) {
    return (
      <div className={`flex items-center justify-center bg-stone text-ink-soft/40 ${className || ''}`}>
        <ImageOff size={28} strokeWidth={1.2} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      onError={() => setErrored(true)}
      loading="lazy"
      className={className}
      {...props}
    />
  )
}
