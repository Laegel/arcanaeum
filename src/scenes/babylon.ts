import * as BABYLON from "@babylonjs/core";
import {
  Scene,
  Vector3,
  Mesh,
  LinesMesh,
  Color4,
  GroundMesh,
  Color3,
  AssetsManager,
  BackgroundMaterial,
  SceneLoader,
  StandardMaterial,
  MeshBuilder,
} from "@babylonjs/core";
import "@babylonjs/inspector";
import { GridMaterial } from "@babylonjs/materials";
import emitter, { UiToSceneEvent } from "../uiToScene";
import { match, __ } from "ts-pattern";
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
import { RangeType, TargetType } from "../types/effects";
import basicEffects from "../data/effects";
import {
  drawScope,
  drawZone,
  getPoints,
  getScope,
  getZone,
  TARGETTABLE,
} from "./utils/scope";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";

const inside = (point: Vector3, vs: Vector3[]) => {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

  const x = point.x;
  const y = point.z;

  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i].x;
    const yi = vs[i].z;
    const xj = vs[j].x;
    const yj = vs[j].z;

    const intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
};

export default async (canvas, entities: Entity[], mapLink: string) => {
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
  window["scene"] = scene;

  // scene.debugLayer.show({
  //   embedMode: true,
  // });

  const grid = new GridMaterial("grid", scene);
  grid.gridOffset = new Vector3(0.5, 0, 0.5);

  const assetsManager = new AssetsManager(scene);

  // const ground = Mesh.CreateGround("ground1", 20, 20, 1, scene);
  // ground.material = grid;

  assetsManager.onTaskErrorObservable.add((task) => {
    console.log(
      "task failed",
      task.errorObject.message,
      task.errorObject.exception,
    );
  });

  SceneLoader.ImportMesh(
    "",
    "/meshes/",
    "tree-open.obj",
    scene,
    (treeMeshes) => {
      treeMeshes.forEach((mesh) => {
        mesh.scaling.scaleInPlace(0.3);
        mesh.position = new Vector3(-4, 0.5, 3);
      });
      const matSpines = new StandardMaterial("leaves", scene);
      matSpines.diffuseColor = new Color3(0.7, 0.7, 0.2);
      const matTrunk = new StandardMaterial("trunk", scene);
      matTrunk.diffuseColor = new Color3(0.4, 0.2, 0.2);
      treeMeshes[0].material = matSpines;
      treeMeshes[1].material = matTrunk;
    },
  );

  SceneLoader.ImportMesh(
    "",
    "/meshes/",
    "tree-pyramidal.obj",
    scene,
    (treeMeshes) => {
      treeMeshes.forEach((mesh) => {
        mesh.scaling.scaleInPlace(0.5);
        mesh.position = new Vector3(4, 0, -2);
      });
      const matSpines = new StandardMaterial("leaves", scene);
      matSpines.diffuseColor = new Color3(0.7, 0.7, 0.2);
      const matTrunk = new StandardMaterial("trunk", scene);
      matTrunk.diffuseColor = new Color3(0.4, 0.2, 0.2);
      treeMeshes[0].material = matSpines;
      treeMeshes[1].material = matTrunk;
    },
  );

  const textureTask = assetsManager.addTextureTask(
    "texture",
    `/textures/ground.png`,
  );

  textureTask.onSuccess = async (task) => {
    const backgroundMaterial = new BackgroundMaterial(
      "backgroundMaterial",
      scene,
    );
    backgroundMaterial.diffuseTexture = task.texture;
    // backgroundMaterial.diffuseTexture.uScale = 5.0; //Repeat 5 times on the Vertical Axes
    // backgroundMaterial.diffuseTexture.vScale = 5.0; //Repeat 5 times on the Horizontal Axes
    backgroundMaterial.shadowLevel = 0.4;

    const faceUV = new Array(6);

    // side 0 faces the positive z direction
    // side 1 faces the negative z direction
    // side 2 faces the positive x direction
    // side 3 faces the negative x direction
    // side 4 faces the positive y direction
    // side 5 faces the negative y direction

    faceUV[0] = new BABYLON.Vector4(0, 0.5, 1 / 3, 1);
    faceUV[1] = new BABYLON.Vector4(1 / 3, 0, 2 / 3, 0.5);
    faceUV[2] = new BABYLON.Vector4(2 / 3, 0, 1, 0.5);
    faceUV[3] = new BABYLON.Vector4(0, 0, 1 / 3, 0.5);
    faceUV[4] = new BABYLON.Vector4(1 / 3, 0.5, 2 / 3, 1);
    faceUV[5] = new BABYLON.Vector4(2 / 3, 0.5, 1, 1);

    const options = {
      faceUV,
      width: 1,
      height: 0.5,
      depth: 1,
    };

    const box = MeshBuilder.CreateBox("ground", options, scene);
    box.position = new Vector3(-4, 0.25, 4);
    // box.isVisible = false;
    const mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseTexture = task.texture;
    box.material = mat;

    const data = await fetch(`/maps/${mapLink}.json`);
    (await data.json()).forEach(
      (position) =>
        (box.clone("ground").position = new Vector3(
          position.x,
          position.y,
          position.z,
        )),
    );

    // for (let i = -5; i < 5; ++i) {
    //   for (let j = -5; j < 5; ++j) {
    //     box.clone("ground").position = new Vector3(i, -0.25, j);
    //   }
    // }
    // box.clone("ground").position = new Vector3(-5, 0.25, 2);
    // box.clone("ground").position = new Vector3(-4, 0.25, 3);
    // box.clone("ground").position = new Vector3(-3, 0.25, 4);
    // box.clone("ground").position = new Vector3(-5, 0.75, 3);
    // box.clone("ground").position = new Vector3(-4, 0.75, 4);
    // box.clone("ground").position = new Vector3(-5, 0.75, 4);
    box.isVisible = false;
  };

  assetsManager.load();

  const targetCell = Mesh.CreateGround("hover", 1, 1, 3, scene);
  targetCell.visibility = 0;

  const interactiveMeshes = await createMeshesFromEntities(entities, scene);

  let currentlyPlayingMesh: Mesh;

  emitter.on(UiToSceneEvent.BattleStartTurn, (entity: Entity) => {
    if (currentSpell) {
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

  camera.setTarget(new Vector3(0, 0, 0));

  camera.attachControl(canvas, false);

  const light = new BABYLON.HemisphericLight(
    "light1",
    new Vector3(1, 1, 1),
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

  const onPointerMove = () => {
    if (!getUnprojectedPosition()) {
      console.log("void");
      return;
    }
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

      const points = getPoints(
        basicEffects[currentSpell.effects[0]].potency[0].range.type,
        currentlyPlayingMesh.position,
        basicEffects[currentSpell.effects[0]].potency[0].range.value,
      );

      if (points.find(({ x, z }) => x === position.x && z === position.z)) {
        setPositionToMesh(
          targetCell,
          new Vector3(position.x, 0.01, position.z),
        );
      }

      if (
        currentSpell &&
        position.x === currentlyPlayingMesh.position.x &&
        position.z === currentlyPlayingMesh.position.z
      ) {
        match(basicEffects[currentSpell.effects[0]].potency[0].range.type)
          .with(RangeType.AroundSelfZone, () => {
            getScope(
              RangeType.Single,
              currentlyPlayingMesh.position,
              basicEffects[currentSpell.effects[0]].potency[0].range.value,
              scene,
              new Color3(1, 0, 0),
              "innerScope",
            );
          })
          .otherwise(() => {});
      } else if (currentSpell) {
        const mesh = scene.getMeshByName("innerScope");
        if (mesh) {
          mesh.dispose();
        }
      }

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
      path.push(
        new Vector3(
          position.x + differenceX * stepX,
          0,
          position.z + differenceZ * stepZ,
        ),
      );
    }

    const speed = 5;
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

  let lastPosition = { x: -1, z: -1 };
  const prepareEntityMovement = (pointerInfo) => {
    match(pointerInfo.type)
      .with(BABYLON.PointerEventTypes.POINTERMOVE, () => {
        if (!getUnprojectedPosition()) {
          console.log("void");
          return;
        }
        const projected = getProjectedPosition();
        const position = unproject(projected);

        if (lastPosition.x === position.x && lastPosition.z === position.z) {
          return;
        }
        lastPosition = position;
        const currentPosition = currentlyPlayingMesh.position;
        const cellsAmount =
          Math.abs(currentPosition.x - position.x) +
          Math.abs(currentPosition.z - position.z);

        console.log("move");

        const onReply = (result) => {
          console.log("fired", result);
          // currentlyPlayingMesh.metadata.entity.off(
          //   EntityEvent.ReplyMovementPermission,
          //   onReply,
          // );
        };
        currentlyPlayingMesh.metadata.entity.once(
          EntityEvent.ReplyMovementPermission,
          onReply,
        );
        currentlyPlayingMesh.metadata.entity.emit(
          EntityEvent.RequestMovementPermission,
          [currentlyPlayingMesh.metadata.entity, cellsAmount],
        );
      })
      .with(BABYLON.PointerEventTypes.POINTERUP, () => {
        if (!getUnprojectedPosition()) {
          console.log("void");
          return;
        }
        const projected = getProjectedPosition();
        const position = unproject(projected);

        const currentPosition = currentlyPlayingMesh.position;
        const currentProjectedPosition = project(currentPosition);
        const cellsAmount =
          Math.abs(currentPosition.x - position.x) +
          Math.abs(currentPosition.z - position.z);

        const handleReplyMovementPermission = (canMove: boolean) => {
          if (canMove && isPositionFree(position)) {
            animateMeshToCell(currentlyPlayingMesh, position);

            currentlyPlayingMesh.metadata.entity.emit(EntityEvent.Move, [
              currentlyPlayingMesh.metadata.entity,
              cellsAmount,
            ]);
          }
          currentlyPlayingMesh.metadata.entity.off(
            EntityEvent.ReplyMovementPermission,
            handleReplyMovementPermission,
          );
        };
        currentlyPlayingMesh.metadata.entity.on(
          EntityEvent.ReplyMovementPermission,
          handleReplyMovementPermission,
        );
        currentlyPlayingMesh.metadata.entity.emit(
          EntityEvent.RequestMovementPermission,
          [currentlyPlayingMesh.metadata.entity, cellsAmount],
        );
      })
      .otherwise(() => {});
  };
  scene.onPointerObservable.add(prepareEntityMovement);

  const prepareSpellCasting = (pointerInfo) => {
    scene.onPointerObservable.removeCallback(prepareEntityMovement);

    match(pointerInfo.type)
      .with(BABYLON.PointerEventTypes.POINTERMOVE, onPointerMove)
      .with(BABYLON.PointerEventTypes.POINTERUP, () => {
        const canClick = match(basicEffects[currentSpell.effects[0]].targetType)
          .with(TargetType.Entity, () => !!activeMesh)
          .with(TargetType.Self, () => activeMesh === currentlyPlayingMesh)
          .otherwise(() => false);

        const points = getPoints(
          basicEffects[currentSpell.effects[0]].potency[0].range.type,
          currentlyPlayingMesh.position,
          basicEffects[currentSpell.effects[0]].potency[0].range.value,
        );

        const projected = getProjectedPosition();
        const position = unproject(projected);

        if (
          !canClick ||
          !points.find(({ x, z }) => x === position.x && z === position.z)
        ) {
          return;
        }
        const effectsTargetEntities = currentSpell.effects.map((effect) => {
          const basicEffect = basicEffects[effect];

          return match(basicEffect.potency[0].range.type)
            .with(RangeType.SelfZone, () => {
              drawScope(
                RangeType.Single,
                currentlyPlayingMesh.position,
                basicEffect.potency[0].range.value,
                new Color4(1, 0, 0, 1),
                "innerScope",
              );
              const points = drawZone(
                currentlyPlayingMesh.position,
                basicEffect.potency[0].range.value,
              );

              return interactiveMeshes.filter((interactiveMesh) => {
                const position = interactiveMesh.position.clone();
                position.x -= 0.5;
                position.z -= 0.5;
                return inside(position, points);
              });
            })
            .otherwise(() => [activeMesh])
            .map((interactiveMesh) => interactiveMesh.metadata.entity);
        });

        emitter.emit(UiToSceneEvent.BattleEntityTarget, effectsTargetEntities);
        activeMesh.material.alpha = 1;
        activeMesh = undefined;
        targetCell.visibility = 0;
      })
      .otherwise(() => {});
  };

  const resetSelectedSpell = () => {
    targetCell.visibility = 0;
    scope.dispose();
    const mesh = scene.getMeshByName("innerScope");
    if (mesh) {
      mesh.dispose();
    }
    scene.onPointerObservable.removeCallback(prepareSpellCasting);
    setTimeout(() => {
      scene.onPointerObservable.add(prepareEntityMovement);
    }, 100);
  };

  let currentSpell = undefined;
  let scope: Mesh = undefined;

  const handleClickSpell = (spell?: Spell) => {
    if (spell) {
      scope = getScope(
        basicEffects[spell.effects[0]].potency[0].range.type,
        currentlyPlayingMesh.position,
        basicEffects[spell.effects[0]].potency[0].range.value,
        scene,
      );

      scene.onPointerObservable.add(prepareSpellCasting);
    } else if (currentSpell) {
      resetSelectedSpell();
    }
    currentSpell = spell;
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
          const step = casterMesh.position.z > targetMesh.position.z ? 1 : -1;
          const additionalZ = cells * step;
          targetMesh.position.z +=
            additionalZ +
            (targetMesh.position.z + additionalZ === casterMesh.position.z
              ? -step
              : 0);
        } else if (casterMesh.position.z === targetMesh.position.z) {
          const step = casterMesh.position.x > targetMesh.position.x ? 1 : -1;
          const additionalX = cells * step;
          targetMesh.position.x +=
            additionalX +
            (targetMesh.position.x + additionalX === casterMesh.position.x
              ? -step
              : 0);
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
