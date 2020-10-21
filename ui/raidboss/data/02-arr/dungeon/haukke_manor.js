'use strict';

[{
  zoneId: ZoneId.HaukkeManor,
  timelineFile: 'haukke_manor.txt',
  triggers: [
    {
      id: 'Haukke Normal Dark Mist DPS/Heals',
      netRegex: NetRegexes.startsUsing({ id: '2C1', source: ['Manor Claviger', 'Manor Maidservant', 'Lady Amandine'] }),
      condition: function(data) {
      return data.role != 'tank';
      },
      suppressSeconds: 2,
      response: Responses.getOut('alert'),
    },
    {
      id: 'Haukke Normal Dark Mist Tank',
      netRegex: NetRegexes.startsUsing({ id: '2C1', source: ['Manor Claviger', 'Manor Maidservant', 'Lady Amandine'] }),
      condition: function(data) {
      return data.role == 'tank';
      },
      suppressSeconds: 2,
      response: Responses.stun('info'),
    },
    {
      id: 'Haukke Normal Claviger Void Fire II DPS/Heals',
      netRegex: NetRegexes.startsUsing({ id: '357', source: 'Manor Claviger' }),
      condition: function(data) {
      return data.role != 'tank';
      },
      response: Responses.getOut('alert'),
    },
    {
      id: 'Haukke Normal Claviger Void Fire II Tank',
      netRegex: NetRegexes.startsUsing({ id: '357', source: 'Manor Claviger' }),
      condition: function(data) {
      return data.role == 'tank';
      },
      response: Responses.interrupt('info'),
    },
    {
      id: 'Haukke Normal Steward Soul Drain DPS/Heals',
      netRegex: NetRegexes.startsUsing({ id: '35C', source: 'Manor Steward' }),
      condition: function(data) {
      return data.role != 'tank';
      },
      response: Responses.outOfMelee('alert'),
    },
    {
      id: 'Haukke Normal Steward Soul Drain Tank',
      netRegex: NetRegexes.startsUsing({ id: '35C', source: 'Manor Steward' }),
      condition: function(data) {
      return data.role == 'tank';
      },
      response: Responses.stun('info'),
    },
    {
      id: 'Haukke Normal Amandine Void Fire III',
      netRegex: NetRegexes.startsUsing({ id: '356', source: 'Lady Amandine' }),
      condition: function(data) {
      return data.role == 'tank';
      },
      response: Responses.interrupt('info'),
    },
    {
      id: 'Haukke Normal Amandine Void Thunder III',
      netRegex: NetRegexes.startsUsing({ id: '358', source: 'Manor Claviger' }),
      condition: function(data) {
      return data.role == 'tank';
      },
      response: Responses.interrupt('info'),
    }, 
    {
      id: 'Haukke Normal Void Lamps',
      regex: /The void lamps have begun/,
      infoText: function(data) {
      return {
          en: 'Turn off Lamps',
        };
      },
    },
    {
      id: 'Haukke Normal Ladys Candle',
      netRegex: NetRegexes.addedCombatant({ name: Lady\'s Candle', capture: false }),
      response: Responses.killAdds('info'),
    },
    {
      id: 'Haukke Normal Ladys Candle Self Destruct',
      netRegex: NetRegexes.startsUsing({ id: '151', name: Lady\'s Candle' }),
      response: Responses.getOut('alert'),
    },
    {
      id: 'Haukke Normal Ladys Handmaiden',
      netRegex: NetRegexes.addedCombatant({ name: Lady\'s Handmaiden', capture: false }),
      suppressSeconds: 2,
      infoText: function(data) {
      return {
      en: 'Kill Adds, Sentry First',
       };
      },
    },
  ],
}];
