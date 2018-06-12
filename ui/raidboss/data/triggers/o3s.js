'use strict';

// O3S - Deltascape 3.0 Savage
[{
  zoneRegex: /(Deltascape V3.0 \(Savage\)|Unknown Zone \(2B9\))/,
  timelineFile: 'o3s.txt',
  triggers: [
    {
      id: 'O3S Phase Counter',
      regex: /:Halicarnassus starts using Panel Swap/,
      regexDe: /:Halikarnassos starts using Neuaufstellung/,
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
      regexDe: /:Halikarnassos:22EF:Magieklinge Sanctus:/,
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
          return '';

        return {
          en: 'Stack on YOU',
          de: 'Stack auf DIR',
        };
      },
      alertText: function(data) {
        if (data.holyTargets[1] == data.me)
          return;

        for (let i = 0; i < 4; ++i) {
          if (data.holyTargets[i] == data.me) {
            return {
              en: 'Get out',
              de: 'Raus da',
            };
          }
        }
        return {
          en: 'Stack on ' + data.holyTargets[1],
          de: 'Stack auf ' + data.holyTargets[1],
        };
      },
      infoText: function(data) {
        for (let i = 0; i < 4; ++i) {
          if (data.holyTargets[i] == data.me) {
            return {
              en: 'others stack on ' + data.holyTargets[1],
              de: 'andere stacken auf ' + data.holyTargets[1],
            };
          }
        }
      },
      condition: function(data, matches) {
        // Library phase stack markers behave differently.
        if (data.phase == 3)
          return false;

        data.holyTargets = data.holyTargets || [];
        data.holyTargets.push(matches[1]);
        return data.holyTargets.length == 4;
      },
      tts: function(data) {
        if (data.holyTargets[1] == data.me) {
          return {
            en: 'stack on you',
            de: 'stek auf dir',
          };
        }
        for (let i = 0; i < 4; ++i) {
          if (data.holyTargets[i] == data.me) {
            return {
              en: 'get out',
              de: 'raus da',
            };
          }
        }
        return {
          en: 'stack on ' + data.holyTargets[i],
          de: 'stek auf ' + data.holyTargets[i],
        };
      },
      run: function(data) {
        delete data.holyTargets;
      },
    },
    {
      // Library phase spellblade holy with 2 stacks / 4 preys / 2 unmarked.
      id: 'O3S Library Spellblade',
      regex: /1B:........:(\y{Name}):....:....:(006[45]):0000:0000:0000:/,
      alertText: function(data) {
        if (data.librarySpellbladePrinted)
          return;

        data.librarySpellbladePrinted = true;
        if (data.librarySpellbladeMe == '0064') {
          return {
            en: 'Go south: stack on YOU',
            de: 'Nach Süden: stack auf DIR',
          };
        }
        if (data.librarySpellbladeMe == '0065') {
          return {
            en: 'go north',
            de: 'nach norden',
          };
        }
        return {
          en: 'go south: stack on friend',
          de: 'nach süden: stack auf freund',
        };
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
      tts: function(data) {
        if (data.librarySpellbladePrinted)
          return;

        data.librarySpellbladePrinted = true;
        if (data.librarySpellbladeMe == '0064') {
          return {
            en: 'stack outside',
            de: 'außen stek en',
          };
        }
        if (data.librarySpellbladeMe == '0065') {
          return {
            en: 'go north',
            de: 'nach norden',
          };
        }
        return {
          en: 'stack inside',
          de: 'innen stek en',
        };
      },
    },
    {
      id: 'O3S Right Face',
      regex: /(\y{Name}) gains the effect of (?:Unknown_510|Right Face) from/,
      regexDe: /(\y{Name}) gains the effect of (?:Unknown_510|Rechts) from/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      durationSeconds: 8,
      infoText: {
        en: 'Mindjack: Right',
        de: 'Geistlenkung: Rechts',
      },
    },
    {
      id: 'O3S Forward March',
      regex: /(\y{Name}) gains the effect of (?:Unknown_50D|Forward March) from/,
      regexDe: /(\y{Name}) gains the effect of (?:Unknown_50D|Vorwärts) from/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      durationSeconds: 8,
      infoText: {
        en: 'Mindjack: Forward',
        de: 'Geistlenkung: Vorwärts',
      },
    },
    {
      id: 'O3S Left Face',
      regex: /(\y{Name}) gains the effect of (?:Unknown_50F|Left Face) from/,
      regexDe: /(\y{Name}) gains the effect of (?:Unknown_50F|Links) from/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      durationSeconds: 8,
      infoText: {
        en: 'Mindjack: Left',
        de: 'Geistlenkung: Links',
      },
    },
    {
      id: 'O3S About Face',
      regex: /(\y{Name}) gains the effect of (?:Unknown_50E|About Face) from/,
      regexDe: /(\y{Name}) gains the effect of (?:Unknown_50E|Rückwärts) from/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      durationSeconds: 8,
      infoText: {
        en: 'Mindjack: Back',
        de: 'Geistlenkung: Zurück',
      },
    },
    {
      id: 'O3S Ribbit',
      regex: /:22F7:Halicarnassus starts using/,
      regexDe: /:22F7:Halikarnassos starts using/,
      alertText: {
        en: 'Ribbit: Get behind',
        de: 'Quaaak: Hinter sie',
      },
      tts: {
        en: 'ribbit',
        de: 'quak',
      },
    },
    {
      id: 'O3S Oink',
      regex: /:22F9:Halicarnassus starts using/,
      regexDe: /:22F9:Halikarnassos starts using/,
      infoText: {
        en: 'Oink: Stack',
        de: 'Quiiiek: Stack',
      },
      tts: {
        en: 'oink',
        de: 'quiek',
      },
    },
    {
      id: 'O3S Squelch',
      regex: /:22F8:Halicarnassus starts using/,
      regexDe: /:22F8:Halikarnassos starts using/,
      alarmText: {
        en: 'Squelch: Look away',
        de: 'Gurrr: Wegschauen',
      },
      tts: {
        en: 'look away',
        de: 'weckschauen',
      },
    },
    {
      id: 'O3S The Queen\'s Waltz: Books',
      regex: /:230E:Halicarnassus starts using/,
      regexDe: /:230E:Halikarnassos starts using/,
      condition: function(data) {
        // Deliberately skip printing the waltz message for the
        // spellblade holy -> waltz that ends the library phase.
        return data.phase != 3 || !data.seenHolyThisPhase;
      },
      alertText: {
        en: 'The Queen\'s Waltz: Books',
        de: 'Tanz der Königin: Bücher',
      },
      tts: {
        en: 'books',
        de: 'bücher',
      },
    },
    {
      id: 'O3S The Queen\'s Waltz: Clock',
      regex: /:2306:Halicarnassus starts using/,
      regexDe: /:2306:Halikarnassos starts using/,
      infoText: {
        en: 'The Queen\'s Waltz: Clock',
        de: 'Tanz der Königin: Uhr',
      },
      tts: {
        en: 'clock',
        de: 'uhr',
      },
    },
    {
      id: 'O3S The Queen\'s Waltz: Crystal Square',
      regex: /:230A:Halicarnassus starts using/,
      regexDe: /:230A:Halikarnassos starts using/,
      infoText: {
        en: 'The Queen\'s Waltz: Crystal Square',
        de: 'Tanz der Königin: Kristallfeld',
      },
      tts: {
        en: 'blue square',
        de: 'blaues feld',
      },
    },
    {
      id: 'O3S The Queen\'s Waltz: Tethers',
      regex: /:2308:Halicarnassus starts using/,
      regexDe: /:2308:Halikarnassos starts using/,
      infoText: {
        en: 'The Queen\'s Waltz: Tethers',
        de: 'Tanz der Königin: Ranken',
      },
      tts: {
        en: 'tethers',
        de: 'ranken',
      },
    },
  ],
}];
