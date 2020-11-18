// Shinryu Normal

[{
  zoneId: ZoneId.TheRoyalMenagerie,
  damageWarn: {
    'Shinryu Akh Rhai': '1FA6', // Sky lasers alongside Akh Morn.
    'Shinryu Blazing Trail': '221A', // Rectangle AoEs, intermission adds.
    'Shinryu Collapse': '2218', // Circle AoEs, intermission adds
    'Shinryu Dragonfist': '24F0', // Giant punchy circle in the center.
    'Shinryu Earth Breath': '1F9D', // Conal attacks that aren't actually Earth Shakers.
    'Shinryu Gyre Charge': '1FA8', // Green dive bomb attack.
    'Shinryu Spikesicle': '1FA`', // Blue-green line attacks from behind.
    'Shinryu Tail Slap': '1F93', // Red squares indicating the tail's landing spots.
  },
  shareWarn: {
    'Shinryu Levinbolt': '1F9C',
  },
  triggers: [
    {
      // Icy floor attack.
      id: 'Shinryu Diamond Dust',
      // Thin Ice
      netRegex: NetRegexes.gainsEffect({ effectId: '38F' }),
      deathReason: function(e, data, matches) {
        return { type: 'fail', name: matches.target, reason: { en: 'Slid off!' } };
      },
    },
    {
      id: 'Shinryu Tidal Wave',
      damageRegex: '1F8B',
      deathReason: function(e) {
        return { type: 'fail', name: e.targetName, reason: { en: 'Pushed off!' } };
      },
    },
    {
      // Knockback from center.
      id: 'Shinryu Aerial Blast',
      damageRegex: '1F90',
      deathReason: function(e) {
        return { type: 'fail', name: e.targetName, reason: { en: 'Pushed off!' } };
      },
    },
  ],
}];

