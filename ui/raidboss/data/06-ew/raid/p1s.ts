import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const flailDirections = {
  l: Outputs.left,
  r: Outputs.right,
  combo: {
    en: '${first} => ${second}',
    de: '${first} => ${second}',
    fr: '${first} => ${second}',
    ja: '${first} => ${second}',
    cn: '${first} => ${second}',
    ko: '${first} => ${second}',
  },
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheFirstCircleSavage,
  timelineFile: 'p1s.txt',
  timelineTriggers: [
    {
      id: 'P1S Tile Positions',
      regex: /(?:First|Second|Third) Element/,
      beforeSeconds: 3,
      infoText: (_data, _matches, output) => output.positions!(),
      outputStrings: {
        positions: {
          en: 'Tile Positions',
          de: 'Flächen-Positionen',
          fr: 'Positions',
          cn: '上自己的方块',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'P1S Warder\'s Wrath',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '662A', source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '662A', source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '662A', source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '662A', source: 'エリクトニオス', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P1S Shining Cells',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6616', source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6616', source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6616', source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6616', source: 'エリクトニオス', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P1S Slam Shut',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6617', source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6617', source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6617', source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6617', source: 'エリクトニオス', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P1S Gaoler\'s Flail Left => Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65F6', source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '65F6', source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '65F6', source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '65F6', source: 'エリクトニオス', capture: false }),
      alertText: (_data, _matches, output) => output.combo!({ first: output.l!(), second: output.r!() }),
      outputStrings: flailDirections,
    },
    {
      id: 'P1S Gaoler\'s Flail Right => Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65F7', source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '65F7', source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '65F7', source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '65F7', source: 'エリクトニオス', capture: false }),
      alertText: (_data, _matches, output) => output.combo!({ first: output.r!(), second: output.l!() }),
      outputStrings: flailDirections,
    },
    {
      id: 'P1S Gaoler\'s Flail Out => In',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['65F8', '65F9'], source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['65F8', '65F9'], source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['65F8', '65F9'], source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['65F8', '65F9'], source: 'エリクトニオス', capture: false }),
      alertText: (_data, _matches, output) => output.outThenIn!(),
      outputStrings: {
        outThenIn: Outputs.outThenIn,
      },
    },
    {
      id: 'P1S Gaoler\'s Flail In => Out',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['65FA', '65FB'], source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['65FA', '65FB'], source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['65FA', '65FB'], source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['65FA', '65FB'], source: 'エリクトニオス', capture: false }),
      alertText: (_data, _matches, output) => output.inThenOut!(),
      outputStrings: {
        inThenOut: Outputs.inThenOut,
      },
    },
    {
      id: 'P1S Heavy Hand',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6629', source: 'Erichthonios' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6629', source: 'Erichthonios' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6629', source: 'Érichthonios' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6629', source: 'エリクトニオス' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'P1S Pitiless Flail of Grace',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '660E', source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '660E', source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '660E', source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '660E', source: 'エリクトニオス', capture: false }),
      alertText: (_data, _matches, output) => output.directions!(),
      outputStrings: {
        directions: {
          en: 'Tankbuster+Knockback => Stack',
          de: 'Tankbuster+Rückstoß => Sammeln',
          fr: 'Tank buster + Poussée => Packez-vous',
          cn: '坦克死刑+击退 => 分摊',
        },
      },
    },
    {
      id: 'P1S Pitiless Flail of Purgation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '660F', source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '660F', source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '660F', source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '660F', source: 'エリクトニオス', capture: false }),
      alertText: (_data, _matches, output) => output.directions!(),
      outputStrings: {
        directions: {
          en: 'Tankbuster+Knockback => Flare',
          de: 'Tankbuster+Rückstoß => Flare',
          fr: 'Tank buster + Poussée => Brasier',
          cn: '坦克死刑+击退 => 核爆',
        },
      },
    },
    // Copy/paste from normal, seems to be the same
    {
      id: 'P1S Hot/Cold Spell',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['AB3', 'AB4'], capture: true }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, _output) => {
        return _matches.effectId === 'AB3' ? _output.red!() : _output.blue!();
      },
      outputStrings: {
        red: {
          en: 'Get hit by red',
          de: 'Von Rot treffen lassen',
          fr: 'Faites-vous toucher par le rouge',
          cn: '去吃火',
          ko: '빨간색 맞기',
        },
        blue: {
          en: 'Get hit by blue',
          de: 'Von Blau treffen lassen',
          fr: 'Faites-vous toucher par le bleu',
          cn: '去吃冰',
          ko: '파란색 맞기',
        },
      },
    },
    // Copy/paste from normal, seems to be the same
    {
      id: 'P1S Powerful Light/Fire',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '893', capture: true }),
      alertText: (_data, matches, _output) => {
        if (matches.count === '14C')
          return _output.light!();
        return _output.fire!();
      },
      outputStrings: {
        fire: {
          en: 'Stand on fire',
          de: 'Auf der Feuerfläche stehen',
          fr: 'Placez-vous sur le feu',
          cn: '站在火',
          ko: '빨간색 바닥 위에 서기',
        },
        light: {
          en: 'Stand on light',
          de: 'Auf der Lichtfläche stehen',
          fr: 'Placez-vous sur la lumière',
          cn: '站在光',
          ko: '흰색 바닥 위에 서기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Erichthonios': 'Erichthonios',
      },
      'replaceText': {
        'Aetherchain': 'Berstende Ketten',
        'Aetherial Shackles': 'Fluchesketten',
        'Chain Pain': 'Verfluchte Vollstreckung',
        'First Element': 'Erstes Element',
        'Fourfold Shackles': 'Vierfache Fluchesketten',
        'Gaoler\'s Flail(?! [IO])': 'Eiserne Zucht',
        'Gaoler\'s Flail In': 'Eiserne Zucht Rein',
        'Gaoler\'s Flail Out': 'Eiserne Zucht Raus',
        'Heavy Hand': 'Marter',
        'Inevitable Flame': 'Aspektiertes Feuer',
        'Inevitable Light': 'Aspektiertes Licht',
        'Intemperance': 'Zehrende Elemente',
        'Lethe': 'Schloss und Riegel',
        'Pitiless Flail of Grace': 'Heilige Zucht und Ordnung',
        'Pitiless Flail of Purgation': 'Feurige Zucht und Ordnung',
        'Powerful Fire': 'Entladenes Feuer',
        'Powerful Light': 'Entladenes Licht',
        'Second Element': 'Zweites Element',
        'Shackles of Time': 'Aspektierende Ketten',
        'Shining Cells': 'Ätherzwinger',
        'Slam Shut': 'Freigang',
        'Third Element': 'Drittes Element',
        'True Flare': 'Vollkommenes Flare',
        'True Holy': 'Vollkommenes Sanctus',
        'Warder\'s Wrath': 'Kettenmagie',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Erichthonios': 'Érichthonios',
      },
      'replaceText': {
        'Aetherchain': 'Chaînes explosives',
        '(?<!/)Aetherial Shackles': 'Chaîne de malédiction',
        'Chain Pain': 'Exécution maudite',
        'First Element': 'Premier élément',
        'Fourfold Shackles': 'Chaîne de malédiction quadruple',
        'Gaoler\'s Flail(?! [IO])': 'Chaîne punitive',
        'Gaoler\'s Flail In/Out': 'Chaîne intérieur/extérieur',
        'Gaoler\'s Flail Out/In': 'Chaîne extérieur/intérieur',
        'Heavy Hand': 'Chaîne de supplice',
        'Inevitable Flame/Inevitable Light': 'Explosion à retardement',
        'Intemperance': 'Corrosion élémentaire',
        'Lethe': 'Descente aux limbes',
        'Pitiless Flail of Grace(?!/)': 'Chaîne transperçante sacrée',
        'Pitiless Flail of Grace/Pitiless Flail of Purgation': 'Chaîne sacrée/infernale',
        'Powerful Fire/Powerful Light': 'Explosion infernale/sacrée',
        'Second Element': 'Deuxième élément',
        'Shackles of Time(?!/)': 'Chaîne à retardement',
        'Shackles of Time/Aetherial Shackles': 'Chaîne à retardement/malédiction',
        'Shining Cells': 'Geôle limbique',
        'Slam Shut': 'Occlusion terminale',
        'Third Element': 'Troisième élément',
        'True Flare/True Holy': 'Brasier/Miracle véritable',
        'Warder\'s Wrath': 'Chaînes torrentielles',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Erichthonios': 'エリクトニオス',
      },
      'replaceText': {
        'Aetherchain': '爆鎖',
        'Aetherial Shackles': '結呪の魔鎖',
        'Chain Pain': '結呪執行',
        'Fourfold Shackles': '結呪の四連魔鎖',
        'Gaoler\'s Flail': '懲罰撃',
        'Heavy Hand': '痛撃',
        'Inevitable Flame': '時限炎爆',
        'Inevitable Light': '時限光爆',
        'Intemperance': '氷火の侵食',
        'Lethe': '辺獄送り',
        'Pitiless Flail of Grace': '懲罰連撃・聖',
        'Pitiless Flail of Purgation': '懲罰連撃・炎',
        'Powerful Fire': '炎爆',
        'Powerful Light': '光爆',
        'Shackles of Time': '時限の魔鎖',
        'Shining Cells': '光炎監獄',
        'Slam Shut': '監獄閉塞',
        'True Flare': 'トゥルー・フレア',
        'True Holy': 'トゥルー・ホーリー',
        'Warder\'s Wrath': '魔鎖乱流',
      },
    },
  ],
};

export default triggerSet;
