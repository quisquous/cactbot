import EffectId from '../../../resources/effect_id';
import { JobDetail } from '../../../types/event';
import { Bars } from '../bars';
import { Player } from '../player';

let resetFunc: (bars: Bars) => void;

export const setup = (bars: Bars, player: Player): void => {
  const textBox = bars.addResourceBox({
    classList: ['war-color-beast'],
  });

  player.onJobDetailUpdate('WAR', (jobDetail: JobDetail['WAR']) => {
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

  bars.onCombo((skill, combo) => {
    comboTimer.duration = 0;
    if (combo.isFinalSkill)
      return;
    if (skill)
      comboTimer.duration = 15;
  });

  bars.onYouGainEffect((id, matches) => {
    if (id === EffectId.StormsEye)
      eyeBox.duration = parseFloat(matches.duration ?? '0');
  });
  bars.onYouLoseEffect((id) => {
    if (id === EffectId.StormsEye)
      eyeBox.duration = 0;
  });

  bars.onStatChange('WAR', ({ gcdSkill }) => {
    eyeBox.valuescale = gcdSkill * 3 + 1;
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
