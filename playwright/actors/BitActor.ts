import { Page } from 'playwright';
import { Actor, ChanceOptions } from './Actor';
import { expect } from '@playwright/test';

interface IBitDetails {
  name: string;
}

// destructure WeatherBit environment variables
const { QAT_PW_WEATHER_BIT_API_KEY: apiKey, QAT_PW_WEATHER_BIT_URL: apiUrl } =
  process.env;

/**
 * A BitActor is an Actor that can interact with the WeatherBit API.
 */
export class BitActor extends Actor {
  constructor(details: IBitDetails, chanceOptions?: ChanceOptions) {
    super(details.name, chanceOptions);
  }
}
