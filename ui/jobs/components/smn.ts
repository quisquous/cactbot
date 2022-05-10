import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { kAbility } from '../constants';
import { computeBackgroundColorFrom } from '../utils';

import { BaseComponent, ComponentInterface } from './base';

export class SMNComponent extends BaseComponent {
  aetherflowStackBox: ResourceBox;
  demiSummoningBox: ResourceBox;
  energyDrainBox: TimerBox;
  tranceBox: TimerBox;
  lucidBox: TimerBox;
  rubyStacks: HTMLDivElement[];
  topazStacks: HTMLDivElement[];
  emeraldStacks: HTMLDivElement[];

  constructor(o: ComponentInterface) {
    super(o);
    // Resource box
    this.demiSummoningBox = this.bars.addResourceBox({
      classList: ['smn-color-demisummon'],
    });
    this.aetherflowStackBox = this.bars.addResourceBox({
      classList: ['smn-color-aetherflow'],
    });
    // Proc box
    this.energyDrainBox = this.bars.addProcBox({
      id: 'smn-procs-energydrain',
      fgColor: 'smn-color-energydrain',
    });
    this.tranceBox = this.bars.addProcBox({
      id: 'smn-procs-trance',
      fgColor: 'smn-color-trance',
    });
    this.lucidBox = this.bars.addProcBox({
      id: 'smn-procs-lucid',
      fgColor: 'smn-color-lucid',
    });

    // Arcanum and Attunement Guage
    const stacksContainer = document.createElement('div');
    stacksContainer.id = 'smn-stacks';
    stacksContainer.classList.add('stacks');
    this.bars.addJobBarContainer().appendChild(stacksContainer);

    const rubyStacksContainer = document.createElement('div');
    rubyStacksContainer.id = 'smn-stacks-ruby';
    stacksContainer.appendChild(rubyStacksContainer);

    const topazStacksContainer = document.createElement('div');
    topazStacksContainer.id = 'smn-stacks-topaz';
    stacksContainer.appendChild(topazStacksContainer);

    const emeraldStacksContainer = document.createElement('div');
    emeraldStacksContainer.id = 'smn-stacks-emerald';
    stacksContainer.appendChild(emeraldStacksContainer);

    this.rubyStacks = [];
    this.topazStacks = [];
    this.emeraldStacks = [];

    for (let i = 0; i < 2; i++) {
      const rubyStack = document.createElement('div');
      rubyStacksContainer.appendChild(rubyStack);
      this.rubyStacks.push(rubyStack);
    }
    for (let i = 0; i < 4; i++) {
      const topazStack = document.createElement('div');
      topazStacksContainer.appendChild(topazStack);
      this.topazStacks.push(topazStack);
    }
    for (let i = 0; i < 4; i++) {
      const emeraldStack = document.createElement('div');
      emeraldStacksContainer.appendChild(emeraldStack);
      this.emeraldStacks.push(emeraldStack);
    }

    this.reset();
  }

  private _addActiveOnStacks(elements: HTMLDivElement[], stacks: number) {
    for (let i = 0; i < elements.length; i++)
      elements[i]?.classList.toggle('active', i < stacks);
  }

  override onJobDetailUpdate(jobDetail: JobDetail['SMN']): void {
    // assert this is running on a 6.x server
    if (('bahamutStance' in jobDetail))
      return;

    // Aetherflow Guage
    const stack = jobDetail.aetherflowStacks;
    this.aetherflowStackBox.innerText = stack.toString();

    // Demi-summoning Guage
    const time = Math.ceil(
      Math.max(jobDetail.tranceMilliseconds, jobDetail.attunementMilliseconds
        ) / 1000);
    this.demiSummoningBox.innerText = '';
    if (time > 0)
      this.demiSummoningBox.innerText = time.toString();

    this.demiSummoningBox.parentNode.classList.toggle('bahamutready', jobDetail.nextSummoned === 'Bahamut');
    this.demiSummoningBox.parentNode.classList.toggle('firebirdready', jobDetail.nextSummoned === 'Phoenix');
    this.demiSummoningBox.parentNode.classList.toggle('garuda', jobDetail.activePrimal === 'Garuda');
    this.demiSummoningBox.parentNode.classList.toggle('titan', jobDetail.activePrimal === 'Titan');
    this.demiSummoningBox.parentNode.classList.toggle('ifrit', jobDetail.activePrimal === 'Ifrit');

    this.tranceBox.fg = computeBackgroundColorFrom(this.tranceBox, 'smn-color-trance');
    if (jobDetail.nextSummoned === 'Phoenix')
      this.tranceBox.fg = computeBackgroundColorFrom(this.tranceBox, 'smn-color-demisummon.firebirdready');

    // Arcanum and Attunement Guage
    this._addActiveOnStacks(this.rubyStacks, (jobDetail.activePrimal === 'Ifrit') ? jobDetail.attunement : (jobDetail.usableArcanum.includes('Ruby') ? 2 : 0));
    this._addActiveOnStacks(this.topazStacks, (jobDetail.activePrimal === 'Titan') ? jobDetail.attunement : (jobDetail.usableArcanum.includes('Topaz') ? 4 : 0));
    this._addActiveOnStacks(this.emeraldStacks, (jobDetail.activePrimal === 'Garuda') ? jobDetail.attunement : (jobDetail.usableArcanum.includes('Emerald') ? 4 : 0));

    // dynamically change threshold of tranceBox, let user know you should use arcanum quickly
    this.tranceBox.threshold = this.player.gcdSpell * (jobDetail.usableArcanum.length * 3 + 1);
  }

  override onUseAbility(id: string): void {
    switch (id) {
      case kAbility.EnergyDrain:
      case kAbility.EnergySiphon:
        this.energyDrainBox.duration = 60;
        break;
      case kAbility.SummonBahamut:
      case kAbility.SummonPhoenix:
      case kAbility.Aethercharge:
      case kAbility.DreadwyrmTrance:
        this.tranceBox.duration = this.bars.player.getActionCooldown(60000, 'spell');
        break;
      case kAbility.LucidDreaming:
        this.lucidBox.duration = 60;
        break;
    }
  }

  override onStatChange({ gcdSpell }: { gcdSpell: number }): void {
    this.energyDrainBox.valuescale = gcdSpell;
    this.energyDrainBox.threshold = gcdSpell + 1;
    this.tranceBox.valuescale = gcdSpell;
    this.lucidBox.valuescale = gcdSpell;
    this.lucidBox.threshold = gcdSpell + 1;
  }

  override reset(): void {
    this.energyDrainBox.duration = 0;
    this.tranceBox.duration = 0;
    this.lucidBox.duration = 0;
    this.tranceBox.fg = computeBackgroundColorFrom(this.tranceBox, 'smn-color-trance');
  }
}

