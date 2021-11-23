import { JobDetail } from '../../../types/event';
import { Bars } from '../bars';
import { kAbility } from '../constants';
import { computeBackgroundColorFrom } from '../utils';

let resetFunc: ((bars: Bars) => void) = (_bars: Bars) => undefined;
let tid1: number;

export const setup = (bars: Bars): void => {
  const cartridgeBox = bars.addResourceBox({
    classList: ['gnb-color-cartridge'],
  });

  const noMercyBox = bars.addProcBox({
    id: 'gnb-procs-nomercy',
    fgColor: 'gnb-color-nomercy',
  });

  const bloodfestBox = bars.addProcBox({
    id: 'gnb-procs-bloodfest',
    fgColor: 'gnb-color-bloodfest',
  });

  bars.onStatChange('GNB', ({ gcdSkill }) => {
    gnashingFangBox.valuescale = gcdSkill;
    gnashingFangBox.threshold = gcdSkill * 3;
    noMercyBox.valuescale = gcdSkill;
    bloodfestBox.valuescale = gcdSkill;
    bloodfestBox.threshold = gcdSkill * 2 + 1;
  });
  // Combos
  const gnashingFangBox = bars.addProcBox({
    id: 'gnb-procs-gnashingfang',
    fgColor: 'gnb-color-gnashingfang',
  });
  const comboTimer = bars.addTimerBar({
    id: 'gnb-timers-combo',
    fgColor: 'combo-color',
  });
  const cartridgeComboTimer = bars.addTimerBar({
    id: 'gnb-timers-cartridgecombo',
    fgColor: 'gnb-color-gnashingfang',
  });

  bars.onUseAbility((id) => {
    switch (id) {
      case kAbility.NoMercy: {
        noMercyBox.duration = 20;
        noMercyBox.threshold = 1000;
        noMercyBox.fg = computeBackgroundColorFrom(noMercyBox, 'gnb-color-nomercy.active');
        tid1 = window.setTimeout(() => {
          noMercyBox.duration = 40;
          noMercyBox.threshold = bars.gcdSkill + 1;
          noMercyBox.fg = computeBackgroundColorFrom(noMercyBox, 'gnb-color-nomercy');
        }, 20000);
        break;
      }
      case kAbility.Bloodfest:
        bloodfestBox.duration = 90;
        break;
      case kAbility.GnashingFang:
        gnashingFangBox.duration = bars.player.getActionCooldown(30000, 'skill');
        cartridgeComboTimer.duration = 0;
        cartridgeComboTimer.duration = 15;
        break;
      case kAbility.SavageClaw:
        cartridgeComboTimer.duration = 0;
        cartridgeComboTimer.duration = 15;
        break;
      case kAbility.WickedTalon:
        cartridgeComboTimer.duration = 0;
        break;
    }
  });
  bars.onCombo((skill, combo) => {
    comboTimer.duration = 0;
    cartridgeComboTimer.duration = 0;
    if (combo.isFinalSkill)
      return;
    if (skill)
      comboTimer.duration = 15;
  });

  bars.onJobDetailUpdate('GNB', (jobDetail: JobDetail['GNB']) => {
    cartridgeBox.innerText = jobDetail.cartridges.toString();
    if (jobDetail.cartridges === 2)
      cartridgeBox.parentNode.classList.add('full');
    else
      cartridgeBox.parentNode.classList.remove('full');
  });

  resetFunc = (bars) => {
    noMercyBox.duration = 0;
    noMercyBox.threshold = bars.gcdSkill + 1;
    noMercyBox.fg = computeBackgroundColorFrom(noMercyBox, 'gnb-color-nomercy');
    bloodfestBox.duration = 0;
    gnashingFangBox.duration = 0;
    cartridgeComboTimer.duration = 0;
    comboTimer.duration = 0;
    clearTimeout(tid1);
  };
};

export const reset = (bars: Bars): void => {
  resetFunc(bars);
};
