import EffectId from '../../../resources/effect_id';
import TimerBar from '../../../resources/timerbar';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { ComboTracker } from '../combo_tracker';
import { PartialFieldMatches } from '../event_emitter';

import { BaseComponent, ComponentInterface } from './base';

export class WARComponent extends BaseComponent {
  textBox: ResourceBox;
  eyeBox: TimerBox;
  comboTimer: TimerBar;

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
    if (this.eyeBox.duration === null)
      this.eyeBox.duration = 0;
    // FIXME: may incorrect if initial with Mythril Tempest, but will correct after refresh
    // also will incorrect if initial with Storm's Eye and Inner Release at once
    const bonus = this.eyeBox.duration === 0 ? 1.6 : 0;
    this.eyeBox.duration = duration + bonus - 0.5;
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
