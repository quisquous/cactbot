'use strict';

// TODO: ravensflight calls
// TODO: in/out calls for your orange/blue add, dynamo 4EB0, chariot 4EB1
// TODO: there's no 23: message for tethers, so is likely part of add spawn?

[{
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
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4ABE', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Rubin-Waffe', id: '4ABE', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Rubis', id: '4ABE', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ルビーウェポン', id: '4ABE', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '红宝石神兵', id: '4ABE', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '루비 웨폰', id: '4ABE', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      response: Responses.aoe(),
    },
    {
      id: 'RubyEx Stamp',
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4B03' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Rubin-Waffe', id: '4B03' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Rubis', id: '4B03' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ルビーウェポン', id: '4B03' }),
      netRegexCn: NetRegexes.startsUsing({ source: '红宝石神兵', id: '4B03' }),
      netRegexKo: NetRegexes.startsUsing({ source: '루비 웨폰', id: '4B03' }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'RubyEx Undermine',
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4AD0', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Rubin-Waffe', id: '4AD0', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Rubis', id: '4AD0', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ルビーウェポン', id: '4AD0', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '红宝石神兵', id: '4AD0', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '루비 웨폰', id: '4AD0', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4ACF', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Rubin-Waffe', id: '4ACF', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Rubis', id: '4ACF', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ルビーウェポン', id: '4ACF', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '红宝石神兵', id: '4ACF', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '루비 웨폰', id: '4ACF', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4B02', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Rubin-Waffe', id: '4B02', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Rubis', id: '4B02', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ルビーウェポン', id: '4B02', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '红宝石神兵', id: '4B02', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '루비 웨폰', id: '4B02', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'RubyEx Cut And Run',
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4B05', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Rubin-Waffe', id: '4B05', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Rubis', id: '4B05', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ルビーウェポン', id: '4B05', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '红宝石神兵', id: '4B05', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '루비 웨폰', id: '4B05', capture: false }),
      response: Responses.goSides(),
    },
    {
      id: 'RubyEx High-Powered Homing Lasers',
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4AD8', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Rubin-Waffe', id: '4AD8', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Rubis', id: '4AD8', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ルビーウェポン', id: '4AD8', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '红宝石神兵', id: '4AD8', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '루비 웨폰', id: '4AD8', capture: false }),
      suppressSeconds: 1,
      response: Responses.stackMarker('alert'),
    },
    {
      id: 'RubyEx Raven\'s Image',
      netRegex: NetRegexes.addedCombatantFull({ name: 'Raven\'s Image' }),
      netRegexDe: NetRegexes.addedCombatantFull({ name: 'Naels Trugbild' }),
      netRegexFr: NetRegexes.addedCombatantFull({ name: 'Spectre De Nael' }),
      netRegexJa: NetRegexes.addedCombatantFull({ name: 'ネールの幻影' }),
      netRegexCn: NetRegexes.addedCombatantFull({ name: '奈尔的幻影' }),
      netRegexKo: NetRegexes.addedCombatantFull({ name: '넬의 환영' }),
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
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4B2D', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Rubin-Waffe', id: '4B2D', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Rubis', id: '4B2D', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ルビーウェポン', id: '4B2D', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '红宝石神兵', id: '4B2D', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '루비 웨폰', id: '4B2D', capture: false }),
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
      netRegex: NetRegexes.headMarker({ id: '00E0' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'RubyEx Ruby Claw',
      netRegex: NetRegexes.startsUsing({ source: 'Raven\'s Image', id: '4AFF' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Naels Trugbild', id: '4AFF' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Spectre De Nael', id: '4AFF' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ネールの幻影', id: '4AFF' }),
      netRegexCn: NetRegexes.startsUsing({ source: '奈尔的幻影', id: '4AFF' }),
      netRegexKo: NetRegexes.startsUsing({ source: '넬의 환영', id: '4AFF' }),
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
      netRegex: NetRegexes.ability({ source: 'The Ruby Weapon', id: '4AFC', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Rubin-Waffe', id: '4AFC', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Arme Rubis', id: '4AFC', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ルビーウェポン', id: '4AFC', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '红宝石神兵', id: '4AFC', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '루비 웨폰', id: '4AFC', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4AFE', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Rubin-Waffe', id: '4AFE', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Rubis', id: '4AFE', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ルビーウェポン', id: '4AFE', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '红宝石神兵', id: '4AFE', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '루비 웨폰', id: '4AFE', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'RubyEx Meteor',
      netRegex: NetRegexes.headMarker({ id: '00(?:C[A-F]|D0|D1)' }),
      condition: Conditions.targetIsYou(),
      infoText: function(data, matches) {
        return parseInt(matches.id, 16) - parseInt('00CA', 16) + 1;
      },
    },
    {
      id: 'RubyEx Screech',
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4AEE', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Rubin-Waffe', id: '4AEE', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Rubis', id: '4AEE', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ルビーウェポン', id: '4AEE', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '红宝石神兵', id: '4AEE', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '루비 웨폰', id: '4AEE', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'RubyEx Magitek Meteor Burst',
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4AF0', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Rubin-Waffe', id: '4AF0', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Rubis', id: '4AF0', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ルビーウェポン', id: '4AF0', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '红宝石神兵', id: '4AF0', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '루비 웨폰', id: '4AF0', capture: false }),
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
      netRegex: NetRegexes.ability({ source: 'The Ruby Weapon', id: '4AB6', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Rubin-Waffe', id: '4AB6', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Arme Rubis', id: '4AB6', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ルビーウェポン', id: '4AB6', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '红宝石神兵', id: '4AB6', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '루비 웨폰', id: '4AB6', capture: false }),
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
      netRegex: NetRegexes.ability({ source: 'The Ruby Weapon', id: '4AB6', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Rubin-Waffe', id: '4AB6', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Arme Rubis', id: '4AB6', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ルビーウェポン', id: '4AB6', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '红宝石神兵', id: '4AB6', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '루비 웨폰', id: '4AB6', capture: false }),
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
      netRegex: NetRegexes.headMarker({ id: '0017' }),
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
      netRegex: NetRegexes.addedCombatantFull({ name: 'Comet' }),
      netRegexDe: NetRegexes.addedCombatantFull({ name: 'Komet' }),
      netRegexFr: NetRegexes.addedCombatantFull({ name: 'Comète' }),
      netRegexJa: NetRegexes.addedCombatantFull({ name: 'コメット' }),
      netRegexCn: NetRegexes.addedCombatantFull({ name: '彗星' }),
      netRegexKo: NetRegexes.addedCombatantFull({ name: '혜성' }),
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
      netRegex: NetRegexes.startsUsing({ source: 'The Ruby Weapon', id: '4B04', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Rubin-Waffe', id: '4B04', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Rubis', id: '4B04', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ルビーウェポン', id: '4B04', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '红宝石神兵', id: '4B04', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '루비 웨폰', id: '4B04', capture: false }),
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
        'Ravensflight': 'Flug des Raben',
        'Ravensclaw': 'Rabenklauen',
        'Optimized Ultima': 'Ultima-System',
        'Magitek Ray': 'Magitek-Laser',
        'Magitek Charge': 'Magitek-Sprengladung',
        'Magitek Bit': 'Magitek-Bit',
        'Liquefaction': 'Verflüssigen',
        '(?<! )Homing Lasers': 'Leitlaser',
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
      'replaceSync': {
        'Comet': 'コメット',
        'Meteor': 'メテオ',
        'Ruby Bit': 'ルビービット',
        'Raven\'s Image': 'ネールの幻影',
        'The Ruby Weapon': 'ルビーウェポン',
      },
      'replaceText': {
        '\\?': ' ?',
        '--cutscene--': '--カットシン--',
        'Undermine': 'クローマイン',
        'Tank Comets': 'タンクコメット',
        'Stamp': 'ストンピング',
        'Spike of Flame': '爆炎',
        'Screech': '叫声',
        'Ruby Sphere': 'ルビースフィア',
        'Ruby Ray': 'ルビーレイ',
        'Ruby Dynamics': 'ルビーダイナモ',
        'Ruby Claw': 'ルビークロー',
        'Ravensflight': 'レイヴェンダイブ',
        'Ravensclaw': 'レイヴェンクロー',
        'Outrage': 'アウトレイジ',
        'Optimized Ultima': '魔導アルテマ',
        'Negative Personae': 'ネガティブペルソナ',
        'Negative Aura': 'ネガティブオーラ',
        'Negative Affect': 'ネガティブアフェクト',
        'Meteor Stream': 'メテオストリーム',
        'Meteor Project': 'メテオ計劃',
        'Meteor Mine': 'メテオマイン',
        'Mark II Magitek Comet': '魔導コメットII',
        'Magitek Ray': '魔導レーザー',
        'Magitek Meteor': '魔導メテオ',
        'Magitek Charge': '魔導爆雷',
        'Magitek Bit': 'ビット射出',
        'Landing': '落着',
        'Liquefaction': 'リクェファクション',
        '(?<! )Homing Lasers': '誘導レーザー',
        'High-powered Homing Lasers': '高出力誘導レーザー',
        'Helicoclaw': 'スパイラルクロー',
        'Greater Memory': '記憶増幅',
        'Flexiclaw': 'フレキシブルクロー',
        'Dalamud Impact': 'ダラガブインパクト',
        'Cut and Run': 'クロースラッシュ',
        'Chariot/Dynamo': 'チャリオット/ダイナモ',
        'Change Of Heart': '感情変化',
        'Burst': '大爆発',
        'Bradamante': 'ブラダマンテ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'The Ruby Weapon': '红宝石神兵',
        'Ruby Bit': '红宝石浮游炮',
        'Raven\'s Image': '奈尔的幻影',
        'Meteor': '陨石',
      },
      'replaceText': {
        '--cutscene--': '--过场动画--',
        'Optimized Ultima': '魔导究极',
        'Magitek Bit': '浮游炮射出',
        'Flexiclaw': '潜地爪',
        'Magitek Ray': '魔导射线',
        'Helicoclaw': '螺旋爪',
        'Spike Of Flame': '爆炎柱',
        'Stamp': '重踏',
        'Ruby Sphere': '红宝石能量球',
        'Ravensclaw': '凶鸟爪',
        'Undermine': '掘地雷',
        'Ruby Ray': '红宝石射线',
        'Liquefaction': '地面液化',
        'Ravensflight': '凶鸟冲',
        'Ruby Dynamics': '红宝石电圈',
        'High-Powered Homing Lasers': '高功率诱导射线',
        'Cut And Run': '利爪突进',
        '(?<! )Homing Lasers': '诱导射线',
        'Magitek Charge': '魔导炸弹',
        'Meteor Project': '陨石计划',
        'Negative Personae': '消极人格',
        'Meteor Stream': '陨石流',
        'Greater Memory': '记忆增幅',
        'Chariot': '月流电圈',
        'Dynamo': '钢铁战车',
        'Negative Affect': '消极情感',
        'Ruby Claw x5': '红宝石之爪',
        'Change Of Heart': '感情变化',
        'Negative Aura': '消极视线',
        'Dalamud Impact': '卫月冲击',
        'Meteor Mine': '陨石雷',
        'Landing x8': '落地',
        'Screech': '嘶嚎',
        'Burst x8': '爆炸',
        'Magitek Meteor': '魔导陨石',
        'Mark II Magitek Comet': '魔导彗星II',
        'Tank Comets': '坦克彗星',
        'Bradamante': '布拉达曼特',
        'Outrage': '震怒',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'The Ruby Weapon': '루비 웨폰',
        'Ruby Bit': '루비 비트',
        'Raven\'s Image': '넬의 환영',
        'Meteor': '메테오',
      },
      'replaceText': {
        '--cutscene--': '--컷신--',
        'Optimized Ultima': '마도 알테마',
        'Magitek Bit': '비트 사출',
        'Flexiclaw': '가변 발톱',
        'Magitek Ray': '마도 레이저',
        'Helicoclaw': '나선 발톱',
        'Spike Of Flame': '폭염',
        'Stamp': '발구름',
        'Ruby Sphere': '루비 구체',
        'Ravensclaw': '흉조 발톱',
        'Undermine': '발톱 지뢰',
        'Ruby Ray': '루비 광선',
        'Liquefaction': '융해',
        'Ravensflight': '흉조 돌진',
        'Ruby Dynamics': '루비의 원동력',
        'High-Powered Homing Lasers': '고출력 유도 레이저',
        'Cut And Run': '발톱 휘두르기',
        '(?<! )Homing Lasers': '유도 레이저',
        'Magitek Charge': '마도 폭뢰',
        'Meteor Project': '메테오 계획',
        'Negative Personae': '부정적 페르소나',
        'Meteor Stream': '유성 폭풍',
        'Greater Memory': '기억 증폭',
        'Chariot': '강철 전차',
        'Dynamo': '달의 원동력',
        'Negative Affect': '부정적 작용',
        'Ruby Claw': '루비 발톱',
        'Change Of Heart': '감정 변화',
        'Negative Aura': '부정적 오라',
        'Dalamud Impact': '달라가브 낙하',
        'Meteor Mine': '운석 지뢰',
        'Landing': '경착륙',
        'Screech': '부르짖음',
        'Burst': '폭발',
        'Magitek Meteor': '마도 메테오',
        'Mark II Magitek Comet': '마도 혜성 2',
        'Tank Comets': '탱커 혜성 처리',
        'Bradamante': '브라다만테',
        'Outrage': '격노',
      },
    },
  ],
}];
