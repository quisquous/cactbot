'use strict';

// Lakshmi Extreme
[{
  zoneRegex: {
    en: /^Emanation \(Extreme\)$/,
    cn: /^吉祥天女歼殛战$/,
    ko: /^극 락슈미 토벌전$/,
  },
  timelineFile: 'lakshmi-ex.txt',
  timelineTriggers: [
    {
      id: 'Lakshmi Path of Light',
      regex: /Path of Light/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'tank';
      },
      response: Responses.tankCleave(),
    },
  ],
  triggers: [
    {
      id: 'Lakshmi Chanchala Gain',
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
      id: 'Lakshmi Chanchala Lose',
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
      id: 'Lakshmi Pull of Light Tank',
      regex: Regexes.startsUsing({ id: '215E', source: 'Lakshmi' }),
      regexDe: Regexes.startsUsing({ id: '215E', source: 'Lakshmi' }),
      regexFr: Regexes.startsUsing({ id: '215E', source: 'Lakshmi' }),
      regexJa: Regexes.startsUsing({ id: '215E', source: 'ラクシュミ' }),
      regexCn: Regexes.startsUsing({ id: '215E', source: '吉祥天女' }),
      regexKo: Regexes.startsUsing({ id: '215E', source: '락슈미' }),
      condition: function(data, matches) {
        return data.role == 'tank';
      },
      response: Responses.tankBuster('info'),
    },
    {
      id: 'Lakshmi Pull of Light Unexpected',
      regex: Regexes.startsUsing({ id: '215E', source: 'Lakshmi' }),
      regexDe: Regexes.startsUsing({ id: '215E', source: 'Lakshmi' }),
      regexFr: Regexes.startsUsing({ id: '215E', source: 'Lakshmi' }),
      regexJa: Regexes.startsUsing({ id: '215E', source: 'ラクシュミ' }),
      regexCn: Regexes.startsUsing({ id: '215E', source: '吉祥天女' }),
      regexKo: Regexes.startsUsing({ id: '215E', source: '락슈미' }),
      condition: function(data, matches) {
        return data.role != 'tank' && data.role != 'healer';
      },
      response: Responses.tankBuster('alarm'),
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
        cn: '完全拒绝',
        ko: '락슈미 에테르 + 넉백',
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
        cn: '完全吸引',
        ko: '락슈미 에테르 + 바깥으로',
      },
      tts: {
        en: 'vrill and outside',
        de: 'wriel und raus',
        cn: '完全吸引',
        ko: '락슈미 에테르 바깥으로',
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
        cn: '完全惑乱',
        ko: '락슈미 에테르 + 파트너끼리',
      },
      tts: {
        en: 'vrill and buddy',
        de: 'wriel und zu partner',
        cn: '完全惑乱',
        ko: '락슈미 에테르 파트너끼리',
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
            cn: '元气攻击点名',
            ko: '락슈미 에테르 + 쉐어징 대상자',
          };
        }
        return {
          en: 'Vrill + Stack',
          de: 'Vril + Stack',
          cn: '元气攻击',
          ko: '락슈미 에테르 쉐어징',
        };
      },
      infoText: function(data, matches) {
        if (data.chanchala)
          return;

        if (data.me == matches.target) {
          return {
            en: 'Stack on YOU',
            de: 'Stack auf DIR',
            cn: '分摊点名',
            ko: '쉐어징 대상자',
          };
        }
        return {
          en: 'Stack',
          de: 'Stack',
          fr: 'Stack',
          ja: '頭割り',
          cn: '集合',
          ko: '쉐어',
        };
      },
      tts: function(data) {
        if (data.chanchala) {
          return {
            en: 'vrill and stack',
            de: 'vril und stek',
            cn: '元气攻击',
            ko: '락슈미 에테르 + 쉐어',
          };
        }
        return {
          en: 'stack',
          de: 'stek',
          cn: '分摊',
          ko: '쉐어',
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
            cn: '元气AOE',
            ko: '락슈미 에테르 (광딜)',
          };
        }
      },
    },
    { // Offtank cleave
      id: 'Lakshmi Path of Light Marker',
      regex: Regexes.headMarker({ id: '000E' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alarmText: function(data) {
        return {
          en: (data.chanchala ? 'Vrill + ' : '') + 'Cleave on YOU',
          de: (data.chanchala ? 'Vril + ' : '') + 'Cleave auf DIR',
          cn: (data.chanchala ? '元气 ' : '') + '死刑点名',
          ko: (data.chanchala ? '락슈미 에테르 + ' : '') + '광역 탱버 대상자',
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
          cn: (data.chanchala ? '元气 ' : '') + '十字点名',
          ko: (data.chanchala ? '락슈미 에테르 + ' : '') + '십자 장판 징',
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
          cn: (data.chanchala ? '元气 ' : '') + '花点名',
          ko: (data.chanchala ? '락슈미 에테르 + ' : '') + '원형 장판 징',
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
        fr: 'Eloignez-vous',
        cn: '远离大锤落点',
        ko: '피하기',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Dreaming Kshatriya': 'verträumt(?:e|er|es|en) Kshatriya',
        'Lakshmi': 'Lakshmi',
      },
      'replaceText': {
        '/dance': '/tanz',
        'Alluring Arm': 'Anziehender Arm',
        'Blissful Spear': 'Speer der Gnade',
        'Chanchala': 'Chanchala',
        'Divine Denial': 'Göttliche Leugnung',
        'Divine Desire': 'Göttliche Lockung',
        'Divine Doubt': 'Göttliche Bestürzung',
        'Hand Of Beauty': 'Hand der Schönheit',
        'Hand Of Grace': 'Hand der Anmut',
        'Hands Of Grace/Beauty': 'Hand Der Anmut/Schönheit',
        'Inner Demons': 'Dämonen in dir',
        'Stotram': 'Stotram',
        'The Pall Of Light': 'Flut des Lichts',
        'The Path Of Light': 'Pfad des Lichts',
        'The Pull Of Light': 'Strom des Lichts',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Dreaming Kshatriya': 'kshatriya rêveuse',
        'Lakshmi': 'Lakshmi',
      },
      'replaceText': {
        '/dance': '/danser',
        'Alluring Arm': 'Bras séduisants',
        'Blissful Spear': 'Épieu béatifiant',
        'Chanchala': 'Chanchala',
        'Divine Denial': 'Refus divin',
        'Divine Desire': 'Désir divin',
        'Divine Doubt': 'Doute divin',
        'Hand Of Beauty': 'Main de la beauté',
        'Hand Of Grace': 'Main de la grâce',
        'Hands Of Grace/Beauty': 'Main De La Grâce/Beauté',
        'Inner Demons': 'Démons intérieurs',
        'Stotram': 'Stotram',
        'The Pall Of Light': 'Voile de lumière',
        'The Path Of Light': 'Voie de lumière',
        'The Pull Of Light': 'Flot de lumière',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Dreaming Kshatriya': 'テンパード・クシャトリア',
        'Lakshmi': 'ラクシュミ',
      },
      'replaceText': {
        'Alluring Arm': '魅惑の腕',
        'Blissful Spear': '聖なる槍',
        'Chanchala': 'チャンチャラー',
        'Divine Denial': '完全なる拒絶',
        'Divine Desire': '完全なる誘引',
        'Divine Doubt': '完全なる惑乱',
        'Hand Of Beauty': '優美なる左手',
        'Hand Of Grace': '優雅なる右手',
        'Inner Demons': 'イナーデーモン',
        'Stotram': 'ストトラム',
        'The Pall Of Light': '光の瀑布',
        'The Path Of Light': '光の波動',
        'The Pull Of Light': '光の奔流',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Dreaming Kshatriya': '梦寐的刹帝利',
        'Lakshmi': '吉祥天女',
      },
      'replaceText': {
        '/dance': '/跳舞',
        'Adds Appear': '小怪出现',
        'Alluring Arm': '魅惑之臂',
        'Blissful Spear': '圣枪',
        'Chanchala': '反复无常',
        'Divine Denial': '完全拒绝',
        'Divine Desire': '完全引诱',
        'Divine Doubt': '完全惑乱',
        'Hand Of Beauty': '优美的左手',
        'Hand Of Grace': '优雅的右手',
        'Hands Of Grace/Beauty': '右手/左手',
        'Inner Demons': '心魔',
        'Stotram': '赞歌',
        'The Pall Of Light': '光之瀑布',
        'The Path Of Light': '光之波动',
        'The Pull Of Light': '光之奔流',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Dreaming Kshatriya': '신도화된 크샤트리아',
        'Lakshmi': '락슈미',
      },
      'replaceText': {
        '/dance': '/춤',
        'Adds Appear': '쫄',
        'Alluring Arm': '매혹적인 팔',
        'Blissful Spear': '성스러운 창',
        'Chanchala': '찬찰라',
        'Divine Denial': '완전한 거절',
        'Divine Desire': '완전한 유인',
        'Divine Doubt': '완전한 혼란',
        'Hand Of Beauty': '아름다운 왼손',
        'Hand Of Grace': '우아한 오른손',
        'Hands Of Grace/Beauty': '아름다운 왼손/오른손',
        'Inner Demons': '내면의 악마',
        'Stotram': '스토트람',
        'The Pall Of Light': '빛의 폭포',
        'The Path Of Light': '빛의 파동',
        'The Pull Of Light': '빛의 급류',
        'over': '끝',
      },
    },
  ],
}];
