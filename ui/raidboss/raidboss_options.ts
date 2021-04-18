// These are the base options that raidboss expects to see.

// See user/raidboss-example.js for documentation.
export default {
  // These options are ones that are not auto-defined by raidboss_config.ts.
  PlayerNicks: {},

  InfoSound: '../../resources/sounds/freesound/percussion_hit.ogg',
  AlertSound: '../../resources/sounds/BigWigs/Alert.ogg',
  AlarmSound: '../../resources/sounds/BigWigs/Alarm.ogg',
  LongSound: '../../resources/sounds/BigWigs/Long.ogg',
  PullSound: '../../resources/sounds/freesound/sonar.ogg',

  AudioAllowed: true,

  DisabledTriggers: {},

  PerTriggerOptions: {},

  Triggers: [],

  PlayerNameOverride: null,
  IsRemoteRaidboss: false,
};
