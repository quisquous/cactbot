'use strict';

[{
  zoneRegex: {
    en: /^Alexander - The Burden Of The Father \(Savage\)$/,
    cn: /^亚历山大零式机神城 \(启动之章4\)$/,
  },
  timelineFile: 'a4s.txt',
  timelineTriggers: [
    {
      id: 'A4S Hydrothermal Missile',
      beforeSeconds: 5,
      suppressSeconds: 5,
      response: Responses.tankCleave('info'),
    },
  ],
  triggers: [
    {
      id: 'A4S Discord Marker',
      regex: Regexes.headMarker({ id: '00AE' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Orbs on YOU',
            cn: '球点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Orbs on ' + data.ShortName(matches.target),
            cn: '球点' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'A4S Stun Leg',
      regex: Regexes.losesEffect({ effect: 'Stun Resistance' }),
      condition: function(data) {
        return data.CanStun();
      },
      alertText: function(data, matches) {
        return {
          en: 'Stun ' + matches.target,
          cn: '眩晕' + matches.target,
        };
      },
    },
    {
      id: 'A4S Mortal Revolution',
      regex: Regexes.startsUsing({ source: 'The Manipulator', id: '13E7', capture: false }),
      response: Responses.aoe('alert'),
    },
    {
      // This is an 0011 tether, but there's not an easy way to know who it is on 100%,
      // as a set of tethers come out from bits and some may be pre-intercepted.
      id: 'A4S Carnage',
      regex: Regexes.startsUsing({ source: 'The Manipulator', id: 'F5E', capture: false }),
      infoText: {
        en: 'Laser Tethers',
        cn: '镭射连线',
      },
    },
    {
      id: 'A4S Judgment Nisi A',
      regex: Regexes.startsUsing({ source: 'The Manipulator', id: 'F64' }),
      condition: Conditions.targetIsYou(),
      alarmText: {
        en: 'Nisi A on YOU',
        cn: '蓝BUFF点名',
      },
    },
    {
      id: 'A4S Judgment Nisi B',
      regex: Regexes.startsUsing({ source: 'The Manipulator', id: 'F65' }),
      condition: Conditions.targetIsYou(),
      alarmText: {
        en: 'Nisi B on YOU',
        cn: '红BUFF点名',
      },
    },
    {
      id: 'A4S Carnage Zero',
      regex: Regexes.startsUsing({ source: 'The Manipulator', id: 'F5E', capture: false }),
      response: Responses.spread('alert'),
    },
  ],
}];
