import EffectId from '../../../resources/effect_id';
import ResourceBar from '../../../resources/resourcebar';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { kAbility } from '../constants';
import { PartialFieldMatches } from '../event_emitter';
import { computeBackgroundColorFrom } from '../utils';

import { BaseComponent, ComponentInterface } from './base';

export class RDMComponent extends BaseComponent {
  whiteManaBar: ResourceBar;
  blackManaBar: ResourceBar;
  whiteManaBox: ResourceBox;
  blackManaBox: ResourceBox;
  whiteProc: TimerBox;
  blackProc: TimerBox;
  flecheBox: TimerBox;
  contreSixteBox: TimerBox;
  stacksContainer: HTMLDivElement;
  manaStacks: HTMLElement[] = [];

  constructor(o: ComponentInterface) {
    super(o);
    const container = this.bars.addJobBarContainer();

    const incs = 25;
    for (let i = 0; i < 100; i += incs) {
      const marker = document.createElement('div');
      marker.classList.add('marker');
      marker.classList.add(i % 50 === 0 ? 'odd' : 'even');
      container.appendChild(marker);
      marker.style.left = `${i}%`;
      marker.style.width = `${incs}%`;
    }

    this.whiteManaBar = this.bars.addResourceBar({
      id: 'rdm-white-bar',
      fgColor: 'rdm-color-white-mana',
      maxvalue: 100,
    });

    this.blackManaBar = this.bars.addResourceBar({
      id: 'rdm-black-bar',
      fgColor: 'rdm-color-black-mana',
      maxvalue: 100,
    });

    this.whiteManaBox = this.bars.addResourceBox({
      classList: ['rdm-color-white-mana'],
    });

    this.blackManaBox = this.bars.addResourceBox({
      classList: ['rdm-color-black-mana'],
    });

    this.whiteProc = this.bars.addProcBox({
      id: 'rdm-procs-white',
      fgColor: 'rdm-color-stone',
      threshold: 1000,
    });
    this.whiteProc.bigatzero = false;
    this.blackProc = this.bars.addProcBox({
      id: 'rdm-procs-black',
      fgColor: 'rdm-color-fire',
      threshold: 1000,
    });
    this.blackProc.bigatzero = false;

    this.flecheBox = this.bars.addProcBox({
      id: 'rdm-procs-fleche',
      fgColor: 'rdm-color-fleche',
    });

    this.contreSixteBox = this.bars.addProcBox({
      id: 'rdm-procs-contresixte',
      fgColor: 'rdm-color-contresixte',
    });

    this.stacksContainer = document.createElement('div');
    this.stacksContainer.id = 'rdm-stacks';
    this.stacksContainer.classList.add('stacks', 'hide');
    this.bars.addJobBarContainer().appendChild(this.stacksContainer);
    const manaStackContainer = document.createElement('div');
    manaStackContainer.id = 'rdm-stacks-manastack';
    this.stacksContainer.appendChild(manaStackContainer);

    for (let i = 0; i < 3; ++i) {
      const d = document.createElement('div');
      manaStackContainer.appendChild(d);
      this.manaStacks.push(d);
    }

    this.reset();
  }

  override onUseAbility(id: string): void {
    if (id === kAbility.Fleche)
      this.flecheBox.duration = 25;
    if (id === kAbility.ContreSixte)
      this.contreSixteBox.duration = this.player.level < 74 ? 45 : 35;
  }
  override onStatChange({ gcdSpell }: { gcdSpell: number }): void {
    this.flecheBox.valuescale = gcdSpell;
    this.flecheBox.threshold = gcdSpell + 1;
    this.contreSixteBox.valuescale = gcdSpell;
    this.contreSixteBox.threshold = gcdSpell + 1;
  }

  override onJobDetailUpdate(jobDetail: JobDetail['RDM']): void {
    const white = jobDetail.whiteMana.toString();
    const black = jobDetail.blackMana.toString();

    this.whiteManaBar.value = white;
    this.blackManaBar.value = black;

    if (this.whiteManaBox.innerText !== white) {
      this.whiteManaBox.innerText = white;
      this.whiteManaBox.parentNode.classList.toggle('dim', jobDetail.whiteMana < 50);
      this.whiteManaBar.fg = computeBackgroundColorFrom(this.whiteManaBar, jobDetail.whiteMana < 50 ? 'rdm-color-white-mana.dim' : 'rdm-color-white-mana');
    }
    if (this.blackManaBox.innerText !== black) {
      this.blackManaBox.innerText = black;
      this.blackManaBox.parentNode.classList.toggle('dim', jobDetail.blackMana < 50);
      this.blackManaBar.fg = computeBackgroundColorFrom(this.blackManaBar, jobDetail.blackMana < 50 ? 'rdm-color-black-mana.dim' : 'rdm-color-black-mana');
    }

    this.stacksContainer.classList.toggle('hide', jobDetail.manaStacks === 0);
    for (let i = 0; i < 3; ++i) {
      if (jobDetail.manaStacks > i)
        this.manaStacks[i]?.classList.add('active');
      else
        this.manaStacks[i]?.classList.remove('active');
      }
  }

  override onYouGainEffect(id: string, matches: PartialFieldMatches<'GainsEffect'>): void {
    if (id === EffectId.VerstoneReady)
      this.whiteProc.duration = parseFloat(matches.duration ?? '0') - (this.player.gcdSpell * 0.8 - 0.5);
    if (id === EffectId.VerfireReady)
      this.blackProc.duration = parseFloat(matches.duration ?? '0') - (this.player.gcdSpell * 0.8 - 0.5);
  }
  override onYouLoseEffect(id: string) :void {
    if (id === EffectId.VerstoneReady)
      this.whiteProc.duration = 0;
    if (id === EffectId.VerfireReady)
      this.blackProc.duration = 0;
  }

  override reset(): void {
    this.flecheBox.duration = 0;
    this.contreSixteBox.duration = 0;
    this.whiteProc.duration = 0;
    this.blackProc.duration = 0;
  }
}
