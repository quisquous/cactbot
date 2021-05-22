import EffectId from '../../../resources/effect_id';
import { kAbility } from '../constants';
import { computeBackgroundColorFrom } from '../utils';

const lightningFgColors = [];
let resetFunc = null;

export function setup(bars) {
  const formTimer = bars.addTimerBar({
    id: 'mnk-timers-combo',
    fgColor: 'mnk-color-form',
  });

  const textBox = bars.addResourceBox({
    classList: ['mnk-color-chakra'],
  });

  const getLightningStacksViaLevel = (level) => {
    if (level < 20)
      return 1;
    else if (level < 40)
      return 2;
    else if (level < 76)
      return 3;
    return 4;
  };


  bars.onJobDetailUpdate((jobDetail) => {
    const chakra = jobDetail.chakraStacks;
    if (textBox.innerText !== chakra) {
      textBox.innerText = chakra;
      const p = textBox.parentNode;
      if (chakra < 5)
        p.classList.add('dim');
      else
        p.classList.remove('dim');
    }

    // After the 5.4 changes, we just assign bars.speedBuffs.lightningStacks
    // as corresponding stacks via current level
    bars.speedBuffs.lightningStacks = getLightningStacksViaLevel(bars.level);
  });

  const dragonKickBox = bars.addProcBox({
    id: 'mnk-procs-dragonkick',
    fgColor: 'mnk-color-dragonkick',
    threshold: 6,
  });

  const twinSnakesBox = bars.addProcBox({
    id: 'mnk-procs-twinsnakes',
    fgColor: 'mnk-color-twinsnakes',
    threshold: 6,
  });

  const demolishBox = bars.addProcBox({
    id: 'mnk-procs-demolish',
    fgColor: 'mnk-color-demolish',
    // Slightly shorter time, to make the box not pop right as
    // you hit snap punch at t=6 (which is probably fine).
    threshold: 5,
  });

  bars.onYouGainEffect(EffectId.TwinSnakes, (name, matches) => {
    twinSnakesBox.duration = 0;
    // -0.5 for logline delay
    twinSnakesBox.duration = (parseFloat(matches.duration) - 0.5).toString();
  });
  bars.onYouLoseEffect(EffectId.TwinSnakes, () => twinSnakesBox.duration = 0);

  bars.onUseAbility(kAbility.Demolish, () => {
    demolishBox.duration = 0;
    // it start counting down when you cast demolish
    // but DOT appears on target about 1 second later
    demolishBox.duration = 18 + 1;
  });

  bars.onYouGainEffect(EffectId.LeadenFist, () => {
    dragonKickBox.duration = 0;
    dragonKickBox.duration = 30;
  });
  bars.onYouLoseEffect(EffectId.LeadenFist, () => dragonKickBox.duration = 0);

  let perfectBalanceActive = false;
  bars.onYouGainEffect(EffectId.PerfectBalance, (name, matches) => {
    if (!perfectBalanceActive) {
      formTimer.duration = 0;
      formTimer.duration = parseFloat(matches.duration).toString();
      formTimer.fg = computeBackgroundColorFrom(formTimer, 'mnk-color-pb');
      perfectBalanceActive = true;
    }
  });
  bars.onYouLoseEffect(EffectId.PerfectBalance, () => {
    formTimer.duration = 0;
    formTimer.fg = computeBackgroundColorFrom(formTimer, 'mnk-color-form');
    perfectBalanceActive = false;
  });

  const changeFormFunc = (name, matches) => {
    formTimer.duration = 0;
    formTimer.duration = parseFloat(matches.duration);
    formTimer.fg = computeBackgroundColorFrom(formTimer, 'mnk-color-form');
  };
  bars.onYouGainEffect([
    EffectId.OpoOpoForm,
    EffectId.RaptorForm,
    EffectId.CoeurlForm,
  ], changeFormFunc);

  resetFunc = (bars) => {
    twinSnakesBox.duration = 0;
    demolishBox.duration = 0;
    dragonKickBox.duration = 0;
    formTimer.duration = 0;
    formTimer.fg = computeBackgroundColorFrom(formTimer, 'mnk-color-form');
    perfectBalanceActive = false;
  };
}

export function reset(bars) {
  if (resetFunc)
    resetFunc(bars);
}
