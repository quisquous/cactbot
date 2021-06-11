// TODO: remove this when ui/jobs/jobs.js is converted to typescript
import { Job } from '../../types/job';
import { JobDetail } from '../../types/event';
import ComboTracker, { ComboCallback } from './combo_tracker';
import TimerBox from '../../resources/timerbox';

type Selector = {
  id?: string;
  fgColor?: string;
  classList?: string[];
  threshold?: number;
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
    lightningStacks: number;
    huton: boolean;
    shifu: boolean;
    museStacks: 1 | 2 | 3 | 4;
  };
  level: number;
  gcdSkill: number;
  combo: ComboTracker;
  skillSpeed: number;

  addProcBox: (o: Selector) => TimerBox;
  addResourceBox: (o: Selector) => ResourceBox;
  onUseAbility: (id: string, cb: VoidFunction) => void;
  onStatChange: (job: Job, cb: VoidFunction) => void;
  addTimerBar: (o: Selector) => TimerBox;
  onJobDetailUpdate: (cb: (e: JobDetail[string]) => void) => void;
  onCombo: (cb: ComboCallback) => void;
}
