// Inspired by: https://betterprogramming.pub/how-to-create-your-own-event-emitter-in-javascript-fbd5db2447c4
type Listener = (...args: any[]) => void;

export default class EventEmitter<T extends string | number> {
  protected events: { [key in T]?: Listener[] } = {};

  public on(name: T, listener: Listener) {
    if (!this.events[name]) {
      this.events[name] = [];
    }

    this.events[name].push(listener);
  }

  public off(name: T, listenerToRemove: Listener) {
    if (!this.events[name]) {
      throw new Error(
        `Can't remove a listener. Event "${name}" doesn't exits.`,
      );
    }

    const filterListeners = (listener) => listener !== listenerToRemove;

    this.events[name] = this.events[name].filter(filterListeners);
  }

  public clear(name: T) {
    delete this.events[name];
  }

  public emit(name: T, data?: any) {
    if (!this.events[name]) {
      console.warn(
        `Can't emit an event. Event "${name}" doesn't exits.`,
      );
      return;
    }

    const fireCallbacks = (callback) => {
      callback(data);
    };

    this.events[name].forEach(fireCallbacks);
  }
}
