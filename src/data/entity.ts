import EventEmitter from "../utils/EventEmitter";
import { Element } from "./spells";

export enum Event {
  Death,
  Move,
  RequestMovementPermission,
  AttractionMovement,
}

interface Coordinates {
  x: number;
  y: number;
}

export abstract class Entity extends EventEmitter<Event> {
  private name: string;
  private maxHealth: number;
  private currentHealth: number;
  private maxMagicka: number;
  private currentMagicka: number;
  private position: Coordinates;
  private power: number;
  private defense: number;
  private movementPoints: number;
  private elementalMultipliers: { [key in Element]: number };
  private elementalDividers: { [key in Element]: number };

  public static from(args: { [key: string]: any }) {
    const entity = new (this as any)();
    for (const prop in args) {
      entity[prop] = args[prop];
    }
    entity.currentHealth = entity.maxHealth;
    entity.currentMagicka = entity.maxMagicka;

    return entity;
  }

  public constructor(
    name: string,
    health: number,
    magicka: number,
    position: Coordinates,
    power: number,
    defense: number,
    movementPoints: number,
    elementalMultipliers,
    elementalDividers,
  ) {
    super();
    this.name = name;
    this.maxHealth = health;
    this.currentHealth = health;
    this.maxMagicka = magicka;
    this.currentMagicka = magicka;
    this.position = position;
    this.power = power;
    this.defense = defense;
    this.movementPoints = movementPoints;
    this.elementalMultipliers = elementalMultipliers;
    this.elementalDividers = elementalDividers;
  }

  public castOn(action, target: Entity) {
    target.decreaseHealth(action);
  }

  public getName() {
    return this.name;
  }

  public getMaxHealth() {
    return this.maxHealth;
  }

  public getCurrentHealth() {
    return this.currentHealth;
  }

  public getMaxMagicka() {
    return this.maxMagicka;
  }

  public getCurrentMagicka() {
    return this.currentMagicka;
  }

  public getPosition() {
    return this.position;
  }

  public decreaseHealth(incomingDamages: number) {
    const damages =
      this.currentHealth < incomingDamages
        ? this.currentHealth
        : incomingDamages;
    this.currentHealth -= damages;
    if (this.currentHealth === 0) {
      this.emit(Event.Death, this);
    }
  }

  public receiveSpell(value: number, element: Element) {
    return value / this.defense / this.elementalDividers[Element[element]];
  }

  public processSpellValue(value: number) {
    // All effects damage values are positive; heal is considered a negative incoming value
    let realValue = -value;
    if (realValue < 0) {
      realValue =
        this.currentHealth < -realValue ? -this.currentHealth : realValue;
    } else {
      realValue =
        this.currentHealth + realValue > this.maxHealth
          ? this.maxHealth - this.currentHealth
          : realValue;
    }
    return realValue;
  }

  public updateHealth(value: number) {
    this.currentHealth += value;
    if (this.currentHealth === 0) {
      this.emit(Event.Death, this);
    }
  }

  public castSpell(value: number, element: Element) {
    return value * this.power * this.elementalMultipliers[Element[element]];
  }

  public hasSideEffects() {}
}

export class Player extends Entity {}

export class Ally extends Entity {}

export class Enemy extends Entity {}
