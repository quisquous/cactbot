'use strict';

// TODO: ravensflight calls
// TODO: in/out calls for your orange/blue add, dynamo 4EB0, chariot 4EB1
// TODO: there's no 23: message for tethers, so is likely part of add spawn?

[{
  zoneRegex: {
    en: /^Cinder Drift \(Extreme\)$/,
  },
  zoneId: ZoneId.CinderDriftExtreme,
  timelineFile: 'ruby_weapon-ex.txt',
  timelineTriggers: [
    {
      id: 'RubyEx Magitek Meteor Behind',
      regex: /Magitek Meteor/,
      beforeSeconds: 4,
      alertText: {
        en: 'Hide Behind Meteor',
        de: 'Hinter dem Meteor verstecken',
        fr: 'Cachez-vous derrière le météore',
        cn: '躲在陨石后',
        ko: '운석 뒤에 숨기',
      },
    },
    {
      id: 'RubyEx Magitek Meteor Away',
      regex: /Magitek Meteor/,
      beforeSeconds: 0,
      infoText: {
        en: 'Away From Meteor',
        de: 'Weg vom Meteor',
        fr: 'Éloignez-vous du météore',
        cn: '远离陨石',
        ko: '운석에게서 멀어지기',
      },
    },
  ],
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
        cn: '远离线',
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
        cn: '靠近线',
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
      id: 'RubyEx High-Powered Homing Lasers You',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AD8' }),
      regexDe: Regexes.startsUsing({ source: 'Rubin-Waffe', id: '4AD8' }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4AD8' }),
      regexJa: Regexes.startsUsing({ source: 'ルビーウェポン', id: '4AD8' }),
      condition: Conditions.targetIsYou(),
      response: Responses.stackOn('alert'),
    },
    {
      id: 'RubyEx High-Powered Homing Lasers',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AD8' }),
      regexDe: Regexes.startsUsing({ source: 'Rubin-Waffe', id: '4AD8' }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4AD8' }),
      regexJa: Regexes.startsUsing({ source: 'ルビーウェポン', id: '4AD8' }),
      condition: Conditions.targetIsNotYou(),
      response: Responses.stack('info'),
    },
    {
      id: 'RubyEx Raven\'s Image',
      regex: Regexes.addedCombatantFull({ name: 'Raven\'s Image' }),
      regexDe: Regexes.addedCombatantFull({ name: 'Naels Trugbild' }),
      regexFr: Regexes.addedCombatantFull({ name: 'Spectre De Nael' }),
      regexJa: Regexes.addedCombatantFull({ name: 'ネールの幻影' }),
      run: function(data, matches) {
        // 112,108 (east)
        // 88,108 (west)
        // TODO: it's impossible to do anything with this now,
        // as there's no actor id in the startsUsing line.  T_T
        data.ravens = data.ravens || {};
        if (matches.x < 100)
          data.ravens.red = matches.id;
        else
          data.ravens.blue = matches.id;
      },
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
        cn: '狂暴',
        ko: '전멸기!',
      },
    },
    {
      id: 'RubyEx Pall of Rage',
      netRegex: NetRegexes.gainsEffect({ effectId: '8A2' }),
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
            cn: '攻击蓝色(东)',
            ko: '파란색 공격 (오른쪽)',
          };
        }
      },
    },
    {
      id: 'RubyEx Pall of Grief',
      netRegex: NetRegexes.gainsEffect({ effectId: '8A3' }),
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
            cn: '攻击红色(西)',
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
      id: 'RubyEx Raven Death',
      netRegex: NetRegexes.losesEffect({ effectId: '8A3', capture: false }),
      suppressSeconds: 10,
      run: function(data) {
        // This effect persists through death, and is removed off of everybody
        // about two seconds before the 19: defeated log line.
        // TODO: it'd be nice to say to attack the other add, if you knew which one was dead.
        data.ravenDead = true;
      },
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
        data.ravens = data.ravens || {};

        let tmp = data.ravens.red;
        data.ravens.red = data.ravens.blue;
        data.ravens.blue = tmp;
      },
      // This gets cast twice (maybe once for each add)?
      suppressSeconds: 1,
      infoText: function(data) {
        // TODO: it'd be nice to call out which raven was alive?
        if (data.ravenDead)
          return;
        if (data.colors[data.me] == 'red') {
          return {
            en: 'Attack Red (East)',
            de: 'Greife Rot an (Osten)',
            fr: 'Attaquez le rouge (Est)',
            cn: '攻击红色(东)',
            ko: '빨간색 공격 (오른쪽)',
          };
        }
        return {
          en: 'Attack Blue (West)',
          de: 'Greife Blau an (Westen)',
          fr: 'Attaquez le bleu (Ouest)',
          cn: '攻击蓝色(西)',
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
      id: 'RubyEx Meteor',
      regex: Regexes.headMarker({ id: '00(?:C[A-F]|D0|D1)' }),
      condition: Conditions.targetIsYou(),
      infoText: function(data, matches) {
        return parseInt(matches.id, 16) - parseInt('00CA', 16) + 1;
      },
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
      id: 'RubyEx Magitek Meteor Burst',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AF0', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Rubin-Waffe', id: '4AF0', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4AF0', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ルビーウェポン', id: '4AF0', capture: false }),
      infoText: {
        en: 'Away from Meteor!',
        de: 'Weg vom Meteor!',
        fr: 'Éloignez-vous du météore !',
        cn: '远离陨石',
        ko: '운석에게서 멀어지기',
      },
    },
    {
      id: 'RubyEx Mark II Magitek Comet Tank',
      regex: Regexes.ability({ source: 'The Ruby Weapon', id: '4AB6', capture: false }),
      regexDe: Regexes.ability({ source: 'Rubin-Waffe', id: '4AB6', capture: false }),
      regexFr: Regexes.ability({ source: 'Arme Rubis', id: '4AB6', capture: false }),
      regexJa: Regexes.ability({ source: 'ルビーウェポン', id: '4AB6', capture: false }),
      condition: (data) => data.role == 'tank',
      delaySeconds: 11.5,
      alarmText: {
        en: 'Stand in Meteor Tankbuster',
        de: 'Stehe im Meteor - Tankbuster',
        fr: 'Tank buster, Restez dans la comète',
        cn: '接刀',
        ko: '운석 막기',
      },
    },
    {
      id: 'RubyEx Mark II Magitek Comet Other',
      regex: Regexes.ability({ source: 'The Ruby Weapon', id: '4AB6', capture: false }),
      regexDe: Regexes.ability({ source: 'Rubin-Waffe', id: '4AB6', capture: false }),
      regexFr: Regexes.ability({ source: 'Arme Rubis', id: '4AB6', capture: false }),
      regexJa: Regexes.ability({ source: 'ルビーウェポン', id: '4AB6', capture: false }),
      condition: (data) => data.role != 'tank',
      delaySeconds: 13,
      alertText: {
        en: 'Kill Meteor Adds',
        de: 'Besiege die Meteor Adds',
        fr: 'Tuez les comètes',
        cn: '击杀陨石',
        ko: '운석 부수기',
      },
    },
    {
      id: 'RubyEx Bradamante',
      regex: Regexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Avoid tanks with laser',
        de: 'Tanks nicht mit dem Laser treffen',
        fr: 'Évitez les tanks avec votre laser',
        cn: '躲开坦克激光',
        ko: '레이저 대상자 - 탱커 피하기',
      },
    },
    {
      id: 'RubyEx Mark II Magitek Comet Directions',
      regex: Regexes.addedCombatantFull({ name: 'Comet' }),
      regexDe: Regexes.addedCombatantFull({ name: 'Komet' }),
      regexFr: Regexes.addedCombatantFull({ name: 'Comète' }),
      regexJa: Regexes.addedCombatantFull({ name: 'コメット' }),
      regexCn: Regexes.addedCombatantFull({ name: '彗星' }),
      regexKo: Regexes.addedCombatantFull({ name: '혜성' }),
      infoText: function(data, matches) {
        // Possible positions:
        // 85.16,100.131 and 115.16,100.131
        // 100.16,85.13102 and 100.16,115.131
        if (matches.y < 90) {
          return {
            en: 'Comets N/S',
            de: 'Meteor N/S',
            fr: 'Comètes N/S',
            cn: '彗星 北/南',
            ko: '남/북 운석 낙하',
          };
        } else if (matches.x < 90) {
          return {
            en: 'Comets E/W',
            de: 'Meteor O/W',
            fr: 'Comètes E/O',
            cn: '彗星 东/西',
            ko: '동/서 운석낙하',
          };
        }
      },
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
        'Ruby Bit': 'Rubin-Drohne',
        'Raven\'s Image': 'Naels Trugbild',
        'Meteor': 'Meteor',
        'Comet': 'Komet',
      },
      'replaceText': {
        'Undermine': 'Untergraben',
        'Stamp': 'Zerstampfen',
        'Spike Of Flame': 'Flammenstachel',
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
        'Bradamante': 'Bradamante',
        'Burst': 'Explosion',
        'Chariot/Dynamo': 'Streitwagen/Dynamo',
        'Dalamud Impact': 'Dalamud-Sturz',
        'Landing': 'Einschlag',
        'Change Of Heart': 'Sinneswandel',
        'Cut And Run': 'Klauensturm',
        'Greater Memory': 'Tiefe Erinnerung',
        'High-Powered Homing Lasers': 'Hochenergie-Leitlaser',
        'Magitek Meteor': 'Magitek-Meteor',
        'Mark II Magitek Comet': 'Magitek-Komet Stufe II',
        'Meteor Mine': 'Meteorsprengung',
        'Meteor Project': 'Projekt Meteor',
        'Meteor Stream': 'Meteorflug',
        'Negative Affect': 'Affectus Negativa',
        'Negative Aura': 'Aura Negativa',
        'Negative Personae': 'Persona Negativa',
        'Outrage': 'Empörung',
        'Ruby Claw': 'Rubin-Klauen',
        'Screech': 'Kreischen',
        'Tank Comets': 'Tank Meteore',
        '--cutscene--': '--Zwischensequenz--',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Comet': 'Comète',
        'Meteor': 'Météore',
        'Ruby Bit': 'Drones rubis',
        'Raven\'s Image': 'Spectre De Nael',
        'The Ruby Weapon': 'Arme Rubis',
      },
      'replaceText': {
        '\\?': ' ?',
        '--cutscene--': '--cinématique--',
        'Undermine': 'Griffe souterraine',
        'Tank Comets': 'Comètes Tank',
        'Stamp': 'Piétinement sévère',
        'Spike Of Flame': 'Explosion de feu',
        'Screech': 'Éclat de voix',
        'Ruby Sphere': 'Sphère rubis',
        'Ruby Ray': 'Rayon rubis',
        'Ruby Dynamics': 'Générateur rubis',
        'Ruby Claw': 'Griffe rubis',
        'Retract': 'Rétraction',
        'Ravensflight': 'Vol du rapace',
        'Ravensclaw': 'Griffes du rapace',
        'Outrage': 'Indignation',
        'Optimized Ultima': 'Ultima magitek',
        'Negative Personae': 'Ipséité négative',
        'Negative Aura': 'Aura négative',
        'Negative Affect': 'Affect négatif',
        'Meteor Stream': 'Rayon météore',
        'Meteor Project': 'Projet Météore',
        'Meteor Mine': 'Météore explosif',
        'Mark II Magitek Comet': 'Comète magitek II',
        'Magitek Ray': 'Laser magitek',
        'Magitek Meteor': 'Météore magitek',
        '(?<! )Magitek Comet': 'Comète magitek',
        'Magitek Charge': 'Éthéroplasma magitek',
        'Magitek Bit': 'Éjection de drones',
        'Landing': 'Atterrissage rapide',
        'Liquefaction': 'Sables mouvants',
        '(?<! )Homing Lasers': 'Lasers autoguidés',
        'High-Powered Homing Lasers': 'Lasers autoguidés surpuissants',
        'Helicoclaw': 'Héliogriffes',
        'Greater Memory': 'Expansion mémorielle',
        'Flexiclaw': 'Flexigriffes',
        'Dalamud Impact': 'Impact de Dalamud',
        'Cut And Run': 'Ruée de griffes',
        'Chariot/Dynamo': 'Char/Dynamo',
        'Change Of Heart': 'Changement émotionnel',
        'Burst': 'Explosion',
        'Bradamante': 'Bradamante',
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
    },
  ],
}];
