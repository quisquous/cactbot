import UserConfig from '../../resources/user_config';

import { Bars } from './bars';
import { JobsEventEmitter } from './event_emitter';
import defaultOptions from './jobs_options';
import { Player } from './player';

UserConfig.getUserConfigLocation('jobs', defaultOptions, () => {
  const options = { ...defaultOptions };

  const emitter = new JobsEventEmitter();
  const player = new Player(emitter);
  new Bars(options, { emitter, player });

  // register overlay plugin's events
  emitter.registerOverlayListeners();
});
