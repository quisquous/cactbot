// TODO: remove this when ui/jobs/jobs.js is converted to typescript
import ResourceBar from '../../resources/resourcebar';
import TimerBar from '../../resources/timerbar';
import TimerBox from '../../resources/timerbox';
import { EventResponses, JobDetail } from '../../types/event';
import { Job } from '../../types/job';
import { NetMatches } from '../../types/net_matches';

import ComboTracker, { ComboCallback } from './combo_tracker';

type Selector = {
  id?: string;
  fgColor?: string;
  classList?: string[];
  threshold?: number;
  notifyWhenExpired?: boolean;
  maxvalue?: number;
};

interface ResourceBox extends HTMLDivElement {
  parentNode: HTMLElement;
}

export interface Bars {
  job: Job;
  speedBuffs: {
    circleOfPower: boolean;
    presenceOfMind: boolean;
    paeonStacks: number;
    huton: boolean;
    shifu: boolean;
    museStacks: number;
  };
  level: number;
  gcdSkill: number;
  gcdSpell: number;
  combo: ComboTracker;
  skillSpeed: number;
  spellSpeed: number;

  addProcBox: (o: Selector) => TimerBox;
  addResourceBox: (o: Selector) => ResourceBox;
  addResourceBar: (o: Selector) => ResourceBar;
  addJobBarContainer: () => HTMLElement;
  addTimerBar: (o: Selector) => TimerBar;
  onUseAbility: (
    id: string | string[],
    cb: (id: string, matches: NetMatches['Ability']) => void,
  ) => void;
  onYouGainEffect: (
    id: string | string[],
    cb: (id: string, matches: NetMatches['GainsEffect']) => void,
  ) => void;
  onYouLoseEffect: (
    id: string | string[],
    cb: (id: string, matches: NetMatches['LosesEffect']) => void,
  ) => void;
  onMobGainsEffectFromYou: (
    id: string | string[],
    cb: (id: string, matches: NetMatches['GainsEffect']) => void,
  ) => void;
  onMobLosesEffectFromYou: (
    id: string | string[],
    cb: (id: string, matches: NetMatches['LosesEffect']) => void,
  ) => void;
  onStatChange: (job: Job, cb: VoidFunction) => void;
  onJobDetailUpdate: (cb: (e: JobDetail[string]) => void) => void;

  onCombo: (cb: ComboCallback) => void;
  // TODO: this shouldn't have an underscore.
  _updateMPTicker: () => void;
  updateDotTimerFuncs: (() => void)[];
  changeZoneFuncs: ((e: EventResponses['ChangeZone']) => void)[];
}
