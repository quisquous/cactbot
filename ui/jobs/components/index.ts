import EffectId from '../../../resources/effect_id';
import PartyTracker from '../../../resources/party';
import Util from '../../../resources/util';
import { Job } from '../../../types/job';
import { Bars } from '../bars';
import { BuffTracker } from '../buff_tracker';
import { JobsEventEmitter } from '../event_emitter';
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
import { SAMComponent } from './sam';
import { SCHComponent } from './sch';
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
  // melee dps
  PGL: MNKComponent,
  MNK: MNKComponent,
  LNC: BaseComponent,
  DRG: DRGComponent,
  ROG: NINComponent,
  NIN: NINComponent,
  SAM: SAMComponent,
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
  player: Player;
  regexes?: RegexesHolder;
  component?: BaseComponent;

  // misc variables
  shouldShow: ShouldShow;
  contentType?: number;
  // food buffs
  foodBuffExpiresTimeMs: number;
  foodBuffTimer: number;
  // gp potions
  gpAlarmReady: boolean;
  gpPotion: boolean;

  constructor(o: ComponentInterface) {
    this.bars = o.bars;
    this.ee = o.emitter;
    this.options = o.options;
    this.partyTracker = o.partyTracker;
    this.player = o.player;

    this.shouldShow = {};
    this.contentType = undefined;

    this.foodBuffExpiresTimeMs = 0;
    this.foodBuffTimer = 0;
    this.gpAlarmReady = false;
    this.gpPotion = false;

    this.setupListeners();
  }

  getJobComponents(job: Job): BaseComponent {
    const o = {
      bars: this.bars,
      emitter: this.ee,
      options: this.options,
      partyTracker: this.partyTracker,
      player: this.player,
    };
    const Component = ComponentMap[job];
    if (!Component)
      return new BaseComponent(o);

    return new Component(o);
  }

  setupListeners(): void {
    this.ee.registerOverlayListeners();

    // bind party changed event
    this.ee.on('party', (party) => this.partyTracker.onPartyChanged({ party }));

    this.player.on('level', (level, prevLevel) => {
      if (level - prevLevel) {
        this.bars._updateFoodBuff({
          inCombat: this.component?.inCombat ?? false,
          foodBuffExpiresTimeMs: this.foodBuffExpiresTimeMs,
          foodBuffTimer: this.foodBuffTimer,
          contentType: this.contentType,
        });
      }
    });

    // update mp ticker
    this.player.on('mp', (data) => {
      let umbralStacks = 0;
      if (this.component instanceof BLMComponent)
        umbralStacks = this.component.umbralStacks;

      this.bars._updateMPTicker({
        ...data,
        inCombat: this.component?.inCombat ?? false,
        umbralStacks: umbralStacks,
      });
    });
    this.player.on('gp', ({ gp }) => {
      this.gpAlarmReady = this.bars._shouldPlayGpAlarm({
        gp: gp,
        gpAlarmReady: this.gpAlarmReady,
        gpPotion: this.gpPotion,
      });
    });

    this.player.on('job', (job) => {
      if (!Util.isGatheringJob(this.player.job))
        this.gpAlarmReady = false;

      this.bars._setupJobContainers(job, {
        buffList: this.shouldShow.buffList ?? true,
        pullBar: this.shouldShow.pullBar ?? true,
        hpBar: this.shouldShow.hpBar ?? (!Util.isCraftingJob(job) && !Util.isGatheringJob(job)),
        mpBar: this.shouldShow.mpBar ??
          (!Util.isCraftingJob(job) && !Util.isGatheringJob(job) && doesJobNeedMPBar(job)),
        cpBar: this.shouldShow.cpBar ?? Util.isCraftingJob(job),
        gpBar: this.shouldShow.gpBar ?? Util.isGatheringJob(job),
        mpTicker: this.shouldShow.mpTicker ?? this.options.ShowMPTicker.includes(job),
      });

      // initialize components
      this.component = this.getJobComponents(job);

      // add food buff trigger
      this.player.onYouGainEffect((id, matches) => {
        if (id === EffectId.WellFed) {
          const seconds = parseFloat(matches.duration ?? '0');
          const now = Date.now(); // This is in ms.
          this.foodBuffExpiresTimeMs = now + (seconds * 1000);
          this.bars._updateFoodBuff({
            inCombat: this.component?.inCombat ?? false,
            foodBuffExpiresTimeMs: this.foodBuffExpiresTimeMs,
            foodBuffTimer: this.foodBuffTimer,
            contentType: this.contentType,
          });
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
        this.bars._updateFoodBuff({
          inCombat: this.component.inCombat,
          foodBuffExpiresTimeMs: this.foodBuffExpiresTimeMs,
          foodBuffTimer: this.foodBuffTimer,
          contentType: this.contentType,
        });
      }

      // make bars transparent when out of combat if requested
      this.bars._updateOpacity(!game && this.options.LowerOpacityOutOfCombat);
    });

    this.ee.on('battle/wipe', () => {
      this._onPartyWipe();
    });

    this.player.on('action/you', (id, matches) => {
      if (this.regexes?.cordialRegex.test(id)) {
        this.gpPotion = true;
        window.setTimeout(() => {
          this.gpPotion = false;
        }, 2000);
      }
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
      this.contentType = info?.contentType;

      this.bars._updateFoodBuff({
        inCombat: this.component?.inCombat ?? false,
        foodBuffExpiresTimeMs: this.foodBuffExpiresTimeMs,
        foodBuffTimer: this.foodBuffTimer,
        contentType: this.contentType,
      });

      this.buffTracker?.clear();

      // Hide UI except HP and MP bar if change to pvp area.
      this.bars._updateUIVisibility(isPvPZone(id));
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

    let crafting = false;

    if (anyRegexMatched(message, this.regexes.craftingStartRegexes))
      crafting = true;
    if (anyRegexMatched(message, this.regexes.craftingStopRegexes)) {
      crafting = false;
    } else {
      crafting = !this.regexes.craftingFinishRegexes.some((regex) => {
        const m = regex.exec(message)?.groups;
        return m && (!m.player || m.player === this.player.name);
      });
    }

    // if the current player is crafting, show the bars;
    // otherwise, hide them
    this.bars.setJobsContainerVisibility(crafting);
  }
}
