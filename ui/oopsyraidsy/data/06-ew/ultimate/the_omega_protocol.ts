import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import {
  OopsyFunc,
  OopsyMistake,
  OopsyMistakeType,
  OopsyTriggerSet,
} from '../../../../../types/oopsy';
import { LocaleText } from '../../../../../types/trigger';
import { GetShareMistakeText, GetSoloMistakeText } from '../../../oopsy_common';

// TODO: 7B10 Diffuse Wave Cannon Kyrios being shared if not invulning?
// TODO: call out who was missing in the Condensed Wave Cannon stack

// TODO: we probably could use an oopsy utility library (and Data should be `any` here).
const stackMistake = (
  type: OopsyMistakeType,
  expected: number,
  abilityText?: LocaleText,
): OopsyFunc<Data, NetMatches['Ability'], OopsyMistake | undefined> => {
  return (_data, matches) => {
    const actual = parseFloat(matches.targetCount);
    if (actual === expected || actual === 0)
      return;
    const ability = abilityText ?? matches.ability;
    const text = actual === 1 ? GetSoloMistakeText(ability) : GetShareMistakeText(ability, actual);
    return { type: type, blame: matches.target, text: text };
  };
};

const translate = (data: Data, text: LocaleText) => {
  return text[data.options.DisplayLanguage] ?? text['en'];
};

export const helloEffect = {
  // Local Regression / "Christmas" red/green tethers
  redTether: 'DC9',
  // Remote Regression / blue tethers
  blueTether: 'DCA',
  // Critical Synchronization Bug / stack
  stack: 'DC4',
  // Critical Overflow Bug / defamation
  defamation: 'DC5',
  // Critical Underflow Bug / red rot
  redRot: 'DC6',
  // Critical Performance Bug / blue rot
  blueRot: 'D65',
} as const;

export const helloAbility = {
  // Critical Synchronization Bug / stack
  stack: '7B56',
  // Critical Overflow Bug / defamation
  defamation: '7B57',
  // Cascading Latent Defect / red tower
  redTower: '7B5F',
  // Latent Performance Defect
  blueTower: '7B60',
} as const;

export type RotColor = 'blue' | 'red';

type LatentDefectMistake = {
  expected: (keyof typeof helloEffect)[];
  actual: keyof typeof helloAbility;
  // If people take this who have the wrong debuffs.
  extra: LocaleText;
  // If people should take this but are missing.
  missing: LocaleText;
  // If the wrong number of people take this.
  share: LocaleText;
  // If you take two hits of this (e.g. two defamations).
  tookTwo?: LocaleText;
};

// The extra/missing/tookTwo texts have playerDescription below appended to it,
// e.g. "Red Tower, no rot (as defamation)" or "Missed Stack (as far tether)".
// If this doesn't work for some language translation, please file an issue.
const defects: LatentDefectMistake[] = [
  {
    expected: ['redRot'],
    actual: 'redTower',
    extra: {
      en: 'Red Tower, no rot',
    },
    missing: {
      en: 'Missed Red Tower',
    },
    share: {
      en: 'Red Tower',
    },
  },
  {
    expected: ['blueRot'],
    actual: 'blueTower',
    extra: {
      en: 'Blue Tower, no rot',
    },
    missing: {
      en: 'Missed Blue Tower',
    },
    share: {
      en: 'Blue Tower',
    },
  },
  {
    expected: ['stack', 'blueTether'],
    actual: 'stack',
    extra: {
      en: 'Stack',
    },
    missing: {
      en: 'Missed stack',
    },
    share: {
      en: 'Stack',
    },
    tookTwo: {
      en: 'Stack x2',
    },
  },
  {
    expected: ['defamation', 'redTether'],
    actual: 'defamation',
    extra: {
      en: 'Defamation',
    },
    missing: {
      en: 'Missed defamation',
    },
    share: {
      en: 'Defamation',
    },
    tookTwo: {
      en: 'Defamation x2',
    },
  },
];

// These descriptions are appended directly after text from the defects structure above.
type HelloEffect = keyof typeof helloEffect;
const playerDescription: { [key in HelloEffect]: LocaleText } = {
  // Order is important here.
  defamation: {
    en: ' (as defamation)',
  },
  stack: {
    en: ' (as stack)',
  },
  redTether: {
    en: ' (as near tether)',
  },
  blueTether: {
    en: ' (as far tether)',
  },
  // These shouldn't happen.
  redRot: {
    en: ' (as red rot)',
  },
  blueRot: {
    en: ' (as blue rot)',
  },
} as const;

// Some special case combo descriptions.
const playerComboDesc = {
  redDefamation: {
    en: ' (as red defamation)',
  },
  redStack: {
    en: ' (as red stack)',
  },
  blueDefamation: {
    en: ' (as blue defamation)',
  },
  blueStack: {
    en: ' (as blue stack)',
  },
} as const;

const unknownDescriptionLocale: LocaleText = {
  en: ' (as ???)',
};

export interface Data extends OopsyData {
  blameId?: { [name: string]: string };
  inLine?: { [name: string]: number };
  towerCount?: number;
  blasterCollect?: NetMatches['Ability'][];
  towerCollect?: NetMatches['Ability'][];
  beyondDefense?: string[];
  helloSmell?: NetMatches['GainsEffect'][];
  expectedRots?: { [latentDefectCount: number]: { blue: string[]; red: string[] } };
  defamationColor?: RotColor;
  latentDefectCount?: number;
  // Current state of debuffs.
  helloState?: { [name: string]: Set<string> };
  // Snapshot at start of Latent Defect cast to avoid debuff removal races.
  helloStateSnapshot?: { [name: string]: Set<string> };
  helloCollect?: NetMatches['Ability'][];
  monitorCollect?: NetMatches['Ability'][];
}

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheOmegaProtocolUltimate,
  damageWarn: {
    'TOP Flame Thrower 1': '7B0D', // initial Flame Thrower during Pantokrator
    'TOP Flame Thrower 2': '7E70', // ongoing Flame Thrower during Pantokrator
    'TOP Ballistic Impact': '7B0C', // ground puddles during Pantokrator
    'TOP Beyond Strength': '7B25', // Omega-M donut during Party Synergy
    'TOP Efficient Bladework': '7B26', // Omega-M centered circle during Party Synergy
    'TOP Superliminal Steel 1': '7B3E', // Omega-F hot wing during Party Synergy
    'TOP Superliminal Steel 2': '7B3F', // Omega-F hot wing during Party Synergy
    'TOP Optimized Blizzard III': '7B2D', // Omega-F cross during Party Synergy
    'TOP Optical Laser': '7B21', // Optical Unit eye laser during Party Synergy / p5
    'TOP Optimized Sagittarius Arrow': '7B33', // line aoe during Limitless Synergy
    'TOP Optimized Bladedance 1': '7B36', // Omega-M tankbuster conal (not tether target 7F75) during Limitless Synergy
    'TOP Optimized Bladedance 2': '7B37', // Omega-F tankbuster conal (not tether target 7F75) during Limitless Synergy
    'TOP Wave Repeater 1': '7B4F', // inner ring during p3 transition / p4
    'TOP Wave Repeater 2': '7B50', // second ring during p3 transition / p4
    'TOP Wave Repeater 3': '7B51', // third ring during p3 transition / p4
    'TOP Wave Repeater 4': '7B52', // outer ring during p3 transition / p4
    'TOP Colossal Blow': '7B4E', // Right/Left Arm Unit big centered circle during p3 transition
    'TOP Wave Cannon Protean 2': '7B80', // p4 followup protean laser
  },
  damageFail: {
    'TOP Storage Violation Obliteration': '7B06', // failing towers
  },
  shareWarn: {
    'TOP Blaster': '7B0A', // tether spread during Program Loop
    'TOP Wave Cannon Kyrios': '7B11', // headmarker line lasers after Pantokrator
    'TOP Optimized Fire III': '7B2F', // spread during Party Synergy
    'TOP Sniper Cannon': '7B53', // spread during p3 transition
    'TOP Wave Cannon Protean': '7B7E', // p4 initial protean laser
    'TOP Oversampled Wave Cannon': '7B6D', // p3 monitors
  },
  shareFail: {
    'TOP Guided Missile Kyrios': '7B0E', // spread damage duruing Pantokrator
    'TOP Solar Ray 1': '7E6A', // tankbuster during M/F
    'TOP Solar Ray 2': '7E6B', // tankbuster during M/F
    'TOP Solar Ray 3': '81AC', // p5 initial tankbuster
    'TOP Solar Ray 4': '7B01', // p5 second tankbuster
    'TOP Beyond Defense': '7B28', // spread with knockback during Limitless Synergy
  },
  soloWarn: {
    'TOP Pile Pitch': '7B29', // stack after Beyond Defense during Limitless Synergy
  },
  triggers: [
    {
      id: 'TOP In Line Debuff Collector',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['BBC', 'BBD', 'BBE', 'D7B'] }),
      run: (data, matches) => {
        const effectToNum: { [effectId: string]: number } = {
          BBC: 1,
          BBD: 2,
          BBE: 3,
          D7B: 4,
        } as const;
        const num = effectToNum[matches.effectId];
        if (num === undefined)
          return;

        (data.inLine ??= {})[matches.target] = num;
        (data.blameId ??= {})[matches.target] = matches.targetId;
      },
    },
    {
      id: 'TOP In Line Debuff Cleanup',
      type: 'StartsUsing',
      // 7B03 = Program Loop
      // 7B0B = Pantokrator
      netRegex: NetRegexes.startsUsing({ id: ['7B03', '7B0B'], source: 'Omega', capture: false }),
      // Don't clean up when the buff is lost, as that happens after taking a tower.
      run: (data) => data.inLine = {},
    },
    {
      id: 'TOP Program Loop Counter',
      type: 'Ability',
      // 7B0A Blaster and 7B04 Storage Violation can be in either order.
      netRegex: NetRegexes.ability({ id: ['7B0A', '7B04'], source: 'Omega', capture: false }),
      suppressSeconds: 2,
      run: (data) => {
        data.towerCount = (data.towerCount ??= 0) + 1;
        data.blasterCollect = [];
        data.towerCollect = [];
      },
    },
    {
      id: 'TOP Program Loop Damage Collector',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['7B0A', '7B04'], source: 'Omega' }),
      run: (data, matches) => {
        if (matches.id === '7B0A')
          (data.blasterCollect ??= []).push(matches);
        else if (matches.id === '7B04')
          (data.towerCollect ??= []).push(matches);
      },
    },
    {
      id: 'TOP Program Loop Mistake',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['7B0A', '7B04'], source: 'Omega', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 2,
      mistake: (data) => {
        const num = data.towerCount;
        if (num === undefined || num < 1 || num > 4)
          return;
        const inLine = data.inLine ?? {};
        const mistakes: OopsyMistake[] = [];
        const players = Object.keys(inLine);
        const towerPlayers = players.filter((p) => inLine[p] === num);
        const blasterPlayers = players.filter((p) =>
          inLine[p] === num + 2 || inLine[p] === num - 2
        );

        // Missing towers
        const towersTaken = (data.towerCollect ??= []).map((m) => m.target);
        for (const player of towerPlayers) {
          if (towersTaken.includes(player))
            continue;
          mistakes.push({
            type: 'fail',
            blame: player,
            reportId: data.blameId?.[player],
            text: {
              en: `Missed Tower #${num}`,
              ko: `기둥 #${num} 놓침`,
            },
          });
        }

        // Did both tower players take the same tower??
        // Do a reverse because we don't have `findLastIndex` here.
        const reverseTower = [...data.towerCollect].reverse();
        const towerSplitIdx = reverseTower.findIndex((x) => x.targetIndex === '0') + 1;
        const tower1 = [...reverseTower].splice(0, towerSplitIdx);
        const tower2 = [...reverseTower].splice(towerSplitIdx);
        for (const tower of [tower1, tower2]) {
          let playerCount = 0;
          const taken = tower.map((m) => m.target);
          for (const player of towerPlayers) {
            if (taken.includes(player))
              playerCount++;
          }

          if (playerCount <= 1)
            continue;

          // There's only two tower players, so just blame them all.
          const towerText: LocaleText = {
            en: `Tower #${num}`,
            ko: `기둥 #${num}`,
          };
          const text = GetShareMistakeText(towerText, 2);
          for (const player of towerPlayers) {
            mistakes.push({
              type: 'fail',
              blame: player,
              reportId: data.blameId?.[player],
              text: text,
            });
          }
        }

        for (const player of towersTaken) {
          if (towerPlayers.includes(player))
            continue;
          // It's ok for a lower number to stand in a higher number tower, so ignore this.
          const playerNum = data.inLine?.[player];
          if (playerNum === undefined || playerNum < num)
            continue;
          mistakes.push({
            type: 'fail',
            blame: player,
            reportId: data.blameId?.[player],
            text: {
              en: `Tower #${num} as #${playerNum}`,
              ko: `기둥 #${num} 들어감 (#${playerNum})`,
            },
          });
        }

        const blastersTaken = (data.blasterCollect ??= []).map((m) => m.target);
        for (const player of blasterPlayers) {
          if (blastersTaken.includes(player))
            continue;
          mistakes.push({
            type: 'fail',
            blame: player,
            reportId: data.blameId?.[player],
            text: {
              en: `Missed Tether #${num}`,
              ko: `선 #${num} 놓침`,
            },
          });
        }

        for (const m of data.blasterCollect ?? []) {
          const player = m.target;
          const numTargets = parseInt(m.targetCount);
          const shouldTakeTether = blasterPlayers.includes(player);
          if (shouldTakeTether && numTargets === 1)
            continue;

          // "warn" for "I should be in this" and "fail" for "hit but shouldn't be".
          const type = shouldTakeTether ? 'warn' : 'fail';
          const tetherText: LocaleText = {
            en: `${m.ability} #${num}`,
            ko: `${m.ability} #${num}`,
          };
          const text = numTargets > 1 ? GetShareMistakeText(tetherText, numTargets) : tetherText;

          mistakes.push({
            type: type,
            blame: player,
            reportId: data.blameId?.[player],
            text: text,
          });
        }

        return mistakes;
      },
    },
    {
      id: 'TOP Beyond Defense Cleanup',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7B28' }),
      run: (data) => data.beyondDefense = [],
    },
    {
      id: 'TOP Beyond Defense Collect',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7B28' }),
      run: (data, matches) => (data.beyondDefense ??= []).push(matches.target),
    },
    {
      id: 'TOP Pile Pitch Double Tap',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7B29' }),
      condition: (data, matches) => data.beyondDefense?.includes(matches.target),
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          reportId: matches.targetId,
          text: {
            en: `${matches.ability} (after Beyond Defense)`,
          },
        };
      },
    },
    {
      id: 'TOP Condensed Wave Cannon Kyrios',
      // Three people *should* be in this stack, so warn if somebody doesn't make it.
      // TODO: we could try to figure out who is not in this stack for stacks > 1
      // assuming that people don't switch sides.
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7B0F' }),
      mistake: stackMistake('warn', 3),
    },
    {
      id: 'TOP High-powered Sniper Cannon',
      // Wroth Flames-esque two person stack during p3 transition
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7B54' }),
      mistake: stackMistake('warn', 2),
    },
    {
      id: 'TOP Code Smell Collector',
      type: 'GainsEffect',
      // D6C Synchronization Code Smell (stack)
      // D6D Overflow Code Smell (defamation)
      // D6E Underflow Code Smell (red)
      // D6F Performance Code Smell (blue)
      // D71 Remote Code Smell (far tethers)
      // DAF Local Code Smell (near tethers)
      netRegex: NetRegexes.gainsEffect({ effectId: ['D6C', 'D6D', 'D6E', 'D6F', 'D71', 'DAF'] }),
      run: (data, matches) => {
        (data.helloSmell ??= []).push(matches);
        const emptyExpectedRot = { blue: [], red: [] };
        if (matches.effectId === 'D6E')
          ((data.expectedRots ??= {})[0] ??= emptyExpectedRot).red.push(matches.target);
        else if (matches.effectId === 'D6F')
          ((data.expectedRots ??= {})[0] ??= emptyExpectedRot).blue.push(matches.target);
      },
    },
    {
      id: 'TOP Hello World Collect Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: Object.values(helloEffect) }),
      mistake: (data, matches) => {
        const state = (data.helloState ??= {});
        const set = (state[matches.target] ??= new Set<string>());
        set.add(matches.effectId);

        // Detect unexpected rot passes.
        const isRedRot = matches.effectId === helloEffect.redRot;
        const isBlueRot = matches.effectId === helloEffect.blueRot;
        if (!isRedRot && !isBlueRot)
          return;

        data.latentDefectCount ??= 0;
        const expected = data.expectedRots?.[data.latentDefectCount] ?? { blue: [], red: [] };
        if (isRedRot && !expected.red.includes(matches.target)) {
          return {
            type: 'warn',
            blame: matches.target,
            reportId: matches.targetId,
            text: {
              en: 'Unexpected red rot',
            },
          };
        }
        if (isBlueRot && !expected.blue.includes(matches.target)) {
          return {
            type: 'warn',
            blame: matches.target,
            reportId: matches.targetId,
            text: {
              en: 'Unexpected blue rot',
            },
          };
        }
        // TODO: detect anything gained/active during critical error
      },
    },
    {
      id: 'TOP Hello World Collect Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: Object.values(helloEffect) }),
      run: (data, matches) => {
        const state = (data.helloState ??= {});
        const set = (state[matches.target] ??= new Set<string>());
        set.delete(matches.effectId);
      },
    },
    {
      id: 'TOP Latent Defect Snapshot',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7B6F', capture: false }),
      run: (data) => {
        data.latentDefectCount ??= 0;
        data.latentDefectCount++;

        // Take a snapshot of the debuff state when Latent Defect goes off before the abilities.
        data.helloStateSnapshot = {};
        for (const [name, set] of Object.entries(data.helloState ?? {}))
          data.helloStateSnapshot[name] = new Set(set);

        // Set up expected rot passes for future latent defects if needed.
        if (data.defamationColor !== undefined)
          return;

        data.expectedRots ??= {};
        data.helloSmell ??= [];

        const defamationSmellId = 'D6D';
        const redSmellId = 'D6E';
        const blueSmellId = 'D6F';
        const defamation = data.helloSmell.find((x) => x.effectId === defamationSmellId);
        const redEffects = data.helloSmell.filter((x) => x.effectId === redSmellId);
        const blueEffects = data.helloSmell.filter((x) => x.effectId === blueSmellId);

        if (defamation === undefined) {
          console.error(`Hello World: no defamation: ${JSON.stringify(data.helloSmell)}`);
          return;
        }

        if (redEffects.map((x) => x.target).includes(defamation.target))
          data.defamationColor = 'red';
        else if (blueEffects.map((x) => x.target).includes(defamation.target))
          data.defamationColor = 'blue';

        if (data.defamationColor === undefined) {
          console.error(`Hello World: no defamation color: ${JSON.stringify(data.helloSmell)}`);
          return;
        }

        const nearTetherColor = data.defamationColor;
        const farTetherColor = data.defamationColor === 'red' ? 'blue' : 'red';
        const nearSmellId = 'DAF';
        const farSmellId = 'D71';

        // Walk through all smells and add expected rots based on tether timers.
        for (const smell of data.helloSmell) {
          // 3 = initial rot/stack/def for defect 1
          // 23 = tether for defect 1
          // 44 = tether for defect 2
          // 65 = tether for defect 3
          // 86 = tether for defect 4
          // map to 1 2 3 4
          const duration = parseInt(smell.duration);
          const count = 1 + Math.floor(Math.max(duration - 10, 0) / 20);
          // No rot passes should occur on the 4th latent defect.
          // In general this is impossible, but deaths can make things weird.
          if (count === 4)
            continue;
          const expectedForCount = data.expectedRots[count] ??= { blue: [], red: [] };
          if (smell.effectId === nearSmellId)
            expectedForCount[nearTetherColor].push(smell.target);
          else if (smell.effectId === farSmellId)
            expectedForCount[farTetherColor].push(smell.target);
        }
      },
    },
    {
      id: 'TOP Latent Defect Missed Rots',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7B6F', capture: false }),
      mistake: (data) => {
        if (data.latentDefectCount === undefined)
          return;

        // Check if everybody got their expected rots.
        // This runs after the count has been incremented in the previous trigger.
        const prevCount = data.latentDefectCount - 1;
        const prevExpected = data.expectedRots?.[prevCount];
        // This should always be defined, but just in case (and for TypeScript)...
        if (prevExpected === undefined) {
          console.error(`Missing expected rot: ${prevCount}, ${JSON.stringify(data.expectedRots)}`);
          return;
        }

        const mistakes: OopsyMistake[] = [];
        const rotColors: RotColor[] = ['red', 'blue'];
        for (const color of rotColors) {
          for (const player of prevExpected[color]) {
            const rotToEffect: string = {
              red: helloEffect.redRot,
              blue: helloEffect.blueRot,
            }[color];
            if (data.helloStateSnapshot?.[player]?.has(rotToEffect))
              continue;
            const text: LocaleText = {
              red: {
                en: 'Failed to get red rot',
              },
              blue: {
                en: 'Failed to get blue rot',
              },
            }[color];
            mistakes.push({
              type: 'warn',
              blame: player,
              reportId: data.blameId?.[player],
              text: text,
            });
          }
        }

        return mistakes;
      },
    },
    {
      id: 'TOP Hello World Latent Defect Ability Collect',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: Object.values(helloAbility) }),
      run: (data, matches) => (data.helloCollect ??= []).push(matches),
    },
    {
      id: 'TOP Hello World Mistakes',
      type: 'Ability',
      /*
      netRegex: NetRegexes.ability({ id: Object.values(helloAbility), capture: false }),
      delaySeconds: 0.3,
      suppressSeconds: 1,
      */
      // TODO: can use this for testing since oopsy_viewer doesn't support delaySeconds yet.
      netRegex: NetRegexes.ability({ id: '7B63' }),
      mistake: (data) => {
        const mistakes: OopsyMistake[] = [];

        const collect = [...(data.helloCollect ?? [])];
        data.helloCollect = [];

        if (collect.length === 0)
          return;

        const unknownDesc = translate(data, unknownDescriptionLocale);

        const players = Object.keys(data.blameId ?? {});

        // Generate a string description of each player, for mistakes.
        const playerToDescription: { [name: string]: string } = {};
        for (const player of players) {
          const helloEffectAnon: { [name: string]: string } = helloEffect;
          const state = data.helloStateSnapshot?.[player];
          if (state === undefined)
            continue;

          // Combo descriptions.
          if (state.has(helloEffect.redRot) && !state.has(helloEffect.blueRot)) {
            if (state.has(helloEffect.defamation))
              playerToDescription[player] ??= translate(data, playerComboDesc.redDefamation);
            else if (state.has(helloEffect.stack))
              playerToDescription[player] ??= translate(data, playerComboDesc.redStack);
          } else if (state.has(helloEffect.blueRot) && !state.has(helloEffect.redRot)) {
            if (state.has(helloEffect.defamation))
              playerToDescription[player] ??= translate(data, playerComboDesc.blueDefamation);
            else if (state.has(helloEffect.stack))
              playerToDescription[player] ??= translate(data, playerComboDesc.blueStack);
          }

          // Single effect descriptions.
          for (const [key, desc] of Object.entries(playerDescription)) {
            const effectId = helloEffectAnon[key];
            if (effectId !== undefined && state?.has(effectId)) {
              playerToDescription[player] ??= translate(data, desc);
              continue;
            }
          }
        }

        for (const defect of defects) {
          const buffStrs: string[] = defect.expected.map((x) => helloEffect[x]);
          const [buff1, buff2] = buffStrs;

          const expectedPlayers = players.filter((x) => {
            const state = data.helloStateSnapshot?.[x];
            if (state === undefined)
              return;
            return buff1 !== undefined && state.has(buff1) ||
              buff2 !== undefined && state.has(buff2);
          });

          // Special-case "missed tower" to only include people who "should" have rot,
          // ignoring who "does" have rot.
          let missingExpectedPlayers = expectedPlayers;

          const expectedRot = data.expectedRots?.[(data.latentDefectCount ?? -1) - 1];

          if (defect.actual === 'redTower')
            missingExpectedPlayers = expectedRot?.red ?? missingExpectedPlayers;
          else if (defect.actual === 'blueTower')
            missingExpectedPlayers = expectedRot?.blue ?? missingExpectedPlayers;

          const actualAbilities = collect.filter((x) => x.id === helloAbility[defect.actual]);
          const actualPlayers = actualAbilities.map((x) => x.target);

          // Missing a person??
          for (const player of missingExpectedPlayers) {
            if (!actualPlayers.includes(player)) {
              // For towers, this will call missed if somebody should have rot and be in that
              // tower, even if they don't have rot.
              const text = translate(data, defect.missing);
              mistakes.push({
                type: 'warn',
                blame: player,
                reportId: data.blameId?.[player],
                text: `${text}${playerToDescription[player] ?? unknownDesc}`,
              });
            }
          }

          // Extra person with the wrong debuff??
          for (const player of actualPlayers) {
            if (!expectedPlayers.includes(player)) {
              const text = translate(data, defect.extra);
              mistakes.push({
                type: 'warn',
                blame: player,
                reportId: data.blameId?.[player],
                text: `${text}${playerToDescription[player] ?? unknownDesc}`,
              });
            }
          }

          const isTower = defect.actual === 'redTower' || defect.actual === 'blueTower';

          // Walk through abilities and make sure everybody took defamation/stack at most once.
          // (Surely nobody will double tap with stacks, but might as well handle it too.)
          const abilityCount: { [name: string]: number } = {};
          for (const ability of actualAbilities) {
            const player = ability.target;
            abilityCount[player] ??= 0;
            abilityCount[player]++;

            // Check for solo defamation/stack while we're here.
            const isFinalDefamation = defect.actual === 'defamation' &&
              data.latentDefectCount === 4;
            const targetCount = parseInt(ability.targetCount);
            // Defamation (1-3) and stack always need two people in them.
            if (targetCount === 1 && !isFinalDefamation && !isTower) {
              const text = translate(data, GetSoloMistakeText(defect.share));
              mistakes.push({
                type: 'warn',
                blame: player,
                reportId: data.blameId?.[player],
                text: `${text}${playerToDescription[player] ?? unknownDesc}`,
              });
            } else if (targetCount > 1 && (isFinalDefamation || isTower)) {
              // Towers and Defamation 4 should always have only one person in them.
              const text = translate(data, GetShareMistakeText(defect.share, 1));
              const hasDefamation = data.helloStateSnapshot?.[ability.target]?.has(
                helloEffect.defamation,
              );
              const type = hasDefamation ? 'warn' : 'fail';
              mistakes.push({
                type: type,
                blame: player,
                reportId: data.blameId?.[player],
                text: `${text}${playerToDescription[player] ?? unknownDesc}`,
              });
            }
          }

          // Is this a stack or defamation?
          const idealNumberOfPlayers = buffStrs.length;
          const tookTwo = defect.tookTwo;
          if (idealNumberOfPlayers !== 2 || tookTwo === undefined)
            continue;

          // Check for double taps.
          for (const [player, count] of Object.entries(abilityCount)) {
            if (count !== 2)
              continue;
            const text = translate(data, tookTwo);
            mistakes.push({
              type: 'warn',
              blame: player,
              reportId: data.blameId?.[player],
              text: `${text}${playerToDescription[player] ?? unknownDesc}`,
            });
          }
        }

        return mistakes;
      },
    },
    {
      id: 'TOP Critical Underflow Bug',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7B5A' }),
      mistake: (data, matches) => {
        const targets = parseInt(matches.targetCount);
        if (targets <= 1)
          return;
        const renamedText: LocaleText = {
          en: 'Red Rot Explosion',
        };
        const text = GetShareMistakeText(renamedText, targets);
        const isRedRot = data.helloStateSnapshot?.[matches.target]?.has(helloEffect.redRot);
        const type = isRedRot ? 'warn' : 'fail';
        return { type: type, blame: matches.target, text: text };
      },
    },
    {
      id: 'TOP Critical Performance Bug',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7B5B' }),
      mistake: (data, matches) => {
        const targets = parseInt(matches.targetCount);
        if (targets <= 1)
          return;
        const renamedText: LocaleText = {
          en: 'Blue Rot Explosion',
        };
        const text = GetShareMistakeText(renamedText, targets);
        const isBlueRot = data.helloStateSnapshot?.[matches.target]?.has(helloEffect.blueRot);
        const type = isBlueRot ? 'warn' : 'fail';
        return { type: type, blame: matches.target, text: text };
      },
    },
    {
      id: 'TOP Oversampled Wave Cannon Collect',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7B6D' }),
      run: (data, matches) => (data.monitorCollect ??= []).push(matches),
    },
    {
      id: 'TOP P3 Oversampled Wave Cannon',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7B6D', capture: false }),
      delaySeconds: 0.3,
      suppressSeconds: 1,
      mistake: (data, _matches) => {
        // TODO: restrict this to p3
        const players = Object.keys(data.blameId ?? {});
        const monitorPlayers = (data.monitorCollect ?? []).map((x) => x.target);
        const missing = players.filter((x) => !monitorPlayers.includes(x));
        const mistakes: OopsyMistake[] = [];
        for (const player of missing) {
          mistakes.push({
            type: 'warn',
            name: player,
            // no reportId/blame here as it's possible that the person missing this monitor
            // is not at fault.
            text: {
              en: 'Not hit by monitor',
            },
          });
        }
        return mistakes;
      },
    },
  ],
};

export default triggerSet;
