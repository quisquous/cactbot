import EffectId from '../../../resources/effect_id';
import TimerBar from '../../../resources/timerbar';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { ComboTracker } from '../combo_tracker';
import { kAbility } from '../constants';
import { computeBackgroundColorFrom } from '../utils';

import { BaseComponent, ComponentInterface } from './base';

export class NINComponent extends BaseComponent {
  ninki: ResourceBox;
  hutonBox: TimerBox;
  trickAttack: TimerBox;
  bunshin: TimerBox;
  ninjutsu: TimerBox;
  comboTimer: TimerBar;
  tid1 = 0;
  mudraTriggerCd = true;

  constructor(o: ComponentInterface) {
    super(o);

    this.ninki = this.bars.addResourceBox({
      classList: ['nin-color-ninki'],
    });
    this.hutonBox = this.bars.addProcBox({
      id: 'nin-procs-huton',
      fgColor: 'nin-color-huton',
      threshold: 20,
    });
    this.trickAttack = this.bars.addProcBox({
      id: 'nin-procs-trickattack',
      fgColor: 'nin-color-trickattack',
    });
    this.bunshin = this.bars.addProcBox({
      id: 'nin-procs-bunshin',
      fgColor: 'nin-color-bunshin',
    });
    this.ninjutsu = this.bars.addProcBox({
      id: 'nin-procs-ninjutsu',
      fgColor: 'nin-color-ninjutsu',
    });

    this.comboTimer = this.bars.addTimerBar({
      id: 'nin-timers-combo',
      fgColor: 'combo-color',
    });

    this.reset();
  }

  override onYouGainEffect(id: string): void {
    switch (id) {
      // Ninjutsu's cooldown begins to countdown at the first mudra.
      case EffectId.Mudra: {
        if (!this.mudraTriggerCd)
          return;
        if (this.ninjutsu.duration === null)
          this.ninjutsu.duration = 0;
        const old = this.ninjutsu.duration - this.ninjutsu.elapsed;
        if (old > 0)
          this.ninjutsu.duration = old + 20;
        else
          this.ninjutsu.duration = 20 - 0.5;

        this.mudraTriggerCd = false;
        break;
      }
      case EffectId.Kassatsu:
        this.mudraTriggerCd = false;
        break;
    }
  }
  // On each mudra, Mudra effect will be gain once,
  // use mudraTriggerCd to tell that whether bars mudra trigger cooldown.
  override onYouLoseEffect(id: string): void {
    if (id === EffectId.Mudra)
      this.mudraTriggerCd = true;
    if (id === EffectId.Kassatsu)
      this.mudraTriggerCd = true;
  }

  override onUseAbility(id: string): void {
    switch (id) {
      case kAbility.Bunshin:
        this.bunshin.duration = 90;
        break;
      case kAbility.Hide:
        this.ninjutsu.duration = 0;
        break;
      case kAbility.TrickAttack: {
        this.trickAttack.duration = 15;
        this.trickAttack.threshold = 1000;
        this.trickAttack.fg = computeBackgroundColorFrom(
          this.trickAttack,
          'nin-color-trickattack.active',
        );
        this.tid1 = window.setTimeout(() => {
          this.trickAttack.duration = 45;
          this.trickAttack.threshold = this.player.gcdSkill * 4;
          this.trickAttack.fg = computeBackgroundColorFrom(
            this.trickAttack,
            'nin-color-trickattack',
          );
        }, 15000);
        break;
      }
    }
  }

  override onStatChange({ gcdSkill }: { gcdSkill: number }): void {
    this.trickAttack.valuescale = gcdSkill;
    this.bunshin.valuescale = gcdSkill;
    this.bunshin.threshold = gcdSkill * 8;
    this.ninjutsu.valuescale = gcdSkill;
    this.ninjutsu.threshold = gcdSkill * 2;
  }

  override onJobDetailUpdate(jobDetail: JobDetail['NIN']): void {
    if (jobDetail.hutonMilliseconds > 0) {
      if (!this.player.speedBuffs.huton)
        this.player.speedBuffs.huton = true;
    } else if (this.player.speedBuffs.huton) {
      this.player.speedBuffs.huton = false;
    }
    this.ninki.innerText = jobDetail.ninkiAmount.toString();
    this.ninki.parentNode.classList.remove('high', 'low');
    if (jobDetail.ninkiAmount < 50)
      this.ninki.parentNode.classList.add('low');
    else if (jobDetail.ninkiAmount >= 90)
      this.ninki.parentNode.classList.add('high');
    if (this.hutonBox.duration === null)
      this.hutonBox.duration = 0;
    const oldSeconds = this.hutonBox.duration - this.hutonBox.elapsed;
    const seconds = jobDetail.hutonMilliseconds / 1000.0;
    if (!this.hutonBox.duration || seconds > oldSeconds)
      this.hutonBox.duration = seconds;
  }
  override onCombo(skill: string, combo: ComboTracker): void {
    this.comboTimer.duration = 0;
    if (combo.isFinalSkill)
      return;
    if (skill)
      this.comboTimer.duration = this.comboDuration;
  }

  override reset(): void {
    this.bunshin.duration = 0;
    this.mudraTriggerCd = true;
    this.ninjutsu.duration = 0;
    this.trickAttack.duration = 0;
    this.trickAttack.threshold = this.player.gcdSkill * 4;
    this.trickAttack.fg = computeBackgroundColorFrom(
      this.trickAttack,
      'nin-color-trickattack',
    );
    this.hutonBox.duration = 0;
    this.comboTimer.duration = 0;
    window.clearTimeout(this.tid1);
  }
}
