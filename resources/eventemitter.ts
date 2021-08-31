export class CactbotEvent<T> extends Event {
  readonly detail?: T;
  constructor(type: string, eventInitDict: EventInit & { detail?: T }) {
    super(type, eventInitDict);
    this.detail = eventInitDict.detail;
  }
}

/**
 * A class acting like `EventEmitter` in Node.js.
 */
export class EventEmitter extends EventTarget {
  // For getting current types when inherit this class
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(type: string, listener: (...args: any[]) => void): EventEmitter {
    super.addEventListener(type, listener);
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  once(type: string, listener: (...args: any[]) => void): EventEmitter {
    super.addEventListener(type, listener, { once: true });
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off(type: string, listener: (...args: any[]) => void): EventEmitter {
    super.removeEventListener(type, listener);
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(type: string, ...args: any[]): boolean {
    return super.dispatchEvent(
      new CactbotEvent(type, {
        bubbles: false,
        cancelable: true,
        detail: args,
      }),
    );
  }
}
