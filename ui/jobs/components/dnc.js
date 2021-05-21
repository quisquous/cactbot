import EffectId from '../../../resources/effect_id';
import { kAbility } from '../constants';
import { computeBackgroundColorFrom } from '../utils';

let resetFunc = null;
let tid1;
let tid2;

export function setup(bars) {
  const comboTimer = bars.addTimerBar({
    id: 'dnc-timers-combo',
    fgColor: 'combo-color',
  });
  bars.onCombo((skill) => {
    comboTimer.duration = 0;
    if (bars.combo.isFinalSkill)
      return;
    if (skill)
      comboTimer.duration = 15;
  });

  const standardStep = bars.addProcBox({
    id: 'dnc-procs-standardstep',
    fgColor: 'dnc-color-standardstep',
  });
  bars.onUseAbility(kAbility.StandardStep, () => {
    standardStep.duration = 0;
    standardStep.duration = 30;
  });

  // TechnicalStep cooldown on begin dance, but effect appear when TechnicalFinish.
  const technicalStep = bars.addProcBox({
    id: 'dnc-procs-technicalstep',
    fgColor: 'dnc-color-technicalstep',
  });
  bars.onUseAbility(kAbility.TechnicalStep, () => {
    technicalStep.duration = 0;
    technicalStep.duration = 120;
  });
  let technicalIsActive = false;
  let elapsed = 0;

  bars.onUseAbility([
    kAbility.QuadrupleTechnicalFinish,
    kAbility.TripleTechnicalFinish,
    kAbility.DoubleTechnicalFinish,
    kAbility.SingleTechnicalFinish,
  ], () => {
    // Avoid multiple call in one TechnicalFinish.
    if (technicalIsActive)
      return;
    elapsed = technicalStep.elapsed;
    technicalIsActive = true;
    technicalStep.duration = 20;
    technicalStep.threshold = 1000;
    technicalStep.fg = computeBackgroundColorFrom(technicalStep, 'dnc-color-technicalstep.active');
    tid1 = setTimeout(() => {
      technicalIsActive = false;
      technicalStep.duration = 100 - elapsed;
      technicalStep.threshold = bars.gcdSkill + 1;
      technicalStep.fg = computeBackgroundColorFrom(technicalStep, 'dnc-color-technicalstep');
    }, technicalStep.duration * 1000);
  });

  // When cast Flourish, show proc remain time until all procs have been used.
  const flourish = bars.addProcBox({
    id: 'dnc-procs-flourish',
    fgColor: 'dnc-color-flourish',
  });
  let flourishEffect = [];
  let flourishIsActive = false;
  bars.onUseAbility(kAbility.Flourish, () => {
    flourish.duration = 0;
    flourish.duration = 20;
    flourishEffect = [];
    flourishIsActive = true;
    flourish.threshold = 1000;
    flourish.fg = computeBackgroundColorFrom(flourish, 'dnc-color-flourish.active');
    tid2 = setTimeout(() => {
      flourish.duration = 40;
      flourishIsActive = false;
      flourish.threshold = bars.gcdSkill + 1;
      flourish.fg = computeBackgroundColorFrom(flourish, 'dnc-color-flourish');
    }, flourish.duration * 1000);
  });
  bars.onYouLoseEffect([
    EffectId.FlourishingCascade,
    EffectId.FlourishingFountain,
    EffectId.FlourishingShower,
    EffectId.FlourishingWindmill,
    EffectId.FlourishingFanDance,
  ], () => {
    if (!(flourishEffect.includes(effect)))
      flourishEffect.push(effect);
    if (flourishEffect.length === 5 && flourishIsActive) {
      flourish.duration = 60 - flourish.elapsed;
      flourishIsActive = false;
      flourish.threshold = bars.gcdSkill + 1;
      flourish.fg = computeBackgroundColorFrom(flourish, 'dnc-color-flourish');
    }
  });


  const featherGauge = bars.addResourceBox({
    classList: ['dnc-color-feather'],
  });
  const espritGauge = bars.addResourceBox({
    classList: ['dnc-color-esprit'],
  });
  bars.onJobDetailUpdate((jobDetail) => {
    espritGauge.innerText = jobDetail.esprit;
    featherGauge.innerText = jobDetail.feathers;
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

  resetFunc = (bars) => {
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
}

export function reset(bars) {
  if (resetFunc)
    resetFunc(bars);
}
