'use strict';

// O6S - Sigmascape 2.0 Savage
// localization:
//   de: timeline done, triggers incomplete
//   fr: timeline done, triggers incomplete
//   ja: timeline done, triggers incomplete
[{
  zoneRegex: /Sigmascape V2\.0 \(Savage\)/,
  timelineFile: 'o6s.txt',
  triggers: [
    {
      id: 'O6S Demonic Shear',
      regex: / 14:2829:Demon Chadarnook starts using Demonic Shear on (\y{Name})/,
      regexDe: / 14:2829:Gefallener Chadarnook starts using Dämonische Schere on (\y{Name})/,
      regexFr: / 14:2829:Démon Chadarnouk starts using Cisailles Démoniaques on (\y{Name})/,
      regexJa: / 14:2829:チャダルヌーク・デーモン starts using デモニックシアー on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tank Buster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Buster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur '+data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'tenkbasta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      id: 'O6S Storms Grip',
      regex: /Added new combatant The Storm's Grip/,
      regexDe: /Added new combatant Sturmgebiet/,
      regexFr: /Added new combatant Zone De Tempête/,
      regexJa: /Added new combatant 暴風域/,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Hallowed Wind Stack',
        de: 'Heiliger Boden Wind',
        fr: 'Packez vous dans le vent',
      },
    },
    {
      id: 'O6S Demonic Stone',
      regex: /1B:........:(\y{Name}):....:....:0001:0000:0000:0000:/,
      alarmText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Demonic Stone on YOU',
            de: 'Dämonischer Stein auf DIR',
            fr: 'Pierre démoniaque sur VOUS',
          };
        }
      },
    },
    {
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      run: function(data, matches) {
        data.lastKiss = matches[1];
      },
    },
    {
      id: 'O6S Last Kiss Marker',
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Last Kiss on YOU',
        de: 'Letzter Kuss auf DIR',
        fr: 'Baiser fatal sur VOUS',
      },
      tts: {
        en: 'last kiss',
        de: 'letz ter kuss',
        fr: 'baiser fatal',
      },
    },
    {
      id: 'O6S Last Kiss',
      regex: /1A:(\y{Name}) gains the effect of Last Kiss/,
      regexDe: /1A:(\y{Name}) gains the effect of Letzter Kuss/,
      regexFr: /1A:(\y{Name}) gains the effect of Baiser Fatal/,
      regexJa: /1A:(\y{Name}) gains the effect of 死の口づけ/,
      condition: function(data, matches) {
        // The person who gets the marker briefly gets the effect, so
        // don't tell them twice.
        return data.me == matches[1] && data.lastKiss != data.me;
      },
      alarmText: {
        en: 'Last Kiss on YOU',
        de: 'Letzter Kuss auf DIR',
        fr: 'Baiser fatal sur VOUS',
      },
      tts: {
        en: 'last kiss',
        de: 'letz ter kuss',
        fr: 'baiser fatal',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Demon Chadarnook': 'Gefallener Chadarnook',
        'Easterly': 'Ostwind',
        'Goddess Chadarnook': 'Heilige Chadarnook',
        'Haunt': 'Böser Schatten',
        'Portrayal of Fire': 'Feuergemälde',
        'Portrayal of Wind': 'Windgemälde',
        'Portrayal of Earth': 'Erdgemälde',
        'Portrayal of Water': 'Wassergemälde',
        'The Storm\'s Grip': 'Sturmgebiet',
        'I have claimed the girl in the picture!': 'Das Mädchen in diesem Bildnis gehört mir!',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Engage!': 'Start!',
        'Enrage': 'Finalangriff',

        'Demonic Howl': 'Dämonisches Heulen',
        'Demonic Pain': 'Dämonischer Schmerz',
        'Demonic Shear': 'Dämonische Schere',
        'Demonic Spout': 'Dämonischer Überschwang',
        'Demonic Stone': 'Dämonischer Stein',
        'Demonic Storm': 'Dämonischer Sturm',
        'Demonic Typhoon': 'Dämonischer Taifun',
        'Demonic Wave': 'Dämonische Welle',
        'Divine Lure': 'Göttliche Verlockung',
        'Downpour': 'Flutschwall',
        'Dull Pain': 'Dumpfer Schmerz',
        'Earthquake': 'Erdbeben',
        'Easterlies': 'Ostwinde',
        'Engage!': 'Start!',
        'Featherlance': 'Federlanze',
        'Flash Fire': 'Blitzfeuer',
        'Flash Gale': 'Blitzwind',
        'Flash Torrent': 'Blitzregen',
        'Last Kiss': 'Todeskuss',
        'Lullaby': 'Wiegenlied',
        'Materialize': 'Materialisierung',
        'Poltergeist': 'Poltergeist',
        'Possession': 'Besessenheit',
        'Release': 'Befreiung',
        'Rock Hard': 'Felsspalter',
        'Song Of Bravery': 'Lied Der Tapferkeit',
        'The Price': 'Tödliche Versuchung',
        'Flash Flood': 'Blitzregen',
      },
      '~effectNames': {
        'Apathetic': 'Apathie',
        'Black Paint': 'Schwarze Farbe',
        'Blue Paint': 'Blaue Farbe',
        'Fire Resistance Up': 'Feuerresistenz +',
        'Invisible': 'Unsichtbar',
        'Knockback Penalty': 'Rückstoß Unwirksam',
        'Last Kiss': 'Letzter Kuss',
        'Red Paint': 'Rote Farbe',
        'Seduced': 'Versuchung',
        'Slippery Prey': 'Unmarkierbar',
        'Yellow Paint': 'Gelbe Farbe',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Demon Chadarnook': 'Démon Chadarnouk',
        'Easterly': 'Rafale Ultime',
        'Goddess Chadarnook': 'Déesse Chadarnouk',
        'Haunt': 'Ombre Maléfique',
        'Portrayal of Fire': 'Peinture Du Feu',
        'Portrayal of Wind': 'Peinture Du Vent',
        'Portrayal of Earth': 'Peinture De La Terre',
        'Portrayal of Water': 'Peinture De L\'eau',
        'The Storm\'s Grip': 'Emprise De La Tempête',
        'I have claimed the girl in the picture!': 'Héhéhé... La fille du tableau m\'appartient',
        'Engage!': 'À l\'attaque',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Enrage': 'Enrage',
        'Demonic Howl': 'Hurlement Démoniaque',
        'Demonic Pain': 'Douleur Démoniaque',
        'Demonic Shear': 'Cisailles Démoniaques',
        'Demonic Spout': 'Jaillissement Démoniaque',
        'Demonic Stone': 'Pierre Démoniaque',
        'Demonic Storm': 'Tempête Démoniaque',
        'Demonic Typhoon': 'Typhon Démoniaque',
        'Demonic Wave': 'Vague Démoniaque',
        'Divine Lure': 'Séduction Divine',
        'Downpour': 'Déluge',
        'Dull Pain': 'Douleur Sourde',
        'Earthquake': 'Grand Séisme',
        'Engage!': 'À l\'attaque',
        'Featherlance': 'Lance De Plume',
        'Flash Fire': 'Flammes Subites',
        'Flash Gale': 'Vent Subit',
        'Flash Torrent': 'Pluie Subite',
        'Last Kiss': 'Baiser Fatal',
        'Lullaby': 'Berceuse',
        'Materialize': 'Matérialisation',
        'Poltergeist': 'Esprit Frappeur',
        'Possession': 'Possession',
        'Release': 'Libération',
        'Rock Hard': 'Brise-roc',
        'Song Of Bravery': 'Chant Du Courage',
        'The Price': 'Tentation Mortelle',
        'Flash Flood': 'Pluie Subite',
        'Easterlies': 'Rafale Ultime',
      },
      '~effectNames': {
        'Apathetic': 'Apathie',
        'Black Paint': 'Peinture Noire',
        'Blue Paint': 'Peinture Bleue',
        'Fire Resistance Up': 'Résistance Au Feu Accrue',
        'Invisible': 'Invisible',
        'Knockback Penalty': 'Résistance Aux Projections/attractions',
        'Last Kiss': 'Baiser Fatal',
        'Red Paint': 'Peinture Rouge',
        'Seduced': 'Séduction',
        'Slippery Prey': 'Marquage Impossible',
        'Yellow Paint': 'Peinture Jaune',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Demon Chadarnook': 'チャダルヌーク・デーモン',
        'Easterly': '極風',
        'Goddess Chadarnook': 'チャダルヌーク・ゴッデス',
        'Haunt': '悪霊の影',
        'Portrayal Of Fire': '火の絵画',
        'Portrayal Of Wind': '風の絵画',
        'Portrayal of Earth': '土の絵画',
        'Portrayal of Water': '水の絵画',
        'The Storm\'s Grip': '暴風域',
        'I have claimed the girl in the picture!': 'グフフフ……この絵の女は',
      },
      'replaceText': {
        'Demonic Howl': 'デモニックハウル',
        'Demonic Pain': 'デモニックペイン',
        'Demonic Shear': 'デモニックシアー',
        'Demonic Spout': 'デモニックスパウト',
        'Demonic Stone': 'デモニックストーン',
        'Demonic Storm': 'デモニックストーム',
        'Demonic Typhoon': 'デモニックタイフーン',
        'Demonic Wave': 'デモニックウェーブ',
        'Divine Lure': '女神の誘惑',
        'Downpour': '水責め',
        'Dull Pain': 'ダルペイン',
        'Earthquake': '大地震',
        'Easterlies': '極風',
        'Engage!': '戦闘開始！',
        'Featherlance': 'フェザーランス',
        'Flash Fire': 'フラッシュファイア',
        'Flash Gale': 'フラッシュウィンド',
        'Flash Torrent': 'フラッシュレイン',
        'Last Kiss': '死の口づけ',
        'Lullaby': '子守歌',
        'Materialize': '実体化',
        'Poltergeist': 'ポルターガイスト',
        'Possession': '絵画憑依',
        'Release': '憑依解除',
        'Rock Hard': 'ロッククラッシャー',
        'Song Of Bravery': '勇気の歌',
        'The Price': '死の誘い',
      },
      '~effectNames': {
        'Apathetic': '無気力',
        'Black Paint': '黒色の絵の具',
        'Blue Paint': '水色の絵の具',
        'Fire Resistance Up': '火属性耐性向上',
        'Invisible': 'インビジブル',
        'Knockback Penalty': 'ノックバック無効',
        'Last Kiss': '死の口づけ',
        'Red Paint': '赤色の絵の具',
        'Seduced': '誘惑',
        'Slippery Prey': 'マーキング対象外',
        'Yellow Paint': '黄色の絵の具',
      },
    },
  ],
}];
