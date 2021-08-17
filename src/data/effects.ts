import type { EffectDefinition } from "../types/effects";
import { objectToArray } from "../utils/object";
import type { Entity } from "./entity";
import type { Element } from "./spells";

export interface ConsumableEffect {
  type: keyof typeof basicEffects;
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
        return targets.map((target) => {
          const value = target.processSpellValue(
            target.receiveSpell(
              caster.castSpell(
                currentEffect.potency[effect.level].value,
                effect.element,
              ),
              effect.element,
            ),
          );
          target.updateHealth(value);
          return {
            caster, target, value
          };
        });
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
        const currentEffect = basicEffects[effect.type];
        return targets.map((target) => {
          const value = target.processSpellValue(
            target.receiveSpell(
              caster.castSpell(
                currentEffect.potency[effect.level].value,
                effect.element,
              ),
              effect.element,
            ),
          );
          target.updateHealth(value);
          return {
            caster, target, value
          };
        });
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
        return targets.map((target) => {
          const value = target.processSpellValue(
            target.receiveSpell(
              caster.castSpell(
                currentEffect.potency[effect.level].value,
                effect.element,
              ),
              effect.element,
            ),
          );
          target.updateHealth(value);
          return {
            caster, target, value
          };
        });
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
        return targets.map((target) => {
          const value = target.processSpellValue(
            target.receiveSpell(
              caster.castSpell(
                currentEffect.potency[effect.level].value,
                effect.element,
              ),
              effect.element,
            ),
          );
          target.updateHealth(value);
          return {
            caster, target, value
          };
        });
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
        return targets.map((target) => {
          const value = target.processSpellValue(
            target.receiveSpell(
              caster.castSpell(
                currentEffect.potency[effect.level].value,
                effect.element,
              ),
              effect.element,
            ),
          );
          target.updateHealth(value);
          return {
            caster, target, value
          };
        });
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
        return targets.map((target) => {
          const value = target.processSpellValue(
            target.receiveSpell(
              caster.castSpell(
                currentEffect.potency[effect.level].value,
                effect.element,
              ),
              effect.element,
            ),
          );
          target.updateHealth(value);
          return {
            caster, target, value
          };
        });
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
        return targets.map((target) => {
          const value = target.processSpellValue(
            target.receiveSpell(
              caster.castSpell(
                currentEffect.potency[effect.level].value,
                effect.element,
              ),
              effect.element,
            ),
          );
          target.updateHealth(value);
          return {
            caster, target, value
          };
        });
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
        return targets.map((target) => {
          const value = target.processSpellValue(
            target.receiveSpell(
              caster.castSpell(
                currentEffect.potency[effect.level].value,
                effect.element,
              ),
              effect.element,
            ),
          );
          target.updateHealth(value);
          return {
            caster, target, value
          };
        });
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
        return targets.map((target) => {
          const value = target.processSpellValue(
            target.receiveSpell(
              caster.castSpell(
                currentEffect.potency[effect.level].value,
                effect.element,
              ),
              effect.element,
            ),
          );
          target.updateHealth(value);
          return {
            caster, target, value
          };
        });
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
        return targets.map((target) => {
          const value = target.processSpellValue(
            target.receiveSpell(
              caster.castSpell(
                currentEffect.potency[effect.level].value,
                effect.element,
              ),
              effect.element,
            ),
          );
          target.updateHealth(value);
          return {
            caster, target, value
          };
        });
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
