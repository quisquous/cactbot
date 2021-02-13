import EffectId from '../../../resources/effect_id.js';
import { kAbility } from '../constants.js';

export function setupWar(bars) {
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
    // TODO: handle flags where you don't hit something.
    // flags are 0 if hit nothing, 710003 if not in combo, 32710003 if good.
    if (skill === kAbility.MythrilTempest) {
      if (eyeBox.duration > 0) {
        const old = parseFloat(eyeBox.duration) - parseFloat(eyeBox.elapsed);
        eyeBox.duration = 0;
        eyeBox.duration = Math.min(old + 30, 59.5);
      }
    }
    if (skill === kAbility.StormsEye) {
      if (eyeBox.duration > 0) {
        const old = parseFloat(eyeBox.duration) - parseFloat(eyeBox.elapsed);
        eyeBox.duration = 0;
        eyeBox.duration = Math.min(old + 30, 59.5);
        // Storm's Eye applies with some animation delay here, and on the next
        // Storm's Eye, it snapshots the damage when the gcd is started, so
        // add some of a gcd here in duration time from when it's applied.
      } else {
        eyeBox.duration = 0;
        eyeBox.duration = 30 + 1;
      }
    }
    bars.onUseAbility(kAbility.InnerRelease, () => {
      if (eyeBox.duration > 0) {
        const old = parseFloat(eyeBox.duration) - parseFloat(eyeBox.elapsed);
        eyeBox.duration = 0;
        eyeBox.duration = Math.min(old + 15, 59.5);
      }
      return;
    });

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

  bars.onYouLoseEffect(EffectId.StormsEye, () => {
    // Because storm's eye is tracked from the hit, and the ability is delayed,
    // you can have the sequence: Storm's Eye (ability), loses effect, gains effect.
    // To fix bars, don't "lose" unless it's been going on a bit.
    if (eyeBox.elapsed > 10)
      eyeBox.duration = 0;
  });

  bars.onStatChange('WAR', () => {
    eyeBox.valuescale = bars.gcdSkill;
  });
}
