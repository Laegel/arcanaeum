import EventEmitter from "../utils/EventEmitter";
import { Element } from "./spells";

export enum Event {
  Death,
  Move,
  RequestMovementPermission,
  AttractionMovement,
  ReplyMovementPermission,
}

interface Coordinates {
  x: number;
  y: number;
}

export abstract class Entity extends EventEmitter<Event> {
  private name: string;
  private maxHealth: number;
  private currentHealth: number;
  private position: Coordinates;
  private power: number;
  private defense: number;
  public actionPoints: number;
  private elementalMultipliers: { [key in Element]: number };
  private elementalDividers: { [key in Element]: number };
  public cooldowns: { [key: string]: number } = {};

  public static from(args: { [key: string]: any }) {
    const entity = new (this as any)();
    for (const prop in args) {
      entity[prop] = args[prop];
    }
    entity.currentHealth = entity.maxHealth;

    return entity;
  }

  public constructor(
    name: string,
    health: number,
    position: Coordinates,
    power: number,
    defense: number,
    actionPoints: number,
    elementalMultipliers,
    elementalDividers,
  ) {
    super();
    this.name = name;
    this.maxHealth = health;
    this.currentHealth = health;
    this.position = position;
    this.power = power;
    this.defense = defense;
    this.actionPoints = actionPoints;
    this.elementalMultipliers = elementalMultipliers;
    this.elementalDividers = elementalDividers;
  }

  public castOn(action, target: Entity) {
    target.decreaseHealth(action);
  }

  public hasEnoughAP(cost) {
    return this.actionPoints >= cost;
  }

  public hasNotEnoughAP(cost) {
    return !this.hasEnoughAP(cost);
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

  public getAP() {
    return this.actionPoints;
  }

  public addAP(value: number) {
    this.actionPoints += value;
  }

  public getPosition() {
    return this.position;
  }

  public substractAP(value: number) {
    this.actionPoints -= value;
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

  public hasCooldown(spell: string) {
    return this.cooldowns[spell] > 0;
  }

  public hasNoCooldown(spell: string) {
    return !this.hasCooldown(spell);
  }

  public hasSideEffects() {}
}

export class Player extends Entity {}

export class Ally extends Entity {}

export class Enemy extends Entity {}
