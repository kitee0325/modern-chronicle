import backgroundImage from '../assets/section1/background.png';
import frontendImage from '../assets/section1/frontend.png';
import { getSectionZLayers } from '../constants/zIndex';
import Section1Chart from './Section1Chart';

const Z = getSectionZLayers();
import SectionText from '../components/SectionText';
import type { SectionTextProps } from '../components/SectionText';

const SECTION1_WIDTH = '300vw';

const SECTION1_TEXTS: SectionTextProps[] = [
  {
    title: '1949-1957',
    style: {
      left: '5vw',
      top: '10% ',
    },
  },
  {
    body: 'At the dawn of an era, all things await revival.\nAgainst this backdrop, love, health, and marriage\nwere rarely matters of personal will.',
    style: {
      left: '5vw',
      top: '18% ',
    },
  },
  {
    body: 'In 1949, the People’s Republic of China had just been founded. Institutions were still under construction, \nresources were extremely scarce, and everything awaited recovery. Compared with Europe and the United\nStates, China’s per capita income, medical resources, and infrastructure were at very low levels.\nThe urban–rural divide was stark, public services were limited, and individual life choices were profoundly\nconstrained by conditions of survival and institutional structures.',
    style: {
      left: '40vw',
      top: '18% ',
    },
  },
  {
    body: 'Zhao Da chun was born in 1934. Like a small boat, an individual life set\nsail amid the vast ocean of history. ',
    style: {
      left: '105vw',
      top: '18% ',
    },
  },
  {
    body: "China's total GDP ranks fifth globally, but due to its massive\npopulation, its GDP per capita ranks among the lowest in the\nworld.",
    style: {
      right: '62vw',
      top: '18% ',
      width: '40vw',
    },
  },
];

export default function Section1() {
  return (
    <div
      className="relative shrink-0 h-full"
      style={{ width: SECTION1_WIDTH, maxWidth: SECTION1_WIDTH }}
    >
      <div className="relative w-full h-full flex items-center">
        {/* 画面容器：尺寸与前景/背景图片一致 */}
        <div className="relative w-full">
          {/* 幽灵图：不可见，但用于撑开容器高度，使其与图片真实尺寸一致 */}
          <img
            src={backgroundImage}
            alt=""
            aria-hidden
            className="block w-full h-auto pointer-events-none invisible"
          />
          {/* 背景图层：与前景共用垂直对齐逻辑 */}
          <img
            src={backgroundImage}
            alt=""
            aria-hidden
            className="absolute pointer-events-none section-frontend"
            style={{
              width: '100%',
              height: 'auto',
              zIndex: Z.BACKGROUND,
            }}
          />
          {/* 前景图层 */}
          <img
            src={frontendImage}
            alt=""
            role="presentation"
            aria-hidden
            className="absolute pointer-events-none section-frontend"
            style={{
              width: '100%',
              height: 'auto',
              zIndex: Z.FRONTEND,
            }}
          />
          {/* 内容层：文字 / 图表，相对画面容器定位 */}
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{ zIndex: Z.CONTENT }}
          >
            <Section1Chart />
            {SECTION1_TEXTS.map((item, i) => (
              <SectionText key={i} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
