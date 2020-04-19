// Simple event bus implementation to decouple things

class EventBus {
  constructor() {
    this.listeners = {};
  }
  on(event, callback = undefined, scope = undefined) {
    this.listeners[event] = this.listeners[event] || [];
    if (callback !== undefined) {
      this.listeners[event].push({ scope: scope !== undefined ? scope : window, callback: callback });
    } else {
      return this.listeners[event];
    }
  }
  dispatch(event) {
    if (this.listeners[event] === undefined) {
      return;
    }
    let args = [];
    for (let i = 1; i < arguments.length; ++i) {
      args.push(arguments[i]);
    }

    for (let i = 0; i < this.listeners[event].length; ++i) {
      let l = this.listeners[event][i];
      l.callback.apply(l.scope, args);
    }
  }
};
