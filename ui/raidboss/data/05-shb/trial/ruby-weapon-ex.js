'use strict';

// TODO: ravensflight calls
// TODO: in/out calls for your orange/blue add, dynamo 4EB0, chariot 4EB1
// TODO: stop calling out switch on adds if the other add is dead, etc
// TODO: get behind meteor
// TODO: get away from last exploding meteor
// TODO: tank calls to pick up meteors
// TODO: bradamante calls (avoid tanks)

[{
  zoneRegex: {
    en: /^Cinder Drift \(Extreme\)$/,
  },
  timelineFile: 'ruby-weapon-ex.txt',
  triggers: [
    {
      id: 'RubyEx Optimized Ultima',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4ABE', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Rubin-Waffe', id: '4ABE', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4ABE', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ルビーウェポン', id: '4ABE', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      response: Responses.aoe(),
    },
    {
      id: 'RubyEx Stamp',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4B03' }),
      regexDe: Regexes.startsUsing({ source: 'Rubin-Waffe', id: '4B03' }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4B03' }),
      regexJa: Regexes.startsUsing({ source: 'ルビーウェポン', id: '4B03' }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'RubyEx Undermine',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AD0', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Rubin-Waffe', id: '4AD0', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4AD0', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ルビーウェポン', id: '4AD0', capture: false }),
      infoText: {
        en: 'Away from Lines',
        de: 'Weg von den Linien',
        fr: 'En dehors des sillons',
        ko: '선 피하기',
      },
    },
    {
      id: 'RubyEx Liquefaction',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4ACF', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Rubin-Waffe', id: '4ACF', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4ACF', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ルビーウェポン', id: '4ACF', capture: false }),
      alertText: {
        en: 'Get On Lines',
        de: 'Auf die Linien gehen',
        fr: 'Sur les sillons',
        ko: '선 위로 올라가기',
      },
    },
    {
      id: 'RubyEx Ruby Ray',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4B02', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Rubin-Waffe', id: '4B02', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4B02', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ルビーウェポン', id: '4B02', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'RubyEx Cut And Run',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4B05', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Rubin-Waffe', id: '4B05', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4B05', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ルビーウェポン', id: '4B05', capture: false }),
      response: Responses.goSides(),
    },
    {
      id: 'RubyEx High-Powered Homing Lasers',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AD8' }),
      regexDe: Regexes.startsUsing({ source: 'Rubin-Waffe', id: '4AD8' }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4AD8' }),
      regexJa: Regexes.startsUsing({ source: 'ルビーウェポン', id: '4AD8' }),
      condition: Conditions.targetIsYou(),
      response: Responses.stackOn(),
    },
    {
      // Enrage can start casting before Ruby Weapon has finished their rotation
      // Give a friendly reminder to pop LB3 if you haven't already
      id: 'RubyEx Optimized Ultima Enrage',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4B2D', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Rubin-Waffe', id: '4B2D', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4B2D', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ルビーウェポン', id: '4B2D', capture: false }),
      infoText: {
        en: 'Enrage!',
        de: 'Finalangriff!',
        fr: 'Enrage !',
        ko: '전멸기!',
      },
    },
    {
      id: 'RubyEx Pall of Rage',
      regex: Regexes.gainsEffect({ effect: 'Pall of Rage' }),
      regexDe: Regexes.gainsEffect({ effect: 'Zorn' }),
      regexFr: Regexes.gainsEffect({ effect: 'Fureur' }),
      regexJa: Regexes.gainsEffect({ effect: '憤怒' }),
      preRun: function(data, matches) {
        data.colors = data.colors || [];
        data.colors[matches.target] = 'blue';
      },
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Attack Blue (East)',
            de: 'Greife Blau an (Osten)',
            fr: 'Attaquez le bleu (Est)',
            ko: '파란색 공격 (오른쪽)',
          };
        }
      },
    },
    {
      id: 'RubyEx Pall of Grief',
      regex: Regexes.gainsEffect({ effect: 'Pall of Grief' }),
      regexDe: Regexes.gainsEffect({ effect: 'Trauer' }),
      regexFr: Regexes.gainsEffect({ effect: 'Angoisse' }),
      regexJa: Regexes.gainsEffect({ effect: '悲嘆' }),
      preRun: function(data, matches) {
        data.colors = data.colors || [];
        data.colors[matches.target] = 'red';
      },
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Attack Red (West)',
            de: 'Greife Rot an (Westen)',
            fr: 'Attaquez le rouge (Ouest)',
            ko: '빨간색 공격 (왼쪽)',
          };
        }
      },
    },
    {
      id: 'RubyEx Meteor Stream',
      regex: Regexes.headMarker({ id: '00E0' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'RubyEx Ruby Claw',
      regex: Regexes.startsUsing({ source: 'Raven\'s Image', id: '4AFF' }),
      regexDe: Regexes.startsUsing({ source: 'Naels Trugbild', id: '4AFF' }),
      regexFr: Regexes.startsUsing({ source: 'Spectre De Nael', id: '4AFF' }),
      regexJa: Regexes.startsUsing({ source: 'ネールの幻影', id: '4AFF' }),
      condition: function(data, matches) {
        if (data.role != 'healer' || data.role != 'tank')
          return false;
        if (data.colors[data.me] == data.colors[matches.target])
          return true;
      },
      suppressSeconds: 1,
      response: Responses.tankBuster(),
    },
    {
      id: 'RubyEx Change of Heart',
      regex: Regexes.ability({ source: 'The Ruby Weapon', id: '4AFC', capture: false }),
      regexDe: Regexes.ability({ source: 'Rubin-Waffe', id: '4AFC', capture: false }),
      regexFr: Regexes.ability({ source: 'Arme Rubis', id: '4AFC', capture: false }),
      regexJa: Regexes.ability({ source: 'ルビーウェポン', id: '4AFC', capture: false }),
      preRun: function(data) {
        for (color of data.colors) {
          if (color == 'blue')
            color = 'red';
          else
            color = 'blue';
        }
      },
      infoText: function(data) {
        if (data.colors[data.me] == 'red') {
          return {
            en: 'Attack Red (East)',
            de: 'Greife Rot an (Osten)',
            fr: 'Attaquez le rouge (Est)',
            ko: '빨간색 공격 (오른쪽)',
          };
        }
        return {
          en: 'Attack Blue (West)',
          de: 'Greife Blau an (Westen)',
          fr: 'Attaquez le bleu (Ouest)',
          ko: '파란색 공격 (왼쪽)',
        };
      },
    },
    {
      id: 'RubyEx Negative Aura',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AFE', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Rubin-Waffe', id: '4AFE', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4AFE', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ルビーウェポン', id: '4AFE', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'RubyEx Screech',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AEE', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Rubin-Waffe', id: '4AEE', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4AEE', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ルビーウェポン', id: '4AEE', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'RubyEx Outrage',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4B04', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Rubin-Waffe', id: '4B04', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4B04', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ルビーウェポン', id: '4B04', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      response: Responses.aoe(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'The Ruby Weapon': 'Rubin-Waffe',
      },
      'replaceText': {
        'Undermine': 'Untergraben',
        'Stamp': 'Zerstampfen',
        'Spike of Flame': 'Flammenstachel',
        'Ruby Sphere': 'Rubin-Sphäre',
        'Ruby Ray': 'Rubin-Strahl',
        'Ruby Dynamics': 'Rubin-Dynamo',
        'Retract': 'Einziehen',
        'Ravensflight': 'Flug des Raben',
        'Ravensclaw': 'Rabenklauen',
        'Optimized Ultima': 'Ultima-System',
        'Magitek Ray': 'Magitek-Laser',
        'Magitek Charge': 'Magitek-Sprengladung',
        'Magitek Bit': 'Magitek-Bit',
        'Liquefaction': 'Verflüssigen',
        '(?<! )Homing Lasers': 'Leitlaser',
        'High-powered Homing Lasers': 'Hochenergie-Leitlaser',
        'Helicoclaw': 'Spiralklauen',
        'Flexiclaw': 'Flex-Klauen',
        'Cut and Run': 'Klauensturm',
      },
      '~effectNames': {
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Burns': 'Brandwunde',
        'Brink of Death': 'Sterbenselend',
        'Blunt Resistance Down': 'Schlagresistenz -',
        '6 Fulms Under': 'Versinkend',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'The Ruby Weapon': 'Arme Rubis',
      },
      'replaceText': {
        'Undermine': 'Griffe souterraine',
        'Stamp': 'Piétinement sévère',
        'Spike of Flame': 'Explosion de feu',
        'Ruby Sphere': 'Sphère rubis',
        'Ruby Ray': 'Rayon rubis',
        'Ruby Dynamics': 'Générateur rubis',
        'Retract': 'Rétraction',
        'Ravensflight': 'Vol du rapace',
        'Ravensclaw': 'Griffes du rapace',
        'Optimized Ultima': 'Ultima magitek',
        'Magitek Ray': 'Laser magitek',
        'Magitek Charge': 'Éthéroplasma magitek',
        'Magitek Bit': 'Éjection de drones',
        'Liquefaction': 'Sables mouvants',
        '(?<! )Homing Lasers': 'Lasers autoguidés',
        'High-powered Homing Lasers': 'Lasers autoguidés surpuissants',
        'Helicoclaw': 'Héliogriffes',
        'Flexiclaw': 'Flexigriffes',
        'Cut and Run': 'Ruée de griffes',
      },
      '~effectNames': {
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
        'Burns': 'Brûlure',
        'Brink of Death': 'Mourant',
        'Blunt Resistance Down': 'Résistance au contondant réduite',
        '6 Fulms Under': 'Enfoncement',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'The Ruby Weapon': 'ルビーウェポン',
      },
      'replaceText': {
        'Undermine': 'クローマイン',
        'Stamp': 'ストンピング',
        'Spike of Flame': '爆炎',
        'Ruby Sphere': 'ルビースフィア',
        'Ruby Ray': 'ルビーレイ',
        'Ruby Dynamics': 'ルビーダイナモ',
        'Retract': '引き抜く',
        'Ravensflight': 'レイヴェンダイブ',
        'Ravensclaw': 'レイヴェンクロー',
        'Optimized Ultima': '魔導アルテマ',
        'Magitek Ray': '魔導レーザー',
        'Magitek Charge': '魔導爆雷',
        'Magitek Bit': 'ビット射出',
        'Liquefaction': 'リクェファクション',
        '(?<! )Homing Lasers': '誘導レーザー',
        'High-powered Homing Lasers': '高出力誘導レーザー',
        'Helicoclaw': 'スパイラルクロー',
        'Flexiclaw': 'フレキシブルクロー',
        'Cut and Run': 'クロースラッシュ',
      },
      '~effectNames': {
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Burns': '火傷',
        'Brink of Death': '衰弱［強］',
        'Blunt Resistance Down': '打属性耐性低下',
        '6 Fulms Under': '沈下',
      },
    },
  ],
}];
