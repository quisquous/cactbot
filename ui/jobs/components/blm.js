import EffectId from '../../../resources/effect_id';
import { kAbility } from '../constants';

let resetFunc = null;

export function setup(bars) {
  const thunderDot = bars.addProcBox({
    id: 'blm-dot-thunder',
    fgColor: 'blm-color-dot',
    threshold: 4,
    notifyWhenExpired: true,
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
  const thunderDurationMap = {
    [kAbility.Thunder1]: 18,
    [kAbility.Thunder2]: 12,
    [kAbility.Thunder3]: 24,
    [kAbility.Thunder4]: 18,
  };
  bars.onUseAbility(Object.keys(thunderDurationMap), (abilityId) => {
    thunderDot.duration = thunderDurationMap[abilityId];
  });

  bars.onYouGainEffect(EffectId.Thundercloud, (_, matches) => {
    thunderProc.duration = parseFloat(matches.duration);
  });
  bars.onYouLoseEffect(EffectId.Thundercloud, () => thunderProc.duration = 0);

  bars.onYouGainEffect(EffectId.Firestarter, (_, matches) => {
    fireProc.duration = parseFloat(matches.duration);
  });
  bars.onYouLoseEffect(EffectId.Firestarter, () => fireProc.duration = 0);

  bars.onYouGainEffect(EffectId.CircleOfPower, () => bars.speedBuffs.circleOfPower = 1);
  bars.onYouLoseEffect(EffectId.CircleOfPower, () => bars.speedBuffs.circleOfPower = 0);

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

  bars.onJobDetailUpdate((jobDetail) => {
    if (bars.umbralStacks !== jobDetail.umbralStacks) {
      bars.umbralStacks = jobDetail.umbralStacks;
      bars._updateMPTicker();
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

  resetFunc = (bars) => {
    thunderDot.duration = 0;
    thunderProc.duration = 0;
    fireProc.duration = 0;
  };
}

export function reset(bars) {
  if (resetFunc)
    resetFunc(bars);
}
