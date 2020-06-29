'use strict';

// O4S - Deltascape 4.0 Savage
[{
  zoneRegex: {
    en: /^Deltascape V4\.0 \(Savage\)$/,
    ko: /^차원의 틈 오메가: 델타편\(영웅\) \(4\)$/,
  },
  zoneId: ZoneId.DeltascapeV40Savage,
  damageWarn: {
    'O4S2 Neo Vacuum Wave': '241D',
    'O4S2 Acceleration Bomb': '2431',
    'O4S2 Emptiness': '2422',
  },
  damageFail: {
    'O4S2 Double Laser': '2415',
  },
  triggers: [
    {
      id: 'O4S2 Decisive Battle',
      abilityRegex: '2408',
      run: function(e, data) {
        data.isDecisiveBattleElement = true;
      },
    },
    {
      id: 'O4S1 Vacuum Wave',
      abilityRegex: '23FE',
      run: function(e, data) {
        data.isDecisiveBattleElement = false;
      },
    },
    {
      id: 'O4S2 Almagest',
      abilityRegex: '2417',
      run: function(e, data) {
        data.isNeoExdeath = true;
      },
    },
    {
      id: 'O4S2 Blizzard III',
      damageRegex: '23F8',
      condition: function(e, data) {
        // Ignore unavoidable raid aoe Blizzard III.
        return data.IsPlayerId(e.targetId) && !data.isDecisiveBattleElement;
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'O4S2 Thunder III',
      damageRegex: '23FD',
      condition: function(e, data) {
        // Only consider this during random mechanic after decisive battle.
        return data.IsPlayerId(e.targetId) && data.isDecisiveBattleElement;
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'O4S2 Petrified',
      gainsEffectRegex: gLang.kEffect.Petrification,
      mistake: function(e, data) {
        // On Neo, being petrified is because you looked at Shriek, so your fault.
        if (data.isNeoExdeath)
          return { type: 'fail', blame: e.targetName, text: e.effectName };
        // On normal ExDeath, this is due to White Hole.
        return { type: 'warn', name: e.targetName, text: e.effectName };
      },
    },
    {
      id: 'O4S2 Forked Lightning',
      damageRegex: '242E',
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        let text = e.abilityName + ' => ' + data.ShortName(e.targetName);
        return { type: 'fail', blame: e.attackerName, text: text };
      },
    },
    {
      id: 'O4S2 Double Attack',
      damageRegex: '241C',
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      collectSeconds: 0.5,
      mistake: function(e) {
        if (e.length <= 2)
          return;
        // Hard to know who should be in this and who shouldn't, but
        // it should never hit 3 people.
        return { type: 'fail', fullText: e[0].abilityName + ' x ' + e.length };
      },
    },
    {
      id: 'O4S2 Beyond Death Collect',
      gainsEffectRegex: gLang.kEffect.BeyondDeath,
      losesEffectRegex: gLang.kEffect.BeyondDeath,
      run: function(e, data) {
        data.hasBeyondDeath = data.hasBeyondDeath || {};
        data.hasBeyondDeath[e.targetName] = e.gains;
      },
    },
    {
      id: 'O4S2 Beyond Death',
      gainsEffectRegex: gLang.kEffect.BeyondDeath,
      delaySeconds: function(e) {
        return e.durationSeconds - 1;
      },
      deathReason: function(e, data) {
        if (!data.hasBeyondDeath)
          return;
        if (!data.hasBeyondDeath[e.targetName])
          return;
        return {
          name: e.targetName,
          reason: e.effectName,
        };
      },
    },
  ],
}];
