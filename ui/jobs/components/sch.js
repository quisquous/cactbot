import { kAbility } from '../constants';
import { BaseComponent } from './base';

export default class SchComponent extends BaseComponent {
  constructor(bars) {
    super(bars);

    this.aetherflowStackBox = this.addResourceBox({
      classList: ['sch-color-aetherflow'],
    });

    this.fairyGaugeBox = this.addResourceBox({
      classList: ['sch-color-fairygauge'],
    });

    this.bioBox = this.addProcBox({
      id: 'sch-procs-bio',
      fgColor: 'sch-color-bio',
      notifyWhenExpired: true,
    });

    this.aetherflowBox = this.addProcBox({
      id: 'sch-procs-aetherflow',
      fgColor: 'sch-color-aetherflow',
    });

    this.lucidBox = this.addProcBox({
      id: 'sch-procs-luciddreaming',
      fgColor: 'sch-color-lucid',
    });
  }

  onJobDetailUpdate(jobDetail) {
    const aetherflow = jobDetail.aetherflowStacks;
    const fairygauge = jobDetail.fairyGauge;
    const milli = Math.ceil(jobDetail.fairyMilliseconds / 1000);
    this.aetherflowStackBox.innerText = aetherflow;
    this.fairyGaugeBox.innerText = fairygauge;
    const f = this.fairyGaugeBox.parentNode;
    if (jobDetail.fairyMilliseconds !== 0) {
      f.classList.add('bright');
      this.fairyGaugeBox.innerText = milli;
    } else {
      f.classList.remove('bright');
      this.fairyGaugeBox.innerText = fairygauge;
    }

    // dynamically annouce user depends on their aetherflow stacks right now
    this.aetherflowBox.threshold = this.player.gcdSpell * (aetherflow || 1) + 1;

    const p = this.aetherflowStackBox.parentNode;
    const s = this.aetherflowBox.value;
    if (parseFloat(aetherflow) * 5 >= s) {
      // turn red when stacks are too much before AF ready
      p.classList.add('too-much-stacks');
    } else {
      p.classList.remove('too-much-stacks');
    }
  }

  onUseAbility(abilityId) {
    switch (abilityId) {
      case kAbility.Bio:
      case kAbility.Bio2:
      case kAbility.Biolysis:
        this.bioBox.duration = 30;
        break;

      case kAbility.Aetherflow:
        this.aetherflowBox.duration = 60;
        this.aetherflowStackBox.parentNode.classList.remove('too-much-stacks');
        break;

      case kAbility.LucidDreaming:
        this.lucidBox.duration = 60;
        break;

      default:
        break;
    }
  }

  onStatChange(stats) {
    this.bioBox.valuescale = stats.gcdSpell;
    this.bioBox.threshold = stats.gcdSpell + 1;
    this.aetherflowBox.valuescale = stats.gcdSpell;
    this.lucidBox.valuescale = stats.gcdSpell;
    this.lucidBox.threshold = stats.gcdSpell + 1;
  }

  reset() {
    this.bioBox.duration = 0;
    this.aetherflowBox.duration = 0;
    this.lucidBox.duration = 0;
  }
}
