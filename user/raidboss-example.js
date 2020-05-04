'use strict';

// Rename this file to `raidboss.js` and edit it to change the raidboss ui.
// This file is Javascript.  Anything after "//" on a line is a comment.
// If you edit this file, remember to reload ACT or click the "Reload overlay"
// button on the raidboss CactbotOverlay.
// If there are errors in this file, they will appear in the OverlayPlugin.dll
// log window in ACT.

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

// Remove these /* and */ comment lines to enable the example code below.
/*

// A set of nicknames to use for players, when trying to shorten names.
Options.PlayerNicks = {
  'Darkest Edgelord': 'Mary',
  'Captain Jimmy': 'Jimmy',
  'Pipira Pira': '&#x1F41F;',
};

// A set of triggers to be ignored. The key is the 'id' of the trigger, and
// the value should be true if the trigger is to be ignored, whereas false
// will have no effect.  The trigger ids can be found in the trigger files for
// each fight in the files inside of this directory:
// https://github.com/quisquous/cactbot/tree/master/ui/raidboss/data/triggers
Options.DisabledTriggers = {
  // Disable the /psych trigger from `test.js` in Summerford Farms.
  'Test Psych': true,
  // Disable the "eye lasers" trigger from `drowned_city_of_skalla.js`.
  'Hrodric Words': true,
};


// An array of user-defined triggers, in the format defined in the readme:
// https://github.com/quisquous/cactbot/tree/master/ui/raidboss/data/triggers
Options.Triggers = [

  // (1) Simple example trigger: show text on screen when you die.
  {
    // Match every zone.
    zoneRegex: /./,
    triggers: [
      {
        regex: Regexes.gameLog({ line: 'You are defeated by.*?' }),
        alarmText: 'YOU DIED',
      },
    ],
  },

  // You can add other triggers for other zones too.  Here's more examples:
  //
  // (2) Maybe you want a silly kissy noise whenever you a blow a kiss in
  // a housing zone!
  {
    zoneRegex: /^(Mist|The Goblet|The Lavender Beds|Shirogane)$/,
    triggers: [
      {
        regex: Regexes.gameNameLog({ line: 'You blow a kiss.*?' }),
        sound: '../../resources/sounds/PowerAuras/bigkiss.ogg',
        volume: 0.5,
      },
    ],
  },

  // (3) Maybe you want to modify some existing timeline and triggers:
  //
  // Add some extra triggers to the test timeline.  To use it, see:
  // https://github.com/quisquous/cactbot/blob/master/ui/raidboss/data/timelines/test.txt
  {
    // The zone this should apply to.
    // This should match the zoneRegex in the triggers file.
    zoneRegex: /^Middle La Noscea$/,

    // Add some additional timeline events to the test timeline.
    timeline: `
      # Note: Hash marks are comments inside of a timeline file.
      # This format is the same as ACT timeline.

      # Add a new personal event to the test timeline.
      5.2 "(Remember To Use Feint!)"

      # Remind yourself to shield the tank 5 seconds before final sting.
      infotext "Final Sting" before 5 "shield the tank"

      # Events you don't like, you can hide.  This gets rid of "Long Castbar".
      hideall "Long Castbar"
    `,

    // Add some additional triggers that will go off in Summerford Farms.
    triggers: [
      // If you provoke the striking dummy (or anything), this will trigger.
      {
        id: 'User Example Provoke',
        regex: Regexes.gameLog({ line: 'You use Provoke.*?' }),
        infoText: 'Provoke!',
        tts: 'provoke',
      },

      // A more complicated regen trigger.
      {
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

        alertText: 'Regen Reminder',
        tts: 'regen',
      },
    ],
  },

];

// Per trigger options.  By default, each trigger uses the global options
// of TextAlertsEnabled, SoundAlertsEnabled, and SpokenAlertsEnabled.
// These global options are set up top in this file.
//
// If a per trigger entry is present (regardless if true/false), it will
// override whatever the global option is set to.
//
// SoundOverride (if present) behaves like 'sound' on an individual trigger, in
// that it will take the place of the info/alert/alarm noise if no sound has
// been specified.  SoundAlert (or SoundAlertsEnabled) must still be true for
// that override to be played.
//
// Here's some example per trigger options that modify the test triggers
// in Summerford Farms:
// https://github.com/quisquous/cactbot/blob/master/ui/raidboss/data/00-misc/test.js

Options.PerTriggerOptions = {
  // Just like Options.DisabledTriggers, this is the trigger id to apply to.
  // This overrides the settings for the "/laugh" trigger from the test
  // triggers.  You can try this out by teleporting to Summerford Farms
  // and /laugh at a striking dummy.  It will use these settings and moo.
  'Test Laugh': {
    // Play the text to speech.
    SpeechAlert: false,
    // Play the sound alert.
    SoundAlert: true,
    // Show the info/alert/alarm text on screen.
    TextAlert: false,
    // Play this sound (replacing any sound from the original).
    SoundOverride: '../../resources/sounds/WeakAuras/CowMooing.ogg',
    // Play the sound (if any) at this volume.
    VolumeOverride: 0.3,
  },
  // This makes /poke-ing a striking dummy in Summerford Farms only
  // use text to speech with no visual text indicator or other sound.
  'Test Poke': {
    SpeechAlert: true,
    SoundAlert: false,
    TextAlert: false,
    // Override the tts output as well.
    TTSText: function(data) {
      return 'Custom Poke (' + data.pokes + ')';
    },
  },
  // This makes /clap-ing a striking dummy override the default
  // behavior to use the group TTS
  'Test Clap': {
    GroupSpeechAlert: true,
    SpeechAlert: true,
    SoundAlert: false,
    TextAlert: false,
    // Override the tts output as well.
    GroupTTSText: function(data) {
      return 'Custom CLAP';
    },
  },
};

*/
