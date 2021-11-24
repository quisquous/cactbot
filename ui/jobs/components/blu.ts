import { Bars } from '../bars';
import { kAbility } from '../constants';
import { Player } from '../player';

let resetFunc: (bars: Bars) => void;

export const setup = (bars: Bars, player: Player): void => {
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

  player.onStatChange('BLU', ({ gcdSpell }) => {
    offguardBox.threshold = gcdSpell * 2;
    tormentBox.threshold = gcdSpell * 3;
    lucidBox.threshold = gcdSpell + 1;
  });

  player.onUseAbility((id) => {
    switch (id) {
      case kAbility.OffGuard:
        offguardBox.duration = bars.player.getActionCooldown(60000, 'spell');
        break;
      case kAbility.PeculiarLight:
        offguardBox.duration = bars.player.getActionCooldown(60000, 'spell');
        break;
      case kAbility.SongOfTorment:
        tormentBox.duration = 30;
        break;
      case kAbility.AetherialSpark:
        // +0.5&0.8 for animation delay
        tormentBox.duration = 15 + 0.5;
        break;
      case kAbility.Nightbloom:
        tormentBox.duration = 60 + 0.8;
        break;
      case kAbility.LucidDreaming:
        lucidBox.duration = 60;
        break;
    }
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
