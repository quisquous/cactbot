'use strict';

/**
 * This is a base class that classes can extend to inherit event bus capabilities.
 * This allows other classes to listen for events with the `on` function.
 * The inheriting class can fire those events with the `dispatch` function.
 */
class EventBus {
  constructor() {
    this.listeners = {};
  }
  /**
   * Subscribe to an event
   *
   * @param {string} event The event(s) to subscribe to, space separated
   * @param {function} callback The callback to invoke
   * @param {object} scope Optional. The scope to apply the function against
   *
   * @return {any} The callbacks registered to the event(s)
   */
  on(event, callback = undefined, scope = undefined) {
    let events = event.split(' ');
    let ret = {};
    scope = scope !== undefined ? scope : window;
    for (let event of events) {
      this.listeners[event] = this.listeners[event] || [];
      if (callback !== undefined)
        this.listeners[event].push({ scope: scope, callback: callback });
      else
        ret[event] = this.listeners[event];
    }
    if (events.length === 1 && ret[event])
      return ret[event];
    else if (callback !== undefined)
      return ret;
  }
  /**
   * Dispatch an event to any subscribers
   * @param {string} event The event to dispatch
   * @param {...*} eventArguments The event arguments to pass to listeners
   */
  async dispatch(event, ...eventArguments) {
    if (this.listeners[event] === undefined)
      return;

    for (let i = 0; i < this.listeners[event].length; ++i) {
      let l = this.listeners[event][i];
      let res = l.callback.apply(l.scope, eventArguments);
      if (Promise.resolve(res) === res)
        await res;
    }
  }
}
