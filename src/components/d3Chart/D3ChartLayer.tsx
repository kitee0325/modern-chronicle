import { useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {
  FIGMA_SCREEN_HEIGHT,
  type DesignBBox,
  getBBoxPercentStyle,
} from './designSpace';
import { useD3EntranceAnimation } from './useD3EntranceAnimation';

interface D3ChartLayerProps {
  bbox: DesignBBox;
  sectionDesignWidth: number;
  sectionDesignHeight?: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  debug?: boolean;
  ariaLabel?: string;
}

export default function D3ChartLayer({
  bbox,
  sectionDesignWidth,
  sectionDesignHeight = FIGMA_SCREEN_HEIGHT,
  children,
  className = '',
  style,
  debug = false,
  ariaLabel,
}: D3ChartLayerProps) {
  const layerRef = useRef<HTMLDivElement | null>(null);
  useD3EntranceAnimation(layerRef);

  return (
    <div
      ref={layerRef}
      className={`d3-chart-layer absolute pointer-events-none ${className}`}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      style={{
        ...getBBoxPercentStyle(bbox, sectionDesignWidth, sectionDesignHeight),
        outline: debug ? '1px dashed rgba(255, 80, 80, 0.75)' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
