'use strict';

[{
  zoneRegex: /^Eden's Gate: Inundation \(Savage\)$/,
  timelineFile: 'e3s.txt',
  timelineTriggers: [
    {
      id: 'E3S Plunging Wave',
      regex: /Plunging Wave/,
      beforeSeconds: 2,
      infoText: {
        en: 'Line Stack',
      },
    },
    {
      id: 'E3S Spilling Wave',
      regex: /Spilling Wave/,
      beforeSeconds: 3,
      condition: function(data) {
        return data.role == 'tank';
      },
      alertText: {
        en: 'Tank Cleaves, Move Front',
      },
    },
  ],
  triggers: [
    {
      id: 'E3S Tidal Roar',
      regex: / 14:3FDC:Leviathan starts using Tidal Roar/,
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'E3S Tidal Rage',
      regex: / 14:3FDE:Leviathan starts using Tidal Rage/,
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'E3S Tidal Wave Look',
      regex: / 14:3FF1:Leviathan starts using Tidal Wave/,
      regexFr: / 14:3FF1:Léviathan starts using Raz-De-Marée/,
      delaySeconds: 3,
      infoText: {
        en: 'Look for Wave',
        fr: 'Repérez la vague',
      },
    },
    {
      id: 'E3S Tidal Wave Knockback',
      regex: / 14:3FF1:Leviathan starts using Tidal Wave/,
      regexFr: / 14:3FF1:Léviathan starts using Raz-De-Marée/,
      // 3 seconds of cast, 10 seconds of delay.
      // This gives a warning within 5 seconds, so you can hit arm's length.
      delaySeconds: 8,
      alertText: {
        en: 'Knockback',
        fr: 'Poussée',
      },
    },
    {
      id: 'E3S Rip Current',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0017:/,
      suppressSeconds: 10,
      alarmText: function(data, matches) {
        if (matches[1] != data.me && data.role == 'tank') {
          return {
            en: 'Tank Swap!',
            de: 'Tankwechsel!',
            fr: 'Tank swap !',
          };
        }
      },
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
            en: 'Tank Busters',
          };
        }
      },
    },
    {
      id: 'E3S Undersea Quake Outside',
      regex: / 14:3FEF:Leviathan starts using Undersea Quake/,
      regexFr: / 14:3FEF:Léviathan starts using Séisme Sous-Marin/,
      alertText: {
        en: 'Get Middle',
        fr: 'Allez au centre',
      },
    },
    {
      id: 'E3S Undersea Quake Outside',
      regex: / 14:3FEE:Leviathan starts using Undersea Quake/,
      regexFr: / 14:3FEE:Léviathan starts using Séisme Sous-Marin/,
      alarmText: {
        en: 'Go Outside',
        fr: 'Allez sur les côtés',
      },
    },
    {
      id: 'E3S Flare',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0057:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Flare on YOU',
      },
    },
    {
      id: 'E3S Drenching Pulse',
      regex: / 14:3FE2:Leviathan starts using Drenching Pulse/,
      infoText: {
        en: 'Stack, Bait Puddles',
      },
    },
    {
      id: 'E3S Drenching Pulse Puddles',
      regex: / 14:3FE2:Leviathan starts using Drenching Pulse/,
      delaySeconds: 2.9,
      infoText: {
        en: 'Drop Puddles Outside',
      },
    },
    {
      id: 'E3S Roiling Pulse',
      regex: / 14:3FE4:Leviathan starts using Roiling Pulse/,
      infoText: {
        en: 'Stack, Bait Puddles',
      },
    },
    {
      id: 'E3S Roiling Pulse Abilities',
      regex: / 14:3FE4:Leviathan starts using Roiling Pulse/,
      delaySeconds: 2.9,
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Flare To Outside Corner',
          };
        }
        return {
          en: 'Stack Outside, Avoid Flares',
        };
      },
    },
    {
      id: 'E3S Stormy Horizon',
      regex: / 14:3FE9:Leviathan starts using Stormy Horizon/,
      infoText: {
        en: 'Panto Puddles x5',
      },
    },
    {
      id: 'E3S Hydrothermal Vent Tether',
      regex: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Leviathan:....:....:005A:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Puddle Tether on YOU',
      },
    },
    {
      id: 'E3S Hydrothermal Vent Collect',
      regex: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Leviathan:....:....:005A:/,
      run: function(data, matches) {
        data.vent = data.vent || [];
        data.vent.push(matches[1]);
      },
    },
    {
      id: 'E3S Hydrothermal Vent Collect',
      regex: / 23:\y{ObjectId}:\y{Name}:\y{ObjectId}:Leviathan:....:....:005A:/,
      condition: function(data) {
        return data.vent.length == 2 && data.vent.indexOf(data.me) == -1 && data.role != 'tank';
      },
      infoText: {
        en: 'Pop alternating bubbles',
      },
    },
    {
      id: 'E3S Surging Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Surging Waters/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Initial knockback on YOU',
      },
    },
    {
      // TODO probably need to call out knockbacks later
      // TODO maybe tell other people about stacking for knockbacks
      id: 'E3S Sundering Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Sundering Waters from (?:.*) for (.*) Seconds/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: function(data, matches) {
        let seconds = matches[2];
        if (seconds <= 8) {
          return {
            en: 'Knockback on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        let seconds = matches[2];
        if (seconds <= 8)
          return;
        if (seconds <= 21) {
          return {
            en: 'Late First Knockback',
          };
        }
        return {
          en: 'Late Second Knockback',
        };
      },
    },
    {
      // 29 seconds
      id: 'E3S Scouring Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Scouring Waters/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Defamation',
      },
    },
    {
      id: 'E3S Scouring Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Scouring Waters/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: 22,
      infoText: {
        en: 'Avoid Knockback, Move to Back',
      },
    },
    {
      id: 'E3S Smothering Waters',
      regex: / 1A:\y{ObjectId}:\y{Name} gains the effect of Smothering Waters from (?:.*) (.*) Seconds/,
      condition: function(data, matches) {
        // first tsunami stack is 25 seconds
        // second tsunami stack is 13 seconds
        // Everybody is in first stack, but tanks not in the second.
        return parseFloat(matches[2]) > 15 || data.role != 'tank';
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches[2]) - 3;
      },
      suppressSeconds: 1,
      alertText: {
        en: 'Stack',
      },
    },
    {
      id: 'E3S Scouring Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Scouring Waters/,
      condition: function(data, matches) {
        return data.me != matches[1];
      },
      delaySeconds: 25,
      infoText: {
        en: 'Move In, Avoid Defamation',
      },
    },
    {
      id: 'E3S Sweeping Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Sweeping Waters from (?:.*) for (.*) Seconds/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Tank Cone',
      },
    },
    {
      id: 'E3S Sweeping Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Sweeping Waters from (?:.*) for (.*) Seconds/,
      condition: function(data, matches) {
        return data.me == matches[1] || data.role == 'tank';
      },
      delaySeconds: 13,
      suppressSeconds: 1,
      infoText: {
        en: 'Tank Cone',
      },
    },
    {
      id: 'E3S Refreshed',
      regex: / 14:400F:Leviathan starts using Refreshing Shower/,
      run: function(data) {
        data.refreshed = true;
      },
    },
    {
      id: 'E3S Front Left Temporary Current',
      regex: / 14:3FEB:Leviathan starts using Temporary Current/,
      infoText: {
        en: 'left front / back right',
      },
    },
    {
      id: 'E3S Front Right Temporary Current',
      regex: / 14:3FEA:Leviathan starts using Temporary Current/,
      infoText: {
        en: 'right front / back left',
      },
    },
    {
      // Note: there are different abilities for the followup
      // temporary current, but there's only a 1 second cast time.
      // The original has a 6 second cast time and 4 seconds before
      // the next one.
      id: 'E3S Front Left Temporary Current 2',
      regex: / 14:3FEA:Leviathan starts using Temporary Current/,
      condition: function(data) {
        return data.refreshed;
      },
      delaySeconds: 6.2,
      alertText: {
        en: 'left front / back right',
      },
    },
    {
      id: 'E3S Front Right Temporary Current 2',
      regex: / 14:3FEB:Leviathan starts using Temporary Current/,
      condition: function(data) {
        return data.refreshed;
      },
      delaySeconds: 6.2,
      alertText: {
        en: 'right front / back left',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Leviathan': 'Leviathan',
        'Engage!': 'Start!'
      },
      'replaceText': {
        'Unknown Ability': 'Unknown Ability',
        'Undersea Quake': 'Unterwasserbeben',
        'Tsunami': 'Sturzflut',
        'Tidal Wave': 'Flutwelle',
        'Tidal Roar': 'Schrei der Gezeiten',
        'Tidal Rage': 'Wütende Flut',
        'The Storm': 'Durch den Mahlstrom',
        'The Calm': 'Versenkende Flut',
        'Temporary Current': 'Unstete Gezeiten',
        'Swirling Tsunami': 'Wirbelnde Sturzflut',
        'Sweeping Tsunami': 'Auflösende Sturzflut',
        'Surging Tsunami': 'Erdrückende Sturzflut',
        'Sundering Tsunami': 'Zerstörende Sturzflut',
        'Stormy Horizon': 'Stürmische See',
        'Spinning Dive': 'Drehsprung',
        'Spilling Wave': 'Schäumende Welle',
        'Smothering Tsunami': 'Ertränkende Sturzflut',
        'Scouring Tsunami': 'Böige Sturzflut',
        'Roiling Pulse': 'Wüstende Wogen',
        'Rip Current': 'Brandungsrückstrom',
        'Refreshing Shower': 'Erwachen der Tiefen',
        'Plunging Wave': 'Donnernde Welle',
        'Monster Wave': 'Monsterwelle',
        'Maelstrom': 'Mahlstrom',
        'Killer Wave': 'Tödliche Welle',
        'Hydrothermal Vent': 'Hydrothermale Quelle',
        'Hot Water': 'Heißes Wasser',
        'Freak Wave': 'Gigantische Welle',
        'Enrage': 'Finalangriff',
        'Drenching Pulse': 'Tosende Wogen',
        'Breaking Wave': 'Schmetternde Welle',
        'Black Smokers': 'Schwarzer Raucher',
        'Backbreaking Wave': 'Verwüstende Welle',
        '--untargetable--': '--nich anvisierbar--',
        '--targetable--': '--anvisierbar--'
      },
      '~effectNames': {
        'Swirling Waters': 'Omen des Wasserwirbels',
        'Sweeping Waters': 'Omen der Auflösung',
        'Surging Waters': 'Omen der Erdrückung',
        'Sundering Waters': 'Omen der Zerstörung',
        'Splashing Waters': 'Omen des Sturms',
        'Smothering Waters': 'Omen der Ertränkung',
        'Scouring Waters': 'Omen der Böen',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Heavy': 'Gewicht'
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Leviathan': 'Léviathan',
        'Engage!': 'À l\'attaque'
      },
      'replaceText': {
        'Unknown Ability': 'Unknown Ability',
        'Undersea Quake': 'Séisme sous-marin',
        'Tsunami': 'Tsunami',
        'Tidal Wave': 'Raz-de-marée',
        'Tidal Roar': 'Vague rugissante',
        'Tidal Rage': 'Furie des marées',
        'The Storm': 'Spirale du chaos',
        'The Calm': 'Onde naufrageuse',
        'Temporary Current': 'Courant évanescent',
        'Swirling Tsunami': 'Tsunami tournoyant',
        'Sweeping Tsunami': 'Tsunami pulvérisant',
        'Surging Tsunami': 'Tsunami écrasant',
        'Sundering Tsunami': 'Tsunami fracturant',
        'Stormy Horizon': 'Mer déchaînée',
        'Spinning Dive': 'Piqué tournant',
        'Spilling Wave': 'Vague déversante',
        'Smothering Tsunami': 'Tsunami submergeant',
        'Scouring Tsunami': 'Tsunami dévastateur',
        'Roiling Pulse': 'Pulsation ravageuse',
        'Rip Current': 'Courant d\'arrachement',
        'Refreshing Shower': 'Éveil de l\'eau',
        'Plunging Wave': 'Vague plongeante',
        'Monster Wave': 'Vague monstrueuse',
        'Maelstrom': 'Maelström',
        'Killer Wave': 'Vague meurtrière',
        'Hydrothermal Vent': 'Cheminées hydrothermales',
        'Hot Water': 'Eau bouillante',
        'Freak Wave': 'Vague gigantesque',
        'Enrage': 'Enrage',
        'Drenching Pulse': 'Pulsation sauvage',
        'Breaking Wave': 'Vague brisante',
        'Black Smokers': 'Fumeurs noirs',
        'Backbreaking Wave': 'Vague dévastatrice',
        '--untargetable--': '--Impossible à cibler--',
        '--targetable--': '--Ciblable--',
        '--sync--': '--Synchronisation--',
        '--Reset--': '--Réinitialisation--'
      },
      '~effectNames': {
        'Swirling Waters': 'Eaux tournoyantes',
        'Sweeping Waters': 'Eaux pulvérisantes',
        'Surging Waters': 'Eaux écrasantes',
        'Sundering Waters': 'Eaux fracturantes',
        'Splashing Waters': 'Eaux déferlantes',
        'Smothering Waters': 'Eaux submergeantes',
        'Scouring Waters': 'Eaux dévastatrices',
        'Magic Vulnerability Up': 'Vulnérabilité Magique Augmentée',
        'Heavy': 'Pesanteur'
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Leviathan': 'リヴァイアサン',
        'Engage!': '戦闘開始！'
      },
      'replaceText': {
        'Unknown Ability': 'Unknown Ability',
        'Undersea Quake': 'アンダーシークエイク',
        'Tsunami': '大海嘯',
        'Tidal Wave': 'タイダルウェイブ',
        'Tidal Roar': 'タイダルロア',
        'Tidal Rage': 'タイダルレイジ',
        'The Storm': '混沌の渦動',
        'The Calm': '沈溺の波動',
        'Temporary Current': 'テンポラリーカレント',
        'Swirling Tsunami': '渦動の大海嘯',
        'Sweeping Tsunami': '拡散の大海嘯',
        'Surging Tsunami': '強圧の大海嘯',
        'Sundering Tsunami': '断絶の大海嘯',
        'Stormy Horizon': '大時化',
        'Spinning Dive': 'スピニングダイブ',
        'Spilling Wave': 'スピリングウェイブ',
        'Smothering Tsunami': '溺没の大海嘯',
        'Scouring Tsunami': '暴風の大海嘯',
        'Roiling Pulse': '苛烈なる波動',
        'Rip Current': 'リップカレント',
        'Refreshing Shower': '水の覚醒',
        'Plunging Wave': 'プランジングウェイブ',
        'Monster Wave': 'モンスターウェイブ',
        'Maelstrom': 'メイルシュトローム',
        'Killer Wave': 'キラーウェイブ',
        'Hydrothermal Vent': 'ハイドロサーマルベント',
        'Hot Water': '熱水',
        'Freak Wave': 'フリークウェイブ',
        'Drenching Pulse': '猛烈なる波動',
        'Breaking Wave': 'ブレーキングウェイブ',
        'Black Smokers': 'ブラックスモーカー',
        'Backbreaking Wave': 'バックブレーキングウェイブ'
      },
      '~effectNames': {
        'Swirling Waters': '渦動の兆し',
        'Sweeping Waters': '拡散の兆し',
        'Surging Waters': '強圧の兆し',
        'Sundering Waters': '断絶の兆し',
        'Splashing Waters': '強風の兆し',
        'Smothering Waters': '溺没の兆し',
        'Scouring Waters': '暴風の兆し',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Heavy': 'ヘヴィ'
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Leviathan': '利维亚桑',
        'Engage!': '战斗开始！'
      },
      'replaceText': {
        'Unknown Ability': 'Unknown Ability'
      },
      '~effectNames': {
        'Magic Vulnerability Up': '魔法受伤加重',
        'Heavy': '加重'
      },
    },
  ],
}];
