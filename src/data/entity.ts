import emitter, { Event } from "../uiToScene";

interface Coordinates {
  x: number;
  y: number;
}

export abstract class Entity {
  private name: string;
  private readonly maxHealth: number;
  private currentHealth: number;
  private readonly maxMagicka: number;
  private currentMagicka: number;
  private position: Coordinates;

  public constructor(
    name: string,
    health: number,
    magicka: number,
    position: Coordinates,
  ) {
    this.name = name;
    this.maxHealth = health;
    this.currentHealth = health;
    this.maxMagicka = magicka;
    this.currentMagicka = magicka;
    this.position = position;
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
      this.currentHealth < incomingDamages ? this.currentHealth : incomingDamages;
    this.currentHealth -= damages;
    if (this.currentHealth === 0) {
      emitter.emit(Event.BattleEntityDeath, this);
    }
  }
}

export class Player extends Entity {}

export class Ally extends Entity {}

export class Enemy extends Entity {}
