import EffectId from '../../../resources/effect_id';
import { kAbility } from '../constants';
import { computeBackgroundColorFrom } from '../utils';
import { BaseComponent } from './base';

export default class NinComponent extends BaseComponent {
  constructor(bars) {
    super(bars);

    this.ninki = this.addResourceBox({
      classList: ['nin-color-ninki'],
    });
    this.hutonBox = this.addProcBox({
      id: 'nin-procs-huton',
      fgColor: 'nin-color-huton',
      threshold: 20,
    });
    this.trickAttack = this.addProcBox({
      id: 'nin-procs-trickattack',
      fgColor: 'nin-color-trickattack',
    });
    this.bunshin = this.addProcBox({
      id: 'nin-procs-bunshin',
      fgColor: 'nin-color-bunshin',
    });
    this.ninjutsu = this.addProcBox({
      id: 'nin-procs-ninjutsu',
      fgColor: 'nin-color-ninjutsu',
    });

    this.comboTimer = this.addTimerBar({
      id: 'nin-timers-combo',
      fgColor: 'combo-color',
    });

    this.mudraTriggerCd = true;
    this.tid1 = 0;
  }

  onCombo(skill) {
    this.comboTimer.duration = 0;
    if (this.bars.combo.isFinalSkill)
      return;
    if (skill)
      this.comboTimer.duration = 15;
  }

  onGainEffect(effectId) {
    switch (effectId) {
    case EffectId.Mudra:
      if (this.mudraTriggerCd) {
        const old = this.ninjutsu.value;
        if (old > 0)
          this.ninjutsu.duration = old + 20;
        else
          this.ninjutsu.duration = 20 - 0.5;
        this.mudraTriggerCd = false;
      }
      break;

    case EffectId.Kassatsu:
      this.mudraTriggerCd = false;
      break;

    default:
      break;
    }
  }

  onLoseEffect(effectId) {
    switch (effectId) {
    case EffectId.Mudra:
      this.mudraTriggerCd = true;
      break;

    case EffectId.Kassatsu:
      this.mudraTriggerCd = true;
      break;

    default:
      break;
    }
  }

  onJobDetailUpdate(jobDetail) {
    if (jobDetail.hutonMilliseconds > 0)
      this.player.speedBuffs.huton = true;
    else
      this.player.speedBuffs.huton = false;

    this.ninki.innerText = jobDetail.ninkiAmount;
    this.ninki.parentNode.classList.remove('high', 'low');
    if (jobDetail.ninkiAmount < 50)
      this.ninki.parentNode.classList.add('low');
    else if (jobDetail.ninkiAmount >= 90)
      this.ninki.parentNode.classList.add('high');
    const oldSeconds = this.hutonBox.value;
    const seconds = jobDetail.hutonMilliseconds / 1000.0;
    if (!this.hutonBox.duration || seconds > oldSeconds)
      this.hutonBox.duration = seconds;
  }

  onUseAbility(abilityId) {
    switch (abilityId) {
    case kAbility.Bunshin:
      this.bunshin.duration = 90;
      break;

    case kAbility.Hide:
      this.ninjutsu.duration = 0;
      break;

    case kAbility.TrickAttack:
      this.trickAttack.duration = 15;
      this.trickAttack.threshold = 1000;
      this.trickAttack.fg = computeBackgroundColorFrom(this.trickAttack, 'nin-color-trickattack.active');
      this.tid1 = window.setTimeout(() => {
        this.trickAttack.duration = 45;
        this.trickAttack.threshold = this.player.gcdSkill * 4;
        this.trickAttack.fg = computeBackgroundColorFrom(this.trickAttack, 'nin-color-trickattack');
      }, 15000);
      break;

    default:
      break;
    }
  }

  onStatChange(stats) {
    this.trickAttack.valuescale = stats.gcdSkill;
    this.bunshin.valuescale = stats.gcdSkill;
    this.bunshin.threshold = stats.gcdSkill * 8;
    this.ninjutsu.valuescale = stats.gcdSkill;
    this.ninjutsu.threshold = stats.gcdSkill * 2;
  }

  reset() {
    this.bunshin.duration = 0;
    this.mudraTriggerCd = true;
    this.ninjutsu.duration = 0;
    this.trickAttack.duration = 0;
    this.trickAttack.threshold = this.player.gcdSkill * 4;
    this.trickAttack.fg = computeBackgroundColorFrom(this.trickAttack, 'nin-color-trickattack');
    this.hutonBox.duration = 0;
    this.comboTimer.duration = 0;
    clearTimeout(this.tid1);
  }
}
