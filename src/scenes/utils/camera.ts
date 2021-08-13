import type { TargetCamera } from "@babylonjs/core";

export const applyZoom = (camera: TargetCamera, zoom: number) => {
  camera.orthoTop = zoom;
  camera.orthoBottom = -zoom;
  camera.orthoLeft = -zoom;
  camera.orthoRight = zoom;
};
