'use strict';

// Each option here can be changed in user/raidboss.js with a line such as
// Options.BarExpiresSoonSeconds = 2
// or
// Options.InfoSound = 'file://C:/path/to/info/sound.ogg'
// See user/raidboss-example.js for documentation.
let Options = {
  Skin: 'default',

  TimelineEnabled: true,
  AlertsEnabled: true,
  TextAlertsEnabled: true,
  SoundAlertsEnabled: true,
  SpokenAlertsEnabled: false,
  GroupSpokenAlertsEnabled: false,

  PlayerNicks: {},

  ShowTimerBarsAtSeconds: 30,
  KeepExpiredTimerBarsForSeconds: 0.7,
  BarExpiresSoonSeconds: 8,
  MaxNumberOfTimerBars: 6,

  DisplayAlarmTextForSeconds: 3,
  DisplayAlertTextForSeconds: 3,
  DisplayInfoTextForSeconds: 3,

  InfoSound: '../../resources/sounds/freesound/percussion_hit.ogg',
  AlertSound: '../../resources/sounds/BigWigs/Alert.ogg',
  AlarmSound: '../../resources/sounds/BigWigs/Alarm.ogg',
  LongSound: '../../resources/sounds/BigWigs/Long.ogg',
  PullSound: '../../resources/sounds/PowerAuras/sonar.ogg',

  InfoSoundVolume: 1,
  AlertSoundVolume: 1,
  AlarmSoundVolume: 1,
  LongSoundVolume: 1,
  PullSoundVolume: 0.3,

  DisabledTriggers: {},

  PerTriggerOptions: {},

  Triggers: [],
};

let gTimelineController;

UserConfig.getUserConfigLocation('raidboss', function(e) {
  addOverlayListener('onLogEvent', function(e) {
    gTimelineController.OnLogEvent(e);
  });

  callOverlayHandler({
    call: 'cactbotReadDataFiles',
    source: location.href,
  }).then((e) => gTimelineController.SetDataFiles(e.detail.files));

  gTimelineController = new TimelineController(Options, new TimelineUI(Options));
  gPopupText = new PopupText(Options);
  // Connect the timelines to the popup text.
  gTimelineController.SetPopupTextInterface(new PopupTextGenerator(gPopupText));
  gPopupText.SetTimelineLoader(new TimelineLoader(gTimelineController));
});
