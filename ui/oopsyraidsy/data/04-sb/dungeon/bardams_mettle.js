'use strict';

// Ala Mhigo
[{
  zoneRegex: {
    en: /^Bardam's Mettle$/,
    cn: /^巴儿达木霸道$/,
    ko: /^바르담 패도$/,
  },
  zoneId: ZoneId.BardamsMettle,
  damageWarn: {
    'Bardam Dirty Claw': '21A8', // Frontal cleave, Gulo Gulo trash
    'Bardam Epigraph': '23AF', // Line AoE, Wall of Bardam trash
    'Bardam The Dusk Star': '2187', // Circle AoE, environment before first boss
    'Bardam The Dawn Star': '2186', // Circle AoE, environment before first boss
    'Bardam Crumbling Crust': '1F13', // Circle AoEs, Garula, first boss
    'Bardam Ram Rush': '1EFC', // Line AoEs, Steppe Yamaa, first boss.
    'Bardam Lullaby': '24B2', // Circle AoEs, Steppe Sheep, first boss.
    'Bardam Heave': '1EF7', // Frontal cleave, Garula, first boss
    'Bardam Wide Blaster': '24B3', // Enormous frontal cleave, Steppe Coeurl, first boss
    'Bardam Double Smash': '26A', // Circle AoE, Mettling Dhara trash
    'Bardam Transonic Blast': '1262', // Circle AoE, Steppe Eagle trash
    'Bardam Wild Horn': '2208', // Frontal cleave, Khun Gurvel trash
    'Bardam Heavy Strike 1': '2578', // 1 of 3 270-degree ring AoEs, Bardam, second boss
    'Bardam Heavy Strike 2': '2579', // 2 of 3 270-degree ring AoEs, Bardam, second boss
    'Bardam Heavy Strike 3': '257A', // 3 of 3 270-degree ring AoEs, Bardam, second boss
    'Bardam Tremblor 1': '257B', // 1 of 2 concentric ring AoEs, Bardam, second boss
    'Bardam Tremblor 2': '257C', // 2 of 2 concentric ring AoEs, Bardam, second boss
    'Bardam Throwing Spear': '257F', // Checkerboard AoE, Throwing Spear, second boss
    'Bardam Bardam\'s Ring': '2581', // Donut AoE headmarkers, Bardam, second boss
    'Bardam Comet': '257D', // Targeted circle AoEs, Bardam, second boss
    'Bardam Comet Impact': '2580', // Circle AoEs, Star Shard, second boss
    'Bardam Iron Sphere Attack': '16B6', // Contact damage, Iron Sphere trash, before third boss
    'Bardam Tornado': '247E', // Circle AoE, Khun Shavara trash
    'Bardam Pinion': '1F11', // Line AoE, Yol Feather, third boss
    'Bardam Feather Squall': '1F0E', // Dash attack, Yol, third boss
    'Bardam Flutterfall Untargeted': '1F12', // Rotating circle AoEs, Yol, third boss
  },
  shareWarn: {
    'Bardam Garula Rush': '1EF9', // Line AoE, Garula, first boss.
    'Bardam Flutterfall Targeted': '1F0C', // Circle AoE headmarker, Yol, third boss
    'Bardam Wingbeat': '1F0F', // Conal AoE headmarker, Yol, third boss
  },
  gainsEffectWarn: {
    'Bardam Confused': '0B', // Failed gaze attack, Yol, third boss
  },
  gainsEffectFail: {
    'Bardam Fetters': '56A', // Failing two mechanics in any one phase on Bardam, second boss.
  },
}];
