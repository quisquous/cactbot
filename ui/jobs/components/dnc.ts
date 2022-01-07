import EffectId from '../../../resources/effect_id';
import TimerBar from '../../../resources/timerbar';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { ComboTracker } from '../combo_tracker';
import { kAbility } from '../constants';
import { computeBackgroundColorFrom } from '../utils';

import { BaseComponent, ComponentInterface } from './base';

export class DNCComponent extends BaseComponent {
  comboTimer: TimerBar;
  standardStep: TimerBox;
  technicalStep: TimerBox;
  flourish: TimerBox;
  featherGauge: ResourceBox;
  espritGauge: ResourceBox;
  tid1 = 0;
  tid2 = 0;

  technicalIsActive = false;
  elapsed = 0;
  flourishEffect: string[] = [];
  flourishIsActive = false;

  constructor(o: ComponentInterface) {
    super(o);

  this.comboTimer = this.bars.addTimerBar({
    id: 'dnc-timers-combo',
    fgColor: 'combo-color',
  });

  this.standardStep = this.bars.addProcBox({
    id: 'dnc-procs-standardstep',
    fgColor: 'dnc-color-standardstep',
  });

  // TechnicalStep cooldown on begin dance, but effect appear when TechnicalFinish.
  this.technicalStep = this.bars.addProcBox({
    id: 'dnc-procs-technicalstep',
    fgColor: 'dnc-color-technicalstep',
  });

  // When cast Flourish, show proc remain time until all procs have been used.
  this.flourish = this.bars.addProcBox({
    id: 'dnc-procs-flourish',
    fgColor: 'dnc-color-flourish',
  });

  this.featherGauge = this.bars.addResourceBox({
    classList: ['dnc-color-feather'],
  });
  this.espritGauge = this.bars.addResourceBox({
    classList: ['dnc-color-esprit'],
  });

  this.reset();
}
  override onCombo(skill: string, combo: ComboTracker): void {
    this.comboTimer.duration = 0;
    if (combo.isFinalSkill)
      return;
    if (skill)
      this.comboTimer.duration = this.comboDuration;
  }

  override onYouLoseEffect(effect: string): void {
    if (!this.is5x) {
      switch (effect) {
        case EffectId.FlourishingSymmetry:
        case EffectId.FlourishingFlow:
        case EffectId.ThreefoldFanDance:
        case EffectId.FourfoldFanDance: {
          if (!(this.flourishEffect.includes(effect)))
            this.flourishEffect.push(effect);
          if ((this.flourishEffect.length === 4 && this.flourishIsActive) ||
            (this.player.level < 86 && this.flourishEffect.length === 3 && this.flourishIsActive)) {
            this.flourish.duration = 60 - this.flourish.elapsed;
            this.flourishIsActive = false;
            this.flourish.threshold = this.player.gcdSkill + 1;
            this.flourish.fg = computeBackgroundColorFrom(this.flourish, 'dnc-color-flourish');
          }
          break;
        }
      }
    } else {
      switch (effect) {
        case EffectId.FlourishingCascade:
        case EffectId.FlourishingFountain:
        case EffectId.FlourishingShower:
        case EffectId.FlourishingWindmill:
        case EffectId.ThreefoldFanDance: { // 5.x names FlourishingFanDance, name changed but id not
          if (!(this.flourishEffect.includes(effect)))
            this.flourishEffect.push(effect);
          if (this.flourishEffect.length === 5 && this.flourishIsActive) {
            this.flourish.duration = 60 - this.flourish.elapsed;
            this.flourishIsActive = false;
            this.flourish.threshold = this.player.gcdSkill + 1;
            this.flourish.fg = computeBackgroundColorFrom(this.flourish, 'dnc-color-flourish');
          }
          break;
        }
      }
    }
  }

  override onUseAbility(id: string): void {
    switch (id) {
      case kAbility.StandardStep:
        this.standardStep.duration = 30;
        break;
      case kAbility.TechnicalStep:
        this.technicalStep.duration = 120;
        break;
      case kAbility.QuadrupleTechnicalFinish:
      case kAbility.TripleTechnicalFinish:
      case kAbility.DoubleTechnicalFinish:
      case kAbility.SingleTechnicalFinish: {
        // Avoid multiple call in one TechnicalFinish.
        if (this.technicalIsActive)
          return;
        this.elapsed = this.technicalStep.elapsed;
        this.technicalIsActive = true;
        this.technicalStep.duration = 20;
        this.technicalStep.threshold = 1000;
        this.technicalStep.fg = computeBackgroundColorFrom(
          this.technicalStep,
          'dnc-color-technicalstep.active',
        );
        this.tid1 = window.setTimeout(() => {
          this.technicalIsActive = false;
          this.technicalStep.duration = 100 - this.elapsed;
          this.technicalStep.threshold = this.player.gcdSkill + 1;
          this.technicalStep.fg = computeBackgroundColorFrom(this.technicalStep, 'dnc-color-technicalstep');
        }, this.technicalStep.duration * 1000);
        break;
      }
      case kAbility.Flourish: {
        if (this.is5x)
          this.flourish.duration = 20;
        else
          this.flourish.duration = 30;
        this.flourishEffect = [];
        this.flourishIsActive = true;
        this.flourish.threshold = 1000;
        this.flourish.fg = computeBackgroundColorFrom(this.flourish, 'dnc-color-flourish.active');
        this.tid2 = window.setTimeout(() => {
          if (this.is5x)
            this.flourish.duration = 40;
          else
            this.flourish.duration = 30;
          this.flourishIsActive = false;
          this.flourish.threshold = this.player.gcdSkill + 1;
          this.flourish.fg = computeBackgroundColorFrom(this.flourish, 'dnc-color-flourish');
        }, this.flourish.duration * 1000);
        break;
      }
    }
  }

  override onJobDetailUpdate(jobDetail: JobDetail['DNC']): void {
    this.espritGauge.innerText = jobDetail.esprit.toString();
    this.featherGauge.innerText = jobDetail.feathers.toString();
    if (jobDetail.esprit >= 80)
      this.espritGauge.parentNode.classList.add('high');
    else
      this.espritGauge.parentNode.classList.remove('high');
  }

  override onStatChange({ gcdSkill }: { gcdSkill: number }): void {
    this.standardStep.valuescale = gcdSkill;
    this.standardStep.threshold = gcdSkill + 1;
    this.technicalStep.valuescale = gcdSkill;
    this.technicalStep.threshold = gcdSkill + 1;
    this.flourish.valuescale = gcdSkill;
    this.flourish.threshold = gcdSkill + 1;
  }

  override reset(): void {
    this.comboTimer.duration = 0;
    this.standardStep.duration = 0;
    this.technicalStep.duration = 0;
    this.technicalIsActive = false;
    this.elapsed = 0;
    this.technicalStep.threshold = this. player.gcdSkill + 1;
    this.technicalStep.fg = computeBackgroundColorFrom(this.technicalStep, 'dnc-color-technicalstep');
    this.flourish.duration = 0;
    this.flourishEffect = [];
    this.flourishIsActive = false;
    this.flourish.threshold = this. player.gcdSkill + 1;
    this.flourish.fg = computeBackgroundColorFrom(this.flourish, 'dnc-color-flourish');
    window.clearTimeout(this.tid1);
    window.clearTimeout(this.tid2);
  }
}
