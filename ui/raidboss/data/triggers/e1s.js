'use strict';

[{
  zoneRegex: /(^Eden's Gate: Resurrection \(Savage\)$|Unknown Zone \(355\))/,
  timelineFile: 'e1s.txt',
  triggers: [
    {
      id: 'E1S Paradise Regained',
      regex: / 1A:\y{ObjectId}:Eden Prime gains the effect of (?:Unknown_7B6|Paradise Regained)/,
      run: function(data) {
        data.paradise = true;
      },
    },
    {
      id: 'E1S Paradise Regained But Lost',
      regex: / 1E:\y{ObjectId}:Eden Prime loses the effect of (?:Unknown_7B6|Paradise Regained)/,
      run: function(data) {
        data.paradise = false;
      },
    },
    {
      id: 'E1S Eden\'s Gravity',
      regex: / 14:3D70:Eden Prime starts using (?:Eden's Gravity|)/,
      regexFr: / 14:3D70:Primo-Éden starts using (?:Gravité Édénique|)/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'E1S Fragor Maximus',
      regex: / 14:3D8B:Eden Prime starts using (?:Fragor Maximus|)/,
      regexFr: / 14:3D8B::Primo-Éden starts using (?:Fragor Maximus|)/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'E1S Dimensional Shift',
      regex: / 14:3D7F:Eden Prime starts using (?:Dimensional Shift|)/,
      regexFr: / 14:3D7F:Primo-Éden starts using (?:Translation Dimensionnelle|)/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'E1S Spear Of Paradise',
      regex: / 14:3D88:Eden Prime starts using (?:Spear Of Paradise|Unknown_3D88) on (\y{Name})/,
      regexFr: / 14:3D88:Primo-Éden starts using (?:Lance [Dd]u [Pp]aradis|Unknown_3D88) on (\y{Name})/,
      alarmText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'tank')
          return;

        return {
          en: 'Tank Swap!',
          de: 'Tankwechsel!',
          fr: 'Tank swap !',
        };
      },
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'E1S Eden\'s Flare',
      regex: / 14:3D73:Eden Prime starts using (?:Eden's Flare|)/,
      regexFr: / 14:3D73:Primo-Éden starts using (?:Brasier Édénique|)/,
      alertText: {
        en: 'Under',
        fr: 'Sous le boss',
      },
    },
    {
      id: 'E1S Delta Attack 1',
      regex: / 14:44F4:Eden Prime starts using (?:Delta Attack|)/,
      alertText: {
        en: 'Cross Spread',
      },
    },
    {
      id: 'E1S Delta Attack 2',
      regex: / 14:44F8:Eden Prime starts using (?:Delta Attack|)/,
      alertText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Get In, Spread',
          };
        }
        return {
          en: 'In, Stack Behind',
        };
      },
    },
    {
      id: 'E1S Vice and Virtue DPS 1',
      regex: / 14:44EF:Eden Prime starts using (?:Vice and Virtue|)/,
      run: function(data) {
        data.vice = 'dps';
      },
    },
    {
      id: 'E1S Vice and Virtue DPS 2',
      regex: / 14:3D7A:Eden Prime starts using (?:Vice and Virtue|)/,
      run: function(data) {
        data.vice = 'dps';
      },
    },
    {
      id: 'E1S Vice and Virtue Tank 1',
      regex: / 14:44EE:Eden Prime starts using (?:Vice and Virtue|)/,
      run: function(data) {
        data.vice = 'tank';
      },
    },
    {
      id: 'E1S Vice and Virtue Tank 2',
      regex: / 14:3D78:Eden Prime starts using (?:Vice and Virtue|)/,
      run: function(data) {
        data.vice = 'tank';
      },
    },
    {
      id: 'E1S Vice and Virtue Healer 1',
      regex: / 14:44F0:Eden Prime starts using (?:Vice and Virtue|)/,
      run: function(data) {
        data.vice = 'healer';
      },
    },
    {
      id: 'E1S Vice and Virtue Healer 2',
      regex: / 14:3D7D:Eden Prime starts using (?:Vice and Virtue|)/,
      run: function(data) {
        data.vice = 'healer';
      },
    },
    {
      id: 'E1S Vice and Virtue DPS 1',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00AE:/,
      condition: function(data, matches) {
        return !data.paradise && data.vice == 'dps' && data.me == matches[1];
      },
      alertText: {
        en: 'Puddle Spread',
      },
    },
    {
      id: 'E1S Vice and Virtue DPS 2',
      regex: / 14:3D7A:Eden Prime starts using (?:Vice and Virtue|)/,
      alertText: {
        en: 'Stack With Partner',
      },
    },
    {
      id: 'E1S Vice and Virtue Tank Mark',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00AE:/,
      condition: function(data, matches) {
        return data.vice == 'tank' && data.me == matches[1];
      },
      infoText: {
        en: 'Tank Laser on YOU',
        fr: 'Tank laser sur VOUS',
      },
    },
    {
      id: 'E1S Vice and Virtue Tank Stack',
      regex: / 14:3D78:Eden Prime starts using (?:Vice and Virtue|)/,
      condition: function(data) {
        return data.role != 'tank';
      },
      infoText: {
        en: 'Stack in front of tank',
      },
    },
    {
      id: 'E1S Vice and Virtue Healer Mark YOU',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of (?:Unknown_83F|Prey)/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: function(data) {
        if (data.paradise) {
          return {
            en: 'Pass Prey to DPS',
          };
        }
        return {
          en: 'Pass Prey to Tank',
        };
      },
    },
    {
      id: 'E1S Vice and Virtue Healer Mark Not You',
      regex: / 1A:\y{ObjectId}:\y{Name} gains the effect of (?:Unknown_83F|Prey)/,
      condition: function(data, matches) {
        if (data.paradise && data.role == 'dps')
          return true;
        if (!data.paradise && data.role == 'tank')
          return true;
        return data.role != 'healer';
      },
      suppressSeconds: 1,
      alertText: {
        en: 'Take prey from healer',
      },
    },
    {
      id: 'E1S Mana Boost',
      regex: / 14:3D8D:Guardian Of Paradise starts using (?:Mana Boost|)/,
      condition: function(data) {
        return data.CanSilence();
      },
      alertText: {
        en: 'Silence Guardian',
      },
    },
    {
      id: 'E1S Pure Light',
      regex: / 14:3D8A:Eden Prime starts using (?:Pure Light|)/,
      regexFr: / 14:3D8A:Primo-Éden starts using (?:Lumière Purificatrice|)/,
      alertText: {
        en: 'Get Behind',
        fr: 'Derrière le boss',
      },
    },
    {
      id: 'E1S Pure Beam 1',
      regex: / 14:3D80:Eden Prime starts using (?:Pure Beam|)/,
      infoText: {
        en: 'Get Outside Your Orb',
      },
    },
    {
      id: 'E1S Pure Beam 2',
      regex: / 14:3D82:Eden Prime starts using (?:Pure Beam|)/,
      infoText: {
        en: 'Bait Orb Lasers Outside',
      },
    },
  ],
}];
