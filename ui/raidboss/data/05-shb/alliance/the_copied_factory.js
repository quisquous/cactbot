'use strict';

// The Copied Factory
// TODO: Tell people where to stand for Engels wall saws
// TODO: Tell people where to stand for 9S overhead saws
// TODO: Tell people where to go for 9S divebombs
// TODO: Tell people where to go for 9S tethered tank

[{
  zoneRegex: /^The Copied Factory$/,
  timelineFile: 'the_copied_factory.txt',
  timelineTriggers: [
    {
      id: 'Copied Flight Unit Lightfast',
      regex: /Lightfast Blade/,
      beforeSeconds: 15,
      infoText: function(data) {
        // The third lightfast blade comes very close to second,
        // so suppress its message.
        data.lightfastCount = (data.lightfastCount || 0) + 1;
        if (data.lightfastCount != 3)
          return;
        return {
          en: 'Be Near Boss',
          de: 'sei in der Nähe des Bosses',
          fr: 'Près du boss',
        };
      },
    },
    {
      id: 'Copied Engels Demolish Structure',
      regex: /Demolish Structure/,
      beforeSeconds: 15,
      infoText: {
        en: 'Move to South Edge',
        de: 'zur südlichen Kante',
        fr: 'Allez au Sud',
      },
    },
  ],
  triggers: [
    {
      id: 'Copied Serial Forceful Impact',
      regex: Regexes.startsUsing({ id: '48CF', source: 'Serial-Jointed Command Model', capture: false }),
      regexDe: Regexes.startsUsing({ id: '48CF', source: 'Befehlsmodell Mit Omnigelenk', capture: false }),
      regexFr: Regexes.startsUsing({ id: '48CF', source: 'Modèle Multiarticulé : Commandant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '48CF', source: '多関節型：司令機', capture: false }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Copied Serial Energy Assault',
      regex: Regexes.startsUsing({ id: '48B5', source: 'Serial-Jointed Command Model', capture: false }),
      regexDe: Regexes.startsUsing({ id: '48B5', source: 'Befehlsmodell Mit Omnigelenk', capture: false }),
      regexFr: Regexes.startsUsing({ id: '48B5', source: 'Modèle Multiarticulé : Commandant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '48B5', source: '多関節型：司令機', capture: false }),
      alertText: {
        en: 'Get Behind',
        de: 'Hinter Ihn',
        fr: 'Derrière le boss',
      },
    },
    {
      id: 'Copied Serial High-Caliber Laser',
      regex: Regexes.startsUsing({ id: '48FA', source: 'Serial-Jointed Service Model', capture: false }),
      regexDe: Regexes.startsUsing({ id: '48FA', source: 'Modell Mit Omnigelenk', capture: false }),
      regexFr: Regexes.startsUsing({ id: '48FA', source: 'Modèle Multiarticulé : Soldat', capture: false }),
      regexJa: Regexes.startsUsing({ id: '48FA', source: '多関節型：兵隊機', capture: false }),
      suppressSeconds: 15,
      infoText: {
        en: 'Look for Lasers',
        de: 'Pass auf die Laser auf',
        fr: 'Attention aux lasers',
      },
    },
    {
      id: 'Copied Serial Clanging Blow',
      regex: Regexes.startsUsing({ id: '48CE', source: 'Serial-Jointed Command Model' }),
      regexDe: Regexes.startsUsing({ id: '48CE', source: 'Befehlsmodell Mit Omnigelenk' }),
      regexFr: Regexes.startsUsing({ id: '48CE', source: 'Modèle Multiarticulé : Commandant' }),
      regexJa: Regexes.startsUsing({ id: '48CE', source: '多関節型：司令機' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target == data.me || data.role != 'healer')
          return;

        return {
          en: 'Buster on ' + data.ShortName(matches.target),
          de: 'Tankbuster auf ' + data.ShortName(matches.target),
          fr: 'Tankbuster sur ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'Copied Serial Centrifugal Spin',
      regex: Regexes.startsUsing({ id: '48C8', source: 'Serial-Jointed Command Model', capture: false }),
      regexDe: Regexes.startsUsing({ id: '48C8', source: 'Befehlsmodell Mit Omnigelenk', capture: false }),
      regexFr: Regexes.startsUsing({ id: '48C8', source: 'Modèle Multiarticulé : Commandant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '48C8', source: '多関節型：司令機', capture: false }),
      alertText: {
        en: 'Go To Sides',
        de: 'Geh zu den Seiten',
        fr: 'Sur les côtés',
      },
    },
    {
      id: 'Copied Serial Centrifugal Spin',
      regex: Regexes.startsUsing({ id: '48CA', source: 'Serial-Jointed Command Model', capture: false }),
      regexDe: Regexes.startsUsing({ id: '48CA', source: 'Befehlsmodell Mit Omnigelenk', capture: false }),
      regexFr: Regexes.startsUsing({ id: '48CA', source: 'Modèle Multiarticulé : Commandant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '48CA', source: '多関節型：司令機', capture: false }),
      alertText: {
        en: 'Go Front/Back',
        de: 'Geh nach Vorne/ Hinten',
        fr: 'Devant/Derrière',
      },
    },
    {
      id: 'Copied Serial Shockwave',
      regex: Regexes.startsUsing({ id: '48C3', source: 'Serial-Jointed Command Model', capture: false }),
      regexDe: Regexes.startsUsing({ id: '48C3', source: 'Befehlsmodell Mit Omnigelenk', capture: false }),
      regexFr: Regexes.startsUsing({ id: '48C3', source: 'Modèle Multiarticulé : Commandant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '48C3', source: '多関節型：司令機', capture: false }),
      infoText: {
        en: 'Knockback',
        de: 'Rückstoß',
        fr: 'Poussée',
      },
    },
    {
      id: 'Copied Hobbes Laser-Resistance Test',
      regex: Regexes.startsUsing({ id: '4805', source: 'Hobbes', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4805', source: 'Hobbes', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4805', source: 'Hobbes', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4805', source: 'ホッブス', capture: false }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Copied Hobbes Right Arm',
      regex: Regexes.message({ line: 'The wall-mounted right arm begins to move\.\.\.', capture: false }),
      regexDe: Regexes.message({ line: 'Der wandmontierte rechte Arm ist aktiv!', capture: false }),
      regexFr: Regexes.message({ line: 'Le bras mural droit s\'active!', capture: false }),
      regexJa: Regexes.message({ line: '壁面のライトアームが稼働を始めた……！', capture: false }),
      run: function(data) {
        data.alliance = data.alliance || 'A';
      },
      infoText: {
        en: 'Dodge Moving Circle',
        de: 'Bewegenden Kreisen ausweichen',
        fr: 'Evitez les cercles mouvants',
      },
    },
    {
      id: 'Copied Hobbes Flamethrowers',
      regex: Regexes.message({ line: 'The wall-mounted flamethrowers activate\.', capture: false }),
      regexDe: Regexes.message({ line: 'Die wandmontierten Flammenwerfer sind aktiv!', capture: false }),
      regexFr: Regexes.message({ line: 'Les lance-flammes muraux s\'activent!', capture: false }),
      regexJa: Regexes.message({ line: '壁面の火炎放射器が稼働を始めた……！', capture: false }),
      run: function(data) {
        data.alliance = data.alliance || 'B';
      },
      alertText: {
        en: 'Look Behind For Flamethrowers',
        de: 'Flammenwerfer hinter dir',
        fr: 'Regardez derrière (lance-flammes)',
      },
    },
    {
      id: 'Copied Hobbes Left Arm 1',
      regex: Regexes.message({ line: 'The wall-mounted left arm begins to move\.\.\.', capture: false }),
      regexDe: Regexes.message({ line: 'Der wandmontierte linke Arm ist aktiv!', capture: false }),
      regexFr: Regexes.message({ line: 'Le bras mural gauche s\'active!', capture: false }),
      regexJa: Regexes.message({ line: '壁面のレフトアームが稼働を始めた……！', capture: false }),
      durationSeconds: 6,
      run: function(data) {
        data.alliance = data.alliance || 'C';
      },
      infoText: {
        en: 'Out',
        de: 'Raus',
        fr: 'Dehors',
      },
    },
    {
      id: 'Copied Hobbes Left Arm 2',
      regex: Regexes.message({ line: 'The wall-mounted left arm begins to move\.\.\.', capture: false }),
      regexDe: Regexes.message({ line: 'Der wandmontierte linke Arm ist aktiv!', capture: false }),
      regexFr: Regexes.message({ line: 'Le bras mural gauche s\'active!', capture: false }),
      regexJa: Regexes.message({ line: '壁面のレフトアームが稼働を始めた……！', capture: false }),
      delaySeconds: 8,
      alertText: {
        en: 'Dodge Falling Walls',
        de: 'Den fallenden Wände asuweichen',
        fr: 'Eviter les murs tombants',
      },
    },
    {
      id: 'Copied Hobbes Left Arm 3',
      regex: Regexes.message({ line: 'The wall-mounted left arm begins to move\.\.\.', capture: false }),
      regexDe: Regexes.message({ line: 'Der wandmontierte linke Arm ist aktiv!', capture: false }),
      regexFr: Regexes.message({ line: 'Le bras mural gauche s\'active!', capture: false }),
      regexJa: Regexes.message({ line: '壁面のレフトアームが稼働を始めた……！', capture: false }),
      delaySeconds: 10,
      alertText: {
        en: 'Spread Tethers',
        de: 'Verbindungen Verteilen',
        fr: 'Ecartez les liens',
      },
    },
    {
      id: 'Copied Hobbes Short Missile',
      regex: Regexes.headMarker({ id: '00C4' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispertion',
      },
    },
    {
      id: 'Copied Hobbes Laser Sight',
      regex: Regexes.startsUsing({ id: '4807', source: 'Hobbes', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4807', source: 'Hobbes', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4807', source: 'Hobbes', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4807', source: 'ホッブス', capture: false }),
      alertText: {
        en: 'Stack',
        de: 'Sammeln',
        fr: 'Package',
      },
    },
    {
      id: 'Copied Hobbes Electric Floor',
      regex: Regexes.message({ line: 'You hear frenzied movement from machines beneath\.\.\.', capture: false }),
      regexDe: Regexes.message({ line: 'Die Maschinenwesen zu deinen Füßen bewegen sich!', capture: false }),
      regexFr: Regexes.message({ line: 'Les formes de vie mécaniques sous vos pieds s\'activent!', capture: false }),
      regexJa: Regexes.message({ line: '床下の機械生命体が怪しく動き始めた……！', capture: false }),
      suppressSeconds: 15,
      durationSeconds: 10,
      infoText: {
        en: 'Dodge Electric Floor',
        de: 'Elektrischem Boden ausweichen',
        fr: 'Evitez le sol électrifié',
      },
    },
    {
      id: 'Copied Hobbes Conveyer Belts',
      regex: Regexes.message({ line: 'The conveyer belts whirr to life!', capture: false }),
      regexDe: Regexes.message({ line: 'Die Fließbänder sind aktiv!', capture: false }),
      regexFr: Regexes.message({ line: 'Le tapis roulant s\'est mis en branle!', capture: false }),
      regexJa: Regexes.message({ line: '床面のローラーコンベアが稼働を始めた……！', capture: false }),
      infoText: {
        en: 'Conveyor Belts',
        de: 'Förderbänder',
        fr: 'Tapis roulant',

      },
    },
    {
      id: 'Copied Hobbes Oil 1',
      regex: Regexes.message({ line: 'Flammable oil is leaking from the floor\.\.\.', capture: false }),
      regexDe: Regexes.message({ line: 'Zu deinen Füßen wird brennbare Flüssigkeit eingelassen!', capture: false }),
      regexFr: Regexes.message({ line: 'Le sol s\'imbibe de liquide inflammable!', capture: false }),
      regexJa: Regexes.message({ line: '床下に可燃性の液体が満ち始めた……！', capture: false }),
      suppressSeconds: 15,
      durationSeconds: 3,
      alertText: {
        en: 'Oil Vats',
        de: 'Ölbehälter',
        fr: 'Cuves à huile',
      },
    },
    {
      id: 'Copied Hobbes Oil 2',
      regex: Regexes.message({ line: 'Flammable oil is leaking from the floor\.\.\.', capture: false }),
      regexDe: Regexes.message({ line: 'Zu deinen Füßen wird brennbare Flüssigkeit eingelassen!', capture: false }),
      regexFr: Regexes.message({ line: 'Le sol s\'imbibe de liquide inflammable!', capture: false }),
      regexJa: Regexes.message({ line: '床下に可燃性の液体が満ち始めた……！', capture: false }),
      suppressSeconds: 15,
      delaySeconds: 6,
      durationSeconds: 3,
      alertText: {
        en: 'Oil Vats',
        de: 'Ölbehälter',
        fr: 'Cuves à huile',
      },
    },
    {
      id: 'Copied Goliath Tank Exploder',
      regex: Regexes.tether({ id: '0011', source: 'Medium Exploder' }),
      regexDe: Regexes.tether({ id: '0011', source: 'Mittelgroß(?:e|er|es|en) Selbstzerstörung' }),
      regexFr: Regexes.tether({ id: '0011', source: 'Unité Kamikaze Moyenne' }),
      regexJa: Regexes.tether({ id: '0011', source: '中型自爆' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Exploder on YOU',
        de: 'Explosion auf DIR',
        fr: 'Explosion sur VOUS',
      },
    },
    {
      id: 'Copied Flight Unit 360 Bombing Manuever',
      regex: Regexes.startsUsing({ id: '4941', source: 'Flight Unit', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4941', source: 'Flugeinheit', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4941', source: 'Module De Vol', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4941', source: '飛行ユニット', capture: false }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Copied Flight Unit Ballistic Impact',
      regex: Regexes.headMarker({ id: '0017' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispertion',
      },
    },
    {
      id: 'Copied Engels Marx Smash Right',
      regex: Regexes.startsUsing({ id: '4727', source: 'Engels', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4727', source: 'Engels', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4727', source: 'Engels', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4727', source: 'エンゲルス', capture: false }),
      alertText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Droite',
        cn: '右',
      },
    },
    {
      id: 'Copied Engels Marx Smash Left',
      regex: Regexes.startsUsing({ id: '4726', source: 'Engels', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4726', source: 'Engels', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4726', source: 'Engels', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4726', source: 'エンゲルス', capture: false }),
      alertText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
        cn: '左',
      },
    },
    {
      id: 'Copied Engels Marx Smash Forward',
      regex: Regexes.startsUsing({ id: '472E', source: 'Engels', capture: false }),
      regexDe: Regexes.startsUsing({ id: '472E', source: 'Engels', capture: false }),
      regexFr: Regexes.startsUsing({ id: '472E', source: 'Engels', capture: false }),
      regexJa: Regexes.startsUsing({ id: '472E', source: 'エンゲルス', capture: false }),
      alertText: {
        en: 'Front and Center',
        de: 'Vorne und Mitte',
        fr: 'Devant et au centre',
      },
    },
    {
      id: 'Copied Engels Marx Smash Back',
      regex: Regexes.startsUsing({ id: '472A', source: 'Engels', capture: false }),
      regexDe: Regexes.startsUsing({ id: '472A', source: 'Engels', capture: false }),
      regexFr: Regexes.startsUsing({ id: '472A', source: 'Engels', capture: false }),
      regexJa: Regexes.startsUsing({ id: '472A', source: 'エンゲルス', capture: false }),
      alertText: {
        en: 'Back and Sides',
        de: 'Hinten und Seiten',
        fr: 'Arrière et côtés',
      },
    },
    {
      id: 'Copied Engels Marx Crush',
      regex: Regexes.startsUsing({ id: '4746', source: 'Engels', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4746', source: 'Engels', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4746', source: 'Engels', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4746', source: 'エンゲルス', capture: false }),
      infoText: {
        en: 'Kill Claws',
        de: 'Klauen töten',
        fr: 'Tuez les pinces',
      },
    },
    {
      id: 'Copied Engels Precision Guided Missile',
      regex: Regexes.headMarker({ id: '00C6' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Tank Buster on YOU',
        de: 'Tankbuster auf DIR',
        fr: 'Tankbuster sur VOUS',
      },
    },
    {
      id: 'Copied Engels Diffuse Laser',
      regex: Regexes.startsUsing({ id: '4755', source: 'Engels', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4755', source: 'Engels', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4755', source: 'Engels', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4755', source: 'エンゲルス', capture: false }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      // Technicallly this is Laser Sight 473A, but energy barrage
      // always precedes it and is an earlier warning.
      // Also suggest going to the front for towers.
      id: 'Copied Engels Energy Barrage 1',
      regex: Regexes.startsUsing({ id: '473C', source: 'Engels', capture: false }),
      regexDe: Regexes.startsUsing({ id: '473C', source: 'Engels', capture: false }),
      regexFr: Regexes.startsUsing({ id: '473C', source: 'Engels', capture: false }),
      regexJa: Regexes.startsUsing({ id: '473C', source: 'エンゲルス', capture: false }),
      infoText: {
        en: 'Go Sides (Near Front)',
        de: 'Zu den Seiten (Nahe der Front)',
        fr: 'Allez sur les côtés (vers l\'avant)',
      },
    },
    {
      id: 'Copied Engels Energy Barrage',
      regex: Regexes.startsUsing({ id: '473C', source: 'Engels', capture: false }),
      regexDe: Regexes.startsUsing({ id: '473C', source: 'Engels', capture: false }),
      regexFr: Regexes.startsUsing({ id: '473C', source: 'Engels', capture: false }),
      regexJa: Regexes.startsUsing({ id: '473C', source: 'エンゲルス', capture: false }),
      delaySeconds: 8,
      infoText: {
        en: 'Get Towers',
        de: 'Türme nehmen',
        fr: 'Prenez les tours',
      },
    },
    {
      id: 'Copied Engels Incendiary Bombing',
      regex: Regexes.headMarker({ id: '0017' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Puddle on YOU',
            de: 'Fläsche auf dir',
            fr: 'Flaques sur VOUS',
          };
        }
      },
    },
    {
      id: 'Copied Engels Guided Missile',
      regex: Regexes.headMarker({ id: '00C5' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Get Out + Dodge Homing AoE',
            de: 'Geh Raus + Zielsuch-AoE ausweichen',
            fr: 'Dehors + Evitez l\'AoE',
          };
        }
      },
    },
    {
      id: 'Copied Engels Reverse-Jointed Goliaths',
      regex: Regexes.ability({ id: '473F', source: 'Engels', capture: false }),
      regexDe: Regexes.ability({ id: '473F', source: 'Engels', capture: false }),
      regexFr: Regexes.ability({ id: '473F', source: 'Engels', capture: false }),
      regexJa: Regexes.ability({ id: '473F', source: 'エンゲルス', capture: false }),
      durationSeconds: 4,
      infoText: {
        en: 'Adds (Ignore Small)',
        de: 'Adds (kleine ignorieren)',
        fr: 'Adds (ignorez les petits)',
      },
    },
    {
      id: 'Copied Engels Incendiary Saturation Bombing',
      regex: Regexes.startsUsing({ id: '474E', source: 'Engels', capture: false }),
      regexDe: Regexes.startsUsing({ id: '474E', source: 'Engels', capture: false }),
      regexFr: Regexes.startsUsing({ id: '474E', source: 'Engels', capture: false }),
      regexJa: Regexes.startsUsing({ id: '474E', source: 'エンゲルス', capture: false }),
      alertText: {
        en: 'Front and Center',
        de: 'Vorne und Mitte',
        fr: 'Devant et au centre',
      },
    },
    {
      id: 'Copied Engels Marx Thrust',
      regex: Regexes.startsUsing({ id: '48A8', source: 'Engels', capture: false }),
      regexDe: Regexes.startsUsing({ id: '48A8', source: 'Engels', capture: false }),
      regexFr: Regexes.startsUsing({ id: '48A8', source: 'Engels', capture: false }),
      regexJa: Regexes.startsUsing({ id: '48A8', source: 'エンゲルス', capture: false }),
      delaySeconds: 9,
      infoText: {
        en: 'Look For Wall Saws',
        de: 'Halt nach den kleinen Sägen ausschau',
        fr: 'Repérez les scies',
      },
    },
    {
      id: 'Copied 9S Neutralization',
      regex: Regexes.startsUsing({ id: '48F5', source: '9S-Operated Walking Fortress' }),
      regexDe: Regexes.startsUsing({ id: '48F5', source: '9S\' Mehrbeinig(?:e|er|es|en) Panzer' }),
      regexFr: Regexes.startsUsing({ id: '48F5', source: '9S : Avec Multipède Esclave' }),
      regexJa: Regexes.startsUsing({ id: '48F5', source: '９Ｓ：多脚戦車従属' }),
      condition: function(data, matches) {
        return data.me == matches.target || data.role == 'healer';
      },
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'Copied 9S Laser Saturation',
      regex: Regexes.startsUsing({ id: '48F6', source: '9S-Operated Walking Fortress', capture: false }),
      regexDe: Regexes.startsUsing({ id: '48F6', source: '9S\' Mehrbeinig(?:e|er|es|en) Panzer', capture: false }),
      regexFr: Regexes.startsUsing({ id: '48F6', source: '9S : Avec Multipède Esclave', capture: false }),
      regexJa: Regexes.startsUsing({ id: '48F6', source: '９Ｓ：多脚戦車従属', capture: false }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Copied 9S Laser Turret',
      regex: Regexes.startsUsing({ id: '4A74', source: '9S-Operated Walking Fortress', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4A74', source: '9S\' Mehrbeinig(?:e|er|es|en) Panzer', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4A74', source: '9S : Avec Multipède Esclave', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4A74', source: '９Ｓ：多脚戦車従属', capture: false }),
      alertText: {
        en: 'Away From Front',
        de: 'Weg von Vorne',
        fr: 'Eloignez vous de l\'avant',
      },
    },
    {
      id: 'Copied 9S Ballistic Impact',
      regex: Regexes.headMarker({ id: '008B' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispertion',
      },
    },
    {
      id: 'Copied 9S Goliath Laser Turret',
      regex: Regexes.headMarker({ id: '00A4' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Laser Buster on YOU',
        de: 'Laser Tankbuster auf DIR',
        fr: 'Laser Tankbuster sur VOUS',
      },
    },
    {
      regex: Regexes.startsUsing({ id: '48DF', source: '9S-Operated Walking Fortress', capture: false }),
      regexDe: Regexes.startsUsing({ id: '48DF', source: '9S\' Mehrbeinig(?:e|er|es|en) Panzer', capture: false }),
      regexFr: Regexes.startsUsing({ id: '48DF', source: '9S : Avec Multipède Esclave', capture: false }),
      regexJa: Regexes.startsUsing({ id: '48DF', source: '９Ｓ：多脚戦車従属', capture: false }),
      infoText: {
        en: 'Go Sides',
        de: 'Zu den Seiten',
        fr: 'Sur les côtés',
      },
    },
    {
      id: 'Copied 9S Dual-Flank Cannons',
      regex: Regexes.startsUsing({ id: '48DE', source: '9S-Operated Walking Fortress', capture: false }),
      regexDe: Regexes.startsUsing({ id: '48DE', source: '9S\' Mehrbeinig(?:e|er|es|en) Panzer', capture: false }),
      regexFr: Regexes.startsUsing({ id: '48DE', source: '9S : Avec Multipède Esclave', capture: false }),
      regexJa: Regexes.startsUsing({ id: '48DE', source: '９Ｓ：多脚戦車従属', capture: false }),
      infoText: {
        en: 'Go Front / Back',
        de: 'Geh nach Vorne / Hinten',
        fr: 'Allez devant / derrière',
      },
    },
    {
      id: 'Copied 9S Engage Marx Support',
      regex: Regexes.startsUsing({ id: '48D3', source: '9S-Operated Walking Fortress', capture: false }),
      regexDe: Regexes.startsUsing({ id: '48D3', source: '9S\' Mehrbeinig(?:e|er|es|en) Panzer', capture: false }),
      regexFr: Regexes.startsUsing({ id: '48D3', source: '9S : Avec Multipède Esclave', capture: false }),
      regexJa: Regexes.startsUsing({ id: '48D3', source: '９Ｓ：多脚戦車従属', capture: false }),
      delaySeconds: 4,
      alertText: {
        en: 'Dodge Overhead Saws',
        de: 'Sägen über dem Kopf ausweichen',
        fr: 'Evitez la scie au-dessus de vous',
      },
    },
    {
      // Use the ability before the adds show up, as looking for the added combatant
      // also triggers on the first boss.
      id: 'Copied 9S Serial-Jointed Service Models',
      regex: Regexes.ability({ id: '48EA', source: '9S-Operated Walking Fortress', capture: false }),
      regexDe: Regexes.ability({ id: '48EA', source: '9S\' Mehrbeinig(?:e|er|es|en) Panzer', capture: false }),
      regexFr: Regexes.ability({ id: '48EA', source: '9S : Avec Multipède Esclave', capture: false }),
      regexJa: Regexes.ability({ id: '48EA', source: '９Ｓ：多脚戦車従属', capture: false }),
      infoText: {
        en: 'Adds',
        de: 'Adds',
        fr: 'Adds',
      },
    },
    {
      id: 'Copied 9S Engage Goliath Tank Support',
      regex: Regexes.startsUsing({ id: '48E5', source: '9S-Operated Walking Fortress', capture: false }),
      regexDe: Regexes.startsUsing({ id: '48E5', source: '9S\' Mehrbeinig(?:e|er|es|en) Panzer', capture: false }),
      regexFr: Regexes.startsUsing({ id: '48E5', source: '9S : Avec Multipède Esclave', capture: false }),
      regexJa: Regexes.startsUsing({ id: '48E5', source: '９Ｓ：多脚戦車従属', capture: false }),
      infoText: {
        en: 'Adds',
        de: 'Adds',
        fr: 'Adds',
      },
    },
    {
      id: 'Copied 9S Hack Goliath Tank',
      regex: Regexes.startsUsing({ id: '48E7', source: '9S-Operated Walking Fortress', capture: false }),
      regexDe: Regexes.startsUsing({ id: '48E7', source: '9S\' Mehrbeinig(?:e|er|es|en) Panzer', capture: false }),
      regexFr: Regexes.startsUsing({ id: '48E7', source: '9S : Avec Multipède Esclave', capture: false }),
      regexJa: Regexes.startsUsing({ id: '48E7', source: '９Ｓ：多脚戦車従属', capture: false }),
      alertText: {
        en: 'Go Behind Untethered Tank',
        de: 'Hinter den nicht verbundenen Panzer gehen',
        fr: 'Derrière le tank non-lié',
      },
    },
    {
      id: 'Copied 9S Shrapnel Impact',
      regex: Regexes.startsUsing({ id: '48F3', source: '9S-Operated Walking Fortress', capture: false }),
      regexDe: Regexes.startsUsing({ id: '48F3', source: '9S\' Mehrbeinig(?:e|er|es|en) Panzer', capture: false }),
      regexFr: Regexes.startsUsing({ id: '48F3', source: '9S : Avec Multipède Esclave', capture: false }),
      regexJa: Regexes.startsUsing({ id: '48F3', source: '９Ｓ：多脚戦車従属', capture: false }),
      suppressSeconds: 2,
      infoText: {
        en: 'Stack',
        de: 'Sammeln',
        fr: 'Package',
      },
    },
    {
      id: 'Copied 9S Bubble',
      regex: Regexes.startsUsing({ id: '48EB', source: '9S-Operated Walking Fortress', capture: false }),
      regexDe: Regexes.startsUsing({ id: '48EB', source: '9S\' Mehrbeinig(?:e|er|es|en) Panzer', capture: false }),
      regexFr: Regexes.startsUsing({ id: '48EB', source: '9S : Avec Multipède Esclave', capture: false }),
      regexJa: Regexes.startsUsing({ id: '48EB', source: '９Ｓ：多脚戦車従属', capture: false }),
      delaySeconds: 5,
      infoText: {
        en: 'Get in the bubble',
        de: 'Geh in die Kuppel',
        fr: 'Allez dans les bulles',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        '9S-Operated Flight Unit': '9S\' Flugeinheit',
        '9S-Operated Walking Fortress': '9S\' mehrbeiniger Panzer',
        'Engels': 'Engels',
        'Flight Unit': 'Flugeinheit',
        'Goliath Tank': 'Goliath-Panzer',
        'Hobbes': 'Hobbes',
        'Marx': 'Marx',
        'Marx [LR]': '(Linker|Rechter) Marx',
        'Medium Exploder': 'mittelgroße Selbstzerstörung',
        'Multi-leg Medium Model': 'mittelgroßes mehrbeiniges Modell',
        'Quality assurance will be sealed off': 'Noch 15 Sekunden, bis sich die Warenkontrollhalle schließt',
        'Reverse-jointed Goliath': 'Goliath mit Inversgelenk',
        'Serial-jointed Command Model': 'Befehlsmodell mit Omnigelenk',
        'Serial-jointed Service Model': 'Modell mit Omnigelenk',
        'Small Biped': 'kleiner Zweibeiner',
        'Small Flyer': 'kleine Flugeinheit',
        'The forward deck will be sealed off': 'Noch 15 Sekunden, bis sich das vordere Deck schließt',
        'The rear deck will be sealed off': 'Noch 15 Sekunden, bis sich das hintere Deck schließt',
        'Warehouse A will be sealed off': 'Noch 15 Sekunden, bis sich das Warenlager A schließt',
        'Warehouse B will be sealed off': 'Noch 15 Sekunden, bis sich das Warenlager B schließt',
        'Warehouse C will be sealed off': 'Noch 15 Sekunden, bis sich das Warenlager C schließt',
        'is no longer sealed': 'öffnet sich wieder',
      },
      'replaceText': {
        '--jump--': '--Sprung--',
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        '360-Degree Bombing Maneuver': 'Offensive: Raketenring',
        'Adds': 'Adds',
        'Anti-Personnel Missile': 'Antipersonenrakete',
        'Area Bombardment': 'Blindraketen',
        'Area Bombing Maneuver': 'Offensive: Raketensalve',
        'Arm Laser': 'Armlaser',
        'Cannons': 'Kanonen',
        'Clanging Blow': 'Schwerer Angriff',
        'Convenient Self-Destruction': 'Selbstsprengung',
        'Crusher Adds': 'Zangenrad Adds',
        'Crushing Wheel': 'Zangenradoffensive',
        'Demolish Structure': 'Terraintilgung',
        'Diffuse Laser': 'Diffusionslaser',
        'Energy Assault': 'Energieschauer',
        'Energy Barrage': 'Energetisches Sperrfeuer',
        'Energy Blast': 'Energetische Explosion',
        'Energy Bombardment': 'Energiemörser',
        'Energy Ring': 'Omnidirektionalenergie',
        'Engage Goliath Tank Support': 'Verstärkung: Goliath-Panzer',
        'Engage Marx Support': 'Verstärkung: Marx',
        'Enrage': 'Finalangriff',
        'Exploding Tethers': 'Explodierende Verbindungen',
        'Floor': 'Boden',
        'Forceful Impact': 'Heftiges Beben',
        'Frontal Somersault': 'Sprungoffensive',
        'Ground-To-Ground Missile': 'Boden-Boden-Rakete',
        '^Guided Missile$': 'Lenkraketen',
        'Hack Goliath Tank': 'Hacken: Goliath-Panzer',
        'High-Caliber Laser': 'Großkaliberlaser',
        'High-Frequency Laser': 'Hochfrequenzlaser',
        'High-Powered Laser': 'Hochleistungslaser',
        'Incendiary Bombing': 'Brandraketen',
        'Incendiary Saturation Bombing': 'Streubrandraketen',
        'Laser Saturation': 'Omnidirektionallaser',
        'Laser Sight': 'Laserbestrahlung',
        'Laser Turret': 'Hauptgeschützlaser',
        'Laser-Resistance Test': 'Laserresistenztest',
        'Lightfast Blade': 'Lichtklingenschnitt',
        'Marx Activation': 'Marx-Aktivierung',
        'Marx Crush': 'Marxsche Offensive',
        'Marx Impact': 'Marxscher Sturz',
        'Marx Smash': 'Marxscher Schlag',
        'Marx Thrust': 'Marxscher Ansturm',
        'Neutralization': 'Unterwerfung',
        'Precision Guided Missile': 'Schwere Lenkrakete',
        'Radiate Heat': 'Thermaloffensive',
        'Ring Laser': 'Ringlaser',
        'Shockwave': 'Schockwelle',
        'Short-Range Missile': 'Kurzstreckenrakete',
        'Shrapnel Impact': 'Wrackteilregen',
        'Spin': 'Verwirbeln',
        'Surface Missile': 'Raketenschlag',
        'Systematic Airstrike': 'Luftformation',
        'Systematic Siege': 'Kesselformation',
        'Systematic Suppression': 'Artillerieformation',
        'Systematic Targeting': 'Jagdformation',
        'Total Annihilation Maneuver': 'Offensive: Totale Vernichtung',
        'Undock': 'Abdocken',
        'Wall Mechanic': 'Wand Mechanik',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        '9S-operated Flight Unit': '9S : module de vol équipé',
        '9S-Operated Walking Fortress': '9S : avec multipède esclave',
        'Engels': 'Engels',
        'Flight Unit': 'Module de vol',
        'Goliath Tank': 'Char Goliath',
        'Hobbes': 'Hobbes',
        'Marx': 'Marx',
        'Marx [LR]': 'Marx : (Gauche|Droite)',
        'Medium Exploder': 'Unité kamikaze moyenne',
        'Multi-leg Medium Model': 'Multipède moyen',
        'Quality assurance will be sealed off': 'Fermeture de la salle de test',
        'Reverse-jointed Goliath': 'Goliath articulations inversées',
        'Serial-jointed Command Model': 'Modèle multiarticulé : commandant',
        'Serial-jointed Service Model': 'Modèle multiarticulé : soldat',
        'Small Biped': 'Petit bipède',
        'Small Flyer': 'Petite unité volante',
        'The forward deck will be sealed off': 'Fermeture de la plate-forme avant',
        'The rear deck will be sealed off': 'Fermeture de la plate-forme arrière',
        'Warehouse A will be sealed off': 'Fermeture de l\'entrepôt A',
        'Warehouse B will be sealed off': 'Fermeture de l\'entrepôt B',
        'Warehouse C will be sealed off': 'Fermeture de l\'entrepôt C',
        'is no longer sealed': 'Ouverture ',
      },
      'replaceText': {
        '--jump--': '--Saut--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        '360-Degree Bombing Maneuver': 'Attaque : tir de missiles circulaire',
        'Adds': 'Adds',
        'Anti-Personnel Missile': 'Pluie de missiles antipersonnel',
        'Area Bombardment': 'Déluge de missiles',
        'Area Bombing Maneuver': 'Attaque : salve de missiles',
        'Arm Laser': 'Lasers brachiaux',
        'Cannons': 'Canons',
        'Clanging Blow': 'Attaque puissante',
        'Convenient Self-Destruction': 'Autodestruction',
        'Crusher Adds': 'Broyeurs',
        'Crushing Wheel': 'Scie circulaire',
        'Demolish Structure': 'Démolition de plate-forme',
        'Diffuse Laser': 'Laser diffractif',
        'Energy Assault': 'Tirs en éventail',
        'Energy Barrage': 'Rideau de balles',
        'Energy Blast': 'Fission de balle',
        'Energy Bombardment': 'Tirs courbes',
        'Energy Ring': 'Tirs multidirectionnels',
        'Engage Goliath Tank Support': 'Appel de renfort : char Goliath',
        'Engage Marx Support': 'Appel de renforts : Marx',
        'Enrage': 'Enrage',
        'Exploding Tethers': 'Liens explosifs',
        'Floor': 'Sol',
        'Forceful Impact': 'Forte secousse',
        'Frontal Somersault': 'Attaque sautée',
        'Ground-To-Ground Missile': 'Missile sol-sol',
        '^Guided Missile$': 'Missile à tête chercheuse',
        'Hack Goliath Tank': 'Piratage : char Goliath',
        'High-Caliber Laser': 'Laser à large faisceau',
        'High-Frequency Laser': 'Laser à haute fréquence',
        'High-Powered Laser': 'Laser surpuissant',
        'Incendiary Bombing': 'Missiles incendiaires',
        'Incendiary Saturation Bombing': 'Salve incendiaire',
        'Laser Saturation': 'Laser multidirectionnel',
        'Laser Sight': 'Rayon laser',
        'Laser Turret': 'Canon laser',
        'Laser-Resistance Test': 'Test de résistance au laser',
        'Lightfast Blade': 'Lame éclair',
        'Marx Activation': 'Activation de Marx',
        'Marx Crush': 'Pinçage de Marx',
        'Marx Impact': 'Chute de Marx',
        'Marx Smash': 'Coup de Marx',
        'Marx Thrust': 'Charge de Marx',
        'Neutralization': 'Tir de suppression',
        'Precision Guided Missile': 'Missile à tête chercheuse ultraprécise',
        'Radiate Heat': 'Relâchement de chaleur',
        'Ring Laser': 'Anneau laser',
        'Shockwave': 'Onde de choc',
        'Short-Range Missile': 'Missiles à courte portée',
        'Shrapnel Impact': 'Chute de débris',
        'Spin': 'Gyrocoup',
        'Surface Missile': 'Missiles sol-sol',
        'Systematic Airstrike': 'Formation de bombardement',
        'Systematic Siege': 'Formation d\'encerclement',
        'Systematic Suppression': 'Formation de balayage',
        'Systematic Targeting': 'Formation de tir',
        'Total Annihilation Maneuver': 'Attaque : bombardement dévastateur',
        'Undock': 'Désamarrage',
        'Wall Mechanic': 'Mécanique du mur',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        '9S-operated Flight Unit': '９Ｓ：飛行ユニット装備',
        '9S-Operated Walking Fortress': '９Ｓ：多脚戦車従属',
        'Engels': 'エンゲルス',
        'Flight Unit': '飛行ユニット',
        'Goliath Tank': '大型戦車',
        'Hobbes': 'ホッブス',
        'Marx': 'マルクス',
        'Marx [LR]': 'Marx [LR]', // FIXME
        'Medium Exploder': '中型自爆',
        'Multi-leg Medium Model': '中型多脚',
        'Quality assurance will be sealed off': 'Quality assurance will be sealed off', // FIXME
        'Reverse-jointed Goliath': '大型逆関節',
        'Serial-jointed Command Model': '多関節型：司令機',
        'Serial-jointed Service Model': '多関節型：兵隊機',
        'Small Biped': '小型二足',
        'Small Flyer': '小型飛行体',
        'The forward deck will be sealed off': 'The forward deck will be sealed off', // FIXME
        'The rear deck will be sealed off': 'The rear deck will be sealed off', // FIXME
        'Warehouse A will be sealed off': 'Warehouse A will be sealed off', // FIXME
        'Warehouse B will be sealed off': 'Warehouse B will be sealed off', // FIXME
        'Warehouse C will be sealed off': 'Warehouse C will be sealed off', // FIXME
        'is no longer sealed': 'is no longer sealed', // FIXME
      },
      'replaceText': {
        '--jump--': '--jump--', // FIXME
        '--targetable--': '--targetable--',
        '--untargetable--': '--untargetable--',
        '360-Degree Bombing Maneuver': '攻撃：ミサイル円射',
        'Adds': 'Adds', // FIXME
        'Anti-Personnel Missile': '対人ミサイル乱射',
        'Area Bombardment': 'ミサイル乱射',
        'Area Bombing Maneuver': '攻撃：ミサイル斉射',
        'Arm Laser': '腕部レーザー',
        'Cannons': 'Cannons', // FIXME
        'Clanging Blow': '強攻撃',
        'Convenient Self-Destruction': '自爆攻撃',
        'Crusher Adds': 'Crusher Adds', // FIXME
        'Crushing Wheel': '挟撃ホイール',
        'Demolish Structure': '地形破壊攻撃',
        'Diffuse Laser': '拡散レーザー',
        'Energy Assault': '連続エネルギー弾',
        'Energy Barrage': 'エネルギー弾幕',
        'Energy Blast': 'エネルギー炸裂',
        'Energy Bombardment': '迫撃エネルギー弾',
        'Energy Ring': '全方位エネルギー弾',
        'Engage Goliath Tank Support': '支援要請：大型戦車',
        'Engage Marx Support': '支援要請：マルクス',
        'Enrage': 'Enrage',
        'Exploding Tethers': 'Exploding Tethers', // FIXME
        'Floor': 'Floor', // FIXME
        'Forceful Impact': '大震動',
        'Frontal Somersault': 'ジャンプ攻撃',
        'Ground-To-Ground Missile': '地対地ミサイル',
        '^Guided Missile$': '誘導ミサイル',
        'Hack Goliath Tank': 'ハッキング：大型戦車',
        'High-Caliber Laser': '大口径レーザー',
        'High-Frequency Laser': '高周波レーザー',
        'High-Powered Laser': '高出力レーザー',
        'Incendiary Bombing': '焼尽ミサイル',
        'Incendiary Saturation Bombing': '拡散焼尽ミサイル',
        'Laser Saturation': '全方位レーザー',
        'Laser Sight': 'レーザー照射',
        'Laser Turret': '主砲レーザー',
        'Laser-Resistance Test': '耐レーザー検証',
        'Lightfast Blade': '光刃斬機',
        'Marx Activation': 'マルクス起動',
        'Marx Crush': 'マルクス挟撃',
        'Marx Impact': 'マルクス落下',
        'Marx Smash': 'マルクス打撃',
        'Marx Thrust': 'マルクス突撃',
        'Neutralization': '制圧射撃',
        'Precision Guided Missile': '高性能誘導ミサイル',
        'Radiate Heat': '放熱攻撃',
        'Ring Laser': 'リングレーザー',
        'Shockwave': '衝撃波',
        'Short-Range Missile': '短距離ミサイル',
        'Shrapnel Impact': '残骸落下',
        'Spin': 'ぶん回す',
        'Surface Missile': '対地ミサイル',
        'Systematic Airstrike': '空爆陣形',
        'Systematic Siege': '包囲陣形',
        'Systematic Suppression': '掃射陣形',
        'Systematic Targeting': '照準陣形',
        'Total Annihilation Maneuver': '攻撃：殲滅爆撃',
        'Undock': 'ドッキング解除',
        'Wall Mechanic': 'Wall Mechanic', // FIXME
      },
    },
  ],
}];
