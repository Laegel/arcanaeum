import type { Entity } from "../data/entity";
import type { ConsumableEffect } from "../data/effects";

export type PotencyLevel = 0// | 1 | 2 | 3 | 4;
export interface Potency {
  value: number;
}

export interface EffectApplicationDetails {
  caster: Entity;
  target: Entity;
  value: number;
}

export interface EffectDefinition {
  icon: string;
  potency: { [key in PotencyLevel]: Potency };
  apply: (
    effect: ConsumableEffect,
  ) => (caster: Entity, targets: Entity[]) => EffectApplicationDetails[];
}

export interface Effect extends EffectDefinition {
  name: string;
  effects: string[];
}
