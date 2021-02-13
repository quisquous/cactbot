import EffectId from '../../../resources/effect_id.js';
import { kAbility } from '../constants.js';
import { computeBackgroundColorFrom } from '../utils.js';

export function setupSmn(bars) {
  const aetherflowStackBox = bars.addResourceBox({
    classList: ['smn-color-aetherflow'],
  });

  const demiSummoningBox = bars.addResourceBox({
    classList: ['smn-color-demisummon'],
  });

  const miasmaBox = bars.addProcBox({
    id: 'smn-procs-miasma',
    fgColor: 'smn-color-miasma',
  });

  const bioSmnBox = bars.addProcBox({
    id: 'smn-procs-biosmn',
    fgColor: 'smn-color-biosmn',
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
  const ruin4Stacks = [];
  for (let i = 0; i < 4; ++i) {
    const d = document.createElement('div');
    ruin4Container.appendChild(d);
    ruin4Stacks.push(d);
  }

  let furtherRuin = 0;
  const refreshFurtherRuin = () => {
    for (let i = 0; i < 4; ++i) {
      if (furtherRuin > i)
        ruin4Stacks[i].classList.add('active');
      else
        ruin4Stacks[i].classList.remove('active');
    }
  };
  bars.gainEffectFuncMap[EffectId.FurtherRuin] = (name, e) => {
    furtherRuin = parseInt(e.count);
    refreshFurtherRuin();
  };
  bars.loseEffectFuncMap[EffectId.FurtherRuin] = () => {
    furtherRuin = 0;
    refreshFurtherRuin();
  };
  bars.changeZoneFuncs.push((e) => {
    furtherRuin = 0;
    refreshFurtherRuin();
  });

  bars.onJobDetailUpdate((jobDetail) => {
    const stack = jobDetail.aetherflowStacks;
    const summoned = jobDetail.bahamutSummoned;
    const time = Math.ceil(jobDetail.stanceMilliseconds / 1000);

    // turn red when you have too much stacks before EnergyDrain ready.
    aetherflowStackBox.innerText = stack;
    const s = parseFloat(energyDrainBox.duration || 0) - parseFloat(energyDrainBox.elapsed);
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
      demiSummoningBox.innerText = time;
    } else if (jobDetail.dreadwyrmStacks === 2) {
      demiSummoningBox.parentNode.classList.add('bahamutready');
    } else if (jobDetail.phoenixReady) {
      demiSummoningBox.parentNode.classList.add('firebirdready');
      tranceBox.fg = computeBackgroundColorFrom(tranceBox, 'smn-color-demisummon.firebirdready');
    }

    // Turn red when only 7s summoning time remain, to alarm that cast the second Enkindle.
    // Also alarm that don't cast a spell that has cast time, or a WW/SF will be missed.
    // Turn red when only 2s trancing time remain, to alarm that cast deathflare.
    if (time <= 7 && summoned === 3)
      demiSummoningBox.parentNode.classList.add('last');
    else if (time > 0 && time <= 2 && summoned === 0)
      demiSummoningBox.parentNode.classList.add('last');
    else
      demiSummoningBox.parentNode.classList.remove('last');
  });

  bars.onUseAbility(kAbility.Miasma, () => {
    miasmaBox.duration = 0;
    miasmaBox.duration = 30;
  });
  bars.onUseAbility(kAbility.Miasma3, () => {
    miasmaBox.duration = 0;
    miasmaBox.duration = 30;
  });
  bars.onUseAbility(kAbility.BioSmn, () => {
    bioSmnBox.duration = 0;
    bioSmnBox.duration = 30;
  });
  bars.onUseAbility(kAbility.BioSmn2, () => {
    bioSmnBox.duration = 0;
    bioSmnBox.duration = 30;
  });
  bars.onUseAbility(kAbility.Bio3, () => {
    bioSmnBox.duration = 0;
    bioSmnBox.duration = 30;
  });
  bars.onUseAbility(kAbility.Tridisaster, () => {
    miasmaBox.duration = 0;
    miasmaBox.duration = 30;
    bioSmnBox.duration = 0;
    bioSmnBox.duration = 30;
  });

  bars.onUseAbility(kAbility.EnergyDrain, () => {
    energyDrainBox.duration = 0;
    energyDrainBox.duration = 30;
    aetherflowStackBox.parentNode.classList.remove('too-much-stacks');
  });
  bars.onUseAbility(kAbility.EnergySiphon, () => {
    energyDrainBox.duration = 0;
    energyDrainBox.duration = 30;
    aetherflowStackBox.parentNode.classList.remove('too-much-stacks');
  });
  // Trance cooldown is 55s,
  // but wait till 60s will be better on matching raidbuffs.
  // Threshold will be used to tell real cooldown.
  bars.onUseAbility(kAbility.DreadwyrmTrance, () => {
    tranceBox.duration = 0;
    tranceBox.duration = 60;
  });
  bars.onUseAbility(kAbility.FirebirdTrance, () => {
    tranceBox.duration = 0;
    tranceBox.duration = 60;
  });

  bars.statChangeFuncMap['SMN'] = () => {
    miasmaBox.valuescale = bars.gcdSpell;
    miasmaBox.threshold = bars.gcdSpell + 1;
    bioSmnBox.valuescale = bars.gcdSpell;
    bioSmnBox.threshold = bars.gcdSpell + 1;
    energyDrainBox.valuescale = bars.gcdSpell;
    energyDrainBox.threshold = bars.gcdSpell + 1;
    tranceBox.valuescale = bars.gcdSpell;
    tranceBox.threshold = bars.gcdSpell + 7;
  };
}
