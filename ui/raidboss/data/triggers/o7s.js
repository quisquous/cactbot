// O7S - Sigmascape 3.0 Savage
[{
  zoneRegex: /Sigmascape V3\.0 \(Savage\)/,
  timelineFile: 'o7s.txt',
  triggers: [
    // State
    {
      regex: / 1A:(\y{Name}) gains the effect of Aether Rot from/,
      condition: function(data, matches) { return data.me == matches[1]; },
      run: function(data) {
        data.rot = true;
      },
    },
    {
      regex: / 1E:(\y{Name}) loses the effect of Aether Rot from/,
      condition: function(data, matches) { return data.me == matches[1]; },
      run: function(data) {
        data.rot = false;
      },
    },
    {
      regex: / 1A:Guardian gains the effect of Dadaluma Simulation/,
      condition: function(data, matches) { return !data.first || data.seenVirus && !data.second },
      run: function(data) {
        if (data.seenVirus)
          data.second = 'dada';
        else
          data.first = 'dada';
      },
    },
    {
      regex: / 1A:Guardian gains the effect of Bibliotaph Simulation/,
      condition: function(data, matches) { return !data.first || data.seenVirus && !data.second },
      run: function(data) {
        if (data.seenVirus)
          data.second = 'biblio';
        else
          data.first = 'biblio';
      },
    },
    {
      regex: / 1A:Guardian gains the effect of Virus/,
      run: function(data) {
        data.seenVirus = true;
      },
    },


    {
      id: 'O7S Magitek Ray',
      regex: / 14:2788:Guardian starts using Magitek Ray/,
      alertText: 'Magitek Ray',
      tts: 'beam',
    },
    {
      id: 'O7S Arm And Hammer',
      regex: / 14:2789:Guardian starts using Arm And Hammer on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me)
          return 'Tank Buster on YOU';
        if (data.role == 'healer')
          return 'Buster on ' + data.ShortName(matches[1]);
      },
      tts: function(data, matches) {
        if (matches[1] == data.me)
          return 'buster';
      },
    },
    {
      id: 'O7S Orb Marker',
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      alertText: 'Orb Marker',
      tts: 'orb',
    },
    {
      id: 'O7S Blue Marker',
      regex: /1B:........:(\y{Name}):....:....:000E:0000:0000:0000:/,
      alarmText: function(data, matches) {
        if (data.me == matches[1])
          return 'Blue Marker on YOU';
      },
      infoText: function(data, matches) {
        if (data.me != matches[1])
          return 'Blue Marker on ' + data.ShortName(matches[1]);
      },
      tts: function (data, matches) {
        if (data.me == matches[1])
          return 'blue marker';
      },
    },
    {
      id: 'O7S Prey',
      regex: /1B:........:(\y{Name}):....:....:001E:0000:0000:0000:/,
      infoText: function(data, matches) {
        if (data.me == matches[1])
          return 'Prey on YOU';
        return 'Prey on ' + data.ShortName(matches[1]);
      },
      tts: function (data, matches) {
        if (data.me == matches[1])
          return 'prey';
      },
    },
    {
      id: 'O7S Searing Wind',
      regex: / 1A:(\y{Name}) gains the effect of Searing Wind/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alarmText: 'Searing Wind: go outside',
      tts: 'searing wind',
    },
    {
      id: 'O7S Abandonment',
      regex: / 1A:(\y{Name}) gains the effect of Abandonment/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alertText: 'Abandonment: stay middle',
      tts: 'abandonment',
    },
    {
      id: 'O7S Rot',
      regex: / 1A:(\y{Name}) gains the effect of Aether Rot from/,
      infoText: function(data, matches) {
        if (data.me == matches[1])
          return 'Rot on you';
        return 'Rot on ' + data.ShortName(matches[1]);
      },
      tts: function(data, matches) {
        if (data.me == matches[1])
          return 'rot';
      },
    },
    {
      id: 'O7S Stoneskin',
      regex: / 14:2AB5:Ultros starts using Stoneskin/,
      alarmText: function(data) {
        if (data.job == 'NIN' || data.role == 'dps-ranged')
          return 'SILENCE!';
      },
      infoText: function(data) {
        if (data.job != 'NIN' && data.role != 'dps-ranged')
          return 'Silence';
      },
      tts: 'silence',
    },
    {
      id: 'O7S Load',
      // Load: 275C
      // Skip: 2773
      // Retrieve: 2774
      // Paste: 2776
      regex: / 14:(?:275C|2773|2774|2776):Guardian starts using/,
      preRun: function(data) {
        data.loadCount = ++data.loadCount || 1;
        data.thisLoad = undefined;
        data.thisLoadText = undefined;
        data.thisLoadTTS = undefined;

        if (data.loadCount == 1) {
          // First load is unknown.
          data.thisLoad = 'screen';
        } else if (data.loadCount == 2) {
          data.thisLoad = data.first == 'biblio' ? 'dada' : 'biblio';
        } else if (data.loadCount == 3) {
          data.thisLoad = data.first == 'biblio' ? 'ultros' : 'ships';
        } else if (data.loadCount == 4) {
          data.thisLoad = data.first == 'biblio' ? 'ships' : 'ultros';
        } else if (data.loadCount == 5) {
          data.thisLoad = 'virus';
        } else if (data.loadCount == 6) {
          data.thisLoad = data.first == 'biblio' ? 'ultros' : 'ships';
        } else if (data.loadCount == 7) {
          // This is the post-virus Load/Skip divergence.
          data.thisLoad = 'screen';
        } else if (data.loadCount == 8) {
          data.thisLoad = data.second == 'biblio' ? 'dada' : 'biblio';
        } else if (data.loadCount == 9) {
          data.thisLoad = data.first == 'biblio' ? 'ships' : 'ultros';
        }

        if (!data.thisLoad) {
          console.error('Unknown load: ' + data.loadCount);
          return;
        }
        data.thisLoadText = ({
          'screen': 'Biblio?/Knockback?',
          'biblio': 'Biblio: Positions',
          'dada': 'Dada: Knockback',
          'ships': 'Ships: Out of Melee',
          'ultros': 'Ultros: Ink Spread',
          'virus': 'VIRUS',
        })[data.thisLoad];

        data.thisLoadTTS = ({
          'screen': 'screen',
          'biblio': 'biblio positions',
          'dada': 'knockback',
          'ships': 'get out',
          'ultros': 'ink ink ink',
          'virus': 'virus',
        })[data.thisLoad];
      },
      alertText: function (data) { return data.thisLoadText; },
      tts: function(data) { return data.thisLoadTTS; },
    },
    {
      id: 'O7S Run',
      regex: / 14:276F:Guardian starts using Run Program/,
      preRun: function(data) {
        data.runCount = ++data.runCount || 1;
        data.thisRunText = undefined;
        data.thisRunTTS = undefined;

        if (data.runCount == 1) {
          data.thisRun = data.first == 'biblio' ? 'dada' : 'dada';
        } else if (data.runCount == 2) {
          data.thisRun = data.first == 'biblio' ? 'ultros' : 'ships';
        } else if (data.runCount == 3) {
          data.thisRun = data.first == 'biblio' ? 'ships' : 'ultros';
        } else if (data.runCount == 4) {
          data.thisRun = data.first == 'biblio' ? 'ultros' : 'ships';
        } else if (data.runCount == 5) {
          data.thisRun = 'biblio';
        } else if (data.runCount == 6) {
          data.thisRun = data.first == 'biblio' ? 'ships' : 'ultros';
        }

        data.thisRunText = ({
          'biblio': 'Biblio Add',
          'dada': 'Dada Add',
          'ships': 'Ship Adds',
          'ultros': 'Ultros Add',
        })[data.thisRun];

        data.thisRunTTS = data.thisRunText;
      },
      infoText: function(data) { return data.thisRunText; },
      tts: function(data) { return data.thisRunTTS; },
    },
  ]
}]
