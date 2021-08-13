// Inspired by: https://betterprogramming.pub/how-to-create-your-own-event-emitter-in-javascript-fbd5db2447c4
type Listener = (...args: any[]) => void;

export enum Event {
  BattleZoom,
  BattleSpellClick,
  BattleEntityMouseIn,
  BattleEntityMouseOut,
  BattleEntityTarget,
  BattleStartTurn,
  BattleEntityDeath,
}

class EventEmitter {
  private events: { [key in Event]?: Listener[] } = {};

  public on(name: Event, listener: Listener) {
    if (!this.events[name]) {
      this.events[name] = [];
    }

    this.events[name].push(listener);
  }

  public off(name: Event, listenerToRemove: Listener) {
    if (!this.events[name]) {
      throw new Error(
        `Can't remove a listener. Event "${name}" doesn't exits.`,
      );
    }

    const filterListeners = (listener) => listener !== listenerToRemove;

    this.events[name] = this.events[name].filter(filterListeners);
  }

  public clear(name: Event) {
    delete this.events[name];
  }

  public emit(name: Event, data?: any) {
    if (!this.events[name]) {
      console.warn(`Can't emit an event. Event "${Event[name]}" doesn't exits.`);
      return;
    }

    const fireCallbacks = (callback) => {
      callback(data);
    };

    this.events[name].forEach(fireCallbacks);
  }
}

const emitter = new EventEmitter();

export default emitter;
