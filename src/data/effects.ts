import { objectToArray } from "../utils/object";

const basicEffects = {
  HealSingleTarget: {
    icon: "heal-jade-1.png",
  },
  ElementalDamageSingleTarget: {
    icon: "beam-blue-1.png",
  },
  ElementalShieldSingleTarget: { icon: "protect-eerie-1.png" },
  ElementalTrapSingleTarget: { icon: "wind-grasp-eerie-1.png" },
  StatusApplySingleTarget: { icon: "light-blue-1.png" },
  StatusCureSingleTarget: { icon: "light-blue-1.png" },
  RepulseSingleTarget: { icon: "link-spirit-2.png" },
  AttractSingleTarget: { icon: "link-spirit-1.png" },
  ElementalDamageSingleTargetArea: { icon: "fireball-eerie-1.png" },
  ElementalDamageAround: { icon: "explosion-sky-2.png" },
};

export default basicEffects;

export const basicEffectsList = objectToArray(basicEffects).map(
  (basicEffect) => {
    basicEffect.effects = [];
    return basicEffect;
  },
);
