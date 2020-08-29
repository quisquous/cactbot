'use strict';

// UCU - The Unending Coil Of Bahamut (Ultimate)
[{
  zoneId: ZoneId.TheUnendingCoilOfBahamutUltimate,
  damageFail: {
    'UCU Lunar Dynamo': '26BC',
    'UCU Iron Chariot': '26BB',
    'UCU Exaflare': '26EF',
    'UCU Wings Of Salvation': '26CA',
  },
  triggers: [
    {
      id: 'UCU Twister Death',
      damageRegex: '26AB',
      condition: function(e, data) {
        // Instant death uses '36' as its flags, differentiating
        // from the explosion damage you take when somebody else
        // pops one.
        return data.IsPlayerId(e.targetId) && e.flags == '36';
      },
      mistake: function(e) {
        return {
          type: 'fail',
          blame: e.targetName,
          text: {
            en: 'Twister Pop',
            de: 'Wirbelsturm berührt',
            fr: 'Apparition des tornades',
            ko: '회오리 밟음',
          },
        };
      },
    },
    {
      id: 'UCU Thermionic Burst',
      damageRegex: '26B9',
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
            fr: 'Parts de pizza',
            ko: '장판에 맞음',
          },
        };
      },
    },
    {
      id: 'UCU Chain Lightning',
      damageRegex: '26C8',
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
            fr: 'frappé par la foudre',
            ko: '번개 맞음',
          },
        };
      },
    },
    {
      id: 'UCU Burns',
      netRegex: NetRegexes.gainsEffect({ effectId: 'FA' }),
      mistake: function(e, data, matches) {
        return { type: 'warn', blame: e.target, text: e.effect };
      },
    },
    {
      id: 'UCU Sludge',
      netRegex: NetRegexes.gainsEffect({ effectId: '11F' }),
      mistake: function(e, data, matches) {
        return { type: 'fail', blame: e.target, text: e.effect };
      },
    },
    {
      id: 'UCU Doom Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D2' }),
      run: function(e, data, matches) {
        data.hasDoom = data.hasDoom || {};
        data.hasDoom[matches.target] = true;
      },
    },
    {
      id: 'UCU Doom Lose',
      netRegex: NetRegexes.losesEffect({ effectId: 'D2' }),
      run: function(e, data, matches) {
        data.hasDoom = data.hasDoom || {};
        data.hasDoom[matches.target] = false;
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
      id: 'UCU Doom Death',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D2' }),
      delaySeconds: function(e, data, matches) {
        return parseFloat(matches.duration) - 1;
      },
      deathReason: function(e, data, matches) {
        if (!data.hasDoom || !data.hasDoom[matches.target])
          return;
        let reason;
        if (e.durationSeconds < 9)
          reason = matches.effect + ' #1';
        else if (e.durationSeconds < 14)
          reason = matches.effect + ' #2';
        else
          reason = matches.effect + ' #3';
        return { name: matches.target, reason: reason };
      },
    },
  ],
}];
