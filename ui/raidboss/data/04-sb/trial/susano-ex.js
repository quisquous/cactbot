'use strict';

// Susano Extreme
[{
  zoneRegex: /^The Pool Of Tribute \(Extreme\)$/,
  timelineFile: 'susano-ex.txt',
  timelineTriggers: [
    {
      id: 'SusEx Cloud',
      regex: /Knockback \(cloud\)/,
      beforeSeconds: 1.5,
      infoText: {
        en: 'look for cloud',
      },
    },
  ],
  triggers: [
    { // Thundercloud tracker
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
    { // Thundercloud tracker
      // Stop tracking the cloud after it casts lightning instead of
      // when it disappears.  This is because there are several
      // levinbolts with the same cloud, but only one levinbolt has
      // lightning attached to it.
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
    { // Churning tracker
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
    { // Churning tracker
      // We could track the number of people with churning here, but
      // that seems a bit fragile.  This might not work if somebody dies
      // while having churning, but is probably ok in most cases.
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
          };
        }
        return false;
      },
      infoText: function(data) {
        if (data.role == 'healer') {
          return {
            en: 'Tank Buster',
            de: 'Tank Buster',
          };
        }
        return false;
      },
      tts: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'tank buster',
            de: 'tenkbasta',
          };
        }
      },
    },
    { // Red knockback marker indicator
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
          };
        } else if (data.churning) {
          return {
            en: 'Knockback + dice (STOP)',
            de: 'Rückstoss + Würfel (STOPP)',
          };
        }
        return {
          en: 'Knockback on YOU',
          de: 'Rückstoß auf DIR',
        };
      },
      tts: function(data) {
        if (data.cloud) {
          return {
            en: 'knockback with cloud',
            de: 'Rückstoß mit wolke',
          };
        } else if (data.churning) {
          return {
            en: 'Knockback with dice',
            de: 'Rückstoß mit Würfel',
          };
        }
        return {
          en: 'Knockback',
          de: 'Rückstoß',
        };
      },
    },
    { // Levinbolt indicator
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
          };
        }
        return {
          en: 'Levinbolt on you',
          de: 'Blitz auf dir',
        };
      },
      tts: function(data) {
        if (data.cloud) {
          return {
            en: 'bolt with cloud',
            de: 'blitz mit wolke',
          };
        }
        return {
          en: 'bolt',
          de: 'blitz',
        };
      },
    },
    { // Levinbolt indicator debug
      id: 'SusEx Levinbolt Debug',
      regex: Regexes.headMarker({ id: '006E' }),
      condition: function(data, matches) {
        data.levinbolt = matches.target;
        return (matches.target != data.me);
      },
    },
    { // Stunning levinbolt indicator
      id: 'SusEx Levinbolt Stun',
      regex: Regexes.headMarker({ id: '006F' }),
      infoText: function(data, matches) {
        // It's sometimes hard for tanks to see the line, so just give a
        // sound indicator for jumping rope back and forth.
        if (data.role == 'tank') {
          return {
            en: 'Stun: ' + matches.target,
            de: 'Paralyse ' + matches.target,
          };
        }
      },
    },
    { // Churning (dice)
      id: 'SusEx Churning',
      regex: Regexes.gainsEffect({ effect: 'Churning', capture: true }),
      regexDe: Regexes.gainsEffect({ effect: 'Schäumend', capture: true }),
      regexFr: Regexes.gainsEffect({ effect: 'Agitation', capture: true }),
      regexJa: Regexes.gainsEffect({ effect: '禍泡', capture: true }),
      regexCn: Regexes.gainsEffect({ effect: '祸泡', capture: true }),
      regexKo: Regexes.gainsEffect({ effect: '재앙거품', capture: true }),
      delaySeconds: function(data, matches) {
        return parseFloat(matches.duration) - 3;
      },
      alertText: {
        en: 'Stop',
        de: 'Stopp',
      },
      condition: function(data, matches) {
        return matches.target == data.me;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Ama-No-Iwato': 'Ama No Iwato',
        'Ame-No-Murakumo': 'Ame No Murakumo',
        'Dark Levin': 'Violett[a] Blitz',
        'Engage!': 'Start!',
        'Susano': 'Susano',
        'Thunderhead': 'Gewitterwolke',
        'Let the revels begin': 'Kommt, lasst uns singen und tanzen!',
        'How our hearts sing in the chaos': 'Jahaha! Weiter so!',
        'REJOICE!': 'Uohhh!',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Ame No Murakumo': 'Ame No Murakumo',
        'Assail': 'Schwere Attacke',
        'Brightstorm': 'Heller Sturm',
        'Churn': 'Schaum',
        'Churning Deep': 'Schäumen',
        'Electrocution': 'Stromschlag',
        'Enrage': 'Finalangriff',
        'Levinbolt': 'Keraunisches Feld',
        'Rasen Kaikyo': 'Rasen Kaikyo',
        'Seasplitter': 'Seespalter',
        'Sheer Force': 'Schwertgewalt',
        'Shock': 'Entladung',
        'Stormsplitter': 'Sturmspalter',
        'The Altered Gate': 'Gewendetes Tor',
        'The Hidden Gate': 'Verschwundenes Tor',
        'The Parting Clouds': 'Wolkenriss',
        'The Sealed Gate': 'Versiegeltes Tor',
        'Ukehi': 'Ukehi',
        'Yasakani No Magatama': 'Yasakani No Magatama',
        'Yata No Kagami': 'Yata No Kagami',
        'Dark Levin': 'Violetter Blitz',
        'Knockback': 'Rückstoß',
        'Stack': 'Stacken',
        'cloud': 'Wolke',
        'dice': 'Würfel (Bombe)',
        'Ame-No-Murakumo add': 'Ame no Murakumo Add',
      },
      '~effectNames': {
        'Churning': 'Schäumend',
        'Clashing': 'Gekreuzte Klingen',
        'Fetters': 'Granitgefängnis',
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
        'Ama-No-Iwato': 'Ama No Iwato',
        'Ame-No-Murakumo': 'Ame No Murakumo',
        'Dark Levin': 'Foudre Violette',
        'Engage!': 'À l\'attaque',
        'Susano': 'Susano',
        'Thunderhead': 'Nuage Orageux',
        'Let the revels begin': 'Dansez maintenant... La fête commence !  ',
        'How our hearts sing in the chaos': 'HA HA, HA ! Je m\'amuse comme un fou !',
        'REJOICE!': 'MOUAAAAAAH !',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Ame No Murakumo': 'Ame No Murakumo',
        'Assail': 'Assaut',
        'Brightstorm': 'Claire Tempête',
        'Churn': 'Agitation',
        'Churning Deep': 'Agitation Profonde',
        'Electrocution': 'Électrocution',
        'Enrage': 'Enrage',
        'Levinbolt': 'Fulguration',
        'Rasen Kaikyo': 'Rasen Kaikyo',
        'Seasplitter': 'Fendeur De Mers',
        'Sheer Force': 'Force Pure',
        'Shock': 'Décharge électrostatique',
        'Stormsplitter': 'Fendeur De Tempêtes',
        'The Altered Gate': 'Porte Altérée',
        'The Hidden Gate': 'Porte Cachée',
        'The Parting Clouds': 'Dispersion De Nuages',
        'The Sealed Gate': 'Porte Scellée',
        'Ukehi': 'Ukehi',
        'Yasakani No Magatama': 'Yasakani No Magatama',
        'Yata No Kagami': 'Yata No Kagami',
        'Dark Levin': 'Foudre Violette',

        // FIXME
        'Knockback': 'Knockback',
        'Stack': 'Stack',
        'cloud': 'cloud',
        'dice': 'dice',
        'Ame-No-Murakumo add': 'Ame-No-Murakumo add',
      },
      '~effectNames': {
        'Churning': 'Agitation',
        'Clashing': 'Duel D\'armes',
        'Fetters': 'Attache',
        'Flesh Wound': 'Blessure Physique',
        'Lightning Resistance Down': 'Résistance à La Foudre Réduite',
        'Paralysis': 'Paralysie',
        'Sinking': 'Enfoncement',
        'Slashing Resistance Down II': 'Résistance Au Tranchant Réduite+',
        'Stun': 'Étourdissement',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Ama-No-Iwato': '天岩戸',
        'Ame-No-Murakumo': 'アメノムラクモ',
        'Dark Levin': '紫電',
        'Engage!': '戦闘開始！',
        'Susano': 'スサノオ',
        'Thunderhead': '雷雲',
        'Let the revels begin': 'いざ舞え、踊れ！　祭りである！ 神前たれども無礼を許す……武器を取れい！',
        'How our hearts sing in the chaos': 'カッカッカッ、興が乗ったわ！ アメノムラクモの真なる姿、見せてくれよう！',
        'REJOICE!': 'フンヌアァァァァ！',
      },
      'replaceText': {
        'Ame No Murakumo': 'アメノムラクモ',
        'Assail': '強撃',
        'Brightstorm': '晴嵐',
        'Churn': '禍泡付着',
        'Churning Deep': '禍泡',
        'Electrocution': '感電',
        'Levinbolt': '稲妻',
        'Rasen Kaikyo': '螺旋海峡',
        'Seasplitter': '海割り',
        'Sheer Force': '剣圧',
        'Shock': '放電',
        'Stormsplitter': '海嵐斬',
        'The Altered Gate': '岩戸返し',
        'The Hidden Gate': '岩戸隠れ',
        'The Parting Clouds': '雲間放電',
        'The Sealed Gate': '岩戸閉め',
        'Ukehi': '宇気比',
        'Yasakani No Magatama': 'ヤサカニノマガタマ',
        'Yata No Kagami': 'ヤタノカガミ',
        'Dark Levin': '紫電',

        // FIXME
        'Knockback': 'Knockback',
        'Stack': 'Stack',
        'cloud': 'cloud',
        'dice': 'dice',
        'Ame-No-Murakumo add': 'Ame-No-Murakumo add',
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
  ],
}];
