import EffectId from '../../../resources/effect_id';
import TimerBar from '../../../resources/timerbar';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { kAbility } from '../constants';
import { PartialFieldMatches } from '../event_emitter';

import { BaseComponent, ComponentInterface } from './base';

export class SGEComponent extends BaseComponent {
  adderTimer: TimerBar;
  addersgallStacks: HTMLDivElement[];
  adderstingStacks: HTMLDivElement[];
  eukrasianDosis: TimerBox;
  rhizomata: TimerBox;
  lucidDream: TimerBox;

  constructor(o: ComponentInterface) {
    super(o);

    this.adderTimer = this.bars.addTimerBar({
      id: 'sge-timer-addersgall',
      fgColor: 'sge-color-adder',
    });
    this.adderTimer.toward = 'right';
    this.adderTimer.stylefill = 'fill';

    // addersgall and addersting stacks
    const stacksContainer = document.createElement('div');
    stacksContainer.id = 'sge-stacks';
    stacksContainer.classList.add('stacks');
    this.bars.addJobBarContainer().appendChild(stacksContainer);

    const addersgallStacksConstainer = document.createElement('div');
    addersgallStacksConstainer.id = 'sge-stacks-addersgall';
    stacksContainer.appendChild(addersgallStacksConstainer);

    const adderstingStacksConstainer = document.createElement('div');
    adderstingStacksConstainer.id = 'sge-stacks-addersting';
    stacksContainer.appendChild(adderstingStacksConstainer);

    this.addersgallStacks = [];
    this.adderstingStacks = [];

    for (let i = 0; i < 3; i++) {
      const addersgallStack = document.createElement('div');
      const adderstingStack = document.createElement('div');
      addersgallStacksConstainer.appendChild(addersgallStack);
      adderstingStacksConstainer.appendChild(adderstingStack);
      this.addersgallStacks.push(addersgallStack);
      this.adderstingStacks.push(adderstingStack);
    }

    this.eukrasianDosis = this.bars.addProcBox({
      id: 'sge-proc-dosis',
      fgColor: 'sge-color-dosis',
      notifyWhenExpired: true,
    });

    this.rhizomata = this.bars.addProcBox({
      id: 'sge-proc-rhizomata',
      fgColor: 'sge-color-rhizomata',
    });

    this.lucidDream = this.bars.addProcBox({
      id: 'sge-proc-lucid',
      fgColor: 'sge-color-lucid',
    });

    this.reset();
  }

  private _addActiveOnStacks(elements: HTMLDivElement[], stacks: number) {
    for (let i = 0; i < elements.length; i++)
      elements[i]?.classList.toggle('active', i < stacks);
  }

  override onUseAbility(id: string): void {
    if (id === kAbility.LucidDreaming)
      this.lucidDream.duration = 60;
    else if (id === kAbility.Rhizomata)
      this.rhizomata.duration = 90;
  }

  override onMobGainsEffectFromYou(id: string, matches: PartialFieldMatches<'GainsEffect'>): void {
    switch (id) {
      case EffectId.EukrasianDosis:
      case EffectId.EukrasianDosisIi:
      case EffectId.EukrasianDosisIii:
        this.eukrasianDosis.duration = parseInt(matches.duration ?? '0', 10);
        break;
    }
  }

  override onJobDetailUpdate(jobDetail: JobDetail['SGE']): void {
    const adder = jobDetail.addersgall;
    this._addActiveOnStacks(this.addersgallStacks, adder);

    this._addActiveOnStacks(this.adderstingStacks, jobDetail.addersting);

    const adderMs = jobDetail.addersgallMilliseconds;
    if (adderMs === 0 && adder === 3)
      this.adderTimer.duration = 0;
    if (Math.abs(this.adderTimer.elapsed - adderMs / 1000) > 0) {
      this.adderTimer.duration = 20;
      this.adderTimer.elapsed = adderMs / 1000;
    }
  }

  override onStatChange({ gcdSpell }: { gcdSpell: number }): void {
    this.eukrasianDosis.valuescale = gcdSpell;
    this.eukrasianDosis.threshold = gcdSpell + 1;
    this.lucidDream.valuescale = gcdSpell;
    this.lucidDream.threshold = gcdSpell + 1;
  }

  override reset(): void {
    this.adderTimer.duration = 0;
    this.eukrasianDosis.duration = 0;
  }
}
