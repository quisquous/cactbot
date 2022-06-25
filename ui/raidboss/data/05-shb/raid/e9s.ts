import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { UnreachableCode } from '../../../../../resources/not_reached';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  phaserOutputs?: string[];
  phase?: string;
  finalArtOfDarkness?: string;
  artOfDarkness?: string[];
  artOfDarknessIdMap?: { [id: string]: string };
  artOfDarknessExpected?: string;
  summon?: boolean;
  boss?: PluginCombatantState;
  clones?: PluginCombatantState[];
}

// TODO: Add N/S E/W callout to Rejuvenating Balm

const phaserOutputStrings = {
  sides: Outputs.sides,
  out: Outputs.out,
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
    ja: '自分にレーザー',
    cn: '激光点名',
    ko: '레이저 대상자',
  },
};

const artOfDarknessOutputStrings = {
  goRight: Outputs.right,
  goLeft: Outputs.left,
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
    fr: 'Positions',
    ja: '散開',
    cn: '散开',
    ko: '산개',
  },
  unknown: Outputs.unknown,
};

const summonDirectionOutputStrings = {
  NNE: {
    en: 'NNE',
    de: 'NNO',
    fr: 'NNE',
    ja: '北北東(1時)',
    cn: '上偏右(北偏东)',
    ko: '1시',
  },
  ENE: {
    en: 'ENE',
    de: 'ONO',
    fr: 'ENE',
    ja: '東北東(2時)',
    cn: '右偏上(东偏北)',
    ko: '2시',
  },
  ESE: {
    en: 'ESE',
    de: 'OSO',
    fr: 'ESE',
    ja: '東南東(4時)',
    cn: '右偏下(东偏南)',
    ko: '4시',
  },
  SSE: {
    en: 'SSE',
    de: 'SSO',
    fr: 'SSE',
    ja: '南南東(5時)',
    cn: '下偏右(南偏东)',
    ko: '5시',
  },
  SSW: {
    en: 'SSW',
    de: 'SSW',
    fr: 'SSO',
    ja: '南南西(7時)',
    cn: '下偏左(南偏西)',
    ko: '7시',
  },
  WSW: {
    en: 'WSW',
    de: 'WSW',
    fr: 'OSO',
    ja: '西南西(8時)',
    cn: '左偏下(西偏南)',
    ko: '8시',
  },
  WNW: {
    en: 'WNW',
    de: 'WNW',
    fr: 'ONO',
    ja: '西北西(10時)',
    cn: '左偏上(西偏北)',
    ko: '10시',
  },
  NNW: {
    en: 'NNW',
    de: 'NNW',
    fr: 'NNO',
    ja: '北北西(11時)',
    cn: '上偏左(北偏西)',
    ko: '11시',
  },
  unknown: Outputs.unknown,
};

const convertBossHeadingToClonePosition = (boss: PluginCombatantState): PluginCombatantState => {
  // Snap heading to closest card/intercard (aka PI/4).  N = PI, E = PI/2.
  const closestRad = Math.round(boss.Heading * 4 / Math.PI) / 4 * Math.PI;
  // Find position opposite of the boss facing, centered on 100,100.
  return {
    ...boss,
    PosX: 100 - 20 * Math.round(Math.sin(closestRad)),
    PosY: 100 - 20 * Math.round(Math.cos(closestRad)),
  };
};

const calculateSummonSafeZone = (boss: PluginCombatantState, clone1: PluginCombatantState, clone2: PluginCombatantState, abilityId: string): string => {
  // Convert coordinates to 8 cardinal / intercardinal positions:
  // N at 0, NE at 1, ... NW at 7
  const b = Math.round(4 - 4 * Math.atan2(boss.PosX - 100, boss.PosY - 100) / Math.PI);
  const c1 = Math.round(4 - 4 * Math.atan2(clone1.PosX - 100, clone1.PosY - 100) / Math.PI);
  const c2 = Math.round(4 - 4 * Math.atan2(clone2.PosX - 100, clone2.PosY - 100) / Math.PI);

  const directions: { [idx: string]: string } = {
    '0': 'NNE',
    '1': 'ENE',
    '2': 'ESE',
    '3': 'SSE',
    '4': 'SSW',
    '5': 'WSW',
    '6': 'WNW',
    '7': 'NNW',
  };

  const badZones: number[] = [];
  for (const position of [b, c1, c2]) {
    for (let i = 0; i < 4; ++i) {
      let newPosition;
      // Swiping her right
      if (abilityId === '561E') {
        // Off by 1 here, since N is 0 for the Clone but NNE for the safe spot
        newPosition = ((position - i % 8) + 7) % 8;
      } else {
        newPosition = (position + i) % 8;
      }
      if (!badZones.includes(newPosition))
        badZones.push(newPosition);
    }
  }
  const safeZones = [0, 1, 2, 3, 4, 5, 6, 7]
    .filter((pos) => !badZones.includes(pos))
    .map((pos) => directions[pos]);

  const safeZone = safeZones[0];
  if (safeZone === undefined || safeZones.length !== 1)
    return 'unknown';

  return safeZone;
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.EdensPromiseUmbraSavage,
  timelineFile: 'e9s.txt',
  triggers: [
    {
      id: 'E9S Ground-Razing Particle Beam',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5625', source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'E9S The Art Of Darkness Protean',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['5B45', '55FB'], source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: (data) => data.phase === 'empty' ? 8 : 4,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: { text: artOfDarknessOutputStrings.protean },
    },
    {
      id: 'E9S The Art Of Darkness Partner Stacks',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['5B46', '55FE'], source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: (data) => data.phase === 'empty' ? 8 : 4,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: { text: artOfDarknessOutputStrings.stackWithPartner },
    },
    {
      id: 'E9S Zero-Form Devouring Dark',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5623', source: 'Cloud Of Darkness' }),
      durationSeconds: 4,
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.tankBusterOnYou!();

        if (data.role === 'tank')
          return output.tankSwap!();

        if (data.role === 'healer')
          return output.tankBusters!({ player: data.ShortName(matches.target) });
      },
      infoText: (data, _matches, output) => {
        if (data.role !== 'tank' && data.role !== 'healer')
          return output.avoidLaser!();
      },
      outputStrings: {
        tankBusterOnYou: Outputs.tankBusterOnYou,
        tankBusters: Outputs.tankBusters,
        tankSwap: Outputs.tankSwap,
        avoidLaser: {
          en: 'Avoid Laser',
          de: 'Laser ausweichen',
          fr: 'Évitez le laser',
          ja: 'レーザー注意',
          cn: '躲避死刑激光',
          ko: '레이저 피하기',
        },
      },
    },
    {
      id: 'E9S Obscure Woods',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '55EE', source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'E9S Flood Of Obscurity',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5907', source: 'Cloud Of Darkness', capture: false }),
      delaySeconds: 3,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Place Bramble',
          de: 'Dornenstrauch plazieren',
          fr: 'Placez les ronces',
          ja: '苗木を捨てる',
          cn: '击退放置树苗',
          ko: '장판 유도하기',
        },
      },
    },
    {
      id: 'E9S Waste Away',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5617', source: 'Cloud Of Darkness', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'E9S Rejuvenating Balm',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5618', source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away From Tethered Walls',
          de: 'Weg von den verbundenen Wänden',
          fr: 'Éloignez-vous des murs liés',
          ja: '線が繋がれなかった方へ',
          cn: '远离连线的墙壁',
          ko: '보스 선 연결된 방향 피하기',
        },
      },
    },
    {
      id: 'E9S Stygian Break Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '0012' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 1,
      response: Responses.breakChains(),
    },
    {
      id: 'E9S Anti-Air Phaser Unlimited List',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '561[23]', source: 'Cloud Of Darkness', capture: false }),
      preRun: (data) => {
        if (data.role === 'tank')
          data.phaserOutputs = ['out', 'tankSpread', 'sides'];
        else
          data.phaserOutputs = ['out', 'healerStacks', 'sides'];
      },
      durationSeconds: 15,
      infoText: (data, _matches, output) => data.phaserOutputs?.map((key) => output[key]!()).join(' -> '),
      run: (data) => data.phaserOutputs?.shift(),
      outputStrings: phaserOutputStrings,
    },
    {
      id: 'E9S Anti-Air Phaser Unlimited 2',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '561[23]', source: 'Cloud Of Darkness', capture: false }),
      delaySeconds: 7,
      alertText: (data, _matches, output) => {
        const key = data.phaserOutputs?.shift();
        if (key !== undefined && key.length > 0)
          return output[key]!();
      },
      outputStrings: phaserOutputStrings,
    },
    {
      id: 'E9S Anti-Air Phaser Unlimited 3',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '561[23]', source: 'Cloud Of Darkness', capture: false }),
      delaySeconds: 12,
      alertText: (data, _matches, output) => {
        const key = data.phaserOutputs?.shift();
        if (key !== undefined && key.length > 0)
          return output[key]!();
      },
      outputStrings: phaserOutputStrings,
    },
    {
      id: 'E9S Wide-Angle Phaser Unlimited List',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '560[DE]', source: 'Cloud Of Darkness', capture: false }),
      preRun: (data) => {
        if (data.role === 'tank')
          data.phaserOutputs = ['sides', 'tankLaser', 'out'];
        else
          data.phaserOutputs = ['sides', 'healerStacks', 'out'];
      },
      durationSeconds: 15,
      infoText: (data, _matches, output) => data.phaserOutputs?.map((key) => output[key]!()).join(' -> '),
      run: (data) => data.phaserOutputs?.shift(),
      outputStrings: phaserOutputStrings,
    },
    {
      id: 'E9S Wide-Angle Phaser Unlimited 2',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '560[DE]', source: 'Cloud Of Darkness', capture: false }),
      delaySeconds: 8,
      alertText: (data, _matches, output) => {
        const key = data.phaserOutputs?.shift();
        if (key !== undefined && key.length > 0)
          return output[key]!();
      },
      outputStrings: phaserOutputStrings,
    },
    {
      id: 'E9S Wide-Angle Phaser Unlimited 3',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '560[DE]', source: 'Cloud Of Darkness', capture: false }),
      delaySeconds: 12,
      alertText: (data, _matches, output) => {
        const key = data.phaserOutputs?.shift();
        if (key !== undefined && key.length > 0)
          return output[key]!();
      },
      outputStrings: phaserOutputStrings,
    },
    {
      id: 'E9S The Second Art Of Darkness Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5601', source: 'Cloud Of Darkness', capture: false }),
      // The fight goes Second Art -> Third Art -> Second Art, so we want
      // to have this cleaned up before the second Second Art Of Darkness
      preRun: (data) => delete data.finalArtOfDarkness,
      infoText: (_data, _matches, output) => output.text!(),
      run: (data) => {
        data.artOfDarkness = [];
        if (!data.artOfDarknessIdMap)
          data.artOfDarknessExpected = 'right';
      },
      outputStrings: {
        text: {
          en: 'Start Left',
          de: 'Starte Links',
          fr: 'Commencez à gauche',
          ja: '左から',
          cn: '左侧开始',
          ko: '왼쪽에서 시작',
        },
      },
    },
    {
      id: 'E9S The Second Art Of Darkness Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5602', source: 'Cloud Of Darkness', capture: false }),
      // The fight goes Second Art -> Third Art -> Second Art, so we want
      // to have this cleaned up before the second Second Art Of Darkness
      preRun: (data) => delete data.finalArtOfDarkness,
      infoText: (_data, _matches, output) => output.text!(),
      run: (data) => {
        data.artOfDarkness = [];
        if (!data.artOfDarknessIdMap)
          data.artOfDarknessExpected = 'left';
      },
      outputStrings: {
        text: {
          en: 'Start Right',
          de: 'Starte Rechts',
          fr: 'Commencez à droite',
          ja: '右から',
          cn: '右侧开始',
          ko: '오른쪽에서 시작',
        },
      },
    },
    {
      // The Art Of Darkness uses head markers with randomized offsets.  The first
      // charge is always left or right, and we can solve the rest from there.
      id: 'E9S The Second / Third Art Of Darkness Charge Solver',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ target: 'Cloud Of Darkness' }),
      condition: (data) => !data.artOfDarknessIdMap,
      run: (data, matches) => {
        data.artOfDarknessIdMap = {};

        let idPivot;
        if (data.artOfDarknessExpected === 'left')
          idPivot = parseInt(matches.id, 16);
        else if (data.artOfDarknessExpected === 'right')
          idPivot = parseInt(matches.id, 16) - 1;
        else
          throw new UnreachableCode();

        delete data.artOfDarknessExpected;

        // The left swipe is the lowest head marker, and the rest are sequential.
        const artOfDarknessOutputKeys = ['goRight', 'goLeft', 'stackWithPartner', 'protean'];
        for (let i = 0; i < 4; ++i) {
          const hexPivot = (idPivot + i).toString(16).toUpperCase().padStart(4, '0');
          const outputKey = artOfDarknessOutputKeys[i];
          if (outputKey === undefined || outputKey.length === 0)
            throw new UnreachableCode();
          data.artOfDarknessIdMap[hexPivot] = outputKey;
        }
      },
    },
    {
      id: 'E9S The Second / Third Art Of Darkness Left / Right Charge',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ target: 'Cloud Of Darkness' }),
      condition: (data, matches) => {
        if (!data.artOfDarkness || !data.artOfDarknessIdMap)
          return false;
        const output = data.artOfDarknessIdMap[matches.id];
        return output === 'goRight' || output === 'goLeft';
      },
      run: (data, matches) => data.artOfDarkness?.push(data.artOfDarknessIdMap?.[matches.id] ?? 'unknown'),
    },
    {
      // Fire the trigger on stack or protean since we want the callout as soon as possible.
      id: 'E9S The Second / Third Art Of Darkness Callout',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ target: 'Cloud Of Darkness' }),
      condition: (data, matches) => {
        if (!data.artOfDarkness || !data.artOfDarknessIdMap)
          return false;
        const output = data.artOfDarknessIdMap[matches.id];
        return output === 'stackWithPartner' || output === 'protean';
      },
      preRun: (data, matches) => data.artOfDarkness?.push(data.artOfDarknessIdMap?.[matches.id] ?? 'unknown'),
      durationSeconds: (data) => (data.finalArtOfDarkness !== undefined && data.finalArtOfDarkness.length > 0) ? 16 : 9,
      alertText: (data, _matches, output) => {
        // Perform the callout now, regardless if it's The Second or Third Art Of Darkness
        const callout = data.artOfDarkness?.slice();
        if (data.finalArtOfDarkness !== undefined && data.finalArtOfDarkness.length > 0)
          callout?.push(data.finalArtOfDarkness);
        return callout?.map((key) => output[key]!()).join(' -> ');
      },
      run: (data) => delete data.artOfDarkness,
      outputStrings: artOfDarknessOutputStrings,
    },
    {
      id: 'E9S Empty Plane',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '55EF', source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: 5,
      response: Responses.aoe(),
      run: (data) => data.phase = 'empty',
    },
    {
      id: 'E9S Flood Of Emptiness',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '55F0', source: 'Cloud Of Darkness', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Tile Positions',
          de: 'Kachel Positionen',
          fr: 'Positions',
          ja: '定めたパネルに待機',
          cn: '上自己的方块',
          ko: '바닥 자리잡기',
        },
      },
    },
    {
      id: 'E9S Curse Of Darkness',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '953' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Face Laser Out',
          de: 'Laser nach draußen richten',
          fr: 'Orientez le laser vers l\'extérieur',
          ja: 'レーザーを外に向ける',
          cn: '向外引导激光',
          ko: '바깥 바라보기 (레이저 유도)',
        },
      },
    },
    {
      id: 'E9S Hypercharged Condensation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '560C', source: 'Cloud Of Darkness', capture: false }),
      delaySeconds: 2,
      durationSeconds: 5,
      response: Responses.killAdds(),
    },
    {
      id: 'E9S The Art Of Darkness Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5A95', source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: 8,
      alertText: (data, _matches, output) => {
        if (!data.summon)
          return output.text!();
      },
      infoText: (data, _matches, output) => {
        if (data.summon)
          return output.text!();
      },
      outputStrings: { text: artOfDarknessOutputStrings.goLeft },
    },
    {
      id: 'E9S The Art Of Darkness Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5A96', source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: 8,
      alertText: (data, _matches, output) => {
        if (!data.summon)
          return output.text!();
      },
      infoText: (data, _matches, output) => {
        if (data.summon)
          return output.text!();
      },
      outputStrings: { text: artOfDarknessOutputStrings.goRight },
    },
    {
      id: 'E9S Full-Perimeter Particle Beam',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5629', source: 'Cloud Of Darkness', capture: false }),
      // Let Curse of Darkness trigger resolve first
      delaySeconds: 2,
      durationSeconds: 5,
      response: Responses.getIn(),
    },
    {
      id: 'E9S Deluge Of Darkness',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '55F1', source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: 5,
      response: Responses.bigAoe('alert'),
      run: (data) => delete data.phase,
    },
    {
      id: 'E9S The Third Art Of Darkness Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5603', source: 'Cloud Of Darkness', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      run: (data) => {
        data.artOfDarkness = [];
        // Add this once we've seen the second charge to call out sooner.
        data.finalArtOfDarkness = 'goRight';
      },
      outputStrings: {
        text: {
          en: 'Start Left',
          de: 'Starte Links',
          fr: 'Commencez à gauche',
          ja: '左から',
          cn: '左侧开始',
          ko: '왼쪽에서 시작',
        },
      },
    },
    {
      id: 'E9S The Third Art Of Darkness Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5604', source: 'Cloud Of Darkness', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      run: (data) => {
        data.artOfDarkness = [];
        // Add this once we've seen the second charge to call out sooner.
        data.finalArtOfDarkness = 'goLeft';
      },
      outputStrings: {
        text: {
          en: 'Start Right',
          de: 'Starte Rechts',
          fr: 'Commencez à droite',
          ja: '右から',
          cn: '右侧开始',
          ko: '오른쪽에서 시작',
        },
      },
    },
    {
      id: 'E9S Particle Concentration',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5620', source: 'Cloud Of Darkness', capture: false }),
      delaySeconds: 6,
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text!(),
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
    {
      id: 'E9S Summon',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '5019', source: 'Cloud Of Darkness', capture: false }),
      run: (data) => data.summon = true,
    },
    {
      id: 'E9S Clone The Art Of Darkness',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '561[EF]', source: 'Clone Of Darkness' }),
      suppressSeconds: 1,
      promise: async (data) => {
        const cloudOfDarknessLocaleNames = {
          en: 'Cloud Of Darkness',
          de: 'Wolke Der Dunkelheit',
          fr: 'Nuage De Ténèbres',
          ja: '暗闇の雲',
          cn: '暗黑之云',
          ko: '어둠의 구름',
        };

        const bossData = await callOverlayHandler({
          call: 'getCombatants',
          names: [cloudOfDarknessLocaleNames[data.parserLang]],
        });

        if (!bossData?.combatants.length)
          return;

        // All of the fake bosses have a BNpcID of 9020, 12379 is the real one.
        const boss = bossData.combatants.filter((boss) => boss.BNpcID === 12379)[0];

        if (!boss)
          return;

        data.boss = convertBossHeadingToClonePosition(boss);

        const cloneOfDarknessLocaleNames = {
          en: 'Clone Of Darkness',
          de: 'Klon Der Dunkelheit',
          fr: 'Nuée de Ténèbres',
          ja: '幻影の雲',
          cn: '幻影之云',
          ko: '환영의 구름',
        };

        const cloneData = await callOverlayHandler({
          call: 'getCombatants',
          names: [cloneOfDarknessLocaleNames[data.parserLang]],
        });

        if (!cloneData?.combatants.length)
          return;

        data.clones = cloneData.combatants;
      },
      alertText: (data, matches, output) => {
        if (!data.boss || !data.clones)
          return;

        const [clone1, clone2] = data.clones;
        if (!clone1 || !clone2)
          return;
        return output[calculateSummonSafeZone(data.boss, clone1, clone2, matches.id)]!();
      },
      run: (data) => delete data.summon,
      outputStrings: summonDirectionOutputStrings,
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'The Art Of Darkness(?! \\\\())': 'Art Of Dark (Clock/Stacks)',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Clone Of Darkness': 'Klon der Dunkelheit',
        'Cloud Of Darkness': 'Wolke der Dunkelheit',
      },
      'replaceText': {
        'The Third Art Of Darkness': 'Dunkle Taktik: Dreifach',
        'The Second Art Of Darkness': 'Dunkle Taktik: Doppelt',
        'The Art Of Darkness': 'Dunkle Taktik',
        'Summon': 'Rufen',
        'Rejuvenating Balm': 'Aktivierte Kugel',
        'Particle Concentration': 'Wellenkugel',
        'Obscure Woods': 'Finsterer Wald',
        'Hypercharged Condensation': 'Elektrisierte Kondensation',
        'Ground-Razing Particle Beam': 'Radialer Partikelstrahl',
        'Full-Perimeter Particle Beam': 'Partikelstrahl-Beschuss',
        'Flood Of Obscurity': 'Flut der Finsternis',
        'Flood Of Emptiness': 'Dunkle Flut: Düsterer Himmel',
        'Empty Plane': 'Düsterer Himmel',
        'Devouring Dark': 'Erosion der Dunkelheit',
        'Deluge Of Darkness': 'Sintflut der Dunkelheit',
        'Phaser Unlimited': 'Phaser: Nullform',
        '\\(P\\/S\\)': '(Uhrzeiger/Partner)',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Clone Of Darkness': 'Nuée de Ténèbres',
        'Cloud Of Darkness': 'Nuage de Ténèbres',
      },
      'replaceText': {
        '\\(L/R\\)': '(G/D)',
        'The Third Art Of Darkness': 'Arts ténébreux triple',
        'The Second Art Of Darkness': 'Arts ténébreux double',
        'The Art Of Darkness(?! \\\\())': 'Arts ténébreux (Positions/Packages)',
        'Summon': 'Invocation',
        'Rejuvenating Balm': 'Tir vivifiant',
        'Particle Concentration': 'Rayon sphérique',
        'Phaser Unlimited': 'Faisceau de particules bondissant',
        'Obscure Woods': 'Forêt obscure',
        'Hypercharged Condensation': 'Aspiration particulaire',
        'Ground-Razing Particle Beam': 'Faisceau de particules radiant',
        'Full-Perimeter Particle Beam': 'Faisceau de particules balayant',
        'Flood Of Obscurity': 'Déluge de Ténèbres : Forêt obscure',
        'Flood Of Emptiness': 'Déluge de Ténèbres : Cieux obscurs',
        'Empty Plane': 'Cieux obscurs',
        'Devouring Dark': 'Érosion de Ténèbres',
        'Deluge Of Darkness': 'Grand déluge de Ténèbres',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Clone Of Darkness': '幻影の雲',
        'Cloud Of Darkness': '暗闇の雲',
      },
      'replaceText': {
        'The Third Art Of Darkness': '闇の戦技：三重',
        'The Second Art Of Darkness': '闇の戦技：二重',
        'The Art Of Darkness': '闇の戦技',
        'Summon': '召喚',
        'Rejuvenating Balm': '活性弾',
        'Phaser Unlimited': '跳躍波動砲',
        'Particle Concentration': '波動球',
        'Obscure Woods': '暗黒森林',
        'Hypercharged Condensation': '波動雲吸引',
        'Ground-Razing Particle Beam': '放射式 波動砲',
        'Full-Perimeter Particle Beam': '掃射式 波動砲',
        'Flood Of Obscurity': '闇の氾濫：暗黒森林',
        'Flood Of Emptiness': '闇の氾濫：暗黒天空',
        'Empty Plane': '暗黒天空',
        'Devouring Dark': '闇の浸食',
        'Deluge Of Darkness': '闇の大氾濫',
        'Dark-Energy Particle Beam': '呪詛式 波動砲',
        'Condensed Wide-Angle Particle Beam': '広角式 高出力波動砲',
        'Condensed Anti-Air Particle Beam': '高射式 高出力波動砲',
        'Bad Vibrations': '強振動',
        'Anti-Air Phaser Unlimited': '高射式 跳躍波動砲：零式',
        'Anti-Air Particle Beam': '高射式 波動砲',
        'Aetherosynthesis': '生気吸収',
        '\\(L/R\\)': '(左/右)',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Clone Of Darkness': '幻影之云',
        'Cloud Of Darkness': '暗黑之云',
      },
      'replaceText': {
        'The Third Art Of Darkness': '三重暗之战技',
        'The Second Art Of Darkness': '二重暗之战技',
        'The Art Of Darkness': '暗之战技',
        'Summon': '召唤',
        'Rejuvenating Balm': '活性弹',
        'Phaser Unlimited': '跳跃波动炮',
        'Particle Concentration': '波动球',
        'Obscure Woods': '暗黑森林',
        'Hypercharged Condensation': '吸引波动云',
        'Ground-Razing Particle Beam': '放射式波动炮',
        'Full-Perimeter Particle Beam': '扫射式波动炮',
        'Flood Of Obscurity': '暗之泛滥：暗黑森林',
        'Flood Of Emptiness': '暗之泛滥：暗黑天空',
        'Empty Plane': '暗黑天空',
        'Devouring Dark': '暗黑侵蚀',
        'Deluge Of Darkness': '暗之大泛滥',
        'Dark-Energy Particle Beam': '诅咒式波动炮',
        'Condensed Wide-Angle Particle Beam': '广角式高输出波动炮',
        'Condensed Anti-Air Particle Beam': '高射式高输出波动炮',
        'Bad Vibrations': '强震动',
        'Anti-Air Phaser Unlimited': '零式高射式跳跃波动炮',
        'Anti-Air Particle Beam': '高射式波动炮',
        'Aetherosynthesis': '吸收生命',
        '\\(L/R\\)': '(左/右)',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Clone Of Darkness': '환영의 구름',
        'Cloud Of Darkness': '어둠의 구름',
      },
      'replaceText': {
        'The Third Art Of Darkness': '어둠의 전투술: 삼중',
        'The Second Art Of Darkness': '어둠의 전투술: 이중',
        'The Art Of Darkness': '어둠의 전투술',
        'Summon': '소환',
        'Rejuvenating Balm': '활성탄',
        'Phaser Unlimited': '도약파동포 0식',
        'Particle Concentration': '파동구',
        'Obscure Woods': '암흑의 숲',
        'Hypercharged Condensation': '파동운 흡인',
        'Ground-Razing Particle Beam': '방사식 파동포',
        'Full-Perimeter Particle Beam': '소사식 파동포',
        'Flood Of Obscurity': '어둠의 범람: 암흑의 숲',
        'Flood Of Emptiness': '어둠의 범람: 암흑의 하늘',
        'Empty Plane': '암흑의 하늘',
        'Devouring Dark': '어둠의 침식',
        'Deluge Of Darkness': '어둠의 대범람',
        'Dark-Energy Particle Beam': '저주식 파동포',
        'Condensed Wide-Angle Particle Beam': '광각식 고출력 파동포',
        'Condensed Anti-Air Particle Beam': '고공식 고출력 파동포',
        'Bad Vibrations': '강력한 진동',
        'Anti-Air Phaser Unlimited': '고공식 도약파동포 0식',
        'Anti-Air Particle Beam': '고공식 파동포',
        'Aetherosynthesis': '생기 흡수',
        '\\(L/R\\)': '(좌/우)',
      },
    },
  ],
};

export default triggerSet;
