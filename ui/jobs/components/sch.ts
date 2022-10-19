import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { kAbility } from '../constants';

import { BaseComponent, ComponentInterface } from './base';

export class SCHComponent extends BaseComponent {
  aetherflowStackBox: ResourceBox;
  fairyGaugeBox: ResourceBox;
  bioBox: TimerBox;
  aetherflowBox: TimerBox;
  lucidBox: TimerBox;

  constructor(o: ComponentInterface) {
    super(o);
    this.aetherflowStackBox = this.bars.addResourceBox({
      classList: ['sch-color-aetherflow'],
    });

    this.fairyGaugeBox = this.bars.addResourceBox({
      classList: ['sch-color-fairygauge'],
    });

    this.bioBox = this.bars.addProcBox({
      id: 'sch-procs-bio',
      fgColor: 'sch-color-bio',
      notifyWhenExpired: true,
    });

    this.aetherflowBox = this.bars.addProcBox({
      id: 'sch-procs-aetherflow',
      fgColor: 'sch-color-aetherflow',
    });

    this.lucidBox = this.bars.addProcBox({
      id: 'sch-procs-luciddreaming',
      fgColor: 'sch-color-lucid',
    });

    this.reset();
  }

  override onJobDetailUpdate(jobDetail: JobDetail['SCH']): void {
    const aetherflow = jobDetail.aetherflowStacks;
    const fairygauge = jobDetail.fairyGauge;
    const milli = Math.ceil(jobDetail.fairyMilliseconds / 1000);
    this.aetherflowStackBox.innerText = aetherflow.toString();
    this.fairyGaugeBox.innerText = fairygauge.toString();
    const f = this.fairyGaugeBox.parentNode;
    if (jobDetail.fairyMilliseconds !== 0) {
      f.classList.add('bright');
      this.fairyGaugeBox.innerText = milli.toString();
    } else {
      f.classList.remove('bright');
      this.fairyGaugeBox.innerText = fairygauge.toString();
    }

    // dynamically annouce user depends on their aetherflow stacks right now
    this.aetherflowBox.threshold = this.player.gcdSpell * (aetherflow || 1) + 1;

    const p = this.aetherflowStackBox.parentNode;
    const s = this.aetherflowBox.duration ?? 0 - this.aetherflowBox.elapsed;
    if (aetherflow * 5 >= s) {
      // turn red when stacks are too much before AF ready
      p.classList.add('too-much-stacks');
    } else {
      p.classList.remove('too-much-stacks');
    }
  }

  override onUseAbility(id: string): void {
    switch (id) {
      case kAbility.Bio:
      case kAbility.Bio2:
      case kAbility.Biolysis:
        this.bioBox.duration = 30;
        break;
      case kAbility.Aetherflow:
        this.aetherflowBox.duration = 60;
        this.aetherflowStackBox.parentNode.classList.remove('too-much-stacks');
        break;
      case kAbility.LucidDreaming:
        this.lucidBox.duration = 60;
        break;
    }
  }

  override onStatChange({ gcdSpell }: { gcdSpell: number }): void {
    this.bioBox.valuescale = gcdSpell;
    this.bioBox.threshold = gcdSpell + 1;
    this.aetherflowBox.valuescale = gcdSpell;
    this.lucidBox.valuescale = gcdSpell;
    this.lucidBox.threshold = gcdSpell + 1;
  }

  override reset(): void {
    this.bioBox.duration = 0;
    this.aetherflowBox.duration = 0;
    this.lucidBox.duration = 0;
  }
}
