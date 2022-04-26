import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  decOffset?: number;
}

// TODO
const firstDecimalMarker = 0;

// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
const getHeadmarkerId = (data: Data, matches: NetMatches['HeadMarker']) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 00DA.
  // (This makes the offset 0, and !0 is true.)
  if (typeof data.decOffset === 'undefined')
    data.decOffset = parseInt(matches.id, 16) - firstDecimalMarker;
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};
// TODO remove this when used.
console.assert(getHeadmarkerId);

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.DragonsongsRepriseUltimate,
  timelineFile: 'dragonsongs_reprise_ultimate.txt',
  triggers: [],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Empty Dimension/Full Dimension': 'Empty/Full Dimension',
      },
    },
    {
      'locale': 'de',
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
