import { EventResponses } from '../../types/event';
import { NetMatches } from '../../types/net_matches';
import { OopsyMistake } from '../../types/oopsy';
import { LocaleText } from '../../types/trigger';

import { ShortNamify, UnscrambleDamage, IsPlayerId, IsTriggerEnabled, kFlagInstantDeath } from './oopsy_common';
import { OopsyListView } from './oopsy_list_view';
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
  private baseTime?: number;
  private startTime?: number;
  private stopTime?: number;
  private engageTime?: number;
  private firstPuller?: string;

  constructor(private options: OopsyOptions, private listView: OopsyListView) {
    this.Reset();
  }

  Reset(): void {
    this.startTime = undefined;
    this.stopTime = undefined;
    this.firstPuller = undefined;
    this.engageTime = undefined;
  }

  GetFormattedTime(time?: number): string {
    if (!this.baseTime)
      return '';
    if (!time)
      time = Date.now();
    const totalSeconds = Math.floor((time - this.baseTime) / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
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
    // occurs), StartCombat has to be responsible for clearing the listView
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

  Translate(obj: LocaleText | string | undefined): string | undefined {
    if (typeof obj !== 'object')
      return obj;
    return obj[this.options.DisplayLanguage] ?? obj['en'];
  }

  OnMistakeObj(m?: OopsyMistake): void {
    if (!m)
      return;
    if (m.fullText)
      this.OnFullMistakeText(m.type, m.blame, this.Translate(m.fullText));
    else
      this.OnMistakeText(m.type, m.name || m.blame, this.Translate(m.text));
  }

  OnMistakeText(type: string, blame?: string, text?: string, time?: number): void {
    if (!text)
      return;
    const blameText = blame ? ShortNamify(blame, this.options.PlayerNicks) + ': ' : '';
    this.listView.AddLine(type, blameText + text, this.GetFormattedTime(time));
  }

  OnFullMistakeText(type: string, blame?: string, text?: string, time?: number): void {
    if (!text)
      return;
    this.listView.AddLine(type, text, this.GetFormattedTime(time));
  }

  AddEngage(): void {
    if (!this.startTime)
      throw new Error('Must StartCombat before AddEngage');

    this.engageTime = Date.now();
    if (!this.firstPuller) {
      this.StartCombat();
      return;
    }
    const seconds = ((Date.now() - this.startTime) / 1000);
    if (this.firstPuller && seconds >= this.options.MinimumTimeForPullMistake) {
      const text = `${this.Translate(kEarlyPullText) ?? ''} (${seconds.toFixed(1)}s)`;
      if (IsTriggerEnabled(this.options, kEarlyPullId))
        this.OnMistakeText('pull', this.firstPuller, text);
    }
  }

  AddDamage(matches: NetMatches['Ability']): void {
    if (!this.firstPuller) {
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
          const text = `${this.Translate(kLatePullText) ?? ''} (${seconds.toFixed(1)}s)`;
          if (IsTriggerEnabled(this.options, kEarlyPullId))
            this.OnMistakeText('pull', this.firstPuller, text);
        }
      }
    }
  }

  AddDeath(name: string, matches: NetMatches['Ability']): void {
    let text;
    if (matches) {
      // Note: ACT just evaluates independently what the hp of everybody
      // is and so may be out of date modulo one hp regen tick with
      // respect to the "current" hp value, e.g. charybdis may appear to do
      // more damage than you have hp, "killing" you.  This is good enough.

      // TODO: record the last N seconds of damage, as often folks are
      // killed by 2+ things (e.g. 3x flares, or 2x Blizzard III).

      // hp string = (damage/hp at time of death)
      let hp = '';
      if (matches.flags === kFlagInstantDeath) {
        // TODO: show something for infinite damage?
      } else if ('targetCurrentHp' in matches) {
        hp = ` (${UnscrambleDamage(matches.damage)}/${matches.targetCurrentHp})`;
      }
      text = `${matches.ability}${hp}`;
    }
    this.OnMistakeText('death', name, text);

    // TODO: some things don't have abilities, e.g. jumping off titan ex.
    // This will just show the last thing that hit you before you were
    // defeated.  Maybe the unparsed log entries have this??
  }

  OnPartyWipeEvent(_e: EventResponses['onPartyWipe']): void {
    // TODO: record the time that StopCombat occurs and throw the party
    // wipe then (to make post-wipe deaths more obvious), however this
    // requires making liveList be able to insert items in a sorted
    // manner instead of just being append only.
    this.OnFullMistakeText('wipe', undefined, this.Translate(kPartyWipeText));
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

      this.listView.SetInCombat(this.inGameCombat);
    }

    const inACTCombat = e.detail.inACTCombat;
    if (this.inACTCombat !== inACTCombat) {
      this.inACTCombat = inACTCombat;
      if (inACTCombat) {
        // TODO: This message should probably include the timestamp
        // for when combat started.  Starting here is not the right
        // time if this plugin is loaded while ACT is already in combat.
        this.baseTime = Date.now();
        this.listView.StartNewACTCombat();
      }
    }
  }

  OnChangeZone(_e: EventResponses['ChangeZone']): void {
    this.Reset();
  }
}
