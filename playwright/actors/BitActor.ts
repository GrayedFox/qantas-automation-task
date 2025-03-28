import { Actor, ChanceOptions } from './Actor';
import { APIResponse, expect } from '@playwright/test';

interface IBitDetails {
  name: string;
}

const WeatherDataSchema = {
  count: 'number',
  app_temp: 'number',
  aqi: 'number',
  city_name: 'string',
  clouds: 'number',
  country_code: 'string',
  datetime: 'string',
  dewpt: 'number',
  dhi: 'number',
  dni: 'number',
  elev_angle: 'number',
  ghi: 'number',
  gust: 'number',
  h_angle: 'number',
  lat: 'number',
  lon: 'number',
  ob_time: 'string',
  pod: 'string',
  precip: 'number',
  pres: 'number',
  rh: 'number',
  slp: 'number',
  snow: 'number',
  solar_rad: 'number',
  sources: 'array',
  state_code: 'string',
  station: 'string',
  sunrise: 'string',
  sunset: 'string',
  temp: 'number',
  timezone: 'string',
  ts: 'number',
  uv: 'number',
  vis: 'number',
  weather: {
    code: 'number',
    icon: 'string',
    description: 'string',
  },
  wind_cdir: 'string',
  wind_cdir_full: 'string',
  wind_dir: 'number',
  wind_spd: 'number',
};

// destructure WeatherBit environment variables
const { QAT_PW_WEATHER_BIT_API_KEY: apiKey } = process.env;

// bit messy, we are relying on a schema here instead of a type since we need a runtime representation of the values to assert on
const checkKvpMatchesType = (data: Record<string, unknown>[]) => {
  for (const item of data) {
    for (const [key, value] of Object.entries(item)) {
      const lookupType =
        WeatherDataSchema[key as keyof typeof WeatherDataSchema];

      if (lookupType === 'array') {
        expect(Array.isArray(value)).toBeTruthy();
        continue;
      }

      if (typeof lookupType === 'object') {
        expect(value).toHaveProperty('code');
        expect(value).toHaveProperty('icon');
        expect(value).toHaveProperty('description');
        continue;
      }

      expect(typeof value).toEqual(lookupType);
    }
  }
};

/**
 * A BitActor is an Actor that can interact with the WeatherBit API.
 */
export class BitActor extends Actor {
  readonly apiKey: string;

  constructor(details: IBitDetails, chanceOptions?: ChanceOptions) {
    super(details.name, chanceOptions);

    this.apiKey = apiKey;
  }

  // helper to safely type and parse json from an API response
  private async parseJsonResult(result: APIResponse) {
    try {
      const json = (await result.json()) as Record<string, unknown>;
      return json;
    } catch (e: unknown) {
      throw new Error(JSON.stringify(e));
    }
  }

  // note this builds params indiscriminately and won't throw if both a postal code and coordinates are provided
  private buildQueryParams(options: {
    lat?: number;
    lon?: number;
    postcode?: number;
  }): string {
    const params = new URLSearchParams();

    if (options.lat !== undefined && options.lon !== undefined) {
      params.append('lat', options.lat.toString());
      params.append('lon', options.lon.toString());
    }

    if (options.postcode !== undefined) {
      params.append('postal_code', options.postcode.toString());
    }

    params.append('key', this.apiKey);

    return params.toString();
  }

  async getsCurrentWeatherWithPostcode(postcode: number) {
    const query = this.buildQueryParams({ postcode });
    return await this.page.context().request.get(`/v2.0/current?${query}`);
  }

  async getsCurrentWeatherWithCoordinates(coordinates: {
    lat: number;
    lon: number;
  }) {
    const query = this.buildQueryParams({ ...coordinates });
    return await this.page.context().request.get(`/v2.0/current?${query}`);
  }

  async seesWeatherDataMatchesSchema(response: APIResponse) {
    const body = await this.parseJsonResult(response);
    const data = (body['data'] || []) as Record<string, unknown>[];
    checkKvpMatchesType(data);
  }
}
