import { Vector3 } from "@babylonjs/core";

export const unproject = (vector) => new Vector3(vector.x, 0, vector.y);