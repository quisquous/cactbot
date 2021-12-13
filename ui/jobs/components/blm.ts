import EffectId from '../../../resources/effect_id';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { kAbility } from '../constants';
import { PartialFieldMatches } from '../event_emitter';

import { BaseComponent, ComponentInterface } from './base';

export class BLMComponent extends BaseComponent {
  thunderDot: TimerBox;
  thunderProc: TimerBox;
  fireProc: TimerBox;
  xenoStacks: HTMLElement[];
  heartStacks: HTMLElement[];
  umbralTimer: ResourceBox;
  xenoTimer: ResourceBox;

  umbralStacks: number;

  constructor(o: ComponentInterface) {
    super(o);

    this.umbralStacks = 0;

    this.thunderDot = this.bars.addProcBox({
      id: 'blm-dot-thunder',
      fgColor: 'blm-color-dot',
      threshold: 4,
      notifyWhenExpired: true,
    });
    this.thunderProc = this.bars.addProcBox({
      id: 'blm-procs-thunder',
      fgColor: 'blm-color-thunder',
      threshold: 1000,
    });
    this.thunderProc.bigatzero = false;
    this.fireProc = this.bars.addProcBox({
      id: 'blm-procs-fire',
      fgColor: 'blm-color-fire',
      threshold: 1000,
    });
    this.fireProc.bigatzero = false;

    // It'd be super nice to use grid here.
    // Maybe some day when cactbot uses new cef.
    const stacksContainer = document.createElement('div');
    stacksContainer.id = 'blm-stacks';
    stacksContainer.classList.add('stacks');
    this.bars.addJobBarContainer().appendChild(stacksContainer);

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

    this.umbralTimer = this.bars.addResourceBox({
      classList: ['blm-umbral-timer'],
    });
    this.xenoTimer = this.bars.addResourceBox({
      classList: ['blm-xeno-timer'],
    });
  }

  override onUseAbility(id: string): void {
    switch (id) {
      case kAbility.Thunder1:
      case kAbility.Thunder4:
        this.thunderDot.duration = 18;
        break;
      case kAbility.Thunder2:
        this.thunderDot.duration = 12;
        break;
      case kAbility.Thunder3:
        this.thunderDot.duration = 24;
        break;
    }
  }

  override onYouGainEffect(id: string, matches: PartialFieldMatches<'GainsEffect'>): void {
    switch (id) {
      case EffectId.Thundercloud:
        this.thunderProc.duration = parseFloat(matches.duration ?? '0');
        break;
      case EffectId.Firestarter:
        this.fireProc.duration = parseFloat(matches.duration ?? '0');
        break;
      case EffectId.CircleOfPower:
        this.player.speedBuffs.circleOfPower = true;
        break;
    }
  }

  override onYouLoseEffect(id: string): void {
    switch (id) {
      case EffectId.Thundercloud:
        this.thunderProc.duration = 0;
        break;
      case EffectId.Firestarter:
        this.fireProc.duration = 0;
        break;
      case EffectId.CircleOfPower:
        this.player.speedBuffs.circleOfPower = false;
        break;
    }
  }

  override onJobDetailUpdate(jobDetail: JobDetail['BLM']): void {
    // FIXME: make it able to use after refactoring
    if (this.umbralStacks !== jobDetail.umbralStacks) {
      this.umbralStacks = jobDetail.umbralStacks;
      this.bars._updateMPTicker({
        mp: this.player.mp,
        maxMp: this.player.maxMp,
        umbralStacks: this.umbralStacks,
        inCombat: this.inCombat,
      });
    }
    const fouls = jobDetail.polyglot;
    for (let i = 0; i < 2; ++i) {
      if (fouls > i)
        this.xenoStacks[i]?.classList.add('active');
      else
        this.xenoStacks[i]?.classList.remove('active');
    }
    const hearts = jobDetail.umbralHearts;
    for (let i = 0; i < 3; ++i) {
      if (hearts > i)
        this.heartStacks[i]?.classList.add('active');
      else
        this.heartStacks[i]?.classList.remove('active');
    }

    const stacks = jobDetail.umbralStacks;
    const seconds = Math.ceil(jobDetail.umbralMilliseconds / 1000.0).toString();
    const p = this.umbralTimer.parentNode;
    if (!stacks) {
      this.umbralTimer.innerText = '';
      p.classList.remove('fire');
      p.classList.remove('ice');
    } else if (stacks > 0) {
      this.umbralTimer.innerText = seconds;
      p.classList.add('fire');
      p.classList.remove('ice');
    } else {
      this.umbralTimer.innerText = seconds;
      p.classList.remove('fire');
      p.classList.add('ice');
    }

    const xp = this.xenoTimer.parentNode;
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

  override reset(): void {
    this.thunderDot.duration = 0;
    this.thunderProc.duration = 0;
    this.fireProc.duration = 0;

    this.umbralStacks = 0;
  }
}
