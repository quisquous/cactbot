import EffectId from '../../../resources/effect_id';
import TimerBar from '../../../resources/timerbar';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { ComboTracker } from '../combo_tracker';
import { kAbility } from '../constants';
import { PartialFieldMatches } from '../event_emitter';
import { computeBackgroundColorFrom, showDuration } from '../utils';

import { BaseComponent, ComponentInterface } from './base';

export class PLDComponent extends BaseComponent {
  oathBox: ResourceBox;
  atonementBox: ResourceBox;
  goreBox: TimerBox;
  expiacionBox: TimerBox;
  fightOrFlightBox: TimerBox;
  tid1 = 0;
  stacksContainer: HTMLDivElement;
  requiescat: HTMLElement[] = [];
  comboTimer: TimerBar;

  constructor(o: ComponentInterface) {
    super(o);
    this.oathBox = this.bars.addResourceBox({
      classList: ['pld-color-oath'],
    });
    this.atonementBox = this.bars.addResourceBox({
      classList: ['pld-color-atonement'],
    });

    this.goreBox = this.bars.addProcBox({
      fgColor: 'pld-color-gore',
      notifyWhenExpired: true,
    });
    this.fightOrFlightBox = this.bars.addProcBox({
      fgColor: 'pld-color-fightorflight',
    });
    this.expiacionBox = this.bars.addProcBox({
      fgColor: 'pld-color-expiacion',
    });

    this.comboTimer = this.bars.addTimerBar({
      id: 'pld-timers-combo',
      fgColor: 'combo-color',
    });

    this.setAtonement(this.atonementBox, 0);

    this.stacksContainer = document.createElement('div');
    this.stacksContainer.id = 'pld-stacks';
    this.stacksContainer.classList.add('stacks', 'hide');
    this.bars.addJobBarContainer().appendChild(this.stacksContainer);
    const requiescatContainer = document.createElement('div');
    requiescatContainer.id = 'pld-stacks-requiescat';
    this.stacksContainer.appendChild(requiescatContainer);
    if (this.ffxivVersion >= 630) {
      for (let i = 0; i < 4; ++i) {
        const d = document.createElement('div');
        requiescatContainer.appendChild(d);
        this.requiescat.push(d);
      }
    } else {
      for (let i = 0; i < 5; ++i) {
        const d = document.createElement('div');
        requiescatContainer.appendChild(d);
        this.requiescat.push(d);
      }
    }

    this.reset();
  }

  override onJobDetailUpdate(jobDetail: JobDetail['PLD']): void {
    const oath = jobDetail.oath.toString();
    if (this.oathBox.innerText === oath)
      return;
    this.oathBox.innerText = oath;
    const p = this.oathBox.parentNode;
    if (jobDetail.oath < 50) {
      p.classList.add('low');
      p.classList.remove('mid');
    } else if (jobDetail.oath < 100) {
      p.classList.remove('low');
      p.classList.add('mid');
    } else {
      p.classList.remove('low');
      p.classList.remove('mid');
    }
  }

  setAtonement(atonementBox: ResourceBox, stacks: number): void {
    atonementBox.innerText = stacks.toString();
    const p = atonementBox.parentNode;
    if (stacks === 0)
      p.classList.remove('any');
    else
      p.classList.add('any');
  }
  setRequiescat(stacks: number): void {
    for (let i = 0; i < 5; ++i)
      this.requiescat[i]?.classList.toggle('active', stacks > i);
  }

  override onCombo(skill: string, combo: ComboTracker): void {
    if (skill === kAbility.GoringBlade && this.ffxivVersion >= 630)
      return;
    this.comboTimer.duration = 0;
    if (skill === kAbility.GoringBlade)
      this.goreBox.duration = 21;
    if (combo.isFinalSkill)
      return;
    if (skill)
      this.comboTimer.duration = this.comboDuration;
  }

  override onUseAbility(skill: string): void {
    switch (skill) {
      case kAbility.BladeOfValor:
        if (this.ffxivVersion < 630)
          this.goreBox.duration = 21;
        break;
      case kAbility.GoringBlade:
        if (this.ffxivVersion >= 630)
          this.goreBox.duration = this.bars.player.getActionCooldown(60000, 'skill');
        break;
      case kAbility.Expiacion:
      case kAbility.SpiritsWithin:
        this.expiacionBox.duration = 30;
        break;
      case kAbility.FightOrFlight:
        this.tid1 = showDuration({
          tid: this.tid1,
          timerbox: this.fightOrFlightBox,
          duration: this.ffxivVersion >= 630 ? 20 : 25,
          cooldown: 60,
          threshold: this.player.gcdSkill * 2 + 1,
          activecolor: 'pld-color-fightorflight.active',
          deactivecolor: 'pld-color-fightorflight',
        });
        break;
    }
  }

  // As atonement counts down, the player gets successive "gains effects"
  // for the same effect, but with different counts.  When the last stack
  // falls off, then there's a "lose effect" line.
  override onYouGainEffect(id: string, matches: PartialFieldMatches<'GainsEffect'>): void {
    if (id === EffectId.SwordOath)
      this.setAtonement(this.atonementBox, parseInt(matches.count ?? '0'));
    if (id === EffectId.Requiescat) {
      this.stacksContainer.classList.remove('hide');
      this.setRequiescat(parseInt(matches.count ?? '0'));
    }
  }

  override onYouLoseEffect(id: string): void {
    if (id === EffectId.SwordOath)
      this.setAtonement(this.atonementBox, 0);
    if (id === EffectId.Requiescat) {
      this.setRequiescat(0);
      this.stacksContainer.classList.add('hide');
    }
  }

  override onStatChange({ gcdSkill }: { gcdSkill: number }): void {
    this.goreBox.valuescale = gcdSkill;
    this.goreBox.threshold = gcdSkill * 3 + 0.3;
    this.expiacionBox.valuescale = gcdSkill;
    this.expiacionBox.threshold = gcdSkill;
    this.fightOrFlightBox.valuescale = gcdSkill;
    this.fightOrFlightBox.threshold = gcdSkill * 2 + 1;
  }

  override reset(): void {
    this.goreBox.duration = 0;
    this.expiacionBox.duration = 0;
    this.fightOrFlightBox.duration = 0;
    this.fightOrFlightBox.threshold = this.player.gcdSkill * 2 + 1;
    this.fightOrFlightBox.fg = computeBackgroundColorFrom(
      this.fightOrFlightBox,
      'pld-color-fightorflight',
    );
    window.clearTimeout(this.tid1);
    this.setAtonement(this.atonementBox, 0);
    this.setRequiescat(0);
    this.stacksContainer.classList.add('hide');
  }
}
