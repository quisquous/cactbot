import EffectId from '../../../resources/effect_id';
import ResourceBar from '../../../resources/resourcebar';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { kAbility } from '../constants';
import { PartialFieldMatches } from '../event_emitter';

import { BaseComponent, ComponentInterface } from './base';

export class RDMComponent extends BaseComponent {
  whiteManaBar: ResourceBar;
  blackManaBar: ResourceBar;
  whiteManaBox: ResourceBox;
  blackManaBox: ResourceBox;
  whiteProc: TimerBox;
  blackProc: TimerBox;
  lucidBox: TimerBox;

  constructor(o: ComponentInterface) {
    super(o);
    const container = this.bars.addJobBarContainer();

    const incs = 20;
    for (let i = 0; i < 100; i += incs) {
      const marker = document.createElement('div');
      marker.classList.add('marker');
      marker.classList.add((i % 40 === 0) ? 'odd' : 'even');
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
      fgColor: 'rdm-color-white-mana',
      threshold: 1000,
    });
    this.whiteProc.bigatzero = false;
    this.blackProc = this.bars.addProcBox({
      id: 'rdm-procs-black',
      fgColor: 'rdm-color-black-mana',
      threshold: 1000,
    });
    this.blackProc.bigatzero = false;

    this.lucidBox = this.bars.addProcBox({
      id: 'rdm-procs-lucid',
      fgColor: 'rdm-color-lucid',
    });

    this.reset();
  }

  override onUseAbility(id: string): void {
    if (id === kAbility.LucidDreaming)
      this.lucidBox.duration = 60;
  }
  override onStatChange({ gcdSpell }: { gcdSpell: number }): void {
    this.lucidBox.valuescale = gcdSpell;
    this.lucidBox.threshold = gcdSpell + 1;
  }

  override onJobDetailUpdate(jobDetail: JobDetail['RDM']): void {
    const white = jobDetail.whiteMana.toString();
    const black = jobDetail.blackMana.toString();

    this.whiteManaBar.value = white;
    this.blackManaBar.value = black;

    if (this.whiteManaBox.innerText !== white) {
      this.whiteManaBox.innerText = white;
      const p = this.whiteManaBox.parentNode;
      if (jobDetail.whiteMana < 80)
        p.classList.add('dim');
      else
        p.classList.remove('dim');
    }
    if (this.blackManaBox.innerText !== black) {
      this.blackManaBox.innerText = black;
      const p = this.blackManaBox.parentNode;
      if (jobDetail.blackMana < 80)
        p.classList.add('dim');
      else
        p.classList.remove('dim');
    }
  }

  override onYouGainEffect(id: string, matches: PartialFieldMatches<'GainsEffect'>): void {
    if (id === EffectId.VerstoneReady)
      this.whiteProc.duration = parseFloat(matches.duration ?? '0') - this.player.gcdSpell;
    if (id === EffectId.VerfireReady) {
      this.blackProc.duration = 0;
      this.blackProc.duration = parseFloat(matches.duration ?? '0') - this.player.gcdSpell;
    }
  }
  override onYouLoseEffect(id: string) :void {
    if (id === EffectId.VerstoneReady)
      this.whiteProc.duration = 0;
    if (id === EffectId.VerfireReady)
      this.blackProc.duration = 0;
  }

  override reset(): void {
    this.lucidBox.duration = 0;
    this.whiteProc.duration = 0;
    this.blackProc.duration = 0;
  }
}

