import EventEmitter from "../utils/EventEmitter";

export enum Event {
  BattleZoom,
  BattleSpellClick,
  BattleEntityMouseIn,
  BattleEntityMouseOut,
  BattleEntityTarget,
  BattleStartTurn,
}

class UIToScene extends EventEmitter<Event> { }

const emitter = new UIToScene();

export default emitter;
