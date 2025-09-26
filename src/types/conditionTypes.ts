import type { CurrentWeatherResponse, DailyForecastItem, ForecastItem } from "./apiTypes";
import type { WeatherDaySummary } from "./weatherDaySummaryTypes";

export type conditionType = "foggy" | "sunny" | "rainy" | "cloudy";
export type WeatherData =
  | WeatherDaySummary
  | CurrentWeatherResponse
  | ForecastItem
  | DailyForecastItem;
