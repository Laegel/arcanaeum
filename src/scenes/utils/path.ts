import type { Vector3 } from "@babylonjs/core";
import Queue from "./Queue";

const cloneWith = (
  cell: Vector3,
  attributes: { [key in "x" | "z"]?: number },
) => {
  const clone = cell.clone();
  for (const attribute in attributes) {
    clone[attribute] = attributes[attribute];
  }
  return clone;
};

export const getClosestCells = (origin: Vector3): Vector3[] => {
  return [
    cloneWith(origin, { x: origin.x + 1 }),
    cloneWith(origin, { x: origin.x - 1 }),
    cloneWith(origin, { z: origin.z + 1 }),
    cloneWith(origin, { z: origin.z - 1 }),
  ];
};

export const getClosestFreeCells = (origin: Vector3, obstacles: Vector3[]) =>
  getClosestCells(origin).filter(
    (cell) => !obstacles.find((obstacle) => cell.equals(obstacle)),
  );

class Node {
  public constructor(public cell: Vector3, public parent?: Node) {}

  public equals(other: Vector3): boolean {
    return this.cell.equals(other);
  }
}

const treeToList = (node: Node) => {
  const out = [];
  while (node.parent) {
    out.push(node.cell);
    node = node.parent;
  }
  out.push(node.cell);
  return out.reverse();
};

const bfs = (from: Vector3, to: Vector3, visited: Set<string>) => {
  const queue = new Queue([new Node(from)]);
  visited.add(JSON.stringify(from));

  let i = 0;
  while (queue.hasItems()) {
    const subtreeRoot = queue.dequeue();

    if (subtreeRoot.equals(to)) {
      return treeToList(subtreeRoot);
    }

    const closestCells = getClosestFreeCells(
      subtreeRoot.cell,
      Array.from(visited).map((value) => JSON.parse(value)),
    );

    closestCells.forEach((closestCell) => {
      visited.add(JSON.stringify(closestCell));
      queue.enqueue(new Node(closestCell, subtreeRoot));
    });
  }
};

export const getShortestPath = (
  origin: Vector3,
  destination: Vector3,
  obstacles: Vector3[] = [],
) => {
  if (origin.equals(destination)) {
    new Error("Origin and destination cannot be the same.");
  }
  const visited = new Set(
    [...obstacles, origin].map((item) => JSON.stringify(item)),
  );

  return bfs(origin, destination, visited);
};
