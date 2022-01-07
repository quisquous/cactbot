import TimerBox from '../../../resources/timerbox';
import { kAbility } from '../constants';

import { BaseComponent, ComponentInterface } from './base';

export class BLUComponent extends BaseComponent {
  offguardBox: TimerBox;
tormentBox: TimerBox;
lucidBox: TimerBox;
  constructor(o: ComponentInterface) {
    super(o);

    this.offguardBox = this.bars.addProcBox({
      id: 'blu-procs-offguard',
      fgColor: 'blu-color-offguard',
    });

    this.tormentBox = this.bars.addProcBox({
      id: 'blu-procs-torment',
      fgColor: 'blu-color-torment',
    });

    this.lucidBox = this.bars.addProcBox({
      id: 'blu-procs-lucid',
      fgColor: 'blu-color-lucid',
    });

    this.reset();
  }

  override onUseAbility(id: string): void {
    switch (id) {
      case kAbility.OffGuard:
        this.offguardBox.duration = this.player.getActionCooldown(60000, 'spell');
        break;
      case kAbility.PeculiarLight:
        this.offguardBox.duration = this.player.getActionCooldown(60000, 'spell');
        break;
      case kAbility.SongOfTorment:
        this.tormentBox.duration = 30;
        break;
      case kAbility.AetherialSpark:
        // +0.5&0.8 for animation delay
        this.tormentBox.duration = 15 + 0.5;
        break;
      case kAbility.Nightbloom:
        this.tormentBox.duration = 60 + 0.8;
        break;
      case kAbility.LucidDreaming:
        this.lucidBox.duration = 60;
        break;
    }
  }

  override onStatChange({ gcdSpell }: { gcdSpell: number }): void {
    this.offguardBox.threshold = gcdSpell * 2;
    this.tormentBox.threshold = gcdSpell * 3;
    this.lucidBox.threshold = gcdSpell + 1;
  }

  override reset(): void {
    this.tormentBox.duration = 0;
    this.offguardBox.duration = 0;
    this.lucidBox.duration = 0;
  }
}
