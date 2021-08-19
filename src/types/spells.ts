import { objectToArray } from "../utils/object";

export interface SpellSlot {
  name: string;
  icon: string;
}

export interface SpellPattern {
  [key: string]: SpellSlot;
}

export interface Spell {
  name: string;
  effects: string[];
  scope: number;
  targetEntityOnly: boolean;
  icon: string;
}

const basicSpells = {
  DealDamage: {
    effects: ["ElementalDamageSingleTarget"],
    scope: 5,
    targetEntityOnly: true,
  },
};

export default basicSpells;

export const basicSpellsList = objectToArray(basicSpells);
