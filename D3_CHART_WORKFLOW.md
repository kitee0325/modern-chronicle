# D3 Chart Workflow

This document records the working agreement for converting Figma-drawn chart
artwork into D3-rendered charts inside the horizontal scroll narrative.

## Goal

- Existing charts were originally embedded in exported `frontend.png` images.
- New charts should be rebuilt with D3/SVG code while the original foreground
  images stay in place temporarily for visual comparison.
- Work proceeds one section at a time. Each chart is implemented only after its
  source SVG and section-level bounding box are provided.

## Design Coordinate System

- Figma single-screen artboard size: `1440 x 810`.
- Section foreground/background images may span multiple screens.
- A section's design width is:

```ts
sectionDesignWidth = 1440 * screenCount;
sectionDesignHeight = 810;
```

- Chart bounding boxes are always measured against the entire section design
  canvas, not the browser viewport.
- Example: a 3-screen section uses a design canvas of `4320 x 810`.
- The exported chart SVG and any CSV/data references should be interpreted in
  this same Figma coordinate basis unless stated otherwise.

## Required Input Per Chart

For each chart, provide:

- Section number, for example `Section7`.
- Figma "Copy as SVG" output for the chart group.
- Bounding box in the full section design canvas:

```ts
{
  x: number;
  y: number;
  width: number;
  height: number;
}
```

If the supplied box uses CSS-like offsets such as `top`, `right`, `width`,
and `height`, `right` means the distance from the section design canvas' right
edge, not the shape's right-edge x-coordinate. Convert it before passing the
box to `D3ChartLayer`:

```ts
x = sectionDesignWidth - right - width;
y = top;
```

Example for `Section1`, which is three screens wide:

```ts
sectionDesignWidth = 1440 * 3; // 4320
x = 4320 - 860.02 - 611.98; // 2848

bbox = {
  x: 2848,
  y: 344,
  width: 611.98,
  height: 415,
};
```

CSV is optional for now. The first implementation pass prioritizes visual
reconstruction over fully data-driven recomputation. If a later chart needs
data updates or generated scales, provide CSV and the chart can be upgraded.

## Implementation Pattern

Use the shared D3 chart utilities in `src/components/d3Chart`.

```tsx
import { D3ChartLayer, D3SvgCanvas, getSectionDesignWidth } from '../components/d3Chart';

function drawChart({ svg }: D3SvgRenderContext) {
  svg
    .append('path')
    .attr('d', '...')
    .attr('data-d3-animate', 'draw');
}

<D3ChartLayer
  bbox={{ x: 3200, y: 180, width: 520, height: 260 }}
  sectionDesignWidth={getSectionDesignWidth(3)}
>
  <D3SvgCanvas viewBox="0 0 520 260" render={drawChart} />
</D3ChartLayer>
```

Place `D3ChartLayer` inside the existing section image canvas container: the
same relative wrapper that contains `background.png`, `frontend.png`, and the
content/text layer. This keeps chart size and position locked to the same
responsive scaling behavior as the exported images.

The layer converts the Figma bounding box into percentages:

- `left = x / sectionDesignWidth`
- `top = y / 810`
- `width = bbox.width / sectionDesignWidth`
- `height = bbox.height / 810`

## Animation Rules

- Every chart gets the default entrance behavior.
- Each time the chart scrolls into view, the animation resets and replays.
- Leaving the viewport resets the chart so reverse scrolling behaves the same
  as forward scrolling.
- Entrance animation must not depend on horizontal ordering.
- Allowed effects:
  - opacity fade
  - vertical `y` motion
  - small scale/breathing motion
  - path stroke reveal
  - vertical bar/area growth
- Avoid horizontal stagger, left-to-right reveal, or any animation whose meaning
  changes when the user scrolls backward.

Elements can opt into the default animation with:

```ts
.attr('data-d3-animate', 'fade')   // default fade + vertical rise
.attr('data-d3-animate', 'draw')   // stroke-dash path reveal
.attr('data-d3-animate', 'grow-y') // vertical growth
```

## Visual Matching Process

- Keep the original `frontend.png` chart visible while implementing the D3
  version.
- Use `debug` on `D3ChartLayer` if a temporary bounding-box outline is helpful.
- Compare D3 against the embedded chart at multiple viewport ratios.
- After a chart is visually approved, the corresponding chart artwork can later
  be removed from the foreground export in a separate asset pass.

## Verification Checklist

- `node_modules/.bin/tsc.cmd -b` passes.
- `node_modules/.bin/eslint.cmd src/components/d3Chart` passes when shared D3
  utilities are changed.
- Run the full project build when environment permissions allow it.
- Manually check:
  - desktop wide viewport
  - normal desktop viewport
  - narrow or tall viewport
  - forward horizontal scroll
  - reverse horizontal scroll
  - chart re-entry replay behavior

## Current Notes

- D3 is installed as a project dependency.
- The shared implementation files are:
  - `src/components/d3Chart/D3ChartLayer.tsx`
  - `src/components/d3Chart/D3SvgCanvas.tsx`
  - `src/components/d3Chart/useD3EntranceAnimation.ts`
  - `src/components/d3Chart/designSpace.ts`
- Full `npm run build` was blocked in the current sandbox by Vite/esbuild
  access to parent directories, but TypeScript and targeted ESLint checks passed.
