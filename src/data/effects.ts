import { EffectDefinition, RangeType, TargetType } from "../types/effects";
import { objectToArray } from "../utils/object";
import { Entity, Event as EntityEvent } from "./entity";
import type { Element } from "./spells";

export interface ConsumableEffect {
  type: keyof typeof basicEffects;
  level: number;
  element: Element;
}

const basicEffects: { [key: string]: EffectDefinition } = {
  ElementalDamageSingleTarget: {
    icon: "beam-blue-1.png",
    potency: {
      0: {
        value: 2,
        range: {
          type: RangeType.Single,
          value: 5,
        },
      },
    },
    targetType: TargetType.Entity,
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
            caster,
            target,
            value,
          };
        });
      },
  },
  ElementalShieldSingleTarget: {
    icon: "protect-eerie-1.png",
    potency: {
      0: {
        value: 0,
        range: {
          type: RangeType.Single,
          value: 5,
        },
      },
    },
    targetType: TargetType.Entity,
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
            caster,
            target,
            value,
          };
        });
      },
  },
  ElementalTrapSingleTarget: {
    icon: "wind-grasp-eerie-1.png",
    potency: {
      0: {
        value: 1,
        range: {
          type: RangeType.Single,
          value: 5,
        },
      },
    },
    targetType: TargetType.Cell,
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
            caster,
            target,
            value,
          };
        });
      },
  },
  StatusApplySingleTarget: {
    icon: "light-blue-1.png",
    potency: {
      0: {
        value: 0,
        range: {
          type: RangeType.Single,
          value: 5,
        },
      },
    },
    targetType: TargetType.Entity,
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
            caster,
            target,
            value,
          };
        });
      },
  },
  StatusCureSingleTarget: {
    icon: "light-blue-1.png",
    potency: {
      0: {
        value: 0,
        range: {
          type: RangeType.Single,
          value: 5,
        },
      },
    },
    targetType: TargetType.Entity,
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
            caster,
            target,
            value,
          };
        });
      },
  },
  RepulseSingleTarget: {
    icon: "link-spirit-2.png",
    potency: {
      0: {
        value: 2,
        range: {
          type: RangeType.Cross,
          value: 2,
        },
      },
    },
    targetType: TargetType.Entity,
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
            caster,
            target,
            value,
          };
        });
      },
  },
  AttractSingleTarget: {
    icon: "link-spirit-1.png",
    potency: {
      0: {
        value: 2,
        range: {
          type: RangeType.Cross,
          value: 7,
        },
      },
    },
    targetType: TargetType.Entity,
    apply:
      (effect: ConsumableEffect) => (caster: Entity, targets: Entity[]) => {
        const currentEffect = basicEffects[effect.type];
        return targets.map((target) => {
          target.emit(EntityEvent.AttractionMovement, {
            caster,
            target,
            cells: currentEffect.potency[effect.level].value,
          });
          return {
            caster,
            target,
            value: 0,
          };
        });
      },
  },
  ElementalDamageSingleTargetArea: {
    icon: "fireball-eerie-1.png",
    potency: {
      0: {
        value: 2,
        range: {
          type: RangeType.Single,
          value: 5,
        },
      },
    },
    targetType: TargetType.Any,
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
            caster,
            target,
            value,
          };
        });
      },
  },
  ElementalDamageAround: {
    icon: "explosion-sky-2.png",
    potency: {
      0: {
        value: 5,
        range: {
          type: RangeType.AroundSelfZone,
          value: 2,
        },
      },
    },
    targetType: TargetType.Ally,
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
            caster,
            target,
            value,
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
