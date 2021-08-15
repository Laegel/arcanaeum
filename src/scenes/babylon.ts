import * as BABYLON from "@babylonjs/core";
import { Scene, Vector2, Vector3, Mesh, LinesMesh } from "@babylonjs/core";
import "@babylonjs/inspector";
import { GridMaterial } from "@babylonjs/materials";
import emitter, { Event as UiToSceneEvent } from "../uiToScene";
import { match, __ } from "ts-pattern";
import type { Spell } from "../types/spells";
import {
  createMeshesFromEntities,
  getIndexByEntity,
  setPositionToMesh,
} from "./utils/mesh";
import { applyZoom } from "./utils/camera";
import { Entity, Event as EntityEvent } from "../data/entity";
import { unproject } from "./utils/coordinates";

export default async (canvas, entities: Entity[]) => {
  const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });

  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  const log = debounce((...args) => console.log(...args));

  const scene = new Scene(engine);
  // scene.debugLayer.show({
  //   embedMode: true,
  // });

  const grid = new GridMaterial("grid", scene);
  grid.gridOffset = new Vector3(0.5, 0, 0.5);

  const ground = Mesh.CreateGround("ground1", 20, 20, 1, scene);
  ground.material = grid;

  const targetCell = Mesh.CreateGround("hover", 1, 1, 3, scene);
  targetCell.visibility = 0;

  const interactiveMeshes = await createMeshesFromEntities(entities, scene);

  let currentlyPlayingMesh: Mesh;

  emitter.on(UiToSceneEvent.BattleStartTurn, (entity: Entity) => {
    if (scope) {
      scope.dispose();
    }
    
    currentlyPlayingMesh = interactiveMeshes.find(
      (interactiveMesh) => interactiveMesh.metadata.entity === entity,
    );
  });

  const camera = new BABYLON.TargetCamera(
    "camera1",
    new Vector3(5, 5, -5),
    scene,
  );
  camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;

  applyZoom(camera, 5);

  camera.setTarget(ground.position);

  camera.attachControl(canvas, false);

  const light = new BABYLON.HemisphericLight(
    "light1",
    new Vector3(0, 1, 0),
    scene,
  );

  const getProjectedPosition = () => {
    const pickedPoint = getUnprojectedPosition();
    return {
      x: Math.floor(pickedPoint.x + 0.5),
      y: Math.floor(pickedPoint.z + 0.5),
    };
  };

  const getUnprojectedPosition = () => {
    return scene.pick(scene.pointerX, scene.pointerY).pickedPoint;
  };

  let activeMesh: Mesh;
  let scope: LinesMesh;

  const onPointerMove = () => {
    const projected = getProjectedPosition();

    const { pickedMesh } = scene.pick(scene.pointerX, scene.pointerY);

    targetCell.visibility = 1;

    log(projected);

    const position = unproject(projected);

    if (
      targetCell.position.x !== position.x ||
      targetCell.position.z !== position.z
    ) {
      if (activeMesh) {
        activeMesh.material.alpha = 1;
      }
      activeMesh = interactiveMeshes.find((interactiveMesh) => {
        return (
          interactiveMesh.position.x === projected.x &&
          interactiveMesh.position.z === projected.y
        );
      });
      setPositionToMesh(targetCell, position);

      if (activeMesh) {
        activeMesh.material.alpha = 0.5;
        emitter.emit(UiToSceneEvent.BattleEntityMouseIn, activeMesh.metadata.entity);
      } else {
        emitter.emit(UiToSceneEvent.BattleEntityMouseOut);
      }
    }
  };

  const inputCallback = (pointerInfo) => {
    match(pointerInfo.type)
      .with(BABYLON.PointerEventTypes.POINTERMOVE, onPointerMove)
      .with(BABYLON.PointerEventTypes.POINTERUP, () => {
        emitter.emit(UiToSceneEvent.BattleEntityTarget, activeMesh.metadata.entity);
        activeMesh.material.alpha = 1;
        activeMesh = undefined;
        targetCell.visibility = 0;
      })
      .otherwise(() => {});
  };

  const getPointsToPoint = (start: Vector2, stop: Vector2, prop: "x" | "y") => {
    const points: Vector3[] = [new Vector3(start.x, 0, start.y)];
    const steps = {
      x: start.x - stop.x > 0 ? -1 : 1,
      y: start.y - stop.y > 0 ? -1 : 1,
    };

    const jointer = {
      ...start,
    };
    while (jointer.x !== stop.x && jointer.y !== stop.y) {
      jointer[prop] += steps[prop];
      points.push(new Vector3(jointer.x, 0, jointer.y));
      prop = prop === "x" ? "y" : "x";
    }

    return points;
  };

  const drawSquare = (position: Vector3, scope: number) => {
    const myPoints = [
      new Vector3(position.x + scope + 0.5, 0, position.z + scope + 0.5),
      new Vector3(position.x + scope + 0.5, 0, position.z - scope - 0.5),
      new Vector3(position.x - scope - 0.5, 0, position.z - scope - 0.5),
      new Vector3(position.x - scope - 0.5, 0, position.z + scope + 0.5),
    ];

    myPoints.push(myPoints[0]);

    const lines = Mesh.CreateLines("lines", myPoints);
    lines.enableEdgesRendering();
    lines.edgesWidth = 10;
    lines.edgesColor = new BABYLON.Color4(1, 0, 0, 1);
  };

  const drawScope = (position: Vector3, scope: number) => {
    const points1 = getPointsToPoint(
      new Vector2(position.x + scope + 0.5, position.z - 0.5),
      new Vector2(position.x + 0.5, position.z + scope + 0.5),
      "y",
    );
    const points2 = getPointsToPoint(
      new Vector2(position.x + 0.5, position.z + scope + 0.5),
      new Vector2(position.x - scope - 0.5, position.z + 0.5),
      "x",
    );
    const points3 = getPointsToPoint(
      new Vector2(position.x - scope - 0.5, position.z + 0.5),
      new Vector2(position.x - 0.5, position.z - scope - 0.5),
      "y",
    );
    const points4 = getPointsToPoint(
      new Vector2(position.x - 0.5, position.z - scope - 0.5),
      new Vector2(position.x + scope + 0.5, position.z - 0.5),
      "x",
    );

    const points = [...points1, ...points2, ...points3, ...points4];

    const shape = Mesh.CreateLines("shape", points);
    shape.enableEdgesRendering();
    shape.edgesWidth = 10;
    shape.edgesColor = new BABYLON.Color4(0, 0, 1, 1);
    return shape;
  };

  const handleSpellClick = (spell?: Spell) => {
    if (spell) {
      scope = drawScope(currentlyPlayingMesh.position, spell.scope);
      scene.onPointerObservable.add(inputCallback);
    } else {
      scene.onPointerObservable.removeCallback(inputCallback);
    }
  };

  emitter.on(UiToSceneEvent.BattleSpellClick, handleSpellClick);

  entities.forEach(entity => {
    entity.on(EntityEvent.Death, ((entity) => () => {
      const meshIndex = getIndexByEntity(interactiveMeshes, entity);
      const [removed] = interactiveMeshes.splice(meshIndex, 1);

      removed.dispose();
    })(entity));
  })

  engine.runRenderLoop(function () {
    if (scene && scene.activeCamera) {
      scene.render();
    }
  });

  window.onresize = function () {
    engine.resize();
  };

  return scene;
};
