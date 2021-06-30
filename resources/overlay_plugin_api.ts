// OverlayPlugin API setup

import { EventMap, EventType, IOverlayHandler } from '../types/event';

declare global {
  interface Window {
    __OverlayCallback: EventMap[EventType];
    dispatchOverlayEvent?: typeof processEvent;
    OverlayPluginApi: {
      ready: boolean;
      callHandler: (msg: string, cb?: (value: string) => unknown) => void;
    };
    /**
     * @deprecated This is for backward compatibility.
     *
     * It is recommended to import from this file:
     *
     * `import { addOverlayListener } from '/path/to/overlay_plugin_api';`
     */
    addOverlayListener: IAddOverlayListener;
    /**
     * @deprecated This is for backward compatibility.
     *
     * It is recommended to import from this file:
     *
     * `import { removeOverlayListener } from '/path/to/overlay_plugin_api';`
     */
    removeOverlayListener: IRemoveOverlayListener;
    /**
     * @deprecated This is for backward compatibility.
     *
     * It is recommended to import from this file:
     *
     * `import { callOverlayHandler } from '/path/to/overlay_plugin_api';`
     */
    callOverlayHandler: IOverlayHandler;
  }
}


type IAddOverlayListener = <T extends EventType>(event: T, cb: EventMap[T]) => void;
type IRemoveOverlayListener = <T extends EventType>(event: T, cb: EventMap[T]) => void;

type Subscriber<T> = {
  [key in EventType]?: T[];
};
type EventParameter = Parameters<EventMap[EventType]>[0];
type VoidFunc<T> = (...args: T[]) => void;

let inited = false;

let wsUrl: RegExpExecArray | null = null;
let ws: WebSocket | null = null;
let queue: (
  { [s: string]: unknown } |
  [{ [s: string]: unknown }, ((value: string | null) => unknown) | undefined]
)[] | null = [];
let rseqCounter = 0;
const responsePromises: Record<number, (value: unknown) => void> = {};

const subscribers: Subscriber<VoidFunc<unknown>> = {};

const sendMessage = (
    msg: { [s: string]: unknown },
    cb?: (value: string | null) => unknown,
): void => {
  if (ws) {
    if (queue)
      queue.push(msg);
    else
      ws.send(JSON.stringify(msg));
  } else {
    if (queue)
      queue.push([msg, cb]);
    else
      window.OverlayPluginApi.callHandler(JSON.stringify(msg), cb);
  }
};

const processEvent = <T extends EventType>(msg: Parameters<EventMap[T]>[0]): void => {
  init();

  const subs = subscribers[msg.type];
  subs?.forEach((sub) => sub(msg));
};

export const dispatchOverlayEvent = processEvent;

export const addOverlayListener: IAddOverlayListener = (event, cb): void => {
  init();

  if (!subscribers[event]) {
    subscribers[event] = [];

    if (!queue) {
      sendMessage({
        call: 'subscribe',
        events: [event],
      });
    }
  }

  subscribers[event]?.push(cb as VoidFunc<unknown>);
};

export const removeOverlayListener: IRemoveOverlayListener = (event, cb): void => {
  init();

  if (subscribers[event]) {
    const list = subscribers[event];
    const pos = list?.indexOf(cb as VoidFunc<unknown>);

    if (pos && pos > -1)
      list?.splice(pos, 1);
  }
};

const callOverlayHandlerInternal: IOverlayHandler = (
    _msg: { [s: string]: unknown },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  init();

  const msg = {
    ..._msg,
    rseq: 0,
  };
  let p: Promise<unknown>;

  if (ws) {
    msg.rseq = rseqCounter++;
    p = new Promise((resolve) => {
      responsePromises[msg.rseq] = resolve;
    });

    sendMessage(msg);
  } else {
    p = new Promise((resolve) => {
      sendMessage(msg, (data) => {
        resolve(data === null ? null : JSON.parse(data));
      });
    });
  }

  return p;
};

let callOverlayHandlerOverride: IOverlayHandler | undefined;

export const callOverlayHandler: IOverlayHandler = (
    _msg: { [s: string]: unknown },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  init();
  if (callOverlayHandlerOverride) {
    return callOverlayHandlerOverride(
        _msg as Parameters<IOverlayHandler>[0],
    ) as Promise<unknown>;
  }
  return callOverlayHandlerInternal(_msg as Parameters<IOverlayHandler>[0]);
};

export const setCallOverlayHandlerOverride = (override?: IOverlayHandler): IOverlayHandler => {
  callOverlayHandlerOverride = override;
  return callOverlayHandlerInternal;
};

export const init = (): void => {
  if (inited)
    return;

  if (typeof window !== 'undefined') {
    wsUrl = /[\?&]OVERLAY_WS=([^&]+)/.exec(window.location.href);
    if (wsUrl) {
      const connectWs = function() {
        ws = new WebSocket(wsUrl?.[1] as string);

        ws.addEventListener('error', (e) => {
          console.error(e);
        });

        ws.addEventListener('open', () => {
          console.log('Connected!');

          const q = queue ?? [];
          queue = null;

          sendMessage({
            call: 'subscribe',
            events: Object.keys(subscribers),
          });

          for (const msg of q) {
            if (!Array.isArray(msg))
              sendMessage(msg);
          }
        });

        ws.addEventListener('message', (_msg) => {
          try {
            if (typeof _msg.data !== 'string') {
              console.error('Invalid message data received: ', _msg);
              return;
            }
            const msg = JSON.parse(_msg.data) as EventParameter & { rseq?: number };

            if (msg.rseq !== undefined && responsePromises[msg.rseq]) {
              responsePromises[msg.rseq]?.(msg);
              delete responsePromises[msg.rseq];
            } else {
              processEvent(msg);
            }
          } catch (e) {
            console.error('Invalid message received: ', _msg);
            return;
          }
        });

        ws.addEventListener('close', () => {
          queue = null;

          console.log('Trying to reconnect...');
          // Don't spam the server with retries.
          setTimeout(() => {
            connectWs();
          }, 300);
        });
      };

      connectWs();
    } else {
      const waitForApi = function() {
        if (!window.OverlayPluginApi || !window.OverlayPluginApi.ready) {
          setTimeout(waitForApi, 300);
          return;
        }

        const q = queue ?? [];
        queue = null;

        window.__OverlayCallback = processEvent;

        sendMessage({
          call: 'subscribe',
          events: Object.keys(subscribers),
        });

        for (const item of q) {
          if (Array.isArray(item))
            sendMessage(item[0], item[1]);
        }
      };

      waitForApi();
    }

    // Here the OverlayPlugin API is registered to the window object,
    // but this is mainly for backwards compatibility.For cactbot's built-in files,
    // it is recommended to use the various functions exported in resources/overlay_plugin_api.ts.
    window.addOverlayListener = addOverlayListener;
    window.removeOverlayListener = removeOverlayListener;
    window.callOverlayHandler = callOverlayHandler;
    window.dispatchOverlayEvent = dispatchOverlayEvent;
  }

  inited = true;
};
