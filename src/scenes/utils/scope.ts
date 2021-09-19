import {
  Mesh,
  Vector2,
  Vector3,
  Color4,
  Scene,
  StandardMaterial,
  Color3,
} from "@babylonjs/core";
import { RangeType } from "../../types/effects";

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

export const drawSquare = (position: Vector3, scope: number) => {
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
  lines.edgesColor = new Color4(1, 0, 0, 1);
};

export const drawScope = (
  type: RangeType,
  position: Vector3,
  scope: number,
  color = new Color4(0, 0, 1, 1),
  name = "shape",
) => {
  const points = {
    [RangeType.Single]: drawZone(position, scope),
    [RangeType.Cross]: drawCross(position, scope),
    [RangeType.SelfZone]: drawSelfZone(position, scope),
    [RangeType.Zone]: drawZone(position, scope),
    [RangeType.AroundSelfZone]: drawZone(position, scope),
  }[type];

  const shape = Mesh.CreateLines(name, points);
  shape.enableEdgesRendering();
  shape.edgesWidth = 10;
  shape.edgesColor = color;
  return shape;
};

export const drawZone = (position: Vector3, scope: number) => {
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

  const lastPosition = position.clone();
  lastPosition.x += 0.5 + scope;
  lastPosition.z -= 0.5;

  return [...points1, ...points2, ...points3, ...points4, lastPosition];
};

const cloneWith = (mesh: Mesh, attributes: any) => {
  const clone = mesh.clone();
  for (const attribute in attributes) {
    clone[attribute] = attributes[attribute];
  }
  return clone;
};

export const TARGETTABLE = "targettable";

export const getScope = (
  type: RangeType,
  position: Vector3,
  scope: number,
  scene: Scene,
  color = new Color3(0, 0, 1),
  name = TARGETTABLE,
) => {
  const points = getPoints(type, position, scope);

  const ground = Mesh.CreateGround(TARGETTABLE, 1, 1, 1);
  const material = new StandardMaterial("", scene);
  material.diffuseColor = color;
  material.alpha = 0.3;
  ground.visibility = 0;

  const meshes = points.map((position) => cloneWith(ground, { position }));
  const mesh = Mesh.MergeMeshes(meshes);

  mesh.material = material;
  mesh.visibility = 1;
  mesh.name = name;

  return mesh;
};

export const getPoints = (type: RangeType, position: Vector3, scope: number) =>
  ({
    [RangeType.Single]: getZone(position, scope),
    [RangeType.Cross]: getCross(position, scope),
    [RangeType.SelfZone]: getSelfZone(position, scope),
    [RangeType.Zone]: getZone(position, scope),
    [RangeType.AroundSelfZone]: getSelfZone(position, scope),
  }[type]);

export const getZone: (position: Vector3, range: number) => Vector3[] = (
  position: Vector3,
  range: number,
) => {
  const points: Vector3[] = [];
  const scope = range + 1;

  const coordinates = { x: position.x - scope, y: 0, z: position.z - 1 };

  const walkAndAdd = (end, coordinates) => {
    for (let j = 0; j < end; ++j) {
      coordinates.x += 1;
      coordinates.z += 1;
      if (coordinates.x === position.x && coordinates.z === position.z) {
        continue;
      }
      points.push(new Vector3(coordinates.x, 0, coordinates.z));
    }
  };

  for (let i = 0; i < scope; ++i) {
    const intermediateCoordinates = { ...coordinates };

    walkAndAdd(scope, intermediateCoordinates);

    coordinates.x += 1;

    if (i !== scope - 1) {
      const intermediateCoordinates2 = { ...coordinates };
      walkAndAdd(scope - 1, intermediateCoordinates2);
    }

    coordinates.z -= 1;
  }
  return points;
};

export const getCross = (position: Vector3, range: number) => {
  const getPointsUntil = (property: "x" | "z", step: -1 | 1) => {
    const currentPosition = position.clone();
    const scope = range * step;
    const points: Vector3[] = [];
    while (currentPosition[property] !== position[property] + scope) {
      currentPosition[property] += step;
      points.push(currentPosition.clone());
    }
    return points;
  };

  return [
    ...getPointsUntil("x", 1),
    ...getPointsUntil("z", 1),
    ...getPointsUntil("x", -1),
    ...getPointsUntil("z", -1),
  ];
};

export const drawCross = (position: Vector3, scope: number) => {
  const virtualPosition = position.clone();
  const points = [virtualPosition];
  virtualPosition.x -= 0.5;
  virtualPosition.z -= 0.5;
  const currentPosition = virtualPosition.clone();

  while (currentPosition.z !== virtualPosition.z - scope) {
    --currentPosition.z;
    points.push(currentPosition.clone());
  }
  ++currentPosition.x;
  points.push(currentPosition.clone());

  while (currentPosition.z !== virtualPosition.z) {
    ++currentPosition.z;
    points.push(currentPosition.clone());
  }

  while (currentPosition.x !== virtualPosition.x + 1 + scope) {
    ++currentPosition.x;
    points.push(currentPosition.clone());
  }
  ++currentPosition.z;
  points.push(currentPosition.clone());

  while (currentPosition.x !== virtualPosition.x + 1) {
    --currentPosition.x;
    points.push(currentPosition.clone());
  }

  while (currentPosition.z !== virtualPosition.z + 1 + scope) {
    ++currentPosition.z;
    points.push(currentPosition.clone());
  }

  --currentPosition.x;
  points.push(currentPosition.clone());

  while (currentPosition.z !== virtualPosition.z + 1) {
    --currentPosition.z;
    points.push(currentPosition.clone());
  }

  while (currentPosition.x !== virtualPosition.x - scope) {
    --currentPosition.x;
    points.push(currentPosition.clone());
  }
  --currentPosition.z;
  points.push(currentPosition.clone());

  while (currentPosition.x !== virtualPosition.x) {
    ++currentPosition.x;
    points.push(currentPosition.clone());
  }

  return points;
};

export const getSelfZone = (position: Vector3, range: number) => [position];

export const drawSelfZone = (position: Vector3, scope: number) => {
  const virtualPosition = position.clone();
  virtualPosition.x -= 0.5;
  virtualPosition.z -= 0.5;
  const points = [virtualPosition.clone()];
  ++virtualPosition.x;
  points.push(virtualPosition.clone());
  ++virtualPosition.z;
  points.push(virtualPosition.clone());
  --virtualPosition.x;
  points.push(virtualPosition.clone());
  --virtualPosition.z;
  points.push(virtualPosition.clone());
  return points;
};
