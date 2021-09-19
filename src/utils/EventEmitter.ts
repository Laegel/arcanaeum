import { log } from "./debug";

type Listener = (...args: any[]) => void;

// Inspired by: https://betterprogramming.pub/how-to-create-your-own-event-emitter-in-javascript-fbd5db2447c4
export default class EventEmitter<T extends string | number> {
  protected events: { [key in T]?: Listener[] } = {};
  protected autoremove: string[] = [];

  @log()
  public on(name: T, listener: Listener) {
    if (!this.events[name]) {
      this.events[name] = [];
    }
    this.events[name].push(listener);
  }

  public once(name: T, listener: Listener) {
    const serializedEvent = this.serializeEvent(name, listener);
    if (!this.autoremove.includes(serializedEvent)) {
      this.on(name, listener);
      this.autoremove.push(this.serializeEvent(name, listener));
    }
  }

  public off(name: T, listenerToRemove: Listener) {
    if (!this.events[name]) {
      throw new Error(
        `Can't remove a listener. Event "${this.constructor.name}:${name}" doesn't exist.`,
      );
    }

    const filterListeners = (listener) => listener !== listenerToRemove;

    this.events[name] = this.events[name].filter(filterListeners);
  }

  public clear(name?: T) {
    if (name) {
      delete this.events[name];
    } else {
      this.events = {};
    }
  }

  public emit(name: T, data?: any) {
    if (!this.events[name]) {
      console.warn(
        `Can't emit an event. Event "${this.constructor.name}:${name}" doesn't exist.`,
      );
      return;
    }
    console.log(`Emitting ${this.constructor.name}:${name}`);

    this.events[name].forEach((callback) => {
      callback(data);
      if (this.autoremove.includes(this.serializeEvent(name, callback))) {
        this.off(name, callback);
      }
    });
    
  }

  private serializeEvent(name: T, listener: Listener) {
    return btoa(name + JSON.stringify(listener.toString()));
  }
}
