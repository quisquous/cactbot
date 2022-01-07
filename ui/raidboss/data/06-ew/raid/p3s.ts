import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: 006[B-F] are probably fledgling headmarkers

export interface Data extends RaidbossData {
  decOffset?: number;
}

// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
// The first 1B marker in the encounter is the #1 Bright Fire marker (004F).
const firstHeadmarker = parseInt('004F', 16);
const getHeadmarkerId = (data: Data, matches: NetMatches['HeadMarker']) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 00DA.
  // (This makes the offset 0, and !0 is true.)
  if (typeof data.decOffset === 'undefined')
    data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheThirdCircleSavage,
  timelineFile: 'p3s.txt',
  triggers: [
    {
      id: 'P3S Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => getHeadmarkerId(data, matches),
    },
    {
      id: 'P3S Scorched Exaltation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6706', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6706', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6706', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6706', source: 'フェネクス', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P3S Darkened Fire',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66B9', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '66B9', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '66B9', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '66B9', source: 'フェネクス', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Fire Positions',
          de: 'Feuer-Positionen',
          fr: 'Positions feu',
          cn: '暗炎站位',
        },
      },
    },
    {
      id: 'P3S Heat of Condemnation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6700', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6700', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6700', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6700', source: 'フェネクス', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Tank Tethers',
          de: 'Tank-Verbindungen',
          fr: 'Liens Tank',
          cn: '坦克截线',
        },
      },
    },
    {
      id: 'P3S Experimental Fireplume Rotating Cast',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66C0', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '66C0', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '66C0', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '66C0', source: 'フェネクス', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Middle (then rotate)',
          de: 'Geh in die Mitte (und rotiere dann)',
          fr: 'Placez-vous au milieu (puis tournez)',
          cn: '中间集合, 九连环',
        },
      },
    },
    {
      id: 'P3S Experimental Fireplume Out Cast',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66BE', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '66BE', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '66BE', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '66BE', source: 'フェネクス', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Middle (then out)',
          de: 'Geh in die Mitte (und dann raus)',
          fr: 'Placez-vous au milieu (puis sortez)',
          cn: '中间集合, 然后远离',
        },
      },
    },
    {
      id: 'P3S Experimental Fireplume Out Marker',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '66BE', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '66BE', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '66BE', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '66BE', source: 'フェネクス', capture: false }),
      // goldfish brain needs an extra "get out" call
      response: Responses.getOut(),
    },
    {
      id: 'P3S Right Cinderwing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6702', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6702', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6702', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6702', source: 'フェネクス', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'P3S Left Cinderwing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6703', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6703', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6703', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6703', source: 'フェネクス', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'P3S Flare of Condemnation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66FB', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '66FB', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '66FB', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '66FB', source: 'フェネクス', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Sides + Spread',
          de: 'Seiten + Verteilen',
          fr: 'Côtés + Dispersez-vous',
          cn: '两侧 + 分散',
        },
      },
    },
    {
      id: 'P3S Spark of Condemnation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66FC', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '66FC', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '66FC', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '66FC', source: 'フェネクス', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Middle Pairs',
          de: 'Mittlere Paare',
          fr: 'Paires au milieu',
          cn: '中间 两人分摊',
        },
      },
    },
    {
      id: 'P3S Bright Fire Marker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: Conditions.targetIsYou(),
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        return {
          '004F': output.num1!(),
          '0050': output.num2!(),
          '0051': output.num3!(),
          '0052': output.num4!(),
          '0053': output.num5!(),
          '0054': output.num6!(),
          '0055': output.num7!(),
          '0056': output.num8!(),
        }[id];
      },
      outputStrings: {
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
        num5: Outputs.num5,
        num6: Outputs.num6,
        num7: Outputs.num7,
        num8: Outputs.num8,
      },
    },
    {
      id: 'P3S Dead Rebirth',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66E4', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '66E4', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '66E4', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '66E4', source: 'フェネクス', capture: false }),
      response: Responses.bigAoe(),
    },
    {
      id: 'P3S Experimental Gloryplume Rotate Cast',
      type: 'StartsUsing',
      // 66CA (self) -> 66CB (rotating) -> etc
      netRegex: NetRegexes.startsUsing({ id: '66CA', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '66CA', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '66CA', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '66CA', source: 'フェネクス', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Middle (then rotate)',
          de: 'Geh in die Mitte (und rotiere dann)',
          fr: 'Placez-vous au milieu (puis tournez)',
          cn: '中间集合, 九连环',
        },
      },
    },
    {
      id: 'P3S Experimental Gloryplume Out Cast',
      type: 'StartsUsing',
      // 66C6 (self) -> 66C7 (middle) -> etc
      netRegex: NetRegexes.startsUsing({ id: '66C6', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '66C6', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '66C6', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '66C6', source: 'フェネクス', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Middle (then out)',
          de: 'Geh in die Mitte (und dann raus)',
          fr: 'Placez-vous au milieu (puis sortez)',
          cn: '中间集合, 然后远离',
        },
      },
    },
    {
      id: 'P3S Experimental Gloryplume Out',
      type: 'Ability',
      // 66C6 (self) -> 66C7 (middle) -> etc
      netRegex: NetRegexes.ability({ id: '66C6', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '66C6', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '66C6', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '66C6', source: 'フェネクス', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'P3S Experimental Gloryplume Stack',
      type: 'Ability',
      // 66CA (self) -> 66CB (rotating) -> 66CC (instant) -> 66CD (stacks)
      // 66C6 (self) -> 66C7 (middle) -> 66CC (instant) -> 66CD (stacks)
      netRegex: NetRegexes.ability({ id: '66CC', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '66CC', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '66CC', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '66CC', source: 'フェネクス', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stacks After',
          de: 'Danach sammeln',
          fr: 'Packez-vous après',
          cn: '然后分摊',
        },
      },
    },
    {
      id: 'P3S Experimental Gloryplume Spread',
      type: 'Ability',
      // 66CA (self) -> 66CB (rotating) -> 66C8 (instant) -> 66C9 (spread)
      // 66C6 (self) -> 66C7 (middle) -> 66C8 (instant) -> 66C9 (spread)
      netRegex: NetRegexes.ability({ id: '66C8', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '66C8', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '66C8', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '66C8', source: 'フェネクス', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Spread After',
          de: 'Danach verteilen',
          fr: 'Dispersez-vous après',
          cn: '然后分散',
        },
      },
    },
    {
      id: 'P3S Sun\'s Pinion',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data, matches) => data.me === matches.target && getHeadmarkerId(data, matches) === '007A',
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Spread => Bird Tether',
          de: 'Verteilen => Vogel-Verbindungen',
          fr: 'Dispersez-vous => Liens oiseaux',
          cn: '散开 => 鸟连线',
        },
      },
    },
    {
      id: 'P3S Firestorms of Asphodelos',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66F0', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '66F0', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '66F0', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '66F0', source: 'フェネクス', capture: false }),
      response: Responses.bigAoe(),
    },
    {
      id: 'P3S Experimental Ashplume Stacks',
      type: 'Ability',
      // 66C2 cast -> 66C3 stacks damage
      netRegex: NetRegexes.ability({ id: '66C2', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '66C2', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '66C2', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '66C2', source: 'フェネクス', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stacks',
          de: 'Sammeln',
          fr: 'Packez-vous',
          cn: '分摊',
        },
      },
    },
    {
      id: 'P3S Experimental Ashplume Spread',
      type: 'Ability',
      // 66C4 cast -> 66C5 spread damage
      netRegex: NetRegexes.ability({ id: '66C4', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '66C4', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '66C4', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '66C4', source: 'フェネクス', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Spread',
          de: 'Verteilen',
          fr: 'Dispersez-vous',
          cn: '分散',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Left Cinderwing/Right Cinderwing': 'Left/Right Cinderwing',
        'Flare of Condemnation/Sparks of Condemnation': 'Flare/Sparks of Condemnation',
      },
    },
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Darkblaze Twister': 'Schwarzlohensturm',
        'Fountain of Fire': 'Quell des Feuers',
        'Phoinix': 'Phoinix',
        'Sparkfledged': 'Saat des Phoinix',
      },
      'replaceText': {
        '--fire expands--': '--Feuer breitet sich aus--',
        'Ashen Eye': 'Aschener Blick',
        '(?<!\\w )Ashplume': 'Aschenfieder',
        'Beacons of Asphodelos': 'Asphodeische Flamme',
        'Blazing Rain': 'Flammender Regen',
        'Brightened Fire': 'Lichte Lohe',
        'Burning Twister': 'Lohenwinde',
        'Dark Twister': 'Schwarze Winde',
        'Darkblaze Twister': 'Schwarzlohensturm',
        'Darkened Fire': 'Schwarze Lohe',
        'Dead Rebirth': 'Melaphoinix',
        'Death\'s Toll': 'Eid des Abschieds',
        'Devouring Brand': 'Kreuzbrand',
        'Experimental Ashplume': 'Experimentelle Aschenfieder',
        'Experimental Fireplume': 'Experimentelle Feuerfieder',
        'Experimental Gloryplume': 'Experimentelle Prachtfieder',
        'Final Exaltation': 'Ewige Asche',
        'Firestorms of Asphodelos': 'Asphodeischer Feuersturm',
        'Flames of Asphodelos': 'Asphodeisches Feuer',
        'Flames of Undeath': 'Totenflamme',
        'Flare of Condemnation': 'Limbische Flamme',
        'Fledgling Flight': 'Flüggewerden',
        'Fountain of Death': 'Quell des Todes',
        'Fountain of Fire': 'Quell des Feuers',
        '(?<!\\w )Gloryplume': 'Prachtfieder',
        'Heat of Condemnation': 'Limbisches Lodern',
        'Left Cinderwing': 'Linke Aschenschwinge',
        'Life\'s Agonies': 'Lohen des Lebens',
        'Right Cinderwing': 'Rechte Aschenschwinge',
        'Scorched Exaltation': 'Aschenlohe',
        'Searing Breeze': 'Sengender Hauch',
        'Sparks of Condemnation': 'Limbische Glut',
        '(?<!fire)Storms of Asphodelos': 'Asphodeischer Sturm',
        'Sun\'s Pinion': 'Schwelende Schwinge',
        'Trail of Condemnation': 'Limbischer Odem',
        'Winds of Asphodelos': 'Asphodeische Winde',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Darkblaze Twister': 'Tourbillon enflammé des Limbes',
        'Fountain of Fire': 'Flamme de la vie',
        'Phoinix': 'protophénix',
        'Sparkfledged': 'oiselet de feu',
      },
      'replaceText': {
        '--fire expands--': '--élargissement du feu--',
        'Ashen Eye': 'Œil sombre',
        '(?<!\\w )Ashplume': 'Immolation de feu ténébreux',
        'Beacons of Asphodelos': 'Feu des Limbes',
        'Blazing Rain': 'Pluie brûlante',
        'Brightened Fire': 'Flamme de lumière',
        'Burning Twister': 'Tourbillon enflammé',
        'Dark Twister': 'Tourbillon sombre',
        'Darkblaze Twister': 'Tourbillon enflammé des Limbes',
        'Darkened Fire': 'Flamme sombre',
        'Dead Rebirth': 'Phénix noir',
        'Death\'s Toll': 'Destin mortel',
        'Devouring Brand': 'Croix enflammée',
        'Experimental Ashplume': 'Synthèse de mana : immolation de feu ténébreux',
        'Experimental Fireplume': 'Synthèse de mana : immolation de feu',
        'Experimental Gloryplume': 'Synthèse de mana : feu des profondeurs',
        'Final Exaltation': 'Conflagration calcinante',
        'Firestorms of Asphodelos': 'Volcan des Limbes',
        'Flames of Asphodelos': 'Flamme des Limbes',
        'Flames of Undeath': 'Feu réincarné',
        'Flare of Condemnation/Sparks of Condemnation': 'Souffle/Artifice infernal',
        'Fledgling Flight': 'Nuée ailée',
        'Fountain of Death': 'Onde de la vie',
        'Fountain of Fire': 'Flamme de la vie',
        '(?<!\\w )Gloryplume': 'Feu des profondeurs',
        'Heat of Condemnation': 'Bourrasque infernale',
        'Left Cinderwing/Right Cinderwing': 'Incinération senestre/dextre',
        'Life\'s Agonies': 'Flamme de souffrance',
        'Scorched Exaltation': 'Flamme calcinante',
        'Searing Breeze': 'Jet incandescent',
        '(?<!fire)Storms of Asphodelos': 'Tempête des Limbes',
        'Sun\'s Pinion': 'Ailes étincelantes',
        'Trail of Condemnation': 'Embrasement infernal',
        'Winds of Asphodelos': 'Tempête des Limbes',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Darkblaze Twister': '辺獄の闇炎旋風',
        'Fountain of Fire': '霊泉の炎',
        'Phoinix': 'フェネクス',
        'Sparkfledged': '火霊鳥',
      },
      'replaceText': {
        'Ashen Eye': '闇の瞳',
        '(?<!\\w )Ashplume': '暗闇の劫火天焦',
        'Beacons of Asphodelos': '辺獄の火',
        'Blazing Rain': '炎の雨',
        'Brightened Fire': '光の炎',
        'Burning Twister': '炎旋風',
        'Dark Twister': '闇旋風',
        'Darkblaze Twister': '辺獄の闇炎旋風',
        'Darkened Fire': '闇の炎',
        'Dead Rebirth': '黒き不死鳥',
        'Death\'s Toll': '死の運命',
        'Devouring Brand': '十字走火',
        'Experimental Ashplume': '魔力錬成：暗闇の劫火天焦',
        'Experimental Fireplume': '魔力錬成：劫火天焦',
        'Experimental Gloryplume': '魔力錬成：炎闇劫火',
        'Final Exaltation': '灰燼の豪炎',
        'Firestorms of Asphodelos': '辺獄の炎嵐',
        'Flames of Asphodelos': '辺獄の炎',
        'Flames of Undeath': '反魂の炎',
        'Flare of Condemnation': '獄炎の火撃',
        'Fledgling Flight': '群鳥飛翔',
        'Fountain of Death': '霊泉の波動',
        'Fountain of Fire': '霊泉の炎',
        '(?<!\\w )Gloryplume': '炎闇劫火',
        'Heat of Condemnation': '獄炎の炎撃',
        'Left Cinderwing': '左翼焼却',
        'Life\'s Agonies': '生苦の炎',
        'Right Cinderwing': '右翼焼却',
        'Scorched Exaltation': '灰燼の炎',
        'Searing Breeze': '熱噴射',
        'Sparks of Condemnation': '獄炎の火花',
        '(?<!fire)Storms of Asphodelos': '辺獄の嵐',
        'Sun\'s Pinion': '陽炎の翼',
        'Trail of Condemnation': '獄炎の焔',
        'Winds of Asphodelos': '辺獄の風',
      },
    },
  ],
};

export default triggerSet;
