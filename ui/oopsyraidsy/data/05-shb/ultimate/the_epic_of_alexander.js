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
      condition: function(data) {
        return !data.seenOutburst;
      },
      // TODO: implement suppressSeconds @_@
      suppressSeconds: 5,
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
      run: function(data) {
        // Hacky suppress forever code.
        data.seenOutburst = true;
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
        return data.IsPlayerId(e.targetId);
      },
      collectSeconds: 0.5,
      mistake: function(e) {
        if (e.length <= 2)
          return;
        // Tanks can invuln and stack this, but it should never hit 3 people.
        return { type: 'fail', fullText: e[0].abilityName + ' x ' + e.length };
      },
    },
  ],
}];
