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
  sigilMap: { [id: string]: 'Blue' | 'Red' };
  storedSigils: { x: number; y: number; id: string }[];
  storedTetherTargets: { [id: string]: PluginCombatantState };
  storedPythons: PluginCombatantState[];
  // For Quetz, mechanics which only use two of them always use the two with the highest ID
  storedQuetzalcoatls: PluginCombatantState[];
  storedBehemoths: PluginCombatantState[];
  exoterikosCounter: number;
  paradeigmaCounter: number;
  astralFlowCounter: number;
  adikiaCounter: number;
}

const directionOutputStrings = {
  northeast: Outputs.northeast,
  north: Outputs.north,
  northwest: Outputs.northwest,
  west: Outputs.west,
  southeast: Outputs.southeast,
  south: Outputs.south,
  southwest: Outputs.southwest,
  east: Outputs.east,
  combo: {
    en: '${dir1} / ${dir2}',
  },
};

const pythonLineOutputStrings = {
  '0': Outputs.num1,
  '1': Outputs.num2,
  '2': Outputs.num3,
  '3': Outputs.num4,
  'row': {
    en: 'Row ${first}/${second}',
  },
  'col': {
    en: 'Col ${first}/${second}',
  },
  'singleRow': {
    en: 'Row ${first}',
  },
};

const refreshCombatantsPromise = async (data: Data) => {
  const combatants = await callOverlayHandler({
    call: 'getCombatants',
  });
  data.storedBehemoths = [];
  data.storedPythons = [];
  data.storedQuetzalcoatls = [];
  for (const combatant of combatants.combatants) {
    const id = combatant.ID;
    if (id === undefined)
      continue;
    if (combatant.BNpcID === 14386)
      data.storedBehemoths.push(combatant);
    if (combatant.BNpcID === 14387)
      data.storedPythons.push(combatant);
    if (combatant.BNpcID === 14388)
      data.storedQuetzalcoatls.push(combatant);
    if (combatant.BNpcID === 13712)
      data.sigilMap[id.toString(16).toUpperCase()] = 'Red';
    if (combatant.BNpcID === 13713)
      data.sigilMap[id.toString(16).toUpperCase()] = 'Blue';
  }
  data.storedBehemoths.sort((l, r) => {
    return (l.ID ?? 0) - (r.ID ?? 0);
  });
  data.storedPythons.sort((l, r) => {
    return (l.ID ?? 0) - (r.ID ?? 0);
  });
  data.storedQuetzalcoatls.sort((l, r) => {
    return (l.ID ?? 0) - (r.ID ?? 0);
  });
};

const getPythonLine = (python: PluginCombatantState): number => {
  let coordinate = python.PosX;
  if (python.PosX < 80 || python.PosX > 120)
    coordinate = python.PosY;

  if (coordinate < 85)
    return 0;
  if (coordinate < 100)
    return 1;
  if (coordinate < 115)
    return 2;
  return 0;
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheMinstrelsBalladZodiarksFall,
  timelineFile: 'zodiark-ex.txt',
  initData: () => ({
    sigilMap: {},
    storedSigils: [],
    storedTetherTargets: {},
    storedBehemoths: [],
    storedQuetzalcoatls: [],
    storedPythons: [],
    exoterikosCounter: 0,
    paradeigmaCounter: 0,
    astralFlowCounter: 0,
    adikiaCounter: 0,
  }),
  triggers: [
    {
      id: 'ZodiarkEx Ania',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67EF', source: 'Zodiark' }),
      netRegexDe: NetRegexes.startsUsing({ id: '67EF', source: 'Zodiark' }),
      netRegexFr: NetRegexes.startsUsing({ id: '67EF', source: 'Zordiarche' }),
      netRegexJa: NetRegexes.startsUsing({ id: '67EF', source: 'ゾディアーク' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'ZodiarkEx Blue Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '00A4', source: 'Zodiark' }),
      netRegexDe: NetRegexes.tether({ id: '00A4', source: 'Zodiark' }),
      netRegexFr: NetRegexes.tether({ id: '00A4', source: 'Zordiarche' }),
      netRegexJa: NetRegexes.tether({ id: '00A4', source: 'ゾディアーク' }),
      promise: async (data, matches) => {
        const targetData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.targetId, 16)],
        });
        const targetCombatant = targetData.combatants[0];
        if (!targetCombatant) {
          console.error(`Blue Tether: null data`);
          return;
        }

        data.storedTetherTargets[matches.targetId] = targetCombatant;
      },
      alertText: (data, matches, output) => {
        const target = data.storedTetherTargets[matches.targetId];
        if (!target) {
          console.error(`Blue Tether: Missing target, ${JSON.stringify(matches)}`);
          return;
        }

        if (target.PosX < 100)
          return output.west!();

        if (target.PosX > 100)
          return output.east!();

        if (target.PosY < 100)
          return output.north!();

        return output.south!();
      },
      outputStrings: directionOutputStrings,
    },
    {
      id: 'ZodiarkEx Red Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '00AB', source: 'Zodiark' }),
      netRegexDe: NetRegexes.tether({ id: '00AB', source: 'Zodiark' }),
      netRegexFr: NetRegexes.tether({ id: '00AB', source: 'Zordiarche' }),
      netRegexJa: NetRegexes.tether({ id: '00AB', source: 'ゾディアーク' }),
      promise: async (data, matches) => {
        const targetData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.targetId, 16)],
        });
        const targetCombatant = targetData.combatants[0];
        if (!targetCombatant) {
          console.error(`Red Tether: null data`);
          return;
        }

        data.storedTetherTargets[matches.targetId] = targetCombatant;
      },
      alertText: (data, matches, output) => {
        const target = data.storedTetherTargets[matches.targetId];
        if (!target) {
          console.error(`Red Tether: Missing target, ${JSON.stringify(matches)}`);
          return;
        }

        if (target.PosX < 100)
          return output.east!();

        if (target.PosX > 100)
          return output.west!();

        if (target.PosY < 100)
          return output.south!();

        return output.north!();
      },
      outputStrings: directionOutputStrings,
    },
    {
      id: 'ZodiarkEx Exoterikos 1',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['67E5', '67E6'], source: 'Arcane Sigil', capture: true }),
      netRegexDe: NetRegexes.startsUsing({ id: ['67E5', '67E6'], source: 'Geheimzeichen', capture: true }),
      netRegexFr: NetRegexes.startsUsing({ id: ['67E5', '67E6'], source: 'emblème secret', capture: true }),
      netRegexJa: NetRegexes.startsUsing({ id: ['67E5', '67E6'], source: '秘紋', capture: true }),
      condition: (data) => data.exoterikosCounter === 0,
      delaySeconds: 0.1,
      promise: refreshCombatantsPromise,
      alertText: (data, matches, output) => {
        data.storedSigils.push({
          x: parseFloat(matches.x),
          y: parseFloat(matches.y),
          id: matches.sourceId,
        });

        if (data.storedSigils.length < 2)
          return;

        ++data.exoterikosCounter;

        let dir1;
        let dir2;
        for (const sigil of data.storedSigils) {
          if (sigil.x < 100)
            dir1 = 'west';

          if (sigil.x > 100)
            dir1 = 'east';

          if (sigil.y < 100)
            dir2 = data.sigilMap[sigil.id] === 'Blue' ? 'north' : 'south';

          if (sigil.y > 100)
            dir2 = data.sigilMap[sigil.id] === 'Red' ? 'north' : 'south';
        }

        if (!dir1 || !dir2) {
          console.error(`Exoterikos 1: Unknown layout, ${JSON.stringify(data.storedSigils)}`);
          data.storedSigils = [];
          return;
        }

        data.storedSigils = [];
        return output[dir2 + dir1]!();
      },
      outputStrings: directionOutputStrings,
    },
    {
      id: 'ZodiarkEx Algedon NE/SW',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67EC', source: 'Zodiark' }),
      netRegexDe: NetRegexes.startsUsing({ id: '67EC', source: 'Zodiark' }),
      netRegexFr: NetRegexes.startsUsing({ id: '67EC', source: 'Zordiarche' }),
      netRegexJa: NetRegexes.startsUsing({ id: '67EC', source: 'ゾディアーク' }),
      alertText: (_data, _matches, output) =>
        output.combo!({
          dir1: output.northeast!(),
          dir2: output.southwest!(),
        }),
      outputStrings: directionOutputStrings,
    },
    {
      id: 'ZodiarkEx Algedon NW/SE',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67ED', source: 'Zodiark' }),
      netRegexDe: NetRegexes.startsUsing({ id: '67ED', source: 'Zodiark' }),
      netRegexFr: NetRegexes.startsUsing({ id: '67ED', source: 'Zordiarche' }),
      netRegexJa: NetRegexes.startsUsing({ id: '67ED', source: 'ゾディアーク' }),
      alertText: (_data, _matches, output) =>
        output.combo!({
          dir1: output.northwest!(),
          dir2: output.southeast!(),
        }),
      outputStrings: directionOutputStrings,
    },
    {
      id: 'ZodiarkEx Paradeigma 1',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67BF', source: 'Zodiark' }),
      netRegexDe: NetRegexes.startsUsing({ id: '67BF', source: 'Zodiark' }),
      netRegexFr: NetRegexes.startsUsing({ id: '67BF', source: 'Zordiarche' }),
      netRegexJa: NetRegexes.startsUsing({ id: '67BF', source: 'ゾディアーク' }),
      condition: (data) => data.paradeigmaCounter === 0,
      delaySeconds: 0.1,
      alertText: (data, _matches, output) => {
        ++data.paradeigmaCounter;
        return output.underQuetz!();
      },
      outputStrings: {
        underQuetz: {
          en: 'Under NW Quetzalcoatl',
        },
      },
    },
    {
      id: 'ZodiarkEx Paradeigma 2',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67BF', source: 'Zodiark' }),
      netRegexDe: NetRegexes.startsUsing({ id: '67BF', source: 'Zodiark' }),
      netRegexFr: NetRegexes.startsUsing({ id: '67BF', source: 'Zordiarche' }),
      netRegexJa: NetRegexes.startsUsing({ id: '67BF', source: 'ゾディアーク' }),
      condition: (data) => data.paradeigmaCounter === 1,
      delaySeconds: 0.1,
      promise: refreshCombatantsPromise,
      alertText: (data, _matches, output) => {
        ++data.paradeigmaCounter;
        const x1 = data.storedQuetzalcoatls[2]?.PosX;
        const y1 = data.storedQuetzalcoatls[2]?.PosY;
        const x2 = data.storedQuetzalcoatls[3]?.PosX;
        const y2 = data.storedQuetzalcoatls[3]?.PosY;

        if (x1 === undefined || x2 === undefined || y1 === undefined || y2 === undefined)
          return;

        if (x1 < 100 && x2 < 100)
          return output.west!();
        if (x1 > 100 && x2 > 100)
          return output.east!();
        if (y1 < 100 && y2 < 100)
          return output.north!();
        return output.south!();
      },
      outputStrings: directionOutputStrings,
    },
    {
      id: 'ZodiarkEx Paradeigma 3',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67BF', source: 'Zodiark' }),
      netRegexDe: NetRegexes.startsUsing({ id: '67BF', source: 'Zodiark' }),
      netRegexFr: NetRegexes.startsUsing({ id: '67BF', source: 'Zordiarche' }),
      netRegexJa: NetRegexes.startsUsing({ id: '67BF', source: 'ゾディアーク' }),
      condition: (data) => data.paradeigmaCounter === 2,
      delaySeconds: 0.1,
      run: (data) => ++data.paradeigmaCounter,
    },
    {
      id: 'ZodiarkEx Astral Flow 1',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6662', '6663'], source: 'Zodiark' }),
      netRegexDe: NetRegexes.startsUsing({ id: ['6662', '6663'], source: 'Zodiark' }),
      netRegexFr: NetRegexes.startsUsing({ id: ['6662', '6663'], source: 'Zordiarche' }),
      netRegexJa: NetRegexes.startsUsing({ id: ['6662', '6663'], source: 'ゾディアーク' }),
      condition: (data) => data.astralFlowCounter === 0,
      delaySeconds: 0.1,
      promise: refreshCombatantsPromise,
      alertText: (data, matches, output) => {
        ++data.astralFlowCounter;
        const python1 = data.storedPythons[0];
        const python2 = data.storedPythons[1];
        if (!python1 || !python2) {
          console.error(`Astral Flow 1: missing python data`);
          return;
        }
        const direction = matches.id === '6662' ? 'CW' : 'CCW';

        const safe = [getPythonLine(python1), getPythonLine(python2)];
        let type = 'row';
        if (python1.PosX < 80 || python1.PosX > 120)
          type = 'col';
        if (direction === 'CW') {
          --safe[0];
          if (safe[0]! < 0)
            safe[0] = 3;
          --safe[1];
          if (safe[1]! < 0)
            safe[1] = 3;
        }

        safe.sort((l, r) => {
          return l - r;
        });

        const firstNum = safe[0];
        const secondNum = safe[1];
        if (firstNum === undefined || secondNum === undefined)
          throw new UnreachableCode();

        return output[type]!({
          first: output[firstNum.toString()]!(),
          second: output[secondNum.toString()]!(),
        });
      },
      outputStrings: pythonLineOutputStrings,
    },
    {
      id: 'ZodiarkEx Adikia 1',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67F1', source: 'Zodiark' }),
      netRegexDe: NetRegexes.startsUsing({ id: '67F1', source: 'Zodiark' }),
      netRegexFr: NetRegexes.startsUsing({ id: '67F1', source: 'Zordiarche' }),
      netRegexJa: NetRegexes.startsUsing({ id: '67F1', source: 'ゾディアーク' }),
      condition: (data) => data.adikiaCounter === 0,
      delaySeconds: 0.1,
      promise: refreshCombatantsPromise,
      alertText: (data, _matches, output) => {
        ++data.adikiaCounter;
        const python1 = data.storedPythons[0];
        const python2 = data.storedPythons[1];
        if (!python1 || !python2) {
          console.error(`Adikia 1: missing python data`);
          return;
        }

        const safe = [getPythonLine(python1), getPythonLine(python2)];

        safe.sort((l, r) => {
          return l - r;
        });

        let safeRow = 0;
        if (safe[0] === 0)
          safeRow = 1;

        return output.singleRow!({
          first: output[`${safeRow}`]!(),
        });
      },
      outputStrings: pythonLineOutputStrings,
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Esoteric Dyad/Esoteric Sect': 'Esoteric Dyad/Sect',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Arcane Sigil': 'Geheimzeichen',
        'Behemoth': 'Behemoth',
        'Quetzalcoatl': 'Quetzalcoatl',
        'Roiling Darkness': 'Strom der Dunkelheit',
        'Zodiark': 'Zodiark',
        'python': 'Python',
      },
      'replaceText': {
        'Adikia': 'Adikia',
        'Algedon': 'Algedon',
        'Ania': 'Ania',
        'Apomnemoneumata': 'Apomnemoneumata',
        'Astral Eclipse': 'Astraleklipse',
        'Astral Flow': 'Lichtstrom',
        'Esoteric Dyad': 'Esoterische Dyade',
        'Esoteric Pattern': 'Esoteric Muster',
        '(?<!Triple )Esoteric Ray': 'Esoterischer Strahl',
        'Esoteric Sect': 'Esoterische Sekte',
        'Esoterikos': 'Esoterikos',
        '(?<!Trimorphos )Exoterikos': 'Exoterikos',
        'Explosion': 'Explosion',
        'Infernal Stream': 'Infernostrom',
        'Infernal Torrent': 'Infernaler Strom',
        'Keraunos Eidolon': 'Keraunos',
        'Kokytos': 'Kokytos',
        'Meteoros Eidolon': 'Meteoros',
        'Opheos Eidolon': 'Opheos',
        'Paradeigma': 'Paradeigma',
        'Phlegethon': 'Phlegethon',
        'Phobos': 'Phobos',
        'Styx': 'Styx',
        'Trimorphos Exoterikos': 'Trimorphos Exoterikos',
        'Triple Esoteric Ray': 'Esoterischer Dreierstrahl',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Arcane Sigil': 'emblème secret',
        'Behemoth': 'béhémoth',
        'Quetzalcoatl': 'Quetzalcóatl',
        'Roiling Darkness': 'orbe des Ténèbres',
        'Zodiark': 'Zordiarche',
        'python': 'Python',
      },
      'replaceText': {
        'Adikia': 'Adikia',
        'Algedon': 'Algedon',
        'Ania': 'Ania',
        'Apomnemoneumata': 'Apomnemoneumata',
        'Astral Eclipse': 'Éclipse astrale',
        'Astral Flow': 'Flux astral',
        'Esoteric Dyad': 'Dyade ésotérique',
        '(?<!Triple )Esoteric Ray': 'Rayon ésotérique',
        'Esoteric Sect': 'Cabale ésotérique',
        'Esoterikos': 'Esoterikos',
        '(?<!Trimorphos )Exoterikos': 'Exoterikos',
        'Explosion': 'Explosion',
        'Infernal Stream': 'Courant infernal',
        'Infernal Torrent': 'Torrent infernal',
        'Keraunos Eidolon': 'Keraunos',
        'Kokytos': 'Kokytos',
        'Meteoros Eidolon': 'Meteoros',
        'Opheos Eidolon': 'Opheos',
        'Paradeigma': 'Paradeigma',
        'Phlegethon': 'Phlégéthon',
        'Phobos': 'Phobos',
        'Styx': 'Styx',
        'Trimorphos Exoterikos': 'Trimorphos Exoterikos',
        'Triple Esoteric Ray': 'Rayon ésotérique triple',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Arcane Sigil': '秘紋',
        'Behemoth': 'ベヒーモス',
        'Quetzalcoatl': 'ケツァクウァトル',
        'Roiling Darkness': '闇の奔流',
        'Zodiark': 'ゾディアーク',
        'python': 'ピュトン',
      },
      'replaceText': {
        'Adikia': 'アディキア',
        'Algedon': 'アルゲドン',
        'Ania': 'アニア',
        'Apomnemoneumata': 'アポムネーモネウマタ',
        'Astral Eclipse': 'アストラルエクリプス',
        'Astral Flow': 'アストラルフロウ',
        'Esoteric Dyad': 'エソテリックダイアド',
        '(?<!Triple )Esoteric Ray': 'エソテリックレイ',
        'Esoteric Sect': 'エソテリックセクト',
        'Esoterikos': 'エソーテリコス',
        '(?<!Trimorphos )Exoterikos': 'エクソーテリコス',
        'Explosion': '爆発',
        'Infernal Stream': 'インフェルノストリーム',
        'Infernal Torrent': 'インフェルノトレント',
        'Keraunos Eidolon': 'ケラノウス・エイドロン',
        'Kokytos': 'コキュートス',
        'Meteoros Eidolon': 'メテオロス・エイドロン',
        'Opheos Eidolon': 'オフェオス・エイドロン',
        'Paradeigma': 'パラデイグマ',
        'Phlegethon': 'プレゲトン',
        'Phobos': 'フォボス',
        'Styx': 'ステュクス',
        'Trimorphos Exoterikos': 'トライ・エクソーテリコス',
        'Triple Esoteric Ray': 'トライ・エソテリックレイ',
      },
    },
  ],
};

export default triggerSet;
