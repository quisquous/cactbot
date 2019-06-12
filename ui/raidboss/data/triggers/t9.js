'use strict';

[{
  zoneRegex: /The Second Coil Of Bahamut - Turn \(4\)/,
  timelineFile: 't9.txt',
  timelineTriggers: [
    {
      id: 'T9 Claw',
      regex: /Bahamut's Claw x5/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer' || data.job == 'BLU';
      },
      beforeSeconds: 5,
      infoText: {
        en: 'Tankbuster',
      },
    },
    {
      id: 'T9 Dalamud Dive',
      regex: /Dalamud Dive/,
      beforeSeconds: 5,
      infoText: {
        en: 'Dive on Main Tank',
      },
    },
    {
      id: 'T9 Super Nova',
      regex: /Super Nova x3/,
      beforeSeconds: 4,
      infoText: {
        en: 'Bait Super Novas Outside',
      },
    },
  ],
  triggers: [
    {
      id: 'T9 Raven Blight You',
      regex: / 1A:(\y{Name}) gains the effect of Raven Blight from Nael Deus Darnus for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: function(data, matches) {
        return matches[2] - 5;
      },
      durationSeconds: 5,
      alarmText: {
        en: 'Blight on YOU',
      },
    },
    {
      id: 'T9 Raven Blight You',
      regex: / 1A:(\y{Name}) gains the effect of Raven Blight from Nael Deus Darnus for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return data.me != matches[1];
      },
      delaySeconds: function(data, matches) {
        return matches[2] - 5;
      },
      durationSeconds: 5,
      infoText: function(data, matches) {
        return {
          en: 'Blight on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'T9 Meteor Stream',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:000[7A9]:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Meteor on YOU',
      },
    },
    {
      id: 'T9 Meteor Stream',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0008:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread (Meteor Stream)',
      },
    },
    {
      id: 'T9 Stack',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:000F:/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Thermo on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'T9 Phase 2',
      regex: /:Nael deus Darnus HP at 64%/,
      sound: 'Long',
    },
    {
      id: 'T9 Earthshock',
      regex: / 14:7F5:Dalamud Spawn starts using Earthshock/,
      alertText: {
        en: 'Silence Blue Golem',
      },
    },
    {
      id: 'T9 Heavensfall',
      regex: / 14:83B:Nael Deus Darnus starts using Heavensfall/,
      alertText: {
        en: 'Heavensfall',
      },
    },
    {
      id: 'T9 Garotte Twist Gain',
      regex: / 1A:(\y{Name}) gains the effect of Garrote Twist/,
      condition: function(data, matches) {
        return data.me == matches[1] && !data.garotte;
      },
      infoText: {
        en: 'Garotte on YOU',
      },
      run: function(data) {
        data.garotte = true;
      },
    },
    {
      id: 'T9 Ghost Death',
      regex: / 1[56]:\y{ObjectId}:The Ghost of Meracydia:7FA:Neurolink Burst:/,
      condition: function(data) {
        return data.garotte;
      },
      alarmText: {
        en: 'Cleanse Garotte',
      },
    },
    {
      id: 'T9 Garotte Twist Lose',
      regex: / 1E:(\y{Name}) loses the effect of Garrote Twist/,
      run: function(data) {
        delete data.garotte;
      },
    },
    {
      id: 'T9 Final Phase',
      regex: / 14:7E6:Nael Deus Darnus starts using Bahamut's Favor/,
      condition: function(data) {
        return !data.seenFinalPhase;
      },
      sound: 'Long',
      run: function(data) {
        data.seenFinalPhase = true;
      },
    },
    {
      id: 'T9 Dragon Locations',
      regex: /03:Added new combatant (.*)\..*Pos: \((\y{Float}),(\y{Float}),(\y{Float})\)/,
      run: function(data, matches) {
        let names = ['Firehorn', 'Iceclaw', 'Thunderwing'];
        let idx = names.indexOf(matches[1]);
        if (idx == -1)
          return;

        let x = parseFloat(matches[2]);
        let y = parseFloat(matches[3]);

        // Most dragons are out on a circle of radius=~28.
        // Ignore spurious dragons like "Pos: (0.000919255,0.006120025,2.384186E-07)"
        if (x*x + y*y < 20*20)
          return;

        // Positions are the 8 cardinals + numerical slop on a radius=28 circle.
        // N = (0, -28), E = (28, 0), S = (0, 28), W = (-28, 0)
        // Map N = 0, NE = 1, ..., NW = 7
        let dir = Math.round(4 - 4 * Math.atan2(x, y) / Math.PI) % 8;

        data.dragons = data.dragons || [0, 0, 0];
        data.dragons[idx] = dir;
      },
    },
    {
      id: 'T9 Final Phase Reset',
      regex: / 14:7E6:Nael Deus Darnus starts using Bahamut's Favor/,
      run: function(data) {
        data.tetherCount = 0;
        data.naelDiveMarkerCount = 0;

        // T9 normal dragons are easy.
        // The first two are always split, so A is the first dragon + 1.
        // The last one is single, so B is the last dragon + 1.
        let dragons = data.dragons.sort();
        let dir_names = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        data.naelMarks = [dragons[0], dragons[2]].map(function(i) {
          return dir_names[(i + 1) % 8];
        });

        // Safe zone is one to the left of the first dragon, unless
        // the last dragon is diving there.  If that's true, use
        // one to the right of the second dragon.
        let possibleSafe = (dragons[0] - 1 + 8) % 8;
        if ((dragons[2] + 2) % 8 == possibleSafe)
          possibleSafe = (dragons[1] + 1) % 8;
        data.safeZone = dir_names[possibleSafe];
      },
    },
    {
      id: 'T9 Dragon Marks',
      regex: / 14:7E6:Nael Deus Darnus starts using Bahamut's Favor/,
      durationSeconds: 12,
      infoText: function(data) {
        return {
          en: 'Marks: ' + data.naelMarks.join(', '),
          fr: 'Marque : ' + data.naelMarks.join(', '),
          de: 'Markierungen : ' + data.naelMarks.join(', '),
          ja: 'マーカー: ' + data.naelMarks.join(', '),
        };
      },
    },
    {
      id: 'T9 Tether',
      regex: / 23:\y{ObjectId}:Firehorn:\y{ObjectId}:(\y{Name}):....:....:0005:/,
      preRun: function(data, matches) {
        data.tetherCount = data.tetherCount || 0;
        data.tetherCount++;
        // Out, In, Out, In
        data.tetherDir = data.tetherCount % 2 ? 'Fire Out' : 'Fire In';
      },
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: data.tetherDir + ' (on YOU)',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches[1]) {
          return {
            en: data.tetherDir + ' (on ' + data.ShortName(matches[1]) + ')',
          };
        }
      },
    },
    {
      id: 'T9 Thunder',
      // Note: The 0A event happens before 'gains the effect' and 'starts
      // casting on' only includes one person.
      regex: /:Thunderwing:7FD:.*?:\y{ObjectId}:(\y{Name}):/,
      regexDe: /:Donnerschwinge:7FD:.*?:\y{ObjectId}:(\y{Name}):/,
      regexFr: /:Aile-de-foudre:7FD:.*?:\y{ObjectId}:(\y{Name}):/,
      regexJa: /:サンダーウィング:7FD:.*?:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Thunder on YOU',
        fr: 'Foudre sur VOUS',
        de: 'Blitz auf DIR',
        ja: '自分にサンダー',
      },
      tts: {
        en: 'thunder',
        fr: 'Foudre',
        de: 'blitz',
        ja: 'サンダー',
      },
    },
    {
      id: 'T9 Dragon Safe Zone',
      regex: / 1B:........:\y{Name}:....:....:0014:0000:0000:0000:/,
      delaySeconds: 3,
      durationSeconds: 6,
      suppressSeconds: 20,
      infoText: function(data) {
        return 'Safe zone: ' + data.safeZone;
      },
    },
    {
      id: 'T9 Dragon Marker',
      regex: / 1B:........:(\y{Name}):....:....:0014:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: function(data, matches) {
        data.naelDiveMarkerCount = data.naelDiveMarkerCount || 0;
        if (matches[1] != data.me)
          return;
        let marker = ['A', 'B', 'C'][data.naelDiveMarkerCount];
        let dir = data.naelMarks[data.naelDiveMarkerCount];
        return {
          en: 'Go To ' + marker + ' (in ' + dir + ')',
          fr: 'Aller en ' + marker + ' (au ' + dir + ')',
          de: 'Gehe zu ' + marker + ' (im ' + dir + ')',
          ja: marker + 'に行く' + ' (あと ' + dir + '秒)',
        };
      },
      tts: function(data, matches) {
        data.naelDiveMarkerCount = data.naelDiveMarkerCount || 0;
        if (matches[1] != data.me)
          return;
        return {
          en: 'Go To ' + ['A', 'B', 'C'][data.naelDiveMarkerCount],
          fr: 'Aller en ' + ['A', 'B', 'C'][data.naelDiveMarkerCount],
          de: 'Gehe zu ' + ['A', 'B', 'C'][data.naelDiveMarkerCount],
          ja: ['A', 'B', 'C'][data.naelDiveMarkerCount] + '行くよ',
        };
      },
    },
  ],
}];
