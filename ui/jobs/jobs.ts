import { addOverlayListener } from '../../resources/overlay_plugin_api';
import UserConfig from '../../resources/user_config';

import { Bars } from './bars';
import defaultOptions from './jobs_options';

UserConfig.getUserConfigLocation('jobs', defaultOptions, () => {
  const options = { ...defaultOptions };
  const bars = new Bars(options);

  addOverlayListener('onPartyWipe', () => {
    bars._onPartyWipe();
  });
  addOverlayListener('onInCombatChangedEvent', (e) => {
    bars._onInCombatChanged(e);
  });
  addOverlayListener('ChangeZone', (e) => {
    bars._onChangeZone(e);
  });
  addOverlayListener('LogLine', (e) => {
    bars._onNetLog(e);
  });
  addOverlayListener('PartyChanged', (e) => {
    bars._onPartyChanged(e);
  });
});
