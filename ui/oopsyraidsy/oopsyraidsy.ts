import { UnreachableCode } from '../../resources/not_reached';
import { addOverlayListener, callOverlayHandler } from '../../resources/overlay_plugin_api';
import UserConfig from '../../resources/user_config';

import { DamageTracker } from './damage_tracker';
import oopsyFileData from './data/oopsy_manifest.txt';
import { MistakeCollector } from './mistake_collector';
import { OopsyLiveList } from './oopsy_live_list';
import defaultOptions from './oopsy_options';
import { OopsySummaryList } from './oopsy_summary_list';

import './oopsyraidsy_config';

import '../../resources/defaults.css';
import './oopsy_common.css';

UserConfig.getUserConfigLocation('oopsyraidsy', defaultOptions, () => {
  const options = { ...defaultOptions };

  const mistakeCollector = new MistakeCollector(options);
  const summaryElement = document.getElementById('summary');
  const liveListElement = document.getElementById('livelist');

  // Choose the ui based on whether this is the summary view or the live list.
  // They have different elements in the file.
  if (summaryElement) {
    const listView = new OopsySummaryList(options, summaryElement);
    mistakeCollector.AddObserver(listView);
  } else if (liveListElement) {
    const listView = new OopsyLiveList(options, liveListElement);
    mistakeCollector.AddObserver(listView);
  } else {
    throw new UnreachableCode();
  }

  const damageTracker = new DamageTracker(options, mistakeCollector, oopsyFileData);

  addOverlayListener('LogLine', (e) => damageTracker.OnNetLog(e));
  addOverlayListener('onPartyWipe', () => damageTracker.OnPartyWipeEvent());
  addOverlayListener('onPlayerChangedEvent', (e) => damageTracker.OnPlayerChange(e));
  addOverlayListener('ChangeZone', (e) => {
    damageTracker.OnChangeZone(e);
    mistakeCollector.OnChangeZone(e);
  });
  addOverlayListener('onInCombatChangedEvent', (e) => {
    damageTracker.OnInCombatChangedEvent(e);
    mistakeCollector.OnInCombatChangedEvent(e);
  });

  void callOverlayHandler({ call: 'cactbotRequestPlayerUpdate' });
});
