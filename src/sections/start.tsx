import backgroundImage from '../assets/start/background.png';
import { getSectionZLayers } from '../constants/zIndex';
import { Z_LAYERS } from '../constants/zIndex';
import SectionText from '../components/SectionText';
import type { SectionTextProps } from '../components/SectionText';
import Boat from '../components/Boat';
import {
  resolveStartAssetUrl,
  startBirdsConfig,
} from './startBirdsConfig';

const Z = getSectionZLayers();
/** 介于 BACKGROUND 与 BOAT 之间，与背景同坐标系 */
const START_BIRDS_Z = 15;

const START_WIDTH = '100vw';

const START_TEXTS: SectionTextProps[] = [
  {
    justify: false,
    title:
      'A Small Boat in a Great Tide\n One Man’s Journey Through\n China’s Modernization',
    style: {
      left: '5vw',
      top: '10% ',
    },
  },
  {
    body: [
      'Over the past seventy years, China has journeyed from poverty to its emergence as a global\npower.The world watches with curiosity, yet often knows little of the vast, stirring voyage\nof its modernization— a journey shaped not only by policies and statistics, but by the lives\nof ordinary people.',
      ' ',
      'By chance, we came across the oral history of one such person: Zhao Dachun, an ordinary\nChinese man born in 1934. As we helped digitize his memories, we realized that the destinies\nof an individual and a nation are like a boat upon a river — rising and falling together, carried\nforward by the same currents of time. His story is a portrait of an ordinary life moving in\nquiet resonance with the fate of a country.',
    ],
    style: {
      left: '5vw',
      bottom: '15% ',
    },
  },
];

export default function Start() {
  const { width: designW, height: designH, imgs: birdImgs } = startBirdsConfig;

  return (
    <div
      className="relative shrink-0 h-full"
      style={{ width: START_WIDTH, maxWidth: START_WIDTH }}
    >
      <div className="relative w-full h-full flex items-center">
        <div className="relative w-full">
          <img
            src={backgroundImage}
            alt=""
            aria-hidden
            className="block w-full h-auto pointer-events-none invisible"
          />
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
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden"
            style={{ zIndex: START_BIRDS_Z }}
            aria-hidden
          >
            {birdImgs.map((bird, i) => (
              <div
                key={`${bird.url}-${i}`}
                className="start-bird absolute"
                style={{
                  left: `${(bird.x / designW) * 100}%`,
                  top: `${(bird.y / designH) * 100}%`,
                  width: `${(bird.width / designW) * 100}%`,
                  height: `${(bird.height / designH) * 100}%`,
                }}
              >
                <img
                  src={resolveStartAssetUrl(bird.url)}
                  alt=""
                  className="max-w-none w-full h-full object-contain"
                  draggable={false}
                />
              </div>
            ))}
          </div>
          <Boat
            className="absolute pointer-events-none"
            style={{
              left: '5vw',
              bottom: '45%',
              zIndex: Z_LAYERS.BOAT,
            }}
          />
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{ zIndex: Z.CONTENT }}
          >
            {START_TEXTS.map((item, i) => (
              <SectionText key={i} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
