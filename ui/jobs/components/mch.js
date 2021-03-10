import { kAbility } from '../constants';
import EffectId from '../../../resources/effect_id';
import { calcGCDFromStat, computeBackgroundColorFrom } from '../utils';

export function setup(bars) {
  const comboTimer = bars.addTimerBar({
    id: 'mch-timers-combo',
    fgColor: 'combo-color',
  });
  bars.onCombo((skill) => {
    comboTimer.duration = 0;
    if (bars.combo.isFinalSkill)
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
  bars.onJobDetailUpdate((jobDetail) => {
    heatGauge.innerText = jobDetail.heat;
    batteryGauge.innerText = jobDetail.battery;
    // These two seconds are shown by half adjust, not like others' ceil.
    if (jobDetail.overheatMilliseconds > 0) {
      heatGauge.parentNode.classList.add('overheat');
      heatGauge.innerText = Math.round(jobDetail.overheatMilliseconds / 1000);
    } else {
      heatGauge.parentNode.classList.remove('overheat');
      heatGauge.innerText = jobDetail.heat;
    }
    if (jobDetail.batteryMilliseconds > 0) {
      batteryGauge.parentNode.classList.add('robot-active');
      batteryGauge.innerText = Math.round(jobDetail.batteryMilliseconds / 1000);
    } else {
      batteryGauge.parentNode.classList.remove('robot-active');
      batteryGauge.innerText = jobDetail.battery;
    }
  });

  const drillBox = bars.addProcBox({
    id: 'mch-procs-drill',
    fgColor: 'mch-color-drill',
  });
  bars.onUseAbility([
    kAbility.Drill,
    kAbility.Bioblaster,
  ], () => {
    drillBox.duration = 0;
    drillBox.duration = calcGCDFromStat(bars, bars.skillSpeed, 20000);
  });

  const airAnchorBox = bars.addProcBox({
    id: 'mch-procs-airanchor',
    fgColor: 'mch-color-airanchor',
  });
  bars.onUseAbility([
    kAbility.AirAnchor,
    kAbility.HotShot,
  ], () => {
    airAnchorBox.duration = 0;
    airAnchorBox.duration = calcGCDFromStat(bars, bars.skillSpeed, 40000);
  });

  // Wild Fire Gauge
  const stacksContainer = document.createElement('div');
  stacksContainer.id = 'mch-stacks';
  stacksContainer.classList.add('hide');
  bars.addJobBarContainer().appendChild(stacksContainer);
  const wildFireContainer = document.createElement('div');
  wildFireContainer.id = 'mch-stacks-wildfire';
  stacksContainer.appendChild(wildFireContainer);
  const wildFireStacks = [];
  for (let i = 0; i < 6; ++i) {
    const d = document.createElement('div');
    wildFireContainer.appendChild(d);
    wildFireStacks.push(d);
  }

  let wildFireCounts = 0;
  let wildFireActive = false;
  const refreshWildFireGuage = () => {
    for (let i = 0; i < 6; ++i) {
      wildFireStacks[i].classList.remove('fix', 'active');
      if (wildFireCounts > i) {
        if (wildFireActive)
          wildFireStacks[i].classList.add('active');
        else
          wildFireStacks[i].classList.add('fix');
      }
    }
  };
  bars.onMobGainsEffectFromYou(EffectId.Wildfire, (id, e) => {
    wildFireCounts = e.count;
    refreshWildFireGuage();
  });
  const wildFireBox = bars.addProcBox({
    id: 'mch-procs-wildfire',
    fgColor: 'mch-color-wildfire',
  });
  bars.onUseAbility(kAbility.WildFire, () => {
    wildFireBox.duration = 0;
    wildFireBox.duration = 10 + 0.9; // animation delay
    wildFireBox.threshold = 1000;
    wildFireActive = true;
    refreshWildFireGuage();
    stacksContainer.classList.remove('hide');
    wildFireBox.fg = computeBackgroundColorFrom(wildFireBox, 'mch-color-wildfire.active');
    setTimeout(() => {
      wildFireBox.duration = 110 - 0.9;
      wildFireBox.threshold = bars.gcdSkill + 1;
      wildFireBox.fg = computeBackgroundColorFrom(wildFireBox, 'mch-color-wildfire');
      wildFireActive = false;
      refreshWildFireGuage();
    }, 10000);
    setTimeout(() => {
      stacksContainer.classList.add('hide');
      wildFireCounts = 0;
    }, 12500);
  });

  bars.onStatChange('MCH', () => {
    drillBox.valuescale = bars.gcdSkill;
    drillBox.threshold = bars.gcdSkill * 3 + 1;
    airAnchorBox.valuescale = bars.gcdSkill;
    airAnchorBox.threshold = bars.gcdSkill * 3 + 1;
    wildFireBox.valuescale = bars.gcdSkill;
    wildFireBox.threshold = bars.gcdSkill + 1;
  });
}
