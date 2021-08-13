import Dexie from "dexie";

import type { Effect } from "../types/effects";
import type { Rune } from "../types/runes";
import type { Spell } from "../types/spells";

class ArcanaeumDatabase extends Dexie {
  effects: Dexie.Table<Effect, number>;
  spells: Dexie.Table<Spell, number>;
  runes: Dexie.Table<Rune, number>;

  constructor() {
    super("ArcanaeumDatabase");
    this.version(1).stores({
      effects: "++id, name, effects",
      spells: "++id, name, effects",
    });
    this.effects = this.table("effects");
    this.spells = this.table("spells");
  }
}

const db = new ArcanaeumDatabase();

export const effects = db.effects;
export const spells = db.spells;

// export const get = (key: Pocket) => JSON.parse(localStorage.getItem(key));

// export const put = (key: Pocket, value: any) => localStorage.setItem(key, JSON.stringify(value));

// export const remove = (key: Pocket) => localStorage.deleteItem(key);

// // export const initialize = ()

// // runes

// // spells

// // equipment
