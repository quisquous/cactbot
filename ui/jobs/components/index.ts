import EffectId from '../../../resources/effect_id';
import PartyTracker from '../../../resources/party';
import Util from '../../../resources/util';
import { Job } from '../../../types/job';
import { Bars } from '../bars';
import { BuffTracker } from '../buff_tracker';
import { kWellFedContentTypes } from '../constants';
import { JobsEventEmitter } from '../event_emitter';
import { FfxivRegion } from '../jobs';
import { JobsOptions } from '../jobs_options';
import { Player } from '../player';
import { doesJobNeedMPBar, isPvPZone, RegexesHolder } from '../utils';

import { ASTComponent } from './ast';
import { BaseComponent, ComponentInterface, ShouldShow } from './base';
import { BLMComponent } from './blm';
import { BLUComponent } from './blu';
import { BRDComponent } from './brd';
import { DNCComponent } from './dnc';
import { DRGComponent } from './drg';
import { DRKComponent } from './drk';
import { GNBComponent } from './gnb';
import { MCHComponent } from './mch';
import { MNKComponent } from './mnk';
import { NINComponent } from './nin';
import { PLDComponent } from './pld';
import { RDMComponent } from './rdm';
import { RPRComponent } from './rpr';
import { SAMComponent } from './sam';
import { SCHComponent } from './sch';
import { SGEComponent } from './sge';
import { SMNComponent } from './smn';
import { WARComponent } from './war';
import { WHMComponent } from './whm';

const ComponentMap: Record<Job, typeof BaseComponent> = {
  // tank
  GLA: PLDComponent,
  PLD: PLDComponent,
  MRD: WARComponent,
  WAR: WARComponent,
  DRK: DRKComponent,
  GNB: GNBComponent,
  // healer
  CNJ: WHMComponent,
  WHM: WHMComponent,
  SCH: SCHComponent,
  AST: ASTComponent,
  SGE: SGEComponent,
  // melee dps
  PGL: MNKComponent,
  MNK: MNKComponent,
  LNC: BaseComponent,
  DRG: DRGComponent,
  ROG: NINComponent,
  NIN: NINComponent,
  SAM: SAMComponent,
  RPR: RPRComponent,
  // ranged dps
  ARC: BRDComponent,
  BRD: BRDComponent,
  MCH: MCHComponent,
  DNC: DNCComponent,
  // magic dps
  ACN: SMNComponent,
  SMN: SMNComponent,
  THM: BLMComponent,
  BLM: BLMComponent,
  RDM: RDMComponent,
  BLU: BLUComponent,
  // crafter & gatherer
  CRP: BaseComponent,
  BSM: BaseComponent,
  ARM: BaseComponent,
  GSM: BaseComponent,
  LTW: BaseComponent,
  WVR: BaseComponent,
  ALC: BaseComponent,
  CUL: BaseComponent,
  MIN: BaseComponent,
  BTN: BaseComponent,
  FSH: BaseComponent,
  NONE: BaseComponent,
};

export class ComponentManager {
  bars: Bars;
  buffTracker?: BuffTracker;
  ee: JobsEventEmitter;
  options: JobsOptions;
  partyTracker: PartyTracker;
  ffxivRegion: FfxivRegion;
  player: Player;
  regexes?: RegexesHolder;
  component?: BaseComponent;

  // misc variables
  shouldShow: ShouldShow;
  contentType?: number;
  inPvPZone?: boolean;
  // food buffs
  foodBuffExpiresTimeMs: number;
  foodBuffTimer: number;
  // gp potions
  gpAlarmReady: boolean;
  gpPotion: boolean;
  // true if player is too far away from their target
  far?: boolean;

  constructor(private o: ComponentInterface) {
    this.bars = o.bars;
    this.ee = o.emitter;
    this.options = o.options;
    this.partyTracker = o.partyTracker;
    this.player = o.player;
    this.ffxivRegion = o.ffxivRegion;

    this.shouldShow = {};
    this.contentType = undefined;

    this.foodBuffExpiresTimeMs = 0;
    this.foodBuffTimer = 0;
    this.gpAlarmReady = false;
    this.gpPotion = false;

    this.far = undefined;

    this.setupListeners();
  }

  getJobComponents(job: Job): BaseComponent {
    // if (this.o.ffxivRegion === 'cn/ko') {
    //   if (job === 'XXX')
    //     return new XXXOldComponent(this.o);
    // }

    const Component = ComponentMap[job];
    if (!Component)
      return new BaseComponent(this.o);

    return new Component(this.o);
  }

  setupListeners(): void {
    this.ee.registerOverlayListeners();

    // bind party changed event
    this.ee.on('party', (party) => this.partyTracker.onPartyChanged({ party }));

    this.player.on('level', (level, prevLevel) => {
      if (level !== prevLevel)
        this._updateFoodBuff();
    });

    // change color when target is far away
    this.ee.on('battle/target', (target) => {
      if (target && Util.isCasterDpsJob(this.player.job)) {
        this.far = this.options.FarThresholdOffence >= 0 &&
          target.effectiveDistance > this.options.FarThresholdOffence;
        this.bars.updateMpBarColor({ mp: this.player.mp, far: this.far });
      }
    });

    this.player.on('mp', (data) => {
      let umbralStacks = 0;
      if (this.component instanceof BLMComponent)
        umbralStacks = this.component.umbralStacks;

      // update mp ticker
      this.bars._updateMPTicker({
        ...data,
        inCombat: this.component?.inCombat ?? false,
        umbralStacks: umbralStacks,
      });

      // update mp bar color
      this.bars.updateMpBarColor({ mp: data.mp, far: this.far });
    });
    this.player.on('gp', ({ gp }) => {
      if (!Util.isGatheringJob(this.player.job))
        return;
      if (gp < this.options.GpAlarmPoint) {
        this.gpAlarmReady = true;
      } else if (this.gpAlarmReady && !this.gpPotion && gp >= this.options.GpAlarmPoint) {
        this.gpAlarmReady = false;
        this.bars._playGpAlarm();
      } else {
        // We're above the gp point and it has either played or been suppressed by a potion.
        // Wait until we dip below the alarm point before beeping again.
        this.gpAlarmReady = false;
      }
    });

    this.player.on('job', (job) => {
      this.gpAlarmReady = false;

      this.bars._setupJobContainers(job, {
        buffList: this.shouldShow.buffList ??
          (!Util.isCraftingJob(job) && !Util.isGatheringJob(job)),
        pullBar: this.shouldShow.pullBar ?? true,
        hpBar: this.shouldShow.hpBar ?? (!Util.isCraftingJob(job) && !Util.isGatheringJob(job)),
        mpBar: this.shouldShow.mpBar ??
          (!Util.isCraftingJob(job) && !Util.isGatheringJob(job) && doesJobNeedMPBar(job)),
        cpBar: this.shouldShow.cpBar ?? Util.isCraftingJob(job),
        gpBar: this.shouldShow.gpBar ?? Util.isGatheringJob(job),
        mpTicker: this.shouldShow.mpTicker ?? this.options.ShowMPTicker.includes(job),
      });

      // hide container html element if the player is a crafter
      this.bars.setJobsContainerVisibility(!Util.isCraftingJob(job));

      // initialize components
      this.component = this.getJobComponents(job);

      // add food buff trigger
      this.player.onYouGainEffect((id, matches) => {
        if (id === EffectId.WellFed) {
          const seconds = parseFloat(matches.duration ?? '0');
          const now = Date.now(); // This is in ms.
          this.foodBuffExpiresTimeMs = now + (seconds * 1000);
          this._updateFoodBuff();
        }
      });
      this.player.onYouLoseEffect((id) => {
        if (id === EffectId.WellFed) {
          this.foodBuffExpiresTimeMs = Date.now();
          this._updateFoodBuff();
        }
      });
      // As you cannot change jobs in combat, we can assume that
      // it is always false here.
      this.bars._updateProcBoxNotifyState(false);

      // TODO: this is always created by _updateJob, so maybe this.o needs be optional?
      if (this.bars.o.leftBuffsList && this.bars.o.rightBuffsList) {
        // Set up the buff tracker after the job bars are created.
        this.buffTracker = new BuffTracker(
          this.options,
          this.player.name,
          this.bars.o.leftBuffsList,
          this.bars.o.rightBuffsList,
          this.partyTracker,
          this.ffxivRegion,
        );
      }
    });

    // update RegexesHolder when the player name changes
    this.player.on('player', ({ name }) => {
      this.regexes = new RegexesHolder(this.options.ParserLanguage, name);
    });

    this.ee.on('battle/in-combat', ({ game }) => {
      this.bars._updateProcBoxNotifyState(game);
      if (this.component && this.component.inCombat !== game) {
        this.component.inCombat = game;
        this._updateFoodBuff();
      }

      // make bars transparent when out of combat if requested
      this.bars._updateOpacity(!game && this.options.LowerOpacityOutOfCombat);
    });

    this.ee.on('battle/wipe', () => {
      this._onPartyWipe();
    });

    this.player.on('action/you', (id) => {
      if (this.regexes?.cordialRegex.test(id)) {
        this.gpPotion = true;
        window.setTimeout(() => {
          this.gpPotion = false;
        }, 2000);
      }
    });

    this.player.on('action', (id, matches) => {
      this.buffTracker?.onUseAbility(id, matches);
    });

    this.player.on('action/other', (id, matches) => this.buffTracker?.onUseAbility(id, matches));

    this.player.on(
      'effect/gain/you',
      (id, matches) => this.buffTracker?.onYouGainEffect(id, matches),
    );

    this.player.on('effect/gain', (id, matches) => {
      // mob id starts with '4'
      if (matches.targetId?.startsWith('4'))
        this.buffTracker?.onMobGainsEffect(id, matches);
    });

    this.player.on(
      'effect/lose/you',
      (id, matches) => this.buffTracker?.onYouLoseEffect(id, matches),
    );

    this.player.on('effect/lose', (id, matches) => {
      // mob id starts with '4'
      if (matches.targetId?.startsWith('4'))
        this.buffTracker?.onMobLosesEffect(id, matches);
    });

    this.ee.on('zone/change', (id, _name, info) => {
      this.inPvPZone = isPvPZone(id);
      this.contentType = info?.contentType;

      this._updateFoodBuff();

      this.buffTracker?.clear();

      // Hide UI except HP and MP bar if change to pvp area.
      this.bars._updateUIVisibility(this.inPvPZone);
    });

    this.ee.on('log/game', (_log, _line, rawLine) => {
      const m = this.regexes?.countdownStartRegex.exec(rawLine);
      if (m && m.groups?.time) {
        const seconds = parseFloat(m.groups.time);
        this.bars._setPullCountdown(seconds);
      }
      if (this.regexes?.countdownCancelRegex.test(rawLine))
        this.bars._setPullCountdown(0);
      if (Util.isCraftingJob(this.player.job))
        this._onCraftingLog(rawLine);
    });
  }

  private _onPartyWipe(): void {
    this.buffTracker?.clear();
    // Reset job-specific ui
    this.component?.reset();
  }

  private _onCraftingLog(message: string): void {
    if (!this.regexes)
      return;

    // Hide CP Bar when not crafting
    const anyRegexMatched = (line: string, array: RegExp[]) =>
      array.some((regex) => regex.test(line));

    // if the current player is crafting, show the bars;
    // otherwise, hide them
    if (anyRegexMatched(message, this.regexes.craftingStartRegexes))
      this.bars.setJobsContainerVisibility(true);
    if (
      anyRegexMatched(message, this.regexes.craftingStopRegexes) ||
      this.regexes.craftingFinishRegexes.some((regex) => {
        const m = regex.exec(message)?.groups;
        return m && (!m.player || m.player === this.player.name);
      })
    )
      this.bars.setJobsContainerVisibility(false);
  }

  private _updateFoodBuff(): void {
    if (!this._shouldShowFoodBuff()) {
      this.bars._showFoodBuff(false);
      return;
    }

    const showAtMs = this.foodBuffExpiresTimeMs - (this.options.HideWellFedAboveSeconds * 1000);
    const showMs = showAtMs - Date.now();

    window.clearTimeout(this.foodBuffTimer);
    this.foodBuffTimer = 0;

    if (showMs <= 0) {
      this.bars._showFoodBuff(true);
    } else {
      this.bars._showFoodBuff(false);
      this.foodBuffTimer = window.setTimeout(() => this._updateFoodBuff(), showMs);
    }
  }

  private _shouldShowFoodBuff(): boolean {
    return (
      this.options.HideWellFedAboveSeconds !== 0 &&
      !this.component?.inCombat &&
      this.contentType !== undefined &&
      kWellFedContentTypes.includes(this.contentType)
    );
  }
}
