import type { WeatherCacheKey } from "@types/cachedResponse";

export function isWeatherCacheKey(key: string): key is WeatherCacheKey {
  return key.startsWith("weather_cache_");
}
