import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// TODO: Add N/S E/W callout to Rejuvenating Balm
// TODO: Add Summon

const phaserOutputStrings = {
  sides: {
    en: 'Sides',
    de: 'Seiten',
    fr: 'Côtés',
    ja: '横へ',
    ko: '양옆으로',
    cn: '去侧面',
  },
  out: {
    en: 'Out',
    de: 'Raus',
    ja: '外へ',
    fr: 'Extérieur',
    cn: '远离',
    ko: '밖으로',
  },
  healerStacks: {
    en: 'Healer Stacks',
    de: 'Bei den Heilern sammeln',
    fr: 'Packages sur les heals',
    ja: 'ヒーラーに集合',
    cn: '治疗集合',
    ko: '힐러 모이기',
  },
  tankSpread: {
    en: 'Tank Spread',
    de: 'Tanks verteilen',
    fr: 'Tanks, dispersez-vous',
    ja: 'タンクは外に',
    cn: '坦克散开',
    ko: '탱 산개',
  },
  tankLaser: {
    en: 'Laser on YOU',
    de: 'Laser auf DIR',
    fr: 'Laser sur VOUS',
    cn: '激光点名',
    ko: '레이저 대상자',
  },
};

const artOfDarknessOutputStrings = {
  startRight: {
    en: 'Start Right',
  },
  startLeft: {
    en: 'Start Left',
  },
  goRight: {
    en: 'Right',
    de: 'Rechts',
    fr: 'Droite ',
    ja: '右へ',
    cn: '右',
    ko: '오른쪽',
  },
  goLeft: {
    en: 'Left',
    de: 'Links',
    fr: 'Gauche',
    ja: '左へ',
    cn: '左',
    ko: '왼쪽',
  },
  stackWithPartner: {
    en: 'Stack With Partner',
    de: 'Mit Partner stacken',
    fr: 'Packez-vous avec votre partenaire',
    ja: '相方とスタック',
    cn: '与搭档集合',
    ko: '쉐어뎀 파트너랑 모이기',
  },
  protean: {
    en: 'Protean',
    de: 'Himmelsrichtungen',
    fr: 'Position',
    ja: '散開',
    cn: '散开',
    ko: '산개',
  },
};

export default {
  zoneId: ZoneId.EdensPromiseUmbraSavage,
  timelineFile: 'e9s.txt',
  triggers: [
    {
      id: 'E9S Ground-Razing Particle Beam',
      netRegex: NetRegexes.startsUsing({ id: '5625', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5625', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5625', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5625', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '5625', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '5625', source: '어둠의 구름', capture: false }),
      condition: Conditions.caresAboutAOE(),
      durationSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'E9S The Art Of Darkness Protean',
      netRegex: NetRegexes.startsUsing({ id: ['5B45', '55FB'], source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['5B45', '55FB'], source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['5B45', '55FB'], source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['5B45', '55FB'], source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['5B45', '55FB'], source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['5B45', '55FB'], source: '어둠의 구름', capture: false }),
      durationSeconds: (data) => {
        if (data.phase === 'empty')
          return 8;
        return 4;
      },
      alertText: (data, _, output) => output['protean'](),
      outputStrings: artOfDarknessOutputStrings,
    },
    {
      id: 'E9S The Art Of Darkness Partner Stacks',
      netRegex: NetRegexes.startsUsing({ id: ['5B46', '55FE'], source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['5B46', '55FE'], source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['5B46', '55FE'], source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['5B46', '55FE'], source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['5B46', '55FE'], source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['5B46', '55FE'], source: '어둠의 구름', capture: false }),
      durationSeconds: (data) => {
        if (data.phase === 'empty')
          return 8;
        return 4;
      },
      alertText: (data, _, output) => output['stackWithPartner'](),
      outputStrings: artOfDarknessOutputStrings,
    },
    {
      id: 'E9S Zero-Form Devouring Dark',
      netRegex: NetRegexes.startsUsing({ id: '5623', source: 'Cloud Of Darkness' }),
      netRegexDe: NetRegexes.startsUsing({ id: '5623', source: 'Wolke Der Dunkelheit' }),
      netRegexFr: NetRegexes.startsUsing({ id: '5623', source: 'Nuage De Ténèbres' }),
      netRegexJa: NetRegexes.startsUsing({ id: '5623', source: '暗闇の雲' }),
      netRegexCn: NetRegexes.startsUsing({ id: '5623', source: '暗黑之云' }),
      netRegexKo: NetRegexes.startsUsing({ id: '5623', source: '어둠의 구름' }),
      durationSeconds: 4,
      alertText: function(data, matches, output) {
        if (data.me === matches.target)
          return output.tankBusterOnYou();

        if (data.role === 'tank')
          return output.tankSwap();

        if (data.role === 'healer')
          return output.tankBusters({ player: data.ShortName(matches.target) });
      },
      infoText: function(data, _, output) {
        if (data.role !== 'tank' && data.role !== 'healer')
          return output.avoidLaser();
      },
      outputStrings: {
        tankBusterOnYou: {
          en: 'Tank Buster on YOU',
          de: 'Tank buster auf DIR',
          fr: 'Tank buster sur VOUS',
          ja: '自分にタンクバスター',
          cn: '死刑点名',
          ko: '탱버 대상자',
        },
        tankBusters: {
          en: 'Tank Busters',
          de: 'Tank buster',
          fr: 'Tank buster',
          ja: 'タンクバスター',
          cn: '死刑',
          ko: '탱버',
        },
        tankSwap: {
          en: 'Tank Swap!',
          de: 'Tankwechsel!',
          fr: 'Tank swap !',
          ja: 'タンクスイッチ',
          cn: '换T！',
          ko: '탱 교대',
        },
        avoidLaser: {
          en: 'Avoid Laser',
          de: 'Laser ausweichen',
          fr: 'Évitez le laser',
          ja: 'アバランチに避け',
          cn: '躲避击退激光',
          ko: '레이저 피하기',
        },
      },
    },
    {
      id: 'E9S Obscure Woods',
      netRegex: NetRegexes.startsUsing({ id: '55EE', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '55EE', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '55EE', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '55EE', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '55EE', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '55EE', source: '어둠의 구름', capture: false }),
      condition: Conditions.caresAboutAOE(),
      durationSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'E9S Flood Of Obscurity',
      netRegex: NetRegexes.startsUsing({ id: '5907', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5907', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5907', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5907', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '5907', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '5907', source: '어둠의 구름', capture: false }),
      delaySeconds: 3,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Place Bramble',
          de: 'Dornenstrauch plazieren',
          fr: 'Déposez les ronces',
          ko: '장판 유도하기',
        },
      },
    },
    {
      id: 'E9S Waste Away',
      netRegex: NetRegexes.startsUsing({ id: '5617', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5617', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5617', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5617', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '5617', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '5617', source: '어둠의 구름', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'E9S Rejuvenating Balm',
      netRegex: NetRegexes.startsUsing({ id: '5618', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5618', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5618', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5618', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '5618', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '5618', source: '어둠의 구름', capture: false }),
      durationSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away From Tethered Walls',
          de: 'Weg von den verbundenen Wänden',
          fr: 'Éloignez-vous des murs liés',
          ko: '보스 선 연결된 방향 피하기',
        },
      },
    },
    {
      id: 'E9S Stygian Break Tether',
      netRegex: NetRegexes.headMarker({ id: '00D4' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 3,
      response: Responses.breakChains(),
    },
    {
      id: 'E9S Anti-Air Phaser Unlimited List',
      netRegex: NetRegexes.startsUsing({ id: '561[23]', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '561[23]', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '561[23]', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '561[23]', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '561[23]', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '561[23]', source: '어둠의 구름', capture: false }),
      preRun: (data) => {
        if (data.role === 'tank')
          data.phaserOutputs = ['out', 'tankSpread', 'sides'];
        else
          data.phaserOutputs = ['out', 'healerStacks', 'sides'];
      },
      durationSeconds: 15,
      infoText: (data, _, output) => data.phaserOutputs.map((key) => output[key]()).join(' -> '),
      run: (data) => data.phaserOutputs.shift(),
      outputStrings: phaserOutputStrings,
    },
    {
      id: 'E9S Anti-Air Phaser Unlimited 2',
      netRegex: NetRegexes.startsUsing({ id: '561[23]', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '561[23]', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '561[23]', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '561[23]', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '561[23]', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '561[23]', source: '어둠의 구름', capture: false }),
      delaySeconds: 7,
      alertText: (data, _, output) => output[data.phaserOutputs.shift()](),
      outputStrings: phaserOutputStrings,
    },
    {
      id: 'E9S Anti-Air Phaser Unlimited 3',
      netRegex: NetRegexes.startsUsing({ id: '561[23]', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '561[23]', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '561[23]', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '561[23]', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '561[23]', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '561[23]', source: '어둠의 구름', capture: false }),
      delaySeconds: 12,
      alertText: (data, _, output) => output[data.phaserOutputs.shift()](),
      outputStrings: phaserOutputStrings,
    },
    {
      id: 'E9S Wide-Angle Phaser Unlimited List',
      netRegex: NetRegexes.startsUsing({ id: '560[DE]', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '560[DE]', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '560[DE]', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '560[DE]', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '560[DE]', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '560[DE]', source: '어둠의 구름', capture: false }),
      preRun: (data) => {
        if (data.role === 'tank')
          data.phaserOutputs = ['sides', 'tankLaser', 'out'];
        else
          data.phaserOutputs = ['sides', 'healerStacks', 'out'];
      },
      durationSeconds: 15,
      infoText: (data, _, output) => data.phaserOutputs.map((key) => output[key]()).join(' -> '),
      run: (data) => data.phaserOutputs.shift(),
      outputStrings: phaserOutputStrings,
    },
    {
      id: 'E9S Wide-Angle Phaser Unlimited 2',
      netRegex: NetRegexes.startsUsing({ id: '560[DE]', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '560[DE]', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '560[DE]', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '560[DE]', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '560[DE]', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '560[DE]', source: '어둠의 구름', capture: false }),
      delaySeconds: 8,
      alertText: (data, _, output) => output[data.phaserOutputs.shift()](),
      outputStrings: phaserOutputStrings,
    },
    {
      id: 'E9S Wide-Angle Phaser Unlimited 3',
      netRegex: NetRegexes.startsUsing({ id: '560[DE]', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '560[DE]', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '560[DE]', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '560[DE]', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '560[DE]', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '560[DE]', source: '어둠의 구름', capture: false }),
      delaySeconds: 12,
      alertText: (data, _, output) => output[data.phaserOutputs.shift()](),
      outputStrings: phaserOutputStrings,
    },
    {
      id: 'E9S The Second Art Of Darkness Right',
      netRegex: NetRegexes.startsUsing({ id: '5601', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5601', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5601', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5601', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '5601', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '5601', source: '어둠의 구름', capture: false }),
      infoText: (data, _, output) => output['startLeft'](),
      outputStrings: artOfDarknessOutputStrings,
      run: (data) => {
        data.artOfDarknessRemaining = 2;
        data.artOfDarkness = [];
      },
    },
    {
      id: 'E9S The Second Art Of Darkness Left',
      netRegex: NetRegexes.startsUsing({ id: '5602', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5602', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5602', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5602', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '5602', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '5602', source: '어둠의 구름', capture: false }),
      infoText: (data, _, output) => output['startRight'](),
      outputStrings: artOfDarknessOutputStrings,
      run: (data) => {
        data.artOfDarknessRemaining = 2;
        data.artOfDarkness = [];
      },
    },
    {
      id: 'E9S The Second / Third Art Of Darkness Stack Charge',
      netRegex: NetRegexes.headMarker({ id: '01B9', capture: false }),
      preRun: (data) => data.artOfDarkness.push('stackWithPartner'),
      durationSeconds: (data) => {
        if (data.finalArtOfDarkness)
          return 16;
        return 9;
      },
      alertText: (data, _, output) => {
        if (data.finalArtOfDarkness)
          data.artOfDarkness.push(data.finalArtOfDarkness);
        return data.artOfDarkness.map((key) => output[key]()).join(' -> ');
      },
      outputStrings: artOfDarknessOutputStrings,
      run: (data) => {
        delete data.artOfDarkness;
        delete data.finalArtOfDarkness;
      },
    },
    {
      id: 'E9S The Second / Third Art Of Darkness Protean Charge',
      netRegex: NetRegexes.headMarker({ id: '01BA', capture: false }),
      preRun: (data) => data.artOfDarkness.push('protean'),
      durationSeconds: (data) => {
        if (data.finalArtOfDarkness)
          return 16;
        return 9;
      },
      alertText: (data, _, output) => {
        if (data.finalArtOfDarkness)
          data.artOfDarkness.push(data.finalArtOfDarkness);
        return data.artOfDarkness.map((key) => output[key]()).join(' -> ');
      },
      outputStrings: artOfDarknessOutputStrings,
      run: (data) => {
        delete data.artOfDarkness;
        delete data.finalArtOfDarkness;
      },
    },
    {
      id: 'E9S The Second / Third Art Of Darkness Right Charge',
      netRegex: NetRegexes.headMarker({ id: '01B8', capture: false }),
      condition: (data) => data.artOfDarkness,
      run: (data) => data.artOfDarkness.push('goLeft'),
    },
    {
      id: 'E9S The Second / Third Art Of Darkness Left Charge',
      netRegex: NetRegexes.headMarker({ id: '01B7', capture: false }),
      condition: (data) => data.artOfDarkness,
      run: (data) => data.artOfDarkness.push('goRight'),
    },
    {
      id: 'E9S Empty Plane',
      netRegex: NetRegexes.startsUsing({ id: '55EF', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '55EF', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '55EF', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '55EF', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '55EF', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '55EF', source: '어둠의 구름', capture: false }),
      condition: Conditions.caresAboutAOE(),
      durationSeconds: 5,
      response: Responses.aoe(),
      run: (data) => {
        data.phase = 'empty';
      },
    },
    {
      id: 'E9S Flood Of Emptiness',
      netRegex: NetRegexes.startsUsing({ id: '55F0', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '55F0', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '55F0', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '55F0', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '55F0', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '55F0', source: '어둠의 구름', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Tile Positions',
          de: 'Kachel Positionen',
          fr: 'Allez sur votre case',
          ko: '바닥 자리잡기',
        },
      },
    },
    {
      id: 'E9S Curse Of Darkness',
      netRegex: NetRegexes.gainsEffect({ effectId: '953' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (_, matches) => matches.duration - 3,
      alertText: (data, matches, output) => output.text({ player: data.ShortName(matches.target) }),
      outputStrings: {
        text: {
          en: 'Face Laser Out',
          de: 'Laser nach draußen richten',
          fr: 'Orientez le laser vers l\'extérieur',
        },
      },
    },
    {
      id: 'E9S Hypercharged Condensation',
      netRegex: NetRegexes.startsUsing({ id: '560C', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '560C', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '560C', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '560C', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '560C', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '560C', source: '어둠의 구름', capture: false }),
      delaySeconds: 2,
      durationSeconds: 5,
      response: Responses.killAdds(),
    },
    {
      id: 'E9S The Art Of Darkness Right',
      netRegex: NetRegexes.startsUsing({ id: '5A95', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5A95', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5A95', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5A95', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '5A95', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '5A95', source: '어둠의 구름', capture: false }),
      durationSeconds: 8,
      alertText: (data, _, output) => output['goLeft'](),
      outputStrings: artOfDarknessOutputStrings,
    },
    {
      id: 'E9S The Art Of Darkness Left',
      netRegex: NetRegexes.startsUsing({ id: '5A96', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5A96', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5A96', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5A96', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '5A96', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '5A96', source: '어둠의 구름', capture: false }),
      durationSeconds: 8,
      alertText: (data, _, output) => output['goRight'](),
      outputStrings: artOfDarknessOutputStrings,
    },
    {
      id: 'E9S Full-Perimeter Particle Beam',
      netRegex: NetRegexes.startsUsing({ id: '5629', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5629', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5629', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5629', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '5629', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '5629', source: '어둠의 구름', capture: false }),
      // Let Curse of Darkness trigger resolve first
      delaySeconds: 2,
      durationSeconds: 5,
      response: Responses.getIn(),
    },
    {
      id: 'E9S Deluge Of Darkness',
      netRegex: NetRegexes.startsUsing({ id: '55F1', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '55F1', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '55F1', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '55F1', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '55F1', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '55F1', source: '어둠의 구름', capture: false }),
      condition: Conditions.caresAboutAOE(),
      durationSeconds: 5,
      response: Responses.bigAoe('alert'),
      run: (data) => {
        delete data.phase;
      },
    },
    {
      id: 'E9S The Third Art Of Darkness Right',
      netRegex: NetRegexes.startsUsing({ id: '5603', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5603', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5603', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5603', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '5603', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '5603', source: '어둠의 구름', capture: false }),
      infoText: (data, _, output) => output['startLeft'](),
      outputStrings: artOfDarknessOutputStrings,
      run: (data) => {
        data.artOfDarknessRemaining = 2;
        data.artOfDarkness = [];
        // Add this once we've seen the second charge to call out sooner.
        data.finalArtOfDarkness = 'goRight';
      },
    },
    {
      id: 'E9S The Third Art Of Darkness Left',
      netRegex: NetRegexes.startsUsing({ id: '5604', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5604', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5604', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5604', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '5604', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '5604', source: '어둠의 구름', capture: false }),
      infoText: (data, _, output) => output['startRight'](),
      outputStrings: artOfDarknessOutputStrings,
      run: (data) => {
        data.artOfDarknessRemaining = 2;
        data.artOfDarkness = [];
        // Add this once we've seen the second charge to call out sooner.
        data.finalArtOfDarkness = 'goLeft';
      },
    },
    {
      id: 'E9S Particle Concentration',
      netRegex: NetRegexes.startsUsing({ id: '5620', source: 'Cloud Of Darkness', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5620', source: 'Wolke Der Dunkelheit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5620', source: 'Nuage De Ténèbres', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5620', source: '暗闇の雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '5620', source: '暗黑之云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '5620', source: '어둠의 구름', capture: false }),
      delaySeconds: 6,
      durationSeconds: 6,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Towers',
          de: 'Türme nehmen',
          fr: 'Prenez les tours',
          ja: '塔を踏む',
          cn: '踩塔',
          ko: '기둥 들어가기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'stygian tendrils': 'Stygische Ranke',
        'Hypercharged Cloud': 'pulsierend(?:e|er|es|en) Wolke',
        'Cloud Of Darkness': 'Wolke der Dunkelheit',
      },
      'replaceText': {
        'Zero-Form Particle Beam': 'Nullform-Partikelstrahl',
        'Wide-Angle Phaser Unlimited': 'Weitwinkel-Phaser: Nullform',
        'Wide-Angle Particle Beam': 'Weitwinkel-Partikelstrahl',
        'Waste Away': 'Verdorren',
        'The Third Art Of Darkness': 'Dunkle Taktik: Dreifach',
        'The Second Art Of Darkness': 'Dunkle Taktik: Doppelt',
        'The Art Of Darkness': 'Dunkle Taktik',
        'Summon': 'Rufen',
        'Rejuvenating Balm': 'Aktivierte Kugel',
        'Particle Concentration': 'Wellenkugel',
        '(?<!(Full-Perimeter|Ground-Razing) )Particle Beam': 'Partikelstrahl',
        'Obscure Woods': 'Finsterer Wald',
        'Multi-Pronged Particle Beam': 'Mehrfacher Partikelstrahl',
        'Mire Of Despair': 'Sumpf der Dunkelheit',
        'Hypercharged Dispersal': 'Elektrisierte Zerstreuung',
        'Hypercharged Condensation': 'Elektrisierte Kondensation',
        'Hyper-Focused Particle Beam': 'Hochpräziser Partikelstrahl',
        'Heavy Wide-Angle Particle Beam': 'Schwerer Weitwinkel-Partikelstrahl',
        'Heavy Anti-Air Particle Beam': 'Schwerer Luftabwehr-Partikelstrahl',
        'Ground-Razing Particle Beam': 'Radialer Partikelstrahl',
        'Full-Perimeter Particle Beam': 'Partikelstrahl-Beschuss',
        'Flood Of Obscurity': 'Flut der Finsternis',
        'Flood Of Emptiness': 'Dunkle Flut: Düsterer Himmel',
        'Evil Seed': 'Saatkugel',
        'Empty Plane': 'Düsterer Himmel',
        'Earth-Shattering Particle Beam': 'Erderschütternder Partikelstrahl',
        'Devouring Dark': 'Erosion der Dunkelheit',
        'Deluge Of Darkness': 'Sintflut der Dunkelheit',
        'Dark-Energy Particle Beam': 'Dunkler Partikelstrahl',
        'Condensed Wide-Angle Particle Beam': 'Kondensierter Weitwinkel-Partikelstrahl',
        'Condensed Anti-Air Particle Beam': 'Kondensierter Luftabwehr-Partikelstrahl',
        'Bad Vibrations': 'Starke Vibration',
        'Anti-Air Phaser Unlimited': 'Flugabwehr-Phaser: Nullform',
        'Anti-Air Particle Beam': 'Flugabwehr-Partikelstrahl',
        'Aetherosynthesis': 'Energieaufnahme',
        'Phaser Unlimited': 'Phaser: Nullform',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'stygian tendrils': 'Ronce ténébreuse',
        'Hypercharged Cloud': 'nuage palpitant',
        'Cloud Of Darkness': 'Nuage de Ténèbres',
      },
      'replaceText': {
        'Zero-Form Particle Beam': 'Faisceau de particules zéro absolu',
        'Wide-Angle Phaser Unlimited': 'Faisceau de particules bondissant élargi : zéro absolu',
        'Wide-Angle Particle Beam': 'Faisceau de particules élargi',
        'Waste Away': 'Dépérissement',
        'The Third Art Of Darkness': 'Arts ténébreux triple',
        'The Second Art Of Darkness': 'Arts ténébreux double',
        'The Art Of Darkness': 'Arts ténébreux',
        'Summon': 'Invocation',
        'Rejuvenating Balm': 'Tir vivifiant',
        'Particle Concentration': 'Rayon sphérique',
        '(?<!(Full-Perimeter|Ground-Razing) )Particle Beam': 'Rayon explosif',
        'Obscure Woods': 'Forêt obscure',
        'Multi-Pronged Particle Beam': 'Faisceau de particules massacreur',
        'Mire Of Despair': 'Marais de Ténèbres',
        'Hypercharged Dispersal': 'Dissipation',
        'Hypercharged Condensation': 'Aspiration particulaire',
        'Hyper-Focused Particle Beam': 'Faisceau de particules chirurgical',
        'Heavy Wide-Angle Particle Beam': 'Faisceau de particules haute tension élargi',
        'Heavy Anti-Air Particle Beam': 'Faisceau de particules haute tension antiaérien',
        'Ground-Razing Particle Beam': 'Faisceau de particules radiant',
        'Full-Perimeter Particle Beam': 'Faisceau de particules balayant',
        'Flood Of Obscurity': 'Déluge de Ténèbres : Forêt obscure',
        'Flood Of Emptiness': 'Déluge de Ténèbres : Cieux obscurs',
        'Evil Seed': 'Tir semant',
        'Empty Plane': 'Cieux obscurs',
        'Earth-Shattering Particle Beam': 'Faisceau de particules fracassant',
        'Devouring Dark': 'Érosion de Ténèbres',
        'Deluge Of Darkness': 'Grand déluge de Ténèbres',
        'Dark-Energy Particle Beam': 'Faisceau de particules maudit',
        'Condensed Wide-Angle Particle Beam': 'Faisceau de particules surpuissant élargi',
        'Condensed Anti-Air Particle Beam': 'Faisceau de particules surpuissant antiaérien',
        'Bad Vibrations': 'Vibration intense',
        'Anti-Air Phaser Unlimited': 'Faisceau de particules bondissant antiaérien : zéro absolu',
        'Anti-Air Particle Beam': 'Faisceau de particules antiaérien',
        'Aetherosynthesis': 'Absorption d\'énergie',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'stygian tendrils': '闇の茨',
        'Hypercharged Cloud': '波動雲',
        'Cloud Of Darkness': '暗闇の雲',
      },
      'replaceText': {
        'Zero-Form Particle Beam': '零式 波動砲',
        'Wide-Angle Phaser Unlimited': '広角式 跳躍波動砲：零式',
        'Wide-Angle Particle Beam': '広角式 波動砲',
        'Waste Away': '立ち枯れ',
        'The Third Art Of Darkness': '闇の戦技：三重',
        'The Second Art Of Darkness': '闇の戦技：二重',
        'The Art Of Darkness': '闇の戦技',
        'Summon': '召喚',
        'Rejuvenating Balm': '活性弾',
        'Particle Concentration': '波動球',
        '(?<!(Full-Perimeter|Ground-Razing) )Particle Beam': '波動爆発',
        'Obscure Woods': '暗黒森林',
        'Multi-Pronged Particle Beam': '乱激式 波動砲',
        'Mire Of Despair': '闇の沼',
        'Hypercharged Dispersal': '被吸収',
        'Hypercharged Condensation': '波動雲吸引',
        'Hyper-Focused Particle Beam': '狙撃式 波動砲',
        'Heavy Wide-Angle Particle Beam': '広角式 高圧波動砲',
        'Heavy Anti-Air Particle Beam': '高射式 高圧波動砲',
        'Ground-Razing Particle Beam': '放射式 波動砲',
        'Full-Perimeter Particle Beam': '掃射式 波動砲',
        'Flood Of Obscurity': '闇の氾濫：暗黒森林',
        'Flood Of Emptiness': '闇の氾濫：暗黒天空',
        'Evil Seed': '種子弾',
        'Empty Plane': '暗黒天空',
        'Earth-Shattering Particle Beam': '貫地式 波動砲',
        'Devouring Dark': '闇の浸食',
        'Deluge Of Darkness': '闇の大氾濫',
        'Dark-Energy Particle Beam': '呪詛式 波動砲',
        'Condensed Wide-Angle Particle Beam': '広角式 高出力波動砲',
        'Condensed Anti-Air Particle Beam': '高射式 高出力波動砲',
        'Bad Vibrations': '強振動',
        'Anti-Air Phaser Unlimited': '高射式 跳躍波動砲：零式',
        'Anti-Air Particle Beam': '高射式 波動砲',
        'Aetherosynthesis': '生気吸収',
      },
    },
  ],
};
