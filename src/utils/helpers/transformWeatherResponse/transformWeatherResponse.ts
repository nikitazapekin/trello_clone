import { INCLUDES_CONSTANTS } from "@constants/includesConstants";
import {
  FIRST_ELEMENT_INDEX,
  ISO_SPLIT_MARKER,
  TIMESTAMP_CONVERSION_FACTOR,
} from "@constants/numericalConstants";
import { days } from "@constants/time";
import type { FiveDayForecastResponse, ForecastItem } from "@types/apiTypes";
import type { WeatherDaySummary } from "@types/weatherDaySummaryTypes";

export function transformWeatherData(forecast: FiveDayForecastResponse): WeatherDaySummary[] {
  const forecastsByDay: Record<string, ForecastItem[]> = {};

  forecast.list.forEach((item) => {
    const date = new Date(item.dt * TIMESTAMP_CONVERSION_FACTOR);
    const dayKey = date.toISOString().split(ISO_SPLIT_MARKER)[FIRST_ELEMENT_INDEX];

    if (!forecastsByDay[dayKey]) {
      forecastsByDay[dayKey] = [];
    }

    forecastsByDay[dayKey].push(item);
  });

  const result: WeatherDaySummary[] = [];

  for (const dayKey in forecastsByDay) {
    const dayForecasts = forecastsByDay[dayKey];
    const date = new Date(dayForecasts[FIRST_ELEMENT_INDEX].dt * TIMESTAMP_CONVERSION_FACTOR);
    const dayOfWeek = days[date.getDay()];

    const avgTemp =
      dayForecasts.reduce((sum, item) => sum + item.main.temp, 0) / dayForecasts.length;

    let foggyCount = 0;
    let rainyCount = 0;
    let sunnyCount = 0;
    let cloudyCount = 0;

    dayForecasts.forEach((item) => {
      const weatherMain = item.weather[FIRST_ELEMENT_INDEX].main.toLowerCase();
      const weatherDesc = item.weather[FIRST_ELEMENT_INDEX].description.toLowerCase();

      if (
        weatherDesc.includes(INCLUDES_CONSTANTS.FOG_EN) ||
        weatherDesc.includes(INCLUDES_CONSTANTS.FOG_RU)
      ) {
        foggyCount++;
      }

      if (
        weatherMain === INCLUDES_CONSTANTS.RAINY_EN ||
        weatherDesc.includes(INCLUDES_CONSTANTS.RAINY_EN) ||
        weatherDesc.includes(INCLUDES_CONSTANTS.RAINY_RU)
      ) {
        rainyCount++;
      }

      if (
        weatherMain === INCLUDES_CONSTANTS.SUNNY_EN ||
        weatherDesc.includes(INCLUDES_CONSTANTS.SUNNY_EN) ||
        weatherDesc.includes(INCLUDES_CONSTANTS.SUNNY_RU)
      ) {
        sunnyCount++;
      }

      if (
        weatherMain === INCLUDES_CONSTANTS.CLOUDS_EN ||
        weatherDesc.includes(INCLUDES_CONSTANTS.CLOUDY_EN) ||
        weatherDesc.includes(INCLUDES_CONSTANTS.CLOUDY_RU)
      ) {
        cloudyCount++;
      }
    });

    const total = dayForecasts.length;
    const foggy = foggyCount / total;
    const rainy = rainyCount / total;
    const sunny = sunnyCount / total;
    const cloudy = cloudyCount / total;

    result.push({
      dt: Math.round(avgTemp),
      day: dayOfWeek,
      foggy,
      rainy,
      sunny,
      cloudy,
      dt_txt: dayForecasts[FIRST_ELEMENT_INDEX].dt_txt,
    });
  }

  return result;
}
