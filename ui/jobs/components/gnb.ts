import TimerBar from '../../../resources/timerbar';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { kAbility } from '../constants';
import { Bars } from '../jobs';
import { computeBackgroundColorFrom } from '../utils';

import { BaseComponent, Stats } from './base';


export default class GnbComponent extends BaseComponent {
  cartridgeBox: HTMLDivElement;
  noMercyBox: TimerBox;
  bloodfestBox: TimerBox;
  gnashingFangBox: TimerBox;
  comboTimer: TimerBar;
  cartridgeComboTimer: TimerBar;
  noMercyTimer: number;

  constructor(bars: Bars) {
    super(bars);

    this.noMercyTimer = 0;

    this.cartridgeBox = this.addResourceBox({
      classList: ['gnb-color-cartridge'],
    });

    this.noMercyBox = this.addProcBox({
      id: 'gnb-procs-nomercy',
      fgColor: 'gnb-color-nomercy',
    });

    this.bloodfestBox = this.addProcBox({
      id: 'gnb-procs-bloodfest',
      fgColor: 'gnb-color-bloodfest',
    });

    // Combos
    this.gnashingFangBox = this.addProcBox({
      id: 'gnb-procs-gnashingfang',
      fgColor: 'gnb-color-gnashingfang',
    });

    this.comboTimer = this.addTimerBar({
      id: 'gnb-timers-combo',
      fgColor: 'combo-color',
    });

    this.cartridgeComboTimer = this.addTimerBar({
      id: 'gnb-timers-cartridgecombo',
      fgColor: 'gnb-color-gnashingfang',
    });
  }

  onUseAbility(actionId: string):void {
    switch (actionId) {
    case kAbility.NoMercy:
      this.noMercyBox.duration = 20;
      this.noMercyBox.threshold = 1000;
      this.noMercyBox.fg = computeBackgroundColorFrom(this.noMercyBox, 'gnb-color-nomercy.active');
      this.noMercyTimer = window.setTimeout(() => {
        this.noMercyBox.duration = 40;
        this.noMercyBox.threshold = this.player.gcdSkill + 1;
        this.noMercyBox.fg = computeBackgroundColorFrom(this.noMercyBox, 'gnb-color-nomercy');
      }, 20000);
      break;

    case kAbility.Bloodfest:
      this.bloodfestBox.duration = 90;
      break;

    case kAbility.GnashingFang:
      this.gnashingFangBox.duration = this.player.getActionCooldown(30000, 'skill');
      this.cartridgeComboTimer.duration = 0;
      this.cartridgeComboTimer.duration = 15;
      break;

    case kAbility.SavageClaw:
      this.cartridgeComboTimer.duration = 0;
      this.cartridgeComboTimer.duration = 15;
      break;

    case kAbility.WickedTalon:
      this.cartridgeComboTimer.duration = 0;
      break;

    default:
      break;
    }
  }

  onCombo(skill: string):void {
    this.comboTimer.duration = 0;
    this.cartridgeComboTimer.duration = 0;
    if (this.bars?.combo?.isFinalSkill)
      return;
    if (skill)
      this.comboTimer.duration = 15;
  }

  onJobDetailUpdate(jobDetail: JobDetail['GNB']):void {
    this.cartridgeBox.innerText = jobDetail.cartridges.toString();
    const parent = this.cartridgeBox.parentNode as HTMLElement;
    if (jobDetail.cartridges === 2)
      parent.classList.add('full');
    else
      parent.classList.remove('full');
  }

  onStatChange(stat: Stats): void {
    this.gnashingFangBox.valuescale = stat.gcdSkill;
    this.gnashingFangBox.threshold = stat.gcdSkill * 3;
    this.noMercyBox.valuescale = stat.gcdSkill;
    this.bloodfestBox.valuescale = this.player.gcdSkill;
    this.bloodfestBox.threshold = stat.gcdSkill * 2 + 1;
  }

  reset(): void {
    this.noMercyBox.duration = 0;
    this.noMercyBox.threshold = this.player.gcdSkill + 1;
    this.noMercyBox.fg = computeBackgroundColorFrom(this.noMercyBox, 'gnb-color-nomercy');
    this.bloodfestBox.duration = 0;
    this.gnashingFangBox.duration = 0;
    this.cartridgeComboTimer.duration = 0;
    this.comboTimer.duration = 0;
    clearTimeout(this.noMercyTimer);
  }
}
