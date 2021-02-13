import EffectId from '../../../resources/effect_id.js';
import { kAbility } from '../constants.js';

export function setupBlm(bars) {
  const thunderDot = bars.addProcBox({
    id: 'blm-dot-thunder',
    fgColor: 'blm-color-dot',
    threshold: 4,
  });
  const thunderProc = bars.addProcBox({
    id: 'blm-procs-thunder',
    fgColor: 'blm-color-thunder',
    threshold: 1000,
  });
  thunderProc.bigatzero = false;
  const fireProc = bars.addProcBox({
    id: 'blm-procs-fire',
    fgColor: 'blm-color-fire',
    threshold: 1000,
  });
  fireProc.bigatzero = false;

  // bars could have two boxes here for the rare case where you
  // have two long-lived enemies, but it's an edge case that
  // maybe only makes sense in ucob?
  bars.abilityFuncMap[kAbility.Thunder1] = () => {
    thunderDot.duration = 0;
    thunderDot.duration = 18;
  };
  bars.abilityFuncMap[kAbility.Thunder2] = () => {
    thunderDot.duration = 0;
    thunderDot.duration = 12;
  };
  bars.abilityFuncMap[kAbility.Thunder3] = () => {
    thunderDot.duration = 0;
    thunderDot.duration = 24;
  };
  bars.abilityFuncMap[kAbility.Thunder4] = () => {
    thunderDot.duration = 0;
    thunderDot.duration = 18;
  };

  bars.gainEffectFuncMap[EffectId.Thundercloud] = (_, matches) => {
    thunderProc.duration = 0;
    thunderProc.duration = parseFloat(matches.duration);
  };
  bars.loseEffectFuncMap[EffectId.Thundercloud] = () => thunderProc.duration = 0;

  bars.gainEffectFuncMap[EffectId.Firestarter] = (_, matches) => {
    fireProc.duration = 0;
    fireProc.duration = parseFloat(matches.duration);
  };
  bars.loseEffectFuncMap[EffectId.Firestarter] = () => fireProc.duration = 0;

  bars.gainEffectFuncMap[EffectId.CircleOfPower] = () => bars.circleOfPower = 1;
  bars.loseEffectFuncMap[EffectId.CircleOfPower] = () => bars.circleOfPower = 0;

  // It'd be super nice to use grid here.
  // Maybe some day when cactbot uses new cef.
  const stacksContainer = document.createElement('div');
  stacksContainer.id = 'blm-stacks';
  bars.addJobBarContainer().appendChild(stacksContainer);

  const heartStacksContainer = document.createElement('div');
  heartStacksContainer.id = 'blm-stacks-heart';
  stacksContainer.appendChild(heartStacksContainer);
  const heartStacks = [];
  for (let i = 0; i < 3; ++i) {
    const d = document.createElement('div');
    heartStacksContainer.appendChild(d);
    heartStacks.push(d);
  }

  const xenoStacksContainer = document.createElement('div');
  xenoStacksContainer.id = 'blm-stacks-xeno';
  stacksContainer.appendChild(xenoStacksContainer);
  const xenoStacks = [];
  for (let i = 0; i < 2; ++i) {
    const d = document.createElement('div');
    xenoStacksContainer.appendChild(d);
    xenoStacks.push(d);
  }

  const umbralTimer = bars.addResourceBox({
    classList: ['blm-umbral-timer'],
  });
  const xenoTimer = bars.addResourceBox({
    classList: ['blm-xeno-timer'],
  });

  bars.jobFuncs.push((jobDetail) => {
    if (bars.umbralStacks !== jobDetail.umbralStacks) {
      bars.umbralStacks = jobDetail.umbralStacks;
      bars.UpdateMPTicker();
    }
    const fouls = jobDetail.foulCount;
    for (let i = 0; i < 2; ++i) {
      if (fouls > i)
        xenoStacks[i].classList.add('active');
      else
        xenoStacks[i].classList.remove('active');
    }
    const hearts = jobDetail.umbralHearts;
    for (let i = 0; i < 3; ++i) {
      if (hearts > i)
        heartStacks[i].classList.add('active');
      else
        heartStacks[i].classList.remove('active');
    }

    const stacks = jobDetail.umbralStacks;
    const seconds = Math.ceil(jobDetail.umbralMilliseconds / 1000.0);
    const p = umbralTimer.parentNode;
    if (!stacks) {
      umbralTimer.innerText = '';
      p.classList.remove('fire');
      p.classList.remove('ice');
    } else if (stacks > 0) {
      umbralTimer.innerText = seconds;
      p.classList.add('fire');
      p.classList.remove('ice');
    } else {
      umbralTimer.innerText = seconds;
      p.classList.remove('fire');
      p.classList.add('ice');
    }

    const xp = xenoTimer.parentNode;
    if (!jobDetail.enochian) {
      xenoTimer.innerText = '';
      xp.classList.remove('active', 'pulse');
    } else {
      const nextPoly = jobDetail.nextPolyglotMilliseconds;
      xenoTimer.innerText = Math.ceil(nextPoly / 1000.0);
      xp.classList.add('active');

      if (fouls === 2 && nextPoly < 5000)
        xp.classList.add('pulse');
      else
        xp.classList.remove('pulse');
    }
  });
}
