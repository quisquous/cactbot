import { kAbility } from '../constants.js';
import { computeBackgroundColorFrom } from '../utils.js';

export function setupMch(bars) {
  const comboTimer = bars.addTimerBar({
    id: 'mch-timers-combo',
    fgColor: 'combo-color',
  });

  bars.comboFuncs.push((skill) => {
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

  // Wild Fire Gauge
  let wildFireActive = false;
  // exclude WildFire it self, for some code neatness reason.
  let wildFireGCD = -1;
  let cooldown = false;

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
  const refreshWildFireGuage = () => {
    if (wildFireActive && !cooldown) {
      wildFireGCD = wildFireGCD + 1;
      for (let i = 0; i < 6; ++i) {
        if (wildFireGCD > i)
          wildFireStacks[i].classList.add('active');
        else
          wildFireStacks[i].classList.remove('active');
      }
      cooldown = true;
      setTimeout(() => {
        cooldown = false;
      }, 100);
    }
  };
  [
    kAbility.SplitShot,
    kAbility.SlugShot,
    kAbility.CleanShot,
    kAbility.HeatedSplitShot,
    kAbility.HeatedSlugShot,
    kAbility.HeatedCleanShot,
    kAbility.SpreadShot,
    kAbility.HeatBlast,
    kAbility.AutoCrossbow,
  ].forEach((ability) => {
    bars.onUseAbility(ability, () => {
      refreshWildFireGuage();
    });
  });

  const drillBox = bars.addProcBox({
    id: 'mch-procs-drill',
    fgColor: 'mch-color-drill',
  });
  [
    kAbility.Drill,
    kAbility.Bioblaster,
  ].forEach((ability) => {
    bars.onUseAbility(ability, () => {
      drillBox.duration = 0;
      drillBox.duration = bars.CalcGCDFromStat(bars.skillSpeed, 20000);
      refreshWildFireGuage();
    });
  });

  const airAnchorBox = bars.addProcBox({
    id: 'mch-procs-airanchor',
    fgColor: 'mch-color-airanchor',
  });
  [
    kAbility.AirAnchor,
    kAbility.HotShot,
  ].forEach((ability) => {
    bars.onUseAbility(ability, () => {
      airAnchorBox.duration = 0;
      airAnchorBox.duration = bars.CalcGCDFromStat(bars.skillSpeed, 40000);
      refreshWildFireGuage();
    });
  });

  const wildFireBox = bars.addProcBox({
    id: 'mch-procs-wildfire',
    fgColor: 'mch-color-wildfire',
  });
  bars.onUseAbility(kAbility.WildFire, () => {
    wildFireBox.duration = 0;
    wildFireBox.duration = 10;
    wildFireBox.threshold = 1000;
    wildFireActive = true;
    wildFireGCD = -1;
    refreshWildFireGuage();
    stacksContainer.classList.remove('hide');
    wildFireBox.fg = computeBackgroundColorFrom(wildFireBox, 'mch-color-wildfire.active');
    setTimeout(() => {
      wildFireBox.duration = 110;
      wildFireBox.threshold = bars.gcdSkill + 1;
      wildFireActive = false;
      wildFireGCD = -1;
      refreshWildFireGuage();
      stacksContainer.classList.add('hide');
      wildFireBox.fg = computeBackgroundColorFrom(wildFireBox, 'mch-color-wildfire');
    }, 10000);
  });

  bars.statChangeFuncMap['MCH'] = () => {
    drillBox.valuescale = bars.gcdSkill;
    drillBox.threshold = bars.gcdSkill * 3 + 1;
    airAnchorBox.valuescale = bars.gcdSkill;
    airAnchorBox.threshold = bars.gcdSkill * 3 + 1;
    wildFireBox.valuescale = bars.gcdSkill;
    wildFireBox.threshold = bars.gcdSkill + 1;
  };
}
