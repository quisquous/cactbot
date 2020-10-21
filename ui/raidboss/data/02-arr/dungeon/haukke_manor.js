'use strict';

[{
  zoneId: ZoneId.HaukkeManor,
  triggers: [
    {
      // Dark Mist Stun with Suppression for duplicate messages
      id: 'Haukke Normal Dark Mist Stun',
      netRegex: NetRegexes.startsUsing({ id: '2C1', source: ['Manor Maidservant', 'Manor Claviger', 'Lady Amandine'] }),
      condition: function(data) {
        return data.canStun();
      },
      suppressSeconds: 2,
      response: Responses.stun('info'),
    },
    {
      // Soul Drain
      id: 'Haukke Normal Steward Soul Drain Stun',
      netRegex: NetRegexes.startsUsing({ id: '35C', source: 'Manor Steward' }),
      condition: function(data) {
        return data.canStun();
      },
      response: Responses.stun('info'),
    },
    {
      // Amandine Specific Dark Mist for Classes Without Stuns
      // Particle effects in the room and spell effectsd can make this hard to see.
      // Callout ensures dodge.
      id: 'Haukke Normal Amandine Dark Mist Dodge',
      netRegex: NetRegexes.startsUsing({ id: '2C1', source: 'Lady Amandine', capture: false }),
      condition: function(data) {
        return !data.canStun();
      },
      response: Responses.outOfMelee('alert'),
    },
    {
      // Void Fire 3
      id: 'Haukke Normal Amandine Void Fire III',
      netRegex: NetRegexes.startsUsing({ id: '356', source: 'Lady Amandine' }),
      condition: function(data) {
        return data.canInterrupt();
      },
      response: Responses.interrupt('info'),
    },
    {
      // Void Thunder 3
      id: 'Haukke Normal Amandine Void Thunder III',
      netRegex: NetRegexes.startsUsing({ id: '358', source: 'Manor Claviger' }),
      condition: function(data) {
        return data.canInterrupt();
      },
      response: Responses.interrupt('info'),
    },
    {
      // Void Lamp Spawn
      id: 'Haukke Normal Void Lamps',
      netRegex: NetRegexes.message({ line: 'The void lamps have begun emitting an eerie glow.', capture: false }),
      infoText: function(data) {
        return {
          en: 'Turn off Lamps',
        };
      },
    },
    {
      // Lady's Candle Spawn
      id: 'Haukke Normal Ladys Candle',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '425', capture: false }),
      response: Responses.killAdds('info'),
    },
    {
      // 2 Lady's Handmaiden and 1 Manor Sentry Spawn
      // The sentry outside the bosses room loads when you enter the zone.
      // This causes the trigger to go off early, parsing for the Handmaiden fixes the problem.
      // Suppression included since 2 Handmaiden's spawn at the same time
      id: 'Haukke Normal Ladys Handmaiden',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '424', capture: false }),
      suppressSeconds: 2,
      infoText: function(data) {
        return {
          en: 'Kill Adds, Sentry First',
        };
      },
    },
  ],
}];
