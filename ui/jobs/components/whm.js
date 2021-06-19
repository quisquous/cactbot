import EffectId from '../../../resources/effect_id';
import { kAbility } from '../constants';

let resetFunc = null;

export function setup(bars) {
  const lilyBox = bars.addResourceBox({
    classList: ['whm-color-lily'],
  });
  const lilysecondBox = bars.addResourceBox({
    classList: ['whm-color-lilysecond'],
  });

  const diaBox = bars.addProcBox({
    id: 'whm-procs-dia',
    fgColor: 'whm-color-dia',
    notifyWhenExpired: true,
  });
  const assizeBox = bars.addProcBox({
    id: 'whm-procs-assize',
    fgColor: 'whm-color-assize',
  });
  const lucidBox = bars.addProcBox({
    id: 'whm-procs-lucid',
    fgColor: 'whm-color-lucid',
  });

  // BloodLily Gauge
  const stacksContainer = document.createElement('div');
  stacksContainer.id = 'whm-stacks';
  bars.addJobBarContainer().appendChild(stacksContainer);
  const bloodlilyContainer = document.createElement('div');
  bloodlilyContainer.id = 'whm-stacks-bloodlily';
  stacksContainer.appendChild(bloodlilyContainer);
  const bloodlilyStacks = [];
  for (let i = 0; i < 3; ++i) {
    const d = document.createElement('div');
    bloodlilyContainer.appendChild(d);
    bloodlilyStacks.push(d);
  }

  bars.onJobDetailUpdate((jobDetail) => {
    const lily = jobDetail.lilyStacks;
    // bars milliseconds is countup, so use floor instead of ceil.
    const lilysecond = Math.floor(jobDetail.lilyMilliseconds / 1000);

    lilyBox.innerText = lily;
    if (lily === 3)
      lilysecondBox.innerText = '';
    else
      lilysecondBox.innerText = 30 - lilysecond;

    const bloodlilys = jobDetail.bloodlilyStacks;
    for (let i = 0; i < 3; ++i) {
      if (bloodlilys > i)
        bloodlilyStacks[i].classList.add('active');
      else
        bloodlilyStacks[i].classList.remove('active');
    }

    const l = lilysecondBox.parentNode;
    if ((lily === 2 && 30 - lilysecond <= 5) || lily === 3)
      l.classList.add('full');
    else
      l.classList.remove('full');
  });

  bars.onUseAbility([kAbility.Aero, kAbility.Aero2], () => {
    diaBox.duration = 18 + 1;
  });
  bars.onUseAbility(kAbility.Dia, () => {
    diaBox.duration = 30;
  });
  bars.onUseAbility(kAbility.Assize, () => {
    assizeBox.duration = 45;
  });
  bars.onUseAbility(kAbility.LucidDreaming, () => {
    lucidBox.duration = 60;
  });

  bars.onYouGainEffect(EffectId.PresenceOfMind, () => bars.speedBuffs.presenceOfMind = 1);
  bars.onYouLoseEffect(EffectId.PresenceOfMind, () => bars.speedBuffs.presenceOfMind = 0);

  bars.onStatChange('WHM', () => {
    diaBox.valuescale = bars.gcdSpell;
    diaBox.threshold = bars.gcdSpell + 1;
    assizeBox.valuescale = bars.gcdSpell;
    assizeBox.threshold = bars.gcdSpell + 1;
    lucidBox.valuescale = bars.gcdSpell;
    lucidBox.threshold = bars.gcdSpell + 1;
  });

  resetFunc = (bars) => {
    diaBox.duration = 0;
    assizeBox.duration = 0;
    lucidBox.duration = 0;
  };
}

export function reset(bars) {
  if (resetFunc)
    resetFunc(bars);
}
