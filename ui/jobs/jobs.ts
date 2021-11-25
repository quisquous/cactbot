import PartyTracker from '../../resources/party';
import UserConfig from '../../resources/user_config';

import { Bars } from './bars';
import { BaseComponent } from './components/base';
import { JobsEventEmitter } from './event_emitter';
import defaultOptions from './jobs_options';
import { Player } from './player';

UserConfig.getUserConfigLocation('jobs', defaultOptions, () => {
  const options = { ...defaultOptions };

  const emitter = new JobsEventEmitter();
  const player = new Player(emitter);
  const partyTracker = new PartyTracker();
  const bars = new Bars(options, { emitter, player });
  new BaseComponent({ bars, emitter, options, partyTracker, player }).setup();
});
