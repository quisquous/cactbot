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
      beforeSeconds: 8,
      infoText: {
        en: 'Be Near Boss',
      },
    },
  ],
  triggers: [
    {
      id: 'Copied Serial Forceful Impact',
      regex: / 14:48CF:Serial-Jointed Command Model starts using Forceful Impact/,
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
      alertText: {
        en: 'Get Behind',
      },
    },
    {
      id: 'Copied Serial High-Caliber Laser',
      regex: / 14:48FA:Serial-Jointed Service Model starts using High-Caliber Laser/,
      infoText: {
        en: 'Look for Lasers',
      },
    },
    {
      id: 'Copied Serial Clanging Blow',
      regex: / 14:48CE:Serial-Jointed Command Model starts using Clanging Blow on (\y{Name})\./,
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
      alertText: {
        en: 'Go To Sides',
      },
    },
    {
      id: 'Copied Serial Centrifugal Spin',
      regex: / 14:48CA:Serial-Jointed Command Model starts using Sidestriking Spin/,
      alertText: {
        en: 'Go Front/Back',
      },
    },
    {
      id: 'Copied Serial Shockwave',
      regex: / 14:48C3:Serial-Jointed Command Model starts using Shockwave/,
      infoText: {
        en: 'Knockback',
      },
    },
    {
      id: 'Copied Hobbes Laser-Resistance Test',
      regex: / 14:4805:Hobbes starts using Laser-Resistance Test/,
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
      run: function(data) {
        data.alliance = data.alliance || 'A';
      },
      infoText: {
        en: 'Dodge Moving Circle',
      },
    },
    {
      id: 'Copied Hobbes Flamethrowers',
      regex: / 00:0839:The wall-mounted flamethrowers activate\./,
      run: function(data) {
        data.alliance = data.alliance || 'B';
      },
      alertText: {
        en: 'Dodge Flamethrowers',
      },
    },
    {
      id: 'Copied Hobbes Left Arm 1',
      regex: / 00:0839:The wall-mounted left arm begins to move\.\.\./,
      durationSeconds: 6,
      run: function(data) {
        data.alliance = data.alliance || 'C';
      },
      infoText: {
        en: 'Out',
      },
    },
    {
      id: 'Copied Hobbes Left Arm 2',
      regex: / 00:0839:The wall-mounted left arm begins to move\.\.\./,
      delaySeconds: 8,
      alertText: {
        en: 'Dodge Falling Walls',
      },
    },
    {
      id: 'Copied Hobbes Left Arm 3',
      regex: / 00:0839:The wall-mounted left arm begins to move\.\.\./,
      delaySeconds: 10,
      alertText: {
        en: 'Spread Tethers',
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
      },
    },
    {
      id: 'Copied Hobbes Laser Sight',
      regex: / 14:4807:Hobbes starts using Laser Sight/,
      alertText: {
        en: 'Stack',
      },
    },
    {
      id: 'Copied Hobbes Electric Floor',
      regex: / 00:0839:You hear frenzied movement from machines beneath\.\.\./,
      suppressSeconds: 15,
      durationSeconds: 10,
      infoText: {
        en: 'Dodge Electric Floor',
      },
    },
    {
      id: 'Copied Hobbes Conveyer Belts',
      regex: / 00:0839:The conveyer belts whirr to life!/,
      infoText: {
        en: 'Conveyer Belts',
      },
    },
    {
      id: 'Copied Hobbes Oil 1',
      regex: / 00:0839:Flammable oil is leaking from the floor\.\.\./,
      suppressSeconds: 15,
      durationSeconds: 3,
      alertText: {
        en: 'Get Off Oil Vats',
      },
    },
    {
      id: 'Copied Hobbes Oil 2',
      regex: / 00:0839:Flammable oil is leaking from the floor\.\.\./,
      suppressSeconds: 15,
      delaySeconds: 7,
      durationSeconds: 3,
      alertText: {
        en: 'Get On Oil Vats',
      },
    },
    {
      id: 'Copied Goliath Tank Exploder',
      regex: / 23:\y{ObjectId}:Medium Exploder:\y{ObjectId}:(\y{Name}):....:....:0011:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Exploder on YOU',
      },
    },
    {
      id: 'Copied Flight Unit 360 Bombing Manuever',
      regex: / 14:4941:Flight Unit starts using 360-Degree Bombing Maneuver/,
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
      },
    },
    {
      id: 'Copied Engels Marx Smash Right',
      regex: / 14:4727:Engels starts using Marx Smash/,
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
      alertText: {
        en: 'Front and Center',
      },
    },
    {
      id: 'Copied Engels Marx Smash Back',
      regex: / 14:472A:Engels starts using Marx Smash/,
      alertText: {
        en: 'Back and Sides',
      },
    },
    {
      id: 'Copied Engels Marx Crush',
      regex: / 14:4746:Engels starts using Marx Crush/,
      infoText: {
        en: 'Kill Claws',
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
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Copied Engels Energy Barrage 1',
      regex: / 14:473C:Engels starts using Energy Barrage/,
      infoText: {
        en: 'Go Sides',
      },
    },
    {
      id: 'Copied Engels Energy Barrage',
      regex: / 14:473C:Engels starts using Energy Barrage/,
      delaySeconds: 8,
      alertText: {
        en: 'Get Towers',
      },
    },
    {
      id: 'Copied Engels Incendiary Bombing',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0017:/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Puddle on YOU',
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
          };
        }
      },
    },
    {
      id: 'Copied Engels Reverse-Jointed Goliaths',
      regex: / 03:\y{ObjectId}:Added new combatant Reverse-Jointed Goliath\./,
      suppressSeconds: 2,
      infoText: {
        en: 'Adds',
      },
    },
    {
      id: 'Copied Engels Demolish Structure',
      regex: / 14:4745:Engels starts using Demolish Structure/,
      infoText: {
        en: 'Move to South Edge',
      },
    },
    {
      id: 'Copied Engels Incendiary Saturation Bombing',
      regex: / 14:474E:Engels starts using Incendiary Saturation Bombing/,
      alertText: {
        en: 'Front and Center',
      },
    },
    {
      id: 'Copied Engels Marx Thrust',
      regex: / 14:48FC:Marx starts using Marx Thrust/,
      suppressSeconds: 1,
      alertText: {
        en: 'Dodge Wall Saws',
      },
    },
    {
      id: 'Copied 9S Neutralization',
      regex: / 14:48F5:9S-Operated Walking Fortress starts using Neutralization on (\y{Name})\./,
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
      infoText: {
        en: 'Away From Front',
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
      },
    },
    {
      id: 'Copied 9S Laser Fore-Hind Cannons',
      regex: / 14:48DF:9S-Operated Walking Fortress starts using Fore-Hind Cannons/,
      infoText: {
        en: 'Go Sides',
      },
    },
    {
      id: 'Copied 9S Dual-Flank Cannons',
      regex: / 14:48DE:9S-Operated Walking Fortress starts using Dual-Flank Cannons/,
      infoText: {
        en: 'Go Front / Back',
      },
    },
    {
      id: 'Copied 9S Engage Marx Support',
      regex: / 14:48D3:9S-Operated Walking Fortress starts using Engage Marx Support/,
      alertText: {
        en: 'Dodge Overhead Saws',
      },
    },
    {
      id: 'Copied 9S Serial-Jointed Service Models',
      regex: / 03:\y{ObjectId}:Added new combatant Serial-Jointed Service Model\./,
      suppressSeconds: 2,
      infoText: {
        en: 'Adds',
      },
    },
    {
      id: 'Copied 9S Engage Goliath Tank Support',
      regex: / 14:48E5:9S-Operated Walking Fortress starts using Engage Goliath Tank Support/,
      infoText: {
        en: 'Adds',
      },
    },
    {
      id: 'Copied 9S Hack Goliath Tank',
      regex: / 14:48E7:9S-Operated Walking Fortress starts using Hack Goliath Tank/,
      alertText: {
        en: 'Go Behind Untethered Tank',
      },
    },
    {
      id: 'Copied 9S Shrapnel Impact',
      regex: / 14:48F3:9S-Operated Walking Fortress starts using Shrapnel Impact/,
      suppressSeconds: 2,
      infoText: {
        en: 'Stack',
      },
    },
  ],
}];
