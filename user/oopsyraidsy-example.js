'use strict';

// Rename this file to `oopsyraidsy.js` then edit to change the oopsyraidsy ui.


// Language to use for parsing oopsy raidsy.
Options.Language = 'en';


// Number of items in the live list to show during combat.  After combat
// is over, the list will be maximized to the overlay size (with a
// scrollbar if necessary).  When combat starts again it will shrink.
Options.NumLiveListItemsInCombat = 5;


// Minimum time (in seconds) before showing a "mistake" for a pull.
// This prevent showing "early pull (0.1s)" sorts of messages which
// aren't that useful.
Options.MinimumTimeForPullMistake = 0.4;


// A set of triggers to be ignored. The key is the 'id' of the trigger, and
// the value should be true if the trigger is to be ignored, whereas false
// will have no effect.  The trigger ids can be found in the trigger files for
// each fight in the files inside of this directory:
// https://github.com/quisquous/cactbot/tree/master/ui/oopsyraidsy/data/
Options.DisabledTriggers = {
  'General Rabbit Medium': true,
  'General Early Pull': true,
  'Test Bootshine': true,
};


// A set of nicknames to use for players.  By default, first names are used to
// make the mistake lines shorter.  If a player's name appears in this map,
// their nickname will be used instead of their first name.
Options.PlayerNicks = {
  'Darkest Edgelord': 'Mary',
  'Captain Jimmy': 'Jimmy',
  'Pipira Pira': '&#x1F41F;',
};


// A set of ability ids (in hex) to other ability names.  This is primarily
// used for abillity names that ACT doesn't know yet (e.g. Unknown_26B4).
//
// For example: Rename wings of salvation to White Swirly because that's what
// everybody in your raid group calls it.
Options.AbilityIdNameMap['26CA'] = 'White Swirly';


// An array of user-defined triggers, in the format defined in the readme:
// https://github.com/quisquous/cactbot/tree/master/ui/oopsyraidsy/data/
//
// Here's an example trigger to show a line in the mistake log when
// you crit adlo yourself in Summerfield Farms.
Options.Triggers = [
  {
    zoneRegex: /^Middle La Noscea$/,
    triggers: [
      {
        id: 'Test Self Crit Adlo',
        healRegex: 'B9', // Adloquium ability id
        condition: function(e, data) {
          return e.targetName == data.me && e.damageStr.substr(-1) == '!';
        },
        mistake: function(e, data) {
          let text = e.abilityName + ': ' + e.damageStr;
          return { type: 'good', blame: e.targetName, text: text };
        },
      },
    ],
  },
  // ...more triggers here...
];
