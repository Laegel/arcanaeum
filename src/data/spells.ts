import type { SpellPattern } from "../types/spells";
import { match, __ } from "ts-pattern";
import type { Entity } from "./entity";
import basicEffects, { ConsumableEffect } from "./effects";

export enum Element {
  Fire,
  Water,
  Earth,
  Wind,
  Sandstorm,
  Metal,
  Blizzard,
  Lightning,
  Wood,
  Steam,
}

export default {
  singleTarget: {},
  setTrap: {},
  applyShield: {},
  cureStatus: {},
};

const patternOne = {
  0: undefined,
  1: undefined,
};

const patternTwo = {
  ...patternOne,
  2: undefined,
};

const patternThree = {
  ...patternTwo,
  3: undefined,
};

const patternFour = {
  ...patternThree,
  4: undefined,
};

const patternFive = {
  ...patternFour,
  5: undefined,
};

export const patterns: SpellPattern[] = [
  patternOne,
  patternTwo,
  patternThree,
  patternFour,
  patternFive,
];

const cast = (spell, caster, targets) => {
  spell.effects.foreach((effect) => applyEffect(effect)(caster, targets));

  targets.forEach((target) => triggerSideEffects(spell.effects[0], target));
};

const applyEffect = (effect: ConsumableEffect) =>
  basicEffects[effect.type].apply(effect);

// effect.type:
// - fire damage => (caster, targets) => targets.forEach(target => target.updateHealth(target.receiveSpell(caster.castSpell(spellRawDamage * effect.level, "fire"), "fire")))
// - heal => (caster, targets) => targets.forEach(target => target.updateHealth(target.receiveSpell(caster.power * effect.level, "heal")))

const triggerSideEffects = (effect, target) => {
  if (target.hasSideEffects()) {
  }
};
