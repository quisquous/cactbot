import EffectId from '../../../resources/effect_id';
import { JobDetail } from '../../../types/event';
import { NetMatches } from '../../../types/net_matches';
import { kAbility } from '../constants';
import { Bars } from '../jobs';
import { computeBackgroundColorFrom } from '../utils';

let resetFunc: (bars: Bars) => void;

export const setup = (bars: Bars): void => {
  const formTimer = bars.addTimerBar({
    id: 'mnk-timers-combo',
    fgColor: 'mnk-color-form',
  });

  const textBox = bars.addResourceBox({
    classList: ['mnk-color-chakra'],
  });

  bars.onJobDetailUpdate('MNK', (jobDetail: JobDetail['MNK']) => {
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

  bars.onYouGainEffect(EffectId.TwinSnakes, (name, matches) => {
    // -0.5 for logline delay
    twinSnakesBox.duration = parseFloat(matches.duration ?? '0') - 0.5;
  });
  bars.onYouLoseEffect(EffectId.TwinSnakes, () => twinSnakesBox.duration = 0);

  bars.onUseAbility(kAbility.Demolish, () => {
    // it start counting down when you cast demolish
    // but DOT appears on target about 1 second later
    demolishBox.duration = 18 + 1;
  });

  bars.onYouGainEffect(EffectId.LeadenFist, () => {
    dragonKickBox.duration = 30;
  });
  bars.onYouLoseEffect(EffectId.LeadenFist, () => dragonKickBox.duration = 0);

  let perfectBalanceActive = false;
  bars.onYouGainEffect(EffectId.PerfectBalance, (name, matches) => {
    if (!perfectBalanceActive) {
      formTimer.duration = 0;
      formTimer.duration = parseFloat(matches.duration ?? '0');
      formTimer.fg = computeBackgroundColorFrom(formTimer, 'mnk-color-pb');
      perfectBalanceActive = true;
    }
  });
  bars.onYouLoseEffect(EffectId.PerfectBalance, () => {
    formTimer.duration = 0;
    formTimer.fg = computeBackgroundColorFrom(formTimer, 'mnk-color-form');
    perfectBalanceActive = false;
  });

  const changeFormFunc = (name: string, matches: Partial<NetMatches['GainsEffect']>) => {
    formTimer.duration = 0;
    formTimer.duration = parseFloat(matches.duration ?? '0');
    formTimer.fg = computeBackgroundColorFrom(formTimer, 'mnk-color-form');
  };
  bars.onYouGainEffect([
    EffectId.OpoOpoForm,
    EffectId.RaptorForm,
    EffectId.CoeurlForm,
  ], changeFormFunc);

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
