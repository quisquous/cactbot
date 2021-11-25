import EffectId from '../../../resources/effect_id';
import PartyTracker from '../../../resources/party';
import Util from '../../../resources/util';
import ZoneInfo from '../../../resources/zone_info';
import { Job } from '../../../types/job';
import { Bars } from '../bars';
import { BuffTracker } from '../buff_tracker';
import { JobsEventEmitter } from '../event_emitter';
import { JobsOptions } from '../jobs_options';
import { Player } from '../player';
import { doesJobNeedMPBar, isPvPZone, RegexesHolder } from '../utils';

import { ASTComponent } from './ast';
import { BaseComponent, ComponentInterface, ShouldShows } from './base';
import { BLMComponent } from './blm';
import { BLUComponent } from './blu';
import { BRDComponent } from './brd';
import { DNCComponent } from './dnc';
import { reset as resetDrg, setup as setupDrg } from './drg';
import { reset as resetDrk, setup as setupDrk } from './drk';
import { reset as resetGnb, setup as setupGnb } from './gnb';
import { reset as resetMch, setup as setupMch } from './mch';
import { reset as resetMnk, setup as setupMnk } from './mnk';
import { reset as resetNin, setup as setupNin } from './nin';
import { reset as resetPld, setup as setupPld } from './pld';
import { reset as resetRdm, setup as setupRdm } from './rdm';
import { reset as resetSam, setup as setupSam } from './sam';
import { reset as resetSch, setup as setupSch } from './sch';
import { reset as resetSmn, setup as setupSmn } from './smn';
import { reset as resetWar, setup as setupWar } from './war';
import { reset as resetWhm, setup as setupWhm } from './whm';

export const getSetup = (job: string): undefined | ((bars: Bars, player: Player) => void) => {
  return {
    'PLD': setupPld,
    'WAR': setupWar,
    'DRK': setupDrk,
    'GNB': setupGnb,
    'WHM': setupWhm,
    'SCH': setupSch,
    'MNK': setupMnk,
    'DRG': setupDrg,
    'NIN': setupNin,
    'SAM': setupSam,
    'MCH': setupMch,
    'SMN': setupSmn,
    'RDM': setupRdm,
  }[job.toUpperCase()];
};

export const getReset = (job: string): undefined | ((bars: Bars, player: Player) => void) => {
  return {
    'PLD': resetPld,
    'WAR': resetWar,
    'DRK': resetDrk,
    'GNB': resetGnb,
    'WHM': resetWhm,
    'SCH': resetSch,
    'MNK': resetMnk,
    'DRG': resetDrg,
    'NIN': resetNin,
    'SAM': resetSam,
    'MCH': resetMch,
    'SMN': resetSmn,
    'RDM': resetRdm,
  }[job.toUpperCase()];
};

const ComponentMap: Record<Job, typeof BaseComponent> = {
  // tank
  GLA: BaseComponent,
  PLD: BaseComponent,
  MRD: BaseComponent,
  WAR: BaseComponent,
  DRK: BaseComponent,
  GNB: BaseComponent,
  // healer
  CNJ: BaseComponent,
  WHM: BaseComponent,
  SCH: BaseComponent,
  AST: ASTComponent,
  // melee dps
  PGL: BaseComponent,
  MNK: BaseComponent,
  LNC: BaseComponent,
  DRG: BaseComponent,
  ROG: BaseComponent,
  NIN: BaseComponent,
  SAM: BaseComponent,
  // ranged dps
  ARC: BaseComponent,
  BRD: BRDComponent,
  MCH: BaseComponent,
  DNC: DNCComponent,
  // magic dps
  ACN: BaseComponent,
  SMN: BaseComponent,
  THM: BLMComponent,
  BLM: BLMComponent,
  RDM: BaseComponent,
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

export class ComponentFactory {
  bars: Bars;
  buffTracker?: BuffTracker;
  ee: JobsEventEmitter;
  options: JobsOptions;
  partyTracker: PartyTracker;
  player: Player;
  regexes?: RegexesHolder;
  component?: BaseComponent;

  // misc variables
  shouldShows: ShouldShows;
  zoneId: number;
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

    this.shouldShows = {};
    this.zoneId = -1;

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
          contentType: ZoneInfo[this.zoneId]?.contentType,
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
        buffList: this.shouldShows.buffList ?? true,
        pullBar: this.shouldShows.pullBar ?? true,
        hpBar: this.shouldShows.hpBar ?? (!Util.isCraftingJob(job) && !Util.isGatheringJob(job)),
        mpBar: this.shouldShows.mpBar ??
          (!Util.isCraftingJob(job) && !Util.isGatheringJob(job) && doesJobNeedMPBar(job)),
        cpBar: this.shouldShows.cpBar ?? Util.isCraftingJob(job),
        gpBar: this.shouldShows.gpBar ?? Util.isGatheringJob(job),
        mpTicker: this.shouldShows.mpTicker ?? this.options.ShowMPTicker.includes(job),
      });

      // const setup = getSetup(job);
      // if (setup)
      //   setup.bind(null, this.bars, this.player)();
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
            contentType: ZoneInfo[this.zoneId]?.contentType,
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
          contentType: ZoneInfo[this.zoneId]?.contentType,
        });
      }

      // make bars transparent when out of combat if requested
      this.bars._updateOpacity(!game || this.options.LowerOpacityOutOfCombat);
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

    this.ee.on('zone/change', (id) => {
      this.bars._updateFoodBuff({
        inCombat: this.component?.inCombat ?? false,
        foodBuffExpiresTimeMs: this.foodBuffExpiresTimeMs,
        foodBuffTimer: this.foodBuffTimer,
        contentType: ZoneInfo[this.zoneId]?.contentType,
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
    // const reset = getReset(this.player.job);
    // if (reset)
    //   reset.bind(null, this.bars, this.player)();
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

    // if crafting, hide it; otherwise, show it
    this.bars.setJobsContainerVisibility(crafting);
  }
}
