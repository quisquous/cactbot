import EffectId from '../../../resources/effect_id';
import { kAbility } from '../constants';
import { computeBackgroundColorFrom } from '../utils';
import { BaseComponent } from './base';

export default class MnkComponent extends BaseComponent {
  constructor(bars) {
    super(bars);

    this.formTimer = this.addTimerBar({
      id: 'mnk-timers-combo',
      fgColor: 'mnk-color-form',
    });

    this.textBox = this.addResourceBox({
      classList: ['mnk-color-chakra'],
    });

    this.dragonKickBox = this.addProcBox({
      id: 'mnk-procs-dragonkick',
      fgColor: 'mnk-color-dragonkick',
      threshold: 6,
    });

    this.twinSnakesBox = this.addProcBox({
      id: 'mnk-procs-twinsnakes',
      fgColor: 'mnk-color-twinsnakes',
      threshold: 6,
    });

    this.demolishBox = this.addProcBox({
      id: 'mnk-procs-demolish',
      fgColor: 'mnk-color-demolish',
      // Slightly shorter time, to make the box not pop right as
      // you hit snap punch at t=6 (which is probably fine).
      threshold: 5,
    });

    this.perfectBalanceActive = false;
  }

  onGainEffect(effectId, matches) {
    switch (effectId) {
      case EffectId.TwinSnakes:
        // -0.5 for logline delay
        this.twinSnakesBox.duration = parseFloat(matches.duration) - 0.5;
        break;

      case EffectId.LeadenFist:
        this.dragonKickBox.duration = 30;
        break;

      case EffectId.PerfectBalance:
        if (!this.perfectBalanceActive) {
          this.formTimer.duration = 0;
          this.formTimer.duration = parseFloat(matches.duration);
          this.formTimer.fg = computeBackgroundColorFrom(this.formTimer, 'mnk-color-pb');
          this.perfectBalanceActive = true;
        }
        break;

      case EffectId.OpoOpoForm:
      case EffectId.RaptorForm:
      case EffectId.CoeurlForm:
        this.formTimer.duration = 0;
        this.formTimer.duration = parseFloat(matches.duration);
        this.formTimer.fg = computeBackgroundColorFrom(this.formTimer, 'mnk-color-form');
        break;

      default:
        break;
    }
  }

  onLoseEffect(effectId) {
    switch (effectId) {
      case EffectId.TwinSnakes:
        this.twinSnakesBox.duration = 0;
        break;

      case EffectId.LeadenFist:
        this.dragonKickBox.duration = 0;
        break;

      case EffectId.PerfectBalance:
        this.formTimer.duration = 0;
        this.formTimer.fg = computeBackgroundColorFrom(this.formTimer, 'mnk-color-form');
        this.perfectBalanceActive = false;
        break;

      default:
        break;
    }
  }

  onUseAbility(abilityId) {
    switch (abilityId) {
      case kAbility.Demolish:
        // it start counting down when you cast demolish
        // but DOT appears on target about 1 second later
        this.demolishBox.duration = 18 + 1;
        break;

      default:
        break;
    }
  }

  onJobDetailUpdate(jobDetail) {
    const chakra = jobDetail.chakraStacks;
    if (this.textBox.innerText !== chakra) {
      this.textBox.innerText = chakra;
      const p = this.textBox.parentNode;
      if (chakra < 5)
        p.classList.add('dim');
      else
        p.classList.remove('dim');
    }
  }

  reset() {
    this.twinSnakesBox.duration = 0;
    this.demolishBox.duration = 0;
    this.dragonKickBox.duration = 0;
    this.formTimer.duration = 0;
    this.formTimer.fg = computeBackgroundColorFrom(this.formTimer, 'mnk-color-form');
    this.perfectBalanceActive = false;
  }
}
