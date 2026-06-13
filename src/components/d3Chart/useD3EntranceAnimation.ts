import { useEffect } from 'react';
import type { RefObject } from 'react';
import * as d3 from 'd3';

const ENTER_DURATION_MS = 900;
const RESET_Y = 18;

type AnimatedElement = HTMLElement | SVGElement;

function resetElement(el: AnimatedElement) {
  const selection = d3.select(el);
  const mode = el.getAttribute('data-d3-animate');

  if (mode === 'draw' && 'getTotalLength' in el) {
    const length = (el as SVGGeometryElement).getTotalLength();
    selection
      .style('stroke-dasharray', `${length}`)
      .style('stroke-dashoffset', `${length}`)
      .style('opacity', '1');
    return;
  }

  if (mode === 'grow-y') {
    selection
      .style('opacity', '0')
      .style('transform', `translateY(${RESET_Y}px) scaleY(0.01)`);
    return;
  }

  selection.style('opacity', '0').style('transform', `translateY(${RESET_Y}px)`);
}

function playElement(el: AnimatedElement, index: number) {
  const selection = d3.select(el);
  const mode = el.getAttribute('data-d3-animate');
  const delay = Math.min(index * 55, 220);

  if (mode === 'draw') {
    selection
      .transition()
      .delay(delay)
      .duration(ENTER_DURATION_MS)
      .ease(d3.easeCubicOut)
      .style('stroke-dashoffset', '0');
    return;
  }

  selection
    .transition()
    .delay(delay)
    .duration(ENTER_DURATION_MS)
    .ease(d3.easeCubicOut)
    .style('opacity', '1')
    .style('transform', 'translateY(0px) scaleY(1)');
}

export function useD3EntranceAnimation(
  ref: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let isVisible = false;
    let rafId = 0;

    const selectAnimatedElements = () =>
      Array.from(
        root.querySelectorAll<AnimatedElement>('[data-d3-animate]'),
      );

    const reset = () => {
      d3.select(root)
        .interrupt()
        .style('opacity', '0')
        .style('transform', `translateY(${RESET_Y}px) scale(0.985)`);
      selectAnimatedElements().forEach((el) => {
        d3.select(el).interrupt();
        resetElement(el);
      });
    };

    const play = () => {
      d3.select(root)
        .transition()
        .duration(ENTER_DURATION_MS)
        .ease(d3.easeCubicOut)
        .style('opacity', '1')
        .style('transform', 'translateY(0px) scale(1)');
      selectAnimatedElements().forEach(playElement);
    };

    const replay = () => {
      reset();
      if (!isVisible) return;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(play);
    };

    reset();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        isVisible = entry.isIntersecting;
        if (entry.isIntersecting) {
          replay();
        } else {
          reset();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(root);

    const mutationObserver = new MutationObserver(replay);
    mutationObserver.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      d3.select(root).interrupt();
      selectAnimatedElements().forEach((el) => d3.select(el).interrupt());
    };
  }, [ref]);
}
