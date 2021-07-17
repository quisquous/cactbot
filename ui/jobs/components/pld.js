import EffectId from '../../../resources/effect_id';
import { kAbility } from '../constants';
import { BaseComponent } from './base';

export default class PldComponent extends BaseComponent {
  constructor(bars) {
    super(bars);

    this.oathBox = this.addResourceBox({
      classList: ['pld-color-oath'],
    });
    this.atonementBox = this.addResourceBox({
      classList: ['pld-color-atonement'],
    });

    this.goreBox = this.addProcBox({
      fgColor: 'pld-color-gore',
      notifyWhenExpired: true,
    });

    this.setAtonement(0);
  }

  onCombo(skill) {
    if (skill === kAbility.GoringBlade) {
      // Technically, goring blade is 21, but 2.43 * 9 = 21.87, so if you
      // have the box show 21, it looks like you're awfully late with
      // your goring blade and just feels really bad.  So, lie to the
      // poor paladins who don't have enough skill speed so that the UI
      // is easier to read for repeating goring, royal, royal, goring
      // and not having the box run out early.
      this.goreBox.duration = 22;
    }
  }

  onGainEffect(effectId, matches) {
    switch (effectId) {
    case EffectId.SwordOath:
      this.setAtonement(atonementBox, parseInt(matches.count));
      break;

    default:
      break;
    }
  }

  onLoseEffect(effectId, matches) {
    switch (effectId) {
    case EffectId.SwordOath:
      this.setAtonement(0);
      break;

    default:
      break;
    }
  }

  onJobDetailUpdate(jobDetail) {
    const oath = jobDetail.oath;
    if (this.oathBox.innerText === oath)
      return;
    this.oathBox.innerText = oath;
    const p = this.oathBox.parentNode;
    if (oath < 50) {
      p.classList.add('low');
      p.classList.remove('mid');
    } else if (oath < 100) {
      p.classList.remove('low');
      p.classList.add('mid');
    } else {
      p.classList.remove('low');
      p.classList.remove('mid');
    }
  }

  onStatChange(stats) {
    this.goreBox.valuescale = this.player.gcdSkill;
    this.goreBox.threshold = this.player.gcdSkill * 3 + 0.3;
  }

  reset() {
    this.goreBox.duration = 0;
    this.setAtonement(0);
  }

  setAtonement(stacks) {
    this.atonementBox.innerText = stacks;
    const p = this.atonementBox.parentNode;
    if (stacks === 0)
      p.classList.remove('any');
    else
      p.classList.add('any');
  }
}
