import { addOverlayListener } from '../../resources/overlay_plugin_api';
import { addRemotePlayerSelectUI } from '../../resources/player_override';
import UserConfig from '../../resources/user_config';

import raidbossFileData from './data/raidboss_manifest.txt';
import { PopupText, PopupTextGenerator } from './popup-text';
import defaultOptions from './raidboss_options';
import { TimelineController, TimelineLoader, TimelineUI } from './timeline';

import '../../resources/timerbar';
import './raidboss_config';

import '../../resources/defaults.css';
import './raidboss.css';

UserConfig.getUserConfigLocation('raidboss', defaultOptions, () => {
  const options = { ...defaultOptions };

  // Query params override default and user options.
  // This allows for html files that say "timeline only" or "alerts only".
  const params = new URLSearchParams(window.location.search);

  options.IsRemoteRaidboss = false;
  const overlayWsParam = params.get('OVERLAY_WS');
  if (overlayWsParam) {
    const wsParam = decodeURIComponent(overlayWsParam);
    // TODO: is there a better way to do this?? This seems better than looking for ngrok.
    const isLocal = wsParam.includes('localhost') || wsParam.includes('127.0.0.1');
    options.IsRemoteRaidboss = !isLocal;
  }

  const playerNameParam = params.get('player');
  if (playerNameParam) {
    options.PlayerNameOverride = playerNameParam;
    console.log('Enabling player name override via query parameter, name: ' + playerNameParam);
  }

  if (options.IsRemoteRaidboss && playerNameParam === null) {
    const lang = options.DisplayLanguage || options.ParserLanguage || 'en';
    addRemotePlayerSelectUI(lang);

    // Page will reload once player selected.
    return;
  }

  const ttsParam = params.get('forceTTS');
  if (ttsParam) {
    const forceEnable = !!parseInt(ttsParam);
    if (forceEnable) {
      options.SpokenAlertsEnabled = true;
      console.log('Force enabling TTS via query parameter');
    }
  }

  const alertsParam = params.get('alerts');
  if (alertsParam !== null) {
    const previous = options.AlertsEnabled;
    options.AlertsEnabled = !!parseInt(alertsParam);
    if (!previous && options.AlertsEnabled)
      console.log('Enabling alerts via query parameter');
  }
  const timelineParam = params.get('timeline');
  if (timelineParam !== null) {
    const previous = options.TimelineEnabled;
    options.TimelineEnabled = !!parseInt(timelineParam);
    if (!previous && options.TimelineEnabled)
      console.log('Enabling timeline via query parameter');
  }
  const audioParam = params.get('audio');
  if (audioParam !== null) {
    const previous = options.AudioAllowed;
    options.AudioAllowed = !!parseInt(audioParam);
    if (!previous && options.AudioAllowed)
      console.log('Enabling audio via query parameter');
  }

  const container = document.getElementById('container');
  if (!container)
    throw new Error('Unable to find container element');
  if (!options.AlertsEnabled)
    container.classList.add('hide-alerts');
  if (!options.TimelineEnabled)
    container.classList.add('hide-timeline');

  const timelineUI = new TimelineUI(options);
  const timelineController = new TimelineController(options, timelineUI, raidbossFileData);
  const timelineLoader = new TimelineLoader(timelineController);
  const popupText = new PopupText(options, timelineLoader, raidbossFileData);

  // Connect the timelines to the popup text, if alerts are desired.
  if (options.AlertsEnabled)
    timelineController.SetPopupTextInterface(new PopupTextGenerator(popupText));

  addOverlayListener('onLogEvent', (e) => {
    timelineController.OnLogEvent(e);
  });
});
