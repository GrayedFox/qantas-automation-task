import Chance from 'chance';
import crypto, { UUID } from 'crypto';
import { Page } from '@playwright/test';
import { isRandomUuid, setupBrowser, teardownBrowser } from '../utility';

// required interface for using Chance instance
interface IChance {
  seed?: UUID;
  chance: Chance.Chance;
}

// ensures methods have matching option signatures
interface IChanceMethod<T extends ChanceMethods> {
  method: T;
  suffix: string;
  options?: T extends keyof Chance.Chance
    ? Parameters<Chance.Chance[T]>[0]
    : never;
}

// extracts all Chance method names
type ChanceMethods = {
  [K in keyof Chance.Chance]: Chance.Chance[K] extends (
    ...args: unknown[]
  ) => unknown
    ? K
    : never;
}[keyof Chance.Chance];

// for defining custom random methods on the Actor
export type ChanceOptions = {
  [key: string]: IChanceMethod<ChanceMethods>;
};

// check for a seed in the environment variables which we use if present
const mersenneSeed = isRandomUuid(process.env.QAT_PW_CHANCE_SEED)
  ? process.env.QAT_PW_CHANCE_SEED
  : null;

// abstract class that wraps the Chance library and provides a common interface for all actors
export abstract class Actor implements IChance {
  readonly seed: UUID;
  readonly chance: Chance.Chance;

  protected page: Page;

  constructor(
    readonly name: string,
    readonly chanceOptions?: ChanceOptions,
  ) {
    this.seed = mersenneSeed || crypto.randomUUID();
    this.chance = new Chance(this.seed);

    console.log(`QAT_CHANCE_SEED: ${this.seed}`);
  }

  /** Shorthand method to return a chance instance */
  private get C() {
    return this.chance;
  }

  /** Simple wrapper of generic version of chance pickone method */
  pickone<T>(item: T[]): T {
    return this.C.pickone<T>(item);
  }

  /** Simple wrapper of chance postcode method which will always return a UK postcode */
  postcode(): string {
    return this.C.postcode();
  }

  /** Opens a browser and sets the page property of the actor */
  async opensBrowser() {
    this.page = await setupBrowser();
  }

  /** Closes the browser using the page property of the actor */
  async closesBrowser() {
    await teardownBrowser(this.page);
  }
}
