import { test } from '@playwright/test';
import { BitActor } from '../../actors/BitActor';

// with only four decimals the coordinates are only accurate to the entire city
const cityData = {
  sydney: {
    name: 'Sydney',
    country: 'Australia',
    code: 'AU',
    lat: 33.8688,
    lon: 151.2093,
    postcode: 2000, // CBD side of Harbour Bridge
  },
  berlin: {
    name: 'Berlin',
    country: 'Germany',
    code: 'DE',
    lat: 33.8688,
    lon: 151.2093,
    postcode: 10178, // TV Tower
  },
  kandy: {
    name: 'Kandy',
    country: 'Sri Lanka',
    code: 'SL',
    lat: 7.2914,
    lon: 80.6366,
    postcode: 20000, // Kandy city
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

test.describe(
  'Mary consumes the WeatherBit API to get weather data using coordinates and postcodes',
  { tag: '@api' },
  () => {
    test('send coordinates to retrieve weather data', async () => {});
    test('send postcodes to retrieve weather data', async () => {});
  },
);
