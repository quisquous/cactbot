import './raidboss_config.js';
import '../../resources/common.js';
import '../../resources/timerbar.js';

import { PopupText, PopupTextGenerator } from './popup-text.js';
import { TimelineController, TimelineLoader, TimelineUI } from './timeline.js';

import UserConfig from '../../resources/user_config.js';
import { addRemotePlayerSelectUI } from '../../resources/player_override.js';
import raidbossFileData from './data/manifest.txt';

// See user/raidboss-example.js for documentation.
const Options = {
  // These options are ones that are not auto-defined by raidboss_config.js.
  PlayerNicks: {},

  InfoSound: '../../resources/sounds/freesound/percussion_hit.ogg',
  AlertSound: '../../resources/sounds/BigWigs/Alert.ogg',
  AlarmSound: '../../resources/sounds/BigWigs/Alarm.ogg',
  LongSound: '../../resources/sounds/BigWigs/Long.ogg',
  PullSound: '../../resources/sounds/PowerAuras/sonar.ogg',

  AudioAllowed: true,

  DisabledTriggers: {},

  PerTriggerOptions: {},

  Triggers: [],

  PlayerNameOverride: null,
  IsRemoteRaidboss: false,
};

UserConfig.getUserConfigLocation('raidboss', Options, (e) => {
  // Query params override default and user options.
  // This allows for html files that say "timeline only" or "alerts only".
  const params = new URLSearchParams(window.location.search);

  Options.IsRemoteRaidboss = false;
  if (params.get('OVERLAY_WS')) {
    const wsParam = decodeURIComponent(params.get('OVERLAY_WS'));
    // TODO: is there a better way to do this?? This seems better than looking for ngrok.
    const isLocal = wsParam.includes('localhost') || wsParam.includes('127.0.0.1');
    Options.IsRemoteRaidboss = !isLocal;
  }

  const playerNameParam = params.get('player');
  if (playerNameParam) {
    Options.PlayerNameOverride = playerNameParam;
    console.log('Enabling player name override via query parameter, name: ' + playerNameParam);
  }

  if (Options.IsRemoteRaidboss && playerNameParam === null) {
    const lang = Options.DisplayLanguage || Options.ParserLanguage || 'en';
    addRemotePlayerSelectUI(lang);

    // Page will reload once player selected.
    return;
  }

  const ttsParam = params.get('forceTTS');
  if (ttsParam) {
    const forceEnable = !!parseInt(ttsParam);
    if (forceEnable) {
      Options.SpokenAlertsEnabled = true;
      console.log('Force enabling TTS via query parameter');
    }
  }

  const alertsParam = params.get('alerts');
  if (alertsParam !== null) {
    const previous = Options.AlertsEnabled;
    Options.AlertsEnabled = !!parseInt(alertsParam);
    if (!previous && Options.AlertsEnabled)
      console.log('Enabling alerts via query parameter');
  }
  const timelineParam = params.get('timeline');
  if (timelineParam !== null) {
    const previous = Options.TimelineEnabled;
    Options.TimelineEnabled = !!parseInt(timelineParam);
    if (!previous && Options.TimelineEnabled)
      console.log('Enabling timeline via query parameter');
  }
  const audioParam = params.get('audio');
  if (audioParam !== null) {
    const previous = Options.AudioAllowed;
    Options.AudioAllowed = !!parseInt(audioParam);
    if (!previous && Options.AudioAllowed)
      console.log('Enabling audio via query parameter');
  }

  const container = document.getElementById('container');
  if (!Options.AlertsEnabled)
    container.classList.add('hide-alerts');
  if (!Options.TimelineEnabled)
    container.classList.add('hide-timeline');

  const timelineUI = new TimelineUI(Options);
  const timelineController = new TimelineController(Options, timelineUI, raidbossFileData);
  const timelineLoader = new TimelineLoader(timelineController);
  const popupText = new PopupText(Options, timelineLoader, raidbossFileData);

  // Connect the timelines to the popup text, if alerts are desired.
  if (Options.AlertsEnabled)
    timelineController.SetPopupTextInterface(new PopupTextGenerator(popupText));

  addOverlayListener('onLogEvent', (e) => {
    timelineController.OnLogEvent(e);
  });
});
