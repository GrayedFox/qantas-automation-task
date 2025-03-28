import { test } from '@playwright/test';
import { weatherBitConfig } from '../../../playwright.config';
import { BitActor } from '../../actors/BitActor';

// with only four decimals the coordinates are only accurate to the entire city
const cityData = {
  sydney: {
    name: 'Sydney',
    country: 'Australia',
    code: 'AU',
    lat: -33.8523,
    lon: 151.2108,
    postcode: 2000, // Harbour Bridge coords and postcode (CBD side)
  },
  berlin: {
    name: 'Berlin',
    country: 'Germany',
    code: 'DE',
    lat: 52.5206,
    lon: 13.4097,
    postcode: 10178, // TV Tower coords and postcode
  },
  kandy: {
    name: 'Kandy',
    country: 'Sri Lanka',
    code: 'SL',
    lat: 7.2914,
    lon: 80.6337,
    postcode: 20000, // Kandy city coords, centre
  },
};

const cities = Object.values(cityData).map((v) => v);

const mary = new BitActor(
  { name: 'Leela' },
  {
    coordinates: {
      method: 'pickone',
      suffix: 'LatLon',
      options: cities,
    },
  },
);

// use the weather bit config for testing the weather API
test.use({ baseURL: weatherBitConfig.baseUrl });

test.describe(
  'Mary consumes the WeatherBit API to get weather data using coordinates and postcodes',
  { tag: '@api' },
  () => {
    // may end up with the same city
    const sydney = cityData.sydney;
    const city = mary.pickone(cities.slice(1));

    test.beforeAll(async () => {
      await mary.opensBrowser();
    });

    test.afterAll(async () => {
      await mary.closesBrowser();
    });

    test('send sydney coordinates to retrieve weather data', async () => {
      const result = await mary.getsCurrentWeatherWithCoordinates({
        lat: sydney.lat,
        lon: sydney.lon,
      });
      await mary.seesWeatherDataMatchesSchema(result);
    });

    test('send city coordinates to retrieve weather data', async () => {
      const result = await mary.getsCurrentWeatherWithCoordinates({
        lat: city.lat,
        lon: city.lon,
      });
      await mary.seesWeatherDataMatchesSchema(result);
    });

    test('send sydney postcodes to retrieve weather data', async () => {
      const result = await mary.getsCurrentWeatherWithPostcode(sydney.postcode);
      await mary.seesWeatherDataMatchesSchema(result);
    });

    test('send city postcodes to retrieve weather data', async () => {
      const result = await mary.getsCurrentWeatherWithPostcode(city.postcode);
      await mary.seesWeatherDataMatchesSchema(result);
    });
  },
);
