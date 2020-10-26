'use strict';

[{
  zoneId: ZoneId.HaukkeManor,
  triggers: [
    {
      id: 'Haukke Normal Dark Mist Stun',
      netRegex: NetRegexes.startsUsing({ id: '2C1', source: ['Manor Maidservant', 'Manor Claviger', 'Lady Amandine'] }),
      condition: function(data, matches) {
        return data.CanStun();
      },
      suppressSeconds: 2,
      response: Responses.stun('info'),
    },
    {
      id: 'Haukke Normal Steward Soul Drain Stun',
      netRegex: NetRegexes.startsUsing({ id: '35C', source: 'Manor Steward' }),
      condition: function(data, matches) {
        return data.CanStun();
      },
      response: Responses.stun('info'),
    },
    {
      // Particle and spell effects make this particular Dark Mist hard to see.
      id: 'Haukke Normal Amandine Dark Mist Dodge',
      netRegex: NetRegexes.startsUsing({ id: '2C1', source: 'Lady Amandine' }),
      condition: function(data, matches) {
        return !data.CanStun();
      },
      response: Responses.outOfMelee('alert'),
    },
    {
      id: 'Haukke Normal Amandine Void Fire III',
      netRegex: NetRegexes.startsUsing({ id: '356', source: 'Lady Amandine' }),
      condition: function(data, matches) {
        return data.CanSilence();
      },
      response: Responses.interrupt('info'),
    },
    {
      id: 'Haukke Normal Amandine Void Thunder III',
      netRegex: NetRegexes.startsUsing({ id: '358', source: 'Lady Amandine' }),
      condition: function(data, matches) {
        return data.CanSilence();
      },
      response: Responses.getBehind('info'),
    },
    {
      // Void Lamp Spawn
      id: 'Haukke Normal Void Lamps',
      netRegex: NetRegexes.message({ line: 'The void lamps have begun emitting an eerie glow.', capture: false }),
      infoText: {
        en: 'Turn off Lamps',
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
      alertText: {
        en: 'Kill Sentry',
      },
    },
  ],
}];
