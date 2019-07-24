'use strict';

[{
  zoneRegex: /^Eden's Gate: Inundation$/,
  timelineFile: 'e3n.txt',
  triggers: [
    {
      id: 'E3N Tidal Roar',
      regex: / 14:3FC4:Leviathan starts using Tidal Roar/,
      regexFr: / 14:3FC4:Léviathan starts using Vague Rugissante/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'E3N Rip Current',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0017:/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me && data.role == 'tank') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'E3N Tidal Wave Look',
      regex: / 14:3FD2:Leviathan starts using Tidal Wave/,
      regexFr: / 14:3FD2:Léviathan starts using Raz-De-Marée/,
      delaySeconds: 3,
      infoText: {
        en: 'Look for Wave',
        fr: 'Repérez la vague',
      },
    },
    {
      id: 'E3N Tidal Wave Knockback',
      regex: / 14:3FD2:Leviathan starts using Tidal Wave/,
      regexFr: / 14:3FD2:Léviathan starts using Raz-De-Marée/,
      // 3 seconds of cast, 10 seconds of delay.
      // This gives a warning within 5 seconds, so you can hit arm's length.
      delaySeconds: 8,
      alertText: {
        en: 'Knockback',
        fr: 'Poussée',
      },
    },
    {
      id: 'E3N Undersea Quake Outside',
      regex: / 14:3FD0:Leviathan starts using Undersea Quake/,
      regexFr: / 14:3FD0:Léviathan starts using Séisme Sous-Marin/,
      alertText: {
        en: 'Get Middle',
        fr: 'Allez au centre',
      },
    },
    {
      id: 'E3N Undersea Quake Outside',
      regex: / 14:3FCF:Leviathan starts using Undersea Quake/,
      regexFr: / 14:3FCF:Léviathan starts using Séisme Sous-Marin/,
      alarmText: {
        en: 'Go To Sides',
        fr: 'Allez sur les côtés',
      },
    },
    {
      id: 'E3N Maelstrom',
      regex: / 14:3FD8:Leviathan starts using Maelstrom/,
      regexFr: / 14:3FD8:Léviathan starts using Maelström/,
      delaySeconds: 8,
      infoText: {
        en: 'Avoid Puddles and Dives',
        fr: 'Evitez les flaques et les dives',
      },
    },
    {
      id: 'E3N Drenching Pulse Spread',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00A9:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
        fr: 'Dispersez-vous',
      },
    },
    {
      id: 'E3N Tsunami',
      regex: / 14:3FD4:Leviathan starts using Tsunami/,
      regexFr: / 14:3FD4:Léviathan starts using Tsunami/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      // Crashing Pulse and Smothering Waters
      id: 'E3N Stack',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:003E:/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Stack on YOU',
            fr: 'Package sur VOUS',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
          fr: 'Package sur ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'E3N Surging Waters Marker',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00AD:/,
      infoText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Knockback on YOU',
            fr: 'Poussée sur VOUS',
          };
        }
        return {
          en: 'Knockback on ' + data.ShortName(matches[1]),
          fr: 'Poussée sur ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'E3N Splashing Waters Spread',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0082:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
        fr: 'Dispersez-vous',
      },
    },
    {
      id: 'E3N Swirling Waters Donut',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0099:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Donut on YOU',
        fr: 'Donut sur VOUS',
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
  ],
}];
