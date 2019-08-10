'use strict';

[{
  zoneRegex: /Dun Scaith/,
  timelineFile: 'dun_scaith.txt',
  triggers: [

    // Basic stack occurs across all encounters except Deathgaze.

    {
      id: 'Dun Scaith Generic Stack-up',
      regex: / 1B:........:(\y{Name}):....:....:003E/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Stack on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
        };
      },
    },

    // DEATHGAZE

    {
      id: 'Dun Scaith Void Death',
      regex: / 14:(?:1C7F|1C90):Deathgaze Hollow starts using Void Death/,
      suppressSeconds: 5,
      alertText: {
        en: 'Out of death circle',
      },
    },
    {
      // Currently set up to just notify the healers/Bard to cleanse.
      // Or use / 16:........:Deathgaze Hollow:1C85:Doomsay:........:(\y{Name})
      // This would allow for notifying who needs cleansing directly, but might be spammy

      id: 'Dun Scaith Doom',
      regex: / 14:1C8[45]:Deathgaze Hollow starts using Doomsay/,
      condition: function(data) {
        return data.CanCleanse();
      },
      alertText: {
        en: 'Cleanse Doom soon!',
      },
    },
    {
      // There's another Void Blizzard IV with ID 1C77, but it's not the timing we want
      // The actual knockback cast is Void Aero IV, but it gives only 2-3s warning.
      id: 'Dun Scaith Blizzard Pillars',
      regex: / 14:1C8B:Deathgaze Hollow starts using Void Blizzard IV/,
      suppressSeconds: 5,
      alertText: {
        en: 'Knockback soon--Get in front of ice pillar',
      },
    },
    {
      id: 'Dun Scaith Void Sprite',
      regex: / 03:........:Added new combatant Void Sprite/,
      suppressSeconds: 10,
      infoText: {
        en: 'Kill sprites',
      },
    },
    {
      id: 'Dun Scaith Aero 2',
      regex: / 1B:........:(\y{Name}):....:....:0046/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Drop Tornado outside',
      },
    },
    {
      // Deathgaze has two separate casts for this
      // Which one appears to depend on whether it's used alongside Bolt of Darkness
      // Mechanically the handling is the same
      id: 'Dun Scaith Aero 3',
      regex: / 14:(?:1C7B|1C8D):Deathgaze Hollow starts using Void Aero III/,
      suppressSeconds: 5,
      alertText: {
        en: 'Knockback from center',
      },
    },
    {

      id: 'Dun Scaith Void Death',
      regex: / 14:1C82:Deathgaze Hollow starts using Void Death/,
      suppressSeconds: 5,
      alertText: {
        en: 'Avoid death squares',
      },
    },

    // FERDIAD

    {
      id: 'Dun Scaith Scythe Drop',
      regex: / 1B:........:(\y{Name}):....:....:0017/,
      suppressSeconds: 5,
      infoText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Drop scythe outside',
          };
        }
      },
    },
    {
      id: 'Dun Scaith Jongleur\'s X',
      regex: / 14:1C98:Ferdiad Hollow starts using Jongleur's X on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank buster on YOU',
          };
        }
      },
      infoText: function(data) {
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      // Wailing Atomos is blue, Cursed Atomos is yellow.
      // 1C9F:Aether is the circle AoE, 1CA0:Aetherial Chakram is the donut AoE
      id: 'Dun Scaith Blue Atomos',
      regex: / 14:(\y{AbilityCode}):\y{Name} starts using Juggling Sphere on Wailing Atomos/,
      alertText: function(matches) {
        if (matches[1] == '1C9F') {
          return {
            en: 'Avoid Untethered Blue',
          };
        }
        if (matches[1] == '1CA0') {
          return {
            en: 'Go to Untethered Blue',
          };
        }
      },
    },
    {
      id: 'Dun Scaith Yellow Atomos',
      regex: / 14:(\y{AbilityCode}):\y{Name} starts using Juggling Sphere on Cursing Atomos/,
      alertText: function(matches) {
        if (matches[1] == '1C9F') {
          return {
            en: 'Avoid Untethered Yellow',
          };
        }
        if (matches[1] == '1CA0') {
          return {
            en: 'Go to Untethered Yellow',
          };
        }
      },
    },
    {
      id: 'Dun Scaith Blackfire',
      regex: / 14:1CAA:Ferdiad Hollow starts using Blackfire/,
      infoText: {
        en: 'Avoid puddles',
      },
    },
    {
      id: 'Dun Scaith Debilitator',
      regex: / 1A:........:\y{Name} gains the effect of (Fire|Water) Resistance Down/,
      suppressSeconds: 10,
      alertText: function(matches) {
        if (matches[1] == 'Water') {
          return {
            en: 'Change puddles to fire',
          };
        }
        if (matches[1] == 'Fire') {
          return {
            en: 'Change puddles to water',
          };
        }
      },
    },

    // PROTO-ULTIMA

    {
      // The trident laser is a series of three separate casts
      // Each has an incremental ID: 1D96, 1D97, 1D98
      id: 'Dun Scaith Aetherochemical Laser',
      regex: / 14:1D96:Proto Ultima starts using Aetherochemical Laser/,
      infoText: {
        en: 'Dodge trident laser',
      },
    },
    {
      // Handles both 1E52 Aetherochemical Flare and 1D9D Supernova
      id: 'Dun Scaith Proto-Ultima Raid Damage',
      regex: / 14:(?:1E52|1D9D): Proto Ultima Starts Using/,
      condition: function(data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'Raid Damage',
      },
    },
    {
      id: 'Dun Scaith Prey Markers',
      regex: / 1A:........:(\y{Name}) gains the effect of Prey/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Prey--Avoid party and keep moving',
          };
        }
      },
    },
    {
      id: 'Dun Scaith Flare Star',
      regex: / 14:1DA4:Proto Ultima starts using Flare Star/,
      suppressSeconds: 1,
      preRun: function(data) {
        data.flareStarCount = (data.flareStarCount || 0) + 1;
      },
      alertText: function(data) {
        if (data.flareStarCount == 1) {
          return {
            en: 'Out of center--Wait for outer ring then keep going',
          };
        }
        return {
          en: 'Avoid flares--Wait for outer ring then keep going',
        };
      },
    },
    {
      id: 'Dun Scaith Citadel Buster',
      regex: / 14:1DAB:Proto Ultima starts using Citadel Buster/,
      alertText: {
        en: 'Avoid line AoE',
      },
    },
    {
      // Triggering off the Bit appearance
      // The cast time on Aetheromodulator is under 3 seconds
      id: 'Dun Scaith Bit Circles',
      regex: / 03:........:Added new combatant Proto Bit/,
      suppressSeconds: 5,
      infoText: {
        en: 'Avoid Bit AoEs',
      },
    },
    {
      id: 'Dun Scaith Aether Collectors',
      regex: /03:........:Added new combatant Aether Collector/,
      suppressSeconds: 5,
      alertText: {
        en: 'Kill collectors',
      },
    },


    // SCATHACH

    {
      // The actual attack is 1D20, but the castbar windup is 1D1F
      id: 'Dun Scaith Shadespin',
      regex: / 14:1D1(E|F):Scathach starts using Shadespin/,
      suppressSeconds: 5,
      infoText: {
        en: 'Avoid arm slaps',
      },
    },
    {
      id: 'Dun Scaith Thirty Thorns',
      regex: / (1[56]:........:Scathach:1D2B:Thirty Thorns|1[56]:........:Scathach:1D1B:Soar)/,
      suppressSeconds: 5,
      alertText: {
        en: 'Out of melee',
      },
    },
    {
      id: 'Dun Scaith Thirty Arrows',
      regex: / 14:1D2F:Scathach starts using Thirty Arrows/,
      infoText: {
        en: 'Avoid line AoEs',
      },
    },
    {
      id: 'Dun Scaith Thirty Souls',
      regex: / 14:1D32:Scathach starts using Thirty Souls/,
      condition: function(data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'Raid damage',
      },
    },
    {
      // Ordinarily we wouldn't use a game log line for this.
      // However, the RP text seems to be the only indicator.
      id: 'Dun Scaith Shadow Links',
      regex: /Shadows gather on the floor/,
      suppressSeconds: 5,
      infoText: {
        en: 'Stop moving',
      },
    },
    {
      id: 'Dun Scaith Shadow Limb Spawn',
      regex: / 03:........:Added new combatant Shadow Limb/,
      suppressSeconds: 5,
      alertText: {
        en: 'Kill the hands',
      },
    },
    {
      id: 'Dun Scaith Connla Spawn',
      regex: / 14:1CD1:Connla starts using Pitfall/,
      alertText: {
        en: 'Avoid AoE, Kill Connla',
      },
    },

    // These triggers are common to both Scathach and Diabolos

    {
      id: 'Dun Scaith Nox Orbs',
      regex: / 1B:........:(\y{Name}):....:....:005C/,
      suppressSeconds: 5,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Take orb outside',
          };
        }
      },
    },
    {
      id: 'Dun Scaith Shadethrust',
      regex: / 14:(?:1D23:Scathach|1C1A:Diabolos Hollow) starts using Shadethrust/,
      infoText: {
        en: 'Away from front',
      },
    },

    // DIABOLOS

    {
      id: 'Dun Scaith Ultimate Terror',
      regex: / 14:1C12:Diabolos starts using Ultimate Terror/,
      infoText: {
        en: 'Get in',
      },
    },
    {
      id: 'Dun Scaith Nightmare',
      regex: / 14:(1C0E|1C20):\y{Name} starts using (Nightmare|Hollow Nightmare)/,
      alertText: {
        en: ' Look away',
      },
    },
    {
      id: 'Dun Scaith Noctoshield',
      regex: / 1A:........:Diabolos gains the effect of Noctoshield/,
      suppressSeconds: 5,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      alertText: {
        en: 'Boss hitting hard--Shield/Mitigate',
      },
    },
    {
      id: 'Dun Scaith Ruinous Omen',
      regex: / 14:(?:1C10|1C11):Diabolos starts using Ruinous Omen/,
      suppressSeconds: 5,
      condition: function(data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'Raid damage incoming',
      },
    },
    {
      id: 'Dun Scaith Deathgates',
      regex: / 03:........:Added new combatant Deathgate/,
      suppressSeconds: 5,
      infoText: {
        en: 'Kill the deathgates',
      },
    },
    {
      id: 'Dun Scaith Camisado',
      regex: / 14:1C19:Diabolos Hollow starts using Hollow Camisado on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank buster on YOU',
          };
        }
      },
      infoText: function(data) {
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Dun Scaith Hollow Night',
      regex: / 1B:........:(\y{Name}):....:....:005B/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Gaze stack on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]) + ' and look away',
        };
      },
    },
    {
      id: 'Dun Scaith Hollow Omen',
      regex: / (?:14:1C22|14:1C23):Diabolos Hollow starts using Hollow Omen/,
      suppressSeconds: 5,
      condition: function(data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'Extreme raid damage!',
      },
    },
    {
      // This is the tank version of the stack marker. It has minimal circular bordering
      id: 'Dun Scaith Blindside',
      regex: / 1B:........:(\y{Name}):....:....:005D/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Stack on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'Dun Scaith Earth Shaker',
      regex: /1B:........:(\y{Name}):....:....:0028/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Earth Shaker on YOU',
      },
    },
  ],
},
];
