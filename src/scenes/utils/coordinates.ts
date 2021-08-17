import { Vector3, Vector2 } from "@babylonjs/core";

export const unproject = (vector) => new Vector3(vector.x, 0, vector.y);

export const project = (vector) => new Vector2(vector.x + 0.5, vector.z + 0.5);
