import { JobDetail } from '../../../types/event';
import { Bars } from '../bars';
import { kAbility } from '../constants';
import { Player } from '../player';

let resetFunc: (bars: Bars) => void;

export const setup = (bars: Bars, player: Player): void => {
  const aetherflowStackBox = bars.addResourceBox({
    classList: ['sch-color-aetherflow'],
  });

  const fairyGaugeBox = bars.addResourceBox({
    classList: ['sch-color-fairygauge'],
  });

  const bioBox = bars.addProcBox({
    id: 'sch-procs-bio',
    fgColor: 'sch-color-bio',
    notifyWhenExpired: true,
  });

  const aetherflowBox = bars.addProcBox({
    id: 'sch-procs-aetherflow',
    fgColor: 'sch-color-aetherflow',
  });

  const lucidBox = bars.addProcBox({
    id: 'sch-procs-luciddreaming',
    fgColor: 'sch-color-lucid',
  });

  player.onJobDetailUpdate('SCH', (jobDetail: JobDetail['SCH']) => {
    const aetherflow = jobDetail.aetherflowStacks;
    const fairygauge = jobDetail.fairyGauge;
    const milli = Math.ceil(jobDetail.fairyMilliseconds / 1000);
    aetherflowStackBox.innerText = aetherflow.toString();
    fairyGaugeBox.innerText = fairygauge.toString();
    const f = fairyGaugeBox.parentNode;
    if (jobDetail.fairyMilliseconds !== 0) {
      f.classList.add('bright');
      fairyGaugeBox.innerText = milli.toString();
    } else {
      f.classList.remove('bright');
      fairyGaugeBox.innerText = fairygauge.toString();
    }

    // dynamically annouce user depends on their aetherflow stacks right now
    aetherflowBox.threshold = player.gcdSpell * (aetherflow || 1) + 1;

    const p = aetherflowStackBox.parentNode;
    const s = aetherflowBox.duration ?? 0 - aetherflowBox.elapsed;
    if (aetherflow * 5 >= s) {
      // turn red when stacks are too much before AF ready
      p.classList.add('too-much-stacks');
    } else {
      p.classList.remove('too-much-stacks');
    }
  });

  bars.onUseAbility((id) => {
    switch (id) {
      case kAbility.Bio:
      case kAbility.Bio2:
      case kAbility.Biolysis:
        bioBox.duration = 30;
        break;
      case kAbility.Aetherflow:
        aetherflowBox.duration = 60;
        aetherflowStackBox.parentNode.classList.remove('too-much-stacks');
        break;
      case kAbility.LucidDreaming:
        lucidBox.duration = 60;
        break;
    }
  });

  bars.onStatChange('SCH', ({ gcdSpell }) => {
    bioBox.valuescale = gcdSpell;
    bioBox.threshold = gcdSpell + 1;
    aetherflowBox.valuescale = gcdSpell;
    lucidBox.valuescale = gcdSpell;
    lucidBox.threshold = gcdSpell + 1;
  });

  resetFunc = (_bars: Bars): void => {
    bioBox.duration = 0;
    aetherflowBox.duration = 0;
    lucidBox.duration = 0;
  };
};

export const reset = (bars: Bars): void => {
  if (resetFunc)
    resetFunc(bars);
};
