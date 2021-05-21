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
  });

  const comboTimer = bars.addTimerBar({
    id: 'war-timers-combo',
    fgColor: 'combo-color',
  });

  bars.onCombo((skill) => {
    // Min number of skills until eye without breaking combo.
    let minSkillsUntilEye;
    if (skill === kAbility.HeavySwing) {
      minSkillsUntilEye = 2;
    } else if (skill === kAbility.SkullSunder) {
      minSkillsUntilEye = 4;
    } else if (skill === kAbility.Maim) {
      minSkillsUntilEye = 1;
    } else {
      // End of combo, or broken combo.
      minSkillsUntilEye = 3;
    }

    // The new threshold is "can I finish the current combo and still
    // have time to do a Storm's Eye".
    const oldThreshold = parseFloat(eyeBox.threshold);
    const newThreshold = (minSkillsUntilEye + 2) * bars.gcdSkill;

    // Because thresholds are nonmonotonic (when finishing a combo)
    // be careful about setting them in ways that are visually poor.
    if (eyeBox.value >= oldThreshold &&
      eyeBox.value >= newThreshold)
      eyeBox.threshold = newThreshold;
    else
      eyeBox.threshold = oldThreshold;

    comboTimer.duration = 0;
    if (bars.combo.isFinalSkill)
      return;
    if (skill)
      comboTimer.duration = 15;
  });

  bars.onYouGainEffect(EffectId.StormsEye, (id, e) => {
    eyeBox.duration = 0;
    eyeBox.duration = e.duration;
  });
  bars.onYouLoseEffect(EffectId.StormsEye, () => {
    eyeBox.duration = 0;
  });

  bars.onStatChange('WAR', () => {
    eyeBox.valuescale = bars.gcdSkill;
  });

  resetFunc = (bars) => {
    eyeBox.duration = 0;
    comboTimer.duration = 0;
    minSkillsUntilEye = 3;
  };
}

export function reset(bars) {
  if (resetFunc)
    resetFunc(bars);
}
