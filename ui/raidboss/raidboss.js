"use strict";

// Each option here can be changed in user/raidboss.js with a line such as
// Options.BarExpiresSoonSeconds = 2
// or
// Options.InfoSound = 'file://C:/path/to/info/sound.ogg'
// See user/raidboss-example.js for documentation.
var Options = {
  TimelineEnabled: true,
  PopupTextEnabled: true,

  ShowTimerBarsAtSeconds: 30,
  KeepExpiredTimerBarsForSeconds: 0.7,
  BarExpiresSoonSeconds: 8,
  MaxNumberOfTimerBars: 6,

  InfoSound: '../../resources/sounds/freesound/percussion_hit.ogg',
  AlertSound: '../../resources/sounds/BigWigs/Alert.ogg',
  AlarmSound: '../../resources/sounds/BigWigs/Alarm.ogg',
  LongSound: '../../resources/sounds/BigWigs/Long.ogg',

  InfoSoundVolume: 1,
  AlertSoundVolume: 1,
  AlarmSoundVolume: 1,
  LongSoundVolume: 1,

  DisabledTriggers: {},
  Triggers: [],
};


window.setTimeout(function() {
  if (!gTimelineController) {
    gTimelineController = new TimelineController(Options, new TimelineUI(Options));
    gPopupText = new PopupText(Options);
    // Connect the timelines to the popup text.
    gTimelineController.SetPopupTextInterface(new PopupTextGenerator(gPopupText));
    gPopupText.SetTimelineLoader(new TimelineLoader(gTimelineController));
  }
}, 0);
