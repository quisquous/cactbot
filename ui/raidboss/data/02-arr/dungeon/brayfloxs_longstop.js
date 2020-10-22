'use strict';

[{
  zoneId: ZoneId.BrayfloxsLongstop,
  triggers: [
    {
      // Numbing Breath is Stunnable
      id: 'Brayflox Normal Numbing Breath',
      netRegex: NetRegexes.startsUsing({ id: '1FA', source: 'Great Yellow Pelican' }),
      condition: function(data) {
        return data.canStun();
      },
      response: Responses.stun('info'),
    },
    {
      // Pelican Adds
      id: 'Brayflox Normal Pelican Adds',
      netRegex: NetRegexes.message({ line: 'A flock of ziz emerges from the jungle!', capture: false }),
      response: Responses.killAdds('info'),
    },
    {
      // Ashdrake Cyclone Stun
      id: 'Brayflox Normal Ashdrake Burning Cyclone',
      netRegex: NetRegexes.startsUsing({ id: '205', source: 'Ashdrake' }),
      condition: function(data) {
        return data.canStun();
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
      // Inferno Drake Cyclone Stun
      // Target is Brayflox because the alert fires slightly sooner to save the player from Cyclone.
      id: 'Brayflox Normal Inferno Drake Burning Cyclone',
      netRegex: NetRegexes.startsUsing({ id: '205', source: 'Inferno Drake' }),
      condition: function(matches, data) {
        return matches.target == 'Brayflox Alltalks' && data.canStun();
      },
      response: Responses.stun('info'),
    },
    {
      // Hellbender Bubble
      id: 'Brayflox Normal Hellbender Effluvium',
      netRegex: NetRegexes.startsUsing({ id: '3D3', source: 'Hellbender', capture: false }),
      alertText: function(data) {
        return {
          en: 'Kill Bubble',
        };
      },
    },
    {
      // Stunnable Line Attack
      id: 'Brayflox Normal Aiatar Dragon Breath',
      netRegex: NetRegexes.startsUsing({ id: '22F', source: 'Aiatar' }),
      condition: function(data) {
        return data.canStun();
      },
      response: Responses.stun('info'),
    },
    {
      // Healer Esuna Poison Application on Tank
      id: 'Brayflox Normal Aiatar Salivous Snap Healer',
      netRegex: NetRegexes.startsUsing({ id: '22E', source: 'Aiatar' }),
      condition: function(matches, data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'Esuna Poison',
      },
    },
    {
      // Move Aiatar out of Puddles
      id: 'Brayflox Normal Aiatar Toxic Vomit Tank',
      netRegex: NetRegexes.message({ line: 'Aiatar is using the poison from the pools to restore its HP!', capture: false }),
      condition: function(data) {
        return data.role == 'tank';
      },
      alertText: {
        en: 'Move Boss Out of Puddles',
      },
    },
    {
      // Healer Esuna Puddle Poison Application
      id: 'Brayflox Normal Aiatar Toxic Vomit Healer',
      netRegex: NetRegexes.startsUsing({ id: '233', source: 'Aiatar', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'Esuna Poison',
      },
    },
  ],
}];
