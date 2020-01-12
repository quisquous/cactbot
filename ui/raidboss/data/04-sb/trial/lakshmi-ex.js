'use strict';

// Lakshmi Extreme
[{
  zoneRegex: /^Emanation \(Extreme\)$/,
  timelineFile: 'lakshmi-ex.txt',
  timelineTriggers: [
    {
      id: 'Lakshmi Path of Light',
      regex: /Path of Light/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'tank';
      },
      alertText: {
        en: 'Cleave Soon',
      },
    },
  ],
  triggers: [
    {
      regex: Regexes.startsUsing({ id: '2148', source: 'Lakshmi', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2148', source: 'Lakshmi', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2148', source: 'Lakshmi', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2148', source: 'ラクシュミ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2148', source: '吉祥天女', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2148', source: '락슈미', capture: false }),
      run: function(data) {
        data.chanchala = true;
      },
    },
    {
      regex: Regexes.losesEffect({ target: 'Lakshmi', effect: 'Chanchala', capture: false }),
      regexDe: Regexes.losesEffect({ target: 'Lakshmi', effect: 'Chanchala', capture: false }),
      regexFr: Regexes.losesEffect({ target: 'Lakshmi', effect: 'Chanchala', capture: false }),
      regexJa: Regexes.losesEffect({ target: 'ラクシュミ', effect: 'チャンチャラー', capture: false }),
      regexCn: Regexes.losesEffect({ target: '吉祥天女', effect: '反复无常', capture: false }),
      regexKo: Regexes.losesEffect({ target: '락슈미', effect: '찬찰라', capture: false }),
      run: function(data) {
        data.chanchala = false;
      },
    },
    {
      id: 'Lakshmi Pull of Light',
      regex: Regexes.startsUsing({ id: '215E', source: 'Lakshmi' }),
      regexDe: Regexes.startsUsing({ id: '215E', source: 'Lakshmi' }),
      regexFr: Regexes.startsUsing({ id: '215E', source: 'Lakshmi' }),
      regexJa: Regexes.startsUsing({ id: '215E', source: 'ラクシュミ' }),
      regexCn: Regexes.startsUsing({ id: '215E', source: '吉祥天女' }),
      regexKo: Regexes.startsUsing({ id: '215E', source: '락슈미' }),
      alarmText: function(data, matches) {
        if (data.role != 'tank' && matches.target == data.me) {
          return {
            en: 'Buster on YOU',
            de: 'Tankbuster auf DIR',
          };
        }
      },
      alertText: function(data, matches) {
        if (data.role == 'tank' && matches.target == data.me) {
          return {
            en: 'Buster on YOU',
            de: 'Tankbuster auf DIR',
          };
        }
        if (data.role == 'healer' && matches.target != data.me) {
          return {
            en: 'Buster on ' + matches.target,
            de: 'Tankbuster auf ' + matches.target,
          };
        }
      },
      tts: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'buster',
            de: 'Basta',
          };
        }
      },
    },
    {
      id: 'Lakshmi Divine Denial',
      regex: Regexes.startsUsing({ id: '2149', source: 'Lakshmi', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2149', source: 'Lakshmi', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2149', source: 'Lakshmi', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2149', source: 'ラクシュミ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2149', source: '吉祥天女', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2149', source: '락슈미', capture: false }),
      alertText: {
        en: 'Vrill + Knockback',
        de: 'Vril + Rückstoß',
      },
    },
    {
      id: 'Lakshmi Divine Desire',
      regex: Regexes.startsUsing({ id: '214B', source: 'Lakshmi', capture: false }),
      regexDe: Regexes.startsUsing({ id: '214B', source: 'Lakshmi', capture: false }),
      regexFr: Regexes.startsUsing({ id: '214B', source: 'Lakshmi', capture: false }),
      regexJa: Regexes.startsUsing({ id: '214B', source: 'ラクシュミ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '214B', source: '吉祥天女', capture: false }),
      regexKo: Regexes.startsUsing({ id: '214B', source: '락슈미', capture: false }),
      alertText: {
        en: 'Vrill + Be Outside',
        de: 'Vril + Außen',
      },
      tts: {
        en: 'vrill and outside',
        de: 'wriel und raus',
      },
    },
    {
      id: 'Lakshmi Divine Doubt',
      regex: Regexes.startsUsing({ id: '214A', source: 'Lakshmi', capture: false }),
      regexDe: Regexes.startsUsing({ id: '214A', source: 'Lakshmi', capture: false }),
      regexFr: Regexes.startsUsing({ id: '214A', source: 'Lakshmi', capture: false }),
      regexJa: Regexes.startsUsing({ id: '214A', source: 'ラクシュミ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '214A', source: '吉祥天女', capture: false }),
      regexKo: Regexes.startsUsing({ id: '214A', source: '락슈미', capture: false }),
      alertText: {
        en: 'Vrill + Pair Up',
        de: 'Vril + Pärchen bilden',
      },
      tts: {
        en: 'vrill and buddy',
        de: 'wriel und zu partner',
      },
    },
    { // Stack marker
      id: 'Lakshmi Pall of Light',
      regex: Regexes.headMarker({ id: '003E' }),
      alertText: function(data, matches) {
        if (!data.chanchala)
          return;

        if (data.me == matches.target) {
          return {
            en: 'Vrill + Stack on YOU',
            de: 'Vril + Stack auf DIR',
          };
        }
        return {
          en: 'Vrill + Stack',
          de: 'Vril + Stack',
        };
      },
      infoText: function(data, matches) {
        if (data.chanchala)
          return;

        if (data.me == matches.target) {
          return {
            en: 'Stack on YOU',
            de: 'Stack auf DIR',
          };
        }
        return {
          en: 'Stack',
          de: 'Stack',
        };
      },
      tts: function(data) {
        if (data.chanchala) {
          return {
            en: 'vrill and stack',
            de: 'vril und stek',
          };
        }
        return {
          en: 'stack',
          de: 'stek',
        };
      },
    },
    {
      id: 'Lakshmi Stotram',
      regex: Regexes.startsUsing({ id: '2147', source: 'Lakshmi', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2147', source: 'Lakshmi', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2147', source: 'Lakshmi', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2147', source: 'ラクシュミ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2147', source: '吉祥天女', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2147', source: '락슈미', capture: false }),
      alertText: function(data) {
        if (data.chanchala) {
          return {
            en: 'Vrill for AOE',
            de: 'Vril fuer Flaechenangriff',
          };
        }
      },
    },
    { // Offtank cleave
      id: 'Lakshmi Path of Light',
      regex: Regexes.headMarker({ id: '000E' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alarmText: function(data) {
        return {
          en: (data.chanchala ? 'Vrill + ' : '') + 'Cleave on YOU',
          de: (data.chanchala ? 'Vril + ' : '') + 'Cleave auf DIR',
        };
      },
    },
    { // Cross aoe
      id: 'Lakshmi Hand of Grace',
      regex: Regexes.headMarker({ id: '006B' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: function(data) {
        return {
          en: (data.chanchala ? 'Vrill + ' : '') + 'Cross Marker',
          de: (data.chanchala ? 'Vril + ' : '') + 'Kreuz-Marker',
        };
      },
    },
    { // Flower marker (healers)
      id: 'Lakshmi Hand of Beauty',
      regex: Regexes.headMarker({ id: '006D' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: function(data) {
        return {
          en: (data.chanchala ? 'Vrill + ' : '') + 'Flower Marker',
          de: (data.chanchala ? 'Vril + ' : '') + 'Blumen-Marker',
        };
      },
    },
    { // Red marker during add phase
      id: 'Lakshmi Water III',
      regex: Regexes.headMarker({ id: '0017' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Move Away',
        de: 'Weg da',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Dreaming Brahmin': 'Verträumt[a] Brahmin',
        'Dreaming Kshatriya': 'Verträumt[a] Kshatriya',
        'Dreaming Shudra': 'Verträumt[a] Shudra',
        'Engage!': 'Start!',
        'Lakshmi': 'Lakshmi',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Aether Drain': 'Ätherabsorption',
        'Alluring Arm': 'Anziehender Arm',
        'Alluring Embrace': 'Lockende Umarmung',
        'Blissful Arrow': 'Heiliger Pfeil',
        'Blissful Blessing': 'Höchste Seligkeit',
        'Blissful Hammer': 'Hammer Der Gnade',
        'Blissful Spear': 'Speer Der Gnade',
        'Chanchala': 'Chanchala',
        'Divine Denial': 'Göttliche Leugnung',
        'Divine Desire': 'Göttliche Lockung',
        'Divine Doubt': 'Göttliche Bestürzung',
        'Enrage': 'Finalangriff',
        'Hand Of Beauty': 'Hand Der Schönheit',
        'Hand Of Grace': 'Hand Der Anmut',
        'Inner Demons': 'Dämonen In Dir',
        'Jagadishwari': 'Jagadishwari',
        'Stotram': 'Stotram',
        'Tail Slap': 'Schwanzklapser',
        'The Pall Of Light': 'Flut Des Lichts',
        'The Path Of Light': 'Pfad Des Lichts',
        'The Pull Of Light': 'Strom Des Lichts',
        'Vril': 'Vril',
        'Water': 'Aqua',
        'Water III': 'Aquaga',
        'ラクシュミスタンド：手をかざす：極': 'ラクシュミスタンド：手をかざす：極',
        'ラクシュミ：スタンド：ピンクの吐息：履行演出：ラクシュミ戦': 'ラクシュミ：スタンド：ピンクの吐息：履行演出：ラクシュミ戦',
        '透明：ピンクの吐息：地面もやもや：履行演出：ラクシュミ戦': '透明：ピンクの吐息：地面もやもや：履行演出：ラクシュミ戦',

        // FIXME
        'Pall Of Light': 'Flut Des Lichts',
        'Path Of Light': 'Pfad Des Lichts',
        'Pull Of Light': 'Strom Des Lichts',
        'Hands Of Grace/Beauty': 'Hand Der Anmut/Schönheit',
        'Adds Appear': 'Adds Appear',
      },
      '~effectNames': {
        'Bleeding': 'Blutung',
        'Confused': 'Konfus',
        'Seduced': 'Versuchung',
        'Target Left': 'Zielbereich Links',
        'Target Right': 'Zielbereich Rechts',
        'Vril': 'Vril',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Dreaming Brahmin': 'Brahmin Rêveuse',
        'Dreaming Kshatriya': 'Kshatriya Rêveuse',
        'Dreaming Shudra': 'Shudra Rêveuse',
        'Engage!': 'À l\'attaque',
        'Lakshmi': 'Lakshmi',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Aether Drain': 'Absorption D\'éther',
        'Alluring Arm': 'Bras Séduisants',
        'Alluring Embrace': 'Étreinte Séduisante',
        'Blissful Arrow': 'Flèche Béatifiante',
        'Blissful Blessing': 'Bénédiction Béate',
        'Blissful Hammer': 'Marteau Béatifiant',
        'Blissful Spear': 'Épieu Béatifiant',
        'Chanchala': 'Chanchala',
        'Divine Denial': 'Refus Divin',
        'Divine Desire': 'Désir Divin',
        'Divine Doubt': 'Doute Divin',
        'Enrage': 'Enrage',
        'Hand Of Beauty': 'Main De La Beauté',
        'Hand Of Grace': 'Main De La Grâce',
        'Inner Demons': 'Démons Intérieurs',
        'Jagadishwari': 'Jagadishwari',
        'Stotram': 'Stotram',
        'Tail Slap': 'Gifle Caudale',
        'The Pall Of Light': 'Voile De Lumière',
        'The Path Of Light': 'Voie De Lumière',
        'The Pull Of Light': 'Flot De Lumière',
        'Vril': 'Vril',
        'Water': 'Eau',
        'Water III': 'Méga Eau',
        'ラクシュミスタンド：手をかざす：極': 'ラクシュミスタンド：手をかざす：極',
        'ラクシュミ：スタンド：ピンクの吐息：履行演出：ラクシュミ戦': 'ラクシュミ：スタンド：ピンクの吐息：履行演出：ラクシュミ戦',
        '透明：ピンクの吐息：地面もやもや：履行演出：ラクシュミ戦': '透明：ピンクの吐息：地面もやもや：履行演出：ラクシュミ戦',

        // FIXME
        'Pall Of Light': 'Voile De Lumière',
        'Path Of Light': 'Voie De Lumière',
        'Pull Of Light': 'Flot De Lumière',
        'Hands Of Grace/Beauty': 'Main De La Grâce/Beauté',
        'Adds Appear': 'Adds Appear',
      },
      '~effectNames': {
        'Bleeding': 'Saignant',
        'Confused': 'Confusion',
        'Seduced': 'Séduction',
        'Target Left': 'Portée De Main Gauche',
        'Target Right': 'Portée De Main Droite',
        'Vril': 'Vril',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Dreaming Brahmin': 'テンパード・ブラフミン',
        'Dreaming Kshatriya': 'テンパード・クシャトリア',
        'Dreaming Shudra': 'テンパード・シュードラ',
        'Engage!': '戦闘開始！',
        'Lakshmi': 'ラクシュミ',
      },
      'replaceText': {
        'Aether Drain': 'エーテル吸収',
        'Alluring Arm': '魅惑の腕',
        'Alluring Embrace': '魅惑の抱擁',
        'Blissful Arrow': '聖なる矢',
        'Blissful Blessing': '美神の祝福',
        'Blissful Hammer': '聖なる槌',
        'Blissful Spear': '聖なる槍',
        'Chanchala': 'チャンチャラー',
        'Divine Denial': '完全なる拒絶',
        'Divine Desire': '完全なる誘引',
        'Divine Doubt': '完全なる惑乱',
        'Hand Of Beauty': '優美なる左手',
        'Hand Of Grace': '優雅なる右手',
        'Inner Demons': 'イナーデーモン',
        'Jagadishwari': 'ジャガディッシュワリ',
        'Stotram': 'ストトラム',
        'Tail Slap': 'テールスラップ',
        'The Pall Of Light': '光の瀑布',
        'The Path Of Light': '光の波動',
        'The Pull Of Light': '光の奔流',
        'Vril': 'ラクシュミエーテル',
        'Water': 'ウォータ',
        'Water III': 'ウォタガ',
        'ラクシュミスタンド：手をかざす：極': 'ラクシュミスタンド：手をかざす：極',
        'ラクシュミ：スタンド：ピンクの吐息：履行演出：ラクシュミ戦': 'ラクシュミ：スタンド：ピンクの吐息：履行演出：ラクシュミ戦',
        '透明：ピンクの吐息：地面もやもや：履行演出：ラクシュミ戦': '透明：ピンクの吐息：地面もやもや：履行演出：ラクシュミ戦',

        // FIXME
        'Pall Of Light': '光の瀑布',
        'Path Of Light': '光の波動',
        'Pull Of Light': '光の奔流',
        'Hands Of Grace/Beauty': 'Hands Of Grace/Beauty',
        'Adds Appear': 'Adds Appear',
      },
      '~effectNames': {
        'Bleeding': 'ペイン',
        'Confused': '混乱',
        'Seduced': '誘惑',
        'Target Left': 'ターゲッティング：左',
        'Target Right': 'ターゲッティング：右',
        'Vril': 'ラクシュミエーテル',
      },
    },
  ],
}];
