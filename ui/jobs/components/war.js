import EffectId from '../../../resources/effect_id';
import { kAbility } from '../constants';
import { BaseComponent } from './base';

export default class WarComponent extends BaseComponent {
  constructor(bars) {
    super(bars);

    this.textBox = this.addResourceBox({
      classList: ['war-color-beast'],
    });

    this.eyeBox = this.addProcBox({
      fgColor: 'war-color-eye',
      notifyWhenExpired: true,
    });

    this.comboTimer = this.addTimerBar({
      id: 'war-timers-combo',
      fgColor: 'combo-color',
    });
  }

  onCombo(skill) {
    this.comboTimer.duration = 0;
    if (this.bars.combo.isFinalSkill)
      return;
    if (skill)
      this.comboTimer.duration = 15;
  }

  onGainEffect(effectId, matches) {
    switch (effectId) {
    case EffectId.StormsEye:
      this.eyeBox.duration = matches.duration;
      break;

    default:
      break;
    }
  }

  onLoseEffect(effectId) {
    switch (effectId) {
    case EffectId.StormsEye:
      this.eyeBox.duration = 0;
      break;

    default:
      break;
    }
  }

  onJobDetailUpdate(jobDetail) {
    const beast = jobDetail.beast;
    if (this.textBox.innerText === beast)
      return;
    this.textBox.innerText = beast;
    const p = this.textBox.parentNode;
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
  }

  onStatChange(stats) {
    this.eyeBox.valuescale = stats.gcdSkill * 3 + 1;
  }

  reset() {
    this.eyeBox.duration = 0;
    this.comboTimer.duration = 0;
  }
}
