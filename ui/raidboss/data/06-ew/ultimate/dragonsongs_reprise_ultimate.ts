import NetRegexes from '../../../../../resources/netregexes';
import { UnreachableCode } from '../../../../../resources/not_reached';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

type Phase = 'doorboss' | 'thordan';

export interface Data extends RaidbossData {
  phase: Phase;
  decOffset?: number;
  seenEmptyDimension?: boolean;
}

// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
const headmarkers = {
  // vfx/lockon/eff/lockon6_t0t.avfx
  'hyperdimensionalSlash': '00EA',
  // vfx/lockon/eff/r1fz_firechain_01x.avfx through 04x
  'firechainCircle': '0119',
  'firechainTriangle': '011A',
  'firechainSquare': '011B',
  'firechainX': '011C',
  // vfx/lockon/eff/r1fz_skywl_s9x.avfx
  'skywardLeap': '014A',
} as const;

const firstMarker: { [phase in Phase]: string } = {
  'doorboss': headmarkers.hyperdimensionalSlash,
  'thordan': headmarkers.skywardLeap,
} as const;

const getHeadmarkerId = (data: Data, matches: NetMatches['HeadMarker'], firstDecimalMarker?: number) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 00DA.
  // (This makes the offset 0, and !0 is true.)
  if (data.decOffset === undefined) {
    // This must be set the first time this function is called in DSR Headmarker Tracker.
    if (firstDecimalMarker === undefined)
      throw new UnreachableCode();
    data.decOffset = parseInt(matches.id, 16) - firstDecimalMarker;
  }
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.DragonsongsRepriseUltimate,
  timelineFile: 'dragonsongs_reprise_ultimate.txt',
  initData: () => {
    return {
      phase: 'doorboss',
    };
  },
  triggers: [
    {
      id: 'DSR Phase Tracker',
      type: 'StartsUsing',
      // 62D4 = Holiest of Holy
      // 63C8 = Ascalon's Mercy Concealed
      netRegex: NetRegexes.startsUsing({ id: ['62D4', '63C8'], capture: true }),
      run: (data, matches) => {
        switch (matches.id) {
          case '62D4':
            data.phase = 'doorboss';
            break;
          case '63C8':
            data.phase = 'thordan';
            break;
        }
      },
    },
    {
      id: 'DSR Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => {
        const firstHeadmarker: number = parseInt(firstMarker[data.phase], 16);
        getHeadmarkerId(data, matches, firstHeadmarker);
      },
    },
    {
      id: 'DSR Holiest of Holy',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62D4', source: 'Ser Adelphel', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'DSR Holiest Hallowing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62D0', source: 'Ser Adelphel' }),
      response: Responses.interrupt(),
    },
    {
      id: 'DSR Empty Dimension',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DA', source: 'Ser Grinnaux', capture: false }),
      alertText: (data, _matches, output) => {
        return data.seenEmptyDimension ? output.in!() : output.inAndTether!();
      },
      run: (data) => data.seenEmptyDimension = true,
      outputStrings: {
        inAndTether: {
          en: 'In + Tank Tether',
        },
        in: Outputs.in,
      },
    },
    {
      id: 'DSR Full Dimension',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DB', source: 'Ser Grinnaux', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'DSR Faith Unmoving',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DC', source: 'Ser Grinnaux', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'DSR Hyperdimensional Slash Headmarker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'doorboss' && data.me === matches.target,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.hyperdimensionalSlash)
          return output.slashOnYou!();
      },
      outputStrings: {
        slashOnYou: {
          en: 'Slash on YOU',
        },
      },
    },
    {
      id: 'DSR Playstation Fire Chains',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'doorboss' && data.me === matches.target,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.firechainCircle)
          return output.circle!();
        if (id === headmarkers.firechainTriangle)
          return output.triangle!();
        if (id === headmarkers.firechainSquare)
          return output.square!();
        if (id === headmarkers.firechainX)
          return output.x!();
      },
      outputStrings: {
        circle: {
          en: 'Red Circle',
        },
        triangle: {
          en: 'Green Triangle',
        },
        square: {
          en: 'Purple Square',
        },
        x: {
          en: 'Blue X',
        },
      },
    },
    {
      id: 'DSR Ascalon\'s Mercy Concealed',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63C9', source: 'King Thordan', capture: false }),
      suppressSeconds: 5,
      response: Responses.moveAway(),
    },
    {
      id: 'DSR Skyward Leap',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'thordan' && data.me === matches.target,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.skywardLeap)
          return output.leapOnYou!();
      },
      outputStrings: {
        leapOnYou: {
          en: 'Leap on YOU',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Empty Dimension/Full Dimension': 'Empty/Full Dimension',
      },
    },
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Ser Adelphel': 'Adelphel',
        'Ser Charibert': 'Charibert',
        'Ser Grinnaux': 'Grinnaux',
        'Ser Zephirin': 'Zephirin',
      },
      'replaceText': {
        'Brightwing(?!ed)': 'Lichtschwinge',
        'Brightblade\'s Steel': 'Schimmernder Stahl',
        'Brightwinged Flight': 'Flug der Lichtschwingen',
        'Empty Dimension': 'Dimension der Leere',
        'Execution': 'Exekution',
        'Faith Unmoving': 'Fester Glaube',
        'Full Dimension': 'Dimension der Weite',
        'Heavensblaze': 'Himmlisches Lodern',
        'Heavensflame': 'Himmlische Flamme',
        'Holiest of Holy': 'Quell der Heiligkeit',
        'Holy Bladedance': 'Geweihter Schwerttanz',
        'Holy Shield Bash': 'Heiliger Schildschlag',
        'Hyperdimensional Slash': 'Hyperdimensionsschlag',
        'Planar Prison': 'Dimensionsfalle',
        'Pure of Heart': 'Reines Herz',
        'Spear of the Fury': 'Speer der Furie',
        'Skyblind': 'Lichtblind',
        'The Bull\'s Steel': 'Unbändiger Stahl',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Ser Adelphel': 'sire Adelphel',
        'Ser Charibert': 'sire Charibert',
        'Ser Grinnaux': 'sire Grinnaux',
        'Ser Zephirin': 'sire Zéphirin',
      },
      'replaceText': {
        'Brightwing(?!ed)': 'Aile lumineuse',
        'Brightblade\'s Steel': 'Résolution radiante',
        'Brightwinged Flight': 'Vol céleste',
        'Empty Dimension': 'Vide dimensionnel',
        'Execution': 'Exécution',
        'Faith Unmoving': 'Foi immuable',
        'Full Dimension': 'Plénitude dimensionnelle',
        'Heavensblaze': 'Embrasement céleste',
        'Heavensflame': 'Flamme céleste',
        'Holiest of Holy': 'Saint des saints',
        'Holy Bladedance': 'Danse de la lame céleste',
        'Holy Shield Bash': 'Coup de bouclier saint',
        'Hyperdimensional Slash': 'Lacération hyperdimensionnelle',
        'Planar Prison': 'Prison dimensionnelle',
        'Pure of Heart': 'Pureté du cœur',
        'Spear of the Fury': 'Lance de la Conquérante',
        'Skyblind': 'Sceau céleste',
        'The Bull\'s Steel': 'Résolution rueuse',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Ser Adelphel': '聖騎士アデルフェル',
        'Ser Charibert': '聖騎士シャリベル',
        'Ser Grinnaux': '聖騎士グリノー',
        'Ser Zephirin': '聖騎士ゼフィラン',
      },
      'replaceText': {
        'Brightwing(?!ed)': '光翼閃',
        'Brightblade\'s Steel': '美剣の覚悟',
        'Brightwinged Flight': '蒼天の光翼',
        'Empty Dimension': 'エンプティディメンション',
        'Execution': 'エクスキューション',
        'Faith Unmoving': 'フェイスアンムーブ',
        'Full Dimension': 'フルディメンション',
        'Heavensblaze': 'ヘヴンブレイズ',
        'Heavensflame': 'ヘヴンフレイム',
        'Holiest of Holy': 'ホリエストホーリー',
        'Holy Bladedance': 'ホーリーブレードダンス',
        'Holy Shield Bash': 'ホーリーシールドバッシュ',
        'Hyperdimensional Slash': 'ハイパーディメンション',
        'Planar Prison': 'ディメンションジェイル',
        'Pure of Heart': 'ピュア・オブ・ハート',
        'Spear of the Fury': 'スピア・オブ・ハルオーネ',
        'Skyblind': '蒼天の刻印',
        'The Bull\'s Steel': '戦狂の覚悟',
      },
    },
  ],
};

export default triggerSet;
