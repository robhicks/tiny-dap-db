// src/utils/EventEmitter.ts
var EventEmitter = class {
  constructor() {
    this.events = new Map();
  }
  clear() {
    this.events.clear();
  }
  emit(event, ...args) {
    if (this.events.has(event)) {
      this.events.get(event).forEach((listener) => {
        listener(...args);
      });
    }
  }
  eventSize(event) {
    return this.events.get(event).size;
  }
  off(event, listener) {
    argValidator(event, listener);
    if (this.events.has(event) && this.events.get(event).has(listener)) {
      this.events.get(event).delete(listener);
      if (this.events.get(event).size === 0)
        this.events.delete(event);
    }
  }
  on(event, listener) {
    argValidator(event, listener);
    if (!this.events.has(event)) {
      const s = new Set();
      s.add(listener);
      this.events.set(event, s);
    } else {
      const s = this.events.get(event);
      s.add(listener);
    }
  }
  once(event, listener) {
    argValidator(event, listener);
    const self = this;
    this.on(event, function f() {
      self.off(event, f);
      listener.apply(this, arguments);
    });
  }
  get size() {
    return this.events.size;
  }
};
export {
  EventEmitter
};
