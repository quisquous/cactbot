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

// TODO: 7B04 Storage Violation, taking tower but only if you have Looper and wrong number
// TODO: 7B10 Diffuse Wave Cannon Kyrios being shared if not invulning?
// TODO: call out who missed their Program Loop tower
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

export interface Data extends OopsyData {
  blameId?: { [name: string]: string };
  inLine?: { [name: string]: number };
  towerCount?: number;
  blasterCollect?: NetMatches['Ability'][];
  towerCollect?: NetMatches['Ability'][];
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
  ],
};

export default triggerSet;
