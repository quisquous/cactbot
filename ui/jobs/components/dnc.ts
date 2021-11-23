import EffectId from '../../../resources/effect_id';
import { JobDetail } from '../../../types/event';
import { Bars } from '../bars';
import { kAbility } from '../constants';
import { computeBackgroundColorFrom } from '../utils';

let resetFunc: (bars: Bars) => void;

export const setup = (bars: Bars): void => {
  let tid1 = 0;
  let tid2 = 0;

  const comboTimer = bars.addTimerBar({
    id: 'dnc-timers-combo',
    fgColor: 'combo-color',
  });
  bars.onCombo((skill, combo) => {
    comboTimer.duration = 0;
    if (combo.isFinalSkill)
      return;
    if (skill)
      comboTimer.duration = 15;
  });

  const standardStep = bars.addProcBox({
    id: 'dnc-procs-standardstep',
    fgColor: 'dnc-color-standardstep',
  });

  // TechnicalStep cooldown on begin dance, but effect appear when TechnicalFinish.
  const technicalStep = bars.addProcBox({
    id: 'dnc-procs-technicalstep',
    fgColor: 'dnc-color-technicalstep',
  });
  let technicalIsActive = false;
  let elapsed = 0;

  // When cast Flourish, show proc remain time until all procs have been used.
  const flourish = bars.addProcBox({
    id: 'dnc-procs-flourish',
    fgColor: 'dnc-color-flourish',
  });
  let flourishEffect: string[] = [];
  let flourishIsActive = false;
  bars.onYouLoseEffect((effect) => {
    switch (effect) {
      case EffectId.FlourishingCascade:
      case EffectId.FlourishingFountain:
      case EffectId.FlourishingShower:
      case EffectId.FlourishingWindmill:
      case EffectId.FlourishingFanDance: {
        if (!(flourishEffect.includes(effect)))
          flourishEffect.push(effect);
        if (flourishEffect.length === 5 && flourishIsActive) {
          flourish.duration = 60 - flourish.elapsed;
          flourishIsActive = false;
          flourish.threshold = bars.gcdSkill + 1;
          flourish.fg = computeBackgroundColorFrom(flourish, 'dnc-color-flourish');
        }
        break;
      }
    }
  });

  bars.onUseAbility((id) => {
    switch (id) {
      case kAbility.StandardStep:
        standardStep.duration = 30;
        break;
      case kAbility.TechnicalStep:
        technicalStep.duration = 120;
        break;
      case kAbility.QuadrupleTechnicalFinish:
      case kAbility.TripleTechnicalFinish:
      case kAbility.DoubleTechnicalFinish:
      case kAbility.SingleTechnicalFinish: {
        // Avoid multiple call in one TechnicalFinish.
        if (technicalIsActive)
          return;
        elapsed = technicalStep.elapsed;
        technicalIsActive = true;
        technicalStep.duration = 20;
        technicalStep.threshold = 1000;
        technicalStep.fg = computeBackgroundColorFrom(
          technicalStep,
          'dnc-color-technicalstep.active',
        );
        tid1 = window.setTimeout(() => {
          technicalIsActive = false;
          technicalStep.duration = 100 - elapsed;
          technicalStep.threshold = bars.gcdSkill + 1;
          technicalStep.fg = computeBackgroundColorFrom(technicalStep, 'dnc-color-technicalstep');
        }, technicalStep.duration * 1000);
        break;
      }
      case kAbility.Flourish: {
        flourish.duration = 20;
        flourishEffect = [];
        flourishIsActive = true;
        flourish.threshold = 1000;
        flourish.fg = computeBackgroundColorFrom(flourish, 'dnc-color-flourish.active');
        tid2 = window.setTimeout(() => {
          flourish.duration = 40;
          flourishIsActive = false;
          flourish.threshold = bars.gcdSkill + 1;
          flourish.fg = computeBackgroundColorFrom(flourish, 'dnc-color-flourish');
        }, flourish.duration * 1000);
        break;
      }
    }
  });

  const featherGauge = bars.addResourceBox({
    classList: ['dnc-color-feather'],
  });
  const espritGauge = bars.addResourceBox({
    classList: ['dnc-color-esprit'],
  });
  bars.onJobDetailUpdate('DNC', (jobDetail: JobDetail['DNC']) => {
    espritGauge.innerText = jobDetail.esprit.toString();
    featherGauge.innerText = jobDetail.feathers.toString();
    if (jobDetail.esprit >= 80)
      espritGauge.parentNode.classList.add('high');
    else
      espritGauge.parentNode.classList.remove('high');
  });

  bars.onStatChange('DNC', () => {
    standardStep.valuescale = bars.gcdSkill;
    standardStep.threshold = bars.gcdSkill + 1;
    technicalStep.valuescale = bars.gcdSkill;
    technicalStep.threshold = bars.gcdSkill + 1;
    flourish.valuescale = bars.gcdSkill;
    flourish.threshold = bars.gcdSkill + 1;
  });

  resetFunc = (bars: Bars): void => {
    comboTimer.duration = 0;
    standardStep.duration = 0;
    technicalStep.duration = 0;
    technicalIsActive = false;
    elapsed = 0;
    technicalStep.threshold = bars.gcdSkill + 1;
    technicalStep.fg = computeBackgroundColorFrom(technicalStep, 'dnc-color-technicalstep');
    flourish.duration = 0;
    flourishEffect = [];
    flourishIsActive = false;
    flourish.threshold = bars.gcdSkill + 1;
    flourish.fg = computeBackgroundColorFrom(flourish, 'dnc-color-flourish');
    clearTimeout(tid1);
    clearTimeout(tid2);
  };
};

export const reset = (bars: Bars): void => {
  if (resetFunc)
    resetFunc(bars);
};
