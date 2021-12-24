import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { kAbility, patch5xEffectId } from '../constants';
import { PartialFieldMatches } from '../event_emitter';
import { computeBackgroundColorFrom } from '../utils';

import { BaseComponent, ComponentInterface } from './base';

export class SMNComponent extends BaseComponent {
  constructor(o: ComponentInterface) {
    super(o);
  }
}

export class SMN5xComponent extends BaseComponent {
  aetherflowStackBox: ResourceBox;
  demiSummoningBox: ResourceBox;
  miasmaBox: TimerBox;
  bioSmnBox: TimerBox;
  energyDrainBox: TimerBox;
  tranceBox: TimerBox;

  furtherRuin = 0;
  ruin4Stacks: HTMLElement[] = [];

  constructor(o: ComponentInterface) {
    super(o);
    this.aetherflowStackBox = this.bars.addResourceBox({
      classList: ['smn-color-aetherflow'],
    });

    this.demiSummoningBox = this.bars.addResourceBox({
      classList: ['smn-color-demisummon'],
    });

    this.miasmaBox = this.bars.addProcBox({
      id: 'smn-procs-miasma',
      fgColor: 'smn-color-miasma',
      notifyWhenExpired: true,
    });

    this.bioSmnBox = this.bars.addProcBox({
      id: 'smn-procs-biosmn',
      fgColor: 'smn-color-biosmn',
      notifyWhenExpired: true,
    });

    this.energyDrainBox = this.bars.addProcBox({
      id: 'smn-procs-energydrain',
      fgColor: 'smn-color-energydrain',
    });

    this.tranceBox = this.bars.addProcBox({
      id: 'smn-procs-trance',
      fgColor: 'smn-color-trance',
    });

    // FurtherRuin Stack Gauge
    const stacksContainer = document.createElement('div');
    stacksContainer.id = 'smn-stacks';
    this.bars.addJobBarContainer().appendChild(stacksContainer);
    const ruin4Container = document.createElement('div');
    ruin4Container.id = 'smn-stacks-ruin4';
    stacksContainer.appendChild(ruin4Container);
    for (let i = 0; i < 4; ++i) {
      const d = document.createElement('div');
      ruin4Container.appendChild(d);
      this.ruin4Stacks.push(d);
    }

    this.reset();
  }
  refreshFurtherRuin(): void {
    for (let i = 0; i < 4; ++i) {
      if (this.furtherRuin > i)
        this.ruin4Stacks[i]?.classList.add('active');
      else
        this.ruin4Stacks[i]?.classList.remove('active');
    }
  }

  override onYouGainEffect(id: string, matches: PartialFieldMatches<'GainsEffect'>): void {
    if (id === patch5xEffectId.FurtherRuin5x) {
      this.furtherRuin = parseInt(matches.count ?? '0');
      this.refreshFurtherRuin();
    }
  }
  override onYouLoseEffect(id: string): void {
    if (id === patch5xEffectId.FurtherRuin5x) {
      this.furtherRuin = 0;
      this.refreshFurtherRuin();
    }
  }
  onZoneChange(): void {
    this.furtherRuin = 0;
    this.refreshFurtherRuin();
  }

  override onJobDetailUpdate(jobDetail: JobDetail['SMN']): void {
    // assert this is running on a 5.x server (i.e. CN/KR)
    if (!('bahamutStance' in jobDetail))
      return;

    const stack = jobDetail.aetherflowStacks;
    const summoned = jobDetail.bahamutSummoned;
    const time = Math.ceil(jobDetail.stanceMilliseconds / 1000);

    // turn red when you have too much stacks before EnergyDrain ready.
    this.aetherflowStackBox.innerText = stack.toString();
    const s = this.energyDrainBox.duration ?? 0 - this.energyDrainBox.elapsed;
    if ((stack === 2) && (s <= 8))
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
      this.demiSummoningBox.innerText = time.toString();
    } else if (jobDetail.dreadwyrmStacks === 2) {
      this.demiSummoningBox.parentNode.classList.add('bahamutready');
    } else if (jobDetail.phoenixReady) {
      this.demiSummoningBox.parentNode.classList.add('firebirdready');
      this.tranceBox.fg = computeBackgroundColorFrom(this.tranceBox, 'smn-color-demisummon.firebirdready');
    }

    // Turn red when only 7s summoning time remain, to alarm that cast the second Enkindle.
    // Also alarm that don't cast a spell that has cast time, or a WW/SF will be missed.
    // Turn red when only 2s trancing time remain, to alarm that cast deathflare.
    if (time <= 7 && summoned === 1)
      this.demiSummoningBox.parentNode.classList.add('last');
    else if (time > 0 && time <= 2 && summoned === 0)
      this.demiSummoningBox.parentNode.classList.add('last');
    else
      this.demiSummoningBox.parentNode.classList.remove('last');
  }

  override onUseAbility(id: string): void {
    switch (id) {
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
        // Tridisaster refresh miasma and bio both, so repeat below.
        // TODO: remake onXxx like node's EventEmitter
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
        // Trance cooldown is 55s,
        // but wait till 60s will be better on matching raidbuffs.
        // Threshold will be used to tell real cooldown.
        this.tranceBox.duration = 60;
        break;
    }
  }

  override onStatChange({ gcdSpell }: { gcdSpell: number }): void {
    this.miasmaBox.valuescale = gcdSpell;
    this.miasmaBox.threshold = gcdSpell + 1;
    this.bioSmnBox.valuescale = gcdSpell;
    this.bioSmnBox.threshold = gcdSpell + 1;
    this.energyDrainBox.valuescale = gcdSpell;
    this.energyDrainBox.threshold = gcdSpell + 1;
    this.tranceBox.valuescale = gcdSpell;
    this.tranceBox.threshold = gcdSpell + 7;
  }

  override reset(): void {
    this.furtherRuin = 0;
    this.refreshFurtherRuin();
    this.miasmaBox.duration = 0;
    this.bioSmnBox.duration = 0;
    this.energyDrainBox.duration = 0;
    this.tranceBox.duration = 0;
  }
}
