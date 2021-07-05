import { UnreachableCode } from '../../resources/not_reached';
import { callOverlayHandler, addOverlayListener } from '../../resources/overlay_plugin_api';
import UserConfig from '../../resources/user_config';

import { DamageTracker } from './damage_tracker';
import oopsyFileData from './data/oopsy_manifest.txt';
import { MistakeCollector } from './mistake_collector';
import { OopsyListView } from './oopsy_list_view';
import { OopsyLiveList } from './oopsy_live_list';
import defaultOptions from './oopsy_options';
import { OopsySummaryList } from './oopsy_summary_list';

import './oopsyraidsy_config';

import '../../resources/defaults.css';
import './oopsy_common.css';

UserConfig.getUserConfigLocation('oopsyraidsy', defaultOptions, () => {
  const options = { ...defaultOptions };
  let initListView: OopsyListView | undefined;
  let initMistakeCollector: MistakeCollector | undefined;

  const summaryElement = document.getElementById('summary');
  const liveListElement = document.getElementById('livelist');

  // Choose the ui based on whether this is the summary view or the live list.
  // They have different elements in the file.
  if (summaryElement) {
    initListView = new OopsySummaryList(options, summaryElement);
    initMistakeCollector = new MistakeCollector(options, initListView);
  } else if (liveListElement) {
    initListView = new OopsyLiveList(options, liveListElement);
    initMistakeCollector = new MistakeCollector(options, initListView);
  } else {
    throw new UnreachableCode();
  }

  const listView = initListView;
  const mistakeCollector = initMistakeCollector;
  const damageTracker = new DamageTracker(options, mistakeCollector, oopsyFileData);

  addOverlayListener('LogLine', (e) => damageTracker.OnNetLog(e));
  addOverlayListener('onPartyWipe', () => damageTracker.OnPartyWipeEvent());
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

  void callOverlayHandler({ call: 'cactbotRequestPlayerUpdate' });
});
