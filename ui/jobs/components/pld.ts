import EffectId from '../../../resources/effect_id';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { kAbility } from '../constants';
import { PartialFieldMatches } from '../event_emitter';

import { BaseComponent, ComponentInterface } from './base';

export class PLDComponent extends BaseComponent {
  oathBox: ResourceBox;
  atonementBox: ResourceBox;
  goreBox: TimerBox;

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

  this.setAtonement(this.atonementBox, 0);
}
  override onJobDetailUpdate(jobDetail: JobDetail['PLD']):void {
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

  override onCombo(skill: string): void {
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


  // As atonement counts down, the player gets successive "gains effects"
  // for the same effect, but with different counts.  When the last stack
  // falls off, then there's a "lose effect" line.
  override onYouGainEffect(id: string, matches: PartialFieldMatches<'GainsEffect'>): void {
    if (id === EffectId.SwordOath)
      this.setAtonement(this.atonementBox, parseInt(matches.count ?? '0'));
  }
  override onYouLoseEffect(id: string): void {
    if (id === EffectId.SwordOath)
      this.setAtonement(this.atonementBox, 0);
  }

  override onStatChange({ gcdSkill } : { gcdSkill: number }): void {
    this.goreBox.valuescale = gcdSkill;
    this.goreBox.threshold = gcdSkill * 3 + 0.3;
  }

  override reset(): void {
    this.goreBox.duration = 0;
    this.setAtonement(this.atonementBox, 0);
  }
}

