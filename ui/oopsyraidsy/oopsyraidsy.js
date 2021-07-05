import { callOverlayHandler, addOverlayListener } from '../../resources/overlay_plugin_api';
import UserConfig from '../../resources/user_config';

import { OopsySummaryList } from './oopsy_summary_list';
import { OopsyLiveList } from './oopsy_live_list';
import { DamageTracker } from './damage_tracker';
import { MistakeCollector } from './mistake_collector';
import defaultOptions from './oopsy_options';

import './oopsyraidsy_config';

import oopsyFileData from './data/oopsy_manifest.txt';

import '../../resources/defaults.css';
import './oopsy_common.css';

UserConfig.getUserConfigLocation('oopsyraidsy', defaultOptions, () => {
  const options = { ...defaultOptions };
  let listView;
  let mistakeCollector;

  const summaryElement = document.getElementById('summary');
  const liveListElement = document.getElementById('livelist');

  // Choose the ui based on whether this is the summary view or the live list.
  // They have different elements in the file.
  if (summaryElement) {
    listView = new OopsySummaryList(options, summaryElement);
    mistakeCollector = new MistakeCollector(options, listView);
  } else {
    listView = new OopsyLiveList(options, liveListElement);
    mistakeCollector = new MistakeCollector(options, listView);
  }

  const damageTracker = new DamageTracker(options, mistakeCollector, oopsyFileData);

  addOverlayListener('LogLine', (e) => damageTracker.OnNetLog(e));
  addOverlayListener('onPartyWipe', (e) => damageTracker.OnPartyWipeEvent(e));
  addOverlayListener('onPlayerChangedEvent', (e) => damageTracker.OnPlayerChange(e));
  addOverlayListener('ChangeZone', (e) => {
    damageTracker.OnChangeZone(e);
    mistakeCollector.OnChangeZone(e);
    listView.OnChangeZone(e);
  });
  addOverlayListener('onInCombatChangedEvent', (e) => {
    damageTracker.OnInCombatChangedEvent(e);
    mistakeCollector.OnInCombatChangedEvent(e);
  });

  callOverlayHandler({ call: 'cactbotRequestPlayerUpdate' });
});
