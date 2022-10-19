import EffectId from '../../../resources/effect_id';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { kAbility } from '../constants';

import { BaseComponent, ComponentInterface } from './base';

export class WHMComponent extends BaseComponent {
  lilysecondBox: ResourceBox;
  diaBox: TimerBox;
  assizeBox: TimerBox;
  lucidBox: TimerBox;
  lilyStacks: HTMLDivElement[];
  bloodlilyStacks: HTMLDivElement[];

  constructor(o: ComponentInterface) {
    super(o);

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

    const lilyStacksConstainer = document.createElement('div');
    lilyStacksConstainer.id = 'whm-stacks-lily';
    stacksContainer.appendChild(lilyStacksConstainer);

    const bloodlilyStacksConstainer = document.createElement('div');
    bloodlilyStacksConstainer.id = 'whm-stacks-bloodlily';
    stacksContainer.appendChild(bloodlilyStacksConstainer);

    this.lilyStacks = [];
    this.bloodlilyStacks = [];

    for (let i = 0; i < 3; i++) {
      const lilyStack = document.createElement('div');
      const bloodlilyStack = document.createElement('div');
      lilyStacksConstainer.appendChild(lilyStack);
      bloodlilyStacksConstainer.appendChild(bloodlilyStack);
      this.lilyStacks.push(lilyStack);
      this.bloodlilyStacks.push(bloodlilyStack);
    }

    this.reset();
  }

  private _addActiveOnStacks(elements: HTMLDivElement[], stacks: number) {
    for (let i = 0; i < elements.length; i++)
      elements[i]?.classList.toggle('active', i < stacks);
  }

  override onJobDetailUpdate(jobDetail: JobDetail['WHM']): void {
    const lily = jobDetail.lilyStacks;
    // bars milliseconds is countup, so use floor instead of ceil.
    const lilysecond = Math.floor(jobDetail.lilyMilliseconds / 1000);
    if (this.ffxivRegion !== 'ko') {
      this.lilysecondBox.innerText = lily === 3 ? '' : (20 - lilysecond).toString();
      this.lilysecondBox.parentNode.classList.toggle(
        'full',
        (lily === 2 && 20 - lilysecond <= 5) || lily === 3,
      );
    } else {
      this.lilysecondBox.innerText = lily === 3 ? '' : (30 - lilysecond).toString();
      this.lilysecondBox.parentNode.classList.toggle(
        'full',
        (lily === 2 && 30 - lilysecond <= 5) || lily === 3,
      );
    }
    this._addActiveOnStacks(this.lilyStacks, jobDetail.lilyStacks);
    this._addActiveOnStacks(this.bloodlilyStacks, jobDetail.bloodlilyStacks);
  }

  override onUseAbility(id: string): void {
    switch (id) {
      case kAbility.Aero:
      case kAbility.Aero2:
        if (this.ffxivRegion !== 'ko')
          this.diaBox.duration = 30 + 1;
        else
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
