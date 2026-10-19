import { ZOOM_ANIMATION_MS } from '../config'

interface Props {
  src: string
  scale: number
  alt: string
  shake: boolean
  onShakeEnd: () => void
}

export function ZoomImage({ src, scale, alt, shake, onShakeEnd }: Props) {
  return (
    <div className={shake ? 'frame shake' : 'frame'} onAnimationEnd={onShakeEnd}>
      <img
        src={src}
        alt={alt}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        style={{ transform: `scale(${scale})`, transitionDuration: `${ZOOM_ANIMATION_MS}ms` }}
      />
    </div>
  )
}
