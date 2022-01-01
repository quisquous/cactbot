import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  activeSigils: { x: number; y: number; typeId: string; npcId: string }[];
  activeFrontSigils: { x: number; y: number; typeId: string; npcId: string }[];
  paradeigmaCounter: number;
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
    en: '${first} / ${second}',
  },
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

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheMinstrelsBalladZodiarksFall,
  timelineFile: 'zodiark-ex.txt',
  initData: () => ({
    activeSigils: [],
    activeFrontSigils: [],
    paradeigmaCounter: 0,
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
      netRegexCn: NetRegexes.startsUsing({ id: '67EF', source: '佐迪亚克' }),
      response: Responses.tankBusterSwap(),
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
      alertText: (data, _matches, output) => {
        ++data.paradeigmaCounter;
        if (data.paradeigmaCounter === 1)
          return output.underQuetz!();
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
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stack x6',
        },
      },
    },
    {
      // 67E4 Green Beam, 67E5 Rectangle, 67E6 Wedge
      id: 'ZodiarkEx Arcane Sigil End',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['67E4', '67E5', '67E6'], source: 'Arcane Sigil' }),
      run: (data, matches, _output) => {
        for (let i = 0; i < data.activeSigils.length; ++i) {
          const sig = data.activeSigils[i];
          if (sig?.npcId === matches.sourceId)
            data.activeSigils.splice(i, 1);
        }
      },
    },
    {
      id: 'ZodiarkEx Blue Cone Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '00A4', source: 'Zodiark' }),
      promise: async (data, matches) => {
        const portalActors = await fetchCombatantsByTargetID([matches.targetId]);
        for (const actor of portalActors) {
          if (actor.ID)
            data.activeSigils.push({ x: actor.PosX, y: actor.PosY, typeId: '67E6', npcId: actor.ID.toString(16).toUpperCase() });
        }
      },
      alertText: (data, matches, output) => {
        const target = data.activeSigils[data.activeSigils.length - 1];
        if (!target) {
          console.error(`Blue Tether: Missing target, ${JSON.stringify(matches)}`);
          return;
        }

        if (target.x < 100)
          return output.westCone!();

        if (target.x > 100)
          return output.eastCone!();

        if (target.y < 100)
          return output.northCone!();
        return output.southCone!();
      },
      outputStrings: {
        northCone: {
          en: 'North Cone',
        },
        eastCone: {
          en: 'East Cone',
        },
        westCone: {
          en: 'West Cone',
        },
        southCone: {
          en: 'South Cone',
        },
      },
    },
    {
      id: 'ZodiarkEx Red Box Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '00AB', source: 'Zodiark' }),
      promise: async (data, matches) => {
        const portalActors = await fetchCombatantsByTargetID([matches.targetId]);
        for (const actor of portalActors) {
          if (actor.ID)
            data.activeSigils.push({ x: actor.PosX, y: actor.PosY, typeId: '67E5', npcId: actor.ID.toString(16).toUpperCase() });
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
      id: 'ZodiarkEx Roiling Darkness Spawn',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatant({ name: 'Roiling Darkness', capture: false }),
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: Outputs.killAdds.en + '(back first)',
        },
      },
    },
    {
      // 67E4 Green Beam, 67E5 Rectangle, 67E6 Wedge
      id: 'ZodiarkEx Arcane Sigil Start',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['67E4', '67E5', '67E6'], source: 'Arcane Sigil' }),
      run: (data, matches, _output) => {
        if (parseFloat(matches.y) < 100)
          data.activeFrontSigils.push({ x: parseFloat(matches.x), y: parseFloat(matches.y), typeId: matches.id, npcId: matches.sourceId });
      },
    },
    {
      id: 'ZodiarkEx Arcane Sigil Start Cleanup',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['67E4', '67E5', '67E6'], source: 'Arcane Sigil', capture: false }),
      delaySeconds: 0.2,
      suppressSeconds: 0.5,
      alertText: (data, _matches, output) => {
        const activeFrontSigils = data.activeFrontSigils;
        data.activeFrontSigils = [];
        if (activeFrontSigils.length === 1 && activeFrontSigils[0]?.typeId === '67E4')
          return output.sides!();
        if (activeFrontSigils.length === 1 && activeFrontSigils[0]?.typeId === '67E5')
          return output.south!();
        if (activeFrontSigils.length === 1 && activeFrontSigils[0]?.typeId === '67E6')
          return output.north!();
        if (activeFrontSigils.length === 2 && activeFrontSigils[0]?.typeId === '67E4' && activeFrontSigils[1]?.typeId === '67E4')
          return output.middle!();
        if (activeFrontSigils.length === 3) {
          for (const sig of activeFrontSigils) {
            // Find the middle sigil
            if (sig.x > 90 && sig.x < 110) {
              if (sig.typeId === '67E4')
                return output.frontsides!();
              if (sig.typeId === '67E5')
                return output.backmiddle!();
              if (sig.typeId === '67E6')
                return output.frontmiddle!();
            }
          }
        }
      },
      outputStrings: {
        south: Outputs.south,
        north: Outputs.north,
        frontsides: {
          en: 'front sides',
        },
        backmiddle: {
          en: 'back middle',
        },
        frontmiddle: {
          en: 'front middle',
        },
        sides: Outputs.sides,
        middle: Outputs.middle,
      },
    },
    {
      // 67EC is leaning left, 67ED is leaning right
      id: 'ZodiarkEx Algedon',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['67EC', '67ED'], source: 'Zodiark' }),
      alertText: (data, matches, output) => {
        if (matches.id === '67EC') {
          // NE/SW
          return output.combo!({ first: output.northeast!(), second: output.southwest!() });
        }
        if (matches.id === '67ED') {
          // NW/SE
          return output.combo!({ first: output.northwest!(), second: output.southeast!() });
        }
      },
      outputStrings: directionOutputStrings,
    },
    {
      id: 'ZodiarkEx Adikia',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63A9', source: 'Zodiark', capture: false }),
      alertText: (data, _matches, output) => {
        ++data.adikiaCounter;
        switch (data.adikiaCounter) {
          case 1:
            return output.text!();
          case 2:
            return output.lookforpython!();
          case 3:
            return output.text!();
          default:
            return output.lookforpython!();
        }
      },
      outputStrings: {
        text: {
          en: 'double fists',
        },
        lookforpython: {
          en: 'double fists, look for python',
        },
      },
    },
    {
      id: 'ZodiarkEx Phobos',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67F0', source: 'Zodiark', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Heavy DoT',
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
