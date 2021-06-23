import { AnyEventResponse, AnyHandlerRequest, AnyHandlerResponse, AnyResponse, EventCallback, EventType, HandlerFunc, HandlerRequest, HandlerResponse, HandlerType } from '../types/event';

class API {
  private ws?: WebSocket;
  private wsUrl?: string;
  private inited = false;
  private queue?: (
    { [s: string]: unknown } |
    [{ [s: string]: unknown }, ((value: string | null) => unknown) | undefined]
  )[] | undefined = [];

  private overrides: { [type in HandlerType]?: HandlerFunc[type] } = {};
  private rseqCounter = 0;
  // Maps rseq to the event type that called it
  private rseqMap: { [rseq: number]: HandlerType } = {};
  private rseqResolverMap: {
    [type in HandlerType]: {
      [rseq: number]: (value: HandlerResponse[type] | PromiseLike<HandlerResponse[type]>) => void;
    };
  } = {
    subscribe: {},
    getCombatants: {},
    cactbotReloadOverlays: {},
    cactbotLoadUser: {},
    cactbotRequestPlayerUpdate: {},
    cactbotRequestState: {},
    cactbotSay: {},
    cactbotSaveData: {},
    cactbotLoadData: {},
    cactbotChooseDirectory: {},
  };

  private callbacks: {
    [type in EventType]: Set<EventCallback[type]>;
  } = {
    CombatData: new Set(),
    LogLine: new Set(),
    ChangeZone: new Set(),
    ChangePrimaryPlayer: new Set(),
    FileChanged: new Set(),
    OnlineStatusChanged: new Set(),
    PartyChanged: new Set(),
    EnmityTargetData: new Set(),
    onForceReload: new Set(),
    onGameExistsEvent: new Set(),
    onGameActiveChangedEvent: new Set(),
    onLogEvent: new Set(),
    onImportLogEvent: new Set(),
    onInCombatChangedEvent: new Set(),
    onZoneChangedEvent: new Set(),
    BroadcastMessage: new Set(),
    onFateEvent: new Set(),
    onCEEvent: new Set(),
    onPlayerDied: new Set(),
    onPartyWipe: new Set(),
    onPlayerChangedEvent: new Set(),
    onUserFileChanged: new Set(),
  };

  constructor() {
    if (typeof window !== 'undefined') {
      const wsUrlExec = /[\?&]OVERLAY_WS=(?<ws>[^&]+)/.exec(window.location.href);
      const wsUrl = wsUrlExec?.groups?.ws;
      if (wsUrl)
        this.wsUrl = wsUrl;
    }
  }

  init(): void {
    if (this.inited)
      return;

    if (typeof window !== 'undefined') {
      const wsUrl = this.wsUrl;
      if (wsUrl) {
        const connectWs = () => {
          this.ws = new WebSocket(wsUrl);

          this.ws.addEventListener('error', (e) => {
            console.error(e);
          });

          this.ws.addEventListener('open', () => {
            console.log('Connected!');

            const q = this.queue ?? [];
            this.queue = undefined;

            this.sendMessage({
              call: 'subscribe',
              events: this.activeListeners,
            });

            for (const msg of q) {
              if (!Array.isArray(msg))
                this.sendMessage(msg);
            }
          });

          this.ws.addEventListener('message', (msgJson) => {
            let msg: AnyResponse | undefined = undefined;
            try {
              msg = Object.assign<AnyResponse, unknown>({
                type: 'getCombatants',
              }, JSON.parse(msgJson.data));

              if (this.isEvent(msg))
                this.dispatchEvent(msg);
              else if (this.isHandler(msg))
                this.dispatchHandler(msg);
            } catch (e) {
              console.error('Invalid message received: ', msg);
              return;
            }
          });

          this.ws.addEventListener('close', () => {
            this.queue = undefined;

            console.log('Trying to reconnect...');
            // Don't spam the server with retries.
            setTimeout(() => {
              connectWs();
            }, 300);
          });
        };

        connectWs();
      } else {
        const waitForApi = () => {
          if (!window.OverlayPluginApi || !window.OverlayPluginApi.ready) {
            setTimeout(waitForApi, 300);
            return;
          }

          const q = this.queue ?? [];
          this.queue = undefined;

          window.dispatchOverlayEvent = window.__OverlayCallback = this.dispatchEvent.bind(this);

          this.sendMessage({
            call: 'subscribe',
            events: this.activeListeners,
          });

          for (const item of q) {
            if (Array.isArray(item))
              this.sendMessage(item[0], item[1]);
          }
        };

        waitForApi();
      }

      // Here the OverlayPlugin API is registered to the window object,
      // but this is mainly for backwards compatibility.For cactbot's built-in files,
      // it is recommended to use the various functions exported in resources/overlay_api.ts.
      window.addOverlayListener = overlayApi.on.bind(overlayApi);
      window.removeOverlayListener = overlayApi.off.bind(overlayApi);
      window.callOverlayHandler = overlayApi.callDeprecated.bind(overlayApi);
    }

    this.inited = true;
  }

  private sendMessage(
      msg: { [s: string]: unknown },
      cb?: (value: string | null) => unknown,
  ): void {
    if (this.ws) {
      if (this.queue)
        this.queue.push(msg);
      else
        this.ws.send(JSON.stringify(msg));
    } else {
      if (this.queue)
        this.queue.push([msg, cb]);
      else
        window.OverlayPluginApi.callHandler(JSON.stringify(msg), cb);
    }
  }

  public setOverride<T extends HandlerType>(type: T, cb: HandlerFunc[T]): void {
    this.overrides[type] = cb;
  }

  public on<T extends EventType>(event: T, cb: EventCallback[T]): void {
    // `cb` type is correct but tsc can't figure it out, so cast to never
    if (this.callbacks[event].has(cb as never))
      return;

    this.callbacks[event].add(cb as never);

    void this.call('subscribe', {
      events: [event],
    });
  }

  public off<T extends EventType>(event: T, cb: EventCallback[T]): void {
    // `cb` type is correct but tsc can't figure it out, so cast to never
    if (!this.callbacks[event].has(cb as never))
      return;

    this.callbacks[event].delete(cb as never);
  }

  public call<T extends HandlerType>(event: T,
      msg: HandlerRequest[T]): Promise<HandlerResponse[T]> {
    // Override types are enforced by tsc but not identified properly
    const override = this.overrides[event];
    if (override)
      return override(msg as never) as never;

    this.init();
    msg.call ??= event;

    if (this.ws) {
      const rseq = this.rseqCounter++;
      msg.rseq = rseq;
      this.rseqMap[rseq] = event;
      const p = new Promise<HandlerResponse[T]>((resolve) => {
        // `resolve` type is correct but tsc can't figure it out, so cast to never
        this.rseqResolverMap[event][rseq] = resolve as never;
      });

      this.sendMessage(msg);

      return p;
    }

    return new Promise<HandlerResponse[T]>((resolve) => {
      this.sendMessage(msg, (data) => {
        resolve(data === null ? null : JSON.parse(data));
      });
    });
  }

  // Legacy calls from JS only, so ignore typing
  /**
   * @deprecated Use `call` instead
   */
  public callDeprecated(msg: AnyHandlerRequest): Promise<unknown> {
    return this.call(msg.call, msg as never);
  }

  private get activeListeners(): string[] {
    return Object.entries(this.callbacks).filter((entry) => {
      return entry[1].size > 0;
    }).map((entry) => entry[0]);
  }

  private isEvent(obj?: AnyResponse): obj is AnyEventResponse {
    return (obj?.type && obj.type in this.callbacks) ?? false;
  }

  private dispatchEvent(msg: AnyEventResponse): void {
    // Disable no-explicit-any and no-unsafe-call, these types are asserted elsewhere
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.callbacks[msg.type].forEach((cb: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      cb(msg);
    });
  }

  private dispatchHandler(msg: AnyHandlerResponse) {
    const rseq = msg.rseq;
    if (rseq === undefined)
      return;

    const type = this.rseqMap[rseq];
    if (!type)
      return;

    const handler = this.rseqResolverMap[type][rseq];

    if (!handler)
      return;

    // Disable no-explicit-any here. This typing is checked but tsc can't figure it out
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler(msg as any);
  }

  private isHandler(obj?: AnyResponse): obj is AnyHandlerResponse {
    return (obj?.type && obj.type in this.rseqResolverMap) ?? false;
  }
}

export const overlayApi = new API();

// #endregion
