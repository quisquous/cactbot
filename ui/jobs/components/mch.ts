import EffectId from '../../../resources/effect_id';
import { JobDetail } from '../../../types/event';
import { Bars } from '../bars';
import { kAbility } from '../constants';
import { Player } from '../player';
import { computeBackgroundColorFrom } from '../utils';

let resetFunc: (bars: Bars) => void;

export const setup = (bars: Bars, player: Player): void => {
  let tid1 = 0;
  let tid2 = 0;

  const comboTimer = bars.addTimerBar({
    id: 'mch-timers-combo',
    fgColor: 'combo-color',
  });
  bars.onCombo((skill, combo) => {
    comboTimer.duration = 0;
    if (combo.isFinalSkill)
      return;
    if (skill)
      comboTimer.duration = 15;
  });

  const heatGauge = bars.addResourceBox({
    classList: ['mch-color-heat'],
  });
  const batteryGauge = bars.addResourceBox({
    classList: ['mch-color-battery'],
  });
  player.onJobDetailUpdate('MCH', (jobDetail: JobDetail['MCH']) => {
    heatGauge.innerText = jobDetail.heat.toString();
    batteryGauge.innerText = jobDetail.battery.toString();
    // These two seconds are shown by half adjust, not like others' ceil.
    if (jobDetail.overheatMilliseconds > 0) {
      heatGauge.parentNode.classList.add('overheat');
      heatGauge.innerText = Math.round(jobDetail.overheatMilliseconds / 1000).toString();
    } else {
      heatGauge.parentNode.classList.remove('overheat');
      heatGauge.innerText = jobDetail.heat.toString();
    }
    if (jobDetail.batteryMilliseconds > 0) {
      batteryGauge.parentNode.classList.add('robot-active');
      batteryGauge.innerText = Math.round(jobDetail.batteryMilliseconds / 1000).toString();
    } else {
      batteryGauge.parentNode.classList.remove('robot-active');
      batteryGauge.innerText = jobDetail.battery.toString();
    }
  });

  const drillBox = bars.addProcBox({
    id: 'mch-procs-drill',
    fgColor: 'mch-color-drill',
  });

  const airAnchorBox = bars.addProcBox({
    id: 'mch-procs-airanchor',
    fgColor: 'mch-color-airanchor',
  });

  // Wild Fire Gauge
  const stacksContainer = document.createElement('div');
  stacksContainer.id = 'mch-stacks';
  stacksContainer.classList.add('hide');
  bars.addJobBarContainer().appendChild(stacksContainer);
  const wildFireContainer = document.createElement('div');
  wildFireContainer.id = 'mch-stacks-wildfire';
  stacksContainer.appendChild(wildFireContainer);
  const wildFireStacks: HTMLElement[] = [];
  for (let i = 0; i < 6; ++i) {
    const d = document.createElement('div');
    wildFireContainer.appendChild(d);
    wildFireStacks.push(d);
  }

  let wildFireCounts = 0;
  let wildFireActive = false;
  const refreshWildFireGauge = () => {
    for (let i = 0; i < 6; ++i) {
      const stack = wildFireStacks[i];
      if (!stack)
        continue;
      stack.classList.remove('fix', 'active');
      if (wildFireCounts > i) {
        if (wildFireActive)
          stack.classList.add('active');
        else
          stack.classList.add('fix');
      }
    }
  };
  bars.onMobGainsEffectFromYou((id, matches) => {
    if (id === EffectId.Wildfire) {
      wildFireActive = true;
      wildFireCounts = parseInt(matches.count ?? '0');
      refreshWildFireGauge();
      stacksContainer.classList.remove('hide');
    }
  });
  bars.onMobLosesEffectFromYou((id) => {
    if (id === EffectId.Wildfire) {
      wildFireActive = false;
      refreshWildFireGauge();
    }
  });
  const wildFireBox = bars.addProcBox({
    id: 'mch-procs-wildfire',
    fgColor: 'mch-color-wildfire',
  });

  bars.onUseAbility((id) => {
    switch (id) {
      case kAbility.Drill:
      case kAbility.Bioblaster:
        drillBox.duration = bars.player.getActionCooldown(20000, 'skill');
        break;
      case kAbility.AirAnchor:
      case kAbility.HotShot:
        airAnchorBox.duration = bars.player.getActionCooldown(40000, 'skill');
        break;
      case kAbility.WildFire: {
        wildFireBox.duration = 10 + 0.9; // animation delay
        wildFireBox.threshold = 1000;
        wildFireBox.fg = computeBackgroundColorFrom(wildFireBox, 'mch-color-wildfire.active');
        tid1 = window.setTimeout(() => {
          wildFireBox.duration = 110 - 0.9;
          wildFireBox.threshold = bars.gcdSkill + 1;
          wildFireBox.fg = computeBackgroundColorFrom(wildFireBox, 'mch-color-wildfire');
        }, 10000);
        tid2 = window.setTimeout(() => {
          stacksContainer.classList.add('hide');
          wildFireCounts = 0;
        }, 15000);
        break;
      }
    }
  });

  bars.onStatChange('MCH', ({ gcdSkill }) => {
    drillBox.valuescale = gcdSkill;
    drillBox.threshold = gcdSkill * 3 + 1;
    airAnchorBox.valuescale = gcdSkill;
    airAnchorBox.threshold = gcdSkill * 3 + 1;
    wildFireBox.valuescale = gcdSkill;
    wildFireBox.threshold = gcdSkill + 1;
  });

  resetFunc = (bars: Bars): void => {
    comboTimer.duration = 0;
    drillBox.duration = 0;
    airAnchorBox.duration = 0;
    wildFireCounts = 0;
    wildFireActive = false;
    refreshWildFireGauge();
    wildFireBox.duration = 0;
    wildFireBox.threshold = bars.gcdSkill + 1;
    wildFireBox.fg = computeBackgroundColorFrom(wildFireBox, 'mch-color-wildfire');
    stacksContainer.classList.add('hide');
    clearTimeout(tid1);
    clearTimeout(tid2);
  };
};

export const reset = (bars: Bars): void => {
  if (resetFunc)
    resetFunc(bars);
};
