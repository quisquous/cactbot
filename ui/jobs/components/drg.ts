import { JobDetail } from '../../../types/event';
import { kAbility } from '../constants';
import { Bars } from '../jobs';
import { computeBackgroundColorFrom } from '../utils';

let resetFunc: (bars: Bars) => void;

export const setup = (bars: Bars): void => {
  let tid1 = 0;
  let tid2 = 0;

  // Boxes
  const highJumpBox = bars.addProcBox({
    id: 'drg-procs-highjump',
    fgColor: 'drg-color-highjump',
  });

  bars.onUseAbility([
    kAbility.HighJump,
    kAbility.Jump,
  ], () => {
    highJumpBox.duration = 30;
  });

  const disembowelBox = bars.addProcBox({
    id: 'drg-procs-disembowel',
    fgColor: 'drg-color-disembowel',
    notifyWhenExpired: true,
  });
  bars.onCombo((skill) => {
    if (skill === kAbility.Disembowel)
      disembowelBox.duration = 30 + 1;
  });
  const lanceChargeBox = bars.addProcBox({
    id: 'drg-procs-lancecharge',
    fgColor: 'drg-color-lancecharge',
    threshold: 20,
  });
  bars.onUseAbility(kAbility.LanceCharge, () => {
    lanceChargeBox.duration = 20;
    lanceChargeBox.fg = computeBackgroundColorFrom(lanceChargeBox, 'drg-color-lancecharge.active');
    tid1 = window.setTimeout(() => {
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
    dragonSightBox.duration = 20;
    dragonSightBox.fg = computeBackgroundColorFrom(dragonSightBox, 'drg-color-dragonsight.active');
    tid2 = window.setTimeout(() => {
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
  bars.onJobDetailUpdate('DRG', (jobDetail: JobDetail['DRG']) => {
    blood.parentNode.classList.remove('blood', 'life');
    if (jobDetail.bloodMilliseconds > 0) {
      blood.parentNode.classList.add('blood');
      blood.innerText = Math.ceil(jobDetail.bloodMilliseconds / 1000).toString();
      if (jobDetail.bloodMilliseconds < 5000)
        blood.parentNode.classList.remove('blood');
    } else if (jobDetail.lifeMilliseconds > 0) {
      blood.parentNode.classList.add('life');
      blood.innerText = Math.ceil(jobDetail.lifeMilliseconds / 1000).toString();
    } else {
      blood.innerText = '';
    }

    eyes.parentNode.classList.remove('zero', 'one', 'two');
    if (jobDetail.lifeMilliseconds > 0 || jobDetail.bloodMilliseconds > 0) {
      eyes.innerText = jobDetail.eyesAmount.toString();
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

  resetFunc = (_bars: Bars): void => {
    highJumpBox.duration = 0;
    disembowelBox.duration = 0;
    lanceChargeBox.duration = 0;
    lanceChargeBox.fg = computeBackgroundColorFrom(lanceChargeBox, 'drg-color-lancecharge');
    dragonSightBox.duration = 0;
    dragonSightBox.fg = computeBackgroundColorFrom(dragonSightBox, 'drg-color-dragonsight');
    clearTimeout(tid1);
    clearTimeout(tid2);
  };
};

export const reset = (bars: Bars): void => {
  if (resetFunc)
    resetFunc(bars);
};
