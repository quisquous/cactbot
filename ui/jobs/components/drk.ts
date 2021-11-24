import { JobDetail } from '../../../types/event';
import { Bars } from '../bars';
import { kAbility } from '../constants';
import { Player } from '../player';
import { computeBackgroundColorFrom } from '../utils';

let resetFunc: ((bars: Bars, player: Player) => void) = (_bars: Bars) => undefined;
let tid1: number;
let tid2: number;
let tid3: number;

export const setup = (bars: Bars, player: Player): void => {
  const bloodBox = bars.addResourceBox({
    classList: ['drk-color-blood'],
  });

  const darksideBox = bars.addProcBox({
    fgColor: 'drk-color-darkside',
    threshold: 10,
  });

  player.onJobDetailUpdate('DRK', (jobDetail: JobDetail['DRK']) => {
    const blood = jobDetail.blood;
    if (bloodBox.innerText !== blood.toString()) {
      bloodBox.innerText = blood.toString();
      const p = bloodBox.parentNode;
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
    if (!darksideBox.duration || seconds > darksideBox.value)
      darksideBox.duration = seconds;
  });

  const comboTimer = bars.addTimerBar({
    id: 'drk-timers-combo',
    fgColor: 'combo-color',
  });

  player.onCombo((skill, combo) => {
    comboTimer.duration = 0;
    if (combo.isFinalSkill)
      return;
    if (skill)
      comboTimer.duration = 15;
  });

  const bloodWeapon = bars.addProcBox({
    id: 'drk-procs-bloodweapon',
    fgColor: 'drk-color-bloodweapon',
  });

  const delirium = bars.addProcBox({
    id: 'drk-procs-delirium',
    fgColor: 'drk-color-delirium',
  });

  const livingShadow = bars.addProcBox({
    id: 'drk-procs-livingshadow',
    fgColor: 'drk-color-livingshadow',
  });

  player.onUseAbility((id) => {
    switch (id) {
      case kAbility.BloodWeapon: {
        bloodWeapon.duration = 10;
        bloodWeapon.threshold = 10;
        bloodWeapon.fg = computeBackgroundColorFrom(bloodWeapon, 'drk-color-bloodweapon.active');
        tid1 = window.setTimeout(() => {
          bloodWeapon.duration = 50;
          bloodWeapon.threshold = player.gcdSkill * 2;
          bloodWeapon.fg = computeBackgroundColorFrom(bloodWeapon, 'drk-color-bloodweapon');
        }, 10000);
        break;
      }
      case kAbility.Delirium: {
        delirium.duration = 10.5;
        delirium.threshold = 20;
        delirium.fg = computeBackgroundColorFrom(delirium, 'drk-color-delirium.active');
        tid2 = window.setTimeout(() => {
          delirium.duration = 79.5;
          delirium.threshold = player.gcdSkill * 2;
          delirium.fg = computeBackgroundColorFrom(delirium, 'drk-color-delirium');
        }, 10000);
        break;
      }
      case kAbility.LivingShadow: {
        livingShadow.duration = 24;
        livingShadow.threshold = 24;
        livingShadow.fg = computeBackgroundColorFrom(livingShadow, 'drk-color-livingshadow.active');
        tid3 = window.setTimeout(() => {
          livingShadow.duration = 96;
          livingShadow.threshold = player.gcdSkill * 4;
          livingShadow.fg = computeBackgroundColorFrom(livingShadow, 'drk-color-livingshadow');
        }, 24000);
        break;
      }
    }
  });

  resetFunc = (bars: Bars, player: Player) => {
    comboTimer.duration = 0;
    bloodWeapon.duration = 0;
    bloodWeapon.threshold = player.gcdSkill * 2;
    bloodWeapon.fg = computeBackgroundColorFrom(bloodWeapon, 'drk-color-bloodweapon');
    delirium.duration = 0;
    delirium.threshold = player.gcdSkill * 2;
    delirium.fg = computeBackgroundColorFrom(delirium, 'drk-color-delirium');
    livingShadow.duration = 0;
    livingShadow.threshold = player.gcdSkill * 4;
    livingShadow.fg = computeBackgroundColorFrom(livingShadow, 'drk-color-livingshadow');
    darksideBox.duration = 0;
    clearTimeout(tid1);
    clearTimeout(tid2);
    clearTimeout(tid3);
  };
};

export const reset = (bars: Bars, player: Player): void => {
  resetFunc(bars, player);
};
