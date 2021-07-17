import { kAbility } from '../constants';
import { calcGCDFromStat } from '../utils';
import { BaseComponent } from './base';

export default class BluComponent extends BaseComponent {
  constructor(bars) {
    super(bars);

    this.offguardBox = bars.addProcBox({
      id: 'blu-procs-offguard',
      fgColor: 'blu-color-offguard',
    });

    this.tormentBox = bars.addProcBox({
      id: 'blu-procs-torment',
      fgColor: 'blu-color-torment',
    });

    this.lucidBox = bars.addProcBox({
      id: 'blu-procs-lucid',
      fgColor: 'blu-color-lucid',
    });
  }

  onUseAbility(actionId) {
    switch (actionId) {
    case kAbility.OffGuard:
      this.offguardBox.duration = calcGCDFromStat(bars, bars.spellSpeed, 60000);
      break;

    case PeculiarLight:
      this.offguardBox.duration = calcGCDFromStat(bars, bars.spellSpeed, 60000);
      break;

    case SongOfTorment:
      this.tormentBox.duration = 30;
      break;

      // +0.5&0.8 for animation delay
    case AetherialSpark:
      this.tormentBox.duration = 15 + 0.5;
      break;

    case Nightbloom:
      this.tormentBox.duration = 60 + 0.8;
      break;

    case LucidDreaming:
      this.lucidBox.duration = 60;
      break;

    default:
      break;
    }
  }

  onStatChange(stats) {
    this.offguardBox.threshold = stats.gcdSpell * 2;
    this.tormentBox.threshold = stats.gcdSpell * 3;
    this.lucidBox.threshold = stats.gcdSpell + 1;
  }

  reset() {
    this.tormentBox.duration = 0;
    this.offguardBox.duration = 0;
    this.lucidBox.duration = 0;
  }
}
