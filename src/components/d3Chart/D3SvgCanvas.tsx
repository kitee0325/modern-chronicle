import { useEffect, useRef } from 'react';
import type { SVGProps } from 'react';
import * as d3 from 'd3';

export interface D3SvgRenderContext {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
}

interface D3SvgCanvasProps
  extends Omit<SVGProps<SVGSVGElement>, 'ref' | 'viewBox'> {
  viewBox: string;
  render: (context: D3SvgRenderContext) => void;
  renderKey?: unknown;
}

export default function D3SvgCanvas({
  viewBox,
  render,
  renderKey,
  preserveAspectRatio = 'xMinYMin meet',
  className = '',
  ...svgProps
}: D3SvgCanvasProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();
    render({ svg });
  }, [render, renderKey]);

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      className={`d3-chart-svg block w-full h-full overflow-visible ${className}`}
      {...svgProps}
    />
  );
}
