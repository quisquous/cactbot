'use strict';

// Fractal Continuum
[{
  zoneRegex: {
    en: /^The Fractal Continuum$/,
    ko: /^무한연속 박물함$/,
  },
  damageWarn: {
    'Fractal Double Sever': 'F7D', // Conals, boss 1
    'Fractal Aetheric Compression': 'F80', // Ground AoE circles, boss 1
    'Fractal 11-Tonze Swipe': 'F81', // Frontal cone, boss 2
    'Fractal 10-Tonze Slash': 'F83', // Frontal line, boss 2
    'Fractal 111-Tonze Swing': 'F87', // Get-out AoE, boss 2
    'Fractal Broken Glass': 'F8E', // Glowing panels, boss 3
    'Fractal Mines': 'F90',
    'Fractal Seed of the Rivers': 'F91', // Ground AoE circles, boss 3
  },
  triggers: [
    {
      id: 'Fractal Sanctification', // Instant conal buster, boss 3
      damageRegex: 'F89',
      condition: function(e) {
        // Double taps only
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
