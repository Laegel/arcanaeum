import EventEmitter from "../utils/EventEmitter";

export enum UiToSceneEvent {
  BattleZoom,
  BattleSpellClick,
  BattleEntityMouseIn,
  BattleEntityMouseOut,
  BattleEntityTarget,
  BattleStartTurn,
}

class UIToScene extends EventEmitter<UiToSceneEvent> { }

const emitter = new UIToScene();

export default emitter;
