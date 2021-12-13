import TimerBar from '../../../resources/timerbar';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { ComboTracker } from '../combo_tracker';
import { kAbility } from '../constants';
import { computeBackgroundColorFrom } from '../utils';

import { BaseComponent, ComponentInterface } from './base';

export class DRKComponent extends BaseComponent {
  bloodBox: ResourceBox;
  darksideBox: TimerBox;
  comboTimer: TimerBar;
  bloodWeapon: TimerBox;
  delirium: TimerBox;
  livingShadow: TimerBox;
  tid1 = 0;
  tid2 = 0;
  tid3 = 0;

  constructor(o: ComponentInterface) {
    super(o);
    this.bloodBox = this.bars.addResourceBox({
      classList: ['drk-color-blood'],
    });

    this.darksideBox = this.bars.addProcBox({
      fgColor: 'drk-color-darkside',
      threshold: 10,
    });

    this.comboTimer = this.bars.addTimerBar({
      id: 'drk-timers-combo',
      fgColor: 'combo-color',
    });

    this.bloodWeapon = this.bars.addProcBox({
      id: 'drk-procs-bloodweapon',
      fgColor: 'drk-color-bloodweapon',
    });

    this.delirium = this.bars.addProcBox({
      id: 'drk-procs-delirium',
      fgColor: 'drk-color-delirium',
    });

    this.livingShadow = this.bars.addProcBox({
      id: 'drk-procs-livingshadow',
      fgColor: 'drk-color-livingshadow',
    });
  }

  override onJobDetailUpdate(jobDetail: JobDetail['DRK']): void {
    const blood = jobDetail.blood;
    if (this.bloodBox.innerText !== blood.toString()) {
      this.bloodBox.innerText = blood.toString();
      const p = this.bloodBox.parentNode;
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

    const seconds = jobDetail.darksideMilliseconds / 1000.0;
    if (!this.darksideBox.duration || seconds > this.darksideBox.value)
      this.darksideBox.duration = seconds;
  }

  override onCombo(skill: string, combo: ComboTracker): void {
    this.comboTimer.duration = 0;
    if (combo.isFinalSkill)
      return;
    if (skill)
      this.comboTimer.duration = this.comboDuration;
  }

  override onUseAbility(id: string): void {
    switch (id) {
      case kAbility.BloodWeapon: {
        this.bloodWeapon.duration = 10;
        this.bloodWeapon.threshold = 10;
        this.bloodWeapon.fg = computeBackgroundColorFrom(
          this.bloodWeapon,
          'drk-color-bloodweapon.active',
        );
        this.tid1 = window.setTimeout(() => {
          this.bloodWeapon.duration = 50;
          this.bloodWeapon.threshold = this.player.gcdSkill * 2;
          this.bloodWeapon.fg = computeBackgroundColorFrom(
            this.bloodWeapon,
            'drk-color-bloodweapon',
          );
        }, 10000);
        break;
      }
      case kAbility.Delirium: {
        this.delirium.duration = 10.5;
        this.delirium.threshold = 20;
        this.delirium.fg = computeBackgroundColorFrom(this.delirium, 'drk-color-delirium.active');
        this.tid2 = window.setTimeout(() => {
          this.delirium.duration = 79.5;
          this.delirium.threshold = this.player.gcdSkill * 2;
          this.delirium.fg = computeBackgroundColorFrom(this.delirium, 'drk-color-delirium');
        }, 10000);
        break;
      }
      case kAbility.LivingShadow: {
        this.livingShadow.duration = 24;
        this.livingShadow.threshold = 24;
        this.livingShadow.fg = computeBackgroundColorFrom(
          this.livingShadow,
          'drk-color-livingshadow.active',
        );
        this.tid3 = window.setTimeout(() => {
          this.livingShadow.duration = 96;
          this.livingShadow.threshold = this.player.gcdSkill * 4;
          this.livingShadow.fg = computeBackgroundColorFrom(
            this.livingShadow,
            'drk-color-livingshadow',
          );
        }, 24000);
        break;
      }
    }
  }

  override reset(): void {
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
    window.clearTimeout(this.tid1);
    window.clearTimeout(this.tid2);
    window.clearTimeout(this.tid3);
  }
}
