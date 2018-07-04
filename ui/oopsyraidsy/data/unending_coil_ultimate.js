'use strict';

// UCU - The Unending Coil Of Bahamut (Ultimate)
[{
  zoneRegex: /The Unending Coil Of Bahamut \(Ultimate\)/,
  triggers: [
    {
      id: 'UCU Twister Death',
      damageRegex: gLang.kAbility.Twister,
      condition: function(e, data) {
        // Instant death uses '32' as its flags, differentiating
        // from the explosion damage you take when somebody else
        // pops one.
        return data.IsPlayerId(e.targetId) && e.flags == '32';
      },
      mistake: function(e, data) {
        return {
          type: 'fail',
          blame: e.targetName,
          text: {
            en: 'Twister Pop',
            de: 'Wirbelsturm berührt',
          },
        };
      },
    },
    {
      id: 'UCU Thermionic Burst',
      damageRegex: gLang.kAbility.ThermionicBurst,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return {
          type: 'fail',
          blame: e.targetName,
          text: {
            en: 'Pizza Slice',
            de: 'Pizzastück',
          },
        };
      },
    },
    {
      id: 'UCU Dynamo',
      damageRegex: gLang.kAbility.LunarDynamo,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'UCU Chariot',
      damageRegex: gLang.kAbility.IronChariot,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'UCU White Puddle',
      damageRegex: gLang.kAbility.WingsOfSalvation,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'UCU Chain Lightning',
      damageRegex: gLang.kAbility.ChainLightning,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        // It's hard to assign blame for lightning.  The debuffs
        // go out and then explode in order, but the attacker is
        // the dragon and not the player.
        return {
          type: 'warn',
          name: e.targetName,
          text: {
            en: 'hit by lightning',
            de: 'vom Blitz getroffen',
          },
        };
      },
    },
    {
      id: 'UCU Burns',
      gainsEffectRegex: gLang.kEffect.Burns,
      mistake: function(e) {
        return { type: 'fail', blame: e.targetName, text: e.effectName };
      },
    },
    {
      id: 'UCU Sludge',
      gainsEffectRegex: gLang.kEffect.Sludge,
      mistake: function(e) {
        return { type: 'fail', blame: e.targetName, text: e.effectName };
      },
    },
    {
      id: 'UCU Exaflare',
      damageRegex: gLang.kAbility.Exaflare,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      gainsEffectRegex: gLang.kEffect.Doom,
      losesEffectRegex: gLang.kEffect.Doom,
      run: function(e, data) {
        data.hasDoom = data.hasDoom || {};
        data.hasDoom[e.targetName] = e.gains;
      },
    },
    {
      // There is no callout for "you forgot to clear doom".  The logs look
      // something like this:
      //   [20:02:30.564] 1A:Okonomi Yaki gains the effect of Doom from  for 6.00 Seconds.
      //   [20:02:36.443] 1E:Okonomi Yaki loses the effect of Protect from Tako Yaki.
      //   [20:02:36.443] 1E:Okonomi Yaki loses the effect of Doom from .
      //   [20:02:38.525] 19:Okonomi Yaki was defeated by Firehorn.
      // In other words, doom effect is removed +/- network latency, but can't
      // tell until later that it was a death.  Arguably, this could have been a
      // close-but-successful clearing of doom as well.  It looks the same.
      // Strategy: if you haven't cleared doom with 1 second to go then you probably
      // died to doom.  You can get non-fatally iceballed or auto'd in between,
      // but what can you do.
      id: 'UCU Doom',
      gainsEffectRegex: gLang.kEffect.Doom,
      delaySeconds: function(e) {
        return e.durationSeconds - 1;
      },
      deathReason: function(e, data, matches) {
        if (!data.hasDoom || !data.hasDoom[e.targetName])
          return;
        let reason;
        if (e.durationSeconds < 9)
          reason = e.effectName + ' #1';
        else if (e.durationSeconds < 14)
          reason = e.effectName + ' #2';
        else
          reason = e.effectName + ' #3';
        return { name: e.targetName, reason: reason };
      },
    },
  ],
}];
