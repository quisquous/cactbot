'use strict';

[{
  zoneId: ZoneId.BrayfloxsLongstop,
  triggers: [
    {
      id: 'Brayflox Normal Numbing Breath',
      netRegex: NetRegexes.startsUsing({ id: '1FA', source: 'Great Yellow Pelican' }),
      condition: function(data, matches) {
        return data.CanStun();
      },
      response: Responses.stun('info'),
    },
    {
      // Esuna Pelican Poison
      // This covers cases were multiple people get the poison, including yourself.
      id: 'Brayflox Normal Pelican Poison Healer',
      netRegex: NetRegexes.gainsEffect({ effectId: '12' }),
      alertText: function(data, matches) {
        if (matches.target != data.me && data.role == 'healer') {
          return {
            en: 'Esuna Poison on ' + data.ShortName(matches.target),
          };
        }
        if (matches.target == data.me && data.role == 'healer') {
          return {
            en: 'Esuna Your Poison',
          };
        }
      },
    },
    {
      // Pelican Adds
      // Only parsing for Sable Back since there is at least 1 Sable Back in each spawn pack.
      // The pack weith the boss is 3 Violet Backs, not parsing for them prevents the trigger
      // from activating early when you pick up the Headgate Key and the boss and adds spawn.
      id: 'Brayflox Normal Pelican Adds',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '1283', capture: false }),
      suppressSeconds: 2,
      response: Responses.killAdds('info'),
    },
    {
      id: 'Brayflox Normal Ashdrake Burning Cyclone',
      netRegex: NetRegexes.startsUsing({ id: '205', source: 'Ashdrake' }),
      condition: function(data, matches) {
        return data.CanStun();
      },
      response: Responses.stun('info'),
    },
    {
      // Tempest Biast Spawn
      id: 'Brayflox Normal Tempest Biast',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '1285', capture: false }),
      response: Responses.killAdds('info'),
    },
    {
      id: 'Brayflox Normal Inferno Drake Burning Cyclone',
      netRegex: NetRegexes.startsUsing({ id: '3D8', source: 'Inferno Drake' }),
      condition: function(data, matches) {
        return data.CanStun();
      },
      response: Responses.stun('info'),
    },
    {
      // Hellbender Bubble Others
      id: 'Brayflox Normal Hellbender Effluvium',
      netRegex: NetRegexes.ability({ id: '3D3', source: 'Hellbender' }),
      infoText: function(data, matches) {
        if (matches.target != data.me) {
          return {
            en: 'Break Bubble on ' + data.ShortName(matches.target),
          };
        }
        if (matches.target == data.me) {
          return {
            en: 'Break Your Bubble',
          };
        }
      },
    },
    {
      // Stunnable Line Attack
      id: 'Brayflox Normal Aiatar Dragon Breath',
      netRegex: NetRegexes.startsUsing({ id: '22F', source: 'Aiatar' }),
      condition: function(data, matches) {
        return data.CanStun();
      },
      response: Responses.stun('info'),
    },
    {
      // Move Aiatar out of Puddles
      id: 'Brayflox Normal Aiatar Toxic Vomit Tank',
      netRegex: NetRegexes.gainsEffect({ effectId: '117' }),
      condition: function(data, matches) {
        return data.role === 'tank';
      },
      alertText: {
        en: 'Move Boss Out of Puddles',
      },
    },
    {
      // Healer Esuna Poison.
      // This triggers on both Salivous Snap and Puddle Poison Application
      id: 'Brayflox Normal Aiatar Poison Healer',
      netRegex: NetRegexes.gainsEffect({ effectId: '113' }),
      alertText: function(data, matches) {
        if (matches.target != data.me && data.role == 'healer') {
          return {
            en: 'Esuna Poison on ' + data.ShortName(matches.target),
          };
        }
        if (matches.target == data.me && data.role == 'healer') {
          return {
            en: 'Esuna Your Poison',
          };
        }
      },
    },
  ],
}];
