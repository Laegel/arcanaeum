import EventEmitter from "../utils/EventEmitter";
import type { Element } from "./spells";

export enum Event {
  Death,
}

interface Coordinates {
  x: number;
  y: number;
}

export abstract class Entity extends EventEmitter<Event> {
  private name: string;
  private readonly maxHealth: number;
  private currentHealth: number;
  private readonly maxMagicka: number;
  private currentMagicka: number;
  private position: Coordinates;
  private power: number;
  private defense: number;
  private elementalMultipliers: { [key in Element]: number };
  private elementalDividers: { [key in Element]: number };

  public constructor(
    name: string,
    health: number,
    magicka: number,
    position: Coordinates,
    power: number,
    defense: number,
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
    return value / this.defense / this.elementalDividers[element];
  }

  // pass a negative value for damages, a positive one for healing
  public updateHealth(value: number) {
    this.currentHealth += value;
    if (this.currentHealth === 0) {
      this.emit(Event.Death, this);
    }
  }

  public castSpell(value: number, element: Element) {
    return value * this.power * this.elementalMultipliers[element];
  }
}

export class Player extends Entity {}

export class Ally extends Entity {}

export class Enemy extends Entity {}
