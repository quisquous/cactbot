import EffectId from '../../../resources/effect_id';
import TimerBar from '../../../resources/timerbar';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { ComboTracker } from '../combo_tracker';
import { kAbility } from '../constants';
import { PartialFieldMatches } from '../event_emitter';

import { BaseComponent, ComponentInterface } from './base';

export class WARComponent extends BaseComponent {
  BeastBox: ResourceBox;
  tempestBox: TimerBox;
  upheavalBox: TimerBox;
  innerReleaseBox: TimerBox;
  comboTimer: TimerBar;
  bonus: number;

  constructor(o: ComponentInterface) {
    super(o);
    this.BeastBox = this.bars.addResourceBox({
      classList: ['war-color-beast'],
    });

    this.tempestBox = this.bars.addProcBox({
      fgColor: 'war-color-tempest',
      notifyWhenExpired: true,
    });
    this.upheavalBox = this.bars.addProcBox({
      fgColor: 'war-color-upheaval',
    });
    this.innerReleaseBox = this.bars.addProcBox({
      fgColor: 'war-color-innerrelease',
    });

    this.comboTimer = this.bars.addTimerBar({
      id: 'war-timers-combo',
      fgColor: 'combo-color',
    });

    this.bonus = 0;

    this.reset();
  }

  override onJobDetailUpdate(jobDetail: JobDetail['WAR']): void {
    const beast = jobDetail.beast.toString();
    if (this.BeastBox.innerText === beast)
      return;
    this.BeastBox.innerText = beast;
    const p = this.BeastBox.parentNode;
    if (jobDetail.beast < 50) {
      p.classList.add('low');
      p.classList.remove('mid');
    } else if (jobDetail.beast < 90) {
      p.classList.remove('low');
      p.classList.add('mid');
    } else {
      p.classList.remove('low');
      p.classList.remove('mid');
    }
  }

  override onUseAbility(skill: string): void {
    switch (skill) {
      case kAbility.Upheaval:
      case kAbility.Orogeny:
        this.upheavalBox.duration = 30;
        break;
      case kAbility.InnerRelease:
      case kAbility.Berserk:
        this.innerReleaseBox.duration = 60;
        break;
    }
  }

  override onCombo(skill: string, combo: ComboTracker): void {
    this.comboTimer.duration = 0;
    // Storm's Eye initiation will freeze Surging Tempest buff for about 1.6s before countdown start
    if (skill === kAbility.StormsEye && !this.tempestBox.duration)
      this.bonus = 1.6;
    if (combo.isFinalSkill)
      return;
    if (skill)
      this.comboTimer.duration = this.comboDuration;
  }
  override onYouGainEffect(id: string, matches: PartialFieldMatches<'GainsEffect'>): void {
    if (id !== EffectId.SurgingTempest)
      return;
    const duration = parseFloat(matches.duration ?? '0');
    this.tempestBox.duration = duration + this.bonus - 0.5; // buff logline delay
    this.bonus = 0;
  }
  override onYouLoseEffect(id: string): void {
    if (id === EffectId.SurgingTempest)
      this.tempestBox.duration = 0;
  }

  override onStatChange({ gcdSkill }: { gcdSkill: number }): void {
    this.tempestBox.valuescale = gcdSkill;
    this.tempestBox.threshold = gcdSkill * 3 + 1;
    this.upheavalBox.valuescale = gcdSkill;
    this.upheavalBox.threshold = gcdSkill;
    this.innerReleaseBox.valuescale = gcdSkill;
    this.innerReleaseBox.threshold = gcdSkill * 3;
  }

  override reset(): void {
    this.tempestBox.duration = 0;
    this.upheavalBox.duration = 0;
    this.innerReleaseBox.duration = 0;
    this.comboTimer.duration = 0;
  }
}
