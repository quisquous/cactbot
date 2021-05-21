import { kAbility } from '../constants';
import { computeBackgroundColorFrom } from '../utils.js';

let resetFunc = null;
let tid1;
let tid2;
let tid3;

export function setup(bars) {
  const bloodBox = bars.addResourceBox({
    classList: ['drk-color-blood'],
  });

  const darksideBox = bars.addProcBox({
    fgColor: 'drk-color-darkside',
    threshold: 10,
  });

  bars.onJobDetailUpdate((jobDetail) => {
    const blood = jobDetail.blood;
    if (bloodBox.innerText === blood)
      return;
    bloodBox.innerText = blood;
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

    const oldSeconds = parseFloat(darksideBox.duration) - parseFloat(darksideBox.elapsed);
    const seconds = jobDetail.darksideMilliseconds / 1000.0;
    if (!darksideBox.duration || seconds > oldSeconds) {
      darksideBox.duration = 0;
      darksideBox.duration = seconds;
    }
  });

  const comboTimer = bars.addTimerBar({
    id: 'drk-timers-combo',
    fgColor: 'combo-color',
  });

  bars.onCombo((skill) => {
    comboTimer.duration = 0;
    if (bars.combo.isFinalSkill)
      return;
    if (skill)
      comboTimer.duration = 15;
  });

  const bloodWeapon = bars.addProcBox({
    id: 'drk-procs-bloodweapon',
    fgColor: 'drk-color-bloodweapon',
  });
  bars.onUseAbility(kAbility.BloodWeapon, () => {
    bloodWeapon.duration = 0;
    bloodWeapon.duration = 10;
    bloodWeapon.threshold = 10;
    bloodWeapon.fg = computeBackgroundColorFrom(bloodWeapon, 'drk-color-bloodweapon.active');
    tid1 = setTimeout(() => {
      bloodWeapon.duration = 50;
      bloodWeapon.threshold = bars.gcdSkill * 2;
      bloodWeapon.fg = computeBackgroundColorFrom(bloodWeapon, 'drk-color-bloodweapon');
    }, 10000);
  });

  const delirium = bars.addProcBox({
    id: 'drk-procs-delirium',
    fgColor: 'drk-color-delirium',
  });
  bars.onUseAbility(kAbility.Delirium, () => {
    delirium.duration = 0;
    delirium.duration = 10 + 0.5;
    delirium.threshold = 20;
    delirium.fg = computeBackgroundColorFrom(delirium, 'drk-color-delirium.active');
    tid2 = setTimeout(() => {
      delirium.duration = 80 - 0.5;
      delirium.threshold = bars.gcdSkill * 2;
      delirium.fg = computeBackgroundColorFrom(delirium, 'drk-color-delirium');
    }, 10000);
  });

  const livingShadow = bars.addProcBox({
    id: 'drk-procs-livingshadow',
    fgColor: 'drk-color-livingshadow',
  });
  bars.onUseAbility(kAbility.LivingShadow, () => {
    livingShadow.duration = 0;
    livingShadow.duration = 24;
    livingShadow.threshold = 24;
    livingShadow.fg = computeBackgroundColorFrom(livingShadow, 'drk-color-livingshadow.active');
    tid3 = setTimeout(() => {
      livingShadow.duration = 96;
      livingShadow.threshold = bars.gcdSkill * 4;
      livingShadow.fg = computeBackgroundColorFrom(livingShadow, 'drk-color-livingshadow');
    }, 24000);
  });

  resetFunc = (bars) => {
    comboTimer.duration = 0;
    bloodWeapon.duration = 0;
    bloodWeapon.threshold = bars.gcdSkill * 2;
    bloodWeapon.fg = computeBackgroundColorFrom(bloodWeapon, 'drk-color-bloodweapon');
    delirium.duration = 0;
    delirium.threshold = bars.gcdSkill * 2;
    delirium.fg = computeBackgroundColorFrom(delirium, 'drk-color-delirium');
    livingShadow.duration = 0;
    livingShadow.threshold = bars.gcdSkill * 4;
    livingShadow.fg = computeBackgroundColorFrom(livingShadow, 'drk-color-livingshadow');
    darksideBox.duration = 0;
    clearTimeout(tid1);
    clearTimeout(tid2);
    clearTimeout(tid3);
  };
}

export function reset(bars) {
  if (resetFunc)
    resetFunc(bars);
}
