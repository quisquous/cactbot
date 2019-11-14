'use strict';

// TODO: exceptionally high hand of pain/parting damage

[{
  zoneRegex: /^The Epic [Oo]f Alexander \(Ultimate\)$/,
  damageWarn: {
    'TEA Sluice': '49B1',
    'TEA Protean Wave 1': '4824',
    'TEA Protean Wave 2': '49B5',
  },
  triggers: [
    {
      id: 'TEA Protean Wave Double 1',
      damageRegex: '49B6',
      condition: function(e, data) {
        // Double taps only.
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'TEA Protean Wave Double 2',
      damageRegex: '4825',
      condition: function(e, data) {
        // Double taps only.
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'TEA Fluid Swing',
      damageRegex: '49B0',
      condition: function(e, data) {
        // Double taps only.
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'TEA Fluid Strike',
      damageRegex: '49B7',
      condition: function(e, data) {
        // Double taps only.
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // Balloon Popping.  It seems like the person who pops it is the
      // first person listed damage-wise, so they are likely the culprit.
      id: 'TEA Outburst',
      damageRegex: '482A',
      collectSeconds: 0.5,
      // TODO: implement suppress
      suppressSeconds: 5,
      mistake: function(e, data) {
        return { type: 'fail', blame: e[0].targetName, text: e[0].attackerName };
      },
    },
    {
      // "too much luminous aetheroplasm"
      // When this happens, the target explodes, hitting nearby people
      // but also themselves.
      id: 'TEA Exhaust',
      damageRegex: '481F',
      condition: function(e, data) {
        return e.targetName == e.attackerName;
      },
      mistake: function(e, data) {
        return {
          type: 'fail',
          blame: e.targetName,
          text: 'luminous aetheroplasm',
        };
      },
    },
    {
      id: 'TEA Dropsy',
      gainsEffectRegex: gLang.kEffect.Dropsy,
      mistake: function(e, data) {
        return { type: 'warn', name: e.targetName, text: e.effectName };
      },
    },
    {
      id: 'TEA Tether Tracking',
      regex: / 23:(\y{ObjectId}):Jagd Doll:\y{ObjectId}:(\y{Name}):....:....:0011:/,
      run: function(e, data, matches) {
        data.jagdTether = data.jagdTether || {};
        data.jagdTether[matches[1]] = matches[2];
      },
    },
    {
      id: 'TEA Reducible Complexity',
      damageRegex: '4821',
      mistake: function(e, data) {
        return {
          type: 'fail',
          // This may be undefined, which is fine.
          name: data.jagdTether ? data.jagdTether[e.attackerId] : undefined,
          text: 'Doll Death',
        };
      },
    },
    {
      id: 'TEA Drainage',
      damageRegex: '4827',
      condition: function(e, data) {
        // TODO: remove this when ngld overlayplugin is the default
        if (!data.party.partyNames.length)
          return false;

        return data.IsPlayerId(e.targetId) && !data.party.isTank(e.targetName);
      },
      mistake: function(e, data) {
        return { type: 'fail', name: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'TEA Throttle Tracking',
      gainsEffectRegex: gLang.kEffect.Throttle,
      losesEffectRegex: gLang.kEffect.Throttle,
      run: function(e, data) {
        data.hasThrottle = data.hasThrottle || {};
        data.hasThrottle[e.targetName] = e.gains;
      },
    },
    {
      id: 'TEA Throttle',
      gainsEffectRegex: gLang.kEffect.Throttle,
      delaySeconds: function(e) {
        return e.durationSeconds - 0.5;
      },
      deathReason: function(e, data) {
        if (!data.hasThrottle)
          return;
        if (!data.hasThrottle[e.targetName])
          return;
        return {
          name: e.targetName,
          reason: e.effectName,
        };
      },
    },
  ],
}];
