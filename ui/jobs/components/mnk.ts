import EffectId from '../../../resources/effect_id';
import { JobDetail } from '../../../types/event';
import { Bars } from '../bars';
import { kAbility } from '../constants';
import { Player } from '../player';
import { computeBackgroundColorFrom } from '../utils';

let resetFunc: (bars: Bars) => void;

export const setup = (bars: Bars, player: Player): void => {
  const formTimer = bars.addTimerBar({
    id: 'mnk-timers-combo',
    fgColor: 'mnk-color-form',
  });

  const textBox = bars.addResourceBox({
    classList: ['mnk-color-chakra'],
  });

  player.onJobDetailUpdate('MNK', (jobDetail: JobDetail['MNK']) => {
    const chakra = jobDetail.chakraStacks.toString();
    if (textBox.innerText !== chakra) {
      textBox.innerText = chakra;
      const p = textBox.parentNode;
      if (jobDetail.chakraStacks < 5)
        p.classList.add('dim');
      else
        p.classList.remove('dim');
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

  bars.onUseAbility((id) => {
    if (id === kAbility.Demolish) {
      // it start counting down when you cast demolish
      // but DOT appears on target about 1 second later
      demolishBox.duration = 18 + 1;
    }
  });

  let perfectBalanceActive = false;

  bars.onYouLoseEffect((id) => {
    switch (id) {
      case EffectId.TwinSnakes:
        twinSnakesBox.duration = 0;
        break;
      case EffectId.LeadenFist:
        dragonKickBox.duration = 0;
        break;
      case EffectId.PerfectBalance:
        formTimer.duration = 0;
        formTimer.fg = computeBackgroundColorFrom(formTimer, 'mnk-color-form');
        perfectBalanceActive = false;
        break;
    }
  });

  bars.onYouGainEffect((id, matches) => {
    switch (id) {
      case EffectId.TwinSnakes:
        // -0.5 for logline delay
        twinSnakesBox.duration = parseFloat(matches.duration ?? '0') - 0.5;
        break;
      case EffectId.LeadenFist:
        dragonKickBox.duration = 30;
        break;
      case EffectId.PerfectBalance:
        if (!perfectBalanceActive) {
          formTimer.duration = 0;
          formTimer.duration = parseFloat(matches.duration ?? '0');
          formTimer.fg = computeBackgroundColorFrom(formTimer, 'mnk-color-pb');
          perfectBalanceActive = true;
        }
        break;
      case EffectId.OpoOpoForm:
      case EffectId.RaptorForm:
      case EffectId.CoeurlForm:
        formTimer.duration = 0;
        formTimer.duration = parseFloat(matches.duration ?? '0');
        formTimer.fg = computeBackgroundColorFrom(formTimer, 'mnk-color-form');
        break;
    }
  });

  resetFunc = (_bars: Bars): void => {
    twinSnakesBox.duration = 0;
    demolishBox.duration = 0;
    dragonKickBox.duration = 0;
    formTimer.duration = 0;
    formTimer.fg = computeBackgroundColorFrom(formTimer, 'mnk-color-form');
    perfectBalanceActive = false;
  };
};

export const reset = (bars: Bars): void => {
  if (resetFunc)
    resetFunc(bars);
};
