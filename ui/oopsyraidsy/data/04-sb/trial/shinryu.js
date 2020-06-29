'use strict';

// Shinryu Normal

[{
  zoneRegex: {
    en: /^The Royal Menagerie$/,
    cn: /^阿拉米格王宫屋顶庭园$/,
    ko: /^알라미고 왕궁 옥상정원$/,
  },
  zoneId: ZoneId.TheRoyalMenagerie,
  damageWarn: {
    'Akh Rhai': '1FA6', // Sky lasers alongside Akh Morn.
    'Blazing Trail': '221A', // Rectangle AoEs, intermission adds.
    'Collapse': '2218', // Circle AoEs, intermission adds
    'Dragonfist': '24F0', // Giant punchy circle in the center.
    'Earth Breath': '1F9D', // Conal attacks that aren't actually Earth Shakers.
    'Gyre Charge': '1FA8', // Green dive bomb attack.
    'Spikesicle': '1FA`', // Blue-green line attacks from behind.
    'Tail Slap': '1F93', // Red squares indicating the tail's landing spots.
  },
  shareWarn: {
    'Shinryu Normal Levinbolt': '1F9C',
  },
  triggers: [
    {
      // Icy floor attack.
      id: 'Shinryu Normal Diamond Dust',
      gainsEffectRegex: gLang.kEffect.ThinIce,
      deathReason: function(e) {
        return { type: 'fail', name: e.targetName, reason: { en: 'Slid off!' } };
      },
    },
    {
      id: 'Shinryu Normal Tidal Wave',
      damageRegex: '1F8B',
      deathReason: function(e) {
        return { type: 'fail', name: e.targetName, reason: { en: 'Pushed off!' } };
      },
    },
    {
      // Knockback from center.
      id: 'Shinryu Normal Aerial Blast',
      damageRegex: '1F90',
      deathReason: function(e) {
        return { type: 'fail', name: e.targetName, reason: { en: 'Pushed off!' } };
      },
    },
  ],
}];

