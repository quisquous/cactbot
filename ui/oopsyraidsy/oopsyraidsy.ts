import { UnreachableCode } from '../../resources/not_reached';
import { addOverlayListener, callOverlayHandler } from '../../resources/overlay_plugin_api';
import UserConfig from '../../resources/user_config';
import { OopsyMistakeType } from '../../types/oopsy';

import { DamageTracker } from './damage_tracker';
import oopsyFileData from './data/oopsy_manifest.txt';
import { MistakeCollector } from './mistake_collector';
import { OopsyLiveList } from './oopsy_live_list';
import defaultOptions from './oopsy_options';
import { OopsySummaryList, OopsySummaryTable } from './oopsy_summary_list';

import './oopsyraidsy_config';

import '../../resources/defaults.css';
import './oopsy_common.css';

export const addDebugInfo = (collector: MistakeCollector, numMistakes: number): void => {
  // TODO: maybe this should use the fake_name_generator.
  const names = [
    'Tini Poutini',
    'Potato Chippy',
    'Papas Fritas',
    'Tater Tot',
    'Hash Brown',
    'French Fry',
  ];
  const types: OopsyMistakeType[] = ['death', 'fail', 'warn', 'pull'];

  // TODO: this should probably start/stop combat too for the summary page?
  collector.StartCombat();
  for (let i = 0; i < numMistakes; ++i) {
    collector.OnMistakeObj({
      type: types[Math.floor(Math.random() * types.length)] ?? 'good',
      blame: names[Math.floor(Math.random() * names.length)],
      text: 'stuff',
    });
  }
};

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

    const tableElement = document.getElementById('mistake-table');
    if (!tableElement)
      throw new UnreachableCode();
    const table = new OopsySummaryTable(options, tableElement);
    mistakeCollector.AddObserver(table);
  } else if (liveListElement) {
    const listView = new OopsyLiveList(options, liveListElement);
    mistakeCollector.AddObserver(listView);
  } else {
    throw new UnreachableCode();
  }

  // NOTE: add "debug=1" url parameter to add extra events.
  const params = new URLSearchParams(window.location.search);
  if (params.get('debug'))
    addDebugInfo(mistakeCollector, 2200);

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
