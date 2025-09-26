import { TIMESTAMP_CONVERSION_FACTOR } from "@constants/numericalConstants";
import { expect } from "@jest/globals";
import { days, TRANSFORM_WEATHER_MOCK, WEATHER_TRANSFORM_TEST } from "@mocks";

import { transformWeatherData } from "./transformWeatherResponse";

const { DESCRIPTION, TEST_DATA, IT } = WEATHER_TRANSFORM_TEST;
const { DATES, WEATHER_CONDITIONS, TEMPERATURES, PROBABILITIES } = TEST_DATA;
const { forecastItem, baseResponse } = TRANSFORM_WEATHER_MOCK;
const {
  SHOULD_GROUP_FORECAST_BY_DAY,
  SHOULD_CALCULATE_WEATHER_CONDITIONS,
  SHOULD_HANDLE_MULTIPLE_LANGUAGES,
  SHOULD_HANDLE_EMPTY_LIST,
  SHOULD_HANDLE_WEATHER_CONDITIONS,
} = IT;

describe(`${DESCRIPTION}`, () => {
  it(`${SHOULD_GROUP_FORECAST_BY_DAY}`, () => {
    const sameDayTimestamp1 = Math.floor(new Date(DATES.DAY1).getTime() / 1000);
    const sameDayTimestamp2 = Math.floor(new Date(DATES.DAY1_ALT).getTime() / 1000);
    const anotherDayTimestamp = Math.floor(new Date(DATES.DAY2).getTime() / 1000);

    const mockResponse = baseResponse([
      forecastItem(
        sameDayTimestamp1,
        TEMPERATURES.LOW,
        WEATHER_CONDITIONS.CLOUDS.main,
        WEATHER_CONDITIONS.CLOUDS.description
      ),
      forecastItem(
        sameDayTimestamp2,
        TEMPERATURES.HIGH,
        WEATHER_CONDITIONS.CLOUDS.main,
        WEATHER_CONDITIONS.CLOUDS.description
      ),
      forecastItem(
        anotherDayTimestamp,
        TEMPERATURES.MID,
        WEATHER_CONDITIONS.RAIN.main,
        WEATHER_CONDITIONS.RAIN.description
      ),
    ]);

    const result = transformWeatherData(mockResponse);

    expect(result.length).toBe(2);
    expect(result[0].dt).toBe(TEMPERATURES.MID);
    expect(result[0].day).toBe(
      days[new Date(sameDayTimestamp1 * TIMESTAMP_CONVERSION_FACTOR).getDay()]
    );
    expect(result[1].dt).toBe(TEMPERATURES.MID);
    expect(result[1].day).toBe(
      days[new Date(anotherDayTimestamp * TIMESTAMP_CONVERSION_FACTOR).getDay()]
    );
  });

  it(`${SHOULD_CALCULATE_WEATHER_CONDITIONS}`, () => {
    const timestamp = Math.floor(new Date(DATES.DAY1).getTime() / 1000);

    const mockResponse = baseResponse([
      forecastItem(
        timestamp,
        TEMPERATURES.LOW,
        WEATHER_CONDITIONS.RAIN.main,
        WEATHER_CONDITIONS.RAIN.description
      ),
      forecastItem(
        timestamp,
        TEMPERATURES.LOW,
        WEATHER_CONDITIONS.CLEAR.main,
        WEATHER_CONDITIONS.CLEAR.description
      ),
      forecastItem(
        timestamp,
        TEMPERATURES.LOW,
        WEATHER_CONDITIONS.CLOUDS.main,
        WEATHER_CONDITIONS.CLOUDS.description
      ),
      forecastItem(
        timestamp,
        TEMPERATURES.LOW,
        WEATHER_CONDITIONS.FOG.main,
        WEATHER_CONDITIONS.FOG.description
      ),
    ]);

    const result = transformWeatherData(mockResponse);

    expect(result.length).toBe(1);
    expect(result[0].rainy).toBe(PROBABILITIES.SINGLE);
    expect(result[0].sunny).toBe(PROBABILITIES.SINGLE);
    expect(result[0].cloudy).toBe(PROBABILITIES.SINGLE);
    expect(result[0].foggy).toBe(PROBABILITIES.SINGLE);
  });

  it(`${SHOULD_HANDLE_MULTIPLE_LANGUAGES}`, () => {
    const timestamp = Math.floor(new Date(DATES.DAY1).getTime() / 1000);

    const mockResponse = baseResponse([
      forecastItem(
        timestamp,
        TEMPERATURES.LOW,
        WEATHER_CONDITIONS.RUSSIAN.RAIN.main,
        WEATHER_CONDITIONS.RUSSIAN.RAIN.description
      ),
      forecastItem(
        timestamp,
        TEMPERATURES.LOW,
        WEATHER_CONDITIONS.RUSSIAN.CLEAR.main,
        WEATHER_CONDITIONS.RUSSIAN.CLEAR.description
      ),
      forecastItem(
        timestamp,
        TEMPERATURES.LOW,
        WEATHER_CONDITIONS.RUSSIAN.CLOUDS.main,
        WEATHER_CONDITIONS.RUSSIAN.CLOUDS.description
      ),
      forecastItem(
        timestamp,
        TEMPERATURES.LOW,
        WEATHER_CONDITIONS.RUSSIAN.FOG.main,
        WEATHER_CONDITIONS.RUSSIAN.FOG.description
      ),
    ]);

    const result = transformWeatherData(mockResponse);

    expect(result.length).toBe(1);
    expect(result[0].rainy).toBe(PROBABILITIES.SINGLE);
    expect(result[0].sunny).toBe(PROBABILITIES.SINGLE);
    expect(result[0].cloudy).toBe(PROBABILITIES.SINGLE);
    expect(result[0].foggy).toBe(PROBABILITIES.SINGLE);
  });

  it(`${SHOULD_HANDLE_EMPTY_LIST}`, () => {
    const mockResponse = baseResponse([]);
    const result = transformWeatherData(mockResponse);

    expect(result.length).toBe(0);
  });

  it(`${SHOULD_HANDLE_WEATHER_CONDITIONS}`, () => {
    const timestamp = Math.floor(new Date(DATES.DAY1).getTime() / 1000);

    const mockResponse = baseResponse([
      forecastItem(
        timestamp,
        TEMPERATURES.LOW,
        WEATHER_CONDITIONS.RAIN.main,
        WEATHER_CONDITIONS.RAIN.description
      ),
      forecastItem(
        timestamp,
        TEMPERATURES.LOW,
        WEATHER_CONDITIONS.RAIN.main,
        WEATHER_CONDITIONS.RAIN.description
      ),
      forecastItem(
        timestamp,
        TEMPERATURES.LOW,
        WEATHER_CONDITIONS.CLEAR.main,
        WEATHER_CONDITIONS.CLEAR.description
      ),
      forecastItem(
        timestamp,
        TEMPERATURES.LOW,
        WEATHER_CONDITIONS.CLOUDS.main,
        WEATHER_CONDITIONS.CLOUDS.description
      ),
    ]);

    const result = transformWeatherData(mockResponse);

    expect(result.length).toBe(1);
    expect(result[0].rainy).toBe(PROBABILITIES.DOUBLE);
    expect(result[0].sunny).toBe(PROBABILITIES.SINGLE);
    expect(result[0].cloudy).toBe(PROBABILITIES.SINGLE);
    expect(result[0].foggy).toBe(0);
  });
});
