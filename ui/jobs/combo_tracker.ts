import { EventEmitter } from 'eventemitter3';

import {
  kComboActions,
  kComboBreakers,
  kComboBreakers5x,
  kComboDelay,
  kComboDelay5x,
} from './constants';
import { Player } from './player';

type StartMap = {
  [s: string]: {
    id: string;
    next: StartMap;
  };
};

export type ComboCallback = (id: string | undefined, combo: ComboTracker) => void;

/**
 * Track combos that the current player uses.
 *
 * Emit `combo` event for each combo/comboBreakers skill
 * - when cast in combo, skill => its HexID
 * - when cast out of combo/cast comboBreakers, skill => undefined
 */
export class ComboTracker extends EventEmitter<{ combo: ComboCallback }> {
  player: Player;

  comboDelayMs: number;
  comboTimer?: number;
  comboBreakers: readonly string[];
  startMap: StartMap;
  considerNext: StartMap;
  isFinalSkill: boolean;

  constructor(
    { comboBreakers, player, comboDelayMs }: {
      player: Player;
      comboBreakers: readonly string[];
      comboDelayMs: number;
    },
  ) {
    super();

    this.player = player;

    this.comboDelayMs = comboDelayMs;
    this.comboTimer = undefined;
    this.comboBreakers = comboBreakers;
    // A tree of nodes.
    this.startMap = {}; // {} key => { id: str, next: { key => node } }
    this.considerNext = this.startMap;
    this.isFinalSkill = false;

    // register events
    this.player.on('action/you', (id) => this.HandleAbility(id));
    this.player.on('hp', ({ hp }) => {
      if (hp === 0)
        this.AbortCombo();
    });
    // Combos are job specific.
    this.player.on('job', () => this.AbortCombo());
  }

  AddCombo(skillList: string[]): void {
    let nextMap: StartMap = this.startMap;

    skillList.forEach((id) => {
      const node = {
        id: id,
        next: {},
      };

      let nextEntry = nextMap[id];
      if (!nextEntry)
        nextEntry = nextMap[id] = node;
      nextMap = nextEntry.next;
    });
  }

  HandleAbility(id: string): void {
    if (id in this.considerNext) {
      this.StateTransition(id, this.considerNext[id]);
      return;
    }

    if (this.comboBreakers.includes(id))
      this.AbortCombo(id);
  }

  StateTransition(id?: string, nextState?: StartMap[string]): void {
    window.clearTimeout(this.comboTimer);
    this.comboTimer = undefined;

    this.isFinalSkill = (nextState && Object.keys(nextState.next).length === 0) ?? false;
    if (!nextState || this.isFinalSkill) {
      this.considerNext = this.startMap;
    } else {
      this.considerNext = Object.assign({}, this.startMap, nextState?.next);
      this.comboTimer = window.setTimeout(() => {
        this.AbortCombo();
      }, this.comboDelayMs);
    }

    // If not aborting, then this is a valid combo skill.
    this.emit('combo', nextState ? id : undefined, this);
  }

  AbortCombo(id?: string): void {
    this.StateTransition(id);
  }

  static setup(is5x: boolean, player: Player): ComboTracker {
    const breakers = is5x ? kComboBreakers5x : kComboBreakers;
    const comboTracker = new ComboTracker({
      player: player,
      comboBreakers: breakers,
      comboDelayMs: (is5x ? kComboDelay5x : kComboDelay) * 1000,
    });
    kComboActions.forEach((skillList) => comboTracker.AddCombo(skillList));
    return comboTracker;
  }
}
