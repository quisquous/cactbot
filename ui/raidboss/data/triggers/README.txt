// File format.
[{
  zoneRegex: /match for the zone/,
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
//       me: The player's character name.
//       job: The player's job.
//       role: The role of the player's job (tank/healer/dps-melee/dps-ranged/dps-caster).
// matches: The regex match result of the trigger's regex to the log line it matched.
//          matches[0] will be the entire match, and matches[1] will be the first group
//          in the regex, etc. This can be used to pull data out of the log line.
//
{
  // Regular expression to match against.
  regex: /trigger-regex-(with-position-1)-here/,
  // Number of seconds to show the trigger for. Either seconds or a function(data, matches).
  durationSeconds: 3,
  // Time to wait before showing it once the regex is seen. Can be a number or a function(data, matches).
  delaySeconds: 0,
  // Text to show with info importance. May be a function(data, matches) that returns a string.
  infoText = 'Info',
  // Text to show with alert importance. May be a function(data, matches) that returns a string.
  alertText = 'Info',
  // Text to show with alarm importance. May be a function(data, matches) that returns a string.
  alarmText = 'Info',
  // Sound file to play, or one of 'Info', 'Alert', 'Alarm', or 'Long'. Paths to sound files are
  // relative to the ui/raidboss/ directory.
  sound: '',
  // Volume between 0 and 1 to play |sound|.
  soundVolume: 1,
  // A function(data, matches) to test if the trigger should fire or not. If it does not return
  // true, nothing is shown/sounded/run. This is the first thing that is run on the trigger.
  condition: function(data, matches) { return true if it should run }
  // A function(data, matches) to run. This runs as the last step when the trigger fires.
  run: function(data, matches) { do stuff.. },
  // If this is true, the trigger is completely disabled and ignored.
  disabled: true,
},
