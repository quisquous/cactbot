'use strict';

[{
  zoneId: ZoneId.TheSeatOfSacrifice,
  timelineFile: 'wol.txt',
  timelineTriggers: [
    {
      id: 'WOL Ultimate Crossover',
      regex: /Ultimate Crossover/,
      beforeSeconds: 8,
      condition: function(data) {
        return data.role === 'tank';
      },
      alarmText: {
        en: 'Limit break now!',
        de: 'Limit break jetzt!',
        ja: 'タンクLBを！',
        cn: '坦克LB！',
      },
    },
    {
      id: 'WOL Twincast Towers',
      regex: /Meteor Impact 1/,
      beforeSeconds: 10,
      durationSeconds: 8,
      infoText: {
        en: 'Get Towers',
        de: 'Türme nehmen',
        ja: '塔を踏む',
      },
    },
  ],
  triggers: [
    {
      id: 'WOL Terror Unleashed',
      netRegex: NetRegexes.ability({ source: 'Warrior Of Light', id: '4F27', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Krieger Des Lichts', id: '4F27', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Guerrier De La Lumière Primordial', id: '4F27', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ウォーリア・オブ・ライト', id: '4F27', capture: false }),
      condition: function(data) {
        return data.role === 'healer';
      },
      suppressSeconds: 5,
      alertText: {
        en: 'Full Heal Everyone',
        de: 'Alle voll heilen',
        ja: 'HPを満タンさせ！',
      },
    },
    {
      id: 'WOL Coruscant Saber In',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F11', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F11', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F11', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F11', capture: false }),
      response: Responses.getUnder('info'),
    },
    {
      id: 'WOL Coruscant Saber Out',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F10', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F10', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F10', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F10', capture: false }),
      response: Responses.getOut('info'),
    },
    {
      id: 'WOL Absolute Blizzard III',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F2D', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F2D', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F2D', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F2D', capture: false }),
      response: Responses.move('alert'),
    },
    {
      id: 'WOL Absolute Fire III',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F2E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F2E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F2E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F2E', capture: false }),
      // I mean, stop if you want, I guess?
      response: Responses.stopEverything('info'),
    },
    {
      id: 'WOL Imbued Absolute Blizzard III',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F13', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F13', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F13', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F13', capture: false }),
      run: function(data) {
        data.imbued = 'blizzard';
      },
    },
    {
      id: 'WOL Imbued Absolute Fire III',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F12', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F12', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F12', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F12', capture: false }),
      run: function(data) {
        data.imbued = 'fire';
      },
    },
    {
      id: 'WOL Imbued Coruscance Out',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F4B', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F4B', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F4B', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F4B', capture: false }),
      alertText: function(data) {
        if (data.imbued === 'blizzard') {
          return {
            en: 'Out => Move',
            de: 'Raus => Bewegen',
            ja: '外 => 中',
          };
        } else if (data.imbued === 'fire') {
          return {
            en: 'Out => Stop',
            de: 'Raus => Nichts machen',
            ja: '外 => 動かない',
          };
        }
        return {
          en: 'Out => ???',
          de: 'Raus => ???',
          ja: '外 => ???',
        };
      },
    },
    {
      id: 'WOL Imbued Coruscance In',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F4C', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F4C', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F4C', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F4C', capture: false }),
      alertText: function(data) {
        if (data.imbued === 'blizzard') {
          return {
            en: 'Under => Move',
            de: 'Runter => Bewegen',
            ja: '中 => 動け',
          };
        } else if (data.imbued === 'fire') {
          return {
            en: 'Under => Stop',
            de: 'Runter => Nichts machen',
            ja: '中 => 動かない',
          };
        }
        return {
          en: 'Under => ???',
          de: 'Runter => ???',
          ja: '中 => ???',
        };
      },
    },
    {
      id: 'WOL Sword Of Light',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F42', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F42', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F42', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F42', capture: false }),
      infoText: {
        en: 'Out of Triangle',
        de: 'Raus aus den Dreiecken',
        ja: '三角の外へ',
      },
    },
    {
      id: 'WOL Summon Wyrm',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F41', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F41', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F41', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F41', capture: false }),
      delaySeconds: 6,
      // This applies to both phases.  We could say something like "go side without wyrm" and
      // "go to corner without wyrm", but "avoid wyrm dash" covers both.  Hopefully it's obvious
      // not to stand in the giant black circle.
      infoText: {
        en: 'Avoid Wyrm Dash',
        de: 'Wyrm-Ansturm ausweichen',
        ja: '竜を避け',
      },
    },
    {
      id: 'WOL Bitter End',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F28' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F28' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F28' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F28' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'WOL Elddragon Dive',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F29', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F29', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F29', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F29', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'WOL Deluge of Death Marker',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      condition: Conditions.targetIsYou(),
      alarmText: {
        en: 'GTFO',
        de: 'GTFO',
        ja: 'GTFO',
      },
      run: function(data, matches) {
        data.deluge = matches.target;
      },
    },
    {
      id: 'WOL Deluge of Death Cleanup',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      delaySeconds: 10,
      run: function(data, matches) {
        // Clean this up so it doesn't apply during Katon San.
        delete data.deluge;
      },
    },
    {
      // Both for Absolute Holy and Katon San
      id: 'WOL Absolute Holy Katon San',
      netRegex: NetRegexes.headMarker({ id: '00A1' }),
      delaySeconds: 0.5,
      response: function(data, matches) {
        if (data.deluge === data.me)
          return;
        return Responses.stackOn();
      },
    },
    {
      id: 'WOL Radiant Braver',
      netRegex: NetRegexes.headMarker({ id: '00EA' }),
      response: Responses.earthshaker(),
    },
    {
      id: 'WOL Radiant Desperado',
      // There are two single target 4F46 lines to indicate who the stacks
      // are on, that come slightly after this starts casting.
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '515D', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '515D', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '515D', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '515D', capture: false }),
      alertText: {
        en: 'Stack Groups',
        de: 'Gruppen stacken',
        ja: '集合',
      },
    },
    {
      id: 'WOL Radiant Meteor',
      netRegex: NetRegexes.headMarker({ id: '00E9' }),
      condition: Conditions.targetIsYou(),
      alarmText: {
        en: 'Go to Corner',
        de: 'In die Ecken gehenr',
        ja: 'コーナーへ',
      },
    },
    {
      id: 'WOL Suiton San',
      netRegex: NetRegexes.ability({ source: 'Spectral Ninja', id: '4F38', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Phantom-Ninja', id: '4F38', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Ninja Spectral', id: '4F38', capture: false }),
      netRegexJa: NetRegexes.ability({ source: '幻光の忍者', id: '4F38', capture: false }),
      delaySeconds: 5,
      response: Responses.knockback(),
    },
    {
      id: 'WOL Spectral Egi Flare Breath',
      netRegex: NetRegexes.tether({ source: 'Spectral Egi', id: '0011' }),
      netRegexDe: NetRegexes.tether({ source: 'Phantom-Primae', id: '0011' }),
      netRegexFr: NetRegexes.tether({ source: 'Egi Spectral', id: '0011' }),
      netRegexJa: NetRegexes.tether({ source: '幻光の召喚獣', id: '0011' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Point tether outside',
        de: 'Verbindungen nach Außen zeigen',
        ja: '線を外に引く',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Spectral Bard': 'Phantom-Barde',
        'Spectral Black Mage': 'Phantom-Schwarzmagier',
        'Spectral Dark Knight': 'Phantom-Dunkelritter',
        'Spectral Egi': 'Phantom-Primae',
        'Spectral Ninja': 'Phantom-Ninja',
        'Spectral Summoner': 'Phantom-Beschwörer',
        'Spectral Warrior': 'Phantom-Berserker',
        'Warrior Of Light': 'Krieger des Lichts',
        'Wyrm Of Light': 'Wyrm des Lichts',
      },
      'replaceText': {
        '\\(In\\)': '(Rein)',
        '\\(Out\\)': '(Raus)',
        '--active time event--': '--Aktives Zeitevent--',
        'Absolute Blizzard III': 'Absolutes Eisga',
        'Absolute Fire III': 'Absolutes Feuga',
        'Absolute Fire/Blizard': 'Absolutes Feuga/Eisga',
        'Absolute Holy': 'Absolutes Sanctus',
        'Absolute Teleport': 'Absoluter Teleport',
        'Ascendance': 'Himmelstanz',
        'Brimstone Earth': 'Schwefelerde',
        'Cauterize': 'Kauterisieren',
        'Coruscant Saber': 'Gleißender Säbel',
        'Deluge Of Death': 'Tödlicher Sturzregen',
        'Elddragon Dive': 'Drachensturz',
        'Flare Breath': 'Flare-Atem',
        'Imbued Coruscance': 'Magieklingentechnik: Gleißender Säbel',
        'Imbued Fire/Blizzard': 'Magieklinge Feuga/Eisga',
        'Katon: San': 'Katon: San',
        'Meteor Impact': 'Meteoreinschlag',
        'Perfect Decimation': 'Perfektes Dezimieren',
        'Radiant Braver': 'Gleißende Gerechtigkeit',
        'Radiant Desperado': 'Gleißender Desperado',
        'Radiant Meteor': 'Gleißender Meteor',
        'Shining Wave': 'Leuchtwelle',
        'Solemn Confiteor': 'Feierlicher Confiteor',
        'Specter Of Light': 'Heldenruf',
        'Suiton: San': 'Suiton: San',
        'Summon(?! Wyrm)': 'Beschwörung',
        'Summon Wyrm': 'Drachenbeschwörung',
        'Sword Of Light': 'Schwert des Lichts',
        'Terror Unleashed': 'Entfesselter Terror',
        'The Bitter End': 'Schwertschimmer',
        'To The Limit': 'Bis ans Limit',
        'Twincast': 'Dualzauber',
        'Ultimate Crossover': 'Ultimative Kreuzigung',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Spectral Bard': 'barde spectral',
        'Spectral Black Mage': 'mage noir spectral',
        'Spectral Dark Knight': 'chevalier noir spectral',
        'Spectral Egi': 'Egi spectral',
        'Spectral Ninja': 'ninja spectral',
        'Spectral Summoner': 'invocatrice spectrale',
        'Spectral Warrior': 'berserker spectral',
        'Warrior Of Light': 'Guerrier de la Lumière primordial',
        'Wyrm Of Light': 'wyrm de Lumière',
      },
      'replaceText': {
        'Absolute Blizzard III': 'Méga Glace absolue',
        'Absolute Fire III': 'Méga Feu absolu',
        'Absolute Holy': 'Miracle absolu',
        'Absolute Teleport': 'Téléportation absolue',
        'Ascendance': 'Ascendance',
        'Brimstone Earth': 'Terre de soufre',
        'Cauterize': 'Cautérisation',
        'Coruscant Saber': 'Fureur flamboyante',
        'Deluge Of Death': 'Averse mortelle',
        'Elddragon Dive': 'Piqué du dragon ancien',
        'Flare Breath': 'Souffle brasier',
        'Imbued Coruscance': 'Magilame Fureur flamboyante',
        'Katon: San': 'Katon: San',
        'Meteor Impact': 'Impact de météore',
        'Perfect Decimation': 'Décimation parfaite',
        'Radiant Braver': 'Âme brave flamboyante',
        'Radiant Desperado': 'Desperado flamboyant',
        'Radiant Meteor': 'Météore flamboyant',
        'Shining Wave': 'Épée flamboyante',
        'Solemn Confiteor': 'Confiteor solennel',
        'Specter Of Light': 'Sommation des braves',
        'Suiton: San': 'Suiton: San',
        'Summon(?! Wyrm)': 'Invocation',
        'Summon Wyrm': 'Invocation de wyrm',
        'Sword Of Light': 'Lame de Lumière',
        'Terror Unleashed': 'Déchaînement de la terreur',
        'The Bitter End': 'Éradication',
        'To The Limit': 'Pas vers la transcendance',
        'Twincast': 'Tandem',
        'Ultimate Crossover': 'Taillade croisée ultime',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Spectral Bard': '幻光の吟遊詩人',
        'Spectral Black Mage': '幻光の黒魔道士',
        'Spectral Dark Knight': '幻光の暗黒騎士',
        'Spectral Egi': '幻光の召喚獣',
        'Spectral Ninja': '幻光の忍者',
        'Spectral Summoner': '幻光の召喚士',
        'Spectral Warrior': '幻光の狂戦士',
        'Warrior Of Light': 'ウォーリア・オブ・ライト',
        'Wyrm Of Light': 'ウィルム・オブ・ライト',
      },
      'replaceText': {
        '\\(In\\)': '(中)',
        '\\(Out\\)': '(外)',
        '--active time event--': '--QTE--',
        'Absolute Blizzard III': 'アブソリュートブリザガ',
        'Absolute Fire III': 'アブソリュートファイガ',
        'Absolute Fire/Blizard': 'アブソリュート ファイガ／ブリザガ',
        'Absolute Holy': 'アブソリュートホーリー',
        'Absolute Teleport': 'アブソリュートテレポ',
        'Ascendance': 'アセンダンス',
        'Brimstone Earth': 'ブリムストーンアース',
        'Cauterize': 'カータライズ',
        'Coruscant Saber': 'ブライトセイバー',
        'Deluge Of Death': 'ヘビーレイン・オブ・デス',
        'Elddragon Dive': 'エンシェントドラゴンダイブ',
        'Flare Breath': 'フレアブレス',
        'Imbued Coruscance': '魔法剣技：ブライトセイバー',
        'Imbued Fire/Blizzard': '魔法剣アブソリュート ファイガ／ブリザガ',
        'Katon: San': '火遁の術：参',
        'Meteor Impact': 'メテオインパクト',
        'Perfect Decimation': 'パーフェクトデシメート',
        'Radiant Braver': 'ブライトブレイバー',
        'Radiant Desperado': 'ブライトデスペラード',
        'Radiant Meteor': 'ブライトメテオ',
        'Shining Wave': 'シャイニングウェーブ',
        'Solemn Confiteor': 'ソーレムコンフィテオル',
        'Specter Of Light': '幻光召喚',
        'Suiton: San': '水遁の術：参',
        'Summon(?! Wyrm)': '召喚',
        'Summon Wyrm': 'サモン・ウィルム',
        'Sword Of Light': 'ソード・オブ・ライト',
        'Terror Unleashed': 'アンリーシュ・テラー',
        'The Bitter End': 'エンドオール',
        'To The Limit': 'リミットチャージ',
        'Twincast': 'ふたりがけ',
        'Ultimate Crossover': 'アルティメット・クロスオーバー',
      },
    },
  ],
}];
