import EffectId from '../../../resources/effect_id';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { NetMatches } from '../../../types/net_matches';
import { kAbility } from '../constants';
import { Bars } from '../jobs';

import { Component } from './base';

export default class BlmComponent extends Component {
  thunderDot: TimerBox;
  thunderProc: TimerBox;
  fireProc: TimerBox;
  umbralTimer: HTMLDivElement;
  xenoTimer: HTMLDivElement;
  heartStacks: HTMLDivElement[];
  xenoStacks: HTMLDivElement[];

  constructor(bars: Bars) {
    super(bars);

    this.thunderDot = this.addProcBox({
      id: 'blm-dot-thunder',
      fgColor: 'blm-color-dot',
      threshold: 4,
      notifyWhenExpired: true,
    });
    this.thunderProc = this.addProcBox({
      id: 'blm-procs-thunder',
      fgColor: 'blm-color-thunder',
      threshold: 1000,
    });
    this.thunderProc.bigatzero = false;
    this.fireProc = this.addProcBox({
      id: 'blm-procs-fire',
      fgColor: 'blm-color-fire',
      threshold: 1000,
    });
    this.fireProc.bigatzero = false;

    this.umbralTimer = this.addResourceBox({
      classList: ['blm-umbral-timer'],
    });
    this.xenoTimer = this.addResourceBox({
      classList: ['blm-xeno-timer'],
    });

    // It'd be super nice to use grid here.
    // Maybe some day when cactbot uses new cef.
    const stacksContainer = document.createElement('div');
    stacksContainer.id = 'blm-stacks';
    this.addCustomBar(stacksContainer);

    const heartStacksContainer = document.createElement('div');
    heartStacksContainer.id = 'blm-stacks-heart';
    stacksContainer.appendChild(heartStacksContainer);
    this.heartStacks = [];
    for (let i = 0; i < 3; ++i) {
      const d = document.createElement('div');
      heartStacksContainer.appendChild(d);
      this.heartStacks.push(d);
    }

    const xenoStacksContainer = document.createElement('div');
    xenoStacksContainer.id = 'blm-stacks-xeno';
    stacksContainer.appendChild(xenoStacksContainer);
    this.xenoStacks = [];
    for (let i = 0; i < 2; ++i) {
      const d = document.createElement('div');
      xenoStacksContainer.appendChild(d);
      this.xenoStacks.push(d);
    }
  }

  onJobDetailUpdate(jobDetail: JobDetail['BLM']): void {
    if (this.bars.umbralStacks !== jobDetail.umbralStacks) {
      this.bars.umbralStacks = jobDetail.umbralStacks;
      this.bars._updateMPTicker();
    }
    const fouls = jobDetail.foulCount;
    this.xenoStacks.forEach((elem, index) => {
      if (fouls > index)
        elem.classList.add('active');
      else
        elem.classList.remove('active');
    });
    const hearts = jobDetail.umbralHearts;
    this.heartStacks.forEach((elem, index) => {
      if (hearts > index)
        elem.classList.add('active');
      else
        elem.classList.remove('active');
    });

    const stacks = jobDetail.umbralStacks;
    const seconds = Math.ceil(jobDetail.umbralMilliseconds / 1000.0);
    const p = this.umbralTimer.parentNode as HTMLElement;
    if (!stacks) {
      this.umbralTimer.innerText = '';
      p.classList.remove('fire');
      p.classList.remove('ice');
    } else if (stacks > 0) {
      this.umbralTimer.innerText = seconds.toString();
      p.classList.add('fire');
      p.classList.remove('ice');
    } else {
      this.umbralTimer.innerText = seconds.toString();
      p.classList.remove('fire');
      p.classList.add('ice');
    }

    const xp = this.xenoTimer.parentNode as HTMLElement;
    if (!jobDetail.enochian) {
      this.xenoTimer.innerText = '';
      xp.classList.remove('active', 'pulse');
    } else {
      const nextPoly = jobDetail.nextPolyglotMilliseconds;
      this.xenoTimer.innerText = Math.ceil(nextPoly / 1000.0).toString();
      xp.classList.add('active');

      if (fouls === 2 && nextPoly < 5000)
        xp.classList.add('pulse');
      else
        xp.classList.remove('pulse');
    }
  }

  onUseAbility(action: string): void {
    switch (action) {
    case kAbility.Thunder1:
    case kAbility.Thunder4:
      this.thunderDot.duration = '18';
      break;

    case kAbility.Thunder2:
      this.thunderDot.duration = '12';
      break;

    case kAbility.Thunder3:
      this.thunderDot.duration = '24';
      break;

    default:
      break;
    }
  }

  onGainEffect(effectId: string, matches: NetMatches['GainsEffect']): void {
    switch (effectId) {
    case EffectId.Thundercloud:
      this.thunderProc.duration = matches.duration;
      break;

    case EffectId.Firestarter:
      this.fireProc.duration = matches.duration;
      break;

    case EffectId.CircleOfPower:
      this.bars.speedBuffs.circleOfPower = 1;
      break;

    default:
      break;
    }
  }

  onLoseEffect(effectId: string): void {
    switch (effectId) {
    case EffectId.Thundercloud:
      this.thunderProc.duration = '0';
      break;

    case EffectId.Firestarter:
      this.fireProc.duration = '0';
      break;

    case EffectId.CircleOfPower:
      this.bars.speedBuffs.circleOfPower = 0;
      break;

    default:
      break;
    }
  }

  reset(): void {
    this.thunderDot.duration = '0';
    this.thunderProc.duration = '0';
    this.fireProc.duration = '0';
  }
}

