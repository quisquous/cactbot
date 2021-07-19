import EffectId from '../../../resources/effect_id';
import { kAbility } from '../constants';
import { computeBackgroundColorFrom } from '../utils';
import { BaseComponent } from './base';


export default class SmnComponent extends BaseComponent {
  constructor(bars) {
    super(bars);

    this.aetherflowStackBox = this.addResourceBox({
      classList: ['smn-color-aetherflow'],
    });

    this.demiSummoningBox = this.addResourceBox({
      classList: ['smn-color-demisummon'],
    });

    this.miasmaBox = this.addProcBox({
      id: 'smn-procs-miasma',
      fgColor: 'smn-color-miasma',
      notifyWhenExpired: true,
    });

    this.bioSmnBox = this.addProcBox({
      id: 'smn-procs-biosmn',
      fgColor: 'smn-color-biosmn',
      notifyWhenExpired: true,
    });

    this.energyDrainBox = this.addProcBox({
      id: 'smn-procs-energydrain',
      fgColor: 'smn-color-energydrain',
    });

    this.tranceBox = this.addProcBox({
      id: 'smn-procs-trance',
      fgColor: 'smn-color-trance',
    });

    // FurtherRuin Stack Gauge
    const stacksContainer = document.createElement('div');
    stacksContainer.id = 'smn-stacks';
    this.addCustomBar(stacksContainer);
    const ruin4Container = document.createElement('div');
    ruin4Container.id = 'smn-stacks-ruin4';
    stacksContainer.appendChild(ruin4Container);
    this.ruin4Stacks = [];
    for (let i = 0; i < 4; ++i) {
      const d = document.createElement('div');
      ruin4Container.appendChild(d);
      this.ruin4Stacks.push(d);
    }
  }

  onGainEffect(effectId, matches) {
    switch (effectId) {
    case EffectId.FurtherRuin:
      this.refreshFurtherRuin(parseInt(matches.count));
      break;

    default:
      break;
    }
  }

  onLoseEffect(effectId) {
    switch (effectId) {
    case EffectId.FurtherRuin:
      this.refreshFurtherRuin(0);
      break;

    default:
      break;
    }
  }

  onUseAbility(actionId) {
    switch (actionId) {
    case kAbility.Miasma:
    case kAbility.Miasma3:
      this.miasmaBox.duration = 30;
      break;

    case kAbility.BioSmn:
    case kAbility.BioSmn2:
    case kAbility.Bio3:
      this.bioSmnBox.duration = 30;
      break;

    case kAbility.Tridisaster:
      this.miasmaBox.duration = 30;
      this.bioSmnBox.duration = 30;
      break;

    case kAbility.EnergyDrain:
    case kAbility.EnergySiphon:
      this.energyDrainBox.duration = 30;
      this.aetherflowStackBox.parentNode.classList.remove('too-much-stacks');
      break;

    case kAbility.DreadwyrmTrance:
    case kAbility.FirebirdTrance:
      this.tranceBox.duration = 60;
      break;

    default:
      break;
    }
  }

  onJobDetailUpdate(jobDetail) {
    const stack = jobDetail.aetherflowStacks;
    const summoned = jobDetail.bahamutSummoned;
    const time = Math.ceil(jobDetail.stanceMilliseconds / 1000);

    // turn red when you have too much stacks before EnergyDrain ready.
    // TODO: technically this should be registered to the `TimerBox` that would call a callback
    // function when the remaining time become some value. But there isn't.
    // FIXME: This stack box would got no update in some situation so that the color may not
    // reaction immediately when its remaining time hits 8.
    // Although `onJobDetailUpdate` function would be invoked when player moves or doing something
    // that changed their parameters, which is usually happened in a dungeon every second.
    // It shouldn't be a noticable issue, but note here that this is not a obvious approach.
    this.aetherflowStackBox.innerText = stack;
    const s = this.energyDrainBox.value;
    if (stack === 2 && s <= 8)
      this.aetherflowStackBox.parentNode.classList.add('too-much-stacks');
    else
      this.aetherflowStackBox.parentNode.classList.remove('too-much-stacks');

    // Show time remain when summoning/trancing.
    // Turn blue when buhamut ready, and turn orange when firebird ready.
    // Also change tranceBox color.
    this.demiSummoningBox.innerText = '';
    this.demiSummoningBox.parentNode.classList.remove('bahamutready', 'firebirdready');
    this.tranceBox.fg = computeBackgroundColorFrom(this.tranceBox, 'smn-color-trance');
    if (time > 0) {
      this.demiSummoningBox.innerText = time;
    } else if (jobDetail.dreadwyrmStacks === 2) {
      this.demiSummoningBox.parentNode.classList.add('bahamutready');
    } else if (jobDetail.phoenixReady) {
      this.demiSummoningBox.parentNode.classList.add('firebirdready');
      this.tranceBox.fg = computeBackgroundColorFrom(this.tranceBox, 'smn-color-demisummon.firebirdready');
    }

    // Turn red when only 7s summoning time remain, to alarm that cast the second Enkindle.
    // Also alarm that don't cast a spell that has cast time, or a WW/SF will be missed.
    // Turn red when only 2s trancing time remain, to alarm that cast deathflare.
    if (time <= 7 && summoned === 3)
      this.demiSummoningBox.parentNode.classList.add('last');
    else if (time > 0 && time <= 2 && summoned === 0)
      this.demiSummoningBox.parentNode.classList.add('last');
    else
      this.demiSummoningBox.parentNode.classList.remove('last');
  }

  onStatChange(stats) {
    this.miasmaBox.valuescale = stats.gcdSpell;
    this.miasmaBox.threshold = stats.gcdSpell + 1;
    this.bioSmnBox.valuescale = stats.gcdSpell;
    this.bioSmnBox.threshold = stats.gcdSpell + 1;
    this.energyDrainBox.valuescale = stats.gcdSpell;
    this.energyDrainBox.threshold = stats.gcdSpell + 1;
    this.tranceBox.valuescale = stats.gcdSpell;
    this.tranceBox.threshold = stats.gcdSpell + 7;
  }

  onZoneChange() {
    this.refreshFurtherRuin(0);
  }

  reset() {
    this.refreshFurtherRuin(0);
    this.miasmaBox.duration = 0;
    this.bioSmnBox.duration = 0;
    this.energyDrainBox.duration = 0;
    this.tranceBox.duration = 0;
  }

  refreshFurtherRuin(furtherRuinCount) {
    for (let i = 0; i < 4; ++i) {
      if (furtherRuinCount > i)
        this.ruin4Stacks[i].classList.add('active');
      else
        this.ruin4Stacks[i].classList.remove('active');
    }
  }
}
