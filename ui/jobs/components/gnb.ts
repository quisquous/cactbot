import TimerBar from '../../../resources/timerbar';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { ComboTracker } from '../combo_tracker';
import { kAbility } from '../constants';
import { computeBackgroundColorFrom } from '../utils';

import { BaseComponent, ComponentInterface } from './base';

export class GNBComponent extends BaseComponent {
  cartridgeBox: ResourceBox;
  noMercyBox: TimerBox;
  bloodfestBox: TimerBox;
  gnashingFangBox: TimerBox;
  comboTimer: TimerBar;
  cartridgeComboTimer: TimerBar;
  tid1 = 0;

  constructor(o: ComponentInterface) {
    super(o);
    this.cartridgeBox = this.bars.addResourceBox({
      classList: ['gnb-color-cartridge'],
    });

    this.noMercyBox = this.bars.addProcBox({
      id: 'gnb-procs-nomercy',
      fgColor: 'gnb-color-nomercy',
    });

    this.bloodfestBox = this.bars.addProcBox({
      id: 'gnb-procs-bloodfest',
      fgColor: 'gnb-color-bloodfest',
    });
    // Combos
    this.gnashingFangBox = this.bars.addProcBox({
      id: 'gnb-procs-gnashingfang',
      fgColor: 'gnb-color-gnashingfang',
    });
    this.comboTimer = this.bars.addTimerBar({
      id: 'gnb-timers-combo',
      fgColor: 'combo-color',
    });
    this.cartridgeComboTimer = this.bars.addTimerBar({
      id: 'gnb-timers-cartridgecombo',
      fgColor: 'gnb-color-gnashingfang',
    });
  }
  override onStatChange({ gcdSkill }: { gcdSkill: number }): void {
    this.gnashingFangBox.valuescale = gcdSkill;
    this.gnashingFangBox.threshold = gcdSkill * 3;
    this.noMercyBox.valuescale = gcdSkill;
    this.bloodfestBox.valuescale = gcdSkill;
    this.bloodfestBox.threshold = gcdSkill * 2 + 1;
  }

  override onUseAbility(id: string): void {
    switch (id) {
      case kAbility.NoMercy: {
        this.noMercyBox.duration = 20;
        this.noMercyBox.threshold = 1000;
        this.noMercyBox.fg = computeBackgroundColorFrom(this.noMercyBox, 'gnb-color-nomercy.active');
        this.tid1 = window.setTimeout(() => {
          this.noMercyBox.duration = 40;
          this.noMercyBox.threshold = this.player.gcdSkill + 1;
          this.noMercyBox.fg = computeBackgroundColorFrom(this.noMercyBox, 'gnb-color-nomercy');
        }, 20000);
        break;
      }
      case kAbility.Bloodfest:
        this.bloodfestBox.duration = 90;
        break;
      case kAbility.GnashingFang:
        this.gnashingFangBox.duration = this.bars.player.getActionCooldown(30000, 'skill');
        this.cartridgeComboTimer.duration = 0;
        this.cartridgeComboTimer.duration = this.comboDuration;
        break;
      case kAbility.SavageClaw:
        this.cartridgeComboTimer.duration = 0;
        this.cartridgeComboTimer.duration = this.comboDuration;
        break;
      case kAbility.WickedTalon:
        this.cartridgeComboTimer.duration = 0;
        break;
    }
  }
  override onCombo(skill: string, combo: ComboTracker): void {
    this.comboTimer.duration = 0;
    this.cartridgeComboTimer.duration = 0;
    if (combo.isFinalSkill)
      return;
    if (skill)
      this.comboTimer.duration = this.comboDuration;
  }

  override onJobDetailUpdate(jobDetail: JobDetail['GNB']): void {
    this.cartridgeBox.innerText = jobDetail.cartridges.toString();
    if (jobDetail.cartridges === 2)
      this.cartridgeBox.parentNode.classList.add('full');
    else
      this.cartridgeBox.parentNode.classList.remove('full');
  }

  override reset(): void {
    this.noMercyBox.duration = 0;
    this.noMercyBox.threshold = this.player.gcdSkill + 1;
    this.noMercyBox.fg = computeBackgroundColorFrom(this.noMercyBox, 'gnb-color-nomercy');
    this.bloodfestBox.duration = 0;
    this.gnashingFangBox.duration = 0;
    this.cartridgeComboTimer.duration = 0;
    this.comboTimer.duration = 0;
    window.clearTimeout(this.tid1);
  }
}
