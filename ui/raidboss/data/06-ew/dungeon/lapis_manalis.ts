import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const albionWildBeastMapEffectFlag = '00020001';
const albionWildBeastMapEffectLocations: { [idx: string]: string[] } = {
  '21': ['west', 'north'],
  '22': ['west', 'middlenorth'],
  '23': ['west', 'middlesouth'],
  '24': ['west', 'south'],
  '25': ['east', 'north'],
  '26': ['east', 'middlenorth'],
  '27': ['east', 'middlesouth'],
  '28': ['east', 'south'],
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.LapisManalis,
  timelineFile: 'lapis_manalis.txt',
  timelineTriggers: [
    {
      id: 'Lapis Manalis Cagnazzo Tsunami',
      regex: /Tsunami/,
      beforeSeconds: 5,
      response: Responses.bigAoe(),
    },
  ],
  triggers: [
    // ---------------- first trash ----------------
    {
      id: 'Lapis Manalis Albus Griffin Winds of Winter',
      type: 'StartsUsing',
      netRegex: { id: '8011', source: 'Albus Griffin', capture: false },
      response: Responses.aoe(),
    },
    // ---------------- Albion ----------------
    {
      id: 'Lapis Albion Wild Beasts',
      type: 'MapEffect',
      netRegex: {
        flags: albionWildBeastMapEffectFlag,
        location: Object.keys(albionWildBeastMapEffectLocations),
      },
      durationSeconds: 8,
      infoText: (_data, matches, output) => {
        const beasts = albionWildBeastMapEffectLocations[matches.location];
        if (beasts === undefined || beasts[0] === undefined || beasts[1] === undefined)
          return output.text!({ dir: output.unknown!(), row: output.unknown!() });
        return output.text!({
          dir: output[beasts[0]]!(),
          row: output[beasts[1]]!(),
        });
      },
      outputStrings: {
        east: Outputs.east,
        west: Outputs.west,
        north: Outputs.north,
        south: Outputs.south,
        unknown: Outputs.unknown,
        middlenorth: {
          en: 'Middle-North',
          de: 'Norden-Mittig',
          fr: 'Milieu-Nord',
          ko: '중앙-북쪽',
        },
        middlesouth: {
          en: 'Middle-South',
          de: 'Süden-Mittig',
          fr: 'Milieu-Sud',
          ko: '중앙-남쪽',
        },
        text: {
          en: 'Stampede from ${dir} (${row} Row)',
          de: 'Stampede von ${dir} (${row} Row)',
          fr: 'Ruée depuis ${dir} (${row})',
          ko: '${dir}에서 돌진 (${row} 줄)',
        },
      },
    },
    {
      id: 'Lapis Manalis Albion Albion\'s Embrace',
      type: 'StartsUsing',
      netRegex: { id: '7A85', source: 'Albion' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Lapis Manalis Albion Right Slam',
      type: 'StartsUsing',
      netRegex: { id: '802D', source: 'Albion', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'Lapis Manalis Albion Left Slam',
      type: 'StartsUsing',
      netRegex: { id: '802E', source: 'Albion', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'Lapis Manalis Albion Icebreaker',
      type: 'StartsUsing',
      netRegex: { source: 'Albion', id: '7A81', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from tethered rock',
          de: 'Weg vom verbundenen Felsen',
          ko: '선 연결된 돌 피하기',
        },
      },
    },
    {
      id: 'Lapis Manalis Albion Icy Throes',
      type: 'StartsUsing',
      netRegex: { id: '7A83', source: 'Albion' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Lapis Manalis Albion Roar of Albion',
      type: 'StartsUsing',
      netRegex: { id: '7A84', source: 'Albion', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Hide Behind Boulder',
          de: 'Hinter Felsen verstecken',
          fr: 'Cachez-vous derrière le rocher',
          ja: 'ボルダーの後ろに',
          cn: '躲在石头后',
          ko: '돌 뒤에 숨기',
        },
      },
    },
    // ---------------- Galatea Magna ----------------
    {
      id: 'Lapis Manalis Galatea Magna Waxing Cycle',
      type: 'StartsUsing',
      netRegex: { id: '7A91', source: 'Galatea Magna', capture: false },
      response: Responses.getOutThenIn(),
    },
    {
      id: 'Lapis Manalis Galatea Magna Waning Cycle',
      type: 'StartsUsing',
      netRegex: { id: '7F6E', source: 'Galatea Magna', capture: false },
      response: Responses.getInThenOut(),
    },
    {
      id: 'Lapis Manalis Galatea Magna Soul Nebula',
      type: 'StartsUsing',
      netRegex: { id: '7A9E', source: 'Galatea Magna', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Lapis Manalis Galatea Magna Doom',
      // D24 = Doom
      type: 'GainsEffect',
      netRegex: { effectId: 'D24', source: 'Galatea Magna' },
      condition: (data) => data.CanCleanse(),
      alertText: (data, matches, output) =>
        output.text!({ player: data.ShortName(matches.target) }),
      outputStrings: {
        text: {
          en: 'Esuna ${player}',
          de: 'Medica ${player}',
          fr: 'Guérison sur ${player}',
          ja: '${player} にエスナ',
          cn: '驱散: ${player}',
          ko: '${player} 에스나',
        },
      },
    },
    {
      id: 'Lapis Manalis Galatea Magna Glassy-eyed',
      // DB7 = Glassy-eyed
      type: 'GainsEffect',
      netRegex: { effectId: 'DB7', source: 'Galatea Magna' },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      suppressSeconds: 1,
      response: Responses.lookAway(),
    },
    {
      id: 'Lapis Manalis Galatea Magna Tenebrism',
      type: 'Ability',
      netRegex: { id: '7A96', source: 'Galatea Magna', capture: false },
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get towers',
          de: 'Türme nehmen',
          fr: 'Prenez les tours',
          ja: '塔へ',
          cn: '踩塔',
          ko: '기둥 들어가기',
        },
      },
    },
    {
      id: 'Lapis Manalis Galatea Magna Dark Harvest',
      type: 'StartsUsing',
      netRegex: { id: '7A9F', source: 'Galatea Magna' },
      response: Responses.tankBuster(),
    },
    // ---------------- Cagnazzo ----------------
    {
      id: 'Lapis Manalis Cagnazzo Stygian Deluge',
      type: 'StartsUsing',
      netRegex: { id: '79A3', source: 'Cagnazzo', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Lapis Manalis Cagnazzo Body Slam',
      // immune to knockback resist
      type: 'StartsUsing',
      netRegex: { id: '7992', source: 'Cagnazzo' },
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 5,
      response: Responses.knockback(),
    },
    {
      id: 'Lapis Manalis Cagnazzo Hydrofall',
      type: 'StartsUsing',
      netRegex: { id: '7A90', source: 'Cagnazzo' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Lapis Manalis Cagnazzo Neap Tide',
      // D01 = Neap Tide, source from environment
      type: 'GainsEffect',
      netRegex: { effectId: 'D01' },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 5,
      response: Responses.spread(),
    },
    {
      id: 'Lapis Manalis Cagnazzo Spring Tide',
      // D00 = Spring Tide, source from environment
      type: 'GainsEffect',
      netRegex: { effectId: 'D00' },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 5,
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Lapis Manalis Cagnazzo Voidcleaver',
      type: 'StartsUsing',
      netRegex: { id: '7986', source: 'Cagnazzo', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Lapis Manalis Cagnazzo Void Torrent',
      type: 'StartsUsing',
      netRegex: { id: '798E', source: 'Cagnazzo' },
      response: Responses.tankCleave(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Left Slam/Right Slam': 'Left/Right Slam',
        'Waxing Cycle/Waning Cycle': 'Waxing/Waning Cycle',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Albion': 'Albion',
        'Albus Griffin': 'Albus-Greif',
        'Cagnazzo': 'Cagnazzo',
        'Deepspine': 'Erdseim-Dornen',
        'Galatea Magna': 'Galatea Magna',
        'No more games!': 'a',
        'The Forum Messorum': 'Forum Messorem',
        'The Silvan Throne': 'Thron der Schneebestie',
      },
      'replaceText': {
        'Albion\'s Embrace': 'Albions Umarmung',
        'Antediluvian': 'Vorsintflutlich',
        'Body Slam': 'Bodenwelle',
        'Burst': 'Explosion',
        'Call of the Mountain': 'Ruf des Berges',
        'Cursed Tide': 'Fluch der Fluten',
        'Dark Harvest': 'Dunkle Ernte',
        'Hydraulic Ram': 'Hydroramme',
        'Hydrofall': 'Hydro-Sturz',
        'Hydrovent': 'Hydrovent',
        'Icebreaker': 'Eisbrecher',
        'Icy Throes': 'Eisige Agonie',
        'Knock on Ice': 'Eisklopfer',
        'Left Slam': 'Linker Arm von Albion',
        'Lifescleaver': 'Lebensschlitzer',
        'Neap Tide': 'Nipptide',
        'No more games!': 'Das ist euer Untergang!',
        'Right Slam': 'Rechter Arm von Albion',
        'Roar of Albion': 'Albion-Brüllen',
        'Scarecrow Chase': 'Bewegung & Kreuz',
        'Soul Nebula': 'Seelennebel',
        'Soul Scythe': 'Seelensense',
        'Spring Tide': 'Springtide',
        'Stony Gaze': 'Magisches Steinauge',
        'Stygian Deluge': 'Stygische Sintflut',
        'Tenebrism': 'Tenebrismus',
        'Tsunami': 'Tsunami',
        'Void Miasma': 'Nichtsfäule',
        'Void Torrent': 'Nichtshagel',
        'Voidcleaver': 'Nichtsschlitzer',
        'Waning Cycle': 'Kreis & Explosion',
        'Waxing Cycle': 'Explosion & Kreis',
        'Wildlife Crossing': 'Wilde Tiere',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Albion': 'Albion',
        'Albus Griffin': 'griffon de l\'Albus',
        'Cagnazzo': 'Cagnazzo',
        'Deepspine': 'Épines céruléennes',
        'Galatea Magna': 'Galatea Magna',
        'The Forum Messorum': 'Forum Messorem',
        'The Silvan Throne': 'Trône de la Bête des neiges',
      },
      'replaceText': {
        'Albion\'s Embrace': 'Étreinte d\'Albion',
        'Antediluvian': 'Antédiluvienne',
        'Body Slam': 'Charge physique',
        'Burst': 'Explosion',
        'Call of the Mountain': 'Appel bestial',
        'Cursed Tide': 'Maléfice submersif',
        'Dark Harvest': 'Sombre récolte',
        'Hydraulic Ram': 'Hydrotambourinage',
        'Hydrofall': 'Pilonnage hydrique',
        'Hydrovent': 'Hydro-exutoire',
        'Icebreaker': 'Briseur de glace',
        'Icy Throes': 'Jeté de glace',
        'Knock on Ice': 'Toucher de la glace',
        'Left Slam': 'Claque gauche d\'Albion',
        'Lifescleaver': 'Couperet vital',
        'Neap Tide': 'Mortes-eaux submersives',
        'No more games!': 'Vous voulez voir quand je m\'énerve!?',
        'Right Slam': 'Claque droite d\'Albion',
        'Roar of Albion': 'Rugissement d\'Albion',
        'Scarecrow Chase': 'Mouvement et croix',
        'Soul Nebula': 'Nébuleuse animique',
        'Soul Scythe': 'Faux animique',
        'Spring Tide': 'Vives-eaux submersives',
        'Stony Gaze': 'Œil pétrifiant maudit',
        'Stygian Deluge': 'Déluge stygien',
        'Tenebrism': 'Ténébrisme',
        'Tsunami': 'Raz-de-marée',
        'Void Miasma': 'Miasmes du néant',
        'Void Torrent': 'Torrent du néant',
        'Voidcleaver': 'Couperet du néant',
        'Waning Cycle': 'Cercle et explosion',
        'Waxing Cycle': 'Explosion et cercle',
        'Wildlife Crossing': 'Traversée',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Albion': 'アルビオン',
        'Albus Griffin': 'アルバス・グリフィン',
        'Cagnazzo': 'カイナッツォ',
        'Deepspine': '青炎の棘',
        'Galatea Magna': 'ガラテア・マグナ',
        'The Forum Messorum': 'フォルム・メッソルム',
        'The Silvan Throne': '雪獣の帝座',
      },
      'replaceText': {
        'Albion\'s Embrace': 'アルビオンハグ',
        'Antediluvian': 'アンテディルヴィアン',
        'Body Slam': 'ボディスラム',
        'Burst': '爆発',
        'Call of the Mountain': 'ビーストコール',
        'Cursed Tide': '水禍の呪い',
        'Dark Harvest': 'ダークハーベスト',
        'Hydraulic Ram': 'ハイドロラミング',
        'Hydrofall': 'ハイドロフォール',
        'Hydrovent': 'ハイドロベント',
        'Icebreaker': 'アイスブレイカー',
        'Icy Throes': 'アイススロー',
        'Knock on Ice': 'ノックオンアイス',
        'Left Slam': 'レフト・アルビオンスラム',
        'Lifescleaver': 'ライフクリーバー',
        'Neap Tide': '水禍の小潮',
        'No more games!': '俺様の本気を……くらいやがれェ！！',
        'Right Slam': 'ライト・アルビオンスラム',
        'Roar of Albion': 'アルビオンロア',
        'Scarecrow Chase': 'ムーブ＆クロス',
        'Soul Nebula': 'ソウルネビュラ',
        'Soul Scythe': 'ソウルサイズ',
        'Spring Tide': '水禍の大潮',
        'Stony Gaze': '呪いの石眼',
        'Stygian Deluge': 'スティギアンデリージュ',
        'Tenebrism': 'テネブリズム',
        'Tsunami': 'つなみ',
        'Void Miasma': 'ヴォイドの瘴気',
        'Void Torrent': 'ヴォイドトーレント',
        'Voidcleaver': 'ヴォイドクリーバー',
        'Waning Cycle': 'サークル＆バースト',
        'Waxing Cycle': 'バースト＆サークル',
        'Wildlife Crossing': '駆け抜け',
      },
    },
  ],
};

export default triggerSet;
