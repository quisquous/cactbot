import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { kAbility } from '../constants';
import { computeBackgroundColorFrom } from '../utils';

import { BaseComponent, ComponentInterface } from './base';

export class DRGComponent extends BaseComponent {
  highJumpBox: TimerBox;
  disembowelBox: TimerBox;
  lanceChargeBox: TimerBox;
  dragonSightBox: TimerBox;
  blood: ResourceBox;
  firstmindsFocus: ResourceBox;
  tid1 = 0;
  tid2 = 0;

  constructor(o: ComponentInterface) {
    super(o);

    // Boxes
    this.highJumpBox = this.bars.addProcBox({
      id: 'drg-procs-highjump',
      fgColor: 'drg-color-highjump',
    });

    this.disembowelBox = this.bars.addProcBox({
      id: 'drg-procs-disembowel',
      fgColor: 'drg-color-disembowel',
      notifyWhenExpired: true,
    });

    this.lanceChargeBox = this.bars.addProcBox({
      id: 'drg-procs-lancecharge',
      fgColor: 'drg-color-lancecharge',
      threshold: 20,
    });

    this.dragonSightBox = this.bars.addProcBox({
      id: 'drg-procs-dragonsight',
      fgColor: 'drg-color-dragonsight',
      threshold: 20,
    });

    // Gauge
    this.blood = this.bars.addResourceBox({
      classList: ['drg-color-blood'],
    });
    this.firstmindsFocus = this.bars.addResourceBox({
      classList: ['drg-color-firstmindsfocus'],
    });

    this.reset();
  }
  override onCombo(skill: string): void {
    // Both Disembowel and SonicThrust apply PowerSurge for 30s,
    // but Disembowel will lock the buff duration until fully act.
    if (skill === kAbility.Disembowel)
      this.disembowelBox.duration = 30 + 1;
    if (skill === kAbility.SonicThrust)
      this.disembowelBox.duration = 30;
  }

  override onUseAbility(id: string): void {
    switch (id) {
      case kAbility.HighJump:
      case kAbility.Jump:
        this.highJumpBox.duration = 30;
        break;
      case kAbility.LanceCharge: {
        this.lanceChargeBox.duration = 20;
        this.lanceChargeBox.fg = computeBackgroundColorFrom(this.lanceChargeBox, 'drg-color-lancecharge.active');
        this.tid1 = window.setTimeout(() => {
          this.lanceChargeBox.duration = 40;
          this.lanceChargeBox.fg = computeBackgroundColorFrom(this.lanceChargeBox, 'drg-color-lancecharge');
        }, 20000);
        break;
      }
      case kAbility.DragonSight: {
        this.dragonSightBox.duration = 20;
        this.dragonSightBox.fg = computeBackgroundColorFrom(this.dragonSightBox, 'drg-color-dragonsight.active');
        this.tid2 = window.setTimeout(() => {
          this.dragonSightBox.duration = 100;
          this.dragonSightBox.fg = computeBackgroundColorFrom(this.dragonSightBox, 'drg-color-dragonsight');
        }, 20000);
        break;
      }
    }
  }

  override onStatChange({ gcdSkill }: { gcdSkill: number }): void {
    this.disembowelBox.valuescale = gcdSkill;
    this.disembowelBox.threshold = gcdSkill * 5;
    this.highJumpBox.valuescale = gcdSkill;
    this.highJumpBox.threshold = gcdSkill + 1;
  }

  override onJobDetailUpdate(jobDetail: JobDetail['DRG']): void {
    this.blood.parentNode.classList.remove('zero', 'one', 'two');
    this.blood.parentNode.classList.toggle('life', jobDetail.lifeMilliseconds > 0);
    if (jobDetail.lifeMilliseconds > 0) {
      this.blood.innerText = Math.ceil(jobDetail.lifeMilliseconds / 1000).toString();
    } else {
      this.blood.innerText = jobDetail.eyesAmount.toString();
      if (jobDetail.eyesAmount === 0)
        this.blood.parentNode.classList.add('zero');
      else if (jobDetail.eyesAmount === 1)
        this.blood.parentNode.classList.add('one');
      else if (jobDetail.eyesAmount === 2)
        this.blood.parentNode.classList.add('two');
    }

    this.firstmindsFocus.innerText = jobDetail.firstmindsFocus.toString();
  }

  override reset(): void {
    this.highJumpBox.duration = 0;
    this.disembowelBox.duration = 0;
    this.lanceChargeBox.duration = 0;
    this.lanceChargeBox.fg = computeBackgroundColorFrom(this.lanceChargeBox, 'drg-color-lancecharge');
    this.dragonSightBox.duration = 0;
    this.dragonSightBox.fg = computeBackgroundColorFrom(this.dragonSightBox, 'drg-color-dragonsight');
    window.clearTimeout(this.tid1);
    window.clearTimeout(this.tid2);
  }
}
