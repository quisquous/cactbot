import EffectId from '../../../resources/effect_id';
import { kAbility } from '../constants';

let resetFunc = null;

export function setup(bars) {
  const textBox = bars.addResourceBox({
    classList: ['war-color-beast'],
  });

  bars.onJobDetailUpdate((jobDetail) => {
    const beast = jobDetail.beast;
    if (textBox.innerText === beast)
      return;
    textBox.innerText = beast;
    const p = textBox.parentNode;
    if (beast < 50) {
      p.classList.add('low');
      p.classList.remove('mid');
    } else if (beast < 100) {
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
    if (bars.combo.isFinalSkill)
      return;
    if (skill)
      comboTimer.duration = 15;
  });

  bars.onYouGainEffect(EffectId.StormsEye, (id, e) => {
    eyeBox.duration = e.duration;
  });
  bars.onYouLoseEffect(EffectId.StormsEye, () => {
    eyeBox.duration = 0;
  });

  bars.onStatChange('WAR', () => {
    eyeBox.valuescale = bars.gcdSkill * 3 + 1;
  });

  resetFunc = (bars) => {
    eyeBox.duration = 0;
    comboTimer.duration = 0;
  };
}

export function reset(bars) {
  if (resetFunc)
    resetFunc(bars);
}
