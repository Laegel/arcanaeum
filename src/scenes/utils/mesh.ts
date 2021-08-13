import { Mesh, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
// import "babylonjs-loaders";
import "@babylonjs/loaders/glTF";
import { instanceOf, match, __ } from "ts-pattern";

import { Entity, Player, Enemy, Ally } from "../../data/entity";
import { unproject } from "./coordinates";
import { createEntityMaterials } from "./materials";

export const setPositionToMesh = (mesh: Mesh, position: Vector3) => {
  mesh.position.x = position.x + 0.5;
  mesh.position.y = position.y;
  mesh.position.z = position.z + 0.5;
};

export const importMesh = async (type: string, scene: Scene) => {
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
  // const result = await SceneLoader.ImportMeshAsync(
  //   "",
  //   // "https://assets.babylonjs.com/meshes/",
  //   // "HVGirl.glb",
  //   "/meshes/",
  //   "idle.glb",
  //   scene,
  // );
  // const [dummy] = result.meshes;

  const { materialAlly, materialEnemy, materialPlayer } =
    createEntityMaterials(scene);
  return Promise.all(
    entities.map((entity, index) =>
      match(entity)
        .with(instanceOf(Player), async () => {
          const playerMesh = await importMesh("Player", scene);
          // console.log(dummy);

          // const playerMesh = dummy.clone("player", null) as Mesh;
          // console.log(playerMesh);

          // playerMesh.isVisible = true;

          playerMesh.material = materialPlayer;
          playerMesh.metadata = { entity: index };
          setPositionToMesh(playerMesh, unproject(entity.getPosition()));
          return playerMesh;
        })
        .with(instanceOf(Enemy), async () => {
          const enemyMesh = await importMesh("Enemy", scene);
          // const enemyMesh = Mesh.CreateBox(`enemy${index}`, 1, scene);
          enemyMesh.material = materialEnemy;
          enemyMesh.metadata = { entity: index };
          setPositionToMesh(enemyMesh, unproject(entity.getPosition()));
          return enemyMesh;
        })
        .with(instanceOf(Ally), async () => {
          const allyMesh = await importMesh("Ally", scene);
          allyMesh.material = materialAlly;
          allyMesh.metadata = { entity: index };
          setPositionToMesh(allyMesh, unproject(entity.getPosition()));
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
