'use strict';

// See user/raidboss-example.js for documentation.
let Options = {
  // These options are ones that are not auto-defined by raidboss_config.js.
  PlayerNicks: {},

  InfoSound: '../../resources/sounds/freesound/percussion_hit.ogg',
  AlertSound: '../../resources/sounds/BigWigs/Alert.ogg',
  AlarmSound: '../../resources/sounds/BigWigs/Alarm.ogg',
  LongSound: '../../resources/sounds/BigWigs/Long.ogg',
  PullSound: '../../resources/sounds/PowerAuras/sonar.ogg',

  audioAllowed: true,

  DisabledTriggers: {},

  PerTriggerOptions: {},

  Triggers: [],

  PlayerNameOverride: null,
};

let gTimelineController;

UserConfig.getUserConfigLocation('raidboss', function(e) {
  addOverlayListener('onLogEvent', function(e) {
    gTimelineController.OnLogEvent(e);
  });

  // Query params override default and user options.
  // This allows for html files that say "timeline only" or "alerts only".
  let params = new URLSearchParams(window.location.search);
  let alerts = params.get('alerts');
  if (alerts !== null) {
    let previous = Options.AlertsEnabled;
    Options.AlertsEnabled = !!parseInt(alerts);
    if (!previous && Options.AlertsEnabled)
      console.log('Enabling alerts via query parameter');
  }
  let timeline = params.get('timeline');
  if (timeline !== null) {
    let previous = Options.TimelineEnabled;
    Options.TimelineEnabled = !!parseInt(timeline);
    if (!previous && Options.TimelineEnabled)
      console.log('Enabling timeline via query parameter');
  }
  let audio = params.get('audio');
  if (audio !== null) {
    let previous = Options.audioAllowed;
    Options.audioAllowed = !!parseInt(audio);
    if (!previous && Options.audioAllowed)
      console.log('Enabling audio via query parameter');
  }

  let PlayerNameOverride = params.get('player');
  if (PlayerNameOverride !== null) {
    Options.PlayerNameOverride = PlayerNameOverride;
    console.log('Enabling player name override via query parameter, ' + PlayerNameOverride);
    if (Options.audioAllowed) {
      // include the tts engine script
      // re-using this since it's already created
      UserConfig.appendJSLink('browser_tts_engine.js');
      console.log('Enabling browser TTS engine');
    }
  }

  let container = document.getElementById('container');
  if (!Options.AlertsEnabled)
    container.classList.add('hide-alerts');
  if (!Options.TimelineEnabled)
    container.classList.add('hide-timeline');

  callOverlayHandler({
    call: 'cactbotReadDataFiles',
    source: location.href,
  }).then((e) => {
    gTimelineController.SetDataFiles(e.detail.files);
    gPopupText.OnDataFilesRead(e);
    gPopupText.ReloadTimelines();
  });

  gTimelineController = new TimelineController(Options, new TimelineUI(Options));
  gPopupText = new PopupText(Options);
  // Connect the timelines to the popup text, if alerts are desired.
  if (Options.AlertsEnabled)
    gTimelineController.SetPopupTextInterface(new PopupTextGenerator(gPopupText));
  gPopupText.SetTimelineLoader(new TimelineLoader(gTimelineController));
});
