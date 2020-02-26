'use strict';

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
      preRun: function(data) {
        data.rubyCounter = data.rubyCounter || 0;
        data.rubyCounter++;
      },
      infoText: {
        en: 'Away from Lines',
        fr: 'En dehors des sillons',
        ko: '선 피하기',
      },
    },
    {
      id: 'RubyEx Liquefaction',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AEC', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Rubin-Waffe', id: '4AEC', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4AEC', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ルビーウェポン', id: '4AEC', capture: false }),
      preRun: function(data) {
        data.rubyCounter = data.rubyCounter || 0;
        data.rubyCounter++;
      },
      alertText: function(data) {
        // Ignore Liquefaction casts during dashes
        if (data.rubyCounter % 2) {
          return {
            en: 'Get On Lines',
            fr: 'Sur les sillons',
            ko: '선 위로 올라가기',
          };
        }
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
        fr: 'Enrage !',
        ko: '전멸기!',
      },
    },
    {
      id: 'RubyEx Pall of Rage',
      regex: Regexes.gainsEffect({ effect: 'Pall of Rage' }),
      regexFr: Regexes.gainsEffect({ effect: 'Fureur' }),
      preRun: function(data) {
        data.colors = data.colors || [];
        data.colors[matches.target] = 'blue';
      },
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Attack Blue (East)',
            fr: 'Attaquez le bleu (Est)',
            ko: '파란색 공격 (오른쪽)',
          };
        }
      },
    },
    {
      id: 'RubyEx Pall of Grief',
      regex: Regexes.gainsEffect({ effect: 'Pall of Grief' }),
      regexFr: Regexes.gainsEffect({ effect: 'Angoisse' }),
      preRun: function(data) {
        data.colors = data.colors || [];
        data.colors[matches.target] = 'red';
      },
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Attack Red (West)',
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
      regexFr: Regexes.startsUsing({ source: 'Griffe Rubis', id: '4AFF' }),
      condition: function(data) {
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
      regexDe: Regexes.startsUsing({ source: 'Rubin-Waffe', id: '4AFC', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4AFC', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ルビーウェポン', id: '4AFC', capture: false }),
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
            fr: 'Attaquez le rouge (Est)',
            ko: '빨간색 공격 (오른쪽)',
          };
        }
        return {
          en: 'Attack Blue (West)',
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
        'Homing Lasers': 'Leitlaser',
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
        'Homing Lasers': 'Lasers autoguidés',
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
        'Homing Lasers': '誘導レーザー',
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
