import type { SpellPattern } from "../types/spells";
import { match, __ } from "ts-pattern";
import type { Entity } from "./entity";
import basicEffects, { ConsumableEffect } from "./effects";
import type { Spell } from "../types/spells";

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

export const elementalDividers = {
  Fire: 1,
  Water: 1,
  Earth: 1,
  Wind: 1,
  Sandstorm: 1,
  Metal: 1,
  Blizzard: 1,
  Lightning: 1,
  Wood: 1,
  Steam: 1,
};

export const elementalMultipliers = {
  Fire: 1,
  Water: 1,
  Earth: 1,
  Wind: 1,
  Sandstorm: 1,
  Metal: 1,
  Blizzard: 1,
  Lightning: 1,
  Wood: 1,
  Steam: 1,
};

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

export const cast = (spell: Spell, caster, targetsByEffects: Entity[][]) => {
  const details = spell.effects.map((effect, index) => {
    const consumableEffect = {
      type: effect,
      level: 0,
      element: Element.Fire,
    };
    console.log(consumableEffect);
    
    return applyEffect(consumableEffect)(caster, targetsByEffects[index]);
  });

  // targets.forEach((target) => triggerSideEffects(spell.effects[0], target));
  return details;
};

export const applyEffect = (effect: ConsumableEffect) =>
  basicEffects[effect.type].apply(effect);

// effect.type:
// - fire damage => (caster, targets) => targets.forEach(target => target.updateHealth(target.receiveSpell(caster.castSpell(spellRawDamage * effect.level, "fire"), "fire")))
// - heal => (caster, targets) => targets.forEach(target => target.updateHealth(target.receiveSpell(caster.power * effect.level, "heal")))

const triggerSideEffects = (effect, target) => {
  if (target.hasSideEffects()) {
  }
};
