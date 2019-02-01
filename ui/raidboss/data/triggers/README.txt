// File format.
[{
  zoneRegex: /match for the zone/,
  timelineFile: 'filename.txt', /* An optional timeline file to load for this zone (refers to files in the timelines/ folder). */
  timeline: `
    hideall "Optionally, more lines to treat as part of the timeline"
    `,
  timelineReplace: [
    {
	  // Optional locale to restrict this to, e.g. 'en', 'ko', 'fr'.
	  // If not present, applies to all locales.
	  locale: 'en',
	  replaceText: {
	    // key:value pairs to search and replace in timeline ability names
		// The display name for that ability is changed, but all hideall,
		// infotext, alerttext, alarmtext, etc all refer to the original name.
	    "regexSearch": "strReplace",
	  },
	  replaceSync: {
	    // key:value pairs to search and replace in timeline sync regexes.
		"regexSearch": "strReplace",
	  },
	},
  ],
  resetWhenOutOfCombat: true, // boolean, defaults to true, if true then timelines and triggers will reset when the game is out of combat, otherwise manually call data.StopCombat().
  triggers: [
    { /* ..trigger 1.. */ },
    { /* ..trigger 2.. */ },
    { /* ..trigger 3.. */ },
  ]
},
{
  zoneRegex: /match for another zone/,
  triggers: [
    { /* ..trigger 1.. */ },
    { /* ..trigger 2.. */ },
    { /* ..trigger 3.. */ },
  ]
}]

// Example trigger.
//
// Fields that can be a function will receive the following arguments:
// data: An object that triggers may store state on. It is reset when combat ends.
//       It comes with the following fields pre-set:
//         me: The player's character name.
//         job: The player's job.
//         role: The role of the player's job (tank/healer/dps-melee/dps-ranged/dps-caster/crafting/gathering).
//         lang: The current language, e.g. 'en', 'fr', 'ko', 'de', 'ja'.
//         currentHP: The player's current HP (may be slightly delayed)
//         function ShortName(name): A function that simplifies a player's name into something shorter, usually first name.
//         function StopCombat(): Manually stop timelines and triggers, usually paired with resetWhenOutOfCombat = false.
// matches: The regex match result of the trigger's regex to the log line it matched.
//          matches[0] will be the entire match, and matches[1] will be the first group
//          in the regex, etc. This can be used to pull data out of the log line.
//
{
  // An id string for the trigger, used to disable triggers. Every built-in trigger that has a text/sound
  // output should have an id so it can be disabled. User-defined triggers need not have one.
  id: 'id string'
  // Regular expression to match against.
  regex: /trigger-regex-(with-position-1)-here/,
  // Example of a locale-based regular expression for the 'fr' locale.  If Options.Language == 'fr', then
  // regexFr (if it exists) takes precedence over regex.  Otherwise, it is ignored.  This is only an
  // example for french, but other locales behave the same, e.g. regexEn, regexKo.
  regexFr: /trigger-regex-(with-position-1)-here-but-in-french/,
  // Time to wait before showing it once the regex is seen. May be a number or a function(data, matches) that returns a number.
  delaySeconds: 0,
  // Time to wait in seconds before showing this trigger again.  May be a number of a function(data, matches).  The time to wait begins at the regex (and not after the delaySeconds).  These triggers will not run anything.  This can be used for catching the first of many events if there's log spam.
  suppressSeconds: 0,
  // Number of seconds to show the trigger for. May be a number or a function(data, matches) that returns a number.
  durationSeconds: 3,
  // Text to show with info importance. May be a string or a function(data, matches) that returns a string.
  infoText = 'Info',
  // Text to show with alert importance. May be a string or a function(data, matches) that returns a string.
  alertText = 'Info',
  // Text to show with alarm importance. May be a string or a function(data, matches) that returns a string.
  alarmText = 'Info',
  // Sound file to play, or one of 'Info', 'Alert', 'Alarm', or 'Long'. Paths to sound files are
  // relative to the ui/raidboss/ directory.
  sound: '',
  // Volume between 0 and 1 to play |sound|.
  soundVolume: 1,
  // A function(data, matches) to test if the trigger should fire or not. If it does not return
  // true, nothing is shown/sounded/run. This is the first thing that is run on the trigger.
  condition: function(data, matches) { return true if it should run }
  // A function(data, matches) to run. This runs as the first step after condition.
  preRun: function(data, matches) { do stuff.. },
  // A function(data, matches) to run. This runs as the last step when the trigger fires.
  run: function(data, matches) { do stuff.. },
  // If this is true, the trigger is completely disabled and ignored.
  disabled: true,
},

Any field that can return a function (e.g. infoText, alertText, alarmText, tts) can also return a localized
object, e.g. instead of returning 'Get Out', they can return {en: 'Get Out', fr: 'something french'}
instead.  Fields can also return a function that return a localized object as well.  If the current locale
does not exist in the object, the 'en' result will be returned.


The full order of evaluation of functions in a trigger is:
1. condition
2. preRun
3. delaySeconds
4. durationSeconds
5. suppressSeconds
6. infoText
7. alertText
8. alarmText
9. tts
10. run
