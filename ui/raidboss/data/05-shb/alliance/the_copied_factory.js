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
      regex: / 14:48CF:Serial-Jointed Command Model starts using Forceful Impact/,
      regexFr: / 14:48CF:Modèle multiarticulé : commandant starts using Forte Secousse/,
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
      regex: / 14:48B5:Serial-Jointed Command Model starts using Energy Assault/,
      regexFr: / 14:48B5:Modèle multiarticulé : commandant starts using Tirs En Éventail/,
      alertText: {
        en: 'Get Behind',
        de: 'Hinter Ihn',
        fr: 'Derrière le boss',
      },
    },
    {
      id: 'Copied Serial High-Caliber Laser',
      regex: / 14:48FA:Serial-Jointed Service Model starts using High-Caliber Laser/,
      regexFr: / 14:48FA:Modèle multiarticulé : commandant starts using Laser À Large Faisceau/,
      suppressSeconds: 15,
      infoText: {
        en: 'Look for Lasers',
        de: 'Pass auf die Laser auf',
        fr: 'Attention aux lasers',
      },
    },
    {
      id: 'Copied Serial Clanging Blow',
      regex: / 14:48CE:Serial-Jointed Command Model starts using Clanging Blow on (\y{Name})\./,
      regexFr: / 14:48CE:Modèle multiarticulé : commandant starts using Attaque Puissante on (\y{Name})\./,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'healer')
          return;

        return {
          en: 'Buster on ' + data.ShortName(matches[1]),
          de: 'Tankbuster auf ' + data.ShortName(matches[1]),
          fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'Copied Serial Centrifugal Spin',
      regex: / 14:48C8:Serial-Jointed Command Model starts using Centrifugal Spin/,
      regexFr: / 14:48C8:Modèle multiarticulé : commandant starts using Centre : Attaque Rotative/,
      alertText: {
        en: 'Go To Sides',
        de: 'Geh zu den Seiten',
        fr: 'Sur les côtés',
      },
    },
    {
      id: 'Copied Serial Centrifugal Spin',
      regex: / 14:48CA:Serial-Jointed Command Model starts using Sidestriking Spin/,
      regexFr: / 14:48CA:Modèle multiarticulé : commandant starts using Côtés : Attaque Rotative/,
      alertText: {
        en: 'Go Front/Back',
        de: 'Geh nach Vorne/ Hinten',
        fr: 'Devant/Derrière',
      },
    },
    {
      id: 'Copied Serial Shockwave',
      regex: / 14:48C3:Serial-Jointed Command Model starts using Shockwave/,
      regexFr: / 14:48C3:Modèle multiarticulé : commandant starts using Onde De Choc/,
      infoText: {
        en: 'Knockback',
        de: 'Rückstoß',
        fr: 'Poussée',
      },
    },
    {
      id: 'Copied Hobbes Laser-Resistance Test',
      regex: / 14:4805:Hobbes starts using Laser-Resistance Test/,
      regexFr: / 14:4805:Hobbes starts using Test De Résistance Au Laser/,
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
      regex: / 00:0839:The wall-mounted right arm begins to move\.\.\./,
      regexFr: / 00:0839:Le bras mural droit s'active\.\.\./,
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
      regex: / 00:0839:The wall-mounted flamethrowers activate\./,
      regexFr: / 00:0839:Les lance-flammes muraux s'activent\./,
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
      regex: / 00:0839:The wall-mounted left arm begins to move\.\.\./,
      regexFr: / 00:0839:Le bras mural gauche s'active\.\.\./,
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
      regex: / 00:0839:The wall-mounted left arm begins to move\.\.\./,
      regexFr: / 00:0839:Le bras mural gauche s'active\.\.\./,
      delaySeconds: 8,
      alertText: {
        en: 'Dodge Falling Walls',
        de: 'Den fallenden Wände asuweichen',
        fr: 'Eviter les murs tombants',
      },
    },
    {
      id: 'Copied Hobbes Left Arm 3',
      regex: / 00:0839:The wall-mounted left arm begins to move\.\.\./,
      regexFr: / 00:0839:Le bras mural gauche s'active\.\.\./,
      delaySeconds: 10,
      alertText: {
        en: 'Spread Tethers',
        de: 'Verbindungen Verteilen',
        fr: 'Ecartez les liens',
      },
    },
    {
      id: 'Copied Hobbes Short Missile',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00C4:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispertion',
      },
    },
    {
      id: 'Copied Hobbes Laser Sight',
      regex: / 14:4807:Hobbes starts using Laser Sight/,
      regexFr: / 14:4807:Hobbes starts using Rayon Laser/,
      alertText: {
        en: 'Stack',
        de: 'Sammeln',
        fr: 'Package',
      },
    },
    {
      id: 'Copied Hobbes Electric Floor',
      regex: / 00:0839:You hear frenzied movement from machines beneath\.\.\./,
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
      regex: / 00:0839:The conveyer belts whirr to life!/,
      regexFr: / 00:0839:Le tapis roulant s'est mis en branle!/,
      infoText: {
        en: 'Conveyor Belts',
        de: 'Förderbänder',
        fr: 'Tapis roulant',

      },
    },
    {
      id: 'Copied Hobbes Oil 1',
      regex: / 00:0839:Flammable oil is leaking from the floor\.\.\./,
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
      regex: / 00:0839:Flammable oil is leaking from the floor\.\.\./,
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
      regex: / 23:\y{ObjectId}:Medium Exploder:\y{ObjectId}:(\y{Name}):....:....:0011:/,
      regexFr: / 23:\y{ObjectId}:Unité kamikaze moyenne:\y{ObjectId}:(\y{Name}):....:....:0011:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Exploder on YOU',
        de: 'Explosion auf DIR',
        fr: 'Explosion sur VOUS',
      },
    },
    {
      id: 'Copied Flight Unit 360 Bombing Manuever',
      regex: / 14:4941:Flight Unit starts using 360-Degree Bombing Maneuver/,
      regexFr: / 14:4941:Module de vol starts using Attaque : Tir De Missiles Circulaire/,
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
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0017:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispertion',
      },
    },
    {
      id: 'Copied Engels Marx Smash Right',
      regex: / 14:4727:Engels starts using Marx Smash/,
      regexFr: / 14:4727:Engels starts using Coup De Marx/,
      alertText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Droite',
        cn: '右',
      },
    },
    {
      id: 'Copied Engels Marx Smash Left',
      regex: / 14:4726:Engels starts using Marx Smash/,
      regexFr: / 14:4726:Engels starts using Coup De Marx/,
      alertText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
        cn: '左',
      },
    },
    {
      id: 'Copied Engels Marx Smash Forward',
      regex: / 14:472E:Engels starts using Marx Smash/,
      regexFr: / 14:472E:Engels starts using Coup De Marx/,
      alertText: {
        en: 'Front and Center',
        de: 'Vorne und Mitte',
        fr: 'Devant et au centre',
      },
    },
    {
      id: 'Copied Engels Marx Smash Back',
      regex: / 14:472A:Engels starts using Marx Smash/,
      regexFr: / 14:472A:Engels starts using Coup De Marx/,
      alertText: {
        en: 'Back and Sides',
        de: 'Hinten und Seiten',
        fr: 'Arrière et côtés',
      },
    },
    {
      id: 'Copied Engels Marx Crush',
      regex: / 14:4746:Engels starts using Marx Crush/,
      regexFr: / 14:4746:Engels starts using Pinçage De Marx/,
      infoText: {
        en: 'Kill Claws',
        de: 'Klauen töten',
        fr: 'Tuez les pinces',
      },
    },
    {
      id: 'Copied Engels Precision Guided Missile',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00C6:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Tank Buster on YOU',
        de: 'Tankbuster auf DIR',
        fr: 'Tankbuster sur VOUS',
      },
    },
    {
      id: 'Copied Engels Diffuse Laser',
      regex: / 14:4755:Engels starts using Diffuse Laser/,
      regexFr: / 14:4755:Engels starts using Laser Diffractif/,
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
      regex: / 14:473C:Engels starts using Energy Barrage/,
      regexFr: / 14:473C:Engels starts using Rideau De Balles/,
      infoText: {
        en: 'Go Sides (Near Front)',
        de: 'Zu den Seiten (Nahe der Front)',
        fr: 'Allez sur les côtés (vers l\'avant)',
      },
    },
    {
      id: 'Copied Engels Energy Barrage',
      regex: / 14:473C:Engels starts using Energy Barrage/,
      regexFr: / 14:473C:Engels starts using Rideau De Balles/,
      delaySeconds: 8,
      infoText: {
        en: 'Get Towers',
        de: 'Türme nehmen',
        fr: 'Prenez les tours',
      },
    },
    {
      id: 'Copied Engels Incendiary Bombing',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0017:/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
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
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00C5:/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
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
      regex: / 15:\y{ObjectId}:Engels:473F:/,
      durationSeconds: 4,
      infoText: {
        en: 'Adds (Ignore Small)',
        de: 'Adds (kleine ignorieren)',
        fr: 'Adds (ignorez les petits)',
      },
    },
    {
      id: 'Copied Engels Incendiary Saturation Bombing',
      regex: / 14:474E:Engels starts using Incendiary Saturation Bombing/,
      regexFr: / 14:474E:Engels starts using Salve Incendiaire/,
      alertText: {
        en: 'Front and Center',
        de: 'Vorne und Mitte',
        fr: 'Devant et au centre',
      },
    },
    {
      id: 'Copied Engels Marx Thrust',
      regex: / 14:48A8:Engels starts using Marx Activation/,
      regexFr: / 14:48A8:Engels starts using Activation De Marx/,
      delaySeconds: 9,
      infoText: {
        en: 'Look For Wall Saws',
        de: 'Halt nach den kleinen Sägen ausschau',
        fr: 'Repérez les scies',
      },
    },
    {
      id: 'Copied 9S Neutralization',
      regex: / 14:48F5:9S-Operated Walking Fortress starts using Neutralization on (\y{Name})\./,
      regexFr: / 14:48F5:9S : avec multipède esclave starts using Tir De Suppression on (\y{Name})\./,
      condition: function(data, matches) {
        return data.me == matches[1] || data.role == 'healer';
      },
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
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
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Copied 9S Laser Saturation',
      regex: / 14:48F6:9S-Operated Walking Fortress starts using Laser Saturation/,
      regexFr: / 14:48F6:9S : avec multipède esclave starts using Laser Multidirectionnel/,
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
      regex: / 14:4A74:9S-Operated Walking Fortress starts using Laser Turret/,
      regexFr: / 14:4A74:9S : avec multipède esclave starts using Canons Laser/,
      alertText: {
        en: 'Away From Front',
        de: 'Weg von Vorne',
        fr: 'Eloignez vous de l\'avant',
      },
    },
    {
      id: 'Copied 9S Ballistic Impact',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:008B:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispertion',
      },
    },
    {
      id: 'Copied 9S Goliath Laser Turret',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00A4:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Laser Buster on YOU',
        de: 'Laser Tankbuster auf DIR',
        fr: 'Laser Tankbuster sur VOUS',
      },
    },
    {
      id: 'Copied 9S Laser Fore-Hind Cannons',
      regex: / 14:48DF:9S-Operated Walking Fortress starts using Fore-Hind Cannons/,
      regexFr: / 14:48DF:9S : avec multipède esclave starts using Balayage Avant Arrière/,
      infoText: {
        en: 'Go Sides',
        de: 'Zu den Seiten',
        fr: 'Sur les côtés',
      },
    },
    {
      id: 'Copied 9S Dual-Flank Cannons',
      regex: / 14:48DE:9S-Operated Walking Fortress starts using Dual-Flank Cannons/,
      regexFr: / 14:48DE:9S : avec multipède esclave starts using Balayage Latéral/,
      infoText: {
        en: 'Go Front / Back',
        de: 'Geh nach Vorne / Hinten',
        fr: 'Allez devant / derrière',
      },
    },
    {
      id: 'Copied 9S Engage Marx Support',
      regex: / 14:48D3:9S-Operated Walking Fortress starts using Engage Marx Support/,
      regexFr: / 14:48D3:9S : avec multipède esclave starts using Appel De Renforts : Marx/,
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
      regex: / 15:\y{ObjectId}:9S-Operated Walking Fortress:48EA:/,
      regexFr: / 15:\y{ObjectId}:9S : avec multipède esclave:48EA:/,
      infoText: {
        en: 'Adds',
        de: 'Adds',
        fr: 'Adds',
      },
    },
    {
      id: 'Copied 9S Engage Goliath Tank Support',
      regex: / 14:48E5:9S-Operated Walking Fortress starts using Engage Goliath Tank Support/,
      regexFr: / 14:48E5:9S : avec multipède esclave starts using Appel De Renfort : Char Goliath/,
      infoText: {
        en: 'Adds',
        de: 'Adds',
        fr: 'Adds',
      },
    },
    {
      id: 'Copied 9S Hack Goliath Tank',
      regex: / 14:48E7:9S-Operated Walking Fortress starts using Hack Goliath Tank/,
      regexFr: / 14:48E7:9S : avec multipède esclave starts using Piratage : Char Goliath/,
      alertText: {
        en: 'Go Behind Untethered Tank',
        de: 'Hinter den nicht verbundenen Panzer gehen',
        fr: 'Derrière le tank non-lié',
      },
    },
    {
      id: 'Copied 9S Shrapnel Impact',
      regex: / 14:48F3:9S-Operated Walking Fortress starts using Shrapnel Impact/,
      regexFr: / 14:48F3:9S : avec multipède esclave starts using Chute De Débris/,
      suppressSeconds: 2,
      infoText: {
        en: 'Stack',
        de: 'Sammeln',
        fr: 'Package',
      },
    },
    {
      id: 'Copied 9S Bubble',
      regex: / 14:48EB:9S-Operated Walking Fortress starts using Total Annihilation Maneuver/,
      regexFr: / 14:48EB:9S : avec multipède esclave starts using Attaque : Bombardement Dévastateur/,
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
        'Quality assurance will be sealed off': 'bis sich der Zugang zu[rm]? Warenkontrollhalle schließt',
        'Reverse-jointed Goliath': 'Goliath mit Inversgelenk',
        'Serial-jointed Command Model': 'Befehlsmodell mit Omnigelenk',
        'Serial-jointed Service Model': 'Modell mit Omnigelenk',
        'Small Biped': 'kleiner Zweibeiner',
        'Small Flyer': 'kleine Flugeinheit',
        'The forward deck will be sealed off': 'bis sich der Zugang zu[rm]? Vorderen Deck schließt', // FIXME
        'The rear deck will be sealed off': 'bis sich der Zugang zu[rm]? Hinteren Deck schließt', // FIXME
        'Warehouse A will be sealed off': 'bis sich der Zugang zu[rm]? Warenlager A schließt',
        'Warehouse B will be sealed off': 'bis sich der Zugang zu[rm]? Warenlager B schließt',
        'Warehouse C will be sealed off': 'bis sich der Zugang zu[rm]? Warenlager C schließt',
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
        'Diffuse Laser': 'Schwerer Diffusionslaser',
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
        'Guided Missile': 'Lenkraketen',
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
        'Diffuse Laser': 'Super laser diffractif',
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
        'Guided Missile': 'Missile à tête chercheuse',
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
        'Wall Mechanic': 'Méchanique du mur',
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
        'Diffuse Laser': '広拡散レーザー',
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
        'Guided Missile': '誘導ミサイル',
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
