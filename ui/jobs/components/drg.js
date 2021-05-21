import { kAbility } from '../constants';
import { computeBackgroundColorFrom } from '../utils';

let resetFunc = null;
let tid1;
let tid2;

export function setup(bars) {
  // Boxes
  const highJumpBox = bars.addProcBox({
    id: 'drg-procs-highjump',
    fgColor: 'drg-color-highjump',
  });

  bars.onUseAbility([
    kAbility.HighJump,
    kAbility.Jump,
  ], () => {
    highJumpBox.duration = 0;
    highJumpBox.duration = 30;
  });

  const disembowelBox = bars.addProcBox({
    id: 'drg-procs-disembowel',
    fgColor: 'drg-color-disembowel',
  });
  bars.onCombo((skill) => {
    if (skill === kAbility.Disembowel) {
      disembowelBox.duration = 0;
      disembowelBox.duration = 30 + 1;
    }
  });
  const lanceChargeBox = bars.addProcBox({
    id: 'drg-procs-lancecharge',
    fgColor: 'drg-color-lancecharge',
    threshold: 20,
  });
  bars.onUseAbility(kAbility.LanceCharge, () => {
    lanceChargeBox.duration = 0;
    lanceChargeBox.duration = 20;
    lanceChargeBox.fg = computeBackgroundColorFrom(lanceChargeBox, 'drg-color-lancecharge.active');
    tid1 = setTimeout(() => {
      lanceChargeBox.duration = 70;
      lanceChargeBox.fg = computeBackgroundColorFrom(lanceChargeBox, 'drg-color-lancecharge');
    }, 20000);
  });
  const dragonSightBox = bars.addProcBox({
    id: 'drg-procs-dragonsight',
    fgColor: 'drg-color-dragonsight',
    threshold: 20,
  });
  bars.onUseAbility(kAbility.DragonSight, () => {
    dragonSightBox.duration = 0;
    dragonSightBox.duration = 20;
    dragonSightBox.fg = computeBackgroundColorFrom(dragonSightBox, 'drg-color-dragonsight.active');
    tid2 = setTimeout(() => {
      dragonSightBox.duration = 100;
      dragonSightBox.fg = computeBackgroundColorFrom(dragonSightBox, 'drg-color-dragonsight');
    }, 20000);
  });
  bars.onStatChange('DRG', () => {
    disembowelBox.valuescale = bars.gcdSkill;
    disembowelBox.threshold = bars.gcdSkill * 5;
    highJumpBox.valuescale = bars.gcdSkill;
    highJumpBox.threshold = bars.gcdSkill + 1;
  });

  // Gauge
  const blood = bars.addResourceBox({
    classList: ['drg-color-blood'],
  });
  const eyes = bars.addResourceBox({
    classList: ['drg-color-eyes'],
  });
  bars.onJobDetailUpdate((jobDetail) => {
    blood.parentNode.classList.remove('blood', 'life');
    if (jobDetail.bloodMilliseconds > 0) {
      blood.parentNode.classList.add('blood');
      blood.innerText = Math.ceil(jobDetail.bloodMilliseconds / 1000);
      if (jobDetail.bloodMilliseconds < 5000)
        blood.parentNode.classList.remove('blood');
    } else if (jobDetail.lifeMilliseconds > 0) {
      blood.parentNode.classList.add('life');
      blood.innerText = Math.ceil(jobDetail.lifeMilliseconds / 1000);
    } else {
      blood.innerText = '';
    }

    eyes.parentNode.classList.remove('zero', 'one', 'two');
    if (jobDetail.lifeMilliseconds > 0 || jobDetail.bloodMilliseconds > 0) {
      eyes.innerText = jobDetail.eyesAmount;
      if (jobDetail.eyesAmount === 0)
        eyes.parentNode.classList.add('zero');
      else if (jobDetail.eyesAmount === 1)
        eyes.parentNode.classList.add('one');
      else if (jobDetail.eyesAmount === 2)
        eyes.parentNode.classList.add('two');
    } else {
      eyes.innerText = '';
    }
  });

  resetFunc = (bars) => {
    highJumpBox.duration = 0;
    disembowelBox.duration = 0;
    lanceChargeBox.duration = 0;
    lanceChargeBox.fg = computeBackgroundColorFrom(lanceChargeBox, 'drg-color-lancecharge');
    dragonSightBox.duration = 0;
    dragonSightBox.fg = computeBackgroundColorFrom(dragonSightBox, 'drg-color-dragonsight');
    clearTimeout(tid1);
    clearTimeout(tid2);
  };
}

export function reset(bars) {
  if (resetFunc)
    resetFunc(bars);
}
