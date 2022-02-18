import EffectId from '../../../resources/effect_id';
import TimerBar from '../../../resources/timerbar';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { ComboTracker } from '../combo_tracker';
import { kAbility } from '../constants';
import { PartialFieldMatches } from '../event_emitter';
import { computeBackgroundColorFrom } from '../utils';

import { BaseComponent, ComponentInterface } from './base';

export class RPRComponent extends BaseComponent {
  deathsDesignBox: TimerBox;
  gluttonyBox: TimerBox;
  soulSliceBox: TimerBox;
  arcaneCircleBox: TimerBox;
  soulGauge: ResourceBox;
  shroudGauge: ResourceBox;
  comboTimer: TimerBar;
  tid1 = 0;
  tid2 = 0;

  constructor(o: ComponentInterface) {
    super(o);

    this.deathsDesignBox = this.bars.addProcBox({
      id: 'rpr-procs-deathsdesign',
      fgColor: 'rpr-color-deathsdesign',
      notifyWhenExpired: true,
    });

    this.soulSliceBox = this.bars.addProcBox({
      id: 'rpr-procs-soulslice',
      fgColor: 'rpr-color-soulslice',
    });

    this.gluttonyBox = this.bars.addProcBox({
      id: 'rpr-procs-gluttony',
      fgColor: 'rpr-color-gluttony',
    });

    this.arcaneCircleBox = this.bars.addProcBox({
      id: 'rpr-procs-arcanecircle',
      fgColor: 'rpr-color-arcanecircle',
    });

    this.soulGauge = this.bars.addResourceBox({
      classList: ['rpr-color-soul'],
    });

    this.shroudGauge = this.bars.addResourceBox({
      classList: ['rpr-color-shroud'],
    });

    this.comboTimer = this.bars.addTimerBar({
      id: 'nin-timers-combo',
      fgColor: 'combo-color',
    });

    this.reset();
  }

  override onJobDetailUpdate(jobDetail: JobDetail['RPR']): void {
    this.soulGauge.innerText = jobDetail.soul.toString();
    this.shroudGauge.innerText = jobDetail.shroud.toString();
    // TODO: Enshourd related gauge
  }

  override onMobGainsEffectFromYou(id: string, matches: PartialFieldMatches<'GainsEffect'>): void {
    switch (id) {
      case EffectId.DeathsDesign:
        // FIXME:
        // Death's Design can be different duration on multiple target,
        // and this condition will only monitor the longest one.
        // If you defeat a target with longer Death's Design duration remains
        // and move to a new or shorter duration target,
        // This timer will not work well until new Death's Design duration exceed timer.
        // For the same reason, timer will not reset when target with debuff is defeated.
        if (this.deathsDesignBox.value < parseFloat(matches.duration ?? '0'))
          this.deathsDesignBox.duration = parseFloat(matches.duration ?? '0') - 0.5;
        break;
    }
  }

  override onUseAbility(id: string, matches: PartialFieldMatches<'AbilityFull'>): void {
    switch (id) {
      case kAbility.SoulSlice:
      case kAbility.SoulScythe:
        if (this.player.level < 78) {
          this.soulSliceBox.duration = 30;
        } else if (matches.targetIndex === '0') { // Avoid multiple call in AOE
          this.soulSliceBox.duration = 30 + this.soulSliceBox.value;
        }
        break;
      case kAbility.Gluttony:
        this.gluttonyBox.duration = 60;
        break;
      case kAbility.ArcaneCircle:
        this.arcaneCircleBox.duration = 20;
        this.arcaneCircleBox.threshold = 1000;
        this.arcaneCircleBox.fg = computeBackgroundColorFrom(this.arcaneCircleBox, 'rpr-color-arcanecircle.active');
        this.tid1 = window.setTimeout(() => {
          this.arcaneCircleBox.duration = 100;
          this.arcaneCircleBox.threshold = this.player.gcdSkill + 1;
          this.arcaneCircleBox.fg = computeBackgroundColorFrom(this.arcaneCircleBox, 'rpr-color-arcanecircle');
        }, 20000);
        // This block monitors unlock time of Plentiful Harvest.
        if (this.player.level > 88) {
          this.arcaneCircleBox.duration = 6;
          this.arcaneCircleBox.fg = computeBackgroundColorFrom(this.arcaneCircleBox, 'rpr-color-bloodsowncircle');
          this.tid2 = window.setTimeout(() => {
            this.arcaneCircleBox.duration = 14;
            this.arcaneCircleBox.fg = computeBackgroundColorFrom(this.arcaneCircleBox, 'rpr-color-arcanecircle.active');
          }, 6000);
        }
        break;
    }
  }

  override onCombo(skill: string, combo: ComboTracker): void {
    this.comboTimer.duration = 0;
    if (combo.isFinalSkill)
      return;
    if (skill)
      this.comboTimer.duration = this.comboDuration;
  }

  override onStatChange({ gcdSkill }: { gcdSkill: number }): void {
    this.deathsDesignBox.valuescale = gcdSkill;
    this.deathsDesignBox.threshold = gcdSkill * 3 + 1;
    this.gluttonyBox.valuescale = gcdSkill;
    this.gluttonyBox.threshold = gcdSkill * 2 + 1;
    this.soulSliceBox.valuescale = gcdSkill;
    this.soulSliceBox.threshold = gcdSkill * 2 + 1;
    this.arcaneCircleBox.valuescale = gcdSkill;
    this.arcaneCircleBox.threshold = gcdSkill + 1;
  }

  override reset(): void {
    this.deathsDesignBox.duration = 0;
    this.gluttonyBox.duration = 0;
    this.soulSliceBox.duration = 0;
    this.arcaneCircleBox.duration = 0;
    this.arcaneCircleBox.threshold = this.player.gcdSkill + 1;
    this.arcaneCircleBox.fg = computeBackgroundColorFrom(this.arcaneCircleBox, 'rpr-color-arcanecircle');
    window.clearTimeout(this.tid1);
    window.clearTimeout(this.tid2);
    this.comboTimer.duration = 0;
  }
}
