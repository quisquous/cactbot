import EffectId from '../../../resources/effect_id';
import TimerBar from '../../../resources/timerbar';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { ComboTracker } from '../combo_tracker';
import { kAbility } from '../constants';
import { PartialFieldMatches } from '../event_emitter';
import { computeBackgroundColorFrom } from '../utils';

import { BaseComponent, ComponentInterface } from './base';

export class MCHComponent extends BaseComponent {
  comboTimer: TimerBar;
  heatGauge: ResourceBox;
  batteryGauge: ResourceBox;
  drillBox: TimerBox;
  airAnchorBox: TimerBox;
  wildFireBox: TimerBox;
  stacksContainer: HTMLDivElement;

  tid1 = 0;
  tid2 = 0;
  wildFireStacks: HTMLElement[] = [];
  wildFireCounts = 0;
  wildFireActive = false;

  constructor(o: ComponentInterface) {
    super(o);
    this.comboTimer = this.bars.addTimerBar({
      id: 'mch-timers-combo',
      fgColor: 'combo-color',
    });

    this.heatGauge = this.bars.addResourceBox({
      classList: ['mch-color-heat'],
    });
    this.batteryGauge = this.bars.addResourceBox({
      classList: ['mch-color-battery'],
    });

    this.drillBox = this.bars.addProcBox({
      id: 'mch-procs-drill',
      fgColor: 'mch-color-drill',
    });

    this.airAnchorBox = this.bars.addProcBox({
      id: 'mch-procs-airanchor',
      fgColor: 'mch-color-airanchor',
    });

    this.wildFireBox = this.bars.addProcBox({
      id: 'mch-procs-wildfire',
      fgColor: 'mch-color-wildfire',
    });

    // Wild Fire Gauge
    this.stacksContainer = document.createElement('div');
    this.stacksContainer.id = 'mch-stacks';
    this.stacksContainer.classList.add('stacks', 'hide');
    this.bars.addJobBarContainer().appendChild(this.stacksContainer);
    const wildFireContainer = document.createElement('div');
    wildFireContainer.id = 'mch-stacks-wildfire';
    this.stacksContainer.appendChild(wildFireContainer);

    for (let i = 0; i < 6; ++i) {
      const d = document.createElement('div');
      wildFireContainer.appendChild(d);
      this.wildFireStacks.push(d);
    }
  }
  override onCombo(skill: string, combo: ComboTracker): void {
    this.comboTimer.duration = 0;
    if (combo.isFinalSkill)
      return;
    if (skill)
      this.comboTimer.duration = this.comboDuration;
  }

  override onJobDetailUpdate(jobDetail: JobDetail['MCH']): void {
    this.heatGauge.innerText = jobDetail.heat.toString();
    this.batteryGauge.innerText = jobDetail.battery.toString();
    // These two seconds are shown by half adjust, not like others' ceil.
    if (jobDetail.overheatMilliseconds > 0) {
      this.heatGauge.parentNode.classList.add('overheat');
      this.heatGauge.innerText = Math.round(jobDetail.overheatMilliseconds / 1000).toString();
    } else {
      this.heatGauge.parentNode.classList.remove('overheat');
      this.heatGauge.innerText = jobDetail.heat.toString();
    }
    if (jobDetail.batteryMilliseconds > 0) {
      this.batteryGauge.parentNode.classList.add('robot-active');
      this.batteryGauge.innerText = Math.round(jobDetail.batteryMilliseconds / 1000).toString();
    } else {
      this.batteryGauge.parentNode.classList.remove('robot-active');
      this.batteryGauge.innerText = jobDetail.battery.toString();
    }
  }

  private refreshWildFireGauge(): void {
    for (let i = 0; i < 6; ++i) {
      const stack = this.wildFireStacks[i];
      if (!stack)
        continue;
      stack.classList.remove('fix', 'active');
      if (this.wildFireCounts > i) {
        if (this.wildFireActive)
          stack.classList.add('active');
        else
          stack.classList.add('fix');
      }
    }
  }

  override onMobGainsEffectFromYou(id: string, matches: PartialFieldMatches<'GainsEffect'>): void {
    if (id === EffectId.Wildfire) {
      this.wildFireActive = true;
      this.wildFireCounts = parseInt(matches.count ?? '0');
      this.refreshWildFireGauge();
      this.stacksContainer.classList.remove('hide');
    }
  }

  override onMobLosesEffectFromYou(id: string): void {
    if (id === EffectId.Wildfire) {
      this.wildFireActive = false;
      this.refreshWildFireGauge();
    }
  }

  override onUseAbility(id: string): void {
    switch (id) {
      case kAbility.Drill:
      case kAbility.Bioblaster:
        this.drillBox.duration = this.player.getActionCooldown(20000, 'skill');
        break;
      case kAbility.AirAnchor:
      case kAbility.HotShot:
        this.airAnchorBox.duration = this.player.getActionCooldown(40000, 'skill');
        break;
      case kAbility.WildFire: {
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
      }
    }
  }

  override onStatChange({ gcdSkill }: { gcdSkill: number }): void {
    this.drillBox.valuescale = gcdSkill;
    this.drillBox.threshold = gcdSkill * 3 + 1;
    this.airAnchorBox.valuescale = gcdSkill;
    this.airAnchorBox.threshold = gcdSkill * 3 + 1;
    this.wildFireBox.valuescale = gcdSkill;
    this.wildFireBox.threshold = gcdSkill + 1;
  }

  override reset(): void {
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
    window.clearTimeout(this.tid1);
    window.clearTimeout(this.tid2);
  }
}
