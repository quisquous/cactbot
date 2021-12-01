import { callOverlayHandler } from '../../resources/overlay_plugin_api';
import { EventResponses } from '../../types/event';
import { OopsyMistake } from '../../types/oopsy';

import { MistakeObserver, ViewEvent } from './mistake_observer';
import { OopsyOptions } from './oopsy_options';

const broadcastSource = 'oopsyraidsy';
const msgSyncRequestType = 'SyncRequest';
const msgSyncResponseType = 'SyncResponse';

// MistakeForwarder forwards observer calls to all observers.
// It also collects all events in case a broadcast sync is requested.
export class MistakeCollector implements MistakeObserver {
  private observers: MistakeObserver[] = [];
  private events: ViewEvent[] = [];

  private creationTime = Date.now();
  private latestSyncTimestamp?: number;

  constructor(private options: OopsyOptions) {
    this.AddObserver(this);
    this.RequestSync();
  }

  private DebugPrint(str: string): void {
    if (this.options.Debug)
      console.error(str);
  }

  private RequestSync(): void {
    console.log(`RequestSync: ${this.creationTime}`);
    void callOverlayHandler({
      call: 'broadcast',
      source: broadcastSource,
      msg: {
        type: msgSyncRequestType,
        id: this.creationTime,
        timestamp: this.creationTime,
      },
    });
  }

  private SendSyncResponse(): void {
    this.DebugPrint(`SendSyncResponse: ${this.creationTime}`);
    void callOverlayHandler({
      call: 'broadcast',
      source: broadcastSource,
      msg: {
        type: msgSyncResponseType,
        id: this.creationTime,
        timestamp: this.creationTime,
        data: JSON.stringify(this.events),
      },
    });
  }

  private ReceiveSyncResponse(timestamp: number, data: string): void {
    this.DebugPrint(`ReceiveSyncResponse: ${timestamp} (prev: ${this.latestSyncTimestamp ?? ''})`);
    this.latestSyncTimestamp = timestamp;

    try {
      const parsed = JSON.parse(data) as unknown;
      if (!Array.isArray(parsed)) {
        console.error('Malformed sync response');
        return;
      }

      // TODO: giant hacky type assertion here because type guarding this seems complicated.
      // TODO: maybe there's some automated tooling we could use for this?
      const events: ViewEvent[] = parsed as ViewEvent[];
      for (const observer of this.observers)
        observer.OnSyncEvents(events);
    } catch (e) {
      console.error(e);
    }
  }

  OnBroadcastMessage(e: EventResponses['BroadcastMessage']): void {
    if (e.source !== broadcastSource)
      return;
    const msg = e.msg;
    if (!msg || typeof msg !== 'object')
      return;

    // Turn an unknown into an indexable object.
    // TODO: is there some better way to do this?
    const obj: { [key: string]: unknown } = {};
    for (const [key, value] of Object.entries(msg ?? {}))
      obj[key] = value;

    // Ignore messages from ourselves.
    // TODO: do we actually receive broadcast messages from ourselves, if subscribed?
    if (obj.id === this.creationTime || obj.id === undefined)
      return;

    if (obj.type === msgSyncRequestType) {
      // If this collector was created after this timestamp request, ignore it.
      if (typeof obj.timestamp !== 'number' || obj.timestamp < this.creationTime) {
        this.DebugPrint(
          `OnBroadcastMessage: ignoring: (past creation): ${obj.timestamp as string}`,
        );
        return;
      }
      this.SendSyncResponse();
    } else if (obj.type === msgSyncResponseType) {
      if (typeof obj.timestamp !== 'number')
        return;
      // If we have data from further in the past, don't overwrite with partial future data.
      if (this.latestSyncTimestamp && this.latestSyncTimestamp <= obj.timestamp) {
        this.DebugPrint(`OnBroadcastMessage: ignoring (past data): ${obj.timestamp}`);
        return;
      }
      const data = obj.data;
      if (typeof data === 'string')
        this.ReceiveSyncResponse(obj.timestamp, data);
    }
  }

  OnEvent(event: ViewEvent): void {
    this.events.push(event);
  }

  OnSyncEvents(events: ViewEvent[]): void {
    // Clobber our current set of events with synced events.
    //
    // TODO: there could be some raciness here where if you open up the summary
    // mid-fight, then an event could get dropped that occurred after the sync
    // request but before the sync response was received.  This is not worth
    // solving at the moment though.
    this.events = events;
  }

  AddObserver(observer: MistakeObserver): void {
    this.observers.push(observer);
  }

  OnMistakeObj(timestamp: number, m?: OopsyMistake): void {
    if (!m)
      return;
    for (const observer of this.observers) {
      observer.OnEvent({
        timestamp: timestamp,
        type: 'Mistake',
        mistake: m,
      });
    }
  }

  StartEncounter(timestamp: number): void {
    for (const observer of this.observers) {
      observer.OnEvent({
        timestamp: timestamp,
        type: 'StartEncounter',
      });
    }
  }

  OnChangeZone(timestamp: number, zoneName: string, zoneId: number): void {
    for (const observer of this.observers) {
      observer.OnEvent({
        timestamp: timestamp,
        type: 'ChangeZone',
        zoneName: zoneName,
        zoneId: zoneId,
      });
    }
  }
}
