import Dexie from "dexie";

import type { Effect } from "../types/effects";
import type { Rune } from "../types/runes";
import type { Spell } from "../types/spells";
import type { Battle } from "../types/battle";

class ArcanaeumDatabase extends Dexie {
  effects: Dexie.Table<Pick<Effect, "name" | "effects" | "icon">, number>;
  spells: Dexie.Table<Spell, number>;
  runes: Dexie.Table<Rune, number>;
  battles: Dexie.Table<Battle, number>;

  constructor() {
    super("ArcanaeumDatabase");
    this.version(2).stores({
      effects: "++id, name, effects, icon",
      spells: "++id, name, effects",
      battles: "++id, mode, index",
    });
    this.effects = this.table("effects");
    this.spells = this.table("spells");
    this.battles = this.table("battles");
  }
}

const db = new ArcanaeumDatabase();

export const effects = db.effects;
export const spells = db.spells;
export const battles = db.battles;

// export const get = (key: Pocket) => JSON.parse(localStorage.getItem(key));

// export const put = (key: Pocket, value: any) => localStorage.setItem(key, JSON.stringify(value));

// export const remove = (key: Pocket) => localStorage.deleteItem(key);

// // export const initialize = ()

// // runes

// // spells

// // equipment
