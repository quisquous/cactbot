import EffectId from '../../../resources/effect_id';
import TimerBar from '../../../resources/timerbar';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import ComboTracker from '../combo_tracker';
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
      this.comboTimer.duration = 15;
  }
  // for some undocumented reason, neither storm's eye or mythril tempest combo function exactly as the tooltip says.
  // when initially applied, mythril tempest sets the duration to 30.5 seconds rounded down. Storm's Eye sets the duration to 30+1.8 or something.
  // the initial duration of eye isn't exactly 32 seconds but it's really close, the buff only reads 30 seconds tho the duration is longer
  // increasing the buff timer via an aditional eye/tempest adds 30 seconds as you'd expect. final duration is always +1.8ish or +0.5 seconds depending on which skill was used
  // overcapping the buff will always set the duration to 60.5 seconds, no matter which skill is used
  override onYouGainEffect(id: string, matches: PartialFieldMatches<'GainsEffect'>): void {
    if (id === EffectId.SurgingTempest)
      this.eyeBox.duration = parseFloat(matches.duration ?? '0');
  }
  override onYouLoseEffect(id: string): void {
    if (id === EffectId.SurgingTempest)
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
