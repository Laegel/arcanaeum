import { Scene, Color3, StandardMaterial } from "@babylonjs/core";

export const createEntityMaterials = (scene: Scene) => {
  const materialPlayer = new StandardMaterial("blue", scene);
  materialPlayer.diffuseColor = Color3.Blue();
  const materialEnemy = new StandardMaterial("red", scene);
  materialEnemy.diffuseColor = Color3.Red();
  const materialAlly = new StandardMaterial("green", scene);
  materialAlly.diffuseColor = Color3.Green();

  return {
    materialAlly,
    materialPlayer,
    materialEnemy,
  };
};
