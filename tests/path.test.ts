import { Vector3 } from "@babylonjs/core";
import { getClosestFreeCells, getShortestPath } from "../src/scenes/utils/path";

describe("Pathfinder", () => {
  test("Get closest free cells", () => {
    const cells = getClosestFreeCells(new Vector3(0, 0, 0), [
      new Vector3(1, 0, 0),
    ]);
    expect(cells.length).toBe(3);
  });

  test("Simply reach destination", () => {
    const path = getShortestPath(new Vector3(0, 0, 0), new Vector3(5, 0, 0));

    expect(path.length).toBe(6);
    expect(path.map(({ x, y, z }) => ({ x, y, z }))).toEqual(
      expect.arrayContaining([
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 2, y: 0, z: 0 },
        { x: 3, y: 0, z: 0 },
        { x: 4, y: 0, z: 0 },
        { x: 5, y: 0, z: 0 },
      ].map(expect.objectContaining)),
    );
  });

  test("Reach destination with obstacles", () => {
    const path = getShortestPath(new Vector3(0, 0, 0), new Vector3(5, 0, 0), [
      new Vector3(2, 0, 0),
      new Vector3(4, 0, 1),
    ]);

    const expectedPath = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 1, y: 0, z: 1 },
      { x: 2, y: 0, z: 1 },
      { x: 3, y: 0, z: 1 },
      { x: 3, y: 0, z: 0 },
      { x: 4, y: 0, z: 0 },
      { x: 5, y: 0, z: 0 },
    ].map(expect.objectContaining);

    expect(path.length).toBe(8);
    expect(path.map(({ x, y, z }) => ({ x, y, z }))).toEqual(
      expect.arrayContaining(expectedPath),
    );
  });
});
