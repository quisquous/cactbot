import { JobDetail } from '../../../types/event';
import { Bars } from '../bar';
import { kAbility } from '../constants';
import { calcGCDFromStat, computeBackgroundColorFrom } from '../utils';

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
  bars.onUseAbility(kAbility.NoMercy, () => {
    noMercyBox.duration = '20';
    noMercyBox.threshold = '1000';
    noMercyBox.fg = computeBackgroundColorFrom(noMercyBox, 'gnb-color-nomercy.active');
    tid1 = window.setTimeout(() => {
      noMercyBox.duration = '40';
      noMercyBox.threshold = (bars.gcdSkill + 1).toString();
      noMercyBox.fg = computeBackgroundColorFrom(noMercyBox, 'gnb-color-nomercy');
    }, 20000);
  });

  const bloodfestBox = bars.addProcBox({
    id: 'gnb-procs-bloodfest',
    fgColor: 'gnb-color-bloodfest',
  });
  bars.onUseAbility(kAbility.Bloodfest, () => {
    bloodfestBox.duration = '90';
  });

  bars.onStatChange('GNB', () => {
    gnashingFangBox.valuescale = bars.gcdSkill.toString();
    gnashingFangBox.threshold = (bars.gcdSkill * 3).toString();
    noMercyBox.valuescale = bars.gcdSkill.toString();
    bloodfestBox.valuescale = bars.gcdSkill.toString();
    bloodfestBox.threshold = (bars.gcdSkill * 2 + 1).toString();
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
  bars.onUseAbility(kAbility.GnashingFang, () => {
    gnashingFangBox.duration = calcGCDFromStat(bars, bars.skillSpeed, 30000).toString();
    cartridgeComboTimer.duration = '0';
    cartridgeComboTimer.duration = '15';
  });
  bars.onUseAbility(kAbility.SavageClaw, () => {
    cartridgeComboTimer.duration = '0';
    cartridgeComboTimer.duration = '15';
  });
  bars.onUseAbility(kAbility.WickedTalon, () => {
    cartridgeComboTimer.duration = '0';
  });
  bars.onCombo((skill) => {
    comboTimer.duration = '0';
    cartridgeComboTimer.duration = '0';
    if (bars.combo.isFinalSkill)
      return;
    if (skill)
      comboTimer.duration = '15';
  });

  bars.onJobDetailUpdate((jobDetail: JobDetail['GNB']) => {
    cartridgeBox.innerText = jobDetail.cartridges.toString();
    if (jobDetail.cartridges === 2)
      cartridgeBox.parentNode.classList.add('full');
    else
      cartridgeBox.parentNode.classList.remove('full');
  });

  resetFunc = (bars) => {
    noMercyBox.duration = '0';
    noMercyBox.threshold = (bars.gcdSkill + 1).toString();
    noMercyBox.fg = computeBackgroundColorFrom(noMercyBox, 'gnb-color-nomercy');
    bloodfestBox.duration = '0';
    gnashingFangBox.duration = '0';
    cartridgeComboTimer.duration = '0';
    comboTimer.duration = '0';
    clearTimeout(tid1);
  };
};

export const reset = (bars: Bars): void => {
  resetFunc(bars);
};
