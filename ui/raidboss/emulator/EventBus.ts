// EventBus by definition requires generic parameters.
// Map our stand-in generics to actual generics here.
// eslint-disable-next-line @typescript-eslint/ban-types
type Scope = object;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Param = any;

type CallbackFunction = (...args: Param) => void;
type EventMapEntry = {
  event: string;
  scope: Scope;
  callback: CallbackFunction;
};
type EventMap = {[event: string]: EventMapEntry[]};

/**
 * This is a base class that classes can extend to inherit event bus capabilities.
 * This allows other classes to listen for events with the `on` function.
 * The inheriting class can fire those events with the `dispatch` function.
 */
export default class EventBus {
  private listeners: EventMap = {};
  /**
   * Subscribe to an event
   *
   * @param event The event(s) to subscribe to, space separated
   * @param callback The callback to invoke
   * @param scope Optional. The scope to apply the function against
   * @returns The callbacks registered to the event(s)
   */
  on(event: string, callback?: CallbackFunction, scope?: Scope): EventMapEntry[] {
    const events = event.split(' ');
    const ret: EventMapEntry[] = [];
    scope = scope ?? (typeof window === 'undefined' ? {} : window);
    for (const event of events) {
      const events: EventMapEntry[] = this.listeners[event] ??= [];
      if (callback !== undefined)
        events.push({ event: event, scope: scope, callback: callback });
      ret.push(...(this.listeners[event] ?? []));
    }
    return ret;
  }

  /**
   * Dispatch an event to any subscribers
   *
   * @param event The event to dispatch
   * @param eventArguments The event arguments to pass to listeners
   * @returns A promise that can be await'd or ignored
   */
  async dispatch(event: string, ...eventArguments: Param): Promise<void> {
    if (this.listeners[event] === undefined)
      return;

    for (const l of this.listeners[event] ?? []) {
      const res = l.callback.apply(l.scope, eventArguments);
      await Promise.resolve(res);
    }
  }
}
