import basicEffects from "../src/data/effects";
import { Player, Enemy, Event } from "../src/data/entity";
import {
  Element,
  elementalDividers,
  elementalMultipliers,
} from "../src/data/spells";

const casterDefaultData = {
  name: "Player",
  maxHealth: 100,
  maxMagicka: 100,
  position: { x: 0, y: 0 },
  power: 10,
  defense: 10,
  movementPoints: 3,
  elementalMultipliers,
  elementalDividers,
};

const targetDefaultData = {
  name: "Enemy",
  maxHealth: 100,
  maxMagicka: 100,
  position: { x: -4, y: -1 },
  power: 10,
  defense: 10,
  movementPoints: 3,
  elementalMultipliers,
  elementalDividers,
};

const instantiate = ({
  casterData = casterDefaultData,
  targetData = targetDefaultData,
}: {
  casterData?: { [key: string]: any };
  targetData?: { [key: string]: any };
} = {}) => {
  const finalCasterData = { ...casterDefaultData, ...casterData };
  const caster = Player.from(finalCasterData);

  const finalTargetData = { ...targetDefaultData, ...targetData };
  const target = Enemy.from(finalTargetData);
  return { caster, targets: [target] };
};

describe("Effects", () => {
  test("ElementalDamageSingleTarget should reduce target health", () => {
    const { caster, targets } = instantiate();
    const consumableEffect = {
      type: "ElementalDamageSingleTarget",
      level: 0,
      element: Element.Fire,
    };

    basicEffects.ElementalDamageSingleTarget.apply(consumableEffect)(
      caster,
      targets,
    );
    expect(targets[0].getCurrentHealth()).toBe(98);
  });

  test("ElementalDamageSingleTarget damage should be reduced by target elemental resistance", () => {
    const { caster, targets } = instantiate({
      casterData: {
        power: 500,
      },
      targetData: {
        elementalDividers: { ...elementalDividers, [Element[0]]: 2 },
      },
    });
    const consumableEffect = {
      type: "ElementalDamageSingleTarget",
      level: 0,
      element: Element.Fire,
    };

    basicEffects.ElementalDamageSingleTarget.apply(consumableEffect)(
      caster,
      targets,
    );
    expect(targets[0].getCurrentHealth()).toBe(50);
  });

  test("ElementalDamageSingleTarget should kill the target", async () => {
    const { caster, targets } = instantiate({
      casterData: {
        power: 500,
      },
    });
    const consumableEffect = {
      type: "ElementalDamageSingleTarget",
      level: 0,
      element: Element.Fire,
    };

    const promise = new Promise<boolean>((resolve) => {
      targets[0].on(Event.Death, () => resolve(true));
    });
    basicEffects.ElementalDamageSingleTarget.apply(consumableEffect)(
      caster,
      targets,
    );

    const died = await promise;
    expect(targets[0].getCurrentHealth()).toBe(0);
    expect(died).toBeTruthy();
  });

  test("ElementalDamageSingleTarget should restore target health", () => {
    const { caster } = instantiate({
      casterData: {
        power: 20,
        elementalDividers: {
          ...elementalDividers,
          [Element[Element.Fire]]: -2,
        },
      },
    });
    const consumableEffect = {
      type: "ElementalDamageSingleTarget",
      level: 0,
      element: Element.Fire,
    };
    caster.currentHealth = 98;

    basicEffects.ElementalDamageSingleTarget.apply(consumableEffect)(caster, [
      caster,
    ]);
    expect(caster.getCurrentHealth()).toBe(100);
  });
});
