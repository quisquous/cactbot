import EventEmitter from 'eventemitter3';

import logDefinitions from '../../resources/netlog_defs';
import { addOverlayListener } from '../../resources/overlay_plugin_api';
import ZoneInfo from '../../resources/zone_info';
import { EventResponses as OverlayEventResponses } from '../../types/event';
import { NetFields } from '../../types/net_fields';
import { ToMatches } from '../../types/net_matches';

import ComboTracker from './combo_tracker';
import { Player } from './player';
import { normalizeLogLine } from './utils';

export interface EventMap {
  // zone changing
  'zone/change': (id: number, name: string, info?: typeof ZoneInfo[number]) => void;
  // battle events
  'battle/in-combat': (info: { game: boolean; act: boolean }) => void;
  'battle/wipe': () => void;
  'battle/target': (target?: { name: string; distance: number; effectiveDistance: number }) => void;
  // triggered when casts actions
  'action/you': (actionId: string, info: Partial<ToMatches<NetFields['Ability']>>) => void;
  'action/party': (actionId: string, info: Partial<ToMatches<NetFields['Ability']>>) => void;
  'action/other': (actionId: string, info: Partial<ToMatches<NetFields['Ability']>>) => void;
  // triggered when combo state changes
  'action/combo': (actionId: string | undefined, combo: ComboTracker) => void;
  // triggered when effect gains or loses
  'effect/gain': (effectId: string, info: Partial<ToMatches<NetFields['GainsEffect']>>) => void;
  'effect/lose': (effectId: string, info: Partial<ToMatches<NetFields['LosesEffect']>>) => void;
  'effect/gain/you': (effectId: string, info: Partial<ToMatches<NetFields['GainsEffect']>>) => void;
  'effect/lose/you': (effectId: string, info: Partial<ToMatches<NetFields['LosesEffect']>>) => void;
  // triggered when dot or hot tick
  'tick/dot': (damage: number, info: Partial<ToMatches<NetFields['NetworkDoT']>>) => void;
  'tick/hot': (heal: number, info: Partial<ToMatches<NetFields['NetworkDoT']>>) => void;
  // triggered when any log line is printed
  'log': (line: string[], rawLine: string) => void;
  'log/game': (
    log: Partial<ToMatches<NetFields['GameLog']>>,
    line: string[],
    rawLine: string,
  ) => void;
}

export class JobsEventEmitter extends EventEmitter<EventMap> {
  public combo: ComboTracker;
  public player: Player;

  constructor() {
    super();

    this.player = new Player(this);

    // setup combo tracker
    this.combo = ComboTracker.setup((id) => {
      this.emit('action/combo', id, this.combo);
    });
    this.on('action/you', (actionId) => {
      this.combo.HandleAbility(actionId);
    });
    this.player.on('hp', ({ hp }) => {
      if (hp === 0)
        this.combo.AbortCombo();
    });
    // Combos are job specific.
    this.player.on('job', () => this.combo.AbortCombo());
  }

  registerOverlayListeners(): void {
    addOverlayListener('onPlayerChangedEvent', (ev) => {
      this.player.onPlayerChangedEvent(ev);
    });

    addOverlayListener('EnmityTargetData', (ev) => {
      this.processEnmityTargetData(ev);
    });

    addOverlayListener('onPartyWipe', () => {
      this.emit('battle/wipe');
    });

    addOverlayListener('onInCombatChangedEvent', (ev) => {
      this.emit('battle/in-combat', {
        game: ev.detail.inGameCombat,
        act: ev.detail.inACTCombat,
      });
    });

    addOverlayListener('ChangeZone', (ev) => {
      this.emit('zone/change', ev.zoneID, ev.zoneName, ZoneInfo[ev.zoneID]);
    });

    addOverlayListener('LogLine', (ev) => {
      this.processLogLine(ev);
    });
  }

  private processLogLine(ev: OverlayEventResponses['LogLine']): void {
    const type = ev.line[logDefinitions.None.fields.type];

    this.emit('log', ev.line, ev.rawLine);

    switch (type) {
      case logDefinitions.GameLog.type:
        this.emit(
          'log/game',
          normalizeLogLine(ev.line, logDefinitions.GameLog.fields),
          ev.line,
          ev.rawLine,
        );
        break;
      case logDefinitions.PlayerStats.type: {
        this.player.onPlayerStats(ev.line);
        break;
      }
      case logDefinitions.GainsEffect.type: {
        const matches = normalizeLogLine(ev.line, logDefinitions.GainsEffect.fields);
        const effectId = matches.effectId?.toUpperCase();
        if (!effectId)
          break;

        if (parseInt(matches.sourceId ?? '0', 16) === this.player.id)
          this.emit('effect/gain/you', effectId, matches);
        this.emit('effect/gain', effectId, matches);
        break;
      }
      case logDefinitions.LosesEffect.type: {
        const matches = normalizeLogLine(ev.line, logDefinitions.LosesEffect.fields);
        const effectId = matches.effectId?.toUpperCase();
        if (!effectId)
          break;

        if (parseInt(matches.sourceId ?? '0', 16) === this.player.id)
          this.emit('effect/lose/you', effectId, matches);
        this.emit('effect/lose', effectId, matches);
        break;
      }
      case logDefinitions.Ability.type:
      case logDefinitions.NetworkAOEAbility.type: {
        const matches = normalizeLogLine(ev.line, logDefinitions.Ability.fields);
        const sourceId = matches.sourceId;
        const id = matches.id;
        if (!id)
          break;

        if (sourceId && parseInt(sourceId, 16) === this.player.id)
          this.emit('action/you', id, matches);
        break;
      }

      case logDefinitions.NetworkDoT.type: {
        const matches = normalizeLogLine(ev.line, logDefinitions.NetworkDoT.fields);
        const damage = parseInt(matches.damage ?? '0', 16); // damage is in hex
        if (matches.which === 'DoT')
          this.emit('tick/dot', damage, matches);
        else if (matches.which === 'HoT')
          this.emit('tick/hot', damage, matches);
        break;
      }

      default:
        break;
    }
  }

  processEnmityTargetData({ Target: target }: OverlayEventResponses['EnmityTargetData']): void {
    if (target) {
      this.emit('battle/target', {
        name: target.Name,
        distance: target.Distance,
        effectiveDistance: target.EffectiveDistance,
      });
    } else {
      this.emit('battle/target');
    }
  }
}

/**
 * Track DoTs that was applied to mobs.
 *
 * Emit events when DoT ticks on your main target.
 *
 * The mechanism of this tracker is to find out the target that player
 * has applied DoT to and attacked with some actions.
 * (Which we call it the "last attacked DoTed target", is the boss in most cases.)
 * For a Bard, if there are a boss and some adds, the Bard would likely
 * keep the DoT on the boss while attacking the adds without any DoT.
 *
 * @example
 *
 * const tracker = new DoTTracker(jobsEventEmitter);
 * tracker.onTick([EffectId.Stormbite, EffectId.CausticBite], (targetId) => {
 *   // do something like update repertoire timer.
 * });
 */
export class DotTracker extends EventEmitter<{ tick: (targetId?: string) => void }, DotTracker> {
  ee: JobsEventEmitter;
  player: Player;
  trackedDoTs: string[];

  targets: string[];
  lastAttackedTarget?: string;

  constructor(jobsEventEmitter: JobsEventEmitter) {
    super();

    this.ee = jobsEventEmitter;
    this.player = jobsEventEmitter.player;
    this.trackedDoTs = [];

    this.targets = [];

    this.registerListeners();
  }

  private registerListeners(): void {
    this.ee.on('effect/gain', (id, { sourceId, targetId }) => {
      if (
        targetId?.startsWith('4') &&
        parseInt(sourceId ?? '0', 16) === this.ee.player.id &&
        this.trackedDoTs.includes(id)
      )
        this.targets.push(targetId);
    });

    this.ee.on('effect/lose', (id, { sourceId, targetId }) => {
      if (
        targetId?.startsWith('4') &&
        parseInt(sourceId ?? '0', 16) === this.ee.player.id &&
        this.trackedDoTs.includes(id)
      )
        this.targets.splice(this.targets.indexOf(targetId), 1);
    });

    this.ee.on('action/you', (_id, { targetId }) => {
      if (targetId?.startsWith('4'))
        this.lastAttackedTarget = targetId;
    });

    this.ee.on('tick/dot', (_damage, { id, effectId }) => {
      if (
        id &&
        this.lastAttackedTarget === id &&
        this.targets.includes(id) &&
        // if effectId is not 0, that means this DoT tick is produced
        // by a "damage field" skill (e.g. Ninja's "Doton" or Dark Knight's "Salted Earth")
        // which is not a literal DoT.
        effectId === '0'
      )
        this.emit('tick', id);
    });

    // reset on job change or zone change or out of combat
    this.player.on('job', () => this.reset());
    this.ee.on('zone/change', () => this.reset());
    this.ee.on('battle/in-combat', ({ game }) => {
      if (game === false)
        this.reset();
    });
  }

  onTick(trackedDoTs: string[], cb: (targetId?: string) => void): void {
    this.trackedDoTs = trackedDoTs;
    this.removeAllListeners();
    this.on('tick', cb);
  }

  reset(): void {
    this.targets = [];
    this.lastAttackedTarget = undefined;
  }
}

export const jobsEventEmitter = new JobsEventEmitter();
