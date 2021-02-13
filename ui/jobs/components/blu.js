import { kAbility } from '../constants.js';

export function setupBlu(bars) {
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

  bars.statChangeFuncMap['BLU'] = () => {
    offguardBox.threshold = bars.gcdSpell * 2;
    tormentBox.threshold = bars.gcdSpell * 3;
    lucidBox.threshold = bars.gcdSpell + 1;
  };

  bars.onUseAbility(kAbility.OffGuard, () => {
    offguardBox.duration = 0;
    offguardBox.duration = bars.CalcGCDFromStat(bars.spellSpeed, 60000);
  });
  bars.onUseAbility(kAbility.PeculiarLight, () => {
    offguardBox.duration = 0;
    offguardBox.duration = bars.CalcGCDFromStat(bars.spellSpeed, 60000);
  });
  bars.onUseAbility(kAbility.SongOfTorment, () => {
    tormentBox.duration = 0;
    tormentBox.duration = 30;
  });
  bars.onUseAbility(kAbility.LucidDreaming, () => {
    lucidBox.duration = 0;
    lucidBox.duration = 60;
  });
}
