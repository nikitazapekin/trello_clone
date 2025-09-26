import { WeatherConditions } from "@constants/conditions";
import type { conditionType, WeatherData } from "@types/conditionTypes";

export function getWeatherCondition(weatherElement: WeatherData): {
  condition: conditionType;
  description: string;
} {
  if (
    WeatherConditions.WEATHER_FOGGY in weatherElement &&
    typeof weatherElement.foggy === "number"
  ) {
    const { foggy, rainy, sunny, cloudy } = weatherElement;
    const maxValue = Math.max(foggy, rainy, sunny, cloudy);

    if (maxValue === foggy)
      return {
        condition: WeatherConditions.FOGGY,
        description: WeatherConditions.DESCRIPTION_FOGGY,
      };

    if (maxValue === rainy)
      return {
        condition: WeatherConditions.RAINY,
        description: WeatherConditions.DESCRIPTION_RAINY,
      };

    if (maxValue === sunny)
      return {
        condition: WeatherConditions.SUNNY,
        description: WeatherConditions.DESCRIPTION_SUNNY,
      };

    if (maxValue === cloudy)
      return {
        condition: WeatherConditions.CLOUDY,
        description: WeatherConditions.DESCRIPTION_CLOUDY,
      };

    return { condition: WeatherConditions.SUNNY, description: WeatherConditions.DESCRIPTION_SUNNY };
  }

  if ("weather" in weatherElement && Array.isArray(weatherElement.weather)) {
    const weatherDescription = weatherElement.weather[0];
    const mainCondition = weatherDescription?.main.toLowerCase() || "";
    const description = weatherDescription?.description || "";

    if (
      mainCondition.includes(WeatherConditions.WEATHER_FOG) ||
      mainCondition.includes(WeatherConditions.WEATHER_MIST)
    ) {
      return { condition: WeatherConditions.FOGGY, description };
    }

    if (
      mainCondition.includes(WeatherConditions.WEATHER_RAIN) ||
      mainCondition.includes(WeatherConditions.WEATHER_DRIZZLE) ||
      mainCondition.includes(WeatherConditions.WEATHER_SHOWER)
    ) {
      return { condition: WeatherConditions.RAINY, description };
    }

    if (
      mainCondition.includes(WeatherConditions.WEATHER_CLEAR) ||
      mainCondition.includes(WeatherConditions.WEATHER_SUN)
    ) {
      return { condition: WeatherConditions.SUNNY, description };
    }

    if (
      mainCondition.includes(WeatherConditions.WEATHER_CLOUD) ||
      mainCondition.includes(WeatherConditions.WEATHER_OVERCAST)
    ) {
      return { condition: WeatherConditions.CLOUDY, description };
    }

    if (
      mainCondition.includes(WeatherConditions.WEATHER_SNOW) ||
      mainCondition.includes(WeatherConditions.WEATHER_FLURRY)
    ) {
      return { condition: WeatherConditions.RAINY, description };
    }

    if (
      mainCondition.includes(WeatherConditions.WEATHER_THUNDER) ||
      mainCondition.includes(WeatherConditions.WEATHER_STORM)
    ) {
      return { condition: WeatherConditions.RAINY, description };
    }

    return {
      condition: WeatherConditions.SUNNY,
      description: description || WeatherConditions.DESCRIPTION_CLEAR,
    };
  }

  return { condition: WeatherConditions.SUNNY, description: WeatherConditions.DESCRIPTION_CLEAR };
}
