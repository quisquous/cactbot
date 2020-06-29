'use strict';

// O3N - Deltascape 3.0 Normal
[{
  zoneRegex: {
    en: /^Deltascape \(V3\.0\)$/,
  },
  zoneId: ZoneId.DeltascapeV30,
  damageWarn: {
    'Spellblade Fire III': '2460', // Donut AoE, Halicarnassus
    'Spellblade Blizzard III': '2461', // Circle AoE, Halicarnassus
    'Spellblade Thunder III': '2462', // Line AoE, Halicarnassus
    'Cross Reaper': '246B', // Circle AoE, Soul Reaper
    'Gusting Gouge': '246C', // Green line AoE, Soul Reaper
    'Sword Dance': '2470', // Targeted thin cone AoE, Halicarnassus
    'Uplift': '2473', // Ground spears, Queen's Waltz effect, Halicarnassus
  },
  damageFail: {
    'Ultimum': '2477', // Instant kill. Used if the player does not exit the sand maze fast enough.
  },
  shareWarn: {
    'O3N Holy Blur': 2463, // Spread circles.
  },
  triggers: [
    {
      id: 'O3N Phase Tracker',
      regex: Regexes.startsUsing({ id: '2304', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2304', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2304', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2304', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2304', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2304', source: '할리카르나소스', capture: false }),
      run: function(e, data) {
        data.phaseNumber += 1;
      },
    },
    {
      // There's a lot to track, and in order to make it all clean, it's safest just to
      // initialize it all up front instead of trying to guard against undefined comparisons.
      id: 'O3N Initializing',
      regex: Regexes.ability({ id: '367', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.ability({ id: '367', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.ability({ id: '367', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.ability({ id: '367', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.ability({ id: '367', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.ability({ id: '367', source: '할리카르나소스', capture: false }),
      condition: function(e, data) {
        return !data.initialized;
      },
      run: function(e, data) {
        data.gameCount = 0;
        // Indexing phases at 1 so as to make phases match what humans expect.
        // 1: We start here.
        // 2: Cave phase with Uplifts.
        // 3: Post-intermission, with good and bad frogs.
        data.phaseNumber = 1;
        data.initialized = true;
      },
    },
    {
      id: 'O3N Ribbit',
      abilityRegex: '2466',
      condition: function(e, data) {
        // We DO want to be hit by Toad/Ribbit if the next cast of The Game
        // is 4x toad panels.
        return !(data.phaseNumber == 3 && data.gameCount % 2 == 0) && e.targetId != 'E0000000';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // There's a lot we could do to track exactly how the player failed The Game.
      // Why overthink Normal mode, however?
      id: 'O3N The Game',
      // Guess what you just lost?
      abilityRegex: '246D',
      condition: function(e, data) {
        // If the player takes no damage, they did the mechanic correctly.
        return e.damage > 0;
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
      run: function(e, data) {
        data.gameCount += 1;
      },
    },
  ],
}];
