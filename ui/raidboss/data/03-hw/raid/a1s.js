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
        fr: 'Décollage bientôt',
        cn: '上升',
      },
    },
    {
      id: 'A1S Gunnery Pod',
      regex: /Gunnery Pod/,
      condition: Conditions.caresAboutAOE(),
      beforeSeconds: 4,
      response: Responses.aoe(),
    },
  ],
  triggers: [
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
        fr: 'Missile hydrothermique sur Vous',
        cn: '导弹点名',
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
          fr: 'Missile hydrothermique sur ' + data.hydro.map((x) => data.ShortName(x)).join(', '),
          cn: '导弹点' + data.hydro.map((x) => data.ShortName(x)).join(', '),
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
      infoText: {
        en: 'Bait Resin Bomb',
        fr: 'Placez-vous pour Bombe de résine',
        cn: '粘着弹',
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
  timelineReplace: [
    {
      'locale': 'fr',
      'replaceSync': {
        'Faust': 'Faust',
        'Oppressor 0.5': 'Oppresseur 0.5',
        'Oppressor': 'Oppresseur',
      },
      'replaceText': {
        '3000-Tonze Missile': 'Missile de 3000 tonz',
        'Distress Beacon': 'Fanal de détresse',
        'Emergency Deployment': 'Déploiement d\'urgence',
        'Emergency Liftoff': 'Décollage d\'urgence',
        'Gunnery Pod': 'Feu d\'artillerie',
        'Hydrothermal Missile': 'Missile hydrothermique',
        'Hypercompressed Plasma': 'Plasma hypercomprimé',
        'Kaltstrahl': 'Kaltstrahl',
        'Kaltstrahl Enrage': 'Kaltstrahl Enrage',
        'Missile Impact': 'Frappe de missile',
        'Photon Spaser': 'Spaser à photons',
        'Pressure Increase': 'Hausse de pression',
        'Resin Bomb': 'Bombe de résine',
        'Royal Fount': 'Source royale',
        'Self-Destruct Enrage': 'Auto-destruction Enrage',
        'Sturm Doll Add': 'Add poupée sturm',
        'Quick Landing': 'Atterissage rapide',
      },
    },
  ],
}];
