'use strict';

[{
  zoneRegex: /(^Eden's Gate: Resurrection \(Savage\)$|Unknown Zone \(355\))/,
  timelineFile: 'e1s.txt',
  triggers: [
    {
      id: 'E1S Initial',
      regex: / 14:3D70:Eden Prime starts using (?:Eden's Gravity|)/,
      regexDe: / 14:3D70:Prim-Eden starts using /,
      regexFr: / 14:3D70:Primo-Éden starts using (?:Gravité Édénique|)/,
      run: function(data) {
        if (!data.viceCount) {
          data.viceCount = 1;
          data.vice = 'dps';
          console.log('1: dps');
        }
      },
    },
    {
      id: 'E1S Paradise Regained',
      regex: / 1A:\y{ObjectId}:Eden Prime gains the effect of (?:Unknown_7B6|Paradise Regained)/,
      regexDe: / 1A:\y{ObjectId}:Prim-Eden gains the effect of (?:Unknown_7B6|Paradise Regained)/,
      regexFr: / 1A:\y{ObjectId}:Primo-Éden gains the effect of (?:Unknown_7B6|Paradise Regained)/,
      run: function(data) {
        data.paradise = true;
      },
    },
    {
      id: 'E1S Paradise Regained But Lost',
      regex: / 1E:\y{ObjectId}:Eden Prime loses the effect of (?:Unknown_7B6|Paradise Regained)/,
      regexDe: / 1E:\y{ObjectId}:Prim-Eden loses the effect of (?:Unknown_7B6|Paradise Regained)/,
      regexFr: / 1E:\y{ObjectId}:Primo-Éden loses the effect of (?:Unknown_7B6|Paradise Regained)/,
      run: function(data) {
        data.paradise = false;
      },
    },
    {
      id: 'E1S Eden\'s Gravity',
      regex: / 14:3D70:Eden Prime starts using (?:Eden's Gravity|)/,
      regexDe: / 14:3D70:Prim-Eden starts using /,
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
      regexDe: / 14:3D8B:Prim-Eden starts using /,
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
      regexDe: / 14:3D7F:Prim-Eden starts using /,
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
      regexDe: / 14:3D88:Prim-Eden starts using (?:Unknown_3D88) on (\y{Name})/,
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
      regexDe: / 14:3D73:Prim-Eden starts using /,
      regexFr: / 14:3D73:Primo-Éden starts using (?:Brasier Édénique|)/,
      alertText: {
        en: 'Under',
        fr: 'Sous le boss',
      },
    },
    {
      id: 'E1S Delta Attack 1',
      regex: / 14:44F4:Eden Prime starts using (?:Delta Attack|)/,
      regexDe: / 14:44F4:Prim-Eden starts using /,
      regexFr: / 14:44F4:Primo-Éden starts using /,
      alertText: {
        en: 'Cross Spread',
      },
    },
    {
      id: 'E1S Delta Attack 2',
      regex: / 14:44F8:Eden Prime starts using (?:Delta Attack|)/,
      regexDe: / 14:44F8:Prim-Eden starts using /,
      regexFr: / 14:44F8:Primo-Éden starts using /,
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
      // 44EF: dps1
      // 3D7A: dps2
      // 44EE: tank1
      // 3D78: tank2
      // 44F0: healer1
      // 3D7D: healer2
      id: 'E1S Vice and Virtue DPS 1',
      regex: / 14:(?:44EF|3D7A|44EE|3D78|44F0|3D7D):Eden Prime starts using (?:Vice and Virtue|)/,
      regexDe: / 14:(?:44EF|3D7A|44EE|3D78|44F0|3D7D):Prim-Eden starts using /,
      regexFr: / 14:(?:44EF|3D7A|44EE|3D78|44F0|3D7D):Primo-Éden starts using /,
      run: function(data) {
        // Note: this happens *after* the marks, so is setting up vice for the next marks.
        data.viceCount++;
        let viceMap = {
          1: 'dps',
          2: 'tank',
          3: 'healer',

          4: 'tank',
          5: 'dps',
          6: 'healer',

          7: 'tank',
          8: 'dps',
          9: 'healer',

          // theoretically??
          10: 'tank',
          11: 'dps',
          12: 'healer',
        };
        console.log(data.viceCount + ': ' + viceMap[data.viceCount]);
        data.vice = viceMap[data.viceCount];
      },
    },
    {
      id: 'E1S Vice and Virtue DPS 2',
      regex: / 14:3D7A:Eden Prime starts using (?:Vice and Virtue|)/,
      regexDe: / 14:3D7A:Prim-Eden starts using /,
      regexFr: / 14:3D7A:Primo-Éden starts using /,
      run: function(data) {
        data.vice = 'dps';
      },
    },
    {
      id: 'E1S Vice and Virtue Tank 1',
      regex: / 14:44EE:Eden Prime starts using (?:Vice and Virtue|)/,
      regexDe: / 14:44EE:Prim-Eden starts using /,
      regexFr: / 14:44EE:Primo-Éden starts using /,
      run: function(data) {
        data.vice = 'healer';
      },
    },
    {
      id: 'E1S Vice and Virtue Tank 2',
      regex: / 14:3D78:Eden Prime starts using (?:Vice and Virtue|)/,
      regexDe: / 14:3D78:Prim-Eden starts using /,
      regexFr: / 14:3D78:Primo-Éden starts using /,
      run: function(data) {
        data.vice = 'dps';
      },
    },
    {
      id: 'E1S Vice and Virtue Healer 1',
      regex: / 14:44F0:Eden Prime starts using (?:Vice and Virtue|)/,
      regexDe: / 14:44F0:Prim-Eden starts using /,
      regexFr: / 14:44F0:Primo-Éden starts using /,
      run: function(data) {
        data.vice = 'tank';
      },
    },
    {
      id: 'E1S Vice and Virtue Healer 2',
      regex: / 14:3D7D:Eden Prime starts using (?:Vice and Virtue|)/,
      regexDe: / 14:3D7D:Prim-Eden starts using /,
      regexFr: / 14:3D7D:Primo-Éden starts using /,
      run: function(data) {
        data.vice = 'tank';
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
      regexDe: / 14:3D7A:Prim-Eden starts using /,
      regexFr: / 14:3D7A:Primo-Éden starts using /,
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
      regexDe: / 14:3D78:Prim-Eden starts using /,
      regexFr: / 14:3D78:Primo-Éden starts using /,
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
        if (data.role == 'dps')
          return data.paradise;
        if (data.role == 'tank')
          return !data.paradise;
        return false;
      },
      suppressSeconds: 20,
      alertText: {
        en: 'Take prey from healer',
      },
    },
    {
      id: 'E1S Mana Boost',
      regex: / 14:3D8D:Guardian Of Paradise starts using (?:Mana Boost|)/,
      regexDe: / 14:3D8D:Hüter [Vv]on Eden starts using /,
      regexFr: / 14:3D8D:.* starts using /,
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
      regexDe: / 14:3D8A:Prim-Eden starts using /,
      regexFr: / 14:3D8A:Primo-Éden starts using (?:Lumière Purificatrice|)/,
      alertText: {
        en: 'Get Behind',
        fr: 'Derrière le boss',
      },
    },
    {
      id: 'E1S Pure Beam 1',
      regex: / 14:3D80:Eden Prime starts using (?:Pure Beam|)/,
      regexDe: / 14:3D80:Prim-Eden starts using /,
      regexFr: / 14:3D80:Primo-Éden starts using /,
      infoText: {
        en: 'Get Outside Your Orb',
      },
    },
    {
      id: 'E1S Pure Beam 2',
      regex: / 14:3D82:Eden Prime starts using (?:Pure Beam|)/,
      regexDe: / 14:3D82:Prim-Eden starts using /,
      regexFr: / 14:3D82:Primo-Éden starts using /,
      infoText: {
        en: 'Bait Orb Lasers Outside',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Eden Prime': 'Prim-Eden',
        'Guardian Of Paradise': 'Hüter Von Eden',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Eden-Prime': 'Primo-Éden',
        'Guardian Of Paradise': '',
      },
    },
    ],
}];
