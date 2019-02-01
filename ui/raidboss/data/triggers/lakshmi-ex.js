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
      regex: /:Lakshmi starts using Chanchala/,
      run: function(data) {
        data.chanchala = true;
      },
    },
    {
      regex: /:Lakshmi loses the effect of Chanchala/,
      run: function(data) {
        data.chanchala = false;
      },
    },
    {
      id: 'Lakshmi Pull of Light',
      regex: /:215E:Lakshmi starts using The Pull Of Light on (\y{Name})/,
      regexDe: /:215E:Lakshmi starts using Strom Des Lichts on (\y{Name})/,
      alarmText: function(data, matches) {
        if (data.role != 'tank' && matches[1] == data.me) {
          return {
            en: 'Buster on YOU',
            de: 'Tankbuster auf DIR',
          };
        }
      },
      alertText: function(data, matches) {
        if (data.role == 'tank' && matches[1] == data.me) {
          return {
            en: 'Buster on YOU',
            de: 'Tankbuster auf DIR',
          };
        }
        if (data.role == 'healer' && matches[1] != data.me) {
          return {
            en: 'Buster on ' + matches[1],
            de: 'Tankbuster auf ' + matches[1],
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
      regex: /:2149:Lakshmi starts using Divine Denial/,
      regexDe: /:2149:Lakshmi starts using Göttliche Leugnung/,
      alertText: {
        en: 'Vrill + Knockback',
        de: 'Vril + Rückstoß',
      },
    },
    {
      id: 'Lakshmi Divine Desire',
      regex: /:214B:Lakshmi starts using Divine Desire/,
      regexDe: /:214B:Lakshmi starts using Göttliche Lockung/,
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
      regex: /:214A:Lakshmi starts using Divine Doubt/,
      regexDe: /:214A:Lakshmi starts using Göttliche Bestürzung/,
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
      regex: /1B:........:(\y{Name}):....:....:003E:0000:0000:0000:/,
      alertText: function(data, matches) {
        if (!data.chanchala)
          return;

        if (data.me == matches[1]) {
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

        if (data.me == matches[1]) {
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
      regex: /:2147:Lakshmi starts using Stotram/,
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
      regex: /1B:........:(\y{Name}):....:....:000E:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
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
      regex: /1B:........:(\y{Name}):....:....:006B:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
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
      regex: /1B:........:(\y{Name}):....:....:006D:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
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
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
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
