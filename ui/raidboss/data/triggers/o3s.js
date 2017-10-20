// O3S - Deltascape 3.0 Savage
[{
  zoneRegex: /(Deltascape V3.0 \(Savage\)|Unknown Zone \(2B9\))/,
  triggers: [
    {
      id: 'O3S Phase Counter',
      regex: /:Halicarnassus starts using Panel Swap/,
      run: function(data) {
        data.phase = (data.phase || 0) + 1;
        delete data.seenHolyThisPhase;
      },
    },
    {
      // Look for spellblade holy so that the last noisy waltz
      // books message in the library phase can be ignored.
      id: 'Spellblade holy counter',
      regex: /:Halicarnassus:22EF:Spellblade Holy:/,
      run: function(data) {
        // In case something went awry, clean up any holy targets
        // so the next spellblade holy can start afresh.
        delete data.holyTargets;
        data.seenHolyThisPhase = true;
      },
    },
    {
      // Normal spellblade holy with tethers and one stack point.
      // "64" is a stack marker.  "65" is the prey marker.
      // The debuff order in the logs is:
      //   (1) stack marker (tethered to #2)
      //   (2) prey marker (tethered to #1)
      //   (3) prey marker (tethered to #4)
      //   (4) prey marker (tethered to #3)
      // So, #2 is the person everybody should stack on.
      id: 'O3S Spellblade Holy',
      regex: /1B:........:(\y{Name}):....:....:006[45]:0000:0000:0000:/,
      alarmText: function(data) {
        if (data.holyTargets[1] != data.me)
          return "";
        return "Stack on YOU";
      },
      alertText: function(data) {
        if (data.holyTargets[1] == data.me)
          return;
        for (var i = 0; i < 4; ++i) {
          if (data.holyTargets[i] == data.me)
            return "Get out";
        }
        return "Stack on " + data.holyTargets[1];
      },
      condition: function(data, matches) {
        // Library phase stack markers behave differently.
        if (data.phase == 3)
          return false;
        data.holyTargets = data.holyTargets || [];
        data.holyTargets.push(matches[1]);
        return data.holyTargets.length == 4;
      },
      run: function(data) {
        delete data.holyTargets;
      }
    },
    {
      // Library phase spellblade holy with 2 stacks / 4 preys / 2 unmarked.
      id: 'O3S Library Spellblade',
      regex: /1B:........:(\y{Name}):....:....:(006[45]):0000:0000:0000:/,
      alertText: function(data) {
        if (data.librarySpellbladePrinted)
          return;
        data.librarySpellbladePrinted = true;
        if (data.librarySpellbladeMe == "0064")
          return "go south: stack on you";
        if (data.librarySpellbladeMe == "0065")
          return "go north";
        return "go south: stack on friend";
      },
      // Because people can be dead and there are eight marks, delay to
      // accumulate logs instead of counting marks.  Instantly print if
      // anything is on you.  The 6 triggers will all have condition=true
      // and run, but only the first one will print.
      delaySeconds: function(data, matches) {
        return matches[1] == data.me ? 0 : 0.5;
      },
      condition: function(data, matches) {
        // This is only for library phase.
        if (data.phase != 3)
          return false;
        if (matches[1] == data.me)
          data.librarySpellbladeMe = matches[2];
        return true;
      },
    },
    {
      id: 'O3S Right Face',
      regex: /(\y{Name}) gains the effect of (?:Unknown_510|Right Face) from/,
      infoText: 'Mindjack: Right',
      durationSeconds: 8,
      condition: function(data, matches) { return matches[1] == data.me; },
    },
    {
      id: 'O3S Forward March',
      regex: /(\y{Name}) gains the effect of (?:Unknown_50D|Forward March) from/,
      infoText: 'Mindjack: Forward',
      durationSeconds: 8,
      condition: function(data, matches) { return matches[1] == data.me; },
    },
    {
      id: 'O3S Left Face',
      regex: /(\y{Name}) gains the effect of (?:Unknown_50F|Left Face) from/,
      infoText: 'Mindjack: Left',
      durationSeconds: 8,
      condition: function(data, matches) { return matches[1] == data.me; },
    },
    {
      id: 'O3S About Face',
      regex: /(\y{Name}) gains the effect of (?:Unknown_50E|About Face) from/,
      infoText: 'Mindjack: Back',
      durationSeconds: 8,
      condition: function(data, matches) { return matches[1] == data.me; },
    },
    {
      id: 'O3S Ribbit',
      regex: /:22F7:Halicarnassus starts using/,
      alertText: 'Ribbit: Get behind',
    },
    {
      id: 'O3S Oink',
      regex: /:22F9:Halicarnassus starts using/,
      infoText: 'Oink: Stack',
    },
    {
      id: 'O3S Squelch',
      regex: /:22F8:Halicarnassus starts using/,
      alarmText: 'Squelch: Look away',
    },
    {
      id: 'O3S The Queen\'s Waltz: Books',
      regex: /:230E:Halicarnassus starts using/,
      condition: function(data) {
        // Deliberately skip printing the waltz message for the
        // spellblade holy -> waltz that ends the library phase.
        return data.phase != 3 || !data.seenHolyThisPhase;
      },
      alertText: 'The Queen\'s Waltz: Books',
    },
    {
      id: 'O3S The Queen\'s Waltz: Clock',
      regex: /:2306:Halicarnassus starts using/,
      infoText: 'The Queen\'s Waltz: Clock',
    },
    {
      id: 'O3S The Queen\'s Waltz: Crystal Square',
      regex: /:230A:Halicarnassus starts using/,
      infoText: 'The Queen\'s Waltz: Crystal Square',
    },
    {
      id: 'O3S The Queen\'s Waltz: Tethers',
      regex: /:2308:Halicarnassus starts using/,
      infoText: 'The Queen\'s Waltz: Tethers',
    },
  ]
}]
