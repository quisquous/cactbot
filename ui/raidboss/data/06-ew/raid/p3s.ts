import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  deathsToll?: boolean;
  deathsTollPending?: boolean;
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
          ja: '黒い炎の位置に散開',
          cn: '暗炎站位',
          ko: '불꽃 산개 위치로',
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
          ja: 'タンク線取り',
          cn: '坦克截线',
          ko: '탱커 선 가로채기',
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
          ja: '中央 → 小玉・ぐるぐる',
          cn: '中间集合, 九连环',
          ko: '가운데 → 작은 구슬, 시바 장판',
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
          ja: '中央 → 大玉・離れる',
          cn: '中间集合, 然后远离',
          ko: '가운데 → 큰 구슬, 밖으로',
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
          ja: '横側安置：散開',
          cn: '两侧 + 分散',
          ko: '바깥쪽에서 산개',
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
          ja: '中央直線安置：二人組で頭割り',
          cn: '中间 两人分摊',
          ko: '가운데서 짝꿍끼리 산개'
        },
      },
    },
    {
      id: 'P3S Bright Fire Marker and Fledgling Flights',
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
          '006B': data.deathsToll ? output.west!() : output.east!(),
          '006C': data.deathsToll ? output.east!() : output.west!(),
          '006D': data.deathsToll ? output.north!() : output.south!(),
          '006E': data.deathsToll ? output.south!() : output.north!(),
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
        east: Outputs.east,
        west: Outputs.west,
        south: Outputs.south,
        north: Outputs.north,
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
          ja: '中央 → 小玉・ぐるぐる',
          cn: '中间集合, 九连环',
          ko: '가운데 → 작은 구슬, 시바 장판',
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
          ja: '中央 → 大玉・離れる',
          cn: '中间集合, 然后远离',
          ko: '가운데 → 큰 구슬, 밖으로',
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
          ja: 'あとで頭割り',
          cn: '然后分摊',
          ko: '그 다음 쉐어',
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
          ja: 'あとで散開',
          cn: '然后分散',
          ko: '그 다음 산개',
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
          ja: '散開 => 鳥の線',
          cn: '散开 => 鸟连线',
          ko: '산개 → 새의 줄',
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
          ja: '頭割り',
          cn: '分摊',
          ko: '쉐어',
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
          ja: '散開',
          cn: '分散',
          ko: '산개',
        },
      },
    },
    {
      id: 'P3S Death\'s Toll Number',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['ACA'], capture: true }),
      // Force this to only run once without Conditions.targetIsYou()
      // in case user is dead but needs to place fledgling flight properly
      preRun: (data) => data.deathsToll = true,
      // Delay callout until Ashen Eye start's casting
      delaySeconds: 15.5,
      infoText: (data, matches, output) => {
        if (matches.target === data.me && !data.deathsTollPending) {
          data.deathsTollPending = true;
          return {
            '01': output.outCardinals!(),
            '02': output.outIntercards!(),
            '04': output.middle!(),
          }[matches.count];
        }
      },
      outputStrings: {
        middle: Outputs.middle,
        outIntercards: {
          en: 'Intercards + Out',
          fr: 'Intercadinal + Extérieur',
          ja: '斜め + 外側',
          ko: '비스듬히 + 바깥쪽',
        },
        outCardinals: {
          en: 'Out + Cardinals',
          fr: 'Extérieur + Cardinal',
          ja: '外側 + 十字',
          ko: '바깥쪽 + 십자로',
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
      'replaceSync': {
        'Darkblaze Twister': 'Schwarzlohensturm',
        'Fountain of Fire': 'Quell des Feuers',
        'Phoinix': 'Phoinix',
        'Sparkfledged': 'Saat des Phoinix',
        'Sunbird': 'Spross des Phoinix',
      },
      'replaceText': {
        '--fire expands--': '--Feuer breitet sich aus--',
        '--giant fireplume\\?--': '--riesige Feuerfieder?--',
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
        'Fireglide Sweep': 'Gleitjagd',
        'Firestorms of Asphodelos': 'Asphodeischer Feuersturm',
        'Flames of Asphodelos': 'Asphodeisches Feuer',
        'Flames of Undeath': 'Totenflamme',
        'Flare of Condemnation': 'Limbische Flamme',
        'Fledgling Flight': 'Flüggewerden',
        'Fountain of Death': 'Quell des Todes',
        'Fountain of Fire': 'Quell des Feuers',
        '(?<!\\w )Gloryplume': 'Prachtfieder',
        'Great Whirlwind': 'Windhose',
        'Heat of Condemnation': 'Limbisches Lodern',
        'Joint Pyre': 'Gemeinschaft des Feuers',
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
      'replaceSync': {
        'Darkblaze Twister': 'Tourbillon enflammé des Limbes',
        'Fountain of Fire': 'Flamme de la vie',
        'Phoinix': 'protophénix',
        'Sparkfledged': 'oiselet de feu',
        'Sunbird': 'oiselet étincelant',
      },
      'replaceText': {
        '--fire expands--': '--élargissement du feu--',
        '--giant fireplume\\?--': '--immolation de feu géant ?--',
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
        'Fireglide Sweep': 'Plongeons en chaîne',
        'Firestorms of Asphodelos': 'Volcan des Limbes',
        'Flames of Asphodelos': 'Flamme des Limbes',
        'Flames of Undeath': 'Feu réincarné',
        'Flare of Condemnation/Sparks of Condemnation': 'Souffle/Artifice infernal',
        'Fledgling Flight': 'Nuée ailée',
        'Fountain of Death': 'Onde de la vie',
        'Fountain of Fire': 'Flamme de la vie',
        '(?<!\\w )Gloryplume': 'Feu des profondeurs',
        'Great Whirlwind': 'Grand tourbillon',
        'Heat of Condemnation': 'Bourrasque infernale',
        'Joint Pyre': 'Combustion résonnante',
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
        'Sunbird': '陽炎鳥',
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
        'Fireglide Sweep': '連続強襲滑空',
        'Firestorms of Asphodelos': '辺獄の炎嵐',
        'Flames of Asphodelos': '辺獄の炎',
        'Flames of Undeath': '反魂の炎',
        'Flare of Condemnation': '獄炎の火撃',
        'Fledgling Flight': '群鳥飛翔',
        'Fountain of Death': '霊泉の波動',
        'Fountain of Fire': '霊泉の炎',
        '(?<!\\w )Gloryplume': '炎闇劫火',
        'Great Whirlwind': '大旋風',
        'Heat of Condemnation': '獄炎の炎撃',
        'Joint Pyre': '共燃',
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
