import type { EffectDefinition } from "../types/effects";
import { objectToArray } from "../utils/object";
import type { Entity } from "./entity";
import type { Element } from "./spells";

export interface ConsumableEffect {
  type: keyof typeof basicEffects;
  baseDamage: number;
  level: number;
  element: Element;
}

const basicEffects: { [key: string]: EffectDefinition } = {
  HealSingleTarget: {
    icon: "heal-jade-1.png",
    potency: {
      0: {
        value: 2,
      },
    },
    apply:
      (effect: ConsumableEffect) => (caster: Entity, targets: Entity[]) => {
        const currentEffect = basicEffects[effect.type];
        targets.forEach((target) =>
          target.updateHealth(
            target.receiveSpell(
              caster.castSpell(
                currentEffect.potency[effect.level].value,
                effect.element,
              ),
              effect.element,
            ),
          ),
        );
      },
  },
  ElementalDamageSingleTarget: {
    icon: "beam-blue-1.png",
    potency: {
      0: {
        value: 2,
      },
    },
    apply:
      (effect: ConsumableEffect) => (caster: Entity, targets: Entity[]) => {
        targets.forEach((target) =>
          target.updateHealth(
            target.receiveSpell(
              caster.castSpell(
                effect.baseDamage * effect.level,
                effect.element,
              ),
              effect.element,
            ),
          ),
        );
      },
  },
  ElementalShieldSingleTarget: {
    icon: "protect-eerie-1.png",
    potency: {
      0: {
        value: 2,
      },
    },
    apply:
      (effect: ConsumableEffect) => (caster: Entity, targets: Entity[]) => {
        const currentEffect = basicEffects[effect.type];
        targets.forEach((target) =>
          target.updateHealth(
            target.receiveSpell(
              caster.castSpell(
                currentEffect.potency[effect.level].value,
                effect.element,
              ),
              effect.element,
            ),
          ),
        );
      },
  },
  ElementalTrapSingleTarget: {
    icon: "wind-grasp-eerie-1.png",
    potency: {
      0: {
        value: 2,
      },
    },
    apply:
      (effect: ConsumableEffect) => (caster: Entity, targets: Entity[]) => {
        const currentEffect = basicEffects[effect.type];
        targets.forEach((target) =>
          target.updateHealth(
            target.receiveSpell(
              caster.castSpell(
                currentEffect.potency[effect.level].value,
                effect.element,
              ),
              effect.element,
            ),
          ),
        );
      },
  },
  StatusApplySingleTarget: {
    icon: "light-blue-1.png",
    potency: {
      0: {
        value: 2,
      },
    },
    apply:
      (effect: ConsumableEffect) => (caster: Entity, targets: Entity[]) => {
        const currentEffect = basicEffects[effect.type];
        targets.forEach((target) =>
          target.updateHealth(
            target.receiveSpell(
              caster.castSpell(
                currentEffect.potency[effect.level].value,
                effect.element,
              ),
              effect.element,
            ),
          ),
        );
      },
  },
  StatusCureSingleTarget: {
    icon: "light-blue-1.png",
    potency: {
      0: {
        value: 2,
      },
    },
    apply:
      (effect: ConsumableEffect) => (caster: Entity, targets: Entity[]) => {
        const currentEffect = basicEffects[effect.type];
        targets.forEach((target) =>
          target.updateHealth(
            target.receiveSpell(
              caster.castSpell(
                currentEffect.potency[effect.level].value,
                effect.element,
              ),
              effect.element,
            ),
          ),
        );
      },
  },
  RepulseSingleTarget: {
    icon: "link-spirit-2.png",
    potency: {
      0: {
        value: 2,
      },
    },
    apply:
      (effect: ConsumableEffect) => (caster: Entity, targets: Entity[]) => {
        const currentEffect = basicEffects[effect.type];
        targets.forEach((target) =>
          target.updateHealth(
            target.receiveSpell(
              caster.castSpell(
                currentEffect.potency[effect.level].value,
                effect.element,
              ),
              effect.element,
            ),
          ),
        );
      },
  },
  AttractSingleTarget: {
    icon: "link-spirit-1.png",
    potency: {
      0: {
        value: 2,
      },
    },
    apply:
      (effect: ConsumableEffect) => (caster: Entity, targets: Entity[]) => {
        const currentEffect = basicEffects[effect.type];
        targets.forEach((target) =>
          target.updateHealth(
            target.receiveSpell(
              caster.castSpell(
                currentEffect.potency[effect.level].value,
                effect.element,
              ),
              effect.element,
            ),
          ),
        );
      },
  },
  ElementalDamageSingleTargetArea: {
    icon: "fireball-eerie-1.png",
    potency: {
      0: {
        value: 2,
      },
    },
    apply:
      (effect: ConsumableEffect) => (caster: Entity, targets: Entity[]) => {
        const currentEffect = basicEffects[effect.type];
        targets.forEach((target) =>
          target.updateHealth(
            target.receiveSpell(
              caster.castSpell(
                currentEffect.potency[effect.level].value,
                effect.element,
              ),
              effect.element,
            ),
          ),
        );
      },
  },
  ElementalDamageAround: {
    icon: "explosion-sky-2.png",
    potency: {
      0: {
        value: 2,
      },
    },
    apply:
      (effect: ConsumableEffect) => (caster: Entity, targets: Entity[]) => {
        const currentEffect = basicEffects[effect.type];
        targets.forEach((target) =>
          target.updateHealth(
            target.receiveSpell(
              caster.castSpell(
                currentEffect.potency[effect.level].value,
                effect.element,
              ),
              effect.element,
            ),
          ),
        );
      },
  },
};

export default basicEffects;

export const basicEffectsList = objectToArray(basicEffects).map(
  (basicEffect) => {
    basicEffect.effects = [];
    return basicEffect;
  },
);
