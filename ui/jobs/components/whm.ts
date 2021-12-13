import EffectId from '../../../resources/effect_id';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { kAbility } from '../constants';

import { BaseComponent, ComponentInterface } from './base';

export class WHMComponent extends BaseComponent {
  lilyBox: ResourceBox;
  lilysecondBox: ResourceBox;
  diaBox: TimerBox;
  assizeBox: TimerBox;
  lucidBox: TimerBox;
    bloodlilyStacks: HTMLElement[] = [];

  constructor(o: ComponentInterface) {
    super(o);
  this.lilyBox = this.bars.addResourceBox({
    classList: ['whm-color-lily'],
  });
  this.lilysecondBox = this.bars.addResourceBox({
    classList: ['whm-color-lilysecond'],
  });

  this.diaBox = this.bars.addProcBox({
    id: 'whm-procs-dia',
    fgColor: 'whm-color-dia',
    notifyWhenExpired: true,
  });
  this.assizeBox = this.bars.addProcBox({
    id: 'whm-procs-assize',
    fgColor: 'whm-color-assize',
  });
  this.lucidBox = this.bars.addProcBox({
    id: 'whm-procs-lucid',
    fgColor: 'whm-color-lucid',
  });

    // BloodLily Gauge
    const stacksContainer = document.createElement('div');
    stacksContainer.id = 'whm-stacks';
    stacksContainer.classList.add('stacks');
    this.bars.addJobBarContainer().appendChild(stacksContainer);
    const bloodlilyContainer = document.createElement('div');
    bloodlilyContainer.id = 'whm-stacks-bloodlily';
    stacksContainer.appendChild(bloodlilyContainer);

    for (let i = 0; i < 3; ++i) {
      const d = document.createElement('div');
      bloodlilyContainer.appendChild(d);
      this.bloodlilyStacks.push(d);
    }
}

  override onJobDetailUpdate(jobDetail: JobDetail['WHM']): void {
    const lily = jobDetail.lilyStacks;
    // bars milliseconds is countup, so use floor instead of ceil.
    const lilysecond = Math.floor(jobDetail.lilyMilliseconds / 1000);

    this.lilyBox.innerText = lily.toString();
    if (lily === 3)
      this.lilysecondBox.innerText = '';
    else
      this.lilysecondBox.innerText = (30 - lilysecond).toString();

    const bloodlilys = jobDetail.bloodlilyStacks;
    for (let i = 0; i < 3; ++i) {
      if (bloodlilys > i)
        this.bloodlilyStacks[i]?.classList.add('active');
      else
        this.bloodlilyStacks[i]?.classList.remove('active');
    }

    const l = this.lilysecondBox.parentNode;
    if ((lily === 2 && 30 - lilysecond <= 5) || lily === 3)
      l.classList.add('full');
    else
      l.classList.remove('full');
  }

  override onUseAbility(id: string): void {
    switch (id) {
      case kAbility.Aero:
      case kAbility.Aero2:
        this.diaBox.duration = 18 + 1;
        break;
      case kAbility.Dia:
        this.diaBox.duration = 30;
        break;
      case kAbility.Assize:
        this.assizeBox.duration = 45;
        break;
      case kAbility.LucidDreaming:
        this.lucidBox.duration = 60;
        break;
    }
  }

  override onYouGainEffect(id: string): void {
    if (id === EffectId.PresenceOfMind)
      this.player.speedBuffs.presenceOfMind = true;
  }
  override onYouLoseEffect(id: string): void {
    if (id === EffectId.PresenceOfMind)
      this.player.speedBuffs.presenceOfMind = false;
  }

  override onStatChange({ gcdSpell }: { gcdSpell: number }): void {
    this.diaBox.valuescale = gcdSpell;
    this.diaBox.threshold = gcdSpell + 1;
    this.assizeBox.valuescale = gcdSpell;
    this.assizeBox.threshold = gcdSpell + 1;
    this.lucidBox.valuescale = gcdSpell;
    this.lucidBox.threshold = gcdSpell + 1;
  }

  override reset(): void {
    this.diaBox.duration = 0;
    this.assizeBox.duration = 0;
    this.lucidBox.duration = 0;
  }
}
