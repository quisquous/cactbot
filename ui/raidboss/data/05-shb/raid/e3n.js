'use strict';

[{
  zoneRegex: {
    en: /^Eden's Gate: Inundation$/,
    cn: /^伊甸希望乐园 \(觉醒之章3\)$/,
    ko: /^희망의 낙원 에덴: 각성편 \(3\)$/,
  },
  timelineFile: 'e3n.txt',
  triggers: [
    {
      id: 'E3N Tidal Roar',
      regex: Regexes.startsUsing({ id: '3FC4', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FC4', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FC4', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FC4', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FC4', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FC4', source: '리바이어선', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
        ko: '광역공격',
      },
    },
    {
      id: 'E3N Rip Current',
      regex: Regexes.headMarker({ id: '0017' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            cn: '死刑点名',
            ko: '나에게 탱버',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            cn: '死刑 ->' + data.ShortName(matches.target),
            ko: '탱버 ->' + data.ShortName(matches.target),
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target != data.me && data.role == 'tank') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            cn: '死刑 ->' + data.ShortName(matches.target),
            ko: '탱버 ->' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'E3N Tidal Wave Look',
      regex: Regexes.startsUsing({ id: '3FD2', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FD2', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FD2', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FD2', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FD2', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FD2', source: '리바이어선', capture: false }),
      delaySeconds: 3,
      infoText: {
        en: 'Look for Wave',
        de: 'Nach der Welle schauen',
        fr: 'Repérez la vague',
        cn: '看浪',
        ko: '해일 위치 확인',
      },
    },
    {
      id: 'E3N Tidal Wave Knockback',
      regex: Regexes.startsUsing({ id: '3FD2', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FD2', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FD2', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FD2', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FD2', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FD2', source: '리바이어선', capture: false }),
      // 3 seconds of cast, 10 seconds of delay.
      // This gives a warning within 5 seconds, so you can hit arm's length.
      delaySeconds: 8,
      alertText: {
        en: 'Knockback',
        de: 'Knockback',
        fr: 'Poussée',
        cn: '击退',
        ko: '넉백',
      },
    },
    {
      id: 'E3N Undersea Quake Outside',
      regex: Regexes.startsUsing({ id: '3FD0', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FD0', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FD0', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FD0', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FD0', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FD0', source: '리바이어선', capture: false }),
      alertText: {
        en: 'Get Middle',
        de: 'In die Mitte gehen',
        fr: 'Allez au centre',
        cn: '中间',
        ko: '중앙으로',
      },
    },
    {
      id: 'E3N Undersea Quake Outside',
      regex: Regexes.startsUsing({ id: '3FCF', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FCF', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FCF', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FCF', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FCF', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FCF', source: '리바이어선', capture: false }),
      alarmText: {
        en: 'Go To Sides',
        de: 'Auf die Seiten gehen',
        fr: 'Allez sur les côtés',
        cn: '两侧',
        ko: '좌우 외곽으로',
      },
    },
    {
      id: 'E3N Maelstrom',
      regex: Regexes.startsUsing({ id: '3FD8', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FD8', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FD8', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FD8', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FD8', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FD8', source: '리바이어선', capture: false }),
      delaySeconds: 8,
      infoText: {
        en: 'Avoid Puddles and Dives',
        de: 'Flächen und Leviathan ausweichen',
        fr: 'Evitez les flaques et les dives',
        cn: '躲圈闪避',
        ko: '돌진이랑 장판 피하세요',
      },
    },
    {
      id: 'E3N Drenching Pulse Spread',
      regex: Regexes.headMarker({ id: '00A9' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
        cn: '分散',
        ko: '산개',
      },
    },
    {
      id: 'E3N Tsunami',
      regex: Regexes.startsUsing({ id: '3FD4', source: 'Leviathan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3FD4', source: 'Leviathan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3FD4', source: 'Léviathan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3FD4', source: 'リヴァイアサン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3FD4', source: '利维亚桑', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3FD4', source: '리바이어선', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
        ko: '광역공격',
      },
    },
    {
      // Crashing Pulse and Smothering Waters
      id: 'E3N Stack',
      regex: Regexes.headMarker({ id: '003E' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR sammeln',
            fr: 'Package sur VOUS',
            cn: '集合',
            ko: '나에게 쉐어',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
          de: 'Auf ' + data.ShortName(matches.target) + ' sammeln',
          fr: 'Package sur ' + data.ShortName(matches.target),
          cn: '集合 ->' + data.ShortName(matches.target),
          ko: '쉐어 ->' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'E3N Surging Waters Marker',
      regex: Regexes.headMarker({ id: '00AD' }),
      infoText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Knockback on YOU',
            de: 'Knockback auf DIR',
            fr: 'Poussée sur VOUS',
            cn: '击退点名',
            ko: '나에게 넉백징',
          };
        }
        return {
          en: 'Knockback on ' + data.ShortName(matches.target),
          de: 'Knockback auf ' + data.ShortName(matches.target),
          fr: 'Poussée sur ' + data.ShortName(matches.target),
          cn: '击退 ->' + data.ShortName(matches.target),
          ko: '넉백 ->' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'E3N Splashing Waters Spread',
      regex: Regexes.headMarker({ id: '0082' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
        cn: '分散',
        ko: '산개',
      },
    },
    {
      id: 'E3N Swirling Waters Donut',
      regex: Regexes.headMarker({ id: '0099' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Donut on YOU',
        de: 'Donut auf DIR',
        fr: 'Donut sur VOUS',
        cn: '月环点名',
        ko: '나에게 도넛장판',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Engage!': 'Start!',
        'Leviathan': 'Leviathan',
      },
      'replaceText': {
        'Freak Wave': 'Gigantische Welle',
        'Killer Wave': 'Tödliche Welle',
        '--untargetable--': '--nich anvisierbar--',
        'Maelstrom': 'Mahlstrom',
        'Monster Wave': 'Monsterwelle',
        'Tidal Roar': 'Schrei der Gezeiten',
        'Smothering Tsunami': 'Ertränkende Sturzflut',
        '--targetable--': '--anvisierbar--',
        'Splashing Tsunami': 'Stürmende Sturzflut',
        'Undersea Quake': 'Unterwasserbeben',
        'Enrage': 'Finalangriff',
        'Swirling Tsunami': 'Wirbelnde Sturzflut',
        'Unknown Ability': 'Unknown Ability',
        'Tidal Wave': 'Flutwelle',
        'Tsunami': 'Sturzflut',
        'Spinning Dive': 'Drehsprung',
        'Rip Current': 'Brandungsrückstrom',
        'Temporary Current': 'Unstete Gezeiten',
        'Crashing Pulse': 'Stürmische Wogen',
        'Drenching Pulse': 'Tosende Wogen',
        'Surging Tsunami': 'Erdrückende Sturzflut',
      },
      '~effectNames': {
        'Dropsy': 'Wassersucht',
        'Splashing Waters': 'Omen des Sturms',
        'Swirling Waters': 'Omen des Wasserwirbels',
        'Smothering Waters': 'Omen der Ertränkung',
        'Surging Waters': 'Omen der Erdrückung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Engage!': 'À l\'attaque',
        'Leviathan': 'Léviathan',
      },
      'replaceText': {
        'Freak Wave': 'Vague gigantesque',
        'Enrage': 'Enrage',
        'Maelstrom': 'Maelström',
        '--sync--': '--Synchronisation--',
        'Rip Current': 'Courant d\'arrachement',
        'Undersea Quake': 'Séisme sous-marin',
        '--targetable--': '--Ciblable--',
        'Spinning Dive': 'Piqué tournant',
        'Killer Wave': 'Vague meutrière',
        'Temporary Current': 'Courant évanescent',
        'Crashing Pulse': 'Pulsation déchaînée',
        'Surging Tsunami': 'Tsunami écrasant',
        '--Reset--': '--Réinitialisation--',
        '--untargetable--': '--Impossible à cibler--',
        'Monster Wave': 'Vague monstrueuse',
        'Tidal Roar': 'Vague rugissante',
        'Smothering Tsunami': 'Tsunami submergeant',
        'Splashing Tsunami': 'Tsunami déferlant',
        'Swirling Tsunami': 'Tsunami tournoyant',
        'Tidal Wave': 'Raz-de-marée',
        'Tsunami': 'Tsunami',
        'Drenching Pulse': 'Pulsation sauvage',
      },
      '~effectNames': {
        'Dropsy': 'Œdème',
        'Splashing Waters': 'Eaux déferlantes',
        'Swirling Waters': 'Eaux tournoyantes',
        'Smothering Waters': 'Eaux submergeantes',
        'Surging Waters': 'Eaux écrasantes',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Engage!': '戦闘開始！',
        'Leviathan': 'リヴァイアサン',
      },
      'replaceText': {
        'Freak Wave': 'フリークウェイブ',
        'Killer Wave': 'キラーウェイブ',
        'Maelstrom': 'メイルシュトローム',
        'Monster Wave': 'モンスターウェイブ',
        'Tidal Roar': 'タイダルロア',
        'Smothering Tsunami': '溺没の大海嘯',
        'Splashing Tsunami': '強風の大海嘯',
        'Undersea Quake': 'アンダーシークエイク',
        'Swirling Tsunami': '渦動の大海嘯',
        'Unknown Ability': 'Unknown Ability',
        'Tidal Wave': 'タイダルウェイブ',
        'Tsunami': '大海嘯',
        'Spinning Dive': 'スピニングダイブ',
        'Rip Current': 'リップカレント',
        'Temporary Current': 'テンポラリーカレント',
        'Crashing Pulse': '激烈なる波動',
        'Drenching Pulse': '猛烈なる波動',
        'Surging Tsunami': '強圧の大海嘯',
      },
      '~effectNames': {
        'Dropsy': '水毒',
        'Splashing Waters': '強風の兆し',
        'Swirling Waters': '渦動の兆し',
        'Smothering Waters': '溺没の兆し',
        'Surging Waters': '強圧の兆し',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Engage!': '战斗开始！',
        'Leviathan': '利维亚桑',
      },
      'replaceText': {
        'Freak Wave': '畸形波',
        'Killer Wave': '杀人浪',
        'Maelstrom': '漩涡',
        'Monster Wave': '疯狗浪',
        'Tidal Roar': '怒潮咆哮',
        'Smothering Tsunami': '溺没大海啸',
        'Splashing Tsunami': '强风大海啸',
        'Undersea Quake': '海底地震',
        'Swirling Tsunami': '涡动大海啸',
        'Tidal Wave': '巨浪',
        'Tsunami': '大海啸',
        'Spinning Dive': '旋转下潜',
        'Rip Current': '裂流',
        'Temporary Current': '临时洋流',
        'Crashing Pulse': '激烈波动',
        'Drenching Pulse': '猛烈波动',
        'Surging Tsunami': '强压大海啸',
        '--untargetable--': '--无法选中--',
        '--targetable--': '--可选中--',
      },
      '~effectNames': {
        'Dropsy': '水毒',
        'Splashing Waters': '强风之兆',
        'Swirling Waters': '涡动之兆',
        'Smothering Waters': '溺没之兆',
        'Surging Waters': '强压之兆',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Engage!': '전투 시작!',
        'Leviathan': '리바이어선',
      },
      'replaceText': {
        'Freak Wave': '기괴한 물결',
        'Killer Wave': '치명적인 물결',
        'Maelstrom': '대격동',
        'Monster Wave': '마물의 물결',
        'Tidal Roar': '바다의 포효',
        'Smothering Tsunami': '익몰의 대해일',
        'Splashing Tsunami': '강풍의 대해일',
        'Undersea Quake': '해저 지진',
        'Swirling Tsunami': '와동의 대해일',
        'Tidal Wave': '해일',
        'Spinning Dive': '고속 돌진',
        'Rip Current': '이안류',
        'Temporary Current': '순간 해류',
        'Crashing Pulse': '격렬한 파동',
        'Drenching Pulse': '맹렬한 파동',
        'Surging Tsunami': '강압의 대해일',
        'Tsunami': '대해일',
        '--untargetable--': '--타겟불가능--',
        '--targetable--': '--타겟가능--',
      },
      '~effectNames': {
        'Dropsy': '물독',
        'Splashing Waters': '강풍의 징조',
        'Swirling Waters': '소용돌이의 징조',
        'Smothering Waters': '익몰의 징조',
        'Surging Waters': '강압의 징조',
      },
    },
  ],
}];
