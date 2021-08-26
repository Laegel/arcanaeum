import type { Entity } from "../data/entity";
import type { ConsumableEffect } from "../data/effects";

export type PotencyLevel = 0; // | 1 | 2 | 3 | 4;

export enum RangeType {
  AroundSelfZone,
  SelfZone,
  Cross,
  Single,
  Zone,
}

export interface Range {
  type: RangeType;
  value: number;
}

export interface Potency {
  value: number;
  range: Range;
}

export interface EffectApplicationDetails {
  caster: Entity;
  target: Entity;
  value: number;
}

export enum TargetType {
  Entity,
  Ally,
  Enemy,
  Cell,
  Any,
}

export interface EffectDefinition {
  icon: string;
  potency: { [key in PotencyLevel]: Potency };
  targetType: TargetType;
  apply: (
    effect: ConsumableEffect,
  ) => (caster: Entity, targets: Entity[]) => EffectApplicationDetails[];
}

export interface Effect extends EffectDefinition {
  name: string;
  effects: string[];
}
