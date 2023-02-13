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
  extra: LocaleText;
  missing: LocaleText;
  tookTwo?: LocaleText;
};

// The extra/missing/tookTwo texts have playerDescription below appended to it,
// e.g. "Red Tower, no rot (as defamation)" or "Missed Stack (as blue tether)".
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
    en: ' (as red tether)',
  },
  blueTether: {
    en: ' (as blue tether)',
  },
  // These shouldn't happen.
  redRot: {
    en: ' (as red rot)',
  },
  blueRot: {
    en: ' (as blue rot)',
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
  defamationColor?: RotColor;
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
      id: 'TOP Hello World Collect Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: Object.values(helloEffect) }),
      run: (data, matches) => {
        const state = (data.helloState ??= {});
        const set = (state[matches.target] ??= new Set<string>());
        set.add(matches.effectId);
        // TODO: detect unexpected rot passes??
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
      netRegex: NetRegexes.ability({ id: '7B6F' }),
      run: (data) => {
        // Take a snapshot of the debuff state when Latent Defect goes off before the abilities.
        data.helloStateSnapshot = {};
        for (const [name, set] of Object.entries(data.helloState ?? {}))
          data.helloStateSnapshot[name] = new Set(set);
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
      netRegex: NetRegexes.ability({ id: Object.values(helloAbility), capture: false }),
      delaySeconds: 0.3,
      suppressSeconds: 1,
      // TODO: can use this for testing since oopsy_viewer doesn't support delaySeconds yet.
      // netRegex: NetRegexes.ability({ id: '7B63' }),
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
          const state = data.helloStateSnapshot?.[player];
          for (const [key, desc] of Object.entries(playerDescription)) {
            const helloEffectAnon: { [name: string]: string } = helloEffect;
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

          const actualAbilities = collect.filter((x) => x.id === helloAbility[defect.actual]);
          const actualPlayers = actualAbilities.map((x) => x.target);

          // Missing a person??
          for (const player of expectedPlayers) {
            if (!actualPlayers.includes(player)) {
              // It's possible somebody could have picked up a rot weirdly and so is "missing".
              // This doesn't check for the people who "should" have rots, only those that do.
              // TODO: handle if somebody doesn't stand in a tower AND doesn't pick up rot.
              // Probably we need to figure out who the expected players based on the very
              // initial set of debuffs, rather than just looking at the current state of debuffs.
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

          // Is this a stack or defamation?
          const idealNumberOfPlayers = buffStrs.length;
          const tookTwo = defect.tookTwo;
          if (idealNumberOfPlayers !== 2 || tookTwo === undefined)
            continue;

          // Walk through abilities and make sure everybody took defamation/stack at most once.
          // (Surely nobody will double tap with stacks, but might as well handle it too.)
          const abilityCount: { [name: string]: number } = {};
          for (const ability of actualAbilities) {
            const player = ability.target;
            abilityCount[player] ??= 0;
            abilityCount[player]++;

            // Check for solo defamation/stack while we're here.
            if (ability.targetCount === '1') {
              const text = translate(data, GetSoloMistakeText(defect.extra));
              mistakes.push({
                type: 'warn',
                blame: player,
                reportId: data.blameId?.[player],
                text: `${text}${playerToDescription[player] ?? unknownDesc}`,
              });
            }
          }

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
      mistake: stackMistake('warn', 1, {
        en: 'Red Rot Explosion',
      }),
    },
    {
      id: 'TOP Critical Performance Bug',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7B5B' }),
      mistake: stackMistake('warn', 1, {
        en: 'Blue Rot Explosion',
      }),
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
