'use strict';

// Ala Mhigo
[{
  zoneRegex: {
    en: /Ala Mhigo/,
    ko: /^알라미고$/,
  },
  damageWarn: {
    'Ala Mhigo Magitek Ray': '24CE', // Line AoE, Legion Predator trash, before boss 1
    'Ala Mhigo Lock On': '2047', // Homing circles, boss 1
    'Ala Mhigo Tail Laser 1': '2049', // Frontal line AoE, boss 1
    'Ala Mhigo Tail Laser 2': '204B', // Rear line AoE, boss 1
    'Ala Mhigo Tail Laser 3': '204C', // Rear line AoE, boss 1
    'Ala Mhigo Shoulder Cannon': '24D0', // Circle AoE, Legion Avenger trash, before boss 2
    'Ala Mhigo Cannonfire': '23ED', // Environmental circle AoE, path to boss 2
    'Ala Mhigo Aetherochemical Grenado': '205A', // Circle AoE, boss 2
    'Ala Mhigo Integrated Aetheromodulator': '205B', // Ring AoE, boss 2
    'Ala Mhigo Circle Of Death': '24D4', // Proximity circle AoE, Hexadrone trash, before boss 3
    'Ala Mhigo Exhaust': '24D3', // Line AoE, Legion Colossus trash, before boss 3
    'Ala Mhigo Grand Sword': '24D2', // Conal AoE, Legion Colossus trash, before boss 3
    'Ala Mhigo Art Of The Storm 1': '2066', // Proximity circle AoE, pre-intermission, boss 3
    'Ala Mhigo Art Of The Storm 2': '2587', // Proximity circle AoE, intermission, boss 3
    'Ala Mhigo Vein Splitter 1': '24B6', // Proximity circle AoE, primary entity, boss 3
    'Ala Mhigo Vein Splitter 2': '206C', // Proximity circle AoE, helper entity, boss 3
    'Ala Mhigo Lightless Spark': '206B', // Conal AoE, boss 3
  },
  triggers: [
    {
      id: 'Ala Mhigo Demimagicks',
      damageRegex: '205E',
      condition: function(e) {
        // Double taps only
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'Ala Mhigo Unmoving Troika',
      damageRegex: '2060',
      condition: function(e) {
        // Double taps only
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'Ala Mhigo Art Of The Sword 1',
      damageRegex: '2069',
      condition: function(e) {
        // Double taps only
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'Ala Mhigo Art Of The Sword 2',
      damageRegex: '2589',
      condition: function(e) {
        // Double taps only
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // It's possible players might just wander into the bad on the outside,
      // but normally people get pushed into it.
      id: 'Ala Mhigo Art Of The Swell',
      gainsEffectRegex: gLang.kEffect.DamageDown,
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
