'use strict';

// Susano Extreme
[{
  zoneRegex: {
    en: /^The Pool Of Tribute \(Extreme\)$/,
    cn: /^须佐之男歼殛战$/,
    ko: /^극 스사노오 토벌전$/,
  },
  zoneId: ZoneId.ThePoolOfTributeExtreme,
  timelineFile: 'susano-ex.txt',
  timelineTriggers: [
    {
      id: 'SusEx Cloud',
      regex: /Knockback \(cloud\)/,
      beforeSeconds: 1.5,
      infoText: {
        en: 'look for cloud',
        de: 'Nach Wolke ausschau halten',
        cn: '寻找雷云',
        ko: '구름 확인',
      },
    },
  ],
  triggers: [
    {
      id: 'SusEx Thundercloud Tracker',
      regex: Regexes.addedCombatant({ name: 'Thunderhead', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Gewitterwolke', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Nuage Orageux', capture: false }),
      regexJa: Regexes.addedCombatant({ name: '雷雲', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '雷云', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '번개구름', capture: false }),
      run: function(data) {
        data.cloud = true;
      },
    },
    {
      // Stop tracking the cloud after it casts lightning instead of
      // when it disappears.  This is because there are several
      // levinbolts with the same cloud, but only one levinbolt has
      // lightning attached to it.
      id: 'SusEx Thundercloud Cleanup',
      regex: Regexes.startsUsing({ id: '2041', source: 'Thunderhead', target: 'Thunderhead', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2041', source: 'Gewitterwolke', target: 'Gewitterwolke', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2041', source: 'Nuage Orageux', target: 'Nuage Orageux', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2041', source: '雷雲', target: '雷雲', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2041', source: '雷云', target: '雷云', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2041', source: '번개구름', target: '번개구름', capture: false }),
      run: function(data) {
        data.cloud = false;
      },
    },
    {
      id: 'SusEx Churning Gain',
      regex: Regexes.gainsEffect({ effect: 'Churning', capture: false }),
      regexDe: Regexes.gainsEffect({ effect: 'Schäumend', capture: false }),
      regexFr: Regexes.gainsEffect({ effect: 'Agitation', capture: false }),
      regexJa: Regexes.gainsEffect({ effect: '禍泡', capture: false }),
      regexCn: Regexes.gainsEffect({ effect: '祸泡', capture: false }),
      regexKo: Regexes.gainsEffect({ effect: '재앙거품', capture: false }),
      condition: function(data) {
        return !data.churning;
      },
      run: function(data) {
        data.churning = true;
      },
    },
    {
      // We could track the number of people with churning here, but
      // that seems a bit fragile.  This might not work if somebody dies
      // while having churning, but is probably ok in most cases.
      id: 'SusEx Churning Lose',
      regex: Regexes.losesEffect({ effect: 'Churning', capture: false }),
      regexDe: Regexes.losesEffect({ effect: 'Schäumend', capture: false }),
      regexFr: Regexes.losesEffect({ effect: 'Agitation', capture: false }),
      regexJa: Regexes.losesEffect({ effect: '禍泡', capture: false }),
      regexCn: Regexes.losesEffect({ effect: '祸泡', capture: false }),
      regexKo: Regexes.losesEffect({ effect: '재앙거품', capture: false }),
      condition: function(data) {
        return data.churning;
      },
      run: function(data) {
        data.churning = false;
      },
    },
    {
      id: 'SusEx Tankbuster',
      regex: Regexes.ability({ source: 'Susano', id: '2033', capture: false }),
      regexDe: Regexes.ability({ source: 'Susano', id: '2033', capture: false }),
      regexFr: Regexes.ability({ source: 'Susano', id: '2033', capture: false }),
      regexJa: Regexes.ability({ source: 'スサノオ', id: '2033', capture: false }),
      regexCn: Regexes.ability({ source: '须佐之男', id: '2033', capture: false }),
      regexKo: Regexes.ability({ source: '스사노오', id: '2033', capture: false }),
      alertText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Tank Swap',
            de: 'Tank Wechsel',
            ja: 'スイッチ',
            fr: 'Tank Swap',
            cn: '换T',
            ko: '탱 교대',
          };
        }
        return false;
      },
      infoText: function(data) {
        if (data.role == 'healer') {
          return {
            en: 'Tank Buster',
            de: 'Tank Buster',
            fr: 'Tankbuster',
            cn: '死刑',
            ko: '탱버',
          };
        }
        return false;
      },
      tts: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'tank buster',
            de: 'tenkbasta',
            cn: '坦克死刑',
            ko: '탱버',
          };
        }
      },
    },
    {
      // Red knockback marker indicator
      id: 'SusEx Knockback',
      regex: Regexes.headMarker({ id: '0017' }),
      condition: function(data, matches) {
        return (matches.target == data.me);
      },
      alertText: function(data) {
        if (data.cloud) {
          return {
            en: 'Knockback on you (cloud)',
            de: 'Rückstoss auf Dir (Wolke)',
            cn: '击退点名（雷云）',
            ko: '넉백 대상자 (구름)',
          };
        } else if (data.churning) {
          return {
            en: 'Knockback + dice (STOP)',
            de: 'Rückstoss + Würfel (STOPP)',
            cn: '击退+水泡（静止）',
            ko: '넉백 + 주사위 (가만히)',
          };
        }
        return {
          en: 'Knockback on YOU',
          de: 'Rückstoß auf DIR',
          cn: '击退点名',
          ko: '넉백 대상자',
        };
      },
      tts: function(data) {
        if (data.cloud) {
          return {
            en: 'knockback with cloud',
            de: 'Rückstoß mit wolke',
            cn: '雷云击退',
            ko: '넉백과 구름 장판',
          };
        } else if (data.churning) {
          return {
            en: 'Knockback with dice',
            de: 'Rückstoß mit Würfel',
            cn: '水泡击退',
            ko: '넉백과 주사위',
          };
        }
        return {
          en: 'Knockback',
          de: 'Rückstoß',
          fr: 'Poussée',
          cn: '击退',
          ko: '넉백',
        };
      },
    },
    {
      id: 'SusEx Levinbolt',
      regex: Regexes.headMarker({ id: '006E' }),
      condition: function(data, matches) {
        return (matches.target == data.me);
      },
      alertText: function(data) {
        if (data.cloud) {
          return {
            en: 'Levinbolt on you (cloud)',
            de: 'Blitz auf Dir (Wolke)',
            cn: '闪电点名（雷云）',
            ko: '우레 대상자 (구름)',
          };
        }
        return {
          en: 'Levinbolt on you',
          de: 'Blitz auf dir',
          cn: '闪电点名',
          ko: '우레 대상자',
        };
      },
      tts: function(data) {
        if (data.cloud) {
          return {
            en: 'bolt with cloud',
            de: 'blitz mit wolke',
            cn: '闪电带雷云',
            ko: '구름 번개',
          };
        }
        return {
          en: 'bolt',
          de: 'blitz',
          cn: '闪电',
          ko: '번개',
        };
      },
    },
    {
      id: 'SusEx Levinbolt Debug',
      regex: Regexes.headMarker({ id: '006E' }),
      condition: function(data, matches) {
        data.levinbolt = matches.target;
        return (matches.target != data.me);
      },
    },
    {
      id: 'SusEx Levinbolt Stun',
      regex: Regexes.headMarker({ id: '006F' }),
      infoText: function(data, matches) {
        // It's sometimes hard for tanks to see the line, so just give a
        // sound indicator for jumping rope back and forth.
        if (data.role == 'tank') {
          return {
            en: 'Stun: ' + data.ShortName(matches.target),
            de: 'Paralyse ' + data.ShortName(matches.target),
            cn: '击晕' + data.ShortName(matches.target),
            ko: data.ShortName(matches.target) + '스턴',
          };
        }
      },
    },
    {
      id: 'SusEx Churning',
      regex: Regexes.gainsEffect({ effect: 'Churning', capture: true }),
      regexDe: Regexes.gainsEffect({ effect: 'Schäumend', capture: true }),
      regexFr: Regexes.gainsEffect({ effect: 'Agitation', capture: true }),
      regexJa: Regexes.gainsEffect({ effect: '禍泡', capture: true }),
      regexCn: Regexes.gainsEffect({ effect: '祸泡', capture: true }),
      regexKo: Regexes.gainsEffect({ effect: '재앙거품', capture: true }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches.duration) - 3;
      },
      alertText: {
        en: 'Stop',
        de: 'Stopp',
        cn: '停止动作',
        ko: '가만히 있기',
      },

    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Ame-No-Murakumo': 'Ame no Murakumo',
        'How our hearts sing in the chaos': 'Jahaha! Weiter so!',
        'Let the revels begin': 'Kommt, lasst uns singen und tanzen!',
        'REJOICE!': 'Uohhh!',
        'Susano': 'Susano',
        'Thunderhead': 'Gewitterwolke',
      },
      'replaceText': {
        'Ame No Murakumo': 'Ame No Murakumo',
        'Ame-No-Murakumo add': 'Ame No Murakumo Add',
        'Assail': 'Schwere Attacke',
        'Churn': 'Schaum',
        'Dark Levin': 'violett(?:e|er|es|en) Blitz',
        'Knockback': 'Rückstoß',
        'Levinbolt': 'Keraunisches Feld',
        'Phase': 'Phase',
        'Rasen Kaikyo': 'Rasen Kaikyo',
        'Seasplitter': 'Seespalter',
        'Stack': 'Sammeln',
        'Stormsplitter': 'Sturmspalter',
        'The Hidden Gate': 'Verschwundenes Tor',
        'The Sealed Gate': 'Versiegeltes Tor',
        'Ukehi': 'Ukehi',
        'cloud': 'Wolke',
        'dice': 'Würfel (Bombe)',
      },
      '~effectNames': {
        'Churning': 'Schäumend',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Ame-No-Murakumo': 'Ame no Murakumo',
        'How our hearts sing in the chaos': 'HA HA, HA ! Je m\'amuse comme un fou !',
        'Let the revels begin': 'Dansez maintenant... La fête commence !  ',
        'REJOICE!': 'MOUAAAAAAH !',
        'Susano': 'Susano',
        'Thunderhead': 'Pointe d\'éclair',
      },
      'replaceText': {
        'Ame No Murakumo': 'Ame No Murakumo',
        'Assail': 'Assaut',
        'Churn': 'Agitation',
        'Dark Levin': 'foudre violette',
        'Levinbolt': 'Fulguration',
        'Rasen Kaikyo': 'Rasen Kaikyo',
        'Seasplitter': 'Fendeur de mers',
        'Stormsplitter': 'Fendeur de tempêtes',
        'The Hidden Gate': 'Porte cachée',
        'The Sealed Gate': 'Porte scellée',
        'Ukehi': 'Ukehi',
      },
      '~effectNames': {
        'Churning': 'Agitation',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Ame-No-Murakumo': 'アメノムラクモ',
        'How our hearts sing in the chaos': 'カッカッカッ、興が乗ったわ！ アメノムラクモの真なる姿、見せてくれよう！',
        'Let the revels begin': 'いざ舞え、踊れ！　祭りである！ 神前たれども無礼を許す……武器を取れい！',
        'REJOICE!': 'フンヌアァァァァ！',
        'Susano': 'スサノオ',
        'Thunderhead': 'サンダーヘッド',
      },
      'replaceText': {
        'Ame No Murakumo': 'アメノムラクモ',
        'Assail': '強撃',
        'Churn': '禍泡付着',
        'Dark Levin': '紫電',
        'Levinbolt': '稲妻',
        'Rasen Kaikyo': '螺旋海峡',
        'Seasplitter': '海割り',
        'Stormsplitter': '海嵐斬',
        'The Hidden Gate': '岩戸隠れ',
        'The Sealed Gate': '岩戸閉め',
        'Ukehi': '宇気比',
      },
      '~effectNames': {
        'Churning': '禍泡',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Ame-No-Murakumo': '天之丛云',
        'How our hearts sing in the chaos': '有意思，真有意思！',
        'Let the revels begin': '欢庆吧！跳舞吧！',
        'REJOICE!': '哇啊啊啊！',
        'Susano': '须佐之男',
        'Thunderhead': '雷暴云砧',
      },
      'replaceText': {
        'Ame No Murakumo': '天之丛云',
        'Ame-No-Murakumo add': '天之丛云小怪',
        'Assail': '强击',
        'Churn': '祸泡附身',
        'Dark Levin': '紫电',
        'Knockback': '击退',
        'Levinbolt': '闪电',
        'Phase': '阶段',
        'Rasen Kaikyo': '螺旋海峡',
        'Seasplitter': '断海',
        'Stack': '集合',
        'Stormsplitter': '破浪斩',
        'The Hidden Gate': '岩户隐',
        'The Sealed Gate': '岩户闭合',
        'Ukehi': '祈请',
        'cloud': '云',
        'dice': '骰点',
      },
      '~effectNames': {
        'Churning': '祸泡',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Ame-No-Murakumo(?! )': '아메노무라쿠모',
        'How our hearts sing in the chaos': '카하하, 흥이 나는구나!',
        'Let the revels begin': '자, 춤춰라! 제를 올려라!',
        'REJOICE!': '흐아아아아압!',
        'Susano': '스사노오',
        'Thunderhead': '번개 머리',
      },
      'replaceText': {
        'Ame No Murakumo': '아메노무라쿠모',
        'Ame-No-Murakumo add': '아메노무라쿠모 쫄',
        'Assail': '강력 공격',
        'Churn': '재앙거품 부착',
        'Dark Levin': '번갯불',
        'Knockback': '넉백',
        'Levinbolt': '우레',
        'Phase': '페이즈',
        'Rasen Kaikyo': '나선 해협',
        'Seasplitter': '바다 가르기',
        'Stack': '집합',
        'Stun': '기절',
        'Stormsplitter': '해풍참',
        'The Hidden Gate': '바위 숨기기',
        'The Sealed Gate': '바위 조이기',
        'Ukehi': '내기 선언',
        'cloud': '구름',
        'dice': '주사위',
      },
      '~effectNames': {
        'Churning': '재앙거품',
      },
    },
  ],
}];
