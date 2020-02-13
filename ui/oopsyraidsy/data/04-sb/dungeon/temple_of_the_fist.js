'use strict';

// Temple of the Fist
[{
  zoneRegex: {
    en: /Temple Of The Fist/,
    ko: /^성도산 사원$/,
  },
  damageWarn: {
    'Temple Fire Break': '21ED', // Conal AoE, Bloodglider Monk trash
    'Temple Radial Blaster': '1FD3', // Circle AoE, boss 1
    'Temple Wide Blaster': '1FD4', // Conal AoE, boss 1
    'Temple Crippling Blow': '2016', // Line AoEs, environmental, before boss 2
    'Temple Broken Earth': '236E', // Circle AoE, Singha trash
    'Temple Shear': '1FDD', // Dual conal AoE, boss 2
    'Temple Counter Parry': '1FE0', // Retaliation for incorrect direction after Killer Instinct, boss 2
    'Temple Tapas': '', // Tracking circular ground AoEs, boss 2
    'Temple Hellseal': '200F', // Red/Blue symbol failure, boss 2
    'Temple Pure Will': '2017', // Circle AoE, Spirit Flame trash, before boss 3
    'Temple Megablaster': '163', // Conal AoE, Coeurl Prana trash, before boss 3
    'Temple Windburn': '1FE8', // Circle AoE, Twister wind, boss 3
    'Temple Hurricane Kick': '1FE5', // 270-degree frontal AoE, boss 3
    'Temple Silent Roar': '1FEB', // Frontal line AoE, boss 3
    'Temple Mighty Blow': '1FEA', // Contact with coeurl head, boss 3
  },
  triggers: [
    {
      id: 'Temple Heat Lightning', // Purple spread circles, boss 1
      damageRegex: '1FD7',
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
