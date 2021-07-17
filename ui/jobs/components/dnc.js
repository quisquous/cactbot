import EffectId from '../../../resources/effect_id';
import { kAbility } from '../constants';
import { computeBackgroundColorFrom } from '../utils';
import { BaseComponent } from './base';

export default class DncComponent extends BaseComponent {
  constructor(bars) {
    super(bars);

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

    this.technicalIsActive = false;
    this.technicalStepElapsed = 0;
    this.flourishEffect = [];
    this.flourishIsActive = false;
    this.tid1 = 0;
    this.tid2 = 0;
  }

  onCombo(skill) {
    this.comboTimer.duration = 0;
    if (this.bars.combo.isFinalSkill)
      return;
    if (skill)
      this.comboTimer.duration = 15;
  }

  onUseAbility(abilityId) {
    switch (abilityId) {
    case kAbility.StandardStep:
      this.standardStep.duration = 30;
      break;

    case kAbility.TechnicalStep:
      this.technicalStep.duration = 120;
      break;

    case kAbility.QuadrupleTechnicalFinish:
    case kAbility.TripleTechnicalFinish:
    case kAbility.DoubleTechnicalFinish:
    case kAbility.SingleTechnicalFinish:
      // Avoid multiple call in one TechnicalFinish.
      if (this.technicalIsActive)
        return;
      this.technicalStepElapsed = technicalStep.elapsed;
      this.technicalIsActive = true;
      this.technicalStep.duration = 20;
      this.technicalStep.threshold = 1000;
      this.technicalStep.fg = computeBackgroundColorFrom(this.technicalStep, 'dnc-color-technicalstep.active');
      this.tid1 = window.setTimeout(() => {
        this.technicalIsActive = false;
        this.technicalStep.duration = 100 - this.technicalStepElapsed;
        this.technicalStep.threshold = bars.gcdSkill + 1;
        this.technicalStep.fg = computeBackgroundColorFrom(this.technicalStep, 'dnc-color-technicalstep');
      }, this.technicalStep.duration * 1000);
      break;

    case kAbility.Flourish:
      this.flourish.duration = 20;
      this.flourishEffect = [];
      this.flourishIsActive = true;
      this.flourish.threshold = 1000;
      this.flourish.fg = computeBackgroundColorFrom(this.flourish, 'dnc-color-flourish.active');
      this.tid2 = window.setTimeout(() => {
        this.flourish.duration = 40;
        this.flourishIsActive = false;
        this.flourish.threshold = bars.gcdSkill + 1;
        this.flourish.fg = computeBackgroundColorFrom(this.flourish, 'dnc-color-flourish');
      }, this.flourish.duration * 1000);
      break;

    default:
      break;
    }
  }

  onLoseEffect(effectId) {
    switch (effectId) {
    case EffectId.FlourishingCascade:
    case EffectId.FlourishingFountain:
    case EffectId.FlourishingShower:
    case EffectId.FlourishingWindmill:
    case EffectId.FlourishingFanDance:
      if (!(flourishEffect.includes(effect)))
        flourishEffect.push(effect);
      if (flourishEffect.length === 5 && flourishIsActive) {
        flourish.duration = 60 - flourish.elapsed;
        flourishIsActive = false;
        flourish.threshold = bars.gcdSkill + 1;
        flourish.fg = computeBackgroundColorFrom(flourish, 'dnc-color-flourish');
      }
      break;

    default:
      break;
    }
  }

  onJobDetailUpdate(jobDetail) {
    this.espritGauge.innerText = jobDetail.esprit;
    this.featherGauge.innerText = jobDetail.feathers;
    if (jobDetail.esprit >= 80)
      this.espritGauge.parentNode.classList.add('high');
    else
      this.espritGauge.parentNode.classList.remove('high');
  }

  onStatChange(stats) {
    this.standardStep.valuescale = stats.gcdSkill;
    this.standardStep.threshold = stats.gcdSkill + 1;
    this.technicalStep.valuescale = stats.gcdSkill;
    this.technicalStep.threshold = stats.gcdSkill + 1;
    this.flourish.valuescale = stats.gcdSkill;
    this.flourish.threshold = stats.gcdSkill + 1;
  }

  reset() {
    this.comboTimer.duration = 0;
    this.standardStep.duration = 0;
    this.technicalStep.duration = 0;
    this.technicalIsActive = false;
    this.technicalStepElapsed = 0;
    this.technicalStep.threshold = this.bars.gcdSkill + 1;
    this.technicalStep.fg = computeBackgroundColorFrom(this.technicalStep, 'dnc-color-technicalstep');
    this.flourish.duration = 0;
    this.flourishEffect = [];
    this.flourishIsActive = false;
    this.flourish.threshold = this.bars.gcdSkill + 1;
    this.flourish.fg = computeBackgroundColorFrom(this.flourish, 'dnc-color-flourish');
    clearTimeout(this.tid1);
    clearTimeout(this.tid2);
  }
}
