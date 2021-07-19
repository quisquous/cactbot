import EffectId from '../../../resources/effect_id';
import { kAbility } from '../constants';
import { BaseComponent } from './base';

export default class WhmComponent extends BaseComponent {
  constructor(bars) {
    super(bars);

    this.lilyBox = this.addResourceBox({
      classList: ['whm-color-lily'],
    });
    this.lilysecondBox = this.addResourceBox({
      classList: ['whm-color-lilysecond'],
    });

    this.diaBox = this.addProcBox({
      id: 'whm-procs-dia',
      fgColor: 'whm-color-dia',
      notifyWhenExpired: true,
    });
    this.assizeBox = this.addProcBox({
      id: 'whm-procs-assize',
      fgColor: 'whm-color-assize',
    });
    this.lucidBox = this.addProcBox({
      id: 'whm-procs-lucid',
      fgColor: 'whm-color-lucid',
    });
    // BloodLily Gauge
    const stacksContainer = document.createElement('div');
    stacksContainer.id = 'whm-stacks';
    this.addCustomBar(stacksContainer);
    const bloodlilyContainer = document.createElement('div');
    bloodlilyContainer.id = 'whm-stacks-bloodlily';
    stacksContainer.appendChild(bloodlilyContainer);
    this.bloodlilyStacks = [];
    for (let i = 0; i < 3; ++i) {
      const d = document.createElement('div');
      bloodlilyContainer.appendChild(d);
      this.bloodlilyStacks.push(d);
    }
  }

  onJobDetailUpdate(jobDetail) {
    const lily = jobDetail.lilyStacks;
    // bars milliseconds is countup, so use floor instead of ceil.
    const lilysecond = Math.floor(jobDetail.lilyMilliseconds / 1000);

    this.lilyBox.innerText = lily;
    if (lily === 3)
      this.lilysecondBox.innerText = '';
    else
      this.lilysecondBox.innerText = 30 - lilysecond;

    const bloodlilys = jobDetail.bloodlilyStacks;
    for (let i = 0; i < 3; ++i) {
      if (bloodlilys > i)
        this.bloodlilyStacks[i].classList.add('active');
      else
        this.bloodlilyStacks[i].classList.remove('active');
    }

    const l = this.lilysecondBox.parentNode;
    if ((lily === 2 && 30 - lilysecond <= 5) || lily === 3)
      l.classList.add('full');
    else
      l.classList.remove('full');
  }

  onGainEffect(effectId) {
    switch (effectId) {
    case EffectId.PresenceOfMind:
      this.player.speedBuffs.presenceOfMind = 1;
      break;

    default:
      break;
    }
  }

  onLoseEffect(effectId) {
    switch (effectId) {
    case EffectId.PresenceOfMind:
      this.player.speedBuffs.presenceOfMind = 0;
      break;

    default:
      break;
    }
  }

  onUseAbility(abilityId) {
    switch (abilityId) {
    case kAbility.Aero:
    case kAbility.Aero2:
      this.diaBox.duration = 18 + 1;
      break;

    case kAbility.Dia:
      this.diaBox.duration = 30;
      break;

    case kAbility.Assize:
      this.assizeBox.duration = 45;
      break;

    case kAbility.LucidDreaming:
      this.lucidBox.duration = 60;
      break;

    default:
      break;
    }
  }

  onStatChange(stats) {
    this.diaBox.valuescale = stats.gcdSpell;
    this.diaBox.threshold = stats.gcdSpell + 1;
    this.assizeBox.valuescale = stats.gcdSpell;
    this.assizeBox.threshold = stats.gcdSpell + 1;
    this.lucidBox.valuescale = stats.gcdSpell;
    this.lucidBox.threshold = stats.gcdSpell + 1;
  }

  reset() {
    this.diaBox.duration = 0;
    this.assizeBox.duration = 0;
    this.lucidBox.duration = 0;
  }
}
