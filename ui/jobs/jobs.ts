import PartyTracker from '../../resources/party';
import UserConfig from '../../resources/user_config';

import { Bars } from './bars';
import { ComponentFactory } from './components/base';
import { JobsEventEmitter } from './event_emitter';
import defaultOptions from './jobs_options';
import { Player } from './player';

import '../../resources/defaults.css';
import './jobs.css';

UserConfig.getUserConfigLocation('jobs', defaultOptions, () => {
  const options = { ...defaultOptions };

  const emitter = new JobsEventEmitter();
  const player = new Player(emitter);
  const partyTracker = new PartyTracker();
  const bars = new Bars(options, { emitter, player });
  new ComponentFactory({ bars, emitter, options, partyTracker, player });
});
