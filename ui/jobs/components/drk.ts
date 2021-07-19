import TimerBar from '../../../resources/timerbar';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { kAbility } from '../constants';
import { Bars } from '../jobs';
import { computeBackgroundColorFrom } from '../utils';

import { BaseComponent } from './base';

export default class DrkComponent extends BaseComponent {
  bloodBox: HTMLDivElement;
  darksideBox: TimerBox;
  comboTimer: TimerBar;
  bloodWeapon: TimerBox;
  delirium: TimerBox;
  livingShadow: TimerBox;
  tid1: number;
  tid2: number;
  tid3: number;
  constructor(bars: Bars) {
    super(bars);

    this.tid1 = 0;
    this.tid2 = 0;
    this.tid3 = 0;

    this.bloodBox = this.addResourceBox({
      classList: ['drk-color-blood'],
    });

    this.darksideBox = this.addProcBox({
      id: 'drk-darkside',
      fgColor: 'drk-color-darkside',
      threshold: 10,
    });

    this.comboTimer = this.addTimerBar({
      id: 'drk-timers-combo',
      fgColor: 'combo-color',
    });

    this.bloodWeapon = this.addProcBox({
      id: 'drk-procs-bloodweapon',
      fgColor: 'drk-color-bloodweapon',
    });

    this.delirium = this.addProcBox({
      id: 'drk-procs-delirium',
      fgColor: 'drk-color-delirium',
    });

    this.livingShadow = this.addProcBox({
      id: 'drk-procs-livingshadow',
      fgColor: 'drk-color-livingshadow',
    });
  }

  onCombo(skill: string): void {
    this.comboTimer.duration = 0;
    if (this.bars?.combo?.isFinalSkill)
      return;
    if (skill)
      this.comboTimer.duration = 15;
  }

  onJobDetailUpdate(jobDetail: JobDetail['DRK']): void {
    const blood = jobDetail.blood;
    if (this.bloodBox.innerText !== blood.toString()) {
      this.bloodBox.innerText = blood.toString();
      const p = this.bloodBox.parentNode as HTMLElement;
      if (blood < 50) {
        p.classList.add('low');
        p.classList.remove('mid');
      } else if (blood < 90) {
        p.classList.remove('low');
        p.classList.add('mid');
      } else {
        p.classList.remove('low');
        p.classList.remove('mid');
      }
    }

    const oldSeconds = this.darksideBox.duration ?? 0 - this.darksideBox.elapsed;
    const seconds = jobDetail.darksideMilliseconds / 1000.0;
    if (!this.darksideBox.duration || seconds > oldSeconds)
      this.darksideBox.duration = seconds;
  }

  onUseAbility(actionId: string): void {
    switch (actionId) {
    case kAbility.BloodWeapon:
      this.bloodWeapon.duration = 10;
      this.bloodWeapon.threshold = 10;
      this.bloodWeapon.fg = computeBackgroundColorFrom(this.bloodWeapon, 'drk-color-bloodweapon.active');
      this.tid1 = window.setTimeout(() => {
        this.bloodWeapon.duration = 50;
        this.bloodWeapon.threshold = this.player.gcdSkill * 2;
        this.bloodWeapon.fg = computeBackgroundColorFrom(this.bloodWeapon, 'drk-color-bloodweapon');
      }, 10000);
      break;

    case kAbility.Delirium:
      this.delirium.duration = 10.5;
      this.delirium.threshold = 20;
      this.delirium.fg = computeBackgroundColorFrom(this.delirium, 'drk-color-delirium.active');
      this.tid2 = window.setTimeout(() => {
        this.delirium.duration = 79.5;
        this.delirium.threshold = this.player.gcdSkill * 2;
        this.delirium.fg = computeBackgroundColorFrom(this.delirium, 'drk-color-delirium');
      }, 10000);
      break;

    case kAbility.LivingShadow:
      this.livingShadow.duration = 24;
      this.livingShadow.threshold = 24;
      this.livingShadow.fg = computeBackgroundColorFrom(this.livingShadow, 'drk-color-livingshadow.active');
      this.tid3 = window.setTimeout(() => {
        this.livingShadow.duration = 96;
        this.livingShadow.threshold = this.player.gcdSkill * 4;
        this.livingShadow.fg = computeBackgroundColorFrom(this.livingShadow, 'drk-color-livingshadow');
      }, 24000);
      break;

    default:
      break;
    }
  }

  reset(): void {
    this.comboTimer.duration = 0;
    this.bloodWeapon.duration = 0;
    this.bloodWeapon.threshold = this.player.gcdSkill * 2;
    this.bloodWeapon.fg = computeBackgroundColorFrom(this.bloodWeapon, 'drk-color-bloodweapon');
    this.delirium.duration = 0;
    this.delirium.threshold = this.player.gcdSkill * 2;
    this.delirium.fg = computeBackgroundColorFrom(this.delirium, 'drk-color-delirium');
    this.livingShadow.duration = 0;
    this.livingShadow.threshold = this.player.gcdSkill * 4;
    this.livingShadow.fg = computeBackgroundColorFrom(this.livingShadow, 'drk-color-livingshadow');
    this.darksideBox.duration = 0;
    clearTimeout(this.tid1);
    clearTimeout(this.tid2);
    clearTimeout(this.tid3);
  }
}
