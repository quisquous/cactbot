import { Bars } from '../bars';
import { kAbility } from '../constants';

let resetFunc: (bars: Bars) => void;

export const setup = (bars: Bars): void => {
  const offguardBox = bars.addProcBox({
    id: 'blu-procs-offguard',
    fgColor: 'blu-color-offguard',
  });

  const tormentBox = bars.addProcBox({
    id: 'blu-procs-torment',
    fgColor: 'blu-color-torment',
  });

  const lucidBox = bars.addProcBox({
    id: 'blu-procs-lucid',
    fgColor: 'blu-color-lucid',
  });

  bars.onStatChange('BLU', () => {
    offguardBox.threshold = bars.gcdSpell * 2;
    tormentBox.threshold = bars.gcdSpell * 3;
    lucidBox.threshold = bars.gcdSpell + 1;
  });

  bars.onUseAbility(kAbility.OffGuard, () => {
    offguardBox.duration = bars.player.getActionCooldown(60000, 'spell');
  });
  bars.onUseAbility(kAbility.PeculiarLight, () => {
    offguardBox.duration = bars.player.getActionCooldown(60000, 'spell');
  });
  bars.onUseAbility(kAbility.SongOfTorment, () => {
    tormentBox.duration = 30;
  });
  // +0.5&0.8 for animation delay
  bars.onUseAbility(kAbility.AetherialSpark, () => {
    tormentBox.duration = 15 + 0.5;
  });
  bars.onUseAbility(kAbility.Nightbloom, () => {
    tormentBox.duration = 60 + 0.8;
  });
  bars.onUseAbility(kAbility.LucidDreaming, () => {
    lucidBox.duration = 60;
  });

  resetFunc = (_bars: Bars): void => {
    tormentBox.duration = 0;
    offguardBox.duration = 0;
    lucidBox.duration = 0;
  };
};

export const reset = (bars: Bars): void => {
  if (resetFunc)
    resetFunc(bars);
};
