import EffectId from '../../../resources/effect_id';
import { JobDetail } from '../../../types/event';
import { Bars } from '../jobs';

let resetFunc: (bars: Bars) => void;

export const setup = (bars: Bars): void => {
  const textBox = bars.addResourceBox({
    classList: ['war-color-beast'],
  });

  bars.onJobDetailUpdate('WAR', (jobDetail: JobDetail['WAR']) => {
    const beast = jobDetail.beast.toString();
    if (textBox.innerText === beast)
      return;
    textBox.innerText = beast;
    const p = textBox.parentNode;
    if (jobDetail.beast < 50) {
      p.classList.add('low');
      p.classList.remove('mid');
    } else if (jobDetail.beast < 100) {
      p.classList.remove('low');
      p.classList.add('mid');
    } else {
      p.classList.remove('low');
      p.classList.remove('mid');
    }
  });

  const eyeBox = bars.addProcBox({
    fgColor: 'war-color-eye',
    notifyWhenExpired: true,
  });

  const comboTimer = bars.addTimerBar({
    id: 'war-timers-combo',
    fgColor: 'combo-color',
  });

  bars.onCombo((skill) => {
    comboTimer.duration = 0;
    if (bars.combo?.isFinalSkill)
      return;
    if (skill)
      comboTimer.duration = 15;
  });

  bars.onYouGainEffect(EffectId.StormsEye, (_id, e) => {
    eyeBox.duration = parseFloat(e.duration ?? '0');
  });
  bars.onYouLoseEffect(EffectId.StormsEye, () => {
    eyeBox.duration = 0;
  });

  bars.onStatChange('WAR', () => {
    eyeBox.valuescale = bars.gcdSkill * 3 + 1;
  });

  resetFunc = (_bars: Bars): void => {
    eyeBox.duration = 0;
    comboTimer.duration = 0;
  };
};

export const reset = (bars: Bars): void => {
  if (resetFunc)
    resetFunc(bars);
};
