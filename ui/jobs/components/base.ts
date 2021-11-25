import EffectId from '../../../resources/effect_id';
import PartyTracker from '../../../resources/party';
import Util from '../../../resources/util';
import ZoneInfo from '../../../resources/zone_info';
import { Bars } from '../bars';
import { BuffTracker } from '../buff_tracker';
import { JobsEventEmitter } from '../event_emitter';
import { JobsOptions } from '../jobs_options';
import { Player } from '../player';
import { isPvPZone, RegexesHolder } from '../utils';

import { getReset, getSetup } from './index';

export class BaseComponent {
  bars: Bars;
  buffTracker?: BuffTracker;
  ee: JobsEventEmitter;
  options: JobsOptions;
  partyTracker: PartyTracker;
  player: Player;
  regexes?: RegexesHolder;

  // misc variables
  inCombat: boolean;
  zoneId: number;
  // food buffs
  foodBuffExpiresTimeMs: number;
  foodBuffTimer: number;
  // gp potions
  gpAlarmReady: boolean;
  gpPotion: boolean;

  umbralStacks: number;

  constructor(o: {
    bars: Bars;
    emitter: JobsEventEmitter;
    options: JobsOptions;
    partyTracker: PartyTracker;
    player: Player;
  }) {
    this.bars = o.bars;
    this.ee = o.emitter;
    this.options = o.options;
    this.partyTracker = o.partyTracker;
    this.player = o.player;

    this.inCombat = false;
    this.zoneId = -1;

    this.foodBuffExpiresTimeMs = 0;
    this.foodBuffTimer = 0;
    this.gpAlarmReady = false;
    this.gpPotion = false;

    this.umbralStacks = 0;
  }

  setup(): void {
    this.ee.registerOverlayListeners();

    // bind party changed event
    this.ee.on('party', (party) => this.partyTracker.onPartyChanged({ party }));

    this.player.on('level', (level, prevLevel) => {
      if (level - prevLevel) {
        this.bars._updateFoodBuff({
          inCombat: this.inCombat,
          foodBuffExpiresTimeMs: this.foodBuffExpiresTimeMs,
          foodBuffTimer: this.foodBuffTimer,
          contentType: ZoneInfo[this.zoneId]?.contentType,
        });
      }
    });

    // update mp ticker
    this.player.on('mp', (data) => {
      this.bars._updateMPTicker({
        ...data,
        inCombat: this.inCombat,
        umbralStacks: this.umbralStacks,
      });
    });
    this.player.on('gp', ({ gp }) => {
      this.bars._shouldPlayGpAlarm({
        gp: gp,
        gpAlarmReady: this.gpAlarmReady,
        gpPotion: this.gpPotion,
      });
    });

    this.player.on('job', (job) => {
      // FIXME: remove this
      // Update MP ticker as umbral stacks has changed.
      this.umbralStacks = 0;
      if (!Util.isGatheringJob(this.player.job))
        this.gpAlarmReady = false;

      this.bars._setupJobContainers(job);

      const setup = getSetup(job);
      if (setup)
        setup.bind(null, this.bars, this.player)();

      // add food buff trigger
      this.player.onYouGainEffect((id, matches) => {
        if (id === EffectId.WellFed) {
          const seconds = parseFloat(matches.duration ?? '0');
          const now = Date.now(); // This is in ms.
          this.foodBuffExpiresTimeMs = now + (seconds * 1000);
          this.bars._updateFoodBuff({
            inCombat: this.inCombat,
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
      if (this.inCombat !== game) {
        this.inCombat = game;
        this.bars._updateFoodBuff({
          inCombat: this.inCombat,
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
        inCombat: this.inCombat,
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
    const reset = getReset(this.player.job);
    if (reset)
      reset.bind(null, this.bars, this.player)();
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
