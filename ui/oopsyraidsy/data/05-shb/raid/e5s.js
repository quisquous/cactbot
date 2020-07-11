'use strict';

// TODO: is there a different ability if the shield duty action isn't used properly?
// TODO: is there an ability from Raiden (the bird) if you get eaten?
// TODO: maybe chain lightning warning if you get hit while you have system shock (8B8)

let noOrb = (str) => {
  return {
    en: str + ' (no orb)',
    de: str + ' (kein Orb)',
    fr: str + ' (pas d\'orbe)',
  };
};

[{
  zoneRegex: {
    en: /^Eden's Verse: Fulmination \(Savage\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(1\)$/,
  },
  zoneId: ZoneId.EdensVerseFulminationSavage,
  damageWarn: {
    'Impact': '4E3B', // Stratospear landing AoE
    'Gallop': '4BB4', // Sideways add charge
    'Shock Strike': '4BC1', // Small AoE circles during Thunderstorm
    'Stepped Leader Twister': '4BC7', // Twister stepped leader
    'Stepped Leader Donut': '4BC8', // Donut stepped leader
    'Shock': '4E3D', // Hated of Levin Stormcloud-cleansable exploding debuff
  },
  damageFail: {
    'Judgment Jolt': '4BA7', // Stratospear explosions
  },
  shareWarn: {
    'E5S Volt Strike Double': '4BC3', // Large AoE circles during Thunderstorm
    'E5S Crippling Blow': '4BCA',
    'E5S Chain Lightning Double': '4BC5',
  },
  triggers: [
    {
      // Helper for orb pickup failures
      id: 'E5S Orb Tracking',
      gainsEffectRegex: gLang.kEffect.SurgeProtection,
      losesEffectRegex: gLang.kEffect.SurgeProtection,
      run: function(e, data) {
        data.hasOrb = data.hasOrb || {};
        data.hasOrb[e.targetName] = e.gains;
      },
    },
    {
      id: 'E5S Divine Judgement Volts',
      damageRegex: '4BB7',
      condition: function(e, data) {
        return !data.hasOrb || !data.hasOrb[e.targetName];
      },
      mistake: function(e) {
        return { type: 'fail', blame: e.targetName, text: noOrb(e.abilityName) };
      },
    },
    {
      id: 'E5S Volt Strike Orb',
      damageRegex: '4BC3',
      condition: function(e, data) {
        return !data.hasOrb || !data.hasOrb[e.targetName];
      },
      mistake: function(e) {
        return { type: 'fail', blame: e.targetName, text: noOrb(e.abilityName) };
      },
    },
    {
      id: 'E5S Deadly Discharge Big Knockback',
      damageRegex: '4BB2',
      condition: function(e, data) {
        return !data.hasOrb || !data.hasOrb[e.targetName];
      },
      mistake: function(e) {
        return { type: 'fail', blame: e.targetName, text: noOrb(e.abilityName) };
      },
    },
    {
      id: 'E5S Lightning Bolt',
      damageRegex: '4BB9',
      condition: function(e, data) {
        // Having a non-idempotent condition function is a bit <_<
        // Only consider lightning bolt damage if you have a debuff to clear.
        if (!data.hated || !data.hated[e.targetName])
          return true;

        delete data.hated[e.targetName];
        return false;
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E5S Hated of Levin',
      regex: Regexes.headMarker({ id: '00D2' }),
      run: function(e, data, matches) {
        data.hated = data.hated || {};
        data.hated[matches.target] = true;
      },
    },
    {
      id: 'E5S Stormcloud Target Tracking',
      regex: Regexes.headMarker({ id: '006E' }),
      run: function(e, data, matches) {
        data.cloudMarkers = data.cloudMarkers || [];
        data.cloudMarkers.push(matches.target);
      },
    },
    {
      // This ability is seen only if players stacked the clouds instead of spreading them.
      id: 'E5S The Parting Clouds',
      damageRegex: '4BBA',
      suppressSeconds: 30,
      mistake: function(e, data) {
        for (let m of data.cloudMarkers) {
          return {
            type: 'fail',
            blame: data.cloudMarkers[m],
            text: e.abilityName + '(clouds too close)',
          };
        }
      },
    },
    {
      id: 'E5S Stormcloud cleanup',
      regex: Regexes.headMarker({ id: '006E' }),
      // Stormclouds resolve well before this.
      delaySeconds: 30,
      run: function(e, data) {
        delete data.cloudMarkers;
        delete data.hated;
      },
    },
  ],
}];
