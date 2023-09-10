import { Lang } from '../../resources/languages';
import PartyTracker from '../../resources/party';
import UserConfig from '../../resources/user_config';

import { Bars } from './bars';
import { ComponentManager } from './components';
import { JobsEventEmitter } from './event_emitter';
import defaultOptions from './jobs_options';
import { Player } from './player';

import '../../resources/defaults.css';
import './jobs.css';

export type FfxivVersion = number;

UserConfig.getUserConfigLocation('jobs', defaultOptions, () => {
  const options = { ...defaultOptions };

  // Because CN and KO regions play an older version of FF14,
  // set the game version here to change the behavior on older version.
  // (Battle system changes will be merged in major update for CN/KO)
  // (e.g. intl 6.38 job changes are merged in cn patch 6.3)
  const ffxivlanguageToVersion: Record<Lang, FfxivVersion> = {
    'en': 640,
    'de': 640,
    'fr': 640,
    'ja': 640,
    'cn': 630,
    'ko': 630,
  };
  const ffxivVersion = ffxivlanguageToVersion[options.ParserLanguage];

  const emitter = new JobsEventEmitter();
  const partyTracker = new PartyTracker();
  const player = new Player(emitter, partyTracker, ffxivVersion);
  const bars = new Bars(options, { emitter, player });

  new ComponentManager({ bars, emitter, options, partyTracker, player, ffxivVersion });
});
