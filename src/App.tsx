import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HorizontalScroll from './components/HorizontalScroll';
import LoadingScreen from './components/LoadingScreen';
import Start from './sections/start';
import Section1 from './sections/Section1';
import Section2 from './sections/Section2';
import Section3 from './sections/Section3';
import Section4 from './sections/Section4';
import Section5 from './sections/Section5';
import Section6 from './sections/Section6';
import Section7 from './sections/Section7';
import Section8 from './sections/Section8';
import End from './sections/End';
import { preloadImages, preloadUrls } from './preloadAssets';
import {
  getViewportHeight,
  getViewportWidth,
  subscribeViewportResize,
} from './utils/viewport';

const MIN_LOADING_MS = 1200;
const START_INITIAL_SCALE_MIN = 0.3;
const START_INITIAL_SCALE_WINDOW_COVER = 1.08;
const INTRO_ZOOM_DURATION = 1;
const START_FILL_DURATION = 0.55;
const MASK_EXIT_START = 0.92;
const MASK_EXIT_DURATION = 0.08;
const BIRD_PRE_HOLD_DURATION = 0.6;
const BIRD_ANIMATION_DURATION = 1.2;
const BIRD_POST_HOLD_DURATION = 0.6;
const BIRD_ANIMATION_START = INTRO_ZOOM_DURATION + BIRD_PRE_HOLD_DURATION;
const BIRD_POST_HOLD_START = BIRD_ANIMATION_START + BIRD_ANIMATION_DURATION;
const INTRO_TIMELINE_DURATION = BIRD_POST_HOLD_START + BIRD_POST_HOLD_DURATION;

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [ready, setReady] = useState(false);
  const introRef = useRef<HTMLDivElement | null>(null);
  const startExitRef = useRef<HTMLDivElement | null>(null);
  const startZoomRef = useRef<HTMLDivElement | null>(null);
  const introWindowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      preloadImages(preloadUrls),
      new Promise((r) => setTimeout(r, MIN_LOADING_MS)),
    ]).then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    if (!ready) return;

    const introEl = introRef.current;
    const startExitEl = startExitRef.current;
    const startZoomEl = startZoomRef.current;
    const windowEl = introWindowRef.current;
    if (!introEl || !startExitEl || !startZoomEl || !windowEl) return;

    if (!getViewportHeight()) return;

    const getIntroWindowSize = () => ({
      width: windowEl.offsetWidth,
      height: windowEl.offsetHeight,
    });

    const getStartInitialScale = () => {
      const { width, height } = getIntroWindowSize();
      const viewportWidth = getViewportWidth();
      const viewportHeight = getViewportHeight();

      if (!width || !height || !viewportWidth || !viewportHeight) {
        return 1;
      }

      const coverWindowScale =
        Math.max(width / viewportWidth, height / viewportHeight) *
        START_INITIAL_SCALE_WINDOW_COVER;
      return Math.min(1, Math.max(START_INITIAL_SCALE_MIN, coverWindowScale));
    };

    const getWindowScale = () => {
      const { width, height } = getIntroWindowSize();
      const viewportWidth = getViewportWidth();
      const viewportHeight = getViewportHeight();

      if (!width || !height || !viewportWidth || !viewportHeight) {
        return 1;
      }

      return Math.max(viewportWidth / width, viewportHeight / height) * 1.08;
    };

    const getIntroScrollDistance = () =>
      getViewportHeight() * INTRO_TIMELINE_DURATION;

    const birds = gsap.utils.toArray<HTMLElement>(
      startZoomEl.querySelectorAll('.start-bird'),
    );
    gsap.set(birds, {
      opacity: 0,
      y: 20,
      scale: 0.94,
      transformOrigin: '50% 50%',
    });

    const birdsTimeline = gsap.timeline({ paused: true });
    const enterDur = 1.15;
    const staggerGap = 0.26;
    const breathScale = 1.045;
    const breathInOutDur = 1.35;
    const breathPulses = 2;

    birds.forEach((bird, i) => {
      const one = gsap.timeline();
      one
        .fromTo(
          bird,
          { opacity: 0, y: 22, scale: 0.93 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: enterDur,
            ease: 'power3.out',
          },
        )
        .to(bird, {
          scale: breathScale,
          duration: breathInOutDur,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: breathPulses,
        });
      birdsTimeline.add(one, i * staggerGap);
    });
    birdsTimeline.totalDuration(BIRD_ANIMATION_DURATION);

    gsap.set(startExitEl, {
      y: 0,
      autoAlpha: 1,
    });

    gsap.set(startZoomEl, {
      scale: getStartInitialScale(),
      transformOrigin: '50% 50%',
    });

    gsap.set(windowEl, {
      scale: 1,
      transformOrigin: '50% 50%',
    });

    const introTimeline = gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: introEl,
          start: 'top top',
          end: () => `+=${getIntroScrollDistance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      .to(
        windowEl,
        {
          scale: getWindowScale,
          duration: INTRO_ZOOM_DURATION,
        },
        0,
      )
      .fromTo(
        startZoomEl,
        { scale: getStartInitialScale },
        {
          scale: 1,
          duration: START_FILL_DURATION,
        },
        0,
      )
      .to(
        windowEl,
        {
          autoAlpha: 0,
          duration: MASK_EXIT_DURATION,
        },
        MASK_EXIT_START,
      )
      .to(
        {},
        {
          duration: BIRD_PRE_HOLD_DURATION,
        },
        INTRO_ZOOM_DURATION,
      )
      .add(birdsTimeline, BIRD_ANIMATION_START)
      .to(
        {},
        {
          duration: BIRD_POST_HOLD_DURATION,
        },
        BIRD_POST_HOLD_START,
      );
    birdsTimeline.paused(false);

    const startTween = gsap.fromTo(
      startExitEl,
      { y: 0, autoAlpha: 1 },
      {
        y: () => -getViewportHeight(),
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: introEl,
          start: () => `top+=${getIntroScrollDistance()} top`,
          end: () => `+=${getViewportHeight()}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      },
    );

    let rafId = 0;
    const handleViewportChange = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        ScrollTrigger.refresh();
      });
    };

    const unsubscribe = subscribeViewportResize(handleViewportChange);

    return () => {
      unsubscribe();
      if (rafId) cancelAnimationFrame(rafId);
      introTimeline.kill();
      startTween.kill();
    };
  }, [ready]);

  if (!ready) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-dvh bg-black overflow-x-hidden">
      <div
        ref={introRef}
        className="relative w-screen h-dvh min-h-dvh overflow-hidden"
      >
        <div
          ref={startExitRef}
          className="absolute inset-0 overflow-hidden will-change-transform"
        >
          <div
            ref={startZoomRef}
            className="absolute inset-0 flex items-center justify-center overflow-hidden will-change-transform"
          >
            <Start />
          </div>
        </div>
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              ref={introWindowRef}
              className="aspect-video w-[clamp(320px,48vw,760px)]"
              style={{
                boxShadow: '0 0 0 120vmax #efe6d2',
                willChange: 'transform',
              }}
            />
          </div>
        </div>
      </div>
      <HorizontalScroll>
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
        <Section5 />
        <Section6 />
        <Section7 />
        <Section8 />
      </HorizontalScroll>
      <End />
    </div>
  );
}

export default App;
