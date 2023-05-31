import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  id: 'AnabaseiosTheNinthCircle',
  zoneId: ZoneId.AnabaseiosTheNinthCircle,
  timelineFile: 'p9n.txt',
  triggers: [
    {
      id: 'P9N Gluttony\'s Augur',
      type: 'StartsUsing',
      netRegex: { id: '8116', source: 'Kokytos', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'P9N Global Spell',
      type: 'StartsUsing',
      netRegex: { id: '8141', source: 'Kokytos', capture: false },
      response: Responses.bleedAoe(),
    },
    {
      id: 'P9N Ascendant Fist',
      type: 'StartsUsing',
      netRegex: { id: '8131', source: 'Kokytos', capture: true },
      response: Responses.tankBuster(),
    },
    {
      id: 'P9N Pulverizing Pounce',
      type: 'HeadMarker',
      netRegex: { id: '00A1' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'P9N Fire III',
      type: 'HeadMarker',
      netRegex: { id: '01C5' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'P9N Charybdis',
      type: 'StartsUsing',
      netRegex: { id: '8133', source: 'Kokytos', capture: true },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Drop Puddles Outside',
          de: 'Flächen drausen ablegen',
          fr: 'Déposez les zones au sol à l\'extérieur',
          ja: '散開',
          cn: '散开',
          ko: '산개',
        },
      },
    },
    {
      id: 'P9N Archaic Rockbreaker',
      type: 'StartsUsing',
      netRegex: { id: '8128', source: 'Kokytos', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'P9N Beastly Roar',
      type: 'StartsUsing',
      netRegex: { id: '8138', source: 'Kokytos', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'P9N Archaic Demolish',
      type: 'StartsUsing',
      netRegex: { id: '812F', source: 'Kokytos', capture: false },
      alertText: (_data, _matches, output) => output.healerGroups!(),
      outputStrings: {
        healerGroups: Outputs.healerGroups,
      },
    },
    {
      id: 'P9N Front Combination + Inside Roundhouse',
      type: 'StartsUsing',
      netRegex: { id: '8148', source: 'Kokytos', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Behind and Under',
          de: 'Geh nach Hinten und Unter den Boss',
          fr: 'Allez derrière et sous le boss',
        },
      },
    },
    {
      id: 'P9N Rear Combination + Inside Roundhouse',
      type: 'StartsUsing',
      netRegex: { id: '814A', source: 'Kokytos', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go Front and Under',
          de: 'Geh nach Vorne und Unter den Boss',
        },
      },
    },
    {
      id: 'P9N Front Combination + Outside Roundhouse',
      type: 'StartsUsing',
      netRegex: { id: '8147', source: 'Kokytos', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Behind and Out',
          de: 'Geh nach Hinten und Raus',
          fr: 'Allez derrière et à l\'extérieur',
          ja: '後ろの外側へ',
          cn: '去背后远离',
          ko: '보스 뒤 바깥쪽으로',
        },
      },
    },
    {
      id: 'P9N Rear Combination + Outside Roundhouse',
      type: 'StartsUsing',
      netRegex: { id: '8149', source: 'Kokytos', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go Front and Out',
          de: 'Geh nach Vorne und Raus',
          fr: 'Allez devant et à l\'extérieur',
        },
      },
    },
    {
      id: 'P9N Ecliptic Meteor',
      type: 'StartsUsing',
      netRegex: { id: '813B', source: 'Kokytos', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Hide behind unbroken meteor',
          de: 'Hinter einem nicht zerbrochenen Meteor verstecken',
          fr: 'Cachez-vous derrière le météore intact',
          ja: '壊れていないメテオの後ろへ',
          cn: '躲在未破碎的陨石后',
          ko: '금이 안 간 돌 뒤에 숨기',
        },
      },
    },
    {
      id: 'P9N Burst',
      type: 'StartsUsing',
      netRegex: { id: '8136', source: 'Comet', capture: false },
      response: Responses.moveAway(),
    },
    {
      id: 'P9N Gluttonous Rampage',
      type: 'HeadMarker',
      netRegex: { id: '013A', capture: true },
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.tankbusterOnYouStretchTethers!();

        if (data.role === 'healer' || data.job === 'BLU')
          return output.tankbusterOn!({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        tankbusterOnYouStretchTethers: {
          en: 'Tankbuster on YOU -- stretch tether',
          de: 'Tankbuster auf DIR -- Verbindung strecken',
          fr: 'Tankbuster sur VOUS -- Étirez le lien',
        },
        tankbusterOn: {
          en: 'Tankbuster on ${player}',
          de: 'Tankbuster auf ${player}',
          fr: 'Tankbuster sur ${player}',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Front Combination/Rear Combination': 'Front/Rear Combination',
        'Inside Roundhouse/Outside Roundhouse': 'Inside/Outside Roundhouse',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Comet': 'Komet',
        'Fire Sphere': 'Feuersphäre',
        'Ice Sphere': 'Eissphäre',
        'Kokytos': 'Kokytos',
      },
      'replaceText': {
        '\\(Behemoth\\)': '(Behemot)',
        '\\(Fighter\\)': '(Kämpfer)',
        '\\(Mage\\)': '(Magier)',
        '\\(cast\\)': '(Ausführen)',
        '\\(resolve\\)': '(Auflösen)',
        'Archaic Demolish': 'Altes Demolieren',
        'Archaic Rockbreaker': 'Alte Erdspaltung',
        'Ascendant Fist': 'Steigende Faust',
        'Beastly Bile': 'Bestiengalle',
        'Beastly Roar': 'Bestialisches Brüllen',
        'Blizzard III': 'Eisga',
        'Burst': 'Zerschmetterung',
        'Charybdis': 'Charybdis',
        'Comet': 'Komet',
        'Disgorge': 'Seelenwende',
        'Dualspell': 'Doppelspruch',
        'Ecliptic Meteor': 'Ekliptik-Meteor',
        'Explosion': 'Explosion',
        'Fire III': 'Feuga',
        'Front Combination': 'Trittfolge vor',
        'Global Spell': 'Spruchsphäre',
        'Gluttonous Rampage': 'Fresswahn',
        'Gluttony\'s Augur': 'Omen der Fresssucht',
        'Iceflame Summoning': 'Beschwörung von Feuer und Eis',
        'Inside Roundhouse': 'Rundumtritt innen',
        'Outside Roundhouse': 'Rundumtritt außen',
        'Pulverizing Pounce': 'Schweres Schmettern',
        'Ravening': 'Seelenfresser',
        'Ravenous Bite': 'Mordshunger',
        'Rear Combination': 'Trittfolge zurück',
        'Shockwave': 'Schockwelle',
        'Sphere Shatter': 'Sphärensplitterung',
        'Swinging Kick': 'Schwungattacke',
        'Touchdown': 'Himmelssturz',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Comet': 'Comète',
        'Fire Sphere': 'Sphère de feu',
        'Ice Sphere': 'sphère gelée',
        'Kokytos': 'Kokytos',
      },
      'replaceText': {
        'Archaic Demolish': 'Démolition archaïque',
        'Archaic Rockbreaker': 'Briseur de rocs archaïque',
        'Ascendant Fist': 'Uppercut pénétrant',
        'Beastly Bile': 'Bile de bête',
        'Beastly Roar': 'Rugissement bestial',
        'Blizzard III': 'Méga Glace',
        'Burst': 'Éclatement',
        'Charybdis': 'Charybde',
        'Comet': 'Comète',
        'Disgorge': 'Renvoi d\'âme',
        'Dualspell': 'Double sort',
        'Ecliptic Meteor': 'Météore écliptique',
        'Explosion': 'Explosion',
        'Fire III': 'Méga Feu',
        'Front Combination': 'Coups de pied pivotants avant en série',
        'Global Spell': 'Sort englobant',
        'Gluttonous Rampage': 'Ravage glouton',
        'Gluttony\'s Augur': 'Augure de gloutonnerie',
        'Iceflame Summoning': 'Invocation de feu et de glace',
        'Inside Roundhouse': 'Coup de pied pivotant intérieur',
        'Outside Roundhouse': 'Coup de pied pivotant extérieur',
        'Pulverizing Pounce': 'Attaque subite violente',
        'Ravening': 'Dévoration d\'âme',
        'Ravenous Bite': 'Morsure vorace',
        'Rear Combination': 'Coups de pied pivotants arrière en série',
        'Shockwave': 'Onde de choc',
        'Sphere Shatter': 'Rupture glacée',
        'Swinging Kick': 'Demi-pivot',
        'Touchdown': 'Atterrissage',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Comet': 'コメット',
        'Fire Sphere': 'ファイアスフィア',
        'Ice Sphere': 'アイススフィア',
        'Kokytos': 'コキュートス',
      },
      'replaceText': {
        'Archaic Demolish': '古式破砕拳',
        'Archaic Rockbreaker': '古式地烈斬',
        'Ascendant Fist': '穿昇拳',
        'Beastly Bile': 'ビーストバイル',
        'Beastly Roar': 'ビーストロア',
        'Blizzard III': 'ブリザガ',
        'Burst': '飛散',
        'Charybdis': 'ミールストーム',
        'Comet': 'コメット',
        'Disgorge': 'ソウルリバース',
        'Dualspell': 'ダブルスペル',
        'Ecliptic Meteor': 'エクリプスメテオ',
        'Explosion': '爆発',
        'Fire III': 'ファイガ',
        'Front Combination': '前方連転脚',
        'Global Spell': 'スペルグローブ',
        'Gluttonous Rampage': 'グラットンランページ',
        'Gluttony\'s Augur': 'グラトニーズアーガー',
        'Iceflame Summoning': 'サモンファイア＆アイス',
        'Inside Roundhouse': '内転脚',
        'Outside Roundhouse': '外転脚',
        'Pulverizing Pounce': 'ヘビーパウンス',
        'Ravening': '魂喰らい',
        'Ravenous Bite': 'ラヴェナスバイト',
        'Rear Combination': '後方連転脚',
        'Shockwave': '衝撃波',
        'Sphere Shatter': '破裂',
        'Swinging Kick': '旋身撃',
        'Touchdown': 'タッチダウン',
      },
    },
  ],
};

export default triggerSet;
