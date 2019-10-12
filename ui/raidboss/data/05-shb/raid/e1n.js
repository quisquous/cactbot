'use strict';

[{
  zoneRegex: /^Eden's Gate: Resurrection$/,
  timelineFile: 'e1n.txt',
  triggers: [
    {
      id: 'E1N Eden\'s Gravity',
      regex: / 14:3D94:Eden Prime starts using Eden's Gravity/,
      regexDe: / 14:3D94:Prim-Eden starts using Eden-Gravitas/,
      regexFr: / 14:3D94:Primo-Éden starts using Gravité Édénique/,
      regexJa: / 14:3D94:エデン・プライム starts using エデン・グラビデ/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'E1N Fragor Maximus',
      regex: / 14:3DA4:Eden Prime starts using Fragor Maximus/,
      regexDe: / 14:3DA4:Prim-Eden starts using Fragor Maximus/,
      regexFr: / 14:3DA4:Primo-Éden starts using Fragor Maximus/,
      regexJa: / 14:3DA4:エデン・プライム starts using フラゴルマクシマス/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'E1N Dimensional Shift',
      regex: / 14:3D9C:Eden Prime starts using Dimensional Shift/,
      regexDe: / 14:3D9C:Prim-Eden starts using Dimensionsverschiebung/,
      regexFr: / 14:3D9C:Primo-Éden starts using Translation Dimensionnelle/,
      regexJa: / 14:3D9C:エデン・プライム starts using ディメンションシフト/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'E1N Eden\'s Flare',
      regex: / 14:3D97:Eden Prime starts using Eden's Flare/,
      regexDe: / 14:3D97:Prim-Eden starts using Eden-Flare/,
      regexFr: / 14:3D97:Primo-Éden starts using Brasier Édénique/,
      regexJa: / 14:3D97:エデン・プライム starts using エデン・フレア/,
      alertText: {
        en: 'Under',
        de: 'Unter ihn',
        fr: 'Sous le boss',
      },
    },
    {
      id: 'E1N Vice of Vanity You',
      regex: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Eden Prime:....:....:0011:/,
      regexDe: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Prim-Eden:....:....:0011:/,
      regexFr: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Primo-Éden:....:....:0011:/,
      regexJa: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:エデン・プライム:....:....:0011:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Tank Laser on YOU',
        de: 'Tank Laser auf DIR',
        fr: 'Tank laser sur VOUS',
      },
    },
    {
      id: 'E1N Spear Of Paradise',
      regex: / 14:3DA1:Eden Prime starts using Spear of Paradise on (\y{Name})/,
      regexDe: / 14:3DA1:Prim-Eden starts using Paradiesspeer on (\y{Name})/,
      regexFr: / 14:3DA1:Primo-Éden starts using Lance [Dd]u [Pp]aradis on (\y{Name})/,
      regexJa: / 14:3DA1:エデン・プライム starts using スピア・オブ・パラダイス on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
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
      id: 'E1N Vice of Apathy Mark',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:001C:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Drop Puddle, Run Middle',
        de: 'Flächen ablegen, danach in die Mitte',
        fr: 'Placez les flaques, courez au centre',
      },
    },
    {
      // 10.5 second cast, maybe warn 6 seconds ahead so that folks bait outside.
      id: 'E1N Pure Light',
      regex: / 14:3DA3:Eden Prime starts using Pure Light/,
      regexDe: / 14:3DA3:Prim-Eden starts using Läuterndes Licht/,
      regexFr: / 14:3DA3:Primo-Éden starts using Lumière Purificatrice/,
      regexJa: / 14:3DA3:エデン・プライム starts using ピュアライト/,
      delaySeconds: 4.5,
      alertText: {
        en: 'Get Behind',
        de: 'Hinter ihn',
        fr: 'Derrière le boss',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Eden Prime': 'Eden Prime',
        'Eden': 'Eden',
        'Engage!': 'Start!',
        'Guardian of Paradise': 'Hüter von Eden',
      },
      'replaceText': {
        'attack': 'Attacke',
        'Vice Of Vanity': 'Laster der Eitelkeit',
        'Vice Of Apathy': 'Laster der Apathie',
        'Vice And Virtue': 'Laster und Tugend',
        'Unto Dust': 'Sprengung',
        'Unknown Ability': 'Unknown Ability',
        'Sunder Pressure': 'Druck',
        'Spear Of Paradise': 'Paradiesspeer',
        'Pure Light': 'Läuterndes Licht',
        'Pure Beam': 'Läuternder Strahl',
        'Primeval Stasis': 'Urzeitliche Stase',
        'Paradise Lost': 'Verlorenes Paradies',
        'Paradisal Dive': 'Paradiessturz',
        'Mana Slice': 'Manahieb',
        'Mana Burst': 'Manastoß',
        'Heavensunder': 'Himmelsdonner',
        'Fragor Maximus': 'Fragor Maximus',
        'Eternal Breath': 'Ewiger Atem',
        'Enrage': 'Finalangriff',
        'Eden\'s Thunder III': 'Eden-Blitzga',
        'Eden\'s Gravity': 'Eden-Gravitas',
        'Eden\'s Flare': 'Eden-Flare',
        'Eden\'s Fire III': 'Eden-Feuga',
        'Eden\'s Blizzard III': 'Eden-Eisga',
        'Dimensional Shift': 'Dimensionsverschiebung',
        'Delta Attack': 'Delta-Attacke',
        '--untargetable--': '--nich anvisierbar--',
        '--targetable--': '--anvisierbar--',
        '--corner--': '--ecke--',
        '--center--': '..mitte--',
      },
      '~effectNames': {
        'Summon Order': 'Egi-Attacke I',
        'Heavy': 'Gewicht',
        'Fetters': 'Gefesselt',
        'Brink of Death': 'Sterbenselend',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Eden Prime': 'Primo-Éden',
        'Engage!': 'À l\'attaque',
      },
      'replaceText': {
        'attack': 'Attaque',
        'Spear Of Paradise': 'Lance du paradis',
        'Vice of Vanity': 'Péché de vanité',
        'Vice of Apathy': 'Péché d\'apathie',
        'Vice and Virtue': 'Vice et vertue',
        'Unto Dust': 'Déflagration',
        'Unknown Ability': 'Unknown Ability',
        'Sunder Pressure': 'Force de pesanteur',
        'Spear of Paradise': 'Lance du paradis',
        'Pure Light': 'Lumière purificatrice',
        'Pure Beam': 'Rayon purificateur',
        'Primeval Stasis': 'Stase primordiale',
        'Paradise Lost': 'Paradis perdu',
        'Paradisal Dive': 'Piqué du paradis',
        'Mana Slice': 'Taillade de mana',
        'Mana Burst': 'Explosion de mana',
        'Heavensunder': 'Ravageur de paradis',
        'Fragor Maximus': 'Fragor Maximus',
        'Eternal Breath': 'Souffle de l\'éternel',
        'Enrage': 'Enrage',
        'Eden\'s Thunder III': 'Méga Foudre édénique',
        'Eden\'s Gravity': 'Gravité édénique',
        'Eden\'s Flare': 'Brasier édénique',
        'Eden\'s Fire III': 'Méga Feu édénique',
        'Eden\'s Blizzard III': 'Méga Glace édénique',
        'Dimensional Shift': 'Translation dimensionnelle',
        'Delta Attack': 'Attaque Delta',
        '--untargetable--': '--Impossible à cibler--',
        '--targetable--': '--Ciblable--',
        '--sync--': '--Synchronisation--',
        '--Reset--': '--Réinitialisation--',
        '--corner--': '--Coin--',
        '--center--': '--Centre--',
      },
      '~effectNames': {
        'Summon Order': 'Action en attente: 1',
        'Heavy': 'Pesanteur',
        'Fetters': 'Attache',
        'Brink of Death': 'Mourant',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Eden Prime': 'Eden Prime',
        'Engage!': '戦闘開始！',
      },
      'replaceText': {
        'attack': '攻撃',
        'Vice of Vanity': 'ヴァイス・オブ・ヴァニティー',
        'Vice of Apathy': 'ヴァイス・オブ・アパシー',
        'Vice and Virtue': 'ヴァイス・アンド・ヴァーチュー',
        'Unto Dust': '爆裂',
        'Unknown Ability': 'Unknown Ability',
        'Sunder Pressure': '重圧',
        'Spear of Paradise': 'スピア・オブ・パラダイス',
        'Pure Light': 'ピュアライト',
        'Pure Beam': 'ピュアレイ',
        'Primeval Stasis': 'プライムイーバルステーシス',
        'Paradise Lost': 'パラダイスロスト',
        'Paradisal Dive': 'パラダイスダイブ',
        'Mana Slice': 'マナスラッシュ',
        'Mana Burst': 'マナバースト',
        'Heavensunder': 'ヘヴンサンダー',
        'Fragor Maximus': 'フラゴルマクシマス',
        'Eternal Breath': 'エターナル・ブレス',
        'Eden\'s Thunder III': 'エデン・サンダガ',
        'Eden\'s Gravity': 'エデン・グラビデ',
        'Eden\'s Flare': 'エデン・フレア',
        'Eden\'s Fire III': 'エデン・ファイガ',
        'Eden\'s Blizzard III': 'エデン・ブリザガ',
        'Dimensional Shift': 'ディメンションシフト',
        'Delta Attack': 'デルタアタック',
      },
      '~effectNames': {
        'Summon Order': 'アクション実行待機I',
        'Heavy': 'ヘヴィ',
        'Fetters': '拘束',
        'Brink of Death': '衰弱［強］',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Eden Prime': 'Eden Prime',
        'Engage!': '战斗开始！',
      },
      'replaceText': {
        'attack': '攻击',
        'Unknown Ability': 'Unknown Ability',
      },
      '~effectNames': {
        'Fetters': '拘束',
        'Brink of Death': '濒死',
      },
    },
  ],
}];
