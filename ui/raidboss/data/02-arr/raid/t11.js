'use strict';

[{
  zoneRegex: /The Final Coil Of Bahamut - Turn \(2\)/,
  timelineFile: 't11.txt',
  triggers: [
    {
      id: 'T11 Secondary Head',
      regex: / 15:\y{ObjectId}:Kaliya:B73:Secondary Head:\y{ObjectId}:(\y{Name}):/,
      alertText: function(data, matches) {
        return {
          en: 'Stun on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'T11 Seed River First',
      regex: / 15:\y{ObjectId}:Kaliya:B74:/,
      alertText: function(data) {
        if (data.firstSeed)
          return;
        return {
          en: 'Spread => Stack',
        };
      },
      run: function(data) {
        if (!data.firstSeed)
          data.firstSeed = 'river';
      },
    },
    {
      id: 'T11 Seed Sea First',
      regex: / 15:\y{ObjectId}:Kaliya:B75:/,
      alertText: function(data) {
        if (data.firstSeed)
          return;
        return {
          en: 'Stack => Spread',
        };
      },
      run: function(data) {
        if (!data.firstSeed)
          data.firstSeed = 'sea';
      },
    },
    {
      id: 'T11 Seed River Second',
      regex: / 1[56]:\y{ObjectId}:Kaliya:B76:Seed Of The Rivers:/,
      infoText: function(data) {
        if (!data.firstSeed)
          return;
        return {
          en: 'Stack',
        };
      },
      run: function(data) {
        delete data.firstSeed;
      },
    },
    {
      id: 'T11 Seed Sea Second',
      regex: / 1[56]:\y{ObjectId}:Kaliya:B77:Seed Of The Sea:/,
      infoText: function(data) {
        if (!data.firstSeed)
          return;
        return {
          en: 'Spread',
        };
      },
      run: function(data) {
        delete data.firstSeed;
      },
    },
    {
      id: 'T11 Phase 2',
      regex: /:Kaliya HP at 60%/,
      sound: 'Long',
      infoText: function(data, matches) {
        return {
          en: 'Out of Middle',
        };
      },
    },
    {
      id: 'T11 Forked Lightning',
      regex: / 15:\y{ObjectId}:Electric Node:B85:Forked Lightning:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alarmText: {
        en: 'Lightning on YOU',
      },
    },
    {
      id: 'T11 Phase 3',
      regex: /15:\y{ObjectId}:Kaliya:B78:Emergency Mode/,
      sound: 'Long',
      infoText: function(data) {
        return {
          en: 'Final Phase',
        };
      },
    },
    {
      id: 'T11 Tether Accumulate A',
      regex: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Kaliya:....:....:001C:/,
      run: function(data, matches) {
        data.tetherA = data.tetherA || [];
        data.tetherA.push(matches[1]);
      },
    },
    {
      id: 'T11 Tether Accumulate B',
      regex: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Kaliya:....:....:001D:/,
      run: function(data, matches) {
        data.tetherB = data.tetherB || [];
        data.tetherB.push(matches[1]);
      },
    },
    {
      id: 'T11 Tether A',
      regex: / 23:\y{ObjectId}:\y{Name}:\y{ObjectId}:Kaliya:....:....:001C:/,
      condition: function(data) {
        return data.tetherA.length == 2;
      },
      alarmText: function(data) {
        let partner = undefined;
        if (data.tetherA[0] == data.me)
          partner = data.tetherA[1];
        if (data.tetherA[1] == data.me)
          partner = data.tetherA[0];
        if (!partner)
          return;
        return {
          en: 'Red Tethers With ' + data.ShortName(partner),
        };
      },
    },
    {
      id: 'T11 Tether B',
      regex: / 23:\y{ObjectId}:\y{Name}:\y{ObjectId}:Kaliya:....:....:001D:/,
      condition: function(data) {
        return data.tetherB.length == 2;
      },
      alarmText: function(data) {
        let partner = undefined;
        if (data.tetherB[0] == data.me)
          partner = data.tetherB[1];
        if (data.tetherB[1] == data.me)
          partner = data.tetherB[0];
        if (!partner)
          return;
        return {
          en: 'Blue Tethers With ' + data.ShortName(partner),
        };
      },
    },
    {
      id: 'T11 Tether Cleanup',
      regex: /16:\y{ObjectId}:Kaliya:B7B:Nanospore Jet:/,
      run: function(data) {
        delete data.tetherA;
        delete data.tetherB;
      },
    },
  ],
}];
