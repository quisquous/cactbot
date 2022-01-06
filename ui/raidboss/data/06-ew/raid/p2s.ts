import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Callout cardinal for Spoken Cataract
// TODO: Debuff collect for Marks and callouts for those without debuff
// TODO: Add cardinal to Channeling Flow

export interface Data extends RaidbossData {
  flareTarget?: string;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheSecondCircleSavage,
  timelineFile: 'p2s.txt',
  triggers: [
    {
      id: 'P2S Murky Depths',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6833', source: 'Hippokampos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6833', source: 'Hippokampos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6833', source: 'Hippokampos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6833', source: 'ヒッポカムポス', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P2S Doubled Impact',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6832', source: 'Hippokampos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6832', source: 'Hippokampos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6832', source: 'Hippokampos' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6832', source: 'ヒッポカムポス' }),
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'P2S Sewage Deluge',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6810', source: 'Hippokampos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6810', source: 'Hippokampos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6810', source: 'Hippokampos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6810', source: 'ヒッポカムポス', capture: false }),
      response: Responses.bigAoe(),
    },
    {
      id: 'P2S Spoken Cataract',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6817', '6811', '6812', '6813'], source: 'Hippokampos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['6817', '6811', '6812', '6813'], source: 'Hippokampos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['6817', '6811', '6812', '6813'], source: 'Hippokampos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['6817', '6811', '6812', '6813'], source: 'ヒッポカムポス', capture: false }),
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.directions!(),
      outputStrings: {
        directions: {
          en: 'Back of head',
        },
      },
    },
    {
      id: 'P2S Winged Cataract',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6814', '6815', '6818', '6816'], source: 'Hippokampos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['6814', '6815', '6818', '6816'], source: 'Hippokampos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['6814', '6815', '6818', '6816'], source: 'Hippokampos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['6814', '6815', '6818', '6816'], source: 'ヒッポカムポス', capture: false }),
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.directions!(),
      outputStrings: {
        directions: {
          en: 'Front of head',
        },
      },
    },
    {
      id: 'P2S Ominous Bubbling',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '682B', source: 'Hippokampos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '682B', source: 'Hippokampos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '682B', source: 'Hippokampos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '682B', source: 'ヒッポカムポス', capture: false }),
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.groups!(),
      outputStrings: {
        groups: {
          en: 'Healer Groups',
          de: 'Heiler-Gruppen',
          fr: 'Healers en groupes',
          ja: 'ヒラに頭割り',
          cn: '治疗分摊组',
          ko: '힐러 그룹 쉐어',
        },
      },
    },
    {
      id: 'P2S Mark of the Tides',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'AD0' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, matches, output) => output.awayFromGroup!(),
      outputStrings: {
        awayFromGroup: Outputs.awayFromGroup,
      },
    },
    {
      id: 'P2S Mark of the Depths',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'AD1' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, matches, output) => output.stackOnYou!(),
      outputStrings: {
        stackOnYou: Outputs.stackOnYou,
      },
    },
    {
      id: 'P2S Channeling Flow',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['AD2', 'AD3', 'AD4', 'AD5'] }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, matches, output) => {
        const t = parseFloat(matches.duration);
        if (t < 15)
          return output.shortTide!();
        return output.longTide!();
      },
      outputStrings: {
        shortTide: {
          en: 'Short Tide',
        },
        longTide: {
          en: 'Long Tide',
        },
      },
    },
    {
      // Aoe from head outside the arena
      id: 'P2S Dissociation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '682C', source: 'Hippokampos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '682C', source: 'Hippokampos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '682C', source: 'Hippokampos' }),
      netRegexJa: NetRegexes.startsUsing({ id: '682C', source: 'ヒッポカムポス' }),
      alertText: (_data, matches, output) => {
        const xCoord = parseFloat(matches.x);
        if (xCoord < 100)
          return output.w!();
        if (xCoord > 100)
          return output.e!();
      },
      outputStrings: {
        e: Outputs.east,
        w: Outputs.west,
      },
    },
    {
      // Spread aoe marker on some players, not all
      id: 'P2S Tainted Flood',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6838', source: 'Hippokampos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6838', source: 'Hippokampos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6838', source: 'Hippokampos' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6838', source: 'ヒッポカムポス' }),
      condition: (data, matches) => matches.target === data.me,
      response: Responses.spread(),
    },
    {
      id: 'P2S Coherence Flare',
      type: 'Tether',
      // Whoever has tether when cast of 681B ends will be flared
      netRegex: NetRegexes.tether({ id: '0054', source: 'Hippokampos' }),
      netRegexDe: NetRegexes.tether({ id: '0054', source: 'Hippokampos' }),
      netRegexFr: NetRegexes.tether({ id: '0054', source: 'Hippokampos' }),
      netRegexJa: NetRegexes.tether({ id: '0054', source: 'ヒッポカムポス' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      run: (data, matches) => data.flareTarget = matches.target,
      outputStrings: {
        text: {
          en: 'Flare Tether',
        },
      },
    },
    {
      id: 'P2S Coherence Stack',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '681B', source: 'Hippokampos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '681B', source: 'Hippokampos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '681B', source: 'Hippokampos' }),
      netRegexJa: NetRegexes.startsUsing({ id: '681B', source: 'ヒッポカムポス' }),
      condition: (data) => data.flareTarget !== data.me,
      // 12 second cast, delay for tether to settle
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 6,
      alertText: (data, _matches, output) => {
        if ( data.role === 'tank' )
          return output.flareLineTank!();
        return output.flareLineStack!();
      },
      outputStrings: {
        flareLineStack: {
          en: 'Line Stack (behind tank)',
        },
        flareLineTank: {
          en: 'Line Stack (be in front)',
        },
      },
    },
    {
      // Raidwide knockback -> dont get knocked into slurry
      id: 'P2S Shockwave',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '682F', source: 'Hippokampos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '682F', source: 'Hippokampos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '682F', source: 'Hippokampos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '682F', source: 'ヒッポカムポス', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'P2S Kampeos Harma Marker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00E[56789ABC]' }),
      condition: Conditions.targetIsYou(),
      response: (_data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          square: {
            en: '#${num} Square',
            de: '#${num} Viereck',
            fr: '#${num} Carré',
            ja: '#${num} 四角',
            cn: '#${num} 四角',
            ko: '#${num} 짝수',
          },
          triangle: {
            en: '#${num} Triangle',
            de: '#${num} Dreieck',
            fr: '#${num} Triangle',
            ja: '#${num} 三角',
            cn: '#${num} 三角',
            ko: '#${num} 홀수',
          },
        };

        const id = matches.id;
        if (!id)
          return;

        let num = parseInt(id, 16);
        const isTriangle = num >= 233;
        num -= 228;
        if (isTriangle)
          num -= 4;

        // Odd numbers have to run to the other side, so make this louder.
        // TODO: should this be alarm/alert instead of alert/info?
        const isOdd = num % 2;
        const text = isTriangle ? output.triangle!({ num: num }) : output.square!({ num: num });
        return { [isOdd ? 'alertText' : 'infoText']: text };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Hippokampos': 'Hippokampos',
      },
      'replaceText': {
        '\\(knockback\\)': '(Rückstoß)',
        'Coherence Flare': 'Kohärenz Flare',
        'Coherence Line': 'Kohärenz Linie',
        'Doubled Impact': 'Doppeleinschlag',
        'Murky Depths': 'Trübe Tiefen',
        'Predatory Sight': 'Mal der Beute',
        'Sewage Deluge': 'Abwasserflut',
        'Sewage Eruption': 'Abwassereruption',
        'Shockwave': 'Schockwelle',
        'Tainted Flood': 'Verseuchte Flut',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Hippokampos': 'hippokampos',
      },
      'replaceText': {
        'Dissociation': 'Dissociation',
        'Doubled Impact': 'Double impact',
        'Murky Depths': 'Tréfonds troubles',
        'Predatory Sight': 'Marque de la proie',
        'Sewage Deluge': 'Déluge d\'eaux usées',
        'Sewage Eruption': 'Éruption d\'eaux usées',
        'Shockwave': 'Onde de choc',
        'Tainted Flood': 'Inondation infâme',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Hippokampos': 'ヒッポカムポス',
      },
      'replaceText': {
        'Dissociation': 'ディソシエーション',
        'Doubled Impact': 'ダブルインパクト',
        'Murky Depths': 'マーキーディープ',
        'Predatory Sight': '生餌の刻印',
        'Sewage Deluge': 'スウェッジデリージュ',
        'Sewage Eruption': 'スウェッジエラプション',
        'Shockwave': 'ショックウェーブ',
        'Tainted Flood': 'テインテッドフラッド',
      },
    },
  ],
};

export default triggerSet;
