import type { Enemy } from "../data/entity";

export enum Mode {
  Campaign = 0,
  ElementalTrial,
  MindTrial,
  BodyTrial,
}

export interface Battle {
  mode: Mode;
  index: number;
}
