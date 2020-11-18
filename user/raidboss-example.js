// Rename this file to `raidboss.js` and edit it to change the raidboss ui.
// This file is Javascript.  Anything after "//" on a line is a comment.
// If you edit this file, remember to reload ACT or click the "Reload overlay"
// button on the raidboss overlay.
// If there are errors in this file, they will appear in the OverlayPlugin.dll
// log window in ACT.
// See: http://github.com/quisquous/cactbot/blob/main/docs/CactbotCustomization.md#check-the-overlayplugin-log-for-errors

// Path to sound played for info-priority text popups, or when "Info" is
// specified as the sound name.
Options.InfoSound = '../../resources/sounds/freesound/percussion_hit.ogg';

// Path to sound played for alert-priority text popups, or when "Alert" is
// specified as the sound name.
Options.AlertSound = '../../resources/sounds/BigWigs/Alert.ogg';

// Path to sound played for alarm-priority text popups, or when "Alarm" is
// specified as the sound name.
Options.AlarmSound = '../../resources/sounds/BigWigs/Alarm.ogg';

// Path to sound played when "Long" is specified as the sound name.
Options.LongSound = '../../resources/sounds/BigWigs/Long.ogg';

// Path to sound played when the fight starts, or when "Pull" is
// specified as the sound name.
Options.PullSound = '../../resources/sounds/PowerAuras/sonar.ogg';


// A set of nicknames to use for players, when trying to shorten names.
// See: https://github.com/quisquous/cactbot/blob/main/docs/CactbotCustomization.md#customizing-behavior
Options.PlayerNicks = {
  'Captain Jimmy': 'Jimmy',
  'Pipira Pira': 'Fish',
};

// An array of user-defined triggers, in the format defined in the trigger guide:
// See: https://github.com/quisquous/cactbot/blob/main/docs/CactbotCustomization.md#overriding-raidboss-triggers
// See also: https://github.com/quisquous/cactbot/tree/main/docs/RaidbossGuide.md

// Here's an example of overriding a trigger.
// This overrides the "Test Poke" trigger from:
// https://github.com/quisquous/cactbot/blob/main/ui/raidboss/data/00-misc/test.js

Options.Triggers.push({
  zoneId: ZoneId.MiddleLaNoscea,
  triggers: [
    {
      id: 'Test Poke',
      netRegex: NetRegexes.gameNameLog({ line: 'You poke the striking dummy.*?', capture: false }),
      netRegexDe: NetRegexes.gameNameLog({ line: 'Du stupst die Trainingspuppe an.*?', capture: false }),
      netRegexFr: NetRegexes.gameNameLog({ line: 'Vous touchez légèrement le mannequin d\'entraînement du doigt.*?', capture: false }),
      netRegexJa: NetRegexes.gameNameLog({ line: '.*は木人をつついた.*?', capture: false }),
      netRegexCn: NetRegexes.gameNameLog({ line: '.*用手指戳向木人.*?', capture: false }),
      netRegexKo: NetRegexes.gameNameLog({ line: '.*나무인형을 쿡쿡 찌릅니다.*?', capture: false }),
      preRun: function(data) {
        data.pokes = (data.pokes || 0) + 1;
      },
      // Instead of printing the number of pokes with infoText like the original trigger,
      // This overrides the type and text of the output.
      alarmText: 'POKE (user file override)',
    },
  ],
});


// Here's an example of overriding a timeline.
// This overrides the test timeline that you normally play with a `/countdown 5` in Middle La Noscea
// with an updated one from `user/test-override.txt`.
Options.Triggers.push({
  zoneId: ZoneId.MiddleLaNoscea,
  // This flag is required to clear any previously specified timelines.
  overrideTimelineFile: true,
  // This file is in the same directory as this JavaScript file.
  timelineFile: 'test-override.txt',
});


// Here's an example of a adding a custom regen trigger.
// It reminds you to use regen again when you are in Sastasha (unsynced).
Options.Triggers.push({
  // The zone this should apply to.
  // This should match the zoneId in the triggers file.
  zoneId: ZoneId.Sastasha,
  triggers: [
    // A more complicated regen trigger.
    {
      // This is a made up id that does not exist in cactbot.
      id: 'User Example Regen',
      // This will match log lines from ACT that look like this:
      // "Nacho Queen gains the effect of Regen from Taco Cat for 21.00 Seconds."
      regex: Regexes.gainsEffect({ effect: 'Regen' }),
      delaySeconds: function(data, matches) {
        // Wait the amount of seconds regen lasts before reminding you to
        // reapply it.  This is not smart enough to figure out if you
        // cast it twice, and is left as an exercise for the reader to
        // figure out how to do so via storing variables on `data`.
        return data.ParseLocaleFloat(matches.duration);
      },
      alertText: 'Regen',
    },
  ],
});
