import EffectId from '../../../resources/effect_id';
import { JobDetail } from '../../../types/event';
import { Bars } from '../bars';
import { kAbility } from '../constants';
import { computeBackgroundColorFrom } from '../utils';

let resetFunc: (bars: Bars) => void;

export const setup = (bars: Bars): void => {
  const aetherflowStackBox = bars.addResourceBox({
    classList: ['smn-color-aetherflow'],
  });

  const demiSummoningBox = bars.addResourceBox({
    classList: ['smn-color-demisummon'],
  });

  const miasmaBox = bars.addProcBox({
    id: 'smn-procs-miasma',
    fgColor: 'smn-color-miasma',
    notifyWhenExpired: true,
  });

  const bioSmnBox = bars.addProcBox({
    id: 'smn-procs-biosmn',
    fgColor: 'smn-color-biosmn',
    notifyWhenExpired: true,
  });

  const energyDrainBox = bars.addProcBox({
    id: 'smn-procs-energydrain',
    fgColor: 'smn-color-energydrain',
  });

  const tranceBox = bars.addProcBox({
    id: 'smn-procs-trance',
    fgColor: 'smn-color-trance',
  });

  // FurtherRuin Stack Gauge
  const stacksContainer = document.createElement('div');
  stacksContainer.id = 'smn-stacks';
  bars.addJobBarContainer().appendChild(stacksContainer);
  const ruin4Container = document.createElement('div');
  ruin4Container.id = 'smn-stacks-ruin4';
  stacksContainer.appendChild(ruin4Container);
  const ruin4Stacks: HTMLElement[] = [];
  for (let i = 0; i < 4; ++i) {
    const d = document.createElement('div');
    ruin4Container.appendChild(d);
    ruin4Stacks.push(d);
  }

  let furtherRuin = 0;
  const refreshFurtherRuin = () => {
    for (let i = 0; i < 4; ++i) {
      if (furtherRuin > i)
        ruin4Stacks[i]?.classList.add('active');
      else
        ruin4Stacks[i]?.classList.remove('active');
    }
  };
  bars.onYouGainEffect((id, matches) => {
    if (id === EffectId.FurtherRuin) {
      furtherRuin = parseInt(matches.count ?? '0');
      refreshFurtherRuin();
    }
  });
  bars.onYouLoseEffect((id) => {
    if (id === EffectId.FurtherRuin) {
      furtherRuin = 0;
      refreshFurtherRuin();
    }
  });
  bars.changeZoneFuncs.push(() => {
    furtherRuin = 0;
    refreshFurtherRuin();
  });

  bars.onJobDetailUpdate('SMN', (jobDetail: JobDetail['SMN']) => {
    const stack = jobDetail.aetherflowStacks;
    const summoned = jobDetail.bahamutSummoned;
    const time = Math.ceil(jobDetail.stanceMilliseconds / 1000);

    // turn red when you have too much stacks before EnergyDrain ready.
    aetherflowStackBox.innerText = stack.toString();
    const s = energyDrainBox.duration ?? 0 - energyDrainBox.elapsed;
    if ((stack === 2) && (s <= 8))
      aetherflowStackBox.parentNode.classList.add('too-much-stacks');
    else
      aetherflowStackBox.parentNode.classList.remove('too-much-stacks');

    // Show time remain when summoning/trancing.
    // Turn blue when buhamut ready, and turn orange when firebird ready.
    // Also change tranceBox color.
    demiSummoningBox.innerText = '';
    demiSummoningBox.parentNode.classList.remove('bahamutready', 'firebirdready');
    tranceBox.fg = computeBackgroundColorFrom(tranceBox, 'smn-color-trance');
    if (time > 0) {
      demiSummoningBox.innerText = time.toString();
    } else if (jobDetail.dreadwyrmStacks === 2) {
      demiSummoningBox.parentNode.classList.add('bahamutready');
    } else if (jobDetail.phoenixReady) {
      demiSummoningBox.parentNode.classList.add('firebirdready');
      tranceBox.fg = computeBackgroundColorFrom(tranceBox, 'smn-color-demisummon.firebirdready');
    }

    // Turn red when only 7s summoning time remain, to alarm that cast the second Enkindle.
    // Also alarm that don't cast a spell that has cast time, or a WW/SF will be missed.
    // Turn red when only 2s trancing time remain, to alarm that cast deathflare.
    if (time <= 7 && summoned === 1)
      demiSummoningBox.parentNode.classList.add('last');
    else if (time > 0 && time <= 2 && summoned === 0)
      demiSummoningBox.parentNode.classList.add('last');
    else
      demiSummoningBox.parentNode.classList.remove('last');
  });

  bars.onUseAbility((id) => {
    switch (id) {
      case kAbility.Miasma:
      case kAbility.Miasma3:
        miasmaBox.duration = 30;
        break;
      case kAbility.BioSmn:
      case kAbility.BioSmn2:
      case kAbility.Bio3:
        bioSmnBox.duration = 30;
        break;
      case kAbility.Tridisaster:
        // Tridisaster refresh miasma and bio both, so repeat below.
        // TODO: remake onXxx like node's EventEmitter
        miasmaBox.duration = 30;
        bioSmnBox.duration = 30;
        break;
      case kAbility.EnergyDrain:
      case kAbility.EnergySiphon:
        energyDrainBox.duration = 30;
        aetherflowStackBox.parentNode.classList.remove('too-much-stacks');
        break;
      case kAbility.DreadwyrmTrance:
      case kAbility.FirebirdTrance:
        // Trance cooldown is 55s,
        // but wait till 60s will be better on matching raidbuffs.
        // Threshold will be used to tell real cooldown.
        tranceBox.duration = 60;
        break;
    }
  });

  bars.onStatChange('SMN', ({ gcdSpell }) => {
    miasmaBox.valuescale = gcdSpell;
    miasmaBox.threshold = gcdSpell + 1;
    bioSmnBox.valuescale = gcdSpell;
    bioSmnBox.threshold = gcdSpell + 1;
    energyDrainBox.valuescale = gcdSpell;
    energyDrainBox.threshold = gcdSpell + 1;
    tranceBox.valuescale = gcdSpell;
    tranceBox.threshold = gcdSpell + 7;
  });

  resetFunc = (_bars: Bars): void => {
    furtherRuin = 0;
    refreshFurtherRuin();
    miasmaBox.duration = 0;
    bioSmnBox.duration = 0;
    energyDrainBox.duration = 0;
    tranceBox.duration = 0;
  };
};

export const reset = (bars: Bars): void => {
  if (resetFunc)
    resetFunc(bars);
};
