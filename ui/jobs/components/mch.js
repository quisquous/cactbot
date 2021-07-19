import { kAbility } from '../constants';
import EffectId from '../../../resources/effect_id';
import { computeBackgroundColorFrom } from '../utils';
import { BaseComponent } from './base';

export default class MchComponent extends BaseComponent {
  constructor(bars) {
    super(bars);

    this.comboTimer = this.addTimerBar({
      id: 'mch-timers-combo',
      fgColor: 'combo-color',
    });

    this.heatGauge = this.addResourceBox({
      classList: ['mch-color-heat'],
    });
    this.batteryGauge = this.addResourceBox({
      classList: ['mch-color-battery'],
    });

    this.drillBox = this.addProcBox({
      id: 'mch-procs-drill',
      fgColor: 'mch-color-drill',
    });

    this.airAnchorBox = this.addProcBox({
      id: 'mch-procs-airanchor',
      fgColor: 'mch-color-airanchor',
    });

    this.wildFireBox = this.addProcBox({
      id: 'mch-procs-wildfire',
      fgColor: 'mch-color-wildfire',
    });

    // Wild Fire Gauge
    this.stacksContainer = document.createElement('div');
    this.stacksContainer.id = 'mch-stacks';
    this.stacksContainer.classList.add('hide');

    this.addCustomBar(this.stacksContainer);
    const wildFireContainer = document.createElement('div');
    wildFireContainer.id = 'mch-stacks-wildfire';
    this.stacksContainer.appendChild(wildFireContainer);

    this.wildFireStacks = [];
    for (let i = 0; i < 6; ++i) {
      const d = document.createElement('div');
      wildFireContainer.appendChild(d);
      this.wildFireStacks.push(d);
    }

    this.wildFireCounts = 0;
    this.wildFireActive = false;
    this.tid1 = 0;
    this.tid2 = 0;
  }

  onCombo(skill) {
    this.comboTimer.duration = 0;
    if (this.bars.combo.isFinalSkill)
      return;
    if (skill)
      this.comboTimer.duration = 15;
  }

  onMobGainsEffectFromYou(effectId) {
    if (effectId === EffectId.Wildfire) {
      this.wildFireActive = true;
      this.wildFireCounts = e.count;
      refreshWildFireGauge();
      this.stacksContainer.classList.remove('hide');
    }
  }

  onMobLosesEffectFromYou(effectId) {
    if (effectId === EffectId.Wildfire) {
      this.wildFireActive = false;
      this.refreshWildFireGauge();
    }
  }

  onJobDetailUpdate(jobDetail) {
    this.heatGauge.innerText = jobDetail.heat;
    this.batteryGauge.innerText = jobDetail.battery;
    // These two seconds are shown by half adjust, not like others' ceil.
    if (jobDetail.overheatMilliseconds > 0) {
      this.heatGauge.parentNode.classList.add('overheat');
      this.heatGauge.innerText = Math.round(jobDetail.overheatMilliseconds / 1000);
    } else {
      this.heatGauge.parentNode.classList.remove('overheat');
      this.heatGauge.innerText = jobDetail.heat;
    }
    if (jobDetail.batteryMilliseconds > 0) {
      this.batteryGauge.parentNode.classList.add('robot-active');
      this.batteryGauge.innerText = Math.round(jobDetail.batteryMilliseconds / 1000);
    } else {
      this.batteryGauge.parentNode.classList.remove('robot-active');
      this.batteryGauge.innerText = jobDetail.battery;
    }
  }

  onUseAbility(abilityId) {
    switch (abilityId) {
    case kAbility.Drill:
    case kAbility.Bioblaster:
      this.drillBox.duration = this.player.getActionCooldown(20000, 'skill');
      break;

    case kAbility.AirAnchor:
    case kAbility.HotShot:
      this.airAnchorBox.duration = this.player.getActionCooldown(40000, 'skill');
      break;

    case kAbility.WildFire:
      this.wildFireBox.duration = 10 + 0.9; // animation delay
      this.wildFireBox.threshold = 1000;
      this.wildFireBox.fg = computeBackgroundColorFrom(this.wildFireBox, 'mch-color-wildfire.active');
      this.tid1 = window.setTimeout(() => {
        this.wildFireBox.duration = 110 - 0.9;
        this.wildFireBox.threshold = this.player.gcdSkill + 1;
        this.wildFireBox.fg = computeBackgroundColorFrom(this.wildFireBox, 'mch-color-wildfire');
      }, 10000);
      this.tid2 = window.setTimeout(() => {
        this.stacksContainer.classList.add('hide');
        this.wildFireCounts = 0;
      }, 15000);
      break;

    default:
      break;
    }
  }

  onStatChange(stats) {
    this.drillBox.valuescale = stats.gcdSkill;
    this.drillBox.threshold = stats.gcdSkill * 3 + 1;
    this.airAnchorBox.valuescale = stats.gcdSkill;
    this.airAnchorBox.threshold = stats.gcdSkill * 3 + 1;
    this.wildFireBox.valuescale = stats.gcdSkill;
    this.wildFireBox.threshold = stats.gcdSkill + 1;
  }

  reset() {
    this.comboTimer.duration = 0;
    this.drillBox.duration = 0;
    this.airAnchorBox.duration = 0;
    this.wildFireCounts = 0;
    this.wildFireActive = false;
    this.refreshWildFireGauge();
    this.wildFireBox.duration = 0;
    this.wildFireBox.threshold = this.player.gcdSkill + 1;
    this.wildFireBox.fg = computeBackgroundColorFrom(this.wildFireBox, 'mch-color-wildfire');
    this.stacksContainer.classList.add('hide');
    clearTimeout(this.tid1);
    clearTimeout(this.tid2);
  }

  refreshWildFireGauge() {
    for (let i = 0; i < 6; ++i) {
      this.wildFireStacks[i].classList.remove('fix', 'active');
      if (this.wildFireCounts > i) {
        if (this.wildFireActive)
          this.wildFireStacks[i].classList.add('active');
        else
          this.wildFireStacks[i].classList.add('fix');
      }
    }
  }
}
