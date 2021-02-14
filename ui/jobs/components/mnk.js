import EffectId from '../../../resources/effect_id.js';
import { kAbility } from '../constants.js';
import { computeBackgroundColorFrom } from '../utils.js';

const lightningFgColors = [];

export function setup(bars) {
  // TODO: Remove bars timer when cn/ko update 5.4
  let lightningTimer = null;
  if (['cn', 'ko'].includes(bars.options.ParserLanguage)) {
    lightningTimer = bars.addTimerBar({
      id: 'mnk-timers-lightning',
      fgColor: 'mnk-color-lightning-0',
    });

    for (let i = 0; i <= 3; ++i)
      lightningFgColors.push(computeBackgroundColorFrom(lightningTimer, 'mnk-color-lightning-' + i));
  }

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

    // TODO: Remove bars.lightningStacks,
    // and change code to calculate speed by level in bars.CalcGCDFromStat function
    // when cn/ko update 5.4
    if (lightningTimer) {
      bars.lightningStacks = jobDetail.lightningStacks;
      lightningTimer.fg = lightningFgColors[bars.lightningStacks];
      if (bars.lightningStacks === 0) {
        // Show sad red bar when you've lost all your pancakes.
        lightningTimer.style = 'fill';
        lightningTimer.value = 0;
        lightningTimer.duration = 0;
      } else {
        lightningTimer.style = 'empty';

        // Setting the duration resets the timer bar to 0, so set
        // duration first before adjusting the value.
        const old = parseFloat(lightningTimer.duration) - parseFloat(lightningTimer.elapsed);
        const lightningSeconds = jobDetail.lightningMilliseconds / 1000.0;
        if (lightningSeconds > old) {
          lightningTimer.duration = 16;
          lightningTimer.value = lightningSeconds;
        }
      }
    } else {
      // For now, we just assign bars.lightningStacks as corresponding stacks via current level
      bars.lightningStacks = getLightningStacksViaLevel(bars.level);
    }
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

  bars.onUseAbility(kAbility.TwinSnakes, () => {
    twinSnakesBox.duration = 0;
    twinSnakesBox.duration = 15;
  });
  bars.onUseAbility(kAbility.FourPointFury, () => {
    // FIXME: using bars at zero.
    const old = parseFloat(twinSnakesBox.duration) - parseFloat(twinSnakesBox.elapsed);
    twinSnakesBox.duration = 0;
    if (old > 0)
      twinSnakesBox.duration = Math.min(old + 10, 15);
  });
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
  bars.onYouGainEffect(EffectId.PerfectBalance, (name, matches) => {
    formTimer.duration = 0;
    formTimer.duration = parseFloat(matches.duration);
    formTimer.fg = computeBackgroundColorFrom(formTimer, 'mnk-color-pb');
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
}
