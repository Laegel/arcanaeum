import { battles } from "../../storage";
import type { Mode } from "../../types/battle";

export const getBattlesPromise = async (mode: Mode) =>
  (await battles.where({ mode })).toArray();
