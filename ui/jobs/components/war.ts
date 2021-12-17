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
  initial: boolean;
  just: boolean;

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
    this.initial = false;
    this.just = false;
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
    if (skill === kAbility.StormsEye &&
      (this.eyeBox.duration === null || this.eyeBox.duration === 0)) {
      this.eyeBox.duration = 30 + 1.1;
      this.initial = true;
      this.just = true; // for continue with Inner Release at once case
      setTimeout(() => {
        this.initial = false;
      }, 550);
      setTimeout(() => {
        this.just = false;
      }, 1100);
    }
    // FIXME: MythrilTempest delay untested
    if (skill === kAbility.MythrilTempest &&
      (this.eyeBox.duration === null || this.eyeBox.duration === 0)) {
      if (!this.is5x)
        this.eyeBox.duration = 30 + 0.5;
        this.initial = true;
        setTimeout(() => {
          this.initial = false;
        }, 550);
    }
    if (combo.isFinalSkill)
      return;
    if (skill)
      this.comboTimer.duration = this.comboDuration;
  }
  override onUseAbility(id: string): void {
    if (id === kAbility.InnerRelease && this.just === true)
      this.eyeBox.duration = 45 + 0.5;
  }
  override onYouGainEffect(id: string, matches: PartialFieldMatches<'GainsEffect'>): void {
    // TODO: delete StormsEye after every region launch 6.0
    if (id !== EffectId.SurgingTempest && id !== EffectId.StormsEye)
      return;
    const duration = parseFloat(matches.duration ?? '0');
    if (!this.initial && !this.just)
      this.eyeBox.duration = duration - 0.5; // buff logline delay
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
