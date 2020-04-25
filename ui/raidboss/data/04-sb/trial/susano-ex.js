'use strict';

// Susano Extreme
[{
  zoneRegex: {
    en: /^The Pool Of Tribute \(Extreme\)$/,
    cn: /^须佐之男歼殛战$/,
  },
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
          };
        } else if (data.churning) {
          return {
            en: 'Knockback + dice (STOP)',
            de: 'Rückstoss + Würfel (STOPP)',
            cn: '击退+水泡（静止）',
          };
        }
        return {
          en: 'Knockback on YOU',
          de: 'Rückstoß auf DIR',
          cn: '击退点名',
        };
      },
      tts: function(data) {
        if (data.cloud) {
          return {
            en: 'knockback with cloud',
            de: 'Rückstoß mit wolke',
            cn: '雷云击退',
          };
        } else if (data.churning) {
          return {
            en: 'Knockback with dice',
            de: 'Rückstoß mit Würfel',
            cn: '水泡击退',
          };
        }
        return {
          en: 'Knockback',
          de: 'Rückstoß',
          fr: 'Poussée',
          cn: '击退',
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
          };
        }
        return {
          en: 'Levinbolt on you',
          de: 'Blitz auf dir',
          cn: '闪电点名',
        };
      },
      tts: function(data) {
        if (data.cloud) {
          return {
            en: 'bolt with cloud',
            de: 'blitz mit wolke',
            cn: '闪电带雷云',
          };
        }
        return {
          en: 'bolt',
          de: 'blitz',
          cn: '闪电',
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
            en: 'Stun: ' + matches.target,
            de: 'Paralyse ' + matches.target,
            cn: '击晕'+ matches.target,
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
      },

    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Ama-No-Iwato': 'Ama no Iwato',
        'Ame-No-Murakumo': 'Ame no Murakumo',
        'Dark Levin': 'violett(?:e|er|es|en) Blitz',
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
        'Brightstorm': 'Heller Sturm',
        'Churn': 'Schaum',
        'Churning Deep': 'Schäumen',
        'Dark Levin': 'violett(?:e|er|es|en) Blitz',
        'Electrocution': 'Stromschlag',
        'Knockback': 'Rückstoß',
        'Levinbolt': 'Keraunisches Feld',
        'Phase': 'Phase',
        'Rasen Kaikyo': 'Rasen Kaikyo',
        'Seasplitter': 'Seespalter',
        'Sheer Force': 'Schwertgewalt',
        'Shock': 'Entladung',
        'Stack': 'Sammeln',
        'Stormsplitter': 'Sturmspalter',
        'The Altered Gate': 'Gewendetes Tor',
        'The Hidden Gate': 'Verschwundenes Tor',
        'The Parting Clouds': 'Wolkenriss',
        'The Sealed Gate': 'Versiegeltes Tor',
        'Ukehi': 'Ukehi',
        'Yasakani No Magatama': 'Yasakani No Magatama',
        'Yata No Kagami': 'Yata No Kagami',
        'cloud': 'Wolke',
        'dice': 'Würfel (Bombe)',
      },
      '~effectNames': {
        'Churning': 'Schäumend',
        'Clashing': 'Gekreuzte Klingen',
        'Fetters': 'Fesselung',
        'Flesh Wound': 'Fleischwunde',
        'Lightning Resistance Down': 'Blitzresistenz -',
        'Paralysis': 'Paralyse',
        'Sinking': 'Sinkend',
        'Slashing Resistance Down II': 'Hiebresistenz - (stark)',
        'Stun': 'Betäubung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ama-No-Iwato': 'ama no iwato',
        'Ame-No-Murakumo': 'Ame no Murakumo',
        'Dark Levin': 'foudre violette',
        'How our hearts sing in the chaos': 'HA HA, HA ! Je m\'amuse comme un fou !',
        'Let the revels begin': 'Dansez maintenant... La fête commence !  ',
        'REJOICE!': 'MOUAAAAAAH !',
        'Susano': 'Susano',
        'Thunderhead': 'Pointe d\'éclair',
      },
      'replaceText': {
        'Ame No Murakumo': 'Ame No Murakumo',
        'Ame-No-Murakumo add': 'Ame-No-Murakumo add', // FIXME
        'Assail': 'Assaut',
        'Brightstorm': 'Claire tempête',
        'Churn': 'Agitation',
        'Churning Deep': 'Agitation profonde',
        'Dark Levin': 'foudre violette',
        'Electrocution': 'Électrocution',
        'Knockback': 'Knockback', // FIXME
        'Levinbolt': 'Fulguration',
        'Phase': 'Phase', // FIXME
        'Rasen Kaikyo': 'Rasen Kaikyo',
        'Seasplitter': 'Fendeur de mers',
        'Sheer Force': 'Force pure',
        'Shock': 'Décharge électrostatique',
        'Stack': 'Stack', // FIXME
        'Stormsplitter': 'Fendeur de tempêtes',
        'The Altered Gate': 'Porte altérée',
        'The Hidden Gate': 'Porte cachée',
        'The Parting Clouds': 'Dispersion de nuages',
        'The Sealed Gate': 'Porte scellée',
        'Ukehi': 'Ukehi',
        'Yasakani No Magatama': 'Yasakani No Magatama',
        'Yata No Kagami': 'Yata No Kagami',
        'cloud': 'cloud', // FIXME
        'dice': 'dice', // FIXME
      },
      '~effectNames': {
        'Churning': 'Agitation',
        'Clashing': 'Duel d\'armes',
        'Fetters': 'Attache',
        'Flesh Wound': 'Blessure physique',
        'Lightning Resistance Down': 'Résistance à la foudre réduite',
        'Paralysis': 'Paralysie',
        'Sinking': 'Enfoncement',
        'Slashing Resistance Down II': 'Résistance au tranchant réduite+',
        'Stun': 'Étourdissement',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Ama-No-Iwato': '天岩戸',
        'Ame-No-Murakumo': 'アメノムラクモ',
        'Dark Levin': '紫電',
        'How our hearts sing in the chaos': 'カッカッカッ、興が乗ったわ！ アメノムラクモの真なる姿、見せてくれよう！',
        'Let the revels begin': 'いざ舞え、踊れ！　祭りである！ 神前たれども無礼を許す……武器を取れい！',
        'REJOICE!': 'フンヌアァァァァ！',
        'Susano': 'スサノオ',
        'Thunderhead': 'サンダーヘッド',
      },
      'replaceText': {
        'Ame No Murakumo': 'アメノムラクモ',
        'Ame-No-Murakumo add': 'Ame-No-Murakumo add', // FIXME
        'Assail': '強撃',
        'Brightstorm': '晴嵐',
        'Churn': '禍泡付着',
        'Churning Deep': '禍泡',
        'Dark Levin': '紫電',
        'Electrocution': '感電',
        'Knockback': 'Knockback', // FIXME
        'Levinbolt': '稲妻',
        'Phase': 'Phase', // FIXME
        'Rasen Kaikyo': '螺旋海峡',
        'Seasplitter': '海割り',
        'Sheer Force': '剣圧',
        'Shock': '放電',
        'Stack': 'Stack', // FIXME
        'Stormsplitter': '海嵐斬',
        'The Altered Gate': '岩戸返し',
        'The Hidden Gate': '岩戸隠れ',
        'The Parting Clouds': '雲間放電',
        'The Sealed Gate': '岩戸閉め',
        'Ukehi': '宇気比',
        'Yasakani No Magatama': 'ヤサカニノマガタマ',
        'Yata No Kagami': 'ヤタノカガミ',
        'cloud': 'cloud', // FIXME
        'dice': 'dice', // FIXME
      },
      '~effectNames': {
        'Churning': '禍泡',
        'Clashing': '鍔迫り合い',
        'Fetters': '拘束',
        'Flesh Wound': '切傷',
        'Lightning Resistance Down': '雷属性耐性低下',
        'Paralysis': '麻痺',
        'Sinking': '埋没',
        'Slashing Resistance Down II': '斬属性耐性低下［強］',
        'Stun': 'スタン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Ama-No-Iwato': '天之岩户',
        'Ame-No-Murakumo': '天之丛云',
        'Dark Levin': '紫电',
        'How our hearts sing in the chaos': '(有意思，真有意思|终于到了该使用神器的时候了吗)', // FIXME: they have the same english translation
        'Let the revels begin': '欢庆吧！跳舞吧！',
        'REJOICE!': '哇啊啊啊！',
        'Susano': '须佐之男',
        'Thunderhead': '雷暴云砧',
      },
      'replaceText': {
        'Ame No Murakumo': '天之丛云',
        'Ame-No-Murakumo add': '天之丛云小怪',
        'Assail': '强击',
        'Brightstorm': '晴空风暴',
        'Churn': '祸泡附身',
        'Churning Deep': '祸泡',
        'Dark Levin': '紫电',
        'Electrocution': '感电',
        'Knockback': '击退',
        'Levinbolt': '闪电',
        'Phase': '阶段',
        'Rasen Kaikyo': '螺旋海峡',
        'Seasplitter': '断海',
        'Sheer Force': '剑压',
        'Shock': '放电',
        'Stack': '集合',
        'Stormsplitter': '破浪斩',
        'The Altered Gate': '岩户返',
        'The Hidden Gate': '岩户隐',
        'The Parting Clouds': '云间放电',
        'The Sealed Gate': '岩户闭合',
        'Ukehi': '祈请',
        'Yasakani No Magatama': '八尺琼勾玉',
        'Yata No Kagami': '八咫镜',
        'cloud': '云',
        'dice': '骰点',
      },
      '~effectNames': {
        'Churning': '祸泡',
        'Clashing': '拼刀',
        'Fetters': '拘束',
        'Flesh Wound': '切伤',
        'Lightning Resistance Down': '雷属性耐性降低',
        'Paralysis': '麻痹',
        'Sinking': '下沉',
        'Slashing Resistance Down II': '斩击耐性大幅降低',
        'Stun': '眩晕',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Ama-No-Iwato': '신의 바위',
        'Ame-No-Murakumo': '아메노무라쿠모',
        'Dark Levin': '번갯불',
        'How our hearts sing in the chaos': 'How our hearts sing in the chaos', // FIXME
        'Let the revels begin': 'Let the revels begin', // FIXME
        'REJOICE!': 'REJOICE!', // FIXME
        'Susano': '스사노오',
        'Thunderhead': '번개 머리',
      },
      'replaceText': {
        'Ame No Murakumo': 'Ame No Murakumo', // FIXME
        'Ame-No-Murakumo add': 'Ame-No-Murakumo add', // FIXME
        'Assail': '강력 공격',
        'Brightstorm': '산바람',
        'Churn': '재앙거품 부착',
        'Churning Deep': '재앙거품',
        'Dark Levin': '번갯불',
        'Electrocution': '감전',
        'Knockback': 'Knockback', // FIXME
        'Levinbolt': '우레',
        'Phase': 'Phase', // FIXME
        'Rasen Kaikyo': '나선 해협',
        'Seasplitter': '바다 가르기',
        'Sheer Force': '검압',
        'Shock': '방전',
        'Stack': 'Stack', // FIXME
        'Stormsplitter': '해풍참',
        'The Altered Gate': '바위 뒤섞기',
        'The Hidden Gate': '바위 숨기기',
        'The Parting Clouds': '구름 방전',
        'The Sealed Gate': '바위 조이기',
        'Ukehi': '내기 선언',
        'Yasakani No Magatama': 'Yasakani No Magatama', // FIXME
        'Yata No Kagami': 'Yata No Kagami', // FIXME
        'cloud': 'cloud', // FIXME
        'dice': 'dice', // FIXME
      },
      '~effectNames': {
        'Churning': '재앙거품',
        'Clashing': '칼 막기',
        'Fetters': '구속',
        'Flesh Wound': '', // FIXME
        'Lightning Resistance Down': '번개속성 저항 감소',
        'Paralysis': '마비',
        'Sinking': '침몰',
        'Slashing Resistance Down II': '베기 저항 감소[강]',
        'Stun': '기절',
      },
    },
  ],
}];
