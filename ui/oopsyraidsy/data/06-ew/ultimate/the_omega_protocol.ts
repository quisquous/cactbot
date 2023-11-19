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
import { GetShareMistakeText, GetSoloMistakeText, playerDamageFields } from '../../../oopsy_common';

// TODO: 7B10 Diffuse Wave Cannon Kyrios being shared if not invulning?
// TODO: call out who was missing in the Condensed Wave Cannon stack
// TODO: taking a hello world tower too late (rot debuff timer > tower debuff timer)
// TODO: breaking patch too early in p3, but especially delta
// TODO: beyond defense person getting hit by monitor in delta
// TODO: red/green tether not getting hit by monitor in delta
// TODO: headmarker tracking so we can track sigma marked/unmarked being hit by 7B72 Hyper Pulse or 7B74 Wave Cannon
// TODO: sigma tower tracking
// TODO: sigma laser hitting somebody with zero stacks
// TODO: omega monitor not hitting a 2-dynamic 2nd in line person
// TODO: omega monitor hitting anybody also hit by near world/blaster
// TODO: 7BA7 / 7BA8 Cosmo Dive
// TODO: 7BAA Wave Cannon wild charge collect

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

export const translate = (data: Data, text: LocaleText) => {
  return text[data.options.DisplayLanguage] ?? text['en'];
};

export type Phase =
  | 'p1'
  | 'p2'
  | 'p3'
  | 'p4'
  | 'delta'
  | 'sigma'
  | 'omega'
  | 'p6';

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
      de: 'Roter Turm, keine Fäulnis',
      fr: 'Tour rouge, pas de putréfaction',
      ja: '赤塔、デバフなし',
      cn: '红塔, 无毒',
      ko: '빨강 장판, 디버프 없음',
    },
    missing: {
      en: 'Missed Red Tower',
      de: 'Verfehlter roter Turm',
      fr: 'Tour rouge manquée',
      ja: '赤塔失敗',
      cn: '没踩到红塔',
      ko: '빨강 장판 놓침',
    },
    share: {
      en: 'Red Tower',
      de: 'Roter Turm',
      fr: 'Tour rouge',
      ja: '赤塔',
      cn: '红塔',
      ko: '빨강 장판',
    },
  },
  {
    expected: ['blueRot'],
    actual: 'blueTower',
    extra: {
      en: 'Blue Tower, no rot',
      de: 'Blauer Turm, keine Fäulnis',
      fr: 'Tour bleue, pas de putréfaction',
      ja: '青塔、デバフなし',
      cn: '蓝塔, 无毒',
      ko: '파랑 장판, 디버프 없음',
    },
    missing: {
      en: 'Missed Blue Tower',
      de: 'Verfehlter blauer Turm',
      fr: 'Tour bleue manquée',
      ja: '青塔失敗',
      cn: '没踩到蓝塔',
      ko: '파랑 장판 놓침',
    },
    share: {
      en: 'Blue Tower',
      de: 'Blauer Turm',
      fr: 'Tour bleue',
      ja: '青塔',
      cn: '蓝塔',
      ko: '파랑 장판',
    },
  },
  {
    expected: ['stack', 'blueTether'],
    actual: 'stack',
    extra: {
      en: 'Stack',
      de: 'Sammeln',
      fr: 'Package',
      ja: '頭割り',
      cn: '分摊',
      ko: '쉐어',
    },
    missing: {
      en: 'Missed stack',
      de: 'Verfehltes Sammeln',
      fr: 'Package manqué',
      ja: '頭割り失敗',
      cn: '错过分摊',
      ko: '쉐어 놓침',
    },
    share: {
      en: 'Stack',
      de: 'Sammeln',
      fr: 'Package',
      ja: '頭割り',
      cn: '分摊',
      ko: '쉐어',
    },
    tookTwo: {
      en: 'Stack x2',
      de: 'Sammeln x2',
      fr: 'Package x2',
      ja: '頭割り x2',
      cn: '分摊 x2',
      ko: '쉐어 x2',
    },
  },
  {
    expected: ['defamation', 'redTether'],
    actual: 'defamation',
    extra: {
      en: 'Defamation',
      de: 'Ehrenstrafe',
      fr: 'Diffamation',
      ja: 'サークル',
      cn: '大圈',
      ko: '광역',
    },
    missing: {
      en: 'Missed defamation',
      de: 'Verfehlte Ehrenstrafe',
      fr: 'Diffamation manquée',
      ja: 'サークル失敗',
      cn: '错过大圈',
      ko: '광역 놓침',
    },
    share: {
      en: 'Defamation',
      de: 'Ehrenstrafe',
      fr: 'Diffamation',
      ja: 'サークル',
      cn: '大圈',
      ko: '광역',
    },
    tookTwo: {
      en: 'Defamation x2',
      de: 'Ehrenstrafe x2',
      fr: 'Diffamation x2',
      ja: 'サークル x2',
      cn: '大圈 x2',
      ko: '광역 x2',
    },
  },
];

// These descriptions are appended directly after text from the defects structure above.
type HelloEffect = keyof typeof helloEffect;
const playerDescription: { [key in HelloEffect]: LocaleText } = {
  // Order is important here.
  defamation: {
    en: ' (as defamation)',
    de: ' (als Ehrenstrafe)',
    fr: ' (comme diffamation)',
    ja: ' (サークル)',
    cn: ' (大圈)',
    ko: ' (광역)',
  },
  stack: {
    en: ' (as stack)',
    de: ' (als Sammeln)',
    fr: ' (en tant que package)',
    ja: ' (頭割り)',
    cn: ' (分摊)',
    ko: ' (쉐어)',
  },
  redTether: {
    en: ' (as near tether)',
    de: ' (als Nah-Verbindung)',
    fr: ' (en tant que lien proche)',
    ja: ' (ニア)',
    cn: ' (近线)',
    ko: ' (가까이 선)',
  },
  blueTether: {
    en: ' (as far tether)',
    de: ' (als Fern-Verbindung)',
    fr: ' (en tant que lien éloigné)',
    ja: ' (ファー)',
    cn: ' (远线)',
    ko: ' (멀리 선)',
  },
  // These shouldn't happen.
  redRot: {
    en: ' (as red rot)',
    de: ' (als rote Fäulnis)',
    fr: ' (en tant que rouge)',
    ja: ' (赤)',
    cn: ' (红毒)',
    ko: ' (빨강 디버프)',
  },
  blueRot: {
    en: ' (as blue rot)',
    de: ' (als blaue Fäulnis)',
    fr: ' (en tant que bleu)',
    ja: ' (青)',
    cn: ' (蓝毒)',
    ko: ' (파랑 디버프)',
  },
} as const;

// Some special case combo descriptions.
const playerComboDesc = {
  redDefamation: {
    en: ' (as red defamation)',
    de: ' (als rote Ehrenstrafe)',
    fr: ' (en tant que diffamation rouge)',
    ja: ' (赤サークル)',
    cn: ' (红大圈)',
    ko: ' (빨강 광역)',
  },
  redStack: {
    en: ' (as red stack)',
    de: ' (als rotes Sammeln)',
    fr: ' (en tant que package rouge)',
    ja: ' (赤頭割り)',
    cn: ' (红分摊)',
    ko: ' (빨강 쉐어)',
  },
  blueDefamation: {
    en: ' (as blue defamation)',
    de: ' (als blaue Ehrenstrafe)',
    fr: ' (en tant que diffamation bleue)',
    ja: ' (青サークル)',
    cn: ' (蓝大圈)',
    ko: ' (파랑 광역)',
  },
  blueStack: {
    en: ' (as blue stack)',
    de: ' (als blaue Sammeln)',
    fr: ' (en tant que package bleu',
    ja: ' (青頭割り)',
    cn: ' (蓝分摊)',
    ko: ' (파랑 쉐어)',
  },
} as const;

const unknownDescriptionLocale: LocaleText = {
  en: ' (as ???)',
  de: ' (als ???)',
  fr: ' (en tant que ???)',
  ja: ' (???)',
  cn: ' (???)',
  ko: ' (???)',
};

export interface Data extends OopsyData {
  decOffset?: number;
  phase?: Phase;
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
  waveCannonProteanCollect?: NetMatches['Ability'][];
  waveCannonStackCollect?: NetMatches['Ability'][];
}

export const firstMarker = parseInt('0017', 16);

export const getHeadmarkerId = (
  data: Data,
  matches: NetMatches['HeadMarker'],
) => {
  if (data.decOffset === undefined)
    data.decOffset = parseInt(matches.id, 16) - firstMarker;
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};

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
    'TOP Superliminal Steel 3': '7B2B', // Omega-F hot wing during Sigma
    'TOP Superliminal Steel 4': '7B2C', // Omega-F hot wing during Sigma
    'TOP Optimized Blizzard III': '7B2D', // Omega-F cross during Party Synergy / Sigma
    'TOP Optical Laser': '7B21', // Optical Unit eye laser during Party Synergy / Delta
    'TOP Optimized Sagittarius Arrow': '7B33', // line aoe during Limitless Synergy
    'TOP Optimized Bladedance 1': '7B36', // Omega-M tankbuster conal (not tether target 7F75) during Limitless Synergy
    'TOP Optimized Bladedance 2': '7B37', // Omega-F tankbuster conal (not tether target 7F75) during Limitless Synergy
    'TOP Wave Repeater 1': '7B4F', // inner ring during p3 transition / p4
    'TOP Wave Repeater 2': '7B50', // second ring during p3 transition / p4
    'TOP Wave Repeater 3': '7B51', // third ring during p3 transition / p4
    'TOP Wave Repeater 4': '7B52', // outer ring during p3 transition / p4
    'TOP Colossal Blow': '7B4E', // Right/Left Arm Unit big centered circle during p3 transition
    'TOP Rocket Punch Explosion': '7AFA', // small rocket arm circles when done correctly
    'TOP Hyper Pulse 1': '7B70', // initial spinny arm lasers during Delta
    'TOP Hyper Pulse 2': '7B71', // ongoing spinny arm lasers during Delta
    'TOP Swivel Cannon 1': '7B94', // left/right beetle haircut during Delta
    'TOP Swivel Cannon 2': '7B95', // left/right beetle haircut during Delta
    'TOP Rear Power Unit Rear Lasers 1': '7B8F', // initial Sigma rotating laser
    'TOP Rear Power Unit Rear Lasers 2': '7B90', // ongoing Sigma rotating laser
    'TOP Diffuse Wave Cannon': '7B79', // front/back or side cleaves during Omega dodges
    'TOP Cosmo Arrow 1': '7BA3', // initial exasquare
    'TOP Cosmo Arrow 2': '7BA4', // ongoing exasquare
  },
  damageFail: {
    'TOP Storage Violation Obliteration': '7B06', // failing towers
  },
  gainsEffectFail: {
    // C05 is the 9999 duration, and C06 is the 15s bleed tick (for 150k damage).
    'TOP Bleeding': 'C05', // standing in the middle during p3 intermission
  },
  shareWarn: {
    'TOP Wave Cannon Kyrios': '7B11', // headmarker line lasers after Pantokrator
    'TOP Optimized Fire III': '7B2F', // spread during Party Synergy
    'TOP Sniper Cannon': '7B53', // spread during p3 transition
    'TOP Wave Cannon Protean': '7B7E', // p4 initial protean laser
    'TOP Oversampled Wave Cannon': '7B6D', // p3/p5 monitors
    'TOP Sigma Wave Cannon': '7B74', // headmarker line protean at the start of Sigma
    'TOP Flash Gale': '7DDF', // p6 tank autos
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
      id: 'TOP Phase Tracker',
      type: 'StartsUsing',
      // 7B40 = Firewall
      // 8014 = Run ****mi* (Sigma Version)
      // 8015 = Run ****mi* (Omega Version)
      netRegex: NetRegexes.startsUsing({ id: ['7B40', '8014', '8015'], capture: true }),
      run: (data, matches) => {
        switch (matches.id) {
          case '7B40':
            data.phase = 'p2';
            break;
          case '8014':
            data.phase = 'sigma';
            break;
          case '8015':
            data.phase = 'omega';
            break;
        }
      },
    },
    {
      id: 'TOP Phase Ability Tracker',
      type: 'Ability',
      // 7BFD = attack (Omega)
      // 7B13 = self-cast on omega
      // 7B47 = self-cast on omega
      // 7B7C = self-cast on omega
      // 7F72 = Blind Faith (non-enrage)
      netRegex: NetRegexes.ability({ id: ['7BFD', '7B13', '7B47', '7B7C', '7F72'], capture: true }),
      suppressSeconds: 20, // Ignore multiple delta/omega captures
      run: (data, matches) => {
        switch (matches.id) {
          case '7BFD':
            data.phase = 'p1';
            break;
          case '7B13':
            data.phase = 'p3';
            break;
          case '7B47':
            data.phase = 'p4';
            break;
          case '7B7C':
            data.phase = 'delta';
            break;
          case '7F72':
            data.phase = 'p6';
            break;
        }
      },
    },
    {
      id: 'TOP Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => getHeadmarkerId(data, matches),
    },
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
              de: `Verfehlter Turm #${num}`,
              fr: `Tour #${num} manquée`,
              ja: '塔踏み #${num}失敗',
              cn: `错过 #${num} 塔`,
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
            de: `Turm #${num}`,
            fr: `Tour #${num}`,
            ja: `塔#${num}`,
            cn: `塔 #${num}`,
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
              de: `Turm #${num} als #${playerNum}`,
              fr: `Tour #${num} en tant que #${playerNum}`,
              ja: `塔#${num}踏む (#${playerNum})`,
              cn: `#${num} 塔 点名 #${playerNum}`,
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
              de: `Verfehlte Verbindung #${num}`,
              fr: `Lien #${num} manqué`,
              ja: `線#${num}取り失敗`,
              cn: `错过 #${num} 线`,
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
            de: `${m.ability} #${num}`,
            fr: `${m.ability} #${num}`,
            ja: `${m.ability} #${num}`,
            cn: `${m.ability} #${num}`,
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
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7B27' }),
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
            de: `${matches.ability} (nach Schildkombo S)`,
            fr: `${matches.ability} (après Au-delà de la défense)`,
            ja: `${matches.ability} (シールドコンボS以後)`,
            cn: `${matches.ability} (盾连击S后)`,
            ko: `${matches.ability} (방패 연격 S 이후)`,
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
              de: 'Unerwartete rote Fäulnis',
              fr: 'Putréfaction rouge inattendue',
              ja: '赤デバフもらう',
              cn: '非预期红毒',
              ko: '빨강 디버프 잘못 받음',
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
              de: 'Unerwartete blaue Fäulnis',
              fr: 'Putréfaction bleue inattendue',
              ja: '青デバフもらう',
              cn: '非预期蓝毒',
              ko: '파랑 디버프 잘못 받음',
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
                de: 'Rote Fäulnis nicht erhalten',
                fr: 'Obtention de putréfaction rouge échouée',
                ja: '赤デバフ失敗',
                cn: '没拿到红毒',
                ko: '빨강 디버프 못받음',
              },
              blue: {
                en: 'Failed to get blue rot',
                de: 'Blaue Fäulnis nicht erhalten',
                fr: 'Obtention de putréfaction bleue échouée',
                ja: '青デバフ失敗',
                cn: '没拿到蓝毒',
                ko: '파랑 디버프 못받음',
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
      // Check Hello World mistakes during patch explosions
      netRegex: NetRegexes.ability({ id: '7B63' }),
      mistake: (data) => {
        if (data.helloCollect === undefined || data.helloCollect.length === 0)
          return;

        const mistakes: OopsyMistake[] = [];

        const collect = [...data.helloCollect];
        data.helloCollect = [];

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

          // It's fine to have extra people in the final stack, so ignore this.
          if (data.latentDefectCount !== 4 || defect.actual !== 'stack') {
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
              const text = translate(data, GetShareMistakeText(defect.share, targetCount));
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
          de: 'Rote Fäulnis Explosion',
          fr: 'Explosion de la putréfaction rouge',
          ja: '赤デバフ爆発',
          cn: '红毒爆炸',
          ko: '빨강 디버프 폭발',
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
          de: 'Blaue Fäulnis Explosion',
          fr: 'Explosion de la putréfaction bleue',
          ja: '青デバフ爆発',
          cn: '蓝毒爆炸',
          ko: '파랑 디버프 폭발',
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
      netRegex: NetRegexes.ability({ id: '7B6D', ...playerDamageFields }),
      run: (data, matches) => (data.monitorCollect ??= []).push(matches),
    },
    {
      id: 'TOP P3 Oversampled Wave Cannon',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7B6D', capture: false }),
      condition: (data) => data.phase === 'p3',
      delaySeconds: 0.3,
      suppressSeconds: 1,
      mistake: (data, _matches) => {
        // TODO: restrict this to p3
        const players = Object.keys(data.blameId ?? {});
        data.monitorCollect ??= [];

        const monitorPlayers = data.monitorCollect.map((x) => x.target);
        const missing = players.filter((x) => !monitorPlayers.includes(x));
        const mistakes: OopsyMistake[] = [];
        for (const player of missing) {
          mistakes.push({
            type: 'warn',
            name: player,
            // no reportId/blame here as this is usually somebody else's fault
            text: {
              en: 'Not hit by monitor',
              de: 'Nicht vom Monitor getroffen',
              fr: 'Non touché par le moniteur',
              ja: '検知失敗',
              cn: '未被小电视命中',
              ko: '모니터 안맞음',
            },
          });
        }

        const monitorCount: { [name: string]: number } = {};
        for (const player of monitorPlayers) {
          monitorCount[player] ??= 0;
          monitorCount[player]++;
        }
        for (const [player, count] of Object.entries(monitorCount)) {
          if (count <= 1)
            continue;
          mistakes.push({
            type: 'warn',
            name: player,
            // no reportId/blame here as this is usually somebody else's fault
            text: {
              en: `Took monitor x${count}`,
              de: `Monitor x${count} genommen`,
              fr: `Moniteur pris x${count} fois`,
              ja: `検知 x${count}`,
              cn: `吃小电视 x${count} 次`,
              ko: `모니터 ${count}개 맞음`,
            },
          });
        }

        // It is possible in rare cases for there to be more than 8 hits.
        // Maybe the boss hits everybody on the monitor side and not just two?
        const numMonitors = data.monitorCollect.filter((x) => x.targetIndex === '0').length;
        if (numMonitors !== 8) {
          mistakes.push({
            type: 'warn',
            text: {
              en: `Total monitors: x${numMonitors}`,
              de: `Monitore insgesamt: x${numMonitors}`,
              fr: `Moniteurs totaux: x${numMonitors}`,
              ja: `検知数: x${numMonitors}`,
              cn: `小电视总数: x${numMonitors}`,
              ko: `총 모니터 수: x${numMonitors}`,
            },
          });
        }

        return mistakes;
      },
    },
    {
      id: 'TOP P4 Wave Cannon Protean Rename',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7B7E', ...playerDamageFields }),
      mistake: stackMistake('warn', 1, {
        // Rename this for clarity.
        en: 'Wave Cannon Protean',
        de: 'Wellenkanone Himmelsrichtung',
        fr: 'Position pour le canon',
        ja: '散会波動砲',
        cn: '分散波动炮',
        ko: '산개 파동포',
      }),
    },
    {
      id: 'TOP P4 Wave Cannon Protean Two',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7B80', ...playerDamageFields }),
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          reportId: matches.targetId,
          triggerType: 'Damage',
          text: {
            en: 'Wave Cannon Repeat Protean',
            de: 'Wellenkanone wiederholte Himmelsrichtung',
            fr: 'Position pour le canon répétée',
            ja: '連続散会波動砲',
            cn: '复读分散波动炮',
            ko: '산개 파동포 장판',
          },
        };
      },
    },
    {
      id: 'TOP P4 Wave Cannon Protean Collect',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7B7E', ...playerDamageFields }),
      run: (data, matches) => (data.waveCannonProteanCollect ??= []).push(matches),
    },
    {
      id: 'TOP P4 Wave Cannon Protean Analyze',
      type: 'Ability',
      // If somebody is dead, people will take more single target proteans.
      // Just mention this so it's obvious why this person died.
      netRegex: NetRegexes.ability({ id: '7B7E', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 3,
      // netRegex: NetRegexes.ability({ id: ['5779', '7B52'], capture: false }),
      mistake: (data) => {
        const mistakes: OopsyMistake[] = [];
        data.waveCannonProteanCollect ??= [];
        if (data.waveCannonProteanCollect.length === 0)
          return;

        // Report missing players: this is only possible when somebody is dead,
        // but report it anyway, so it's obvious that "X is dead, Y took two and died".
        const cannonPlayers = data.waveCannonProteanCollect.map((x) => x.target);
        for (const player of Object.keys(data.blameId ?? [])) {
          if (cannonPlayers.includes(player))
            continue;
          mistakes.push({
            type: 'warn',
            name: player,
            text: {
              en: `Missed Wave Cannon Protean`,
              de: `Verfehlte Wellenkanone Himmelsrichtung`,
              fr: `Canon manqué`,
              ja: '散会波動砲失敗',
              cn: `未被分散波动炮命中`,
              ko: `산개 파동포 놓침`,
            },
          });
        }

        // Track anybody double tapped with two "single target" proteans.
        const cannonCount: { [name: string]: number } = {};
        const clippedAnotherPlayer: { [name: string]: boolean } = {};
        for (const line of data.waveCannonProteanCollect) {
          cannonCount[line.target] ??= 0;
          if (parseInt(line.targetCount) >= 2)
            clippedAnotherPlayer[line.target] ??= true;
          cannonCount[line.target]++;
        }

        for (const [player, count] of Object.entries(cannonCount)) {
          // If there's a clip, we'll mention it elsewhere,
          // no need to say "this person took x3 proteans because one person was dead
          // and two people clipped each other".
          if (count === 1 || clippedAnotherPlayer[player])
            continue;
          mistakes.push({
            type: 'warn',
            name: player,
            text: {
              en: `Wave Cannon Protean x${count}`,
              de: `Wellenkanone Himmelsrichtung x${count}`,
              fr: `Position pour canon x${count}`,
              ja: `散会波動砲 x${count}`,
              cn: `分散波动炮 x${count}`,
              ko: `산개 파동포 x${count}`,
            },
          });
        }

        return mistakes;
      },
      run: (data) => data.waveCannonProteanCollect = [],
    },
    {
      id: 'TOP P4 Wave Cannon Stack Collect',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7B7F', ...playerDamageFields }),
      run: (data, matches) => (data.waveCannonStackCollect ??= []).push(matches),
    },
    {
      id: 'TOP P4 Wave Cannon Stack Analyze',
      type: 'Ability',
      // Make sure people aren't in two stacks
      netRegex: NetRegexes.ability({ id: '7B7F', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 3,
      // netRegex: NetRegexes.ability({ id: ['5779', '7B52'], capture: false }),
      mistake: (data) => {
        const mistakes: OopsyMistake[] = [];

        data.waveCannonStackCollect ??= [];
        if (data.waveCannonStackCollect.length === 0)
          return;

        const cannonPlayers = data.waveCannonStackCollect.map((x) => x.target);
        for (const player of Object.keys(data.blameId ?? [])) {
          if (cannonPlayers.includes(player))
            continue;
          mistakes.push({
            type: 'warn',
            blame: player,
            reportId: data.blameId?.[player],
            text: {
              en: `Missed Wave Cannon Stack`,
              de: `Verfehltes Wellenkanone Sammeln`,
              fr: `Package pour le canon manqué`,
              ja: `頭割り波動砲失敗`,
              cn: `未被分摊波动炮命中`,
              ko: `쉐어 파동포 놓침`,
            },
          });
        }

        const cannonCount: { [name: string]: number } = {};
        for (const line of data.waveCannonStackCollect ?? []) {
          cannonCount[line.target] ??= 0;
          cannonCount[line.target]++;
        }

        for (const [player, count] of Object.entries(cannonCount)) {
          if (count <= 1)
            continue;
          mistakes.push({
            type: 'fail',
            blame: player,
            reportId: data.blameId?.[player],
            text: {
              en: `Wave Cannon Stack x${count}`,
              de: `Wellenkanone Sammeln x${count}`,
              fr: `Package canon x${count}`,
              ja: `頭割り波動砲失敗 x${count}`,
              cn: `分摊波动炮 x${count}`,
              ko: `쉐어 파동포 x${count}`,
            },
          });
        }

        return mistakes;
      },
      run: (data) => data.waveCannonStackCollect = [],
    },
    {
      id: 'TOP P5 Hello World Stacks',
      type: 'Ability',
      // This needs to be its own trigger because these are flagged as "instant death" if stacked,
      // which is not included in "playerDamageFields",
      netRegex: NetRegexes.ability({ id: ['7B8A', '7B89', '8110', '8111'] }),
      mistake: stackMistake('fail', 1),
    },
    {
      id: 'TOP P6 Wave Cannon Exaflare Rename',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['7BAD', '7BAE', '7BAF'], ...playerDamageFields }),
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          reportId: matches.targetId,
          triggerType: 'Damage',
          text: {
            en: 'Exaflare',
            de: 'Exaflare',
            fr: 'ExaBrasier',
            ja: 'エクサフレア',
            cn: '地火',
            ko: '엑사플레어',
          },
        };
      },
    },
    {
      id: 'TOP P6 Wave Cannon Protean Rename',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7BAB', ...playerDamageFields }),
      mistake: stackMistake('fail', 1, {
        // Rename this for clarity.
        en: 'Wave Cannon Protean',
        de: 'Wellenkanone Himmelsrichtung',
        fr: 'Position pour le canon',
        ja: '散会波動砲',
        cn: '分散波动炮',
        ko: '산개 파동포',
      }),
    },
  ],
};

export default triggerSet;
