'use strict';

[{
  zoneRegex: {
    en: /^Alexander - The Fist Of The Father \(Savage\)$/,
    cn: /^亚历山大零式机神城 \(启动之章1\)$/,
  },
  timelineFile: 'a1s.txt',
  timelineTriggers: [
    {
      id: 'A1S Emergency Liftoff',
      regex: /Emergency Liftoff/,
      beforeSeconds: 5,
      infoText: {
        en: 'Liftoff Soon',
      },
    },
  ],
  triggers: [
    {
      id: 'A1S Gunnery Pod',
      regex: Regexes.startsUsing({ id: 'E41', source: 'Oppressor', capture: false }),
      condition: Conditions.caresAboutAOE(),
      suppressSeconds: 3,
      response: Responses.aoe(),
    },
    {
      id: 'A1S Hydrothermal Collect',
      regex: Regexes.headMarker({ id: '001E' }),
      run: function(data, matches) {
        data.hydro = data.hydro || [];
        data.hydro.push(matches.target);
      },
    },
    {
      id: 'A1S Hydrothermal You',
      regex: Regexes.headMarker({ id: '001E' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Hydrothermal on You',
      },
    },
    {
      id: 'A1S Hydrothermal Healer',
      regex: Regexes.headMarker({ id: '001E' }),
      condition: Conditions.caresAboutMagical(),
      infoText: function(data, matches) {
        data.hydro = data.hydro || [];
        if (data.hydro.length == 0)
          return;
        return {
          en: 'Hydrothermal on ' + data.hydro.map((x) => data.ShortName(x)).join(', '),
        };
      },
    },
    {
      id: 'A1S Hydrothermal Cleanup',
      regex: Regexes.headMarker({ id: '001E' }),
      delaySeconds: 10,
      run: function(data, matches) {
        delete data.hydro;
      },
    },
    {
      id: 'A1S Resin Bomb',
      regex: Regexes.startsUsing({ id: 'E46', source: 'Oppressor' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Bait Resin Bomb',
      },
    },
    {
      id: 'A1S Hypercompressed Collect',
      regex: Regexes.startsUsing({ id: 'E4A', source: ['Oppressor', 'Oppressor 0\.5'] }),
      run: function(data, matches) {
        data.hyper = data.hyper || [];
        data.hyper.push(matches.target);
      },
    },
    {
      id: 'A1S Hypercompressed You',
      regex: Regexes.startsUsing({ id: 'E4A', source: ['Oppressor', 'Oppressor 0\.5'] }),
      condition: Conditions.targetIsYou(),
      response: Responses.tankBuster('alarm'),
    },
    {
      id: 'A1S Hypercompressed Other',
      regex: Regexes.startsUsing({ id: 'E4A', source: ['Oppressor', 'Oppressor 0\.5'], capture: false }),
      delaySeconds: 0.3,
      alertText: function(data) {
        data.hyper = data.hyper || [];
        if (data.hyper.includes(data.me))
          return;
        // TODO: maybe need some way to make calling Conditions look less
        // awkward inside of functions.
        if (!Conditions.caresAboutMagical()(data))
          return;
        return {
          en: 'Tank Busters',
          de: 'Tank buster',
          fr: 'Tank busters',
          ja: 'タンクバスター',
          cn: '坦克死刑',
          ko: '탱버',
        };
      },
    },
    {
      id: 'A1S Hypercompressed Delete',
      regex: Regexes.startsUsing({ id: 'E4A', source: ['Oppressor', 'Oppressor 0\.5'] }),
      delaySeconds: 10,
      run: function(data, matches) {
        delete data.hyper;
      },
    },
  ],
}];
