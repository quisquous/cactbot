import { kAbility } from '../constants';
import { computeBackgroundColorFrom } from '../utils';
import { BaseComponent } from './base';

export default class DrgComponent extends BaseComponent {
  constructor(bars) {
    super(bars);

    // Boxes
    this.highJumpBox = this.addProcBox({
      id: 'drg-procs-highjump',
      fgColor: 'drg-color-highjump',
    });

    this.disembowelBox = this.addProcBox({
      id: 'drg-procs-disembowel',
      fgColor: 'drg-color-disembowel',
      notifyWhenExpired: true,
    });

    this.lanceChargeBox = this.addProcBox({
      id: 'drg-procs-lancecharge',
      fgColor: 'drg-color-lancecharge',
      threshold: 20,
    });

    this.dragonSightBox = this.addProcBox({
      id: 'drg-procs-dragonsight',
      fgColor: 'drg-color-dragonsight',
      threshold: 20,
    });

    // Gauge
    this.blood = this.addResourceBox({
      classList: ['drg-color-blood'],
    });
    this.eyes = this.addResourceBox({
      classList: ['drg-color-eyes'],
    });

    this.tid1 = 0;
    this.tid2 = 0;
  }

  onCombo(skill) {
    if (skill === kAbility.Disembowel)
      this.disembowelBox.duration = 30 + 1;
  }

  onUseAbility(abilityId) {
    switch (abilityId) {
    case kAbility.HighJump:
    case kAbility.Jump:
      this.highJumpBox.duration = 30;
      break;

    case kAbility.LanceCharge:
      this.lanceChargeBox.duration = 20;
      this.lanceChargeBox.fg = computeBackgroundColorFrom(this.lanceChargeBox, 'drg-color-lancecharge.active');
      this.tid1 = window.setTimeout(() => {
        this.lanceChargeBox.duration = 70;
        this.lanceChargeBox.fg = computeBackgroundColorFrom(this.lanceChargeBox, 'drg-color-lancecharge');
      }, 20000);
      break;

    case kAbility.DragonSight:
      this.dragonSightBox.duration = 20;
      this.dragonSightBox.fg = computeBackgroundColorFrom(this.dragonSightBox, 'drg-color-dragonsight.active');
      this.tid2 = window.setTimeout(() => {
        this.dragonSightBox.duration = 100;
        this.dragonSightBox.fg = computeBackgroundColorFrom(this.dragonSightBox, 'drg-color-dragonsight');
      }, 20000);
      break;

    default:
      break;
    }
  }

  onJobDetailUpdate(jobDetail) {
    this.blood.parentNode.classList.remove('blood', 'life');
    if (jobDetail.bloodMilliseconds > 0) {
      this.blood.parentNode.classList.add('blood');
      this.blood.innerText = Math.ceil(jobDetail.bloodMilliseconds / 1000);
      if (jobDetail.bloodMilliseconds < 5000)
        this.blood.parentNode.classList.remove('blood');
    } else if (jobDetail.lifeMilliseconds > 0) {
      this.blood.parentNode.classList.add('life');
      this.blood.innerText = Math.ceil(jobDetail.lifeMilliseconds / 1000);
    } else {
      this.blood.innerText = '';
    }

    this.eyes.parentNode.classList.remove('zero', 'one', 'two');
    if (jobDetail.lifeMilliseconds > 0 || jobDetail.bloodMilliseconds > 0) {
      this.eyes.innerText = jobDetail.eyesAmount;
      if (jobDetail.eyesAmount === 0)
        this.eyes.parentNode.classList.add('zero');
      else if (jobDetail.eyesAmount === 1)
        this.eyes.parentNode.classList.add('one');
      else if (jobDetail.eyesAmount === 2)
        this.eyes.parentNode.classList.add('two');
    } else {
      this.eyes.innerText = '';
    }
  }

  onStatChange(stats) {
    this.disembowelBox.valuescale = stats.gcdSkill;
    this.disembowelBox.threshold = stats.gcdSkill * 5;
    this.highJumpBox.valuescale = stats.gcdSkill;
    this.highJumpBox.threshold = stats.gcdSkill + 1;
  }

  reset() {
    this.highJumpBox.duration = 0;
    this.disembowelBox.duration = 0;
    this.lanceChargeBox.duration = 0;
    this.lanceChargeBox.fg = computeBackgroundColorFrom(this.lanceChargeBox, 'drg-color-lancecharge');
    this.dragonSightBox.duration = 0;
    this.dragonSightBox.fg = computeBackgroundColorFrom(this.dragonSightBox, 'drg-color-dragonsight');
    clearTimeout(this.tid1);
    clearTimeout(this.tid2);
  }
}
