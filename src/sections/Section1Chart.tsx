import * as d3 from 'd3';
import chartSvg from '../assets/section1/gdp-chart.svg?raw';
import {
  D3ChartLayer,
  D3SvgCanvas,
  getSectionDesignWidth,
  type D3SvgRenderContext,
} from '../components/d3Chart';

const SECTION1_SCREEN_COUNT = 3;
const SECTION1_GDP_CHART_BBOX = {
  x: 2848,
  y: 344,
  width: 611.98,
  height: 415,
};

function drawSection1Chart({ svg }: D3SvgRenderContext) {
  const doc = new DOMParser().parseFromString(chartSvg, 'image/svg+xml');
  const sourceSvg = doc.documentElement;

  Array.from(sourceSvg.children).forEach((child) => {
    const imported = document.importNode(child, true);
    svg.node()?.appendChild(imported);
  });

  svg
    .selectAll<SVGElement, unknown>('path, line, polyline')
    .attr('data-d3-animate', function () {
      const stroke = d3.select(this).attr('stroke');
      const fill = d3.select(this).attr('fill');
      return stroke && fill === 'none' ? 'draw' : 'fade';
    });

  svg
    .selectAll<SVGElement, unknown>('circle, ellipse, rect, polygon')
    .attr('data-d3-animate', 'fade');
}

export default function Section1Chart() {
  return (
    <D3ChartLayer
      bbox={SECTION1_GDP_CHART_BBOX}
      sectionDesignWidth={getSectionDesignWidth(SECTION1_SCREEN_COUNT)}
      ariaLabel="China GDP ranking and GDP per capita comparison chart, 1949 to 1957"
    >
      <D3SvgCanvas
        viewBox="0 0 612 415"
        preserveAspectRatio="none"
        render={drawSection1Chart}
      />
    </D3ChartLayer>
  );
}
