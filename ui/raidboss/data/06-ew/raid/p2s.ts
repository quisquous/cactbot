import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Callout cardinal for Spoken Cataract
// TODO: Debuff collect for Marks and callouts for those without debuff
// TODO: Add cardinal to Channeling Flow
// TODO: Fix headmarker ids for Kampeos Harma Callouts

export interface Data extends RaidbossData {
  flareTarget?: string;
  decOffset?: number;
}

// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
// The first 1B marker in the encounter is an Doubled Impact (0103).
const firstHeadmarker = parseInt('0103', 16);
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
  zoneId: ZoneId.AsphodelosTheSecondCircleSavage,
  timelineFile: 'p2s.txt',
  triggers: [
    {
      id: 'P2S Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => getHeadmarkerId(data, matches),
    },
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
          de: 'Zur Rückseite des Kopfes',
          fr: 'Derrière la tête',
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
          de: 'Zur Vorderseite des Kopfes',
          fr: 'Devant la tête',
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
          fr: 'Groupes sur les heals',
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
        // Effect durations are 13 seconds (short) and 28 seconds (long)
        if (t < 15)
          return output.arrowFirst!();
        return output.spreadFirst!();
      },
      outputStrings: {
        arrowFirst: {
          en: 'Arrow First',
          de: 'Pfeil zuerst',
          fr: 'Flèches en premières',
        },
        spreadFirst: {
          en: 'Spread First',
          de: 'Verteilen zuerst',
          fr: 'Dispersez-vous en premier',
        },
      },
    },
    {
      // Aoe from head outside the arena
      id: 'P2S Dissociation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '682E', source: 'Hippokampos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '682E', source: 'Hippokampos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '682E', source: 'Hippokampos' }),
      netRegexJa: NetRegexes.startsUsing({ id: '682E', source: 'ヒッポカムポス' }),
      alertText: (_data, matches, output) => {
        const xCoord = parseFloat(matches.x);
        if (xCoord > 100)
          return output.w!();
        if (xCoord < 100)
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
          de: 'Flare Verbindung',
          fr: 'Lien Brasier',
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
        if (data.role === 'tank')
          return output.flareLineTank!();
        return output.flareLineStack!();
      },
      outputStrings: {
        flareLineStack: {
          en: 'Line Stack (behind tank)',
          de: 'Linien-Sammeln (hinter dem Tank)',
          fr: 'Package en ligne (derrière le tank)',
        },
        flareLineTank: {
          en: 'Line Stack (be in front)',
          de: 'Linien-Sammeln (vorne sein)',
          fr: 'Package en ligne (Placez-vous devant)',
        },
      },
    },
    {
      // Raidwide knockback -> dont get knocked into slurry
      id: 'P2S Shockwave',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '682F', source: 'Hippokampos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '682F', source: 'Hippokampos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '682F', source: 'Hippokampos' }),
      netRegexJa: NetRegexes.startsUsing({ id: '682F', source: 'ヒッポカムポス' }),
      // 7.7 cast time, delay for proper arm's length
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 5,
      response: Responses.knockback(),
    },
    {
      id: 'P2S Kampeos Harma Marker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: Conditions.targetIsYou(),
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          squareAcross: {
            en: '#${num} Square, go across',
            de: '#${num} Viereck, geh gegenüber',
            fr: '#${num} Carré, allez à l\'opposé',
          },
          // Trying not to confuse with boss/across
          squareBoss: {
            en: '#${num} Square, boss tile',
            de: '#${num} Viereck, Boss Fläche',
            fr: '#${num} Carré, case du boss',
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

        const id = getHeadmarkerId(data, matches);
        if (!id)
          return;
        const harmaMarkers = [
          '0091',
          '0092',
          '0093',
          '0094',
          '0095',
          '0096',
          '0097',
          '0098',
        ];

        if (!harmaMarkers.includes(id))
          return;

        let num = parseInt(id);
        const isTriangle = num >= 95;
        num -= 90;
        if (isTriangle)
          num -= 4;

        // 1/3 have to run to the other side, so make this louder.
        const isOdd = num % 2;
        if (isTriangle)
          return { ['infoText']: output.triangle!({ num: num }) };
        else if (isOdd)
          return { ['alarmText']: output.squareAcross!({ num: num }) };
        return { ['alertText']: output.squareBoss!({ num: num }) };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Spoken Cataract/Winged Cataract': 'Spoken/Winged Cataract',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Hippokampos': 'Hippokampos',
      },
      'replaceText': {
        '\\(knockback\\)': '(Rückstoß)',
        '\\(short\\)': '(Kurz)',
        '\\(long\\)': '(Lang)',
        'Channeling Flow': 'Kanalschnellen',
        'Channeling Overflow': 'Kanalfluten',
        'Coherence(?! [FL])': 'Kohärenz',
        'Coherence Flare': 'Kohärenz Flare',
        'Coherence Line': 'Kohärenz Linie',
        'Crash': 'Impakt',
        'Deadly Current': 'Tödliche Strömung',
        'Dissociation(?! Dive)': 'Dissoziation',
        'Dissociation Dive': 'Dissoziation Sturzflug',
        'Doubled Impact': 'Doppeleinschlag',
        'Great Typhoon': 'Große Welle',
        'Hard Water': 'Reißendes Wasser',
        'Kampeos Harma': 'Kampeos Harma',
        'Murky Depths': 'Trübe Tiefen',
        'Ominous Bubbling(?! Groups)': 'Kopfwasser',
        'Ominous Bubbling Groups': 'Kopfwasser Gruppen',
        'Predatory Avarice': 'Massenmal',
        'Predatory Sight': 'Mal der Beute',
        'Sewage Deluge': 'Abwasserflut',
        'Sewage Eruption': 'Abwassereruption',
        'Shockwave': 'Schockwelle',
        'Spoken Cataract': 'Gehauchter Katarakt',
        'Tainted Flood': 'Verseuchte Flut',
        'Winged Cataract': 'Beschwingter Katarakt',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Hippokampos': 'hippokampos',
      },
      'replaceText': {
        '\\(long\\)': '(long)',
        '\\(knockback\\)': '(poussée)',
        '\\(short\\)': '(court)',
        'Channeling Flow': 'Courant canalisant',
        'Channeling Overflow': 'Déversement canalisant',
        'Coherence(?! [FL])': 'Cohérence',
        'Coherence Flare': 'Cohérence Brasier',
        'Coherence Line': 'Cohérence en ligne',
        'Crash': 'Collision',
        'Deadly Current': 'Torrent mortel',
        'Dissociation(?! Dive)': 'Dissociation',
        'Dissociation Dive': 'Dissociation et plongeon',
        'Doubled Impact': 'Double impact',
        'Great Typhoon': 'Flots tumultueux',
        'Hard Water': 'Oppression aqueuse',
        'Kampeos Harma': 'Kampeos harma',
        'Murky Depths': 'Tréfonds troubles',
        'Ominous Bubbling(?! Groups)': 'Hydro-agression',
        'Ominous Bubbling Groups': 'Hydro-agression en groupes',
        'Predatory Avarice': 'Double marque',
        'Predatory Sight': 'Marque de la proie',
        'Sewage Deluge': 'Déluge d\'eaux usées',
        'Sewage Eruption': 'Éruption d\'eaux usées',
        'Shockwave': 'Onde de choc',
        'Spoken Cataract/Winged Cataract': 'Souffle/Aile et cataracte',
        'Tainted Flood': 'Inondation infâme',
        'Winged Cataract/Spoken Cataract': 'Aile/Souffle et cataracte',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Hippokampos': 'ヒッポカムポス',
      },
      'replaceText': {
        'Channeling Flow': 'チャネリングフロウ',
        'Channeling Overflow': 'チャネリングオーバーフロウ',
        'Coherence(?! [FL])': 'コヒーレンス',
        'Crash': '衝突',
        'Deadly Current': '激流衝',
        'Dissociation': 'ディソシエーション',
        'Doubled Impact': 'ダブルインパクト',
        'Great Typhoon': '荒波',
        'Hard Water': '重水塊',
        'Kampeos Harma': 'カンペオスハルマ',
        'Murky Depths': 'マーキーディープ',
        'Ominous Bubbling': '霊水弾',
        'Predatory Avarice': '多重刻印',
        'Predatory Sight': '生餌の刻印',
        'Sewage Deluge': 'スウェッジデリージュ',
        'Sewage Eruption': 'スウェッジエラプション',
        'Shockwave': 'ショックウェーブ',
        'Spoken Cataract': 'ブレス＆カタラクティス',
        'Tainted Flood': 'テインテッドフラッド',
        'Winged Cataract': 'ウィング＆カタラクティス',
      },
    },
  ],
};

export default triggerSet;
