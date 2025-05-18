// src/components/HoverPreview.js
import React, { useState, useRef } from 'react';

/**
 * HoverPreview wraps an <img> to show a larger preview on hover,
 * always fully visible within the viewport.
 */
export default function HoverPreview({ src, alt, smallStyle, largeStyle }) {
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef(null);

  const showPreview = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const previewWidth = typeof largeStyle.width === 'number' ? largeStyle.width : parseInt(largeStyle.width);
      const previewHeight = typeof largeStyle.height === 'number' ? largeStyle.height : parseInt(largeStyle.height);
      const padding = 8;

      // Try to position above
      let top = rect.top - previewHeight - padding;
      // If not enough space, position below
      if (top < padding) {
        top = rect.bottom + padding;
      }
      // Center horizontally
      let left = rect.left + rect.width / 2 - previewWidth / 2;
      // Clamp within viewport
      if (left < padding) left = padding;
      if (left + previewWidth > window.innerWidth - padding) {
        left = window.innerWidth - previewWidth - padding;
      }

      setPos({ top, left });
      setHover(true);
    }
  };

  const hidePreview = () => setHover(false);

  return (
    <div
      ref={ref}
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={showPreview}
      onMouseLeave={hidePreview}
    >
      <img src={src} alt={alt} style={smallStyle} />
      {hover && (
        <img
          src={src}
          alt={alt}
          style={{
            position: 'fixed',
            top: `${pos.top}px`,
            left: `${pos.left}px`,
            pointerEvents: 'none',
            zIndex: 1000,
            ...largeStyle
          }}
        />
      )}
    </div>
  );
}
