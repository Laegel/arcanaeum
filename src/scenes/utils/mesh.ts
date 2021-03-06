import { Mesh, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
// import "babylonjs-loaders";
import "@babylonjs/loaders/glTF";
import { instanceOf, match, __ } from "ts-pattern";

import { Entity, Player, Enemy, Ally } from "../../data/entity";
import { unproject } from "./coordinates";
import { createEntityMaterials } from "./materials";

export enum Direction {
  Top,
  Right,
  Bottom,
  Left,
}

export const setPositionToMesh = (mesh: Mesh, position: Vector3) => {
  mesh.position.x = position.x;
  mesh.position.y = position.y;
  mesh.position.z = position.z;
};

export const importMesh = async (type: string, scene: Scene) => {
  // return Mesh.CreateBox(type, 1, scene);
  const result = await SceneLoader.ImportMeshAsync(
    "",
    "/meshes/",
    `${type}.glb`,
    scene,
  );
  result.meshes[0].scaling.scaleInPlace(0.8);
  return result.meshes[0] as Mesh;
};

export const createMeshesFromEntities = async (
  entities: Entity[],
  scene: Scene,
) => {
  const { materialAlly, materialEnemy, materialPlayer } =
    createEntityMaterials(scene);
  return Promise.all(
    entities.map((entity, index) =>
      match(entity)
        .with(instanceOf(Player), async () => {
          const playerMesh = await importMesh("Player", scene);
          playerMesh.material = materialPlayer;
          playerMesh.metadata = { entity };
          setPositionToMesh(playerMesh, unproject(entity.getPosition()));
          setDirection(playerMesh, Direction.Left);
          return playerMesh;
        })
        .with(instanceOf(Enemy), async () => {
          const enemyMesh = await importMesh("Enemy", scene);
          enemyMesh.material = materialEnemy;
          enemyMesh.metadata = { entity };
          setPositionToMesh(enemyMesh, unproject(entity.getPosition()));
          setDirection(enemyMesh, Direction.Right);
          return enemyMesh;
        })
        .with(instanceOf(Ally), async () => {
          const allyMesh = await importMesh("Ally", scene);
          allyMesh.material = materialAlly;
          allyMesh.metadata = { entity };
          setPositionToMesh(allyMesh, unproject(entity.getPosition()));
          setDirection(allyMesh, Direction.Left);
          return allyMesh;
        })
        .exhaustive(),
    ),
  );
};

export const getByEntity = (meshes: Mesh[], entity: Entity) =>
  meshes.find((mesh) => mesh.metadata.entity === entity);

export const getIndexByEntity = (meshes: Mesh[], entity: Entity) =>
  meshes.findIndex((mesh) => mesh.metadata.entity === entity);

export const setDirection = (mesh: Mesh, direction: Direction) => {
  mesh.rotationQuaternion = null;
  switch (direction) {
    case Direction.Top:
      mesh.rotation.y = Math.PI;
      break;
    case Direction.Right:
      mesh.rotation.y = -Math.PI / 2;
      break;
    case Direction.Bottom:
      // mesh.rotation.y = Math.PI;
      break;
    case Direction.Left:
      mesh.rotation.y = Math.PI / 2;
      break;
  }
};
