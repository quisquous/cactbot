import PartyTracker from '../../resources/party';
import UserConfig from '../../resources/user_config';

import { Bars } from './bars';
import { ComponentManager } from './components';
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

  // Because Chinese/Korean regions are still on older version of FF14,
  // set this value to whether or not we should treat this as 5.x or 6.x.
  // This affects things like entire jobs (smn) or combo durations.
  const is5x = ['cn', 'ko'].includes(options.ParserLanguage);

  new ComponentManager({ bars, emitter, options, partyTracker, player, is5x });
});
