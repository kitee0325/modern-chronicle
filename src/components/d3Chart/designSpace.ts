import type { CSSProperties } from 'react';

export const FIGMA_SCREEN_WIDTH = 1440;
export const FIGMA_SCREEN_HEIGHT = 810;

export interface DesignBBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getSectionDesignWidth(screenCount: number) {
  return FIGMA_SCREEN_WIDTH * screenCount;
}

export function getBBoxPercentStyle(
  bbox: DesignBBox,
  sectionDesignWidth: number,
  sectionDesignHeight = FIGMA_SCREEN_HEIGHT,
): CSSProperties {
  return {
    left: `${(bbox.x / sectionDesignWidth) * 100}%`,
    top: `${(bbox.y / sectionDesignHeight) * 100}%`,
    width: `${(bbox.width / sectionDesignWidth) * 100}%`,
    height: `${(bbox.height / sectionDesignHeight) * 100}%`,
  };
}
