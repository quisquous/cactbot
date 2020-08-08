'use strict';

// O3N - Deltascape 3.0 Normal
[{
  zoneId: ZoneId.DeltascapeV30,
  damageWarn: {
    'O3N Spellblade Fire III': '2460', // Donut AoE, Halicarnassus
    'O3N Spellblade Blizzard III': '2461', // Circle AoE, Halicarnassus
    'O3N Spellblade Thunder III': '2462', // Line AoE, Halicarnassus
    'O3N Cross Reaper': '246B', // Circle AoE, Soul Reaper
    'O3N Gusting Gouge': '246C', // Green line AoE, Soul Reaper
    'O3N Sword Dance': '2470', // Targeted thin cone AoE, Halicarnassus
    'O3N Uplift': '2473', // Ground spears, Queen's Waltz effect, Halicarnassus
  },
  damageFail: {
    'O3N Ultimum': '2477', // Instant kill. Used if the player does not exit the sand maze fast enough.
  },
  shareWarn: {
    'O3N Holy Blur': 2463, // Spread circles.
  },
  triggers: [
    {
      id: 'O3N Phase Tracker',
      netRegex: NetRegexes.startsUsing({ id: '2304', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2304', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2304', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2304', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2304', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2304', source: '할리카르나소스', capture: false }),
      run: function(e, data) {
        data.phaseNumber += 1;
      },
    },
    {
      // There's a lot to track, and in order to make it all clean, it's safest just to
      // initialize it all up front instead of trying to guard against undefined comparisons.
      id: 'O3N Initializing',
      netRegex: NetRegexes.ability({ id: '367', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '367', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '367', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '367', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '367', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '367', source: '할리카르나소스', capture: false }),
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
