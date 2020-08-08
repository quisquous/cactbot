'use strict';

// TODO: FIX luminous aetheroplasm warning not working
// TODO: FIX doll death not working
// TODO: failing hand of pain/parting (check for high damage?)
// TODO: make sure everybody takes exactly one protean (rather than watching double hits)
// TODO: thunder not hitting exactly 2?
// TODO: person with water/thunder debuff dying
// TODO: bad nisi pass
// TODO: failed gavel mechanic
// TODO: double rocket punch not hitting exactly 2? (or tanks)
// TODO: standing in sludge puddles before hidden mine?
// TODO: hidden mine failure?
// TODO: failures of ordained motion / stillness
// TODO: failures of plaint of severity (tethers)
// TODO: failures of plaint of solidarity (shared sentence)
// TODO: ordained capital punishment hitting non-tanks

[{
  zoneId: ZoneId.TheEpicOfAlexanderUltimate,
  damageWarn: {
    'TEA Sluice': '49B1',
    'TEA Protean Wave 1': '4824',
    'TEA Protean Wave 2': '49B5',
    'TEA Spin Crusher': '4A72',
    'TEA Sacrament': '485F',
    'TEA Radiant Sacrament': '4886',
    'TEA Almighty Judgment': '4890',
  },
  damageFail: {
    'TEA Hawk Blaster': '4830',
    'TEA Chakram': '4855',
    'TEA Enumeration': '4850',
    'TEA Apocalyptic Ray': '484C',
    'TEA Propeller Wind': '4832',
  },
  shareWarn: {
    'TEA Protean Wave Double 1': '49B6',
    'TEA Protean Wave Double 2': '4825',
    'TEA Fluid Swing': '49B0',
    'TEA Fluid Strike': '49B7',
    'TEA Hidden Mine': '4852',
    'TEA Alpha Sword': '486B',
    'TEA Flarethrower': '486B',
    'TEA Chastening Heat': '4A80',
    'TEA Divine Spear': '4A82',
    'TEA Ordained Punishment': '4891',
    // Optical Spread
    'TEA Individual Reprobation': '488C',
  },
  triggers: [
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
      netRegex: NetRegexes.gainsEffect({ effectId: '121' }),
      mistake: function(e, data, matches) {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
    {
      id: 'TEA Tether Tracking',
      netRegex: NetRegexes.tether({ source: 'Jagd Doll', id: '0011' }),
      run: function(e, data, matches) {
        data.jagdTether = data.jagdTether || {};
        data.jagdTether[matches.sourceId] = matches.target;
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
      id: 'TEA Throttle Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '2BC' }),
      run: function(e, data, matches) {
        data.hasThrottle = data.hasThrottle || {};
        data.hasThrottle[matches.target] = true;
      },
    },
    {
      id: 'TEA Throttle Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '2BC' }),
      run: function(e, data, matches) {
        data.hasThrottle = data.hasThrottle || {};
        data.hasThrottle[matches.target] = false;
      },
    },
    {
      id: 'TEA Throttle',
      netRegex: NetRegexes.gainsEffect({ effectId: '2BC' }),
      delaySeconds: function(e, data, matches) {
        return parseFloat(matches.duration) - 0.5;
      },
      deathReason: function(e, data, matches) {
        if (!data.hasThrottle)
          return;
        if (!data.hasThrottle[matches.target])
          return;
        return {
          name: matches.target,
          reason: matches.effect,
        };
      },
    },
    {
      // Optical Stack
      id: 'TEA Collective Reprobation',
      damageRegex: '488D',
      condition: function(e, data) {
        // Single Tap
        return e.type == '15';
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
