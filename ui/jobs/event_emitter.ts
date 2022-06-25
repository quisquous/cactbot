import EventEmitter from 'eventemitter3';

import logDefinitions from '../../resources/netlog_defs';
import { addOverlayListener } from '../../resources/overlay_plugin_api';
import ZoneInfo from '../../resources/zone_info';
import { EventResponses as OverlayEventResponses, Party } from '../../types/event';
import { NetFields } from '../../types/net_fields';
import { ToMatches } from '../../types/net_matches';

import { Player } from './player';
import { normalizeLogLine } from './utils';

export type PartialFieldMatches<Field extends keyof NetFields> = Partial<
  ToMatches<NetFields[Field]>
>;

export interface EventMap {
  'player': (data: OverlayEventResponses['onPlayerChangedEvent']) => void;
  // party changed
  'party': (party: Party[]) => void;
  // zone changing
  'zone/change': (id: number, name: string, info?: typeof ZoneInfo[number]) => void;
  // battle events
  'battle/in-combat': (info: { game: boolean; act: boolean }) => void;
  'battle/wipe': () => void;
  'battle/target': (target?: { name: string; distance: number; effectiveDistance: number }) => void;
  // triggered when effect gains or loses
  'effect/gain': (effectId: string, info: PartialFieldMatches<'GainsEffect'>) => void;
  'effect/lose': (effectId: string, info: PartialFieldMatches<'LosesEffect'>) => void;
  // triggered when dot or hot tick
  'tick/dot': (damage: number, info: PartialFieldMatches<'NetworkDoT'>) => void;
  'tick/hot': (heal: number, info: PartialFieldMatches<'NetworkDoT'>) => void;
  // triggered when any log line is printed
  'log': (line: string[], rawLine: string) => void;
  'log/game': (
    log: PartialFieldMatches<'GameLog'>,
    line: string[],
    rawLine: string,
  ) => void;
}

export class JobsEventEmitter extends EventEmitter<EventMap> {
  constructor() {
    super();
  }

  registerOverlayListeners(): void {
    addOverlayListener('onPlayerChangedEvent', (ev) => {
      this.emit('player', ev);
    });

    addOverlayListener('EnmityTargetData', (ev) => {
      this.processEnmityTargetData(ev);
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

    addOverlayListener('PartyChanged', (e) => {
      this.emit('party', e.party ?? []);
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
      case logDefinitions.GainsEffect.type: {
        const matches = normalizeLogLine(ev.line, logDefinitions.GainsEffect.fields);
        if (matches.effectId !== undefined && matches.effectId.length > 0)
          this.emit('effect/gain', matches.effectId, matches);
        break;
      }
      case logDefinitions.LosesEffect.type: {
        const matches = normalizeLogLine(ev.line, logDefinitions.LosesEffect.fields);
        if (matches.effectId !== undefined && matches.effectId.length > 0)
          this.emit('effect/lose', matches.effectId, matches);
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
      case logDefinitions.ActorControl.type: {
        const matches = normalizeLogLine(ev.line, logDefinitions.ActorControl.fields);
        if (matches.command === '40000010')
          this.emit('battle/wipe');
        break;
      }

      default:
        break;
    }
  }

  processEnmityTargetData({ Target: target }: OverlayEventResponses['EnmityTargetData']): void {
    if (target !== null) {
      this.emit('battle/target', {
        name: target.Name,
        distance: parseFloat(target.Distance),
        effectiveDistance: parseFloat(target.EffectiveDistance),
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
 * const tracker = new DoTTracker({ emitter: emitter, player: player});
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

  constructor(o: {
    emitter: JobsEventEmitter;
    player: Player;
  }) {
    super();

    this.ee = o.emitter;
    this.player = o.player;
    this.trackedDoTs = [];

    this.targets = [];

    this.registerListeners();
  }

  private registerListeners(): void {
    this.player.on('effect/gain', (id, { sourceId, targetId }) => {
      if (
        targetId?.startsWith('4') &&
        sourceId?.toUpperCase() === this.player.idHex &&
        this.trackedDoTs.includes(id)
      )
        this.targets.push(targetId);
    });

    this.player.on('effect/lose', (id, { sourceId, targetId }) => {
      if (
        targetId?.startsWith('4') &&
        sourceId?.toUpperCase() === this.player.idHex &&
        this.trackedDoTs.includes(id)
      )
        this.targets.splice(this.targets.indexOf(targetId), 1);
    });

    this.player.on('action/you', (_id, { targetId }) => {
      if (targetId?.startsWith('4'))
        this.lastAttackedTarget = targetId;
    });

    this.ee.on('tick/dot', (_damage, { id, effectId }) => {
      if (
        id !== undefined &&
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
