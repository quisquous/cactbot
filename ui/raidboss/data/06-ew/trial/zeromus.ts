import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: better positions for 8AFA Abyssal Echoes

// TODO: Dimensional Surge calls (maybe this shares with Extreme)
// Are there other patterns in normal mode???
//
// Dimensional Surge 8B35 tether middle west
// [16:31:35.624] 257 101:80034E7B:00200004:02:00:0000

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  id: 'TheAbyssalFracture',
  zoneId: ZoneId.TheAbyssalFracture,
  timelineFile: 'zeromus.txt',
  triggers: [
    {
      id: 'Zeromus Abyssal Nox',
      type: 'Ability',
      netRegex: { id: '8AF7', source: 'Zeromus', capture: false },
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Heal to full',
          de: 'Voll heilen',
        },
      },
    },
    {
      id: 'Zeromus Abyssal Echoes',
      type: 'Ability',
      netRegex: { id: '8AF9', source: 'Zeromus', capture: false },
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from glowing circles',
          de: 'Weg von den leuchtenden Kreisen',
        },
      },
    },
    {
      id: 'Zeromus Sable Thread',
      type: 'Ability',
      netRegex: { id: '8AEF', source: 'Zeromus' },
      alertText: (data, matches, output) => {
        return output.lineStackOn!({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        lineStackOn: {
          en: '5x line stack on ${player}',
          de: '5x in einer Linie Sammeln auf ${player}',
        },
      },
    },
    {
      id: 'Zeromus Visceral Whirl NE Safe',
      type: 'StartsUsing',
      netRegex: { id: '8AFB', capture: false },
      infoText: (_data, _matches, output) => {
        return output.text!({ dir1: output.ne!(), dir2: output.sw!() });
      },
      outputStrings: {
        text: {
          en: '${dir1} / ${dir2}',
          de: '${dir1} / ${dir2}',
        },
        ne: Outputs.northeast,
        sw: Outputs.southwest,
      },
    },
    {
      id: 'Zeromus Visceral Whirl NW Safe',
      type: 'StartsUsing',
      netRegex: { id: '8AFE', source: 'Zeromus', capture: false },
      infoText: (_data, _matches, output) => {
        return output.text!({ dir1: output.nw!(), dir2: output.se!() });
      },
      outputStrings: {
        text: {
          en: '${dir1} / ${dir2}',
          de: '${dir1} / ${dir2}',
        },
        nw: Outputs.northwest,
        se: Outputs.southeast,
      },
    },
    {
      id: 'Zeromus Dark Matter',
      type: 'HeadMarker',
      netRegex: { id: '016C' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Zeromus Nox',
      type: 'HeadMarker',
      netRegex: { id: '00C5' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Zeromus Fractured Eventide NE Safe',
      type: 'StartsUsing',
      netRegex: { id: '8AF3', source: 'Zeromus', capture: false },
      alertText: (_data, _matches, output) => output.ne!(),
      outputStrings: {
        ne: Outputs.northeast,
      },
    },
    {
      id: 'Zeromus Fractured Eventide NW Safe',
      type: 'StartsUsing',
      netRegex: { id: '8AF4', source: 'Zeromus', capture: false },
      alertText: (_data, _matches, output) => output.nw!(),
      outputStrings: {
        nw: Outputs.northwest,
      },
    },
    {
      id: 'Zeromus Flare',
      type: 'StartsUsing',
      netRegex: { id: '8B12', source: 'Zeromus', capture: false },
      alertText: (_data, _matches, output) => output.tower!(),
      outputStrings: {
        tower: {
          en: 'Stand in Tower',
          de: 'Steh im Turm',
        },
      },
    },
    {
      id: 'Zeromus Flare Hit',
      type: 'Ability',
      netRegex: { id: '8B12', source: 'Zeromus', capture: false },
      suppressSeconds: 5,
      response: Responses.getOut('info'),
    },
    {
      id: 'Zeromus Big Bang',
      type: 'StartsUsing',
      netRegex: { id: '8B03', source: 'Zeromus', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Zeromus Acceleration Bomb',
      type: 'GainsEffect',
      netRegex: { effectId: 'A61' },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      response: Responses.stopEverything(),
    },
    {
      id: 'Zeromus The Dark Divides',
      type: 'HeadMarker',
      netRegex: { id: '0178' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Zeromus The Dark Beckons',
      type: 'HeadMarker',
      netRegex: { id: '0064' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Zeromus Big Crunch',
      type: 'StartsUsing',
      netRegex: { id: '8B04', source: 'Zeromus', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Zeromus Nostalgia',
      type: 'StartsUsing',
      netRegex: { id: '8B1A', source: 'Zeromus', capture: false },
      response: Responses.bigAoe(),
    },
    {
      id: 'Zeromus Akh Rhai',
      type: 'HeadMarker',
      netRegex: { id: '0017' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Spread + Stay Out',
          de: 'Verteilen + Draußen stehen',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Comet': 'Komet',
        'Zeromus': 'Zeromus',
      },
      'replaceText': {
        '\\(cast\\)': '(Wirken)',
        '\\(proximity\\)': '(Distanz',
        'Abyssal Echoes': 'Abyssal-Echos',
        'Abyssal Nox': 'Abyssal-Nox',
        'Big Bang': 'Großer Knall',
        'Big Crunch': 'Großer Quetscher',
        'Black Hole': 'Schwarzes Loch',
        'Bury': 'Impakt',
        'Chasmic Nails': 'Abyssal-Nagel',
        'Dark Matter': 'Dunkelmaterie',
        'Dimensional Surge': 'Dimensionsschwall',
        'Explosion': 'Explosion',
        'Flare': 'Flare',
        'Flow of the Abyss': 'Abyssaler Strom',
        'Fractured Eventide': 'Abendglut',
        'Meteor Impact': 'Meteoreinschlag',
        'Nostalgia': 'Heimweh',
        '(?<! )Nox': 'Nox',
        'Primal Roar': 'Lautes Gebrüll',
        'Prominence Spine': 'Ossale Protuberanz',
        'Rend the Rift': 'Dimensionsstörung',
        '(?<! )Roar': 'Brüllen',
        'Sable Thread': 'Pechschwarzer Pfad',
        'The Dark Beckons': 'Fressende Finsternis: Last',
        'The Dark Divides': 'Fressende Finsternis: Zerschmetterung',
        'Visceral Whirl': 'Viszerale Schürfwunden',
        'Void Bio': 'Nichts-Bio',
        'Void Meteor': 'Nichts-Meteo',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Comet': 'comète',
        'Zeromus': 'Zeromus',
      },
      'replaceText': {
        'Abyssal Echoes': 'Écho abyssal',
        'Abyssal Nox': 'Nox abyssal',
        'Big Bang': 'Big bang',
        'Big Crunch': 'Big crunch',
        'Black Hole': 'Trou noir',
        'Bury': 'Impact',
        'Chasmic Nails': 'Clous abyssaux',
        'Dark Matter': 'Matière sombre',
        'Dimensional Surge': 'Déferlante dimensionnelle',
        'Explosion': 'Explosion',
        'Flare': 'Brasier',
        'Flow of the Abyss': 'Flot abyssal',
        'Fractured Eventide': 'Éclat crépusculaire',
        'Meteor Impact': 'Impact de météore',
        'Nostalgia': 'Nostalgie',
        '(?<! )Nox': 'Nox',
        'Primal Roar': 'Rugissement furieux',
        'Prominence Spine': 'Évidence ossuaire',
        'Rend the Rift': 'Déchirure dimensionnelle',
        '(?<! )Roar': 'Rugissement',
        'Sable Thread': 'Rayon sombre',
        'The Dark Beckons': 'Ténèbres rongeuses : Gravité',
        'The Dark Divides': 'Ténèbres rongeuses : Pulvérisation',
        'Visceral Whirl': 'Écorchure viscérale',
        'Void Bio': 'Bactéries du néant',
        'Void Meteor': 'Météores du néant',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Comet': 'コメット',
        'Zeromus': 'ゼロムス',
      },
      'replaceText': {
        'Abyssal Echoes': 'アビサルエコー',
        'Abyssal Nox': 'アビサルノックス',
        'Big Bang': 'ビッグバーン',
        'Big Crunch': 'ビッグクランチ',
        'Black Hole': 'ブラックホール',
        'Bury': '衝撃',
        'Chasmic Nails': 'アビサルネイル',
        'Dark Matter': 'ダークマター',
        'Dimensional Surge': 'ディメンションサージ',
        'Explosion': '爆発',
        'Flare': 'フレア',
        'Flow of the Abyss': 'アビサルフロウ',
        'Fractured Eventide': '黒竜閃',
        'Meteor Impact': 'メテオインパクト',
        'Nostalgia': '望郷',
        '(?<! )Nox': 'ノックス',
        'Primal Roar': '大咆哮',
        'Prominence Spine': 'プロミネンススパイン',
        'Rend the Rift': '次元干渉',
        '(?<! )Roar': '咆哮',
        'Sable Thread': '漆黒の熱線',
        'The Dark Beckons': '闇の侵食：重',
        'The Dark Divides': '闇の侵食：砕',
        'Visceral Whirl': 'ヴィセラルワール',
        'Void Bio': 'ヴォイド・バイオ',
        'Void Meteor': 'ヴォイド・メテオ',
      },
    },
  ],
};

export default triggerSet;
