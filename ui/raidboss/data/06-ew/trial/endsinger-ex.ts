import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { NetMatches } from '../../../../../types/net_matches';
import { Output, OutputStrings, TriggerField, TriggerOutput, TriggerSet } from '../../../../../types/trigger';

export type Mechanic = 'aoe' | 'donut' | 'safeN' | 'safeE' | 'safeS' | 'safeW' | 'unknown';

const echoesOutputStrings = {
  stack: Outputs.stackOnYou,
  donut: {
    en: 'Stack Donut',
    de: 'Sammeln Donut',
    fr: 'Packez-vous, donut',
    ja: '頭割り',
    cn: '集合放月环',
    ko: '도넛 장판, 쉐어',
  },
  spread: Outputs.spread,
  flare: {
    en: 'Flare',
    de: 'Flare',
    fr: 'Brasier',
    ja: 'フレア',
    cn: '核爆',
    ko: '플레어',
  },
} as const;

export interface Data extends RaidbossData {
  headPhase?: 5 | 6;
  starMechanicCounter: number;
  storedHeads: {
    [id: string]: {
      state: PluginCombatantState;
      mechanics: Mechanic[];
    };
  };
  rewindHeads: {
    [id: string]: {
      state: PluginCombatantState;
      mechanic: string;
    };
  };
  storedMechs: {
    1?: keyof typeof echoesOutputStrings;
    2?: keyof typeof echoesOutputStrings;
    3?: keyof typeof echoesOutputStrings;
    counter: 1 | 2 | 3;
  };
}

const orbOutputStrings: OutputStrings = {
  ne: Outputs.northeast,
  nw: Outputs.northwest,
  se: Outputs.southeast,
  sw: Outputs.southwest,
};

const getKBOrbSafeDir = (posX: number, posY: number, output: Output): string | undefined => {
  if (posX < 100) {
    if (posY < 100)
      return output.nw!();

    return output.sw!();
  }
  if (posY < 100)
    return output.ne!();

  return output.se!();
};

const getAoEOrbSafeDir = (posX: number, posY: number, output: Output): string | undefined => {
  if (posX < 100) {
    if (posY < 100)
      return output.se!();

    return output.ne!();
  }
  if (posY < 100)
    return output.sw!();

  return output.nw!();
};

const getStarPositionFromHeading = (heading: string) => {
  const dir = ((2 - Math.round(parseFloat(heading) * 8 / Math.PI) / 2) + 2) % 8;
  return {
    1: [114, 86], //  NE
    3: [114, 114], // SE
    5: [86, 114], //  SW
    7: [86, 86], //  NW
  }[dir] ?? [];
};

const getStarText: TriggerField<Data, NetMatches['Ability' | 'StartsUsing'], TriggerOutput<Data, NetMatches['Ability' | 'StartsUsing']>> = (_data, matches, output) => {
  let posX: number | undefined;
  let posY: number | undefined;

  // Some 6FFA/6FFB (single) stars are at the correct position with no heading, others are center with a heading.
  // Of the 122 single star lines, I have:
  // 31 lines that are middle with a heading
  // 91 lines that are correct position, heading = 0
  // All other stars are center with a heading. This holds true for all 294 log lines I have for this event.
  if (Math.round(parseFloat(matches.heading)) !== 0) {
    [posX, posY] = getStarPositionFromHeading(matches.heading);
  } else {
    posX = parseFloat(matches.x);
    posY = parseFloat(matches.y);
  }

  if (posX === undefined || posY === undefined) {
    console.error(`EndsingerEx getStarText: Could not resolve star position from heading ${parseFloat(matches.heading)}`);
    return;
  }

  if (['6FF9', '6FFB', '7000', '7001'].includes(matches.id))
    return getKBOrbSafeDir(posX, posY, output);

  if (['6FF8', '6FFA', '6FFE', '6FFF'].includes(matches.id))
    return getAoEOrbSafeDir(posX, posY, output);

  console.error(`EndsingerEx getStarText: Could not match ability ID ${matches.id} to color`);
  return;
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheMinstrelsBalladEndsingersAria,
  timelineFile: 'endsinger-ex.txt',
  initData: () => {
    return {
      starMechanicCounter: 0,
      storedStars: {},
      storedHeads: {},
      rewindHeads: {},
      storedMechs: {
        counter: 1,
      },
    };
  },
  timelineTriggers: [
    {
      id: 'EndsingerEx Towers',
      regex: /Tower/,
      beforeSeconds: 4,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Towers',
          de: 'Türme',
          fr: 'Tours',
          ja: '塔を踏む',
          cn: '踩塔',
          ko: '장판 들어가기',
        },
      },
    },
  ],
  triggers: [
    // Fire this trigger on ability since actual damage is 5s after cast bar finishes
    {
      id: 'EndsingerEx Elegeia',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6FF6', source: 'The Endsinger', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'EndsingerEx Telos',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '702E', source: 'The Endsinger', capture: false }),
      response: Responses.bigAoe(),
    },
    {
      id: 'EndsingerEx Elenchos Middle',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7022', source: 'The Endsinger', capture: false }),
      response: Responses.goSides(),
    },
    {
      id: 'EndsingerEx Elenchos Outsides',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7020', source: 'The Endsinger', capture: false }),
      response: Responses.goMiddle(),
    },
    {
      id: 'EndsingerEx Hubris',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '702C', source: 'The Endsinger', capture: true }),
      response: Responses.tankCleave(),
    },
    {
      id: 'EndsingerEx Single Star',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6FFA', '6FFB'], capture: true }),
      alertText: getStarText,
      outputStrings: orbOutputStrings,
    },
    {
      id: 'EndsingerEx Eironeia',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['702F', '7030'], source: 'The Endsinger', capture: false }),
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.groups!(),
      outputStrings: {
        groups: {
          en: 'Healer Groups',
          de: 'Heiler-Gruppen',
          fr: 'Groupes sur les heals',
          ja: 'ヒラに頭割り',
          cn: '治疗分组分摊',
          ko: '힐러 그룹 쉐어',
        },
      },
    },
    {
      id: 'EndsingerEx Star Order Resolver',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['6FFE', '6FFF', '7000', '7001'] }),
      delaySeconds: (data, matches) => {
        ++data.starMechanicCounter;
        const offset = data.starMechanicCounter > 1 ? 2 : 0;
        switch (matches.id) {
          case '6FFE':
          case '7000':
            return 0 + offset;
          case '6FFF':
          case '7001':
            return 6.5 + offset;
        }

        return 0;
      },
      alertText: getStarText,
      outputStrings: orbOutputStrings,
    },
    {
      id: 'EndsingerEx Star Cleanup',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['6FFE', '6FFF', '7000', '7001'], capture: false }),
      delaySeconds: 30,
      run: (data) => {
        data.starMechanicCounter = 0;
      },
    },
    {
      id: 'EndsingerEx Head Phase Detector',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['7007', '72B1'] }),
      run: (data, matches) => {
        switch (matches.id) {
          case '7007':
            data.headPhase = 5;
            break;
          case '72B1':
            data.headPhase = 6;
            break;
        }
      },
    },
    {
      id: 'EndsingerEx Head Phase Cleanup',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['7007', '72B1'], capture: false }),
      delaySeconds: 50,
      run: (data) => {
        data.headPhase = undefined;
      },
    },
    {
      id: 'EndsingerEx 5Head Initial Direction',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '891', capture: true }),
      condition: (data) => data.headPhase === 5,
      delaySeconds: 0.5,
      promise: async (data, matches) => {
        const headData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.targetId, 16)],
        });
        if (headData.combatants.length !== 1) {
          console.error(`5Head Initial Direction: null data`);
          return;
        }

        for (const head of headData.combatants) {
          const headId = head.ID?.toString(16).toUpperCase();
          if (!headId) {
            console.error(`5Head Initial Direction: invalid head ID`);
            continue;
          }
          data.storedHeads[headId] = { state: head, mechanics: [] };
        }
      },
      infoText: (data, matches, output) => {
        const headCombatant = data.storedHeads[matches.targetId];
        if (!headCombatant) {
          console.error(`5Head Collector: null data`);
          return;
        }

        // Snap heading to closest card and add 2 for opposite direction
        // N = 0, E = 1, S = 2, W = 3
        const cardinal = ((2 - Math.round(headCombatant.state.Heading * 4 / Math.PI) / 2) + 2) % 4;

        const dirs: { [dir: number]: string } = {
          0: output.north!(),
          1: output.east!(),
          2: output.south!(),
          3: output.west!(),
        };

        return dirs[cardinal];
      },
      outputStrings: {
        unknown: Outputs.unknown,
        north: Outputs.north,
        east: Outputs.east,
        south: Outputs.south,
        west: Outputs.west,
      },
    },
    {
      id: 'EndsingerEx 5Head Mechanics Collector',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6FFC', '7006', '7009', '700A'], source: 'The Endsinger', capture: true }),
      condition: (data) => data.headPhase === 5,
      // Do not need delaySeconds here, heads have been spawned for 5+ seconds
      promise: async (data, matches) => {
        // Early out if we already have this head
        if (data.storedHeads[matches.targetId])
          return;

        const headData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.targetId, 16)],
        });
        if (headData.combatants.length !== 1) {
          console.error(`5Head Mechanics Collector: null data`);
          return;
        }

        for (const head of headData.combatants) {
          const headId = head.ID?.toString(16).toUpperCase();
          if (!headId) {
            console.error(`5Head Mechanics Collector: invalid head ID`);
            continue;
          }
          data.storedHeads[headId] = { state: head, mechanics: [] };
        }
      },
      infoText: (data, matches, output) => {
        const head = data.storedHeads[matches.sourceId];
        if (!head) {
          console.error(`5Head Mechanics Collector: null data/missing head`);
          return;
        }

        if (matches.id === '7009') {
          head.mechanics.push('aoe');
        } else if (matches.id === '700A') {
          head.mechanics.push('donut');
        } else {
          // Snap heading to closest card and add 2 for opposite direction
          // N = 0, E = 1, S = 2, W = 3
          const cardinal = ((2 - Math.round(parseFloat(matches.heading) * 4 / Math.PI) / 2) + 2) % 4;
          const safeDir: { [dir: number]: Mechanic } = {
            0: 'safeN',
            1: 'safeE',
            2: 'safeS',
            3: 'safeW',
          };
          head.mechanics.push(safeDir[cardinal] ?? 'unknown');
        }

        // If we have the same count of mechanics stored for all 5 heads, resolve safe spot
        const heads = Object.values(data.storedHeads);
        if (heads.length === heads.filter((h) => h.mechanics.length === head.mechanics.length).length && heads.length === 5) {
          const lastMechanic = head.mechanics.length - 1;

          const safeDirHead = heads.find((h) => h.mechanics[0]?.includes('safe'));
          const donutHeads = heads.filter((h) => h.mechanics[lastMechanic] === 'donut');
          const donutHead1 = donutHeads[0];
          const donutHead2 = donutHeads[1];

          if (!safeDirHead || !donutHead1 || !donutHead2) {
            console.error(`5Head Mechanics Collector: Missing safe/donut head`);
            return;
          }

          switch (safeDirHead.mechanics[lastMechanic]) {
            case 'safeN':
              if (donutHead1.state.PosY < 100)
                return getKBOrbSafeDir(donutHead1.state.PosX, donutHead1.state.PosY, output);
              return getKBOrbSafeDir(donutHead2.state.PosX, donutHead2.state.PosY, output);
            case 'safeE':
              if (donutHead1.state.PosX > 100)
                return getKBOrbSafeDir(donutHead1.state.PosX, donutHead1.state.PosY, output);
              return getKBOrbSafeDir(donutHead2.state.PosX, donutHead2.state.PosY, output);
            case 'safeS':
              if (donutHead1.state.PosY > 100)
                return getKBOrbSafeDir(donutHead1.state.PosX, donutHead1.state.PosY, output);
              return getKBOrbSafeDir(donutHead2.state.PosX, donutHead2.state.PosY, output);
            case 'safeW':
              if (donutHead1.state.PosX < 100)
                return getKBOrbSafeDir(donutHead1.state.PosX, donutHead1.state.PosY, output);
              return getKBOrbSafeDir(donutHead2.state.PosX, donutHead2.state.PosY, output);
          }
        }
      },
      outputStrings: orbOutputStrings,
    },
    {
      id: 'EndsingerEx 5Head Mechanics Rewind Collector',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '808', target: 'The Endsinger', capture: true }),
      condition: (data) => data.headPhase === 5,
      infoText: (data, matches, output) => {
        const head = data.storedHeads[matches.targetId];
        if (!head) {
          console.error(`5Head Mechanics Rewind Collector: null data`);
          return;
        }

        const mechanicIndex = {
          '178': 2,
          '179': 1,
          '17A': 0,
        }[matches.count];

        const mechanic = head.mechanics[mechanicIndex ?? 0];

        if (mechanicIndex === undefined || !mechanic) {
          console.error(`5Head Mechanics Rewind Collector: no mapping for buff count`);
          return;
        }

        data.rewindHeads[matches.targetId] = {
          state: head.state,
          mechanic: mechanic,
        };

        // If we have all 5 heads accounted for, resolve safe spot
        const heads = Object.values(data.rewindHeads);
        if (heads.length === 5) {
          const safeDirHead = heads.find((h) => h.mechanic.includes('safe'));
          const donutHeads = heads.filter((h) => h.mechanic === 'donut');

          // Clean up here for next iteration
          data.storedHeads = {};
          data.rewindHeads = {};

          if (!safeDirHead || donutHeads.length < 1) {
            console.error(`5Head Mechanics Rewind Collector: missing required head`);
            return;
          }

          let safeDonut;

          switch (safeDirHead.mechanic) {
            case 'safeN':
              safeDonut = donutHeads.find((head) => head.state.PosY < 100);
              break;
            case 'safeE':
              safeDonut = donutHeads.find((head) => head.state.PosX > 100);
              break;
            case 'safeS':
              safeDonut = donutHeads.find((head) => head.state.PosY > 100);
              break;
            case 'safeW':
              safeDonut = donutHeads.find((head) => head.state.PosX < 100);
              break;
          }

          if (!safeDonut) {
            console.error(`5Head Mechanics Rewind Collector: no safe donut found`);
            return;
          }

          return getKBOrbSafeDir(safeDonut.state.PosX, safeDonut.state.PosY, output);
        }
      },
      outputStrings: orbOutputStrings,
    },
    {
      id: 'EndsingerEx 6 Head Collector',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: ['00BD', '00B5'], target: 'The Endsinger', capture: true }),
      condition: (data) => data.headPhase === 6,
      delaySeconds: 0.5,
      promise: async (data, matches) => {
        const headData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        const headCombatant = headData.combatants[0];
        if (!headCombatant) {
          console.error(`6 Head Collector: null data`);
          return;
        }

        data.storedHeads[matches.sourceId] = { state: headCombatant, mechanics: [] };
      },
      infoText: (data, _matches, output) => {
        const heads = Object.values(data.storedHeads);
        if (heads.length === 4) {
          data.storedHeads = {};
          let headPositions = ['e', 'ne', 'nw', 'w', 'se', 'sw'];
          for (const head of heads) {
            let dir = '';
            if (head.state.PosY < 100)
              dir = 'n';
            else if (head.state.PosY > 100)
              dir = 's';
            if (head.state.PosX < 100)
              dir += 'w';
            else
              dir += 'e';

            headPositions = headPositions.filter((pos) => pos !== dir);
          }

          const dir1 = headPositions[0];
          const dir2 = headPositions[1];

          if (!dir1 || !dir2) {
            console.error(`6 Head Collector: expected 2 safe heads`);
            return;
          }

          return output.text!({
            dir1: output[dir1]!(),
            dir2: output[dir2]!(),
          });
        }
      },
      outputStrings: {
        e: Outputs.dirE,
        w: Outputs.dirW,
        nw: Outputs.dirNW,
        ne: Outputs.dirNE,
        sw: Outputs.dirSW,
        se: Outputs.dirSE,
        text: {
          en: '${dir1} / ${dir2}',
          de: '${dir1} / ${dir2}',
          fr: '${dir1} / ${dir2}',
          ja: '${dir1} / ${dir2}',
          cn: '${dir1} / ${dir2}',
          ko: '${dir1} / ${dir2}',
        },
      },
    },
    {
      id: 'EndsingerEx Echoes of Benevolence',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'BB0' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 60,
      infoText: (data, _matches, output) => {
        data.storedMechs[data.storedMechs.counter] = 'stack';
        data.storedMechs.counter++;
        return output.stack!();
      },
      outputStrings: {
        stack: echoesOutputStrings.stack,
      },
    },
    {
      id: 'EndsingerEx Echoes of Nausea',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'BAD' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 60,
      infoText: (data, _matches, output) => {
        data.storedMechs[data.storedMechs.counter] = 'donut';
        data.storedMechs.counter++;
        return output.donut!();
      },
      outputStrings: {
        donut: echoesOutputStrings.donut,
      },
    },
    {
      id: 'EndsingerEx Echoes of the Future',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'BAF' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 60,
      infoText: (data, _matches, output) => {
        data.storedMechs[data.storedMechs.counter] = 'flare';
        data.storedMechs.counter++;
        return output.flare!();
      },
      outputStrings: {
        flare: echoesOutputStrings.flare,
      },
    },
    {
      id: 'EndsingerEx Echoes of Befoulment',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'BAE' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 60,
      infoText: (data, _matches, output) => {
        data.storedMechs[data.storedMechs.counter] = 'spread';
        data.storedMechs.counter++;
        return output.spread!();
      },
      outputStrings: {
        spread: echoesOutputStrings.spread,
      },
    },
    {
      id: 'EndsingerEx Echoes Rewind',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '95D' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, matches, output) => {
        const mechanicIndex: 1 | 2 | 3 | undefined = ({
          '17C': 3,
          '17D': 2,
          '17E': 1,
        } as const)[matches.count];

        const mechanic = data.storedMechs[mechanicIndex ?? 1];

        if (mechanicIndex === undefined || !mechanic) {
          console.error(`5Head Mechanics Rewind Collector: no mapping for buff count`);
          return;
        }

        return output[mechanic]!();
      },
      outputStrings: echoesOutputStrings,
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Azure Star': 'blau(?:e|er|es|en) Himmelskörper',
        'Fiery Star': 'rot(?:e|er|es|en) Himmelskörper',
        'The Endsinger': 'Endsängerin',
      },
      'replaceText': {
        'Befoulment': 'Brackwasserbombe',
        'Benevolence': 'Philanthropie',
        'Despair Unforgotten': 'Verzweiflung der Chronistin',
        'Diairesis': 'Diairesis',
        'Eironeia': 'Eironeia',
        'Elegeia Unforgotten': 'Elegeia der Chronistin',
        'Elenchos': 'Elenchos',
        'Endsong\'s Aporrhoia': 'Aporia des Liedes vom Ende',
        'Endsong(?!\')': 'Lied vom Ende',
        '(?<! )Fatalism': 'Fatalismus',
        'Grip of Despair': 'Griff der Verzweiflung',
        'Hubris': 'Hybris',
        'Star Collision': 'Planeten Kollision',
        'Telomania': 'Telomanie',
        'Telos': 'Telos',
        'Tower Explosion': 'Turm Explosion',
        'Theological Fatalism': 'Theologischer Fatalismus',
        'Twinsong\'s Aporrhoia': 'Aporia der Verzweiflung',
        'Ultimate Fate': 'Ultimatives Schicksal',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Azure Star': 'astre azuré',
        'Fiery Star': 'astre incarnat',
        'The Endsinger': 'chantre de l\'anéantissement',
      },
      'replaceText': {
        'Befoulment': 'Bombe de pus',
        'Benevolence': 'Philanthropie',
        'Despair Unforgotten': 'Chronique tourmentante',
        'Diairesis': 'Diérèse',
        'Eironeia': 'Ironie',
        'Elegeia Unforgotten': 'Chronique élégiaque',
        'Elenchos': 'Élenchos',
        'Endsong\'s Aporrhoia': 'Antienne aporétique',
        'Endsong(?!\')': 'Ultime antienne',
        '(?<! )Fatalism(?!e)': 'Fatalisme',
        'Grip of Despair': 'Chaînes du désespoir',
        'Hubris': 'Hubris',
        'Telomania': 'Télomanie',
        'Telos': 'Télos',
        'Theological Fatalism': 'Fatalisme théologique',
        'Twinsong\'s Aporrhoia': 'Chœur aporétique',
        'Ultimate Fate': 'Ultime destin',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Azure Star': '青色天体',
        'Fiery Star': '赤色天体',
        'The Endsinger': '終焉を謳うもの',
      },
      'replaceText': {
        'Befoulment': '膿汁弾',
        'Benevolence': '博愛',
        'Despair Unforgotten': '絶望浸食：事象記録',
        'Diairesis': 'ディアイレシス',
        'Eironeia': 'エイロネイア',
        'Elegeia Unforgotten': 'エレゲイア：事象記録',
        'Elenchos': 'エレンコス',
        'Endsong\'s Aporrhoia': 'アポロイア：絶望輪唱',
        'Endsong(?!\')': '絶望輪唱',
        '(?<! )Fatalism': 'フェイタリズム',
        'Grip of Despair': '絶望の鎖',
        'Hubris': 'ヒュブリス',
        'Telomania': 'テロスマニア',
        'Telos': 'テロス',
        'Theological Fatalism': 'セオロジカル・フェイタリズム',
        'Twinsong\'s Aporrhoia': 'アポロイア：絶望合唱',
        'Ultimate Fate': 'ウルティマフェイト',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Azure Star': '蓝色天体',
        'Fiery Star': '红色天体',
        'The Endsinger': '讴歌终结之物',
      },
      'replaceText': {
        'Befoulment': '脓液弹',
        'Benevolence': '博爱',
        'Despair Unforgotten': '绝望侵蚀：记录事件',
        'Diairesis': '分离',
        'Eironeia': '反讽',
        'Elegeia Unforgotten': '哀歌：记录事件',
        'Elenchos': '反诘',
        'Endsong\'s Aporrhoia': '流溢：绝望轮唱',
        'Endsong(?!\')': '绝望轮唱',
        '(?<! )Fatalism': '宿命',
        'Grip of Despair': '绝望的锁链',
        'Hubris': '傲慢',
        'Star Collision': '天体撞击',
        'Telomania': '终末狂热',
        'Telos': '终末',
        'Tower Explosion': '塔爆炸',
        'Theological Fatalism': '神学宿命',
        'Twinsong\'s Aporrhoia': '流溢：绝望合唱',
        'Ultimate Fate': '终极命运',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Azure Star': '청색천체',
        'Fiery Star': '적색천체',
        'The Endsinger': '종언을 노래하는 자',
      },
      'replaceText': {
        '(?<! )Fatalism': '운명론',
        'Befoulment': '고름탄',
        'Benevolence': '박애',
        'Despair Unforgotten': '절망 침식: 현상 기록',
        'Diairesis': '디아이레시스',
        'Eironeia': '에이로네이아',
        'Elegeia Unforgotten': '엘레게이아: 현상 기록',
        'Elenchos': '엘렝코스',
        'Endsong\'s Aporrhoia': '발출: 절망 돌림노래',
        'Endsong(?!\')': '절망 돌림노래',
        'Grip of Despair': '절망의 사슬',
        'Hubris': '휴브리스',
        'Telomania': '텔로스마니아',
        'Telos': '텔로스',
        'Theological Fatalism': '신학적 운명론',
        'Twinsong\'s Aporrhoia': '발출: 절망 합창',
        'Ultimate Fate': '종언의 운명',
      },
    },
  ],
};

export default triggerSet;
