import type { SpellPattern } from "../types/spells"

export default {
  singleTarget: {},
  setTrap: {},
  applyShield: {},
  cureStatus: {}
}

const patternOne = {
  0: undefined,
  1: undefined
}

const patternTwo = {
  ...patternOne,
  2: undefined
}

const patternThree = {
  ...patternTwo,
  3: undefined
}

const patternFour = {
  ...patternThree,
  4: undefined
}

const patternFive = {
  ...patternFour,
  5: undefined
}

export const patterns: SpellPattern[] = [patternOne, patternTwo, patternThree, patternFour, patternFive]