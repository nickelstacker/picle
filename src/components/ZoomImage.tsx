import { ZOOM_ANIMATION_MS } from '../config'

interface Props {
  src: string
  scale: number
  focus: { x: number; y: number }
  alt: string
  shake: boolean
  onShakeEnd: () => void
}

export function ZoomImage({ src, scale, focus, alt, shake, onShakeEnd }: Props) {
  return (
    <div className={shake ? 'frame shake' : 'frame'} onAnimationEnd={onShakeEnd}>
      <img
        src={src}
        alt={alt}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          transform: `scale(${scale})`,
          // Scaling about a point inside the image keeps the frame fully covered at every zoom level.
          transformOrigin: `${focus.x * 100}% ${focus.y * 100}%`,
          transitionDuration: `${ZOOM_ANIMATION_MS}ms`,
        }}
      />
    </div>
  )
}
