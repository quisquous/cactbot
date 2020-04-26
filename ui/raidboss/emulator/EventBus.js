// Simple event bus implementation to decouple things

class EventBus {
  constructor() {
    this.listeners = {};
  }
  on(event, callback = undefined, scope = undefined) {
    let events = event.split(' ');
    let ret = {};
    for (let event of events) {
      this.listeners[event] = this.listeners[event] || [];
      if (callback !== undefined) {
        this.listeners[event].push({ scope: scope !== undefined ? scope : window, callback: callback });
      } else {
        ret[event] = this.listeners[event];
      }
    }
    if (events.length === 1 && ret[event]) {
      return ret[event];
    } else if (callback !== undefined) {
      return ret;
    }
  }
  async dispatch(event) {
    if (this.listeners[event] === undefined) {
      return;
    }
    let args = [];
    for (let i = 1; i < arguments.length; ++i) {
      args.push(arguments[i]);
    }

    for (let i = 0; i < this.listeners[event].length; ++i) {
      let l = this.listeners[event][i];
      let res = l.callback.apply(l.scope, args);
      if (Promise.resolve(res) === res) {
        await res;
      }
    }
  }
};
