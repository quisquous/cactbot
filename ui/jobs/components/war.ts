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
  textBox: ResourceBox;
  eyeBox: TimerBox;
  comboTimer: TimerBar;
  bonus: number;

  constructor(o: ComponentInterface) {
    super(o);
    this.textBox = this.bars.addResourceBox({
      classList: ['war-color-beast'],
    });

    this.eyeBox = this.bars.addProcBox({
      fgColor: 'war-color-eye',
      notifyWhenExpired: true,
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
    if (this.textBox.innerText === beast)
      return;
    this.textBox.innerText = beast;
    const p = this.textBox.parentNode;
    if (jobDetail.beast < 50) {
      p.classList.add('low');
      p.classList.remove('mid');
    } else if (jobDetail.beast < 100) {
      p.classList.remove('low');
      p.classList.add('mid');
    } else {
      p.classList.remove('low');
      p.classList.remove('mid');
    }
  }

  override onCombo(skill: string, combo: ComboTracker): void {
    this.comboTimer.duration = 0;
    // Storm's Eye initiation will freeze Surging Tempest buff for about 1.6s before countdown start
    if (skill === kAbility.StormsEye && !this.eyeBox.duration)
      this.bonus = 1.6;
    if (combo.isFinalSkill)
      return;
    if (skill)
      this.comboTimer.duration = this.comboDuration;
  }
  override onYouGainEffect(id: string, matches: PartialFieldMatches<'GainsEffect'>): void {
    // TODO: delete StormsEye after every region launch 6.0
    if (id !== EffectId.SurgingTempest && id !== EffectId.StormsEye)
      return;
    const duration = parseFloat(matches.duration ?? '0');
    this.eyeBox.duration = duration + this.bonus - 0.5; // buff logline delay
    this.bonus = 0;
  }
  override onYouLoseEffect(id: string): void {
    // TODO: delete StormsEye after every region launch 6.0
    if (id === EffectId.SurgingTempest || id === EffectId.StormsEye)
      this.eyeBox.duration = 0;
  }

  override onStatChange({ gcdSkill }: { gcdSkill: number }): void {
    this.eyeBox.valuescale = gcdSkill * 3 + 1;
  }

  override reset(): void {
    this.eyeBox.duration = 0;
    this.comboTimer.duration = 0;
  }
}
