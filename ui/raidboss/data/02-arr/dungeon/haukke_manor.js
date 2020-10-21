'use strict';

[{
  zoneId: ZoneId.HaukkeManor,
  triggers: [
    {
      id: 'Haukke Normal Dark Mist Stun',
      netRegex: NetRegexes.startsUsing({ id: '2C1', source: ['Manor Maidservant', 'Manor Claviger', 'Lady Amandine'] }),
      condition: function(data) {
        return data.canStun();
      },
      suppressSeconds: 2,
      response: Responses.stun('info'),
    },
    {
      id: 'Haukke Normal Steward Soul Drain Stun',
      netRegex: NetRegexes.startsUsing({ id: '35C', source: 'Manor Steward' }),
      condition: function(data) {
        return data.canStun();
      },
      response: Responses.stun('info'),
    },
    {
      id: 'Haukke Normal Amandine Void Fire III',
      netRegex: NetRegexes.startsUsing({ id: '356', source: 'Lady Amandine' }),
      condition: function(data) {
        return data.canInterrupt();
      },
      response: Responses.interrupt('info'),
    },
    {
      id: 'Haukke Normal Amandine Void Thunder III',
      netRegex: NetRegexes.startsUsing({ id: '358', source: 'Manor Claviger' }),
      condition: function(data) {
        return data.canInterrupt();
      },
      response: Responses.interrupt('info'),
    },
    {
      //Void Lamp Spawn
      id: 'Haukke Normal Void Lamps',
      netRegex: NetRegexes.message({ line: 'The void lamps have begun emitting an eerie glow*?' }),
      infoText: function(data) {
        return {
          en: 'Turn off Lamps',
        };
      },
    },
    {
      //Lady's Candle Spawn
      id: 'Haukke Normal Ladys Candle',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '425', capture: false }),
      response: Responses.killAdds('info'),
    },
    {
      //Last Adds Spawn
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
