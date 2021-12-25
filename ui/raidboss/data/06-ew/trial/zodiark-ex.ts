import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  // sigilMap: { [id: string]: 'Blue' | 'Red' };
  activeSigils: { x: number; y: number; typeId: string; npcId: string }[];
  // storedTetherTargets: { [id: string]: PluginCombatantState };
  // storedPythons: PluginCombatantState[];
  // For Quetz, mechanics which only use two of them always use the two with the highest ID
  activeQuetzs: PluginCombatantState[];
  // storedBehemoths: PluginCombatantState[];
  // exoterikosCounter: number;
  paradeigmaCounter: number;
  // astralFlowCounter: number;
  // adikiaCounter: number;
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

const fetchCombatantsByBNpcID = async (BNpcIDs: number[]) => {
  const callData = await callOverlayHandler({
    call: 'getCombatants',
  });
  const combatants = callData.combatants.filter((c) => !!c.BNpcID && BNpcIDs.includes(c.BNpcID));
  return combatants;
};

const fetchCombatantsByTargetID = async (targetId: string[]) => {
  const decIds = [];
  for (const id of targetId)
    decIds.push(parseInt(id, 16));
  const callData = await callOverlayHandler({
    call: 'getCombatants',
    ids: decIds,
  });
  return callData.combatants;
};

const isSafeFromSigil = (activeSigils: { x: number; y: number; typeId: string; npcId: string }[], quadrant: number) => {
  if (activeSigils.length === 0)
    return true;
  if (quadrant === 0) {
    for (const sigil of activeSigils) {
      // If this is a blue sigil
      if (sigil.typeId === '67E6') {
        if (sigil.x < 100 || sigil.y > 100)
          return false;
        // If this is a red sigil
      } else if (sigil.typeId === '67E5') {
        if (sigil.x > 100 || sigil.y < 100)
          return false;
      }
      return true;
    }
  }
  if (quadrant === 1) {
    for (const sigil of activeSigils) {
      // If this is a blue sigil
      if (sigil.typeId === '67E6') {
        if (sigil.x > 100 || sigil.y > 100)
          return false;
        // If this is a red sigil
      } else if (sigil.typeId === '67E5') {
        if (sigil.x < 100 || sigil.y < 100)
          return false;
      }
      return true;
    }
  }
  if (quadrant === 2) {
    for (const sigil of activeSigils) {
      // If this is a blue sigil
      if (sigil.typeId === '67E6') {
        if (sigil.x > 100 || sigil.y < 100)
          return false;
        // If this is a red sigil
      } else if (sigil.typeId === '67E5') {
        if (sigil.x < 100 || sigil.y > 100)
          return false;
      }
      return true;
    }
  }
  if (quadrant === 3) {
    for (const sigil of activeSigils) {
      // If this is a blue sigil
      if (sigil.typeId === '67E6') {
        if (sigil.x < 100 || sigil.y < 100)
          return false;
        // If this is a red sigil
      } else if (sigil.typeId === '67E5') {
        if (sigil.x > 100 || sigil.y > 100)
          return false;
      }
      return true;
    }
  }
};

const isSafeFromQuetz = (activeQuetzs: PluginCombatantState[], quadrant: number) => {
  if (activeQuetzs.length === 0)
    return true;
  for (const quetz of activeQuetzs) {
    switch (quadrant) {
      case 0:
        if (quetz.PosX > 100 && quetz.PosY < 100)
          return true;
        break;
      case 1:
        if (quetz.PosX < 100 && quetz.PosY < 100)
          return true;
        break;
      case 2:
        if (quetz.PosX < 100 && quetz.PosY > 100)
          return true;
        break;
      case 3:
        if (quetz.PosX > 100 && quetz.PosY > 100)
          return true;
        break;
    }
  }
  return false;
};

// Quadrants:
//  1  |  0
// ---------
//  2  |  3
const isSafe = (activeSigils: { x: number; y: number; typeId: string; npcId: string }[], activeQuetzs: PluginCombatantState[], quadrant: number) => {
  if (isSafeFromQuetz(activeQuetzs, quadrant) && isSafeFromSigil(activeSigils, quadrant))
    return true;
  return false;
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheMinstrelsBalladZodiarksFall,
  timelineFile: 'zodiark-ex.txt',
  initData: () => ({
    // sigilMap: {},
    activeSigils: [],
    // storedTetherTargets: {},
    // storedBehemoths: [],
    activeQuetzs: [],
    // storedPythons: [],
    // exoterikosCounter: 0,
    paradeigmaCounter: 0,
    // astralFlowCounter: 0,
    // adikiaCounter: 0,
  }),
  triggers: [
    {
      id: 'ZodiarkEx Ania',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67EF', source: 'Zodiark' }),
      netRegexDe: NetRegexes.startsUsing({ id: '67EF', source: 'Zodiark' }),
      netRegexFr: NetRegexes.startsUsing({ id: '67EF', source: 'Zordiarche' }),
      netRegexJa: NetRegexes.startsUsing({ id: '67EF', source: 'ゾディアーク' }),
      netRegexCn: NetRegexes.startsUsing({ id: '67EF', source: '佐迪亚克' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'ZodiarkEx Kokytos',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6C60', source: 'Zodiark', capture: false }),
      response: Responses.bigAoe(),
    },
    {
      id: 'ZodiarkEx Paradeigma',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '67BF', source: 'Zodiark', capture: false }),
      promise: async (data, _matches) => {
        const quetz = await fetchCombatantsByBNpcID([14388]);
        /*
        console.log('------------');
        for (const q of quetz)
          console.log('paradeigma quetz: ', q);
        console.log('------------');
        */
        data.activeQuetzs = quetz;
      },
      alertText: (data, _matches, output) => {
        if (data.paradeigmaCounter === 0)
          return output.underQuetz!();
        ++data.paradeigmaCounter;
      },
      outputStrings: {
        underQuetz: {
          en: 'Under NW Quetzalcoatl',
        },
      },
    },
    {
      id: 'ZodiarkEx Styx',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67F3', source: 'Zodiark', capture: false }),
      response: Responses.aoe(),
    },
    /* // FIXME: Add portals on tethers, handle green ones here later?
    {
      // 67E4 Green Beam, 67E5 Rectangle, 67E6 Wedge
      id: 'Zodiark Arcane Sigil Start',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['67E4', '67E5', '67E6'], source: 'Arcane Sigil', capture: true }),
      preRun: (data, matches, _output) => {
        data.activeSigils.push({ x: parseFloat(matches.x), y: parseFloat(matches.y), typeId: matches.id, npcId: matches.sourceId });
      },
      alertText: (_data, _matches, _output) => {
        return 'ALARM';
      },
      outputStrings: {
        text: {
          en: 'ALARM',
        },
      },
    },*/
    {
      id: 'ZodiarkEx Arcane Sigil End',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['67E4', '67E5', '67E6'], source: 'Arcane Sigil', capture: true }),
      run: (data, matches, _output) => {
        for (let i = 0; i < data.activeSigils.length; ++i) {
          const sig = data.activeSigils[i];
          if (sig?.npcId === matches.sourceId)
            data.activeSigils.splice(i, 1);
        }
      },
    },
    {
      id: 'ZodiarkEx Quetz End',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6651', source: 'Quetzalcoatl', capture: true }),
      run: (data, matches, _output) => {
        for (let i = 0; i < data.activeQuetzs.length; ++i) {
          const quetz = data.activeQuetzs[i];
          if (quetz && (quetz.ID === parseInt(matches.sourceId, 16)))
            data.activeQuetzs.splice(i, 1);
        }
      },
    },
    {
      id: 'ZodiarkEx Blue Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '00A4', source: 'Zodiark' }),
      promise: async (data, matches) => {
        const portalActors = await fetchCombatantsByTargetID([matches.targetId]);
        for (const actor of portalActors) {
          if (actor.ID)
            data.activeSigils.push({ x: actor.PosX, y: actor.PosY, typeId: '67E5', npcId: actor.ID.toString(16) });
        }
      },
      alertText: (data, matches, output) => {
        const target = data.activeSigils[data.activeSigils.length - 1];
        if (!target) {
          console.error(`Blue Tether: Missing target, ${JSON.stringify(matches)}`);
          return;
        }

        if (target.x < 100)
          return output.west!();

        if (target.x > 100)
          return output.east!();

        if (target.y < 100)
          return output.north!();
        return output.south!();
      },
      outputStrings: directionOutputStrings,
    },
    {
      id: 'ZodiarkEx Red Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '00AB', source: 'Zodiark' }),
      promise: async (data, matches) => {
        const portalActors = await fetchCombatantsByTargetID([matches.targetId]);
        for (const actor of portalActors) {
          if (actor.ID)
            data.activeSigils.push({ x: actor.PosX, y: actor.PosY, typeId: '67E5', npcId: actor.ID.toString(16) });
        }
      },
      alertText: (data, matches, output) => {
        const target = data.activeSigils[data.activeSigils.length - 1];
        if (!target) {
          console.error(`Red Tether: Missing target, ${JSON.stringify(matches)}`);
          return;
        }

        if (target.x < 100)
          return output.east!();

        if (target.x > 100)
          return output.west!();

        if (target.y < 100)
          return output.south!();
        return output.north!();
      },
      outputStrings: directionOutputStrings,
    },
    {
      // 67EC is leaning left, 67ED is leaning right
      id: 'ZodiarkEx Algedon',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['67EC', '67ED'], source: 'Zodiark' }),
      alertText: (data, matches, _output) => {
        console.log('algedon. quetz ', data.activeQuetzs.length, ' sigil ', data.activeSigils.length);
        if (matches.id === '67EC') {
          // NE/SW
          if (isSafe(data.activeSigils, data.activeQuetzs, 0))
            return 'NE';
          return 'SW';
        }
        if (matches.id === '67ED') {
          // NW/SE
          if (isSafe(data.activeSigils, data.activeQuetzs, 1))
            return 'NW';
          return 'SE';
        }
      },
      outputStrings: {
        text: {
          en: 'hehe',
        },
      },
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
        'Esoteric Dyad(?!/)': 'Dyade ésotérique',
        'Esoteric Dyad/Esoteric Sect': 'Dyade/Cabale ésotérique',
        '(?<!Triple )Esoteric Ray': 'Rayon ésotérique',
        '(?<!/)Esoteric Sect': 'Cabale ésotérique',
        'Esoteric Pattern': 'Schéma ésotérique',
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
        'Esoteric Pattern': '秘紋図形',
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
    {
      'locale': 'cn',
      'replaceSync': {
        'Arcane Sigil': '秘纹',
        'Behemoth': '贝希摩斯',
        'Quetzalcoatl': '克察尔科亚特尔',
        'Roiling Darkness': '黑暗奔流',
        'Zodiark': '佐迪亚克',
        'python': '大蟒',
      },
      'replaceText': {
        'Adikia': '不义',
        'Algedon': '痛苦',
        'Ania': '悲伤',
        'Apomnemoneumata': '悼念',
        'Astral Eclipse': '星蚀',
        'Astral Flow': '星极超流',
        'Esoteric Dyad': '神秘二分',
        'Esoteric Pattern': '秘纹图案',
        '(?<!Triple )Esoteric Ray': '神秘光线',
        'Esoteric Sect': '神秘切割',
        'Esoterikos': '内纹',
        '(?<!Trimorphos )Exoterikos': '外纹',
        'Explosion': '爆炸',
        'Infernal Stream': '狱火奔流',
        'Infernal Torrent': '狱火洪流',
        'Keraunos Eidolon': '雷霆幻影',
        'Kokytos': '悲痛',
        'Meteoros Eidolon': '陨石幻影',
        'Opheos Eidolon': '巨蛇幻影',
        'Paradeigma': '范式',
        'Phlegethon': '冥火',
        'Phobos': '恐惧',
        'Styx': '仇恨',
        'Trimorphos Exoterikos': '三重外纹',
        'Triple Esoteric Ray': '三重神秘光线',
      },
    },
  ],
};

export default triggerSet;
