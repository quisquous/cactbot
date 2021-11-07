import { EventResponses } from '../../types/event';
import { NetMatches } from '../../types/net_matches';
import { OopsyMistake } from '../../types/oopsy';

import { MistakeObserver } from './mistake_observer';
import { IsPlayerId, IsTriggerEnabled, Translate } from './oopsy_common';
import { OopsyOptions } from './oopsy_options';

const kEarlyPullText = {
  en: 'early pull',
  de: 'zu früh angegriffen',
  fr: 'early pull',
  ja: 'タゲ取り早い',
  cn: '抢开',
  ko: '풀링 빠름',
};

const kLatePullText = {
  en: 'late pull',
  de: 'zu spät angegriffen',
  fr: 'late pull',
  ja: 'タゲ取り遅い',
  cn: '晚开',
  ko: '풀링 늦음',
};

const kPartyWipeText = {
  en: 'Party Wipe',
  de: 'Gruppe ausgelöscht',
  fr: 'Party Wipe',
  ja: 'ワイプ',
  cn: '团灭',
  ko: '파티 전멸',
};

// Internal trigger id for early pull
const kEarlyPullId = 'General Early Pull';

// Collector:
// * processes mistakes, adds lines to the live list
// * handles timing issues with starting/stopping/early pulls
export class MistakeCollector {
  private inACTCombat = false;
  private inGameCombat = false;
  private startTime?: number;
  private stopTime?: number;
  private engageTime?: number;
  public firstPuller?: string;
  private observers: MistakeObserver[] = [];

  constructor(private options: OopsyOptions) {
    this.Reset();
  }

  AddObserver(observer: MistakeObserver): void {
    this.observers.push(observer);
  }

  Reset(): void {
    this.startTime = undefined;
    this.stopTime = undefined;
    this.firstPuller = undefined;
    this.engageTime = undefined;
  }

  StartCombat(): void {
    // Wiping / in combat state / damage are all racy with each other.
    // One potential ordering:
    //   -in combat: false
    //   -wipe
    //   -belated death/damage <-- this damage shouldn't start
    //   -damage (early pull) <-- this damage should
    //   -in combat: true
    // Therefore, suppress "start combat" after wipes within a short
    // period of time.  Gross.
    //
    // Because damage comes before in combat (regardless of where engage
    // occurs), StartCombat has to be responsible for clearing the mistakeObserver
    // list.
    const now = Date.now();
    const kMinimumSecondsAfterWipe = 5;
    if (this.stopTime && now - this.stopTime < 1000 * kMinimumSecondsAfterWipe)
      return;
    this.startTime = now;
    this.stopTime = undefined;
  }

  StopCombat(): void {
    this.startTime = undefined;
    this.stopTime = Date.now();
    this.firstPuller = undefined;
    this.engageTime = undefined;
  }

  OnMistakeObj(m?: OopsyMistake): void {
    if (!m)
      return;
    for (const observer of this.observers)
      observer.OnMistakeObj(m);
  }

  AddEngage(): void {
    this.engageTime = Date.now();
    if (!this.firstPuller || !this.startTime) {
      this.StartCombat();
      return;
    }
    const seconds = ((Date.now() - this.startTime) / 1000);
    if (seconds >= this.options.MinimumTimeForPullMistake) {
      const text = `${Translate(this.options.DisplayLanguage, kEarlyPullText) ?? ''} (${
        seconds.toFixed(1)
      }s)`;
      if (IsTriggerEnabled(this.options, kEarlyPullId)) {
        this.OnMistakeObj({
          type: 'pull',
          name: this.firstPuller,
          blame: this.firstPuller,
          text: text,
        });
      }
    }
  }

  AddDamage(matches: NetMatches['Ability']): void {
    if (this.firstPuller)
      return;
    if (IsPlayerId(matches.sourceId))
      this.firstPuller = matches.source;
    else if (IsPlayerId(matches.targetId))
      this.firstPuller = matches.target;
    else
      this.firstPuller = '???';

    this.StartCombat();
    if (this.engageTime) {
      const seconds = ((Date.now() - this.engageTime) / 1000);
      if (seconds >= this.options.MinimumTimeForPullMistake) {
        const text = `${Translate(this.options.DisplayLanguage, kLatePullText) ?? ''} (${
          seconds.toFixed(1)
        }s)`;
        if (IsTriggerEnabled(this.options, kEarlyPullId)) {
          this.OnMistakeObj({
            type: 'pull',
            name: this.firstPuller,
            blame: this.firstPuller,
            text: text,
          });
        }
      }
    }
  }

  OnPartyWipeEvent(): void {
    // TODO: record the time that StopCombat occurs and throw the party
    // wipe then (to make post-wipe deaths more obvious), however this
    // requires making liveList be able to insert items in a sorted
    // manner instead of just being append only.
    this.OnMistakeObj({
      type: 'wipe',
      text: kPartyWipeText,
    });
    // Party wipe usually comes a few seconds after everybody dies
    // so this will clobber any late damage.
    this.StopCombat();
  }

  OnInCombatChangedEvent(e: EventResponses['onInCombatChangedEvent']): void {
    // For usability sake:
    //   - to avoid dungeon trash starting stopping combat and resetting the
    //     list repeatedly, only reset when ACT starts a new encounter.
    //   - for consistency with DPS meters, fflogs, etc, use ACT's encounter
    //     time as the start time, not when game combat becomes true.
    //   - to make it more readable, show/hide old mistakes out of game
    //     combat, and consider early pulls starting game combat early.  This
    //     allows for one long dungeon ACT encounter to have multiple early
    //     or late pulls.
    const inGameCombat = e.detail.inGameCombat;
    if (this.inGameCombat !== inGameCombat) {
      this.inGameCombat = inGameCombat;
      if (inGameCombat)
        this.StartCombat();
      else
        this.StopCombat();
    }

    const inACTCombat = e.detail.inACTCombat;
    if (this.inACTCombat !== inACTCombat) {
      this.inACTCombat = inACTCombat;
      if (inACTCombat) {
        // TODO: This message should probably include the timestamp
        // for when combat started.  Starting here is not the right
        // time if this plugin is loaded while ACT is already in combat.
        for (const observer of this.observers)
          observer.StartNewACTCombat();
      }
    }
  }

  OnChangeZone(_e: EventResponses['ChangeZone']): void {
    this.Reset();
    for (const observer of this.observers)
      observer.OnChangeZone(_e);
  }
}
