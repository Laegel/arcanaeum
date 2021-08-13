I have always wanted to make a videogame, this is one of the reasons that made me start learning programming.

My goal is to make an isometric videogame

Preliminary study and technologies picking

Tried Phaser but it is just 2D. Then tried to integrate with enable3D and Three.js but it felt like playing with Frankenstein creature.
Discovered BabylonJS, PlayCanvas, JSIso and IsomerJS. JSIso and IsomerJS had not been updated for years so I did not even bother to try them.
PlanCanvas looked interesting but I found code and working examples with BabylonJS and decided to start with it!

All right, the game engine is chosen. Luckily, is has a nice TypeScript support, so I do not need to switch back to pure JavaScript.
I know the GUI can be handled by BabylonJS too but, since the game is, in the end, 2D, I preferred using a frontend framework for everything that is not in an isometric scene. I picked Svelte, as I wanted to try it with TypeScript and I really enjoyed its DX.
I then decided to use Tailwind for the styles and Dexie as indexedDB wrapper.
The webapps will be bundled with Tauri for desktop and Capacitor for mobile.

Here is the beginning of my journey with BabylonJS:

```ts
import * as BABYLON from "@babylonjs/core";
import { Scene, Vector2, Vector3, Mesh, LinesMesh } from "@babylonjs/core";
import { GridMaterial } from "@babylonjs/materials";

import { applyZoom } from "./utils/camera";
import { unproject } from "./utils/coordinates";

export default (canvas) => {
  const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });

  const scene = new Scene(engine);

  const grid = new GridMaterial("grid", scene);

  const ground = Mesh.CreateGround("ground1", 20, 20, 1, scene);
  ground.material = grid;

  const targetCell = Mesh.CreateGround("hover", 1, 1, 3, scene);
  targetCell.visibility = 0;

  const interactiveMeshes = createMeshesFromEntities(entities, scene);

  let currentlyPlayingMesh: Mesh;

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
      x: Math.floor(pickedPoint.x),
      y: Math.floor(pickedPoint.z),
    };
  };

  const getUnprojectedPosition = () => {
    return scene.pick(scene.pointerX, scene.pointerY).pickedPoint;
  };

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


```