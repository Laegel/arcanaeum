import * as BABYLON from "@babylonjs/core";
import {
  Scene,
  Vector2,
  Vector3,
  Mesh,
  LinesMesh,
  Animation,
  Curve3,
} from "@babylonjs/core";
import "@babylonjs/inspector";
import { GridMaterial } from "@babylonjs/materials";
import emitter, { UiToSceneEvent } from "../uiToScene";
import { instanceOf, match, __ } from "ts-pattern";
import type { Spell } from "../types/spells";
import {
  createMeshesFromEntities,
  getByEntity,
  getIndexByEntity,
  setPositionToMesh,
} from "./utils/mesh";
import { applyZoom } from "./utils/camera";
import {
  Ally,
  Enemy,
  Entity,
  Event as EntityEvent,
  Player,
} from "../data/entity";
import { unproject, project } from "./utils/coordinates";

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
      resetSelectedSpell();
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
        emitter.emit(
          UiToSceneEvent.BattleEntityMouseIn,
          activeMesh.metadata.entity,
        );
      } else {
        emitter.emit(UiToSceneEvent.BattleEntityMouseOut);
      }
    }
  };

  const animateMeshToCell = (mesh: Mesh, destination: Vector3) => {

    const position = mesh.position;
    const path: Vector3[] = [];
    const targetX = Math.abs(position.x - destination.x);
    const targetZ = Math.abs(position.z - destination.z);
    const stepX = position.x > destination.x ? -1 : 1;
    const stepZ = position.z > destination.z ? -1 : 1;
    let differenceX = 0;
    while (differenceX < targetX) {
      ++differenceX;
      path.push(new Vector3(position.x + differenceX * stepX, 0, position.z));
    }
    let differenceZ = 0;
    while (differenceZ < targetZ) {
      ++differenceZ;
      path.push(new Vector3(position.x + differenceX * stepX, 0, position.z + differenceZ * stepZ));
    }

    const speed = 10;
    const animationPosition = new BABYLON.Animation(
      "animPos",
      "position",
      speed,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    );
    const animationRotation = new BABYLON.Animation(
      "animRot",
      "rotation",
      speed,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    );
    const keysPosition = [];
    const keysRotation = [];

    let lastPosition = position.clone();
    for (let p = 0; p < path.length; p++) {
      keysPosition.push({
        frame: p,
        value: path[p],
      });

      const valueX = lastPosition.x - path[p].x;
      const valueZ = lastPosition.z - path[p].z;
      
      let rotation = Math.PI;
      if (valueX > 0) {
        rotation = Math.PI / 2;
      } else if (valueX < 0) {
        rotation = -Math.PI / 2;
      } else if (valueZ > 0) {
        rotation = 0;
      } 
      keysRotation.push({
        frame: p,
        value: new Vector3(0, rotation, 0),
      });
      lastPosition = path[p];
    }

    animationPosition.setKeys(keysPosition);
    animationRotation.setKeys(keysRotation);

    mesh.animations = [animationPosition, animationRotation];

    scene.beginAnimation(mesh, 0, 300, false);
  };

  const isPositionFree = (position: Vector3) =>
    !interactiveMeshes.find(
      (interactiveMesh) =>
        interactiveMesh.position.x === position.x &&
        interactiveMesh.position.z === position.z,
    );

  const prepareEntityMovement = (pointerInfo) => {
    match(pointerInfo.type)
      .with(BABYLON.PointerEventTypes.POINTERMOVE, () => {})
      .with(BABYLON.PointerEventTypes.POINTERUP, () => {
        const projected = getProjectedPosition();
        const position = unproject(projected);
        currentlyPlayingMesh.metadata.entity.emit(
          EntityEvent.Move,
          currentlyPlayingMesh.metadata.entity,
        );
        const currentPosition = currentlyPlayingMesh.position;
        const currentProjectedPosition = project(currentPosition);
        const cellsAmount =
          Math.abs(currentPosition.x - position.x) +
          Math.abs(currentPosition.z - position.z);

        if (isPositionFree(position)) {
          animateMeshToCell(currentlyPlayingMesh, position);

          currentlyPlayingMesh.metadata.entity.emit(
            EntityEvent.Move,
            currentlyPlayingMesh.metadata.entity,
          );
        }
      })
      .otherwise(() => {});
  };
  scene.onPointerObservable.add(prepareEntityMovement);

  const prepareSpellCasting = (pointerInfo) => {
    scene.onPointerObservable.removeCallback(prepareEntityMovement);
    match(pointerInfo.type)
      .with(BABYLON.PointerEventTypes.POINTERMOVE, onPointerMove)
      .with(BABYLON.PointerEventTypes.POINTERUP, () => {
        emitter.emit(
          UiToSceneEvent.BattleEntityTarget,
          activeMesh.metadata.entity,
        );
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

  const resetSelectedSpell = () => {
    scope.dispose();
    scene.onPointerObservable.removeCallback(prepareSpellCasting);
    setTimeout(() => {
      scene.onPointerObservable.add(prepareEntityMovement);
    }, 100);
  };

  const handleClickSpell = (spell?: Spell) => {
    if (spell) {
      scope = drawScope(currentlyPlayingMesh.position, spell.scope);
      scene.onPointerObservable.add(prepareSpellCasting);
    } else if (scope) {
      resetSelectedSpell();
    }
  };

  emitter.on(UiToSceneEvent.BattleSpellClick, handleClickSpell);

  entities.forEach((entity) => {
    entity.on(EntityEvent.Death, (entity) => {
      const meshIndex = getIndexByEntity(interactiveMeshes, entity);
      const [removed] = interactiveMeshes.splice(meshIndex, 1);
      const currentEntities = interactiveMeshes.map(
        (mesh) => mesh.metadata.entity,
      );

      const enemiesRemain = !!currentEntities.find(
        (entity) => entity instanceof Enemy && entity.getCurrentHealth() !== 0,
      );
      const alliesRemain = !!currentEntities.find(
        (entity) =>
          (entity instanceof Player && entity.getCurrentHealth() !== 0) ||
          (entity instanceof Ally && entity.getCurrentHealth() !== 0),
      );

      if (!enemiesRemain || !alliesRemain) {
        scene.animationsEnabled = false;
      }
      removed.dispose();
    });

    entity.on(
      EntityEvent.AttractionMovement,
      ({
        caster,
        target,
        cells,
      }: {
        caster: Entity;
        target: Entity;
        cells: number;
      }) => {
        const casterMesh = getByEntity(interactiveMeshes, caster);
        const targetMesh = getByEntity(interactiveMeshes, target);

        if (casterMesh.position.x === targetMesh.position.x) {
          targetMesh.position.z += cells * (casterMesh.position.z > targetMesh.position.z ? 1 : -1);
        } else if (casterMesh.position.z === targetMesh.position.z) {
          targetMesh.position.x += cells * (casterMesh.position.x > targetMesh.position.x ? 1 : -1);
        }
      },
    );
  });

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
