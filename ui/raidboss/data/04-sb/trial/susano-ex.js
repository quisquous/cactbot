'use strict';

// Susano Extreme
[{
  zoneId: ZoneId.ThePoolOfTributeExtreme,
  timelineNeedsFixing: true,
  timelineFile: 'susano-ex.txt',
  timelineTriggers: [
    {
      id: 'SusEx Cloud',
      regex: /Knockback \(cloud\)/,
      beforeSeconds: 1.5,
      infoText: {
        en: 'look for cloud',
        de: 'Nach Wolke ausschau halten',
        fr: 'Cherchez le nuage',
        cn: '寻找雷云',
        ko: '구름 확인',
      },
    },
  ],
  triggers: [
    {
      id: 'SusEx Thundercloud Tracker',
      netRegex: NetRegexes.addedCombatant({ name: 'Thunderhead', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Gewitterwolke', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Nuage Orageux', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: '雷雲', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '雷云', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '번개구름', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: '2041', source: 'Thunderhead', target: 'Thunderhead', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2041', source: 'Gewitterwolke', target: 'Gewitterwolke', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2041', source: 'Nuage Orageux', target: 'Nuage Orageux', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2041', source: '雷雲', target: '雷雲', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2041', source: '雷云', target: '雷云', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2041', source: '번개구름', target: '번개구름', capture: false }),
      run: function(data) {
        data.cloud = false;
      },
    },
    {
      id: 'SusEx Churning Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '4F6', capture: false }),
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
      netRegex: NetRegexes.losesEffect({ effectId: '4F6', capture: false }),
      condition: function(data) {
        return data.churning;
      },
      run: function(data) {
        data.churning = false;
      },
    },
    {
      id: 'SusEx Stormsplitter',
      netRegex: NetRegexes.startsUsing({ source: 'Susano', id: '2033' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Susano', id: '2033' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Susano', id: '2033' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'スサノオ', id: '2033' }),
      netRegexCn: NetRegexes.startsUsing({ source: '须佐之男', id: '2033' }),
      netRegexKo: NetRegexes.startsUsing({ source: '스사노오', id: '2033' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap('alert', 'info'),
    },
    {
      // Red knockback marker indicator
      id: 'SusEx Knockback',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: function(data, matches) {
        return (matches.target == data.me);
      },
      alertText: function(data) {
        if (data.cloud) {
          return {
            en: 'Knockback on you (cloud)',
            de: 'Rückstoss auf Dir (Wolke)',
            fr: 'Poussée sur VOUS (nuage)',
            cn: '击退点名（雷云）',
            ko: '넉백 대상자 (구름)',
          };
        } else if (data.churning) {
          return {
            en: 'Knockback + dice (STOP)',
            de: 'Rückstoss + Würfel (STOPP)',
            fr: 'Poussée + dé (ARRÊTEZ)',
            cn: '击退+水泡（静止）',
            ko: '넉백 + 주사위 (가만히)',
          };
        }
        return {
          en: 'Knockback on YOU',
          de: 'Rückstoß auf DIR',
          fr: 'Poussée sur VOUS',
          cn: '击退点名',
          ko: '넉백 대상자',
        };
      },
      tts: function(data) {
        if (data.cloud) {
          return {
            en: 'knockback with cloud',
            de: 'Rückstoß mit wolke',
            fr: 'Poussée avec nuage',
            cn: '雷云击退',
            ko: '넉백과 구름 장판',
          };
        } else if (data.churning) {
          return {
            en: 'Knockback with dice',
            de: 'Rückstoß mit Würfel',
            fr: 'Poussée avec dé',
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
      netRegex: NetRegexes.headMarker({ id: '006E' }),
      condition: function(data, matches) {
        return (matches.target == data.me);
      },
      alertText: function(data) {
        if (data.cloud) {
          return {
            en: 'Levinbolt on you (cloud)',
            de: 'Blitz auf Dir (Wolke)',
            fr: 'Fulguration sur VOUS (nuage)',
            cn: '闪电点名（雷云）',
            ko: '우레 대상자 (구름)',
          };
        }
        return {
          en: 'Levinbolt on you',
          de: 'Blitz auf dir',
          fr: 'Fulguration sur VOUS',
          cn: '闪电点名',
          ko: '우레 대상자',
        };
      },
      tts: function(data) {
        if (data.cloud) {
          return {
            en: 'bolt with cloud',
            de: 'blitz mit wolke',
            fr: 'foudre avec nuage',
            cn: '闪电带雷云',
            ko: '구름 번개',
          };
        }
        return {
          en: 'bolt',
          de: 'blitz',
          fr: 'foudre',
          cn: '闪电',
          ko: '번개',
        };
      },
    },
    {
      id: 'SusEx Levinbolt Debug',
      netRegex: NetRegexes.headMarker({ id: '006E' }),
      condition: function(data, matches) {
        data.levinbolt = matches.target;
        return (matches.target != data.me);
      },
    },
    {
      id: 'SusEx Levinbolt Stun',
      netRegex: NetRegexes.headMarker({ id: '006F' }),
      infoText: function(data, matches) {
        // It's sometimes hard for tanks to see the line, so just give a
        // sound indicator for jumping rope back and forth.
        if (data.role == 'tank') {
          return {
            en: 'Stun: ' + data.ShortName(matches.target),
            de: 'Paralyse ' + data.ShortName(matches.target),
            fr: 'Stun ' + data.ShortName(matches.target),
            cn: '击晕' + data.ShortName(matches.target),
            ko: data.ShortName(matches.target) + '스턴',
          };
        }
      },
    },
    {
      id: 'SusEx Churning',
      netRegex: NetRegexes.gainsEffect({ effectId: '4F6' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches.duration) - 3;
      },
      response: Responses.stopEverything('alert'),
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
        'Dark Levin': 'violetter Blitz',
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
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ame-No-Murakumo': 'Ame no Murakumo',
        'How our hearts sing in the chaos': 'HA HA, HA ! Je m\'amuse comme un fou !',
        'Let the revels begin': 'Dansez maintenant... La fête commence !  ',
        'REJOICE!': 'MOUAAAAAAH !',
        'Susano': 'Susano',
        'Thunderhead': 'nuage orageux',
      },
      'replaceText': {
        '--Phase': '--Phase',
        '\\(cloud\\)': '(nuage)',
        '\\(dice\\)': '(dé)',
        'Ame No Murakumo': 'Ame no Murakumo',
        'Ame-No-Murakumo add': 'Add Ame no Murakumo',
        'Assail': 'Assaut',
        'Churn': 'Agitation',
        'Dark Levin': 'foudre violette',
        'Knockback': 'Poussée',
        'Levinbolt': 'Fulguration',
        'Rasen Kaikyo': 'Rasen Kaikyo',
        'Seasplitter': 'Fendeur de mers',
        'Stack': 'Package',
        'Stun': 'Étourdissement',
        'Stormsplitter': 'Fendeur de tempêtes',
        'The Hidden Gate': 'Porte cachée',
        'The Sealed Gate': 'Porte scellée',
        'Thunder': 'Orage',
        'Thunderhead add': 'Add Nuage orageux',
        'Ukehi': 'Ukehi',
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
    },
  ],
}];
